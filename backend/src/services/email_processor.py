import re
import nltk
import string
from typing import List, Dict, Any
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize, sent_tokenize
from nltk.stem import RSLPStemmer
from collections import Counter
import logging

logger = logging.getLogger(__name__)

class EmailProcessor:    
    def __init__(self):
        self.setup_nltk()
        self.stemmer = RSLPStemmer()
        self.stop_words = self._get_stop_words()
        
    def setup_nltk(self):
        nltk_resources = [
            ('tokenizers/punkt', 'punkt'),
            ('corpora/stopwords', 'stopwords'), 
            ('stemmers/rslp', 'rslp'),
            ('vader_lexicon', 'vader_lexicon')
        ]
        
        for path, resource in nltk_resources:
            try:
                nltk.data.find(path)
            except LookupError:
                try:
                    nltk.download(resource, quiet=True)
                    logger.info(f"Downloaded NLTK resource: {resource}")
                except Exception as e:
                    logger.warning(f"Falha ao baixar {resource}: {e}")
    
    def _get_stop_words(self) -> set:
        try:
            portuguese_stops = set(stopwords.words('portuguese'))
        except:
            portuguese_stops = set()
            logger.warning("Stopwords do NLTK não disponíveis, usando lista personalizada")
        
        custom_stops = {
            'bom', 'dia', 'tarde', 'noite', 'olá', 'oi', 'obrigado', 'obrigada',
            'att', 'atenciosamente', 'cordialmente', 'abraço', 'abraços',
            'email', 'mensagem', 'assunto', 'favor', 'gentileza', 'por',
            'att', 'atenciosamente', 'cumprimentos', 'saudações',
            'sr', 'sra', 'prezado', 'prezada'
        }
        
        return portuguese_stops.union(custom_stops)
    
    def clean_text(self, text: str) -> str:
        if not text:
            return ""
        
        text = re.sub(r'\n+', ' ', text)
        text = re.sub(r'\r+', ' ', text)
        
        text = re.sub(r'\s+', ' ', text)

        text = re.sub(r'\S+@\S+', '', text)
        text = re.sub(r'http\S+|www.\S+', '', text)
        
        text = re.sub(r'\(\d{2}\)\s*\d{4,5}-?\d{4}', '', text)
        text = re.sub(r'\d{2}\s*\d{4,5}-?\d{4}', '', text)
        
        text = re.sub(r'[^\w\s.!?,-]', ' ', text)
        
        text = re.sub(r'\b\d+\b', '', text)
        
        text = text.lower().strip()
        
        return text
    
    def tokenize_and_filter(self, text: str) -> List[str]:
        if not text:
            return []
        
        tokens = word_tokenize(text, language='portuguese')
        
        filtered_tokens = []
        for token in tokens:
            if (token not in string.punctuation and 
                len(token) > 2 and 
                token not in self.stop_words and
                token.isalpha()):
                filtered_tokens.append(token)
        
        return filtered_tokens
    
    def apply_stemming(self, tokens: List[str]) -> List[str]:
        stemmed_tokens = []
        for token in tokens:
            try:
                stemmed = self.stemmer.stem(token)
                stemmed_tokens.append(stemmed)
            except:
                stemmed_tokens.append(token)
        
        return stemmed_tokens
    
    def preprocess_text(self, text: str) -> str:
        if not text or not text.strip():
            return ""
        
        cleaned = self.clean_text(text)
        
        tokens = self.tokenize_and_filter(cleaned)
        
        stemmed_tokens = self.apply_stemming(tokens)
        
        return ' '.join(stemmed_tokens)
    
    def extract_keywords(self, text: str, top_k: int = 10) -> List[str]:
        if not text:
            return []

        cleaned = self.clean_text(text)
        tokens = self.tokenize_and_filter(cleaned)

        word_freq = Counter(tokens)
        
        return [word for word, freq in word_freq.most_common(top_k)]
    
    def extract_sentences(self, text: str) -> List[str]:
        if not text:
            return []
        
        try:
            sentences = sent_tokenize(text, language='portuguese')
            cleaned_sentences = []
            
            for sentence in sentences:
                cleaned = sentence.strip()
                if len(cleaned) > 10:
                    cleaned_sentences.append(cleaned)
            
            return cleaned_sentences
        except:
            return [s.strip() for s in text.split('.') if len(s.strip()) > 10]
    
    def analyze_email_structure(self, text: str) -> Dict[str, Any]:
        if not text:
            return {}
        
        original_text = text
        sentences = self.extract_sentences(original_text)
        keywords = self.extract_keywords(original_text)
        processed_text = self.preprocess_text(original_text)
        
        analysis = {
            'original_length': len(original_text),
            'processed_length': len(processed_text),
            'sentence_count': len(sentences),
            'word_count': len(original_text.split()),
            'keyword_count': len(keywords),
            'keywords': keywords,
            'has_question_marks': '?' in original_text,
            'has_exclamation_marks': '!' in original_text,
            'urgency_indicators': self._detect_urgency_indicators(original_text.lower()),
            'greeting_indicators': self._detect_greeting_indicators(original_text.lower()),
            'request_indicators': self._detect_request_indicators(original_text.lower())
        }
        
        return analysis
    
    def _detect_urgency_indicators(self, text: str) -> List[str]:
        urgency_patterns = [
            'urgente', 'emergência', 'imediato', 'rápido', 'asap',
            'o mais rápido possível', 'com brevidade', 'prioritário',
            'problema', 'erro', 'falha', 'não funciona', 'parou'
        ]
        
        found_indicators = []
        for pattern in urgency_patterns:
            if pattern in text:
                found_indicators.append(pattern)
        
        return found_indicators
    
    def _detect_greeting_indicators(self, text: str) -> List[str]:
        greeting_patterns = [
            'bom dia', 'boa tarde', 'boa noite', 'olá', 'oi',
            'parabéns', 'felicitações', 'feliz aniversário', 'feliz natal',
            'feliz ano novo', 'obrigado', 'obrigada', 'agradecimento'
        ]
        
        found_greetings = []
        for pattern in greeting_patterns:
            if pattern in text:
                found_greetings.append(pattern)
        
        return found_greetings
    
    def _detect_request_indicators(self, text: str) -> List[str]:
        request_patterns = [
            'preciso', 'necessito', 'solicito', 'gostaria',
            'poderia', 'pode', 'ajuda', 'suporte', 'informação',
            'dúvida', 'questão', 'pergunta', 'esclarecimento'
        ]
        
        found_requests = []
        for pattern in request_patterns:
            if pattern in text:
                found_requests.append(pattern)
        
        return found_requests
