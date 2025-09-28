import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import {
  Mail,
  Brain,
  FileText,
  AlertTriangle,
  Building,
  Shield,
} from "lucide-react";

const tips = [
  {
    id: "preparation",
    icon: Mail,
    title: "Preparação do Email",
    content: [
      "Mantenha formatação básica (quebras de linha, parágrafos)",
      "Remova informações confidenciais antes do processamento",
      "Para emails extensos, inclua apenas o conteúdo principal",
    ],
  },
  {
    id: "context",
    icon: Brain,
    title: "Contexto Importante",
    content: [
      "A IA analisa **tom profissional vs pessoal** do conteúdo",
      "Emails com **call-to-action corporativo** são geralmente produtivos",
      "Conteúdo promocional ou newsletters são classificados como improdutivos",
      "Reuniões, relatórios e projetos têm alta probabilidade produtiva",
      "Considere o **contexto corporativo** da sua organização",
    ],
  },
  {
    id: "files",
    icon: FileText,
    title: "Tipos de Arquivo",
    content: [
      "Formatos aceitos: **.txt** e **.pdf**",
      "Para melhor precisão, use arquivos de texto simples",
    ],
  },
  {
    id: "troubleshooting",
    icon: AlertTriangle,
    title: "Solução de Problemas",
    content: [
      "**Classificação incorreta:** Adicione mais contexto ao email",
      "**Demora no processamento:** Aguarde até 30 segundos para arquivos grandes",
      "**Score baixo:** Revise se o conteúdo está completo",
      "**Problema persistente:** Tente reformatar o texto de entrada",
    ],
  },
  {
    id: "integration",
    icon: Building,
    title: "Integração Corporativa",
    content: [
      "**API disponível** para integração com sistemas internos",
      "**Relatórios customizados** de produtividade de emails",
    ],
  },
  {
    id: "security",
    icon: Shield,
    title: "Segurança e Privacidade",
    content: [
      "**Dados não armazenados:** Processamento temporário apenas",
      "**Conexão criptografada:** SSL/TLS em todas as comunicações",
    ],
  },
];

const TipsSection = () => {
  return (
    <section className="py-16 bg-gradient-subtle">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Dicas & Truques
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Maximize a precisão da classificação com essas dicas práticas
          </p>
        </div>

        <Card className="shadow-lg border-card-border">
          <CardContent className="p-6">
            <Accordion type="single" collapsible className="space-y-2">
              {tips.map((tip) => {
                const IconComponent = tip.icon;
                return (
                  <AccordionItem
                    key={tip.id}
                    value={tip.id}
                    className="border border-card-border rounded-lg px-4"
                  >
                    <AccordionTrigger className="hover:no-underline py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <IconComponent className="h-5 w-5 text-primary" />
                        </div>
                        <span className="text-left font-semibold text-foreground">
                          {tip.title}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4 pt-2">
                      <div className="ml-13 space-y-2">
                        {tip.content.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-2 text-muted-foreground"
                          >
                            <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0"></div>
                            <span
                              className="text-sm leading-relaxed"
                              dangerouslySetInnerHTML={{
                                __html: item.replace(
                                  /\*\*(.*?)\*\*/g,
                                  '<strong class="text-foreground">$1</strong>'
                                ),
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default TipsSection;
