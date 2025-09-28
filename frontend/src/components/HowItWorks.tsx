import { Upload, Brain, CheckCircle, Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const steps = [
  {
    icon: Upload,
    title: "Inserir Email",
    description:
      "Upload de texto ou arquivo com o conteúdo do email corporativo",
  },
  {
    icon: Brain,
    title: "Processar IA",
    description:
      "Análise inteligente usando algoritmos avançados de machine learning",
  },
  {
    icon: CheckCircle,
    title: "Classificar",
    description:
      "Determinação automática: produtivo ou improdutivo com score de confiança",
  },
  {
    icon: Download,
    title: "Obter Resposta",
    description:
      "Sugestão automática de resposta baseada na classificação do email",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-12 bg-gradient-subtle">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Como Funciona
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <Card
                key={index}
                className="relative group hover:shadow-lg transition-all duration-300 border-card-border"
              >
                <CardContent className="p-6 text-center">
                  <div className="mb-4 relative">
                    <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
