from datetime import datetime
from functools import lru_cache
import serpapi

from config import get_settings


@lru_cache(maxsize=50)
def cached_google_search(current_date):
    settings = get_settings()
    params = {
        "api_key": settings.serpapi_api_key,
        "engine": "google",
        "google_domain": "google.co.id",
        "q": "pangan agrikultur hortikultur",
        "tbm": "nws",
        "hl": "id",
        "gl": "id",
        "location": "Indonesia",
    }

    search = serpapi.search(params)
    news_results = search.as_dict()["news_results"]
    
    for result in news_results:
        result["search_date"] = current_date

    return news_results


def google_search(date):
    # Convert the date to string (could use different formats depending on your needs)
    date_str = date.strftime("%Y-%m-%d") if isinstance(date, datetime) else str(date)

    # Call the cached version of the function
    return cached_google_search(date_str)
