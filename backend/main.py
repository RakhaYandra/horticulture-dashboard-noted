from datetime import datetime

import pytz
from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from starlette.status import HTTP_403_FORBIDDEN

from auth.basic import validate_api_key
from database import mongo
from external.serpapi import google_search
from external.vllm import get_stream_analysis

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)


class DataRequestModel(BaseModel):
    komoditas: int


@app.post("/existing")
def get_existing_data(request: DataRequestModel, auth: str = Depends(validate_api_key)):
    if not auth:
        raise HTTPException(
            status_code=HTTP_403_FORBIDDEN, detail="Could not validate API key"
        )

    mongo_client = mongo.get_client()
    collection = mongo_client["prod"]["horticulture_national_existing"]
    raw_data = list(collection.find({"komoditas": request.komoditas}))

    # Convert ObjectId and other non-serializable types to strings if necessary
    filtered_data = [
        {
            "tahun": item["tahun"].year,
            "produksi": item["produksi"],
            "produktivitas": item["produktivitas"],
            "tanaman_menghasilkan": item["tanaman_menghasilkan"],
        }
        for item in raw_data
        if not (
            item.get("produksi") == 0
            and item.get("produktivitas") == 0
            and item.get("tanaman_menghasilkan") == 0
        )
    ]

    return filtered_data


@app.post("/forecast")
def get_forecast_data(request: DataRequestModel, auth: str = Depends(validate_api_key)):
    if not auth:
        raise HTTPException(
            status_code=HTTP_403_FORBIDDEN, detail="Could not validate API key"
        )

    mongo_client = mongo.get_client()
    collection = mongo_client["prod"]["horticulture_national_forecast"]
    raw_data = list(collection.find({"item_id": request.komoditas}))

    # Convert ObjectId and other non-serializable types to strings if necessary
    filtered_data = [
        {
            "tahun": item["timestamp"].year,
            "produksi": item["mean"],
        }
        for item in raw_data
    ]

    return filtered_data


@app.get("/news")
def get_news(auth: str = Depends(validate_api_key)):
    if not auth:
        raise HTTPException(
            status_code=HTTP_403_FORBIDDEN, detail="Could not validate API key"
        )

    search = google_search(date=datetime.now(pytz.timezone("Asia/Jakarta")))

    return search


@app.get("/llm-analysis")
def get_llm_analysis(auth: str = Depends(validate_api_key)):
    if not auth:
        raise HTTPException(
            status_code=HTTP_403_FORBIDDEN, detail="Could not validate API key"
        )

    news = get_news()
    # news = ["test", "test"]

    system_message = {
        "role": "system",
        "content": """Summarize the title of the news in Bahasa Indonesia, and give a qualitative
forecast about Indonesia's agriculture for the future. Only answer in Bahasa Indonesia. Do not use your own knowledge.""",
    }

    user_message = {
        "role": "user",
        "content": "\n".join([n.get("title", "") for n in news]),
    }

    messages = [system_message, user_message]

    return StreamingResponse(
        get_stream_analysis(messages), media_type="text/event-stream"
    )


# get_existing_data()
