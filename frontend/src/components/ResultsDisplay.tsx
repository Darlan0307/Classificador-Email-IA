import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Info, Clock, Copy } from "lucide-react";
import { ClassificationResult } from "../types";

interface ResultsDisplayProps {
  result: ClassificationResult;
  onCopyToClipboard: (text: string) => void;
  onReset: () => void;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  result,
  onCopyToClipboard,
  onReset,
}) => {
  return (
    <div className="mt-8 animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Resultado da Classificação</h3>
        <Button onClick={onReset} variant="outline" size="sm">
          Nova Classificação
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card
          className={`border-2 ${
            result.category === "produtivo"
              ? "border-success bg-success-light"
              : "border-info bg-info-light"
          }`}
        >
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              {result.category === "produtivo" ? (
                <>
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span className="text-success">Email Produtivo</span>
                </>
              ) : (
                <>
                  <Info className="h-5 w-5 text-info" />
                  <span className="text-info">Email Improdutivo</span>
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <Label className="text-sm font-medium">
                  Nível de Confiança
                </Label>
                <div className="mt-1">
                  <Progress
                    value={result.confidence_score * 100}
                    className="h-2"
                  />
                  <span className="text-sm text-muted-foreground">
                    {(result.confidence_score * 100).toFixed(1)}%
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  Processado em {result.processing_time.toFixed(2)}s
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <span>Resposta Sugerida</span>
              <Button
                onClick={() => onCopyToClipboard(result.suggested_response)}
                variant="outline"
                size="sm"
              >
                <Copy className="h-4 w-4 mr-1" />
                Copiar
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-3 rounded-md">
              <p className="text-sm leading-relaxed">
                {result.suggested_response}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {result.metadata && (
        <Card className="mt-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">
              Informações do Processamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 text-sm">
              {result.metadata.sender && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Remetente:</span>
                  <span>{result.metadata.sender}</span>
                </div>
              )}
              {result.metadata.subject && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Assunto:</span>
                  <span>{result.metadata.subject}</span>
                </div>
              )}
              {result.metadata.filename && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Arquivo:</span>
                  <span>{result.metadata.filename}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Processado em:</span>
                <span>
                  {new Date(result.metadata.timestamp).toLocaleString("pt-BR")}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ResultsDisplay;
