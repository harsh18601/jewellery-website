"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

interface CartItem {
    id: string;
    title: string;
    price: number;
    category: string;
    image: string;
    quantity: number;
    description?: any;
}

interface CartContextType {
    cartItems: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, delta: number) => void;
    cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([
        // Initial placeholder item as requested to show "1"
        { id: '1', title: 'Eternal Solitaire Ring', price: 125000, category: 'Lab-Grown', image: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&q=80&w=400', quantity: 1 }
    ]);

    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    const addToCart = (item: CartItem) => {
        setCartItems(prev => {
            const existing = prev.find(i => i.id === item.id);
            if (existing) {
                return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
            }
            return [...prev, item];
        });
    };

    const removeFromCart = (id: string) => {
        setCartItems(prev => prev.filter(item => item.id !== id));
    };

    const updateQuantity = (id: string, delta: number) => {
        setCartItems(prev => prev.map(item => {
            if (item.id === id) {
                const newQty = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }));
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, cartCount }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used within a CartProvider');
    return context;
};
