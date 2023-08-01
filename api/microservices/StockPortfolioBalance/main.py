import functions_framework
from datetime import datetime
import logging
import os
import requests
from typing import Dict, Any
from concurrent.futures import ThreadPoolExecutor

from flask import jsonify
import pandas as pd
from pypfopt.expected_returns import mean_historical_return
from pypfopt.risk_models import CovarianceShrinkage
from pypfopt.efficient_frontier import EfficientFrontier
from pypfopt import objective_functions

logger = logging.getLogger()
logger.setLevel(logging.INFO)

API_KEY = os.environ.get("ALPHAVANTAGE_API_KEY")
logging.info("ALPHAVANTAGE_API_KEY: %s", API_KEY)


@functions_framework.http
def getPortfolioCalculation(request):
    """HTTP Cloud Function.
    Args:
        request (flask.Request): The request object.
        curl "http://localhost:8080/?symbols=MSFT,GOOG,AMZN"
    Returns:
        The response text, or any set of values that can be turned into a
        Response object using `make_response`
        <https://flask.palletsprojects.com/en/1.1.x/api/#flask.make_response>.
    """
    logging.info("getPortfolioCalculation function processed a request")

    symbols_str = request.args.get("symbols")
    if not symbols_str:
        raise badInputError

    symbols = symbols_str.split(",")
    if len(symbols) < 2:
        raise badInputError

    stock_dict = {}
    for symbol in symbols:
        stock_data = getStockTickerData(symbol)
        if stock_data is False:
            logging.error(f"Error fetching data for symbol {symbol}")
            raise upStreamApiError
        else:
            stock_dict[symbol] = stock_data

    # Create a DataFrame by extracting closing prices for each symbol
    df_list = [
        extractClosingPrices(stock_dict[symbol], symbol) for symbol in symbols
    ]

    # Merge individual DataFrames into a single DataFrame with rows as dates and columns as symbols
    stock_df = pd.concat(df_list, axis=1)
    stock_df.index.name = "date"  # Optional: Set the index name

    portfolio_object = calculatePortfolioWeightsAsync(stock_df)

    return jsonify(portfolio_object)  # Placeholder response for now


def getStockTickerData(symbol: str) -> Dict[str, Any]:
    base_url = "https://www.alphavantage.co/query"

    params = {
        "function": "TIME_SERIES_DAILY",
        "symbol": symbol,
        "apikey": API_KEY,
    }

    response = requests.get(base_url, params=params)
    logging.info("Alphavantage Api response code: %s", response.status_code)

    # TODO: Handle other status codes
    if (
        response.status_code == 200
        and response.json().get("Error Message") is None
    ):
        return response.json()
    else:
        logging.error("Alphavantage Api response error: %s", response.json())
        return False


def calculatePortfolioWeights(stock_df: pd.DataFrame) -> Dict[str, Dict]:
    mean_hist_return = mean_historical_return(stock_df)
    estimated_covar_matrix = CovarianceShrinkage(stock_df).ledoit_wolf()
    efficient_frontier = EfficientFrontier(
        mean_hist_return, estimated_covar_matrix
    )

    # Here we inject a L2 Regularisation so not so many stocks are returned
    # with 0% distribution
    # TODO: Adjust accordingly
    efficient_frontier.add_objective(objective_functions.L2_reg, gamma=0.1)
    weights = efficient_frontier.max_sharpe()
    clean_weights = efficient_frontier.clean_weights()

    logging.info("clean_weights: %s", clean_weights)

    return {
        "weights": clean_weights,
        "expected_performance": "not implemented yet",
    }


def calculatePortfolioWeightsAsync(
    stock_df: pd.DataFrame,
) -> Dict[str, Dict]:
    # Use ThreadPoolExecutor to parallelize the calculation
    with ThreadPoolExecutor() as executor:
        # Submit the calculation to the thread pool
        future = executor.submit(calculatePortfolioWeights, stock_df)
        return future.result()


def extractClosingPrices(data: dict, symbol: str) -> pd.DataFrame:
    time_series = data.get("Time Series (Daily)", {})
    df = pd.DataFrame(
        time_series
    ).T  # Transpose DataFrame to have dates as index
    df.index = pd.to_datetime(df.index)  # Convert index to datetime format
    df["close"] = df["4. close"].astype(
        float
    )  # Convert 'close' column to float
    df = df[["close"]]  # Keep only the 'close' column
    df.columns = [symbol]  # Rename the column to the symbol name
    return df


def validateDateFormat(date_str: str) -> bool:
    try:
        datetime.strptime(date_str, "%Y-%m-%d")
        return True
    except ValueError:
        return False


class badInputError(Exception):
    pass


class upStreamApiError(Exception):
    pass


@functions_framework.errorhandler(badInputError)
def handleInputError(e):
    logging.exception(
        "getPortfolioCalculation function recieved wrong request format"
    )
    return (
        jsonify(
            isError=True,
            data={"message": "Error: Please provide the right request format"},
            statusCode=400,
        ),
        400,
    )


@functions_framework.errorhandler(upStreamApiError)
def handleUpStreamApiError(e):
    logging.exception(
        "getPortfolioCalculation function encountered an error while calling upstream api"
    )
    return (
        jsonify(
            isError=True,
            data={
                "message": "Error: encountered an error while calling upstream api, try again later"
            },
            statusCode=500,
        ),
        500,
    )
