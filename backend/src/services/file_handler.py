import os
import tempfile
from typing import Optional
from fastapi import UploadFile, HTTPException
import PyPDF2
import logging

logger = logging.getLogger(__name__)

class FileHandler:
    
    def __init__(self):
        self.supported_extensions = {'.txt', '.pdf'}
        self.max_file_size = 50 * 1024 * 1024
    
    def is_valid_file_type(self, filename: Optional[str]) -> bool:
        if not filename:
            return False
        
        file_extension = os.path.splitext(filename)[1].lower()
        return file_extension in self.supported_extensions
    
    async def extract_content(self, file: UploadFile) -> str:
        if not self.is_valid_file_type(file.filename):
            raise HTTPException(
                status_code=400, 
                detail=f"Tipo de arquivo não suportado: {file.filename}"
            )
        
        file_content = await file.read()
        if len(file_content) > self.max_file_size:
            raise HTTPException(
                status_code=400, 
                detail="Arquivo muito grande. Máximo permitido: 50MB"
            )
        
        file_extension = os.path.splitext(file.filename)[1].lower()
        
        try:
            if file_extension == '.txt':
                return await self._extract_text_content(file_content)
            elif file_extension == '.pdf':
                return await self._extract_pdf_content(file_content)
            else:
                raise HTTPException(
                    status_code=400,
                    detail=f"Tipo de arquivo não suportado: {file_extension}"
                )
                
        except Exception as e:
            logger.error(f"Erro na extração de conteúdo de {file.filename}: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail=f"Erro ao processar arquivo: {str(e)}"
            )
    
    async def _extract_text_content(self, file_content: bytes) -> str:
        try:
            encodings = ['utf-8', 'latin-1', 'cp1252', 'iso-8859-1']
            
            for encoding in encodings:
                try:
                    text_content = file_content.decode(encoding)
                    
                    if len(text_content.strip()) == 0:
                        raise ValueError("Arquivo vazio ou sem conteúdo legível")
                    
                    return text_content
                    
                except UnicodeDecodeError:
                    continue
            
            raise ValueError("Não foi possível decodificar o arquivo de texto")
            
        except Exception as e:
            raise ValueError(f"Erro ao extrair conteúdo do arquivo de texto: {str(e)}")
    
    async def _extract_pdf_content(self, file_content: bytes) -> str:
        try:
            with tempfile.NamedTemporaryFile(suffix='.pdf', delete=False) as temp_file:
                temp_file.write(file_content)
                temp_file_path = temp_file.name
            
            try:
                text_content = ""
                
                with open(temp_file_path, 'rb') as pdf_file:
                    pdf_reader = PyPDF2.PdfReader(pdf_file)
                    
                    if len(pdf_reader.pages) == 0:
                        raise ValueError("PDF não contém páginas")
                    
                    for page_num, page in enumerate(pdf_reader.pages):
                        try:
                            page_text = page.extract_text()
                            if page_text:
                                text_content += page_text + "\n"
                        except Exception as e:
                            logger.warning(f"Erro ao extrair texto da página {page_num}: {e}")
                            continue
                
                os.unlink(temp_file_path)
                
                if not text_content or len(text_content.strip()) < 10:
                    raise ValueError("PDF não contém texto legível ou conteúdo insuficiente")
                
                return text_content
                
            except Exception as e:
                if os.path.exists(temp_file_path):
                    os.unlink(temp_file_path)
                raise e
                
        except Exception as e:
            raise ValueError(f"Erro ao extrair conteúdo do PDF: {str(e)}")