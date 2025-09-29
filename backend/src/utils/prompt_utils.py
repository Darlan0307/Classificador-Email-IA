from typing import Dict, Any

def build_classification_prompt(email_data: Dict[str, Any], analysis: Dict[str, Any]) -> str:
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
2. IMPRODUTIVO: Emails que não necessitam ação imediata

INSTRUÇÕES:
Responda APENAS com um JSON no formato:
{{"categoria": "produtivo|improdutivo", "confianca": 0.0-1.0, "justificativa": "explicação breve"}}

Sua resposta:
"""
    return prompt


def build_response_prompt(content: str, sender: str, subject: str, category: str) -> str:
    if category == 'produtivo':
        return f"""
Você é um assistente de atendimento de uma empresa do setor financeiro.
Gere uma resposta profissional e personalizada para este email PRODUTIVO.

EMAIL RECEBIDO:
- Remetente: {sender}
- Assunto: {subject}
- Conteúdo: "{content}"

DIRETRIZES:
- Seja profissional e empático
- Reconheça a solicitação específica
- Forneça próximos passos claros
- Máximo 150 palavras

Resposta:
"""
    else:
        return f"""
Você é um assistente de atendimento de uma empresa do setor financeiro.
Gere uma resposta educada e cordial para este email IMPRODUTIVO.

EMAIL RECEBIDO:
- Remetente: {sender}
- Assunto: {subject}
- Conteúdo: "{content}"

DIRETRIZES:
- Seja cordial e agradecido
- Reconheça a mensagem positivamente
- Seja breve, máximo 80 palavras

Resposta:
"""

def truncate_prompt(prompt: str, max_tokens: int = 10000) -> str:
    # aqui eu poderia usar o tiktoken para calcular o número de tokens
    max_chars = max_tokens * 4
    if len(prompt) > max_chars:
        return prompt[:max_chars] + "\n\n...[truncated]"
    return prompt
