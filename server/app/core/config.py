from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    """
    Loads environment variables from the .env file.
    Pydantic ensures that the required variables exist and are the correct type.
    """
    SECRET_KEY: str
    DATABASE_URL: str

    model_config = SettingsConfigDict(env_file=".env")

# Create a single, globally accessible instance of the settings.
settings = Settings()