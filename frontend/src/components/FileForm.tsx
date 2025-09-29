import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Loader2, FileCheck } from "lucide-react";
import { validateFileForm, hasErrors } from "../utils/validation";
import { FileFormData, ValidationErrors } from "@/types";

interface FileFormProps {
  onSubmit: (data: FileFormData, file: File) => Promise<boolean>;
  isLoading: boolean;
}

const FileForm: React.FC<FileFormProps> = ({ onSubmit, isLoading }) => {
  const MAX_FILE_SIZE = 50 * 1024 * 1024;
  const [formData, setFormData] = useState<FileFormData>({
    sender_name: "",
    subject: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<ValidationErrors>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateFileForm(formData, selectedFile);

    if (hasErrors(validationErrors)) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    if (selectedFile) {
      const success = await onSubmit(formData, selectedFile);
      if (success) {
        setFormData({ sender_name: "", subject: "" });
        setSelectedFile(null);
      }
    }
  };

  const handleChange = (field: keyof FileFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        setErrors((prev) => ({
          ...prev,
          file: "O arquivo excede o tamanho máximo de 50 MB.",
        }));
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
      if (errors.file) {
        setErrors((prev) => ({ ...prev, file: undefined }));
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="sender-file">Nome do Remetente *</Label>
          <Input
            id="sender-file"
            placeholder="Ex: Maria Santos"
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
          <Label htmlFor="subject-file">Assunto do Email *</Label>
          <Input
            id="subject-file"
            placeholder="Ex: Relatório mensal"
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
        <Label htmlFor="file-upload">Arquivo do Email *</Label>
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-normal hover:border-primary hover:bg-accent ${
            errors.file ? "border-red-500" : "border-input-border"
          }`}
        >
          <input
            id="file-upload"
            type="file"
            accept=".txt,.pdf"
            onChange={handleFileChange}
            className="hidden"
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer flex flex-col items-center gap-2"
          >
            {selectedFile ? (
              <>
                <FileCheck className="h-8 w-8 text-success" />
                <span className="font-medium text-success">
                  {selectedFile.name}
                </span>
                <span className="text-sm text-muted-foreground">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </span>
              </>
            ) : (
              <>
                <Upload className="h-8 w-8 text-muted-foreground" />
                <span className="font-medium">
                  Clique para selecionar arquivo
                </span>
                <span className="text-sm text-muted-foreground">
                  Formatos aceitos: .txt, .pdf
                </span>
              </>
            )}
          </label>
        </div>
        {errors.file && <p className="text-sm text-red-500">{errors.file}</p>}
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-primary hover:bg-primary-hover transition-normal"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processando arquivo...
          </>
        ) : (
          <>
            <FileCheck className="mr-2 h-4 w-4" />
            Classificar Arquivo
          </>
        )}
      </Button>
    </form>
  );
};

export default FileForm;
