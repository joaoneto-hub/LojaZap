import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { ShoppingCart, Plus, Minus, MessageCircle } from "lucide-react";
import { usePublicStore } from "../hooks/usePublicStore";
import type { Product } from "../types/product";

interface CartItem {
  product: Product;
  quantity: number;
}

export const PublicStore: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Hook para buscar produtos e configurações da loja pública
  const { products, storeSettings, loading, error } = usePublicStore(
    userId || ""
  );

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.product.id === product.id
      );

      if (existingItem) {
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.product.id !== productId)
    );
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const getTotalItems = () =>
    cart.reduce((total, item) => total + item.quantity, 0);

  const getTotalPrice = () =>
    cart.reduce((total, item) => total + item.product.price * item.quantity, 0);

  const generateWhatsAppMessage = () => {
    if (!storeSettings) return "";

    const storeName = storeSettings.name;
    const storePhone = storeSettings.phone.replace(/\D/g, ""); // Remove caracteres não numéricos

    let message = `🛍️ *${storeName}* - Novo Pedido\n\n`;
    message += `Olá! Gostaria de fazer um pedido:\n\n`;

    cart.forEach((item) => {
      message += `• ${item.product.name} - ${
        item.quantity
      }x R$ ${item.product.price.toFixed(2)}\n`;
    });

    message += `\n*Total: R$ ${getTotalPrice().toFixed(2)}*\n\n`;
    message += `Aguardo o retorno! 😊`;

    return `https://wa.me/55${storePhone}?text=${encodeURIComponent(message)}`;
  };

  const handleWhatsAppOrder = () => {
    const whatsappUrl = generateWhatsAppMessage();
    window.open(whatsappUrl, "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando loja...</p>
        </div>
      </div>
    );
  }

  if (error || !storeSettings) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Loja não encontrada
          </h1>
          <p className="text-gray-600">
            Esta loja não está disponível no momento.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              {/* Logo da loja */}
              {storeSettings.logo && (
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  <img
                    src={storeSettings.logo.url}
                    alt={storeSettings.logo.alt || `Logo ${storeSettings.name}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {storeSettings.name}
                </h1>
                <p className="text-gray-600">{storeSettings.description}</p>
              </div>
            </div>

            {/* Carrinho */}
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsCartOpen(!isCartOpen)}
                className="relative"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Carrinho
                {getTotalItems() > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                    {getTotalItems()}
                  </Badge>
                )}
              </Button>

              {/* Dropdown do carrinho */}
              {isCartOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-50">
                  <div className="p-4">
                    <h3 className="font-semibold mb-3">Seu Carrinho</h3>

                    {cart.length === 0 ? (
                      <p className="text-gray-500 text-sm">Carrinho vazio</p>
                    ) : (
                      <>
                        <div className="space-y-3 max-h-64 overflow-y-auto">
                          {cart.map((item) => (
                            <div
                              key={item.product.id}
                              className="flex items-center gap-3"
                            >
                              <div className="flex-1">
                                <p className="font-medium text-sm">
                                  {item.product.name}
                                </p>
                                <p className="text-gray-600 text-sm">
                                  R$ {item.product.price.toFixed(2)}
                                </p>
                              </div>

                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    updateQuantity(
                                      item.product.id,
                                      item.quantity - 1
                                    )
                                  }
                                  className="h-6 w-6 p-0"
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>

                                <span className="text-sm w-8 text-center">
                                  {item.quantity}
                                </span>

                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    updateQuantity(
                                      item.product.id,
                                      item.quantity + 1
                                    )
                                  }
                                  className="h-6 w-6 p-0"
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="border-t pt-3 mt-3">
                          <div className="flex justify-between items-center mb-3">
                            <span className="font-semibold">Total:</span>
                            <span className="font-semibold">
                              R$ {getTotalPrice().toFixed(2)}
                            </span>
                          </div>

                          <Button
                            onClick={handleWhatsAppOrder}
                            className="w-full"
                            disabled={cart.length === 0}
                          >
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Fazer Pedido via WhatsApp
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Banner da loja */}
      {storeSettings.bannerImage && (
        <div className="w-full bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="w-full h-48 md:h-64 rounded-lg overflow-hidden">
              <img
                src={storeSettings.bannerImage.url}
                alt={
                  storeSettings.bannerImage.alt ||
                  `Banner ${storeSettings.name}`
                }
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      )}

      {/* Informações da loja */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">📞 Contato</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{storeSettings.phone}</p>
              <p className="text-gray-600">{storeSettings.email}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">📍 Endereço</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{storeSettings.address}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">🕒 Horário</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                {storeSettings.openingTime} - {storeSettings.closingTime}
              </p>
              <p className="text-gray-600 text-sm mt-1">
                {storeSettings.workingDays.join(", ")}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Produtos */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Nossos Produtos
          </h2>

          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">
                Nenhum produto disponível no momento.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <Card
                  key={product.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  {/* Imagem do produto */}
                  {product.mainImage && (
                    <div className="aspect-square overflow-hidden rounded-t-lg">
                      <img
                        src={product.mainImage.url}
                        alt={product.mainImage.alt || product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <CardHeader>
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <div className="flex items-center gap-2 flex-wrap">
                      {product.categories.map((category, index) => (
                        <Badge key={index} variant="secondary">
                          {category}
                        </Badge>
                      ))}
                      {product.color && (
                        <Badge variant="outline">{product.color}</Badge>
                      )}
                      {product.size && (
                        <Badge variant="outline">{product.size}</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {product.description}
                    </p>

                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold text-primary">
                        R$ {product.price.toFixed(2)}
                      </span>
                      <span className="text-sm text-gray-500">
                        Estoque: {product.stock}
                      </span>
                    </div>

                    <Button
                      onClick={() => addToCart(product)}
                      className="w-full"
                      disabled={product.stock === 0}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {product.stock === 0
                        ? "Sem estoque"
                        : "Adicionar ao carrinho"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
