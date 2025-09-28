from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uvicorn
import logging

from services.email_processor import EmailProcessor
from services.ai_classifier import AIClassifier
from utils.file_handler import FileHandler
from config.settings import get_settings

from routes import classification, health

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

settings = get_settings()
email_processor = EmailProcessor()
ai_classifier = AIClassifier()
file_handler = FileHandler()

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Inicializando serviços...")
    await ai_classifier.initialize()
    logger.info("API pronta para uso!")
    yield
    logger.info("Finalizando serviços...")
    if ai_classifier.client:
        await ai_classifier.client.aclose()

app = FastAPI(
    title="Email Classification API",
    description="API para classificação automática de emails e geração de respostas",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(classification.router)

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=True,
        log_level=settings.LOG_LEVEL
    )