from fastapi import APIRouter
from datetime import datetime

router = APIRouter(
    tags=["health"],
    responses={404: {"description": "Not found"}},
)

@router.get("/")
async def root():
    """Endpoint raiz da API"""
    return {
        "message": "Email Classification API",
        "status": "active",
        "timestamp": datetime.now().isoformat()
    }

@router.get("/health")
async def health_check():
    """Endpoint de verificação de saúde da API"""
    return {
        "status": "healthy",
        "services": {
            "email_processor": "active",
            "ai_classifier": "active",
            "file_handler": "active"
        },
        "timestamp": datetime.now().isoformat()
    }