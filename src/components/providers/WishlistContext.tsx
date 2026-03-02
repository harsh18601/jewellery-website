"use client"

import React, { createContext, useContext, useState, useEffect, useRef } from 'react'
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
    const { data: session, status } = useSession()
    const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>(() => {
        if (typeof window === 'undefined') return []
        const saved = localStorage.getItem('wishlist')
        if (!saved) return []
        try {
            return JSON.parse(saved)
        } catch (e) {
            console.error("Failed to parse wishlist", e)
            return []
        }
    });
    const isHydratedRef = useRef(false)

    // Load from server when session is available.
    useEffect(() => {
        if (status === 'loading') return
        if (!session) {
            setWishlistItems([])
            if (typeof window !== 'undefined') {
                localStorage.removeItem('wishlist')
            }
            isHydratedRef.current = true
            return
        }

        const fetchWishlist = async () => {
            try {
                const res = await fetch('/api/user/sync')
                if (res.ok) {
                    const data = await res.json()
                    if (Array.isArray(data.wishlist)) {
                        setWishlistItems(data.wishlist)
                    }
                }
            } catch (e) {
                console.error("Failed to fetch wishlist from server", e)
            } finally {
                isHydratedRef.current = true
            }
        }
        fetchWishlist()
    }, [session, status])

    // Save to localStorage and sync to server
    useEffect(() => {
        if (!isHydratedRef.current) return;

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
    }, [wishlistItems, session]);

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
