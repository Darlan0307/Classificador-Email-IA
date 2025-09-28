
import time
import json
import logging
from typing import Dict, Any
import httpx
from config.settings import get_settings
from services.email_processor import EmailProcessor

logger = logging.getLogger(__name__)

class AIClassifier:    
    def __init__(self):
        self.settings = get_settings()
        self.email_processor = EmailProcessor()
        self.client = None
        
    async def initialize(self):
        self.client = httpx.AsyncClient(timeout=30.0)
        logger.info(f"AI Classifier inicializado com OpenAI GPT-3.5-turbo")
        
    async def classify_email(self, email_data: Dict[str, Any]) -> Dict[str, Any]:
        start_time = time.time()
        
        try:
            analysis = self.email_processor.analyze_email_structure(
                email_data.get('original_content', '')
            )
            
            classification_prompt = self._build_classification_prompt(
                email_data, analysis
            )
            
            classification_result = await self._call_openai_classification(
                classification_prompt
            )
            
            category, confidence = self._process_classification_response(
                classification_result, analysis
            )
            
            processing_time = time.time() - start_time
            
            return {
                "category": category,
                "confidence": confidence,
                "processing_time": processing_time,
                "analysis": analysis
            }
            
        except Exception as e:
            logger.error(f"Erro na classificação: {str(e)}")
            return await self._fallback_classification(email_data)
    
    def _build_classification_prompt(self, email_data: Dict[str, Any], analysis: Dict[str, Any]) -> str:
        content = email_data.get('original_content', '')
        sender = email_data.get('sender_name', 'Desconhecido')
        subject = email_data.get('subject', 'Sem assunto')
        
        prompt = f"""
Você é um assistente especializado em classificar emails corporativos do setor financeiro.

CONTEXTO:
- Remetente: {sender}
- Assunto: {subject}
- Conteúdo do email: "{content}"

ANÁLISE TÉCNICA:
- Palavras-chave: {', '.join(analysis.get('keywords', []))}
- Indicadores de urgência: {', '.join(analysis.get('urgency_indicators', []))}
- Indicadores de saudação: {', '.join(analysis.get('greeting_indicators', []))}
- Indicadores de solicitação: {', '.join(analysis.get('request_indicators', []))}
- Contém perguntas: {"Sim" if analysis.get('has_question_marks') else "Não"}

CATEGORIAS:
1. PRODUTIVO: Emails que requerem ação específica, resposta ou acompanhamento
   - Solicitações de suporte técnico
   - Dúvidas sobre sistemas ou processos
   - Pedidos de informação ou status
   - Relatórios de problemas
   - Questões operacionais

2. IMPRODUTIVO: Emails que não necessitam ação imediata
   - Mensagens de felicitação
   - Agradecimentos gerais
   - Mensagens sociais ou pessoais
   - Informações apenas para conhecimento
   - Comunicados gerais

INSTRUÇÕES:
1. Analise cuidadosamente o conteúdo
2. Considere o contexto corporativo financeiro
3. Responda APENAS com um JSON no formato:
{{"categoria": "produtivo|improdutivo", "confianca": 0.0-1.0, "justificativa": "explicação breve"}}

Sua resposta:"""
        
        return prompt
    
    async def _call_openai_classification(self, prompt: str) -> Dict[str, Any]:
        headers = {
            "Authorization": f"Bearer {self.settings.OPENAI_API_KEY}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": "gpt-3.5-turbo",
            "messages": [
                {"role": "system", "content": "Você é um especialista em classificação de emails corporativos. Responda sempre no formato JSON solicitado."},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.3,
            "max_tokens": 200
        }
        
        response = await self.client.post(
            "https://api.openai.com/v1/chat/completions",
            headers=headers,
            json=payload
        )
        
        if response.status_code != 200:
            raise Exception(f"OpenAI API error: {response.status_code} - {response.text}")
        
        return response.json()
    
    def _process_classification_response(self, openai_response: Dict[str, Any], analysis: Dict[str, Any]) -> tuple:
        try:
            content = openai_response['choices'][0]['message']['content'].strip()
            
            if content.startswith('```json'):
                content = content.replace('```json', '').replace('```', '').strip()
            
            result = json.loads(content)
            
            category = result.get('categoria', '').lower()
            confidence = float(result.get('confianca', 0.5))
            
            if category not in ['produtivo', 'improdutivo']:
                category = self._determine_fallback_category(analysis)
                confidence = 0.6
            
            confidence = self._adjust_confidence(confidence, analysis, category)
            
            return category, min(max(confidence, 0.0), 1.0)
            
        except (json.JSONDecodeError, KeyError, ValueError) as e:
            logger.warning(f"Erro ao processar resposta da OpenAI: {e}")
            return self._determine_fallback_category(analysis), 0.5
    
    def _adjust_confidence(self, base_confidence: float, analysis: Dict[str, Any], category: str) -> float:
        adjustment = 0.0
        
        if category == 'produtivo':
            if analysis.get('urgency_indicators'):
                adjustment += 0.1
            if analysis.get('request_indicators'):
                adjustment += 0.1
            if analysis.get('has_question_marks'):
                adjustment += 0.05
        
        elif category == 'improdutivo':
            if analysis.get('greeting_indicators'):
                adjustment += 0.1
            if not analysis.get('request_indicators') and not analysis.get('urgency_indicators'):
                adjustment += 0.05
        
        return base_confidence + adjustment
    
    async def generate_response(self, email_data: Dict[str, Any], category: str) -> str:
        try:
            content = email_data.get('original_content', '')
            sender = email_data.get('sender_name', 'Prezado(a)')
            subject = email_data.get('subject', '')
            
            response_prompt = self._build_response_prompt(content, sender, subject, category)
            
            openai_response = await self._call_openai_response(response_prompt)
            
            return self._process_response_generation(openai_response, category, sender)
            
        except Exception as e:
            logger.error(f"Erro na geração de resposta: {str(e)}")
            return self._get_fallback_response(category, sender)
    
    def _build_response_prompt(self, content: str, sender: str, subject: str, category: str) -> str:
        if category == 'produtivo':
            prompt = f"""
Você é um assistente de atendimento de uma empresa do setor financeiro. 
Gere uma resposta profissional e personalizada para este email PRODUTIVO.

EMAIL RECEBIDO:
- Remetente: {sender}
- Assunto: {subject}
- Conteúdo: "{content}"

DIRETRIZES PARA RESPOSTA PRODUTIVA:
- Seja profissional e empático
- Reconheça a solicitação específica
- Forneça próximos passos claros
- Inclua prazo estimado quando apropriado
- Use tom colaborativo e solutivo
- Máximo 150 palavras

Resposta:"""
        else:
            prompt = f"""
Você é um assistente de atendimento de uma empresa do setor financeiro.
Gere uma resposta educada e cordial para este email IMPRODUTIVO.

EMAIL RECEBIDO:
- Remetente: {sender}
- Assunto: {subject}
- Conteúdo: "{content}"

DIRETRIZES PARA RESPOSTA IMPRODUTIVA:
- Seja cordial e agradecido
- Reconheça a mensagem positivamente
- Mantenha tom caloroso mas profissional
- Seja breve mas não frio
- Máximo 80 palavras

Resposta:"""
        
        return prompt
    
    async def _call_openai_response(self, prompt: str) -> Dict[str, Any]:
        headers = {
            "Authorization": f"Bearer {self.settings.OPENAI_API_KEY}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": "gpt-3.5-turbo",
            "messages": [
                {"role": "system", "content": "Você é um assistente profissional de atendimento ao cliente do setor financeiro. Seja sempre cordial, claro e útil."},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.7,
            "max_tokens": 300
        }
        
        response = await self.client.post(
            "https://api.openai.com/v1/chat/completions",
            headers=headers,
            json=payload
        )
        
        if response.status_code != 200:
            raise Exception(f"OpenAI API error: {response.status_code}")
        
        return response.json()
    
    def _process_response_generation(self, openai_response: Dict[str, Any], category: str, sender: str) -> str:
        try:
            generated_response = openai_response['choices'][0]['message']['content'].strip()
            
            if generated_response.startswith('"') and generated_response.endswith('"'):
                generated_response = generated_response[1:-1]
            
            return generated_response
            
        except (KeyError, IndexError) as e:
            logger.warning(f"Erro ao processar resposta gerada: {e}")
            return self._get_fallback_response(category, sender)
    
    def _get_fallback_response(self, category: str, sender: str = "Prezado(a)") -> str:
        if category == 'produtivo':
            return f"""Olá {sender},

Recebemos sua solicitação e nossa equipe irá analisá-la com atenção. Entraremos em contato em até 24 horas úteis com uma resposta detalhada.

Caso seja urgente, entre em contato pelo telefone (11) 9999-9999.

Atenciosamente,
Equipe de Suporte"""
        
        else:
            return f"""Olá {sender},

Agradecemos sua mensagem! É sempre um prazer receber contato de nossos clientes.

Atenciosamente,
Equipe de Atendimento"""
    
    async def _fallback_classification(self, email_data: Dict[str, Any]) -> Dict[str, Any]:
        start_time = time.time()
        
        try:
            analysis = self.email_processor.analyze_email_structure(
                email_data.get('original_content', '')
            )
            
            category = self._determine_fallback_category(analysis)
            confidence = self._calculate_rule_based_confidence(analysis, category)
            
            processing_time = time.time() - start_time
            
            return {
                "category": category,
                "confidence": confidence,
                "processing_time": processing_time,
                "analysis": analysis
            }
            
        except Exception as e:
            logger.error(f"Erro no fallback: {str(e)}")
            return {
                "category": "produtivo",
                "confidence": 0.5,
                "processing_time": time.time() - start_time,
                "analysis": {}
            }
    
    def _determine_fallback_category(self, analysis: Dict[str, Any]) -> str:
        productive_score = 0
        
        if analysis.get('urgency_indicators'):
            productive_score += len(analysis['urgency_indicators']) * 2
        
        if analysis.get('request_indicators'):
            productive_score += len(analysis['request_indicators']) * 2
        
        if analysis.get('has_question_marks'):
            productive_score += 1
        
        unproductive_score = 0
        
        if analysis.get('greeting_indicators'):
            greeting_count = len(analysis['greeting_indicators'])
            if greeting_count > 1:
                unproductive_score += greeting_count * 2
        
        if productive_score > unproductive_score:
            return "produtivo"
        elif unproductive_score > productive_score:
            return "improdutivo"
        else:
            return "produtivo"
    
    def _calculate_rule_based_confidence(self, analysis: Dict[str, Any], category: str) -> float:
        base_confidence = 0.6
        
        total_indicators = (
            len(analysis.get('urgency_indicators', [])) +
            len(analysis.get('request_indicators', [])) +
            len(analysis.get('greeting_indicators', []))
        )
        
        if analysis.get('has_question_marks'):
            total_indicators += 1
        
        confidence_boost = min(total_indicators * 0.05, 0.3)
        
        return min(base_confidence + confidence_boost, 0.9)