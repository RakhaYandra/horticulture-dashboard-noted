
from fastapi import Security
from fastapi.security import APIKeyHeader

from config import get_settings

api_key_header = APIKeyHeader(name="Authorization")

def validate_api_key(api_key_header: str = Security(api_key_header)):
    settings = get_settings()
    return api_key_header == settings.auth_api_key