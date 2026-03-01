"use client"

import React, { useState, useEffect, Suspense } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Mail, Lock, LogIn, Loader2, CheckCircle2 } from 'lucide-react'

const SignInPageContent = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [registered, setRegistered] = useState(false)

    useEffect(() => {
        if (searchParams.get('registered')) {
            setRegistered(true)
        }
        if (searchParams.get('error')) {
            setError('Invalid email or password')
        }
    }, [searchParams])

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)

        const result = await signIn('credentials', {
            redirect: false,
            email: formData.email,
            password: formData.password,
        })

        if (result?.error) {
            setError('Invalid credentials. Please try again.')
            setIsLoading(false)
        } else {
            router.push('/profile')
            router.refresh()
        }
    }

    return (
        <div className="min-h-screen bg-background flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-[100px]" />
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-[100px]" />

            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                >
                    <Link href="/" className="text-3xl font-bold tracking-tighter gold-text uppercase mb-8 inline-block">
                        Radha Govind
                    </Link>
                    <h2 className="text-2xl font-bold uppercase tracking-widest mb-2">Welcome Back</h2>
                    <p className="text-sm text-muted-foreground font-serif italic mb-8">
                        Sign in to access your exclusive boutique experience.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="bg-background border border-primary/10 p-10 shadow-2xl shadow-primary/5"
                >
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {registered && !error && (
                            <div className="bg-primary/10 border border-primary/20 text-primary text-[10px] p-4 rounded-sm flex items-center mb-6 uppercase tracking-widest font-bold">
                                <CheckCircle2 className="h-4 w-4 mr-2" /> Account created! Please sign in.
                            </div>
                        )}

                        {error && (
                            <div className="bg-destructive/10 border border-destructive/20 text-destructive text-xs p-4 rounded-sm">
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label className="block text-[10px] uppercase tracking-widest font-bold mb-2">Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary group-focus-within:text-primary transition-colors" />
                                    <input
                                        name="email"
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full bg-muted/20 border border-primary/10 py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-primary transition-all"
                                        placeholder="your@email.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-[10px] uppercase tracking-widest font-bold">Password</label>
                                    <Link href="#" className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground hover:text-primary">Forgot?</Link>
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary group-focus-within:text-primary transition-colors" />
                                    <input
                                        name="password"
                                        type="password"
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full bg-muted/20 border border-primary/10 py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-primary transition-all"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-primary text-background py-4 uppercase tracking-[0.2em] text-xs font-bold hover:bg-primary/90 transition-all flex items-center justify-center group"
                        >
                            {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <>
                                    Sign In <LogIn className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>

                        <p className="text-center text-[10px] text-muted-foreground uppercase tracking-widest font-medium">
                            Don't have an account?{' '}
                            <Link href="/auth/signup" className="text-primary font-bold border-b border-primary/30 hover:border-primary transition-all">
                                Create One
                            </Link>
                        </p>
                    </form>
                </motion.div>
            </div>
        </div>
    )
}

const SignInPage = () => {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-background flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        }>
            <SignInPageContent />
        </Suspense>
    )
}

export default SignInPage
