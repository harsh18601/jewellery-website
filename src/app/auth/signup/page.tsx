"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { User, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react'

const SignUpPage = () => {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match')
            setIsLoading(false)
            return
        }

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                }),
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.message || 'Something went wrong')
                setIsLoading(false)
                return
            }

            // Success - redirect to sign-in
            router.push('/auth/signin?registered=true')
        } catch (err) {
            setError('Failed to register. Please try again.')
            setIsLoading(false)
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
                    <h2 className="text-2xl font-bold uppercase tracking-widest mb-2">Create Your Account</h2>
                    <p className="text-sm text-muted-foreground font-serif italic mb-8">
                        Join our exclusive boutique for a personalized experience.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="bg-background border border-primary/10 p-10 shadow-2xl shadow-primary/5"
                >
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-destructive/10 border border-destructive/20 text-destructive text-xs p-4 rounded-sm animate-shake">
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label className="block text-[10px] uppercase tracking-widest font-bold mb-2">Full Name</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary group-focus-within:text-primary transition-colors" />
                                    <input
                                        name="name"
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full bg-muted/20 border border-primary/10 py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-primary transition-all"
                                        placeholder="Enter your name"
                                    />
                                </div>
                            </div>

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
                                <label className="block text-[10px] uppercase tracking-widest font-bold mb-2">Password</label>
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

                            <div>
                                <label className="block text-[10px] uppercase tracking-widest font-bold mb-2">Confirm Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary group-focus-within:text-primary transition-colors" />
                                    <input
                                        name="confirmPassword"
                                        type="password"
                                        required
                                        value={formData.confirmPassword}
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
                            className="w-full bg-primary text-foreground py-4 uppercase tracking-[0.2em] text-xs font-bold hover:bg-primary/90 transition-all flex items-center justify-center group"
                        >
                            {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <>
                                    Join the Boutique <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>

                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-primary/10"></div>
                            </div>
                            <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold">
                                <span className="bg-background px-4 text-muted-foreground">Or Continue With</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            <button
                                type="button"
                                onClick={() => signIn('google', { callbackUrl: '/' })}
                                className="flex w-full items-center justify-center gap-3 bg-muted/10 border border-primary/10 py-4 px-4 text-xs font-bold uppercase tracking-widest hover:bg-muted/20 transition-all group"
                            >
                                <svg className="h-4 w-4" viewBox="0 0 24 24">
                                    <path
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        fill="#4285F4"
                                    />
                                    <path
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        fill="#34A853"
                                    />
                                    <path
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                                        fill="#FBBC05"
                                    />
                                    <path
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        fill="#EA4335"
                                    />
                                </svg>
                                Google
                            </button>
                        </div>

                        <p className="text-center text-[10px] text-muted-foreground uppercase tracking-widest font-medium mt-8">
                            Already have an account?{' '}
                            <Link href="/auth/signin" className="text-primary font-bold border-b border-primary/30 hover:border-primary transition-all">
                                Sign In
                            </Link>
                        </p>
                    </form>
                </motion.div>
            </div>
        </div>
    )
}

export default SignUpPage

