"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

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
    const { data: session } = useSession()
    const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
    const [isInitialLoad, setIsInitialLoad] = useState(true)

    // Initial load from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('wishlist');
        if (saved) {
            try {
                setWishlistItems(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse wishlist", e);
            }
        }
        setIsInitialLoad(false)
    }, []);

    // Load from server when session is available
    useEffect(() => {
        if (session && !isInitialLoad) {
            const fetchWishlist = async () => {
                try {
                    const res = await fetch('/api/user/sync')
                    if (res.ok) {
                        const data = await res.json()
                        if (data.wishlist && data.wishlist.length > 0) {
                            // Merge or use server data (using server data for persistence)
                            setWishlistItems(data.wishlist)
                        }
                    }
                } catch (e) {
                    console.error("Failed to fetch wishlist from server", e)
                }
            }
            fetchWishlist()
        }
    }, [session, isInitialLoad])

    // Save to localStorage and sync to server
    useEffect(() => {
        if (isInitialLoad) return;

        localStorage.setItem('wishlist', JSON.stringify(wishlistItems));

        if (session) {
            const syncToServer = async () => {
                try {
                    await fetch('/api/user/sync', {
                        method: 'POST',
                        body: JSON.stringify({ wishlist: wishlistItems }),
                    })
                } catch (e) {
                    console.error("Failed to sync wishlist to server", e)
                }
            }
            // Debounce or sync immediately? For this scale, sync is okay
            const timer = setTimeout(syncToServer, 1000)
            return () => clearTimeout(timer)
        }
    }, [wishlistItems, session, isInitialLoad]);

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
