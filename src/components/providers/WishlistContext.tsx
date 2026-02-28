"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

interface WishlistItem {
    id: string;
    title: string;
    price: number;
    image: string;
    category: string;
}

interface WishlistContextType {
    wishlistItems: WishlistItem[];
    addToWishlist: (item: WishlistItem) => void;
    removeFromWishlist: (id: string) => void;
    isInWishlist: (id: string) => boolean;
    wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
    const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem('wishlist');
        if (saved) {
            try {
                setWishlistItems(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse wishlist", e);
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
    }, [wishlistItems]);

    const addToWishlist = (item: WishlistItem) => {
        setWishlistItems(prev => {
            if (prev.find(i => i.id === item.id)) return prev;
            return [...prev, item];
        });
    };

    const removeFromWishlist = (id: string) => {
        setWishlistItems(prev => prev.filter(item => item.id !== id));
    };

    const isInWishlist = (id: string) => {
        return wishlistItems.some(item => item.id === id);
    };

    const wishlistCount = wishlistItems.length;

    return (
        <WishlistContext.Provider value={{ wishlistItems, addToWishlist, removeFromWishlist, isInWishlist, wishlistCount }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (!context) throw new Error('useWishlist must be used within a WishlistProvider');
    return context;
};
