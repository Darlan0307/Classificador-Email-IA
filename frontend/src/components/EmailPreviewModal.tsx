import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Mail, User, Calendar, Tag } from "lucide-react";

interface EmailExample {
  id: string;
  sender: string;
  subject: string;
  content: string;
  classification: "produtivo" | "improdutivo";
  category: string;
  date: string;
}

interface EmailPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: EmailExample | null;
  onTestExample: (email: EmailExample) => void;
}

const EmailPreviewModal = ({
  isOpen,
  onClose,
  email,
  onTestExample,
}: EmailPreviewModalProps) => {
  if (!email) return null;

  const isProductive = email.classification === "produtivo";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            Exemplo de Email
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-muted rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium text-foreground">
                  {email.sender}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {email.date}
              </div>
            </div>
            <h3 className="font-semibold text-lg text-foreground mb-2">
              {email.subject}
            </h3>
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {email.category}
              </span>
            </div>
          </div>

          <div className="bg-card rounded-lg p-4 border border-card-border">
            <h4 className="font-medium text-foreground mb-3">
              Conteúdo do Email:
            </h4>
            <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
              {email.content}
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <h4 className="font-medium text-foreground">Classificação IA:</h4>
            <div className="flex items-center gap-4">
              <Badge
                variant={isProductive ? "default" : "secondary"}
                className={`px-3 py-1 ${
                  isProductive
                    ? "bg-success text-success-foreground"
                    : "bg-info text-info-foreground"
                }`}
              >
                {email.classification.toUpperCase()}
              </Badge>
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <Button
              onClick={() => onTestExample(email)}
              className="flex-1"
              size="lg"
            >
              <Mail className="h-4 w-4 mr-2" />
              Testar Este Exemplo
            </Button>
            <Button variant="outline" onClick={onClose} size="lg">
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmailPreviewModal;
