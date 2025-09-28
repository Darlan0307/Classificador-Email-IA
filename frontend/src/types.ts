export interface ClassificationResult {
  category: "produtivo" | "improdutivo";
  confidence_score: number;
  suggested_response: string;
  processing_time: number;
  metadata: {
    sender?: string;
    subject?: string;
    filename?: string;
    timestamp: string;
  };
}

export interface TextFormData {
  sender_name: string;
  subject: string;
  email_content: string;
}

export interface FileFormData {
  sender_name: string;
  subject: string;
}

export interface ValidationErrors {
  sender_name?: string;
  subject?: string;
  email_content?: string;
  file?: string;
}