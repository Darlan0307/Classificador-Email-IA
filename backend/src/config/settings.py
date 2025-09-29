from pydantic_settings import BaseSettings
from pydantic import Field
import os

class Settings(BaseSettings):
   
    HOST: str = Field(default="0.0.0.0", description="Host do servidor")
    PORT: int = Field(default=8000, description="Porta do servidor")
    LOG_LEVEL: str = Field(default="info", description="Nível de log")
    FRONTEND_URL: str = Field(default="http://localhost:8080", description="URL do frontend para CORS")
    
    OPENAI_BASE_URL: str = Field(default="https://api.openai.com/v1", description="URL base da API OpenAI")
    OPENAI_API_KEY: str = Field(..., description="Chave da API OpenAI")
    OPENAI_MODEL: str = Field(default="gpt-3.5-turbo", description="Modelo da API OpenAI")

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True

_settings = None

def get_settings() -> Settings:
    global _settings
    if _settings is None:
        _settings = Settings()
    return _settings

def create_example_env_file():
    env_example = """# Configurações da API OpenAI
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_API_KEY=sua_chave_openai_aqui
OPENAI_MODEL=gpt-3.5-turbo

# Configurações do servidor
HOST=0.0.0.0
PORT=8000

# Configurações de logging
LOG_LEVEL=info

# Configurações do frontend
FRONTEND_URL=http://localhost:8080
"""
    
    if not os.path.exists('.env'):
        with open('.env.example', 'w') as f:
            f.write(env_example)
        print("Arquivo .env.example criado. Copie para .env e configure suas chaves.")

if __name__ == "__main__":
    create_example_env_file()