from pydantic import BaseModel, Field, validator
from typing import Optional, Dict, Any
from enum import Enum

class EmailCategory(str, Enum):
    PRODUTIVO = "produtivo"
    IMPRODUTIVO = "improdutivo"

class EmailClassificationResponse(BaseModel):
    category: EmailCategory = Field(..., description="Categoria atribuída ao email")
    confidence_score: float = Field(..., description="Pontuação de confiança da classificação", ge=0, le=1)
    suggested_response: str = Field(..., description="Resposta automática sugerida")
    processing_time: float = Field(..., description="Tempo de processamento em segundos")
    metadata: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Metadados da classificação")
    
    @validator('confidence_score')
    def validate_confidence_score(cls, v):
        if not 0 <= v <= 1:
            raise ValueError('A pontuação de confiança deve estar entre 0 e 1')
        return round(v, 3)
    
    @validator('processing_time')
    def validate_processing_time(cls, v):
        if v < 0:
            raise ValueError('O tempo de processamento não pode ser negativo')
        return round(v, 3)
    
    class Config:
        json_schema_extra = {
            "example": {
                "category": "produtivo",
                "confidence_score": 0.892,
                "suggested_response": "Olá João, recebemos sua solicitação sobre o problema no sistema de vendas. Nossa equipe técnica já foi notificada e entrará em contato em até 2 horas úteis.",
                "processing_time": 1.234,
                "metadata": {
                    "sender": "João Silva",
                    "subject": "Problema no sistema de vendas",
                    "timestamp": "2024-01-15T14:30:00",
                    "keywords": ["sistema", "vendas", "erro", "problema"]
                }
            }
        }