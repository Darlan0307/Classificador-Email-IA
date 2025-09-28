import { TextFormData, FileFormData, ValidationErrors } from "../types";

export const validateTextForm = (data: TextFormData): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!data.sender_name.trim()) {
    errors.sender_name = "Nome do remetente é obrigatório";
  } else if (data.sender_name.trim().length < 2) {
    errors.sender_name = "Nome deve ter pelo menos 2 caracteres";
  }

  if (!data.subject.trim()) {
    errors.subject = "Assunto do email é obrigatório";
  } else if (data.subject.trim().length < 3) {
    errors.subject = "Assunto deve ter pelo menos 3 caracteres";
  }

  if (!data.email_content.trim()) {
    errors.email_content = "Conteúdo do email é obrigatório";
  } else if (data.email_content.trim().length < 10) {
    errors.email_content = "Conteúdo deve ter pelo menos 10 caracteres";
  }

  return errors;
};

export const validateFileForm = (
  data: FileFormData,
  file: File | null
): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!data.sender_name.trim()) {
    errors.sender_name = "Nome do remetente é obrigatório";
  } else if (data.sender_name.trim().length < 2) {
    errors.sender_name = "Nome deve ter pelo menos 2 caracteres";
  }

  if (!data.subject.trim()) {
    errors.subject = "Assunto do email é obrigatório";
  } else if (data.subject.trim().length < 3) {
    errors.subject = "Assunto deve ter pelo menos 3 caracteres";
  }

  if (!file) {
    errors.file = "Arquivo é obrigatório";
  } else {
    const validTypes = ["text/plain", "application/pdf"];
    if (!validTypes.includes(file.type)) {
      errors.file = "Apenas arquivos .txt e .pdf são aceitos";
    }
  }

  return errors;
};

export const hasErrors = (errors: ValidationErrors): boolean => {
  return Object.keys(errors).length > 0;
};
