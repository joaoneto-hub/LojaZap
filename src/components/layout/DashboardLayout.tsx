import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Store,
  Package,
  MessageCircle,
  Settings,
  BarChart3,
  Users,
  ShoppingCart,
  Menu,
  Home,
  LogOut,
  X,
  Tag,
} from "lucide-react";
import Logo from "../../assets/images/LojaZap.png";
import { useNavigate, useLocation } from "react-router-dom";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  title = "Dashboard",
  description = "Bem-vindo de volta! Aqui está um resumo das suas vendas e atividades.",
}) => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
  };

  const navigationItems = [
    {
      icon: Home,
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      icon: Store,
      label: "Configurar Loja",
      href: "/store-settings",
    },
    {
      icon: Package,
      label: "Produtos",
      href: "/products",
    },
    {
      icon: Tag,
      label: "Categorias",
      href: "/categories",
    },
    {
      icon: MessageCircle,
      label: "Configurar WhatsApp",
      href: "/whatsapp",
    },
    {
      icon: ShoppingCart,
      label: "Pedidos",
      href: "/orders",
    },
    {
      icon: Users,
      label: "Clientes",
      href: "/customers",
    },
    {
      icon: BarChart3,
      label: "Relatórios",
      href: "/reports",
    },
    {
      icon: Settings,
      label: "Configurações",
      href: "/settings",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar - Fixed */}
      <div className="hidden lg:block lg:fixed lg:inset-y-0 lg:z-50 lg:w-64">
        <div className="flex flex-col h-full bg-card border-r shadow-sm">
          {/* Logo Section */}
          <div className="flex items-center justify-center h-16 px-6 border-b bg-card/50 backdrop-blur-sm">
            <div className="flex items-center space-x-3">
              <img src={Logo} alt="LojaZap" className="h-8 w-auto" />
              <span className="font-semibold text-lg text-foreground">
                LojaZap
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigationItems.map((item) => (
              <Button
                key={item.label}
                variant={
                  location.pathname === item.href ? "secondary" : "ghost"
                }
                className="w-full justify-start h-11 text-sm"
                onClick={() => navigate(item.href)}
              >
                <item.icon className="mr-3 h-4 w-4" />
                {item.label}
              </Button>
            ))}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t bg-muted/30">
            <div className="flex items-center space-x-3 mb-3">
              <Avatar className="h-9 w-9">
                <AvatarImage src="/placeholder-avatar.jpg" alt={user?.name} />
                <AvatarFallback className="text-sm">
                  {user?.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-destructive hover:text-destructive h-9 text-sm"
              onClick={handleLogout}
            >
              <LogOut className="mr-3 h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar - Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
            onClick={() => setSidebarOpen(false)}
          />

          {/* Sidebar */}
          <div className="fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-card border-r shadow-xl transform transition-transform duration-300 ease-in-out">
            <div className="flex flex-col h-full">
              {/* Header with close button */}
              <div className="flex items-center justify-between h-16 px-6 border-b bg-card/50 backdrop-blur-sm">
                <div className="flex items-center space-x-3">
                  <img src={Logo} alt="LojaZap" className="h-8 w-auto" />
                  <span className="font-semibold text-lg text-foreground">
                    LojaZap
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(false)}
                  className="lg:hidden"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                {navigationItems.map((item) => (
                  <Button
                    key={item.label}
                    variant={
                      location.pathname === item.href ? "secondary" : "ghost"
                    }
                    className="w-full justify-start h-11 text-sm"
                    onClick={() => {
                      setSidebarOpen(false);
                      navigate(item.href);
                    }}
                  >
                    <item.icon className="mr-3 h-4 w-4" />
                    {item.label}
                  </Button>
                ))}
              </nav>

              {/* User Section */}
              <div className="p-4 border-t bg-muted/30">
                <div className="flex items-center space-x-3 mb-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage
                      src="/placeholder-avatar.jpg"
                      alt={user?.name}
                    />
                    <AvatarFallback className="text-sm">
                      {user?.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {user?.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user?.email}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-destructive hover:text-destructive h-9 text-sm"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-3 h-4 w-4" />
                  Sair
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-sm border-b shadow-sm">
          <div className="flex items-center justify-between px-4 sm:px-6 py-4">
            {/* Left side - Menu button and store info */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden -ml-1"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>

              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                  <AvatarImage src="/store-photo.jpg" alt="Foto da Loja" />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs sm:text-sm">
                    <Store className="h-4 w-4 sm:h-5 sm:w-5" />
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block">
                  <h1 className="text-sm sm:text-lg font-semibold text-foreground">
                    Minha Loja
                  </h1>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Boutique Elegance
                  </p>
                </div>
                <div className="sm:hidden">
                  <h1 className="text-sm font-semibold text-foreground">
                    Loja
                  </h1>
                </div>
              </div>
            </div>

            {/* Right side - User info and logout */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="hidden sm:flex items-center space-x-3">
                <span className="text-sm text-muted-foreground">
                  Olá, {user?.name}!
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="h-8 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm"
              >
                <span className="hidden sm:inline">Sair</span>
                <LogOut className="h-4 w-4 sm:hidden" />
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <div className="space-y-4 sm:space-y-6">
            {/* Page Header */}
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-2">
                {title}
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                {description}
              </p>
            </div>

            {/* Page Content */}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
