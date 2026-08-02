from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # App
    app_name: str = "Traverse API"
    environment: str = "local"

    # Database
    database_url: str = "postgresql://wayfare:wayfare@localhost:5432/wayfare"

    # Redis
    redis_url: str = "redis://localhost:6379/0"

    # Groq (OpenAI-compatible)
    groq_api_key: str = ""
    groq_base_url: str = "https://api.groq.com/openai/v1"
    groq_model: str = "llama-3.1-8b-instant"

    # Pexels
    pexels_api_key: str = ""
    
    # Auth
    jwt_secret_key: str = ""
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 60 * 24 * 7  # 7 days

    cors_origins: str = "http://localhost:5173"

settings = Settings()