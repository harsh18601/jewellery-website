"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'

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
    const { data: session } = useSession()
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isInitialLoad, setIsInitialLoad] = useState(true)

    // Initial load from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('cart');
        if (saved) {
            try {
                setCartItems(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse cart", e);
            }
        } else {
            // Default placeholder if empty
            setCartItems([
                { id: '1', title: 'Eternal Solitaire Ring', price: 125000, category: 'Lab-Grown', image: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&q=80&w=400', quantity: 1 }
            ])
        }
        setIsInitialLoad(false)
    }, []);

    // Load from server when session is available
    useEffect(() => {
        if (session && !isInitialLoad) {
            const fetchCart = async () => {
                try {
                    const res = await fetch('/api/user/sync')
                    if (res.ok) {
                        const data = await res.json()
                        if (data.cart && data.cart.length > 0) {
                            setCartItems(data.cart)
                        }
                    }
                } catch (e) {
                    console.error("Failed to fetch cart from server", e)
                }
            }
            fetchCart()
        }
    }, [session, isInitialLoad])

    // Save to localStorage and sync to server
    useEffect(() => {
        if (isInitialLoad) return;

        localStorage.setItem('cart', JSON.stringify(cartItems));

        if (session) {
            const syncToServer = async () => {
                try {
                    await fetch('/api/user/sync', {
                        method: 'POST',
                        body: JSON.stringify({
                            cart: cartItems
                        }),
                    })
                } catch (e) {
                    console.error("Failed to sync cart to server", e)
                }
            }
            const timer = setTimeout(syncToServer, 1000)
            return () => clearTimeout(timer)
        }
    }, [cartItems, session, isInitialLoad]);

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
