import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Upload, FileText } from "lucide-react";
import TextForm from "./TextForm";
import ResultsDisplay from "./ResultsDisplay";
import HowItWorks from "./HowItWorks";
import ExamplesGallery from "./ExamplesGallery";
import TipsSection from "./TipsSection";
import { useEmailClassification } from "../hooks/useEmailClassification";
import FileForm from "./FileForm";
import { TextFormData } from "@/types";

const EmailClassifier = () => {
  const [activeTab, setActiveTab] = useState("text");
  const [textEmailSelected, setTextEmailSelected] = useState<TextFormData>({
    sender_name: "",
    subject: "",
    email_content: "",
  });
  const {
    isLoading,
    result,
    classifyText,
    classifyFile,
    copyToClipboard,
    resetForm,
  } = useEmailClassification();

  const handleTestExample = (
    sender: string,
    subject: string,
    content: string
  ) => {
    const section = document.getElementById("forms");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
    setActiveTab("text");
    setTextEmailSelected({
      sender_name: sender,
      subject: subject,
      email_content: content,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-gradient-subtle">
        <div className="container mx-auto px-4 pt-10">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-gradient-primary text-primary-foreground">
                <Mail className="h-8 w-8" />
              </div>
              <h1 className="text-4xl font-bold text-foreground">
                Sistema de Classificação de Emails
              </h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Classifique emails corporativos automaticamente usando IA.
              Identifique se o conteúdo é produtivo ou improdutivo com alta
              precisão.
            </p>
          </div>
        </div>
      </header>

      <HowItWorks />

      <main className="container mx-auto px-4 py-8 max-w-4xl" id="forms">
        <Card className="shadow-lg border-card-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Classificação de Email
            </CardTitle>
          </CardHeader>

          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="text" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Texto Direto
                </TabsTrigger>
                <TabsTrigger value="file" className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Upload de Arquivo
                </TabsTrigger>
              </TabsList>

              <TabsContent value="text" className="space-y-6">
                <TextForm
                  onSubmit={classifyText}
                  isLoading={isLoading}
                  textFormData={textEmailSelected}
                />
              </TabsContent>

              <TabsContent value="file" className="space-y-6">
                <FileForm onSubmit={classifyFile} isLoading={isLoading} />
              </TabsContent>
            </Tabs>

            {result && (
              <ResultsDisplay
                result={result}
                onCopyToClipboard={copyToClipboard}
                onReset={resetForm}
              />
            )}
          </CardContent>
        </Card>
      </main>

      <ExamplesGallery onTestExample={handleTestExample} />

      <TipsSection />

      <footer className="border-t border-card-border bg-gradient-subtle py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Mail className="h-4 w-4" />
            <span className="text-sm">Sistema de Classificação de Emails</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default EmailClassifier;
