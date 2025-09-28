import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Calendar, User } from "lucide-react";
import EmailPreviewModal from "./EmailPreviewModal";

interface EmailExample {
  id: string;
  sender: string;
  subject: string;
  content: string;
  classification: "produtivo" | "improdutivo";
  category: string;
  date: string;
}

const emailExamples: EmailExample[] = [
  {
    id: "1",
    sender: "Ana Silva (Gerente de Projetos)",
    subject: "Reunião de Planejamento - Projeto Q4",
    content:
      "Olá equipe,\n\nGostaria de agendar uma reunião para discutir o cronograma do projeto Q4. Precisamos revisar os marcos principais e definir as responsabilidades.\n\nData sugerida: Sexta-feira às 14h\nDuração: 1h30min\nSala de reuniões: Sala A\n\nPor favor, confirmem presença até quinta-feira.\n\nObrigada,\nAna",
    classification: "produtivo",
    category: "Reuniões de Trabalho",
    date: "15 Jan 2024",
  },
  {
    id: "2",
    sender: "João Oliveira (Diretor Financeiro)",
    subject: "Relatório Mensal de Vendas - Dezembro 2023",
    content:
      "Prezados,\n\nSegue em anexo o relatório consolidado de vendas de dezembro. Destaques:\n\n• Crescimento de 12% vs mês anterior\n• Meta mensal superada em 8%\n• Região Sul liderou em performance\n\nReunião de análise marcada para terça-feira às 10h para discussão dos resultados e planejamento de janeiro.\n\nSaúdes,\nJoão",
    classification: "produtivo",
    category: "Relatórios Corporativos",
    date: "08 Jan 2024",
  },
  {
    id: "3",
    sender: "CarlosDeals@promogeral.com",
    subject: "🔥 SUPER OFERTA! 70% OFF em Eletrônicos!",
    content:
      "Não perca essa MEGA PROMOÇÃO!\n\n🎉 Smartphones com até 70% de desconto\n🎉 Notebooks a partir de R$ 999\n🎉 TVs Smart com frete GRÁTIS\n\nCORRA! Oferta válida apenas por 24 horas!\n\nClique AQUI e garante já o seu: www.promogeral.com/ofertas\n\nDescadastre-se aqui se não quiser mais receber.",
    classification: "improdutivo",
    category: "Spam Promocional",
    date: "12 Jan 2024",
  },
  {
    id: "4",
    sender: "newsletter@techblog.com.br",
    subject: "Weekly Tech News - Edição #247",
    content:
      "Olá leitor!\n\nConfira as principais notícias da semana:\n\n- Lançamento do novo iPhone com IA integrada\n- Microsoft anuncia parceria com OpenAI\n- Tesla apresenta novo modelo autônomo\n- Criptomoedas em alta histórica\n\nLeia mais em nosso blog e compartilhe com seus amigos!\n\nAté semana que vem!",
    classification: "improdutivo",
    category: "Newsletter Marketing",
    date: "10 Jan 2024",
  },
  {
    id: "5",
    sender: "Maria Santos (RH)",
    subject: "Convite: Treinamento de Liderança - Fevereiro",
    content:
      "Prezado(a),\n\nTemos o prazer de convidá-lo para o treinamento 'Liderança na Era Digital' que acontecerá nos dias 15 e 16 de fevereiro.\n\nPrograma:\n- Gestão de equipes remotas\n- Ferramentas de comunicação\n- Desenvolvimento de soft skills\n\nLocal: Auditório principal\nHorário: 9h às 17h\nInstrutor: Prof. Ricardo Mendes\n\nConfirme sua participação até o dia 31/01.\n\nAtenciosamente,\nMaria Santos - RH",
    classification: "produtivo",
    category: "Eventos Corporativos",
    date: "20 Jan 2024",
  },
  {
    id: "6",
    sender: "Pedro Costa (pedro.costa@gmail.com)",
    subject: "Oi! Como você está?",
    content:
      "Oi amigo!\n\nTudo bem? Faz tempo que não nos falamos! Como estão as coisas aí no trabalho?\n\nEu aqui pensando em marcar um churrasco no final de semana. Que tal sábado à tarde na minha casa? Vai ter futebol na TV e cerveja gelada!\n\nMe avisa se você topa! Já falei com o pessoal da turma e alguns confirmaram.\n\nAbraços!\nPedro\n\nPS: Minha esposa mandou lembranças para sua família!",
    classification: "improdutivo",
    category: "Email Pessoal",
    date: "18 Jan 2024",
  },
];

interface ExamplesGalleryProps {
  onTestExample: (sender: string, subject: string, content: string) => void;
}

const ExamplesGallery = ({ onTestExample }: ExamplesGalleryProps) => {
  const [selectedEmail, setSelectedEmail] = useState<EmailExample | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewExample = (email: EmailExample) => {
    setSelectedEmail(email);
    setIsModalOpen(true);
  };

  const handleTestExample = (email: EmailExample) => {
    onTestExample(email.sender, email.subject, email.content);
    setIsModalOpen(false);
  };

  const productiveExamples = emailExamples.filter(
    (e) => e.classification === "produtivo"
  );
  const unproductiveExamples = emailExamples.filter(
    (e) => e.classification === "improdutivo"
  );

  return (
    <section className="py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Exemplos Interativos
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore exemplos reais de emails classificados pela IA e teste você
            mesmo
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-4 h-4 bg-success rounded-full"></div>
              <h3 className="text-xl font-semibold text-foreground">
                Emails Produtivos
              </h3>
              <Badge variant="outline" className="text-success border-success">
                {productiveExamples.length} exemplos
              </Badge>
            </div>
            <div className="space-y-4">
              {productiveExamples.map((email) => (
                <Card
                  key={email.id}
                  className="group hover:shadow-lg transition-all duration-300 border-card-border"
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-start justify-between gap-2">
                      <span className="line-clamp-1">{email.subject}</span>
                    </CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="h-3 w-3" />
                      <span className="line-clamp-1">{email.sender}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                      {email.content}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {email.date}
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewExample(email)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Ver
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-4 h-4 bg-info rounded-full"></div>
              <h3 className="text-xl font-semibold text-foreground">
                Emails Improdutivos
              </h3>
              <Badge variant="outline" className="text-info border-info">
                {unproductiveExamples.length} exemplos
              </Badge>
            </div>
            <div className="space-y-4">
              {unproductiveExamples.map((email) => (
                <Card
                  key={email.id}
                  className="group hover:shadow-lg transition-all duration-300 border-card-border"
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-start justify-between gap-2">
                      <span className="line-clamp-1">{email.subject}</span>
                    </CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="h-3 w-3" />
                      <span className="line-clamp-1">{email.sender}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                      {email.content}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {email.date}
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewExample(email)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Ver
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        <EmailPreviewModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          email={selectedEmail}
          onTestExample={handleTestExample}
        />
      </div>
    </section>
  );
};

export default ExamplesGallery;
