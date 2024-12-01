from openai import OpenAI
from config import get_settings


def get_stream_analysis(messages):
    # print("here")
    settings = get_settings()
    llm_client = OpenAI(
        api_key=settings.vllm_api_key,
        base_url=settings.vllm_api_base,
        timeout=60,
    )

    chat_response = llm_client.chat.completions.create(
        model=settings.vllm_model_name,
        messages=messages,
        extra_body={"repetition_penalty": 1.05},
        stream=True,
        max_completion_tokens=1024
    )


    for chunk in chat_response:
        current_content = chunk.choices[0].delta.content
        # print(current_content)
        yield current_content
