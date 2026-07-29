from openai import OpenAI

from app.core.config import settings

client = OpenAI(api_key=settings.groq_api_key, base_url=settings.groq_base_url)


def generate_test_response(prompt: str) -> str:
    response = client.chat.completions.create(
        model=settings.groq_model,
        messages=[{"role": "user", "content": prompt}],
    )
    return response.choices[0].message.content