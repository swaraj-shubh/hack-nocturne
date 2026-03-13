from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int
    
     # --- WebAuthn (Passwordless Auth) Settings ---
    RP_ID: str = "localhost"  # Relying Party ID (domain or localhost)
    RP_NAME: str = "CodeOfHonour"  # Display name for your app
    FRONTEND_ORIGIN: str = "https://localhost:5173"  # Frontend app origin


    model_config = SettingsConfigDict(
    env_file=".env"
    )

Config = Settings()