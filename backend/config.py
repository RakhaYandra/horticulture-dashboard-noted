from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    auth_api_key: str
    mongodb_url: str
    serpapi_api_key: str
    vllm_api_key: str
    vllm_api_base: str
    vllm_model_name: str

    model_config = SettingsConfigDict(env_file=".env")


@lru_cache
def get_settings():
    return Settings()
