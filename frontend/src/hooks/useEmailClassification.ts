import { useCallback, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ClassificationResult, TextFormData, FileFormData } from "../types";

export const useEmailClassification = () => {
  const VITE_API_URL = import.meta.env.VITE_API_URL;
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const { toast } = useToast();

  const ping = useCallback(async () => {
    try {
      await fetch(`${VITE_API_URL}/health`);
    } catch (error) {
      console.log(error);
    }
  }, [VITE_API_URL]);

  useEffect(() => {
    ping();
  }, [ping]);

  const classifyText = async (formData: TextFormData): Promise<boolean> => {
    setIsLoading(true);
    try {
      const data = new FormData();
      data.append("email_content", formData.email_content);
      data.append("sender_name", formData.sender_name);
      data.append("subject", formData.subject);

      const response = await fetch(`${VITE_API_URL}/classify-email`, {
        method: "POST",
        body: data,
      });

      if (!response.ok) throw new Error("Erro na classificação");

      const responseData: ClassificationResult = await response.json();
      setResult(responseData);

      toast({
        title: "Classificação concluída",
        description: `Email classificado como ${responseData.category}`,
      });
      return true;
    } catch (error) {
      toast({
        title: "Erro na classificação",
        description:
          "Não foi possível conectar com a API. Verifique se o backend está rodando.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const classifyFile = async (
    formData: FileFormData,
    file: File
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      const data = new FormData();
      data.append("file", file);
      data.append("sender_name", formData.sender_name);
      data.append("subject", formData.subject);

      const response = await fetch(`${VITE_API_URL}/classify-email-file`, {
        method: "POST",
        body: data,
      });

      if (!response.ok) throw new Error("Erro na classificação");

      const responseData: ClassificationResult = await response.json();
      setResult(responseData);

      toast({
        title: "Classificação concluída",
        description: `Arquivo classificado como ${responseData.category}`,
      });
      return true;
    } catch (error) {
      toast({
        title: "Erro na classificação",
        description:
          "Não foi possível conectar com a API. Verifique se o backend está rodando.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copiado!",
        description: "Texto copiado para a área de transferência",
      });
    } catch (error) {
      toast({
        title: "Erro ao copiar",
        description: "Não foi possível copiar o texto",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setResult(null);
  };

  return {
    isLoading,
    result,
    classifyText,
    classifyFile,
    copyToClipboard,
    resetForm,
  };
};
