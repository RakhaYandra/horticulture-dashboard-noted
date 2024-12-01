from pymongo import MongoClient
from config import get_settings


def get_client():
    settings = get_settings()
    return MongoClient(settings.mongodb_url)
