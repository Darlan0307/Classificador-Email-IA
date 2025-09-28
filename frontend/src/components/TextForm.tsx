import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CheckCircle, Loader2 } from "lucide-react";
import { TextFormData, ValidationErrors } from "../types";
import { validateTextForm, hasErrors } from "../utils/validation";

interface TextFormProps {
  onSubmit: (data: TextFormData) => Promise<boolean>;
  isLoading: boolean;
  textFormData?: TextFormData;
}

const TextForm: React.FC<TextFormProps> = ({
  onSubmit,
  isLoading,
  textFormData,
}) => {
  const [formData, setFormData] = useState<TextFormData>({
    sender_name: textFormData?.sender_name || "",
    subject: textFormData?.subject || "",
    email_content: textFormData?.email_content || "",
  });
  const [errors, setErrors] = useState<ValidationErrors>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateTextForm(formData);

    if (hasErrors(validationErrors)) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    const success = await onSubmit(formData);
    if (success) {
      setFormData({ sender_name: "", subject: "", email_content: "" });
    }
  };

  const handleChange = (field: keyof TextFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  useEffect(() => {
    setFormData(textFormData);
  }, [textFormData]);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="sender-text">Nome do Remetente *</Label>
          <Input
            id="sender-text"
            placeholder="Ex: João Silva"
            value={formData.sender_name}
            onChange={(e) => handleChange("sender_name", e.target.value)}
            className={`transition-normal ${
              errors.sender_name ? "border-red-500" : ""
            }`}
          />
          {errors.sender_name && (
            <p className="text-sm text-red-500">{errors.sender_name}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="subject-text">Assunto do Email *</Label>
          <Input
            id="subject-text"
            placeholder="Ex: Reunião de projeto"
            value={formData.subject}
            onChange={(e) => handleChange("subject", e.target.value)}
            className={`transition-normal ${
              errors.subject ? "border-red-500" : ""
            }`}
          />
          {errors.subject && (
            <p className="text-sm text-red-500">{errors.subject}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Conteúdo do Email *</Label>
        <Textarea
          id="content"
          placeholder="Cole aqui o conteúdo completo do email corporativo que deseja classificar..."
          value={formData.email_content}
          onChange={(e) => handleChange("email_content", e.target.value)}
          className={`min-h-[120px] transition-normal ${
            errors.email_content ? "border-red-500" : ""
          }`}
        />
        {errors.email_content && (
          <p className="text-sm text-red-500">{errors.email_content}</p>
        )}
        <p className="text-sm text-muted-foreground">
          Mínimo de 10 caracteres • {formData.email_content.length} caracteres
          digitados
        </p>
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-primary hover:bg-primary-hover transition-normal"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Classificando...
          </>
        ) : (
          <>
            <CheckCircle className="mr-2 h-4 w-4" />
            Classificar Email
          </>
        )}
      </Button>
    </form>
  );
};

export default TextForm;
