"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
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
    const { data: session, status } = useSession()
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isInitialLoad, setIsInitialLoad] = useState(true)
    const [isCartHydrated, setIsCartHydrated] = useState(false)

    // Start with an empty cart; cart data is user-session bound.
    useEffect(() => {
        setIsInitialLoad(false)
    }, []);

    // Load user cart when authenticated. Clear cart immediately when signed out.
    useEffect(() => {
        if (isInitialLoad || status === 'loading') return

        if (!session) {
            setCartItems([])
            setIsCartHydrated(false)
            localStorage.removeItem('cart')
            return
        }

        const fetchCart = async () => {
            try {
                const res = await fetch('/api/user/sync')
                if (res.ok) {
                    const data = await res.json()
                    setCartItems(Array.isArray(data.cart) ? data.cart : [])
                } else {
                    setCartItems([])
                }
            } catch (e) {
                console.error("Failed to fetch cart from server", e)
                setCartItems([])
            } finally {
                setIsCartHydrated(true)
            }
        }

        fetchCart()
    }, [session, status, isInitialLoad])

    // Sync cart only for authenticated users after server cart is hydrated.
    useEffect(() => {
        if (isInitialLoad || !session || !isCartHydrated) return;

        localStorage.setItem('cart', JSON.stringify(cartItems));

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
    }, [cartItems, session, isInitialLoad, isCartHydrated]);

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
