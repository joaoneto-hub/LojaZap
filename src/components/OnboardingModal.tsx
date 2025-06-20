import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Package,
  Tag,
  Store,
  MessageCircle,
  Users,
  BarChart3,
} from "lucide-react";

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigureCategories: () => void;
}

const features = [
  {
    icon: Package,
    title: "Gerenciamento de Produtos",
    description:
      "Cadastre, edite e organize seus produtos com categorias personalizadas",
    color: "bg-blue-100 text-blue-800",
  },
  {
    icon: Tag,
    title: "Categorias Dinâmicas",
    description: "Configure categorias específicas para o seu tipo de negócio",
    color: "bg-green-100 text-green-800",
  },
  {
    icon: Store,
    title: "Loja Personalizada",
    description: "Configure sua loja com informações, horários e endereço",
    color: "bg-purple-100 text-purple-800",
  },
  {
    icon: MessageCircle,
    title: "Integração WhatsApp",
    description: "Conecte com seus clientes através do WhatsApp",
    color: "bg-green-100 text-green-800",
  },
  {
    icon: Users,
    title: "Gestão de Clientes",
    description: "Gerencie seus clientes e histórico de pedidos",
    color: "bg-orange-100 text-orange-800",
  },
  {
    icon: BarChart3,
    title: "Relatórios e Estatísticas",
    description: "Acompanhe suas vendas e performance do negócio",
    color: "bg-red-100 text-red-800",
  },
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onConfigureCategories,
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    } else {
      onConfigureCategories();
    }
  };

  const handleSkip = () => {
    onClose();
  };

  const steps = [
    {
      title: "Bem-vindo ao LojaZap! 🎉",
      description:
        "Vamos configurar seu sistema para que você possa começar a vender rapidamente.",
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            O LojaZap é uma plataforma completa para gerenciar seu negócio
            online, desde o cadastro de produtos até a integração com WhatsApp.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.slice(0, 3).map((feature, index) => (
              <div
                key={index}
                className="flex items-start space-x-3 p-3 border rounded-lg"
              >
                <div className={`p-2 rounded-lg ${feature.color}`}>
                  <feature.icon className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">{feature.title}</h4>
                  <p className="text-xs text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: "Organize seus Produtos",
      description:
        "Primeiro, vamos configurar as categorias dos seus produtos para melhor organização.",
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            As categorias ajudam você e seus clientes a encontrar produtos
            rapidamente. Escolha o tipo do seu negócio e criaremos categorias
            específicas automaticamente.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.slice(3, 6).map((feature, index) => (
              <div
                key={index}
                className="flex items-start space-x-3 p-3 border rounded-lg"
              >
                <div className={`p-2 rounded-lg ${feature.color}`}>
                  <feature.icon className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">{feature.title}</h4>
                  <p className="text-xs text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: "Pronto para Começar!",
      description:
        "Agora vamos configurar as categorias específicas para o seu negócio.",
      content: (
        <div className="space-y-4">
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Tag className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold text-lg">
                Configure suas Categorias
              </h4>
              <p className="text-muted-foreground">
                Escolha o tipo do seu negócio e criaremos categorias específicas
                automaticamente.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              <Badge variant="secondary">Moda</Badge>
              <Badge variant="secondary">Cosméticos</Badge>
              <Badge variant="secondary">Eletrônicos</Badge>
              <Badge variant="secondary">Casa</Badge>
              <Badge variant="secondary">Alimentos</Badge>
              <Badge variant="secondary">Esportes</Badge>
              <Badge variant="secondary">Livros</Badge>
              <Badge variant="secondary">Genérico</Badge>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const currentStepData = steps[currentStep];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{currentStepData.title}</DialogTitle>
          <DialogDescription>{currentStepData.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {currentStepData.content}

          {/* Progress indicator */}
          <div className="flex justify-center space-x-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index <= currentStep ? "bg-primary" : "bg-gray-300"
                }`}
              />
            ))}
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="ghost" onClick={handleSkip}>
              Pular
            </Button>
            <Button onClick={handleNext}>
              {currentStep === steps.length - 1
                ? "Configurar Categorias"
                : "Próximo"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
