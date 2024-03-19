import functions_framework
import logging
import os
import requests
import pandas as pd
from flask import jsonify
from dotenv import load_dotenv
from typing import List, Dict, Any
from concurrent.futures import ThreadPoolExecutor
from pypfopt.expected_returns import mean_historical_return
from pypfopt.risk_models import CovarianceShrinkage
from pypfopt.efficient_frontier import EfficientFrontier
from pypfopt import objective_functions

# Setup logging and environment
logging.basicConfig(level=logging.INFO)
load_dotenv()
API_KEY = os.environ.get('ALPHAVANTAGE_API_KEY')


class InputError(Exception):
    """Exception raised for errors in the input."""

    pass


class UpstreamApiError(Exception):
    """Exception raised for errors in the upstream API call."""

    pass


@functions_framework.http
def get_portfolio_calculation(request):
    """
    Calculate MPT of a stock portfolio.

    Args:
        request: The request object containing the symbols parameter.

    Returns:
        A JSON response containing the calculated portfolio object.
    """
    symbols_str = request.args.get('symbols')
    if not symbols_str or ',' not in symbols_str:
        raise InputError(
            'Please provide at least two symbols separated by commas.'
        )

    symbols = symbols_str.split(',')
    stock_data = fetch_stock_data(symbols)
    stock_df = merge_stock_dataframes(stock_data)
    portfolio_object = calculate_portfolio_weights_async(stock_df)
    return jsonify(portfolio_object)


def fetch_stock_data(symbols: List[str]) -> Dict[str, pd.DataFrame]:
    """Fetch and return stock data for given symbols."""
    stock_dict = {}
    with ThreadPoolExecutor(max_workers=5) as executor:
        future_to_symbol = {
            executor.submit(get_stock_ticker_data, symbol): symbol
            for symbol in symbols
        }
        for future in future_to_symbol:
            symbol = future_to_symbol[future]
            try:
                data = future.result()
                stock_dict[symbol] = extract_closing_prices(data, symbol)
            except Exception as exc:
                logging.error(f'{symbol} generated an exception: {exc}')
                raise UpstreamApiError(f'Failed to fetch data for {symbol}')
    return stock_dict


def get_stock_ticker_data(symbol: str) -> dict:
    """Fetch stock ticker data from Alpha Vantage."""
    base_url = 'https://www.alphavantage.co/query'
    params = {
        'function': 'TIME_SERIES_DAILY',
        'symbol': symbol,
        'apikey': API_KEY,
    }
    response = requests.get(base_url, params=params, timeout=10)
    if response.status_code != 200 or 'Error Message' in response.json():
        raise UpstreamApiError(f'Error fetching data for {symbol}')
    return response.json()


def extract_closing_prices(data: dict, symbol: str) -> pd.DataFrame:
    """Extract closing prices from the stock data."""
    time_series = data.get('Time Series (Daily)', {})
    df = (
        pd.DataFrame(time_series)
        .T.rename(columns={'4. close': 'close'})
        .astype(float)
    )
    df.index = pd.to_datetime(df.index)
    return df[['close']].rename(columns={'close': symbol})


def merge_stock_dataframes(
    stock_dict: Dict[str, pd.DataFrame]
) -> pd.DataFrame:
    """Merge individual stock DataFrames into a single DataFrame."""
    return pd.concat(stock_dict.values(), axis=1, keys=stock_dict.keys())


def calculate_portfolio_weights(stock_df: pd.DataFrame) -> Dict[str, Any]:
    """Calculate and return portfolio weights."""
    mean_hist_return = mean_historical_return(stock_df.sort_index())
    estimated_covar_matrix = CovarianceShrinkage(stock_df).ledoit_wolf()
    efficient_frontier = EfficientFrontier(
        mean_hist_return,
        estimated_covar_matrix,
    )

    # Add L2 regularization to the optimization
    efficient_frontier.add_objective(objective_functions.L2_reg, gamma=0.1)

    # Calculate the optimal portfolio
    efficient_frontier.max_sharpe()
    clean_weights = efficient_frontier.clean_weights()

    clean_weights_serializable = {str(k): v for k, v in clean_weights.items()}

    return {
        'weights': clean_weights_serializable,
        'expected_performance': 'Not implemented yet',
    }


def calculate_portfolio_weights_async(
    stock_df: pd.DataFrame,
) -> Dict[str, Any]:
    """Asynchronously calculate portfolio weights."""
    with ThreadPoolExecutor() as executor:
        future = executor.submit(calculate_portfolio_weights, stock_df)
        return future.result()


@functions_framework.errorhandler(InputError)
def handle_input_error(error):
    logging.exception('Input validation failed.')
    return jsonify(isError=True, message=str(error), statusCode=400), 400


@functions_framework.errorhandler(UpstreamApiError)
def handle_upstream_api_error(error):
    logging.exception('Upstream API call failed.')
    return jsonify(isError=True, message=str(error), statusCode=500), 500
