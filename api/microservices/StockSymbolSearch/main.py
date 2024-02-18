import functions_framework
import os
import logging
import requests
from flask import jsonify
from urllib.parse import urlencode, quote
from dotenv import load_dotenv

logging.basicConfig(level=logging.INFO)
load_dotenv()
ALPHAVANTAGE_API_KEY = os.environ.get('ALPHAVANTAGE_API_KEY')


@functions_framework.http
def stock_symbol_search(request):
    """
    Search for stock symbols.

    Args:
        request: The request object containing the query parameter.

    Returns:
        A JSON response containing the search results.

    Example Request: GET /stocksymbolsearch?query=Microsoft
    """
    logging.info('Processing stock symbol search request.')

    query = quote(request.args.get('query', '').strip())
    if not query:
        logging.error('No query provided.')
        return (
            jsonify({'error': 'Please pass a query on the query string.'}),
            400,
        )

    try:
        results = _fetch_data(query)
        return jsonify({'query': query, 'results': results})
    except requests.RequestException as e:
        logging.error(f'Error fetching data from Alpha Vantage: {e}')
        return (
            jsonify({'error': 'Failed to fetch data, try again later.'}),
            500,
        )


def _fetch_data(query) -> list:
    base_url = 'https://www.alphavantage.co/query'
    params = {
        'function': 'SYMBOL_SEARCH',
        'keywords': query,
        'apikey': ALPHAVANTAGE_API_KEY,
    }
    url = f'{base_url}?{urlencode(params)}'
    with requests.get(url, timeout=10) as response:
        response.raise_for_status()
        data = response.json()
        results = data.get('bestMatches', [])
    return results
