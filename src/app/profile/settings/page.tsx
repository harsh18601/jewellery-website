"use client"

import React, { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Save, User, Shield, Bell } from 'lucide-react'

const SettingsPage = () => {
    const [isSaving, setIsSaving] = useState(false)
    const [showPasswordModal, setShowPasswordModal] = useState(false)
    const [saveStatus, setSaveStatus] = useState('')
    const [profile, setProfile] = useState({
        name: '',
        email: '',
    })
    const [passwordMeta, setPasswordMeta] = useState<{ passwordUpdatedAt?: string | null }>({})
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    })
    const [passwordError, setPasswordError] = useState('')

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const res = await fetch('/api/user/sync')
                if (!res.ok) return
                const data = await res.json()
                setProfile({
                    name: data.name || '',
                    email: data.email || '',
                })
                setPasswordMeta({
                    passwordUpdatedAt: data.passwordUpdatedAt || null,
                })
            } catch (e) {
                console.error('Failed to load settings', e)
            }
        }

        loadProfile()
    }, [])

    const passwordChangedLabel = useMemo(() => {
        if (!passwordMeta.passwordUpdatedAt) return 'Password has not been changed yet'
        const changedAt = new Date(passwordMeta.passwordUpdatedAt)
        const now = new Date()
        const diffMs = now.getTime() - changedAt.getTime()
        const day = 24 * 60 * 60 * 1000
        const days = Math.max(0, Math.floor(diffMs / day))
        if (days < 1) return 'Password changed today'
        if (days === 1) return 'Password changed 1 day ago'
        if (days < 30) return `Password changed ${days} days ago`
        const months = Math.floor(days / 30)
        if (months === 1) return 'Password changed 1 month ago'
        return `Password changed ${months} months ago`
    }, [passwordMeta.passwordUpdatedAt])

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)
        setSaveStatus('')
        try {
            const res = await fetch('/api/user/sync', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: profile.name,
                    email: profile.email,
                }),
            })
            const data = await res.json()
            if (!res.ok) {
                setSaveStatus(data.message || 'Failed to save changes.')
            } else {
                setSaveStatus('Changes saved successfully!')
                setTimeout(() => setSaveStatus(''), 3000)
            }
        } catch {
            setSaveStatus('Failed to save changes.')
        } finally {
            setIsSaving(false)
        }
    }

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault()
        setPasswordError('')

        if (passwordForm.newPassword.length < 8) {
            setPasswordError('New password must be at least 8 characters.')
            return
        }
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setPasswordError('New password and confirmation do not match.')
            return
        }

        try {
            const res = await fetch('/api/user/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentPassword: passwordForm.currentPassword,
                    newPassword: passwordForm.newPassword,
                }),
            })
            const data = await res.json()
            if (!res.ok) {
                setPasswordError(data.message || 'Failed to update password.')
                return
            }

            setPasswordMeta({ passwordUpdatedAt: data.passwordUpdatedAt || new Date().toISOString() })
            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
            setShowPasswordModal(false)
            setSaveStatus('Password updated successfully!')
            setTimeout(() => setSaveStatus(''), 3000)
        } catch {
            setPasswordError('Failed to update password.')
        }
    }

    return (
        <section className="bg-muted/10 p-10 border border-primary/10 min-h-[60vh] relative">
            <h2 className="text-xl font-bold uppercase tracking-widest mb-8 gold-text">Account Settings</h2>

            <form onSubmit={handleSave} className="space-y-12 max-w-2xl">
                <div className="space-y-6">
                    <h3 className="text-xs font-bold uppercase tracking-widest flex items-center text-primary">
                        <User className="h-4 w-4 mr-2" />
                        Personal Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Full Name</label>
                            <input
                                name="name"
                                className="w-full bg-background border border-primary/10 p-4 text-xs font-serif italic outline-none focus:border-primary transition-all"
                                value={profile.name}
                                onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Email Address</label>
                            <input
                                name="email"
                                dir="ltr"
                                className="w-full bg-background border border-primary/10 p-4 text-xs font-serif italic outline-none focus:border-primary transition-all"
                                value={profile.email}
                                onChange={(e) => setProfile((prev) => ({ ...prev, email: e.target.value }))}
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <h3 className="text-xs font-bold uppercase tracking-widest flex items-center text-primary">
                        <Shield className="h-4 w-4 mr-2" />
                        Security
                    </h3>
                    <div className="space-y-4">
                        <button
                            type="button"
                            onClick={() => setShowPasswordModal(true)}
                            className="text-[10px] uppercase tracking-widest font-bold border border-secondary px-6 py-3 hover:bg-secondary hover:text-foreground transition-all cursor-pointer"
                        >Change Password</button>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{passwordChangedLabel}</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <h3 className="text-xs font-bold uppercase tracking-widest flex items-center text-primary">
                        <Bell className="h-4 w-4 mr-2" />
                        Preferences
                    </h3>
                    <div className="flex items-center space-x-3">
                        <input type="checkbox" id="newsletter" className="w-4 h-4 border-primary text-primary focus:ring-primary h-4 w-4 text-primary border-muted rounded cursor-pointer" defaultChecked />
                        <label htmlFor="newsletter" className="text-xs font-serif italic">Received curated luxury news and arrivals</label>
                    </div>
                </div>

                <div className="pt-8 border-t border-primary/10 flex flex-col items-center gap-4">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="flex items-center space-x-2 bg-primary text-foreground px-8 py-4 text-xs uppercase tracking-widest font-bold hover:bg-primary/90 transition-all cursor-pointer disabled:opacity-50"
                    >
                        <Save className="h-4 w-4" />
                        <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                    </button>
                    {saveStatus && (
                        <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-[10px] uppercase tracking-widest font-bold text-primary"
                        >
                            {saveStatus}
                        </motion.span>
                    )}
                </div>
            </form>

            <AnimatePresence>
                {showPasswordModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-background border border-primary/20 p-10 max-w-md w-full shadow-2xl space-y-8"
                        >
                            <h3 className="text-xl font-bold uppercase tracking-widest gold-text">Update Password</h3>
                            <form onSubmit={handlePasswordChange} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest font-bold">Current Password</label>
                                    <input
                                        type="password"
                                        required
                                        value={passwordForm.currentPassword}
                                        onChange={(e) => setPasswordForm((prev) => ({ ...prev, currentPassword: e.target.value }))}
                                        className="w-full bg-muted/10 border border-primary/10 p-4 text-xs outline-none focus:border-primary"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest font-bold">New Password</label>
                                    <input
                                        type="password"
                                        required
                                        value={passwordForm.newPassword}
                                        onChange={(e) => setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))}
                                        className="w-full bg-muted/10 border border-primary/10 p-4 text-xs outline-none focus:border-primary"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest font-bold">Confirm New Password</label>
                                    <input
                                        type="password"
                                        required
                                        value={passwordForm.confirmPassword}
                                        onChange={(e) => setPasswordForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                                        className="w-full bg-muted/10 border border-primary/10 p-4 text-xs outline-none focus:border-primary"
                                    />
                                </div>
                                {passwordError && <p className="text-xs text-destructive">{passwordError}</p>}
                                <div className="flex space-x-4 pt-4">
                                    <button type="submit" className="flex-grow bg-primary text-foreground px-8 py-4 text-xs uppercase tracking-widest font-bold hover:bg-primary/90 transition-all cursor-pointer">Update</button>
                                    <button type="button" onClick={() => setShowPasswordModal(false)} className="flex-grow border border-primary/20 text-foreground px-8 py-4 text-xs uppercase tracking-widest font-bold hover:bg-secondary hover:text-foreground transition-all cursor-pointer">Cancel</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </section>
    )
}

export default SettingsPage

