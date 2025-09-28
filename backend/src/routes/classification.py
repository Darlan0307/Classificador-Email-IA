from fastapi import APIRouter, File, UploadFile, Form, HTTPException, Depends
from typing import Optional
from datetime import datetime
import logging

from services.email_processor import EmailProcessor
from services.ai_classifier import AIClassifier
from models.email_models import EmailClassificationResponse
from utils.file_handler import FileHandler

logger = logging.getLogger(__name__)

router = APIRouter(
    tags=["classification"],
    responses={404: {"description": "Not found"}},
)

def get_email_processor():
    return EmailProcessor()

def get_ai_classifier():
    from src.main import ai_classifier
    return ai_classifier

def get_file_handler():
    return FileHandler()

@router.post("/classify-email", response_model=EmailClassificationResponse)
async def classify_email_text(
    email_content: str = Form(..., description="Conteúdo do email em texto"),
    sender_name: Optional[str] = Form(None, description="Nome do remetente"),
    subject: Optional[str] = Form(None, description="Assunto do email"),
    email_processor: EmailProcessor = Depends(get_email_processor),
    ai_classifier: AIClassifier = Depends(get_ai_classifier),
):
    """Classifica um email enviado como texto direto"""
    try:
        processed_content = email_processor.preprocess_text(email_content)
        
        email_data = {
            "content": processed_content,
            "original_content": email_content,
            "sender_name": sender_name,
            "subject": subject,
            "timestamp": datetime.now().isoformat()
        }
        
        classification_result = await ai_classifier.classify_email(email_data)
        
        suggested_response = await ai_classifier.generate_response(
            email_data, classification_result["category"]
        )
        
        logger.info(f"Email classificado como: {classification_result['category']}")
        
        return EmailClassificationResponse(
            category=classification_result["category"],
            confidence_score=classification_result["confidence"],
            suggested_response=suggested_response,
            processing_time=classification_result["processing_time"],
            metadata={
                "sender": sender_name,
                "subject": subject,
                "timestamp": email_data["timestamp"]
            }
        )
        
    except Exception as e:
        logger.error(f"Erro na classificação: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erro interno: {str(e)}")

@router.post("/classify-email-file", response_model=EmailClassificationResponse)
async def classify_email_file(
    file: UploadFile = File(..., description="Arquivo de email (.txt ou .pdf)"),
    sender_name: Optional[str] = Form(None, description="Nome do remetente"),
    subject: Optional[str] = Form(None, description="Assunto do email"),
    email_processor: EmailProcessor = Depends(get_email_processor),
    ai_classifier: AIClassifier = Depends(get_ai_classifier),
    file_handler: FileHandler = Depends(get_file_handler)
):
    """Classifica um email enviado como arquivo"""
    try:
        if not file_handler.is_valid_file_type(file.filename):
            raise HTTPException(
                status_code=400, 
                detail="Tipo de arquivo não suportado. Use apenas .txt ou .pdf"
            )
        
        file_content = await file_handler.extract_content(file)
        
        processed_content = email_processor.preprocess_text(file_content)
        
        email_data = {
            "content": processed_content,
            "original_content": file_content,
            "sender_name": sender_name,
            "subject": subject,
            "filename": file.filename,
            "timestamp": datetime.now().isoformat()
        }
        
        classification_result = await ai_classifier.classify_email(email_data)
        suggested_response = await ai_classifier.generate_response(
            email_data, classification_result["category"]
        )
        
        logger.info(f"Arquivo {file.filename} classificado como: {classification_result['category']}")
        
        return EmailClassificationResponse(
            category=classification_result["category"],
            confidence_score=classification_result["confidence"],
            suggested_response=suggested_response,
            processing_time=classification_result["processing_time"],
            metadata={
                "sender": sender_name,
                "subject": subject,
                "filename": file.filename,
                "timestamp": email_data["timestamp"]
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erro no processamento do arquivo: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erro interno: {str(e)}")