"use client"

import React, { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Save,
    User,
    Shield,
    Bell,
    AlertTriangle,
    ChevronRight,
    CheckCircle2,
    Smartphone,
} from 'lucide-react'

type Preferences = {
    emailNotifications: boolean
    orderUpdates: boolean
    promotions: boolean
    newArrivals: boolean
    wishlistAlerts: boolean
}

const defaultPreferences: Preferences = {
    emailNotifications: true,
    orderUpdates: true,
    promotions: true,
    newArrivals: true,
    wishlistAlerts: true,
}

const SettingsPage = () => {
    const [isSaving, setIsSaving] = useState(false)
    const [showPasswordModal, setShowPasswordModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [deleteConfirmText, setDeleteConfirmText] = useState('')
    const [saveStatus, setSaveStatus] = useState('')
    const [statusTone, setStatusTone] = useState<'success' | 'error' | 'neutral'>('neutral')
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        phone: '',
        birthday: '',
    })
    const [passwordMeta, setPasswordMeta] = useState<{ passwordUpdatedAt?: string | null }>({})
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    })
    const [passwordError, setPasswordError] = useState('')
    const [preferences, setPreferences] = useState<Preferences>(defaultPreferences)
    const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null)
    const [initialSnapshot, setInitialSnapshot] = useState('')
    const [hasAvatar, setHasAvatar] = useState(false)
    const [hasAddress, setHasAddress] = useState(false)

    const createSnapshot = React.useCallback((nextProfile: typeof profile, nextPreferences: Preferences) =>
        JSON.stringify({
            name: nextProfile.name.trim(),
            email: nextProfile.email.trim(),
            phone: nextProfile.phone.trim(),
            birthday: nextProfile.birthday,
            preferences: nextPreferences,
        }), [])

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const res = await fetch('/api/user/sync')
                if (!res.ok) return
                const data = await res.json()
                const nextProfile = {
                    name: data.name || '',
                    email: data.email || '',
                    phone: data.phone || '',
                    birthday: data.birthday || '',
                }
                const nextPreferences = { ...defaultPreferences, ...(data.preferences || {}) }

                setProfile(nextProfile)
                setPreferences(nextPreferences)
                setPasswordMeta({
                    passwordUpdatedAt: data.passwordUpdatedAt || null,
                })
                setHasAvatar(Boolean(data.avatar))
                setHasAddress(Array.isArray(data.addresses) ? data.addresses.length > 0 : Boolean(data.address))
                setInitialSnapshot(createSnapshot(nextProfile, nextPreferences))
            } catch (e) {
                console.error('Failed to load settings', e)
            }
        }

        loadProfile()
    }, [createSnapshot])

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

    const profileCompletion = useMemo(() => {
        const fields = [
            Boolean(profile.name.trim()),
            Boolean(profile.email.trim()),
            Boolean(profile.phone.trim()),
            Boolean(profile.birthday.trim()),
        ]
        const done = fields.filter(Boolean).length
        return Math.round((done / fields.length) * 100)
    }, [profile])

    const inputClass =
        "w-full bg-background border border-primary/20 p-4 text-xs font-serif italic outline-none focus:border-primary focus:shadow-[0_0_0_1px_rgba(212,175,55,0.38),0_0_22px_rgba(212,175,55,0.2)] transition-all"

    const profileChecklist = useMemo(
        () => [
            { label: 'Complete your profile', done: Boolean(profile.name.trim()) && Boolean(profile.email.trim()) },
            { label: 'Add phone number', done: Boolean(profile.phone.trim()) },
            { label: 'Upload profile photo', done: hasAvatar },
            { label: 'Add address', done: hasAddress },
        ],
        [hasAddress, hasAvatar, profile.email, profile.name, profile.phone]
    )

    const hasUnsavedChanges = useMemo(() => {
        if (!initialSnapshot) return false
        return createSnapshot(profile, preferences) !== initialSnapshot
    }, [createSnapshot, initialSnapshot, preferences, profile])

    const autosaveLabel = useMemo(() => {
        if (isSaving) return 'Saving changes...'
        if (hasUnsavedChanges) return 'Unsaved changes'
        if (lastSavedAt) return 'Saved just now'
        return 'No recent changes'
    }, [hasUnsavedChanges, isSaving, lastSavedAt])

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)
        setSaveStatus('')
        setStatusTone('neutral')
        try {
            const res = await fetch('/api/user/sync', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: profile.name,
                    email: profile.email,
                    phone: profile.phone,
                    birthday: profile.birthday,
                    preferences,
                }),
            })
            const data = await res.json()
            if (!res.ok) {
                setStatusTone('error')
                setSaveStatus(data.message || 'Failed to save changes.')
            } else {
                setStatusTone('success')
                setSaveStatus('Profile updated successfully.')
                setLastSavedAt(new Date())
                setInitialSnapshot(createSnapshot(profile, preferences))
                setTimeout(() => setSaveStatus(''), 3000)
            }
        } catch {
            setStatusTone('error')
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
            setStatusTone('success')
            setSaveStatus('Password updated successfully.')
            setTimeout(() => setSaveStatus(''), 3000)
        } catch {
            setPasswordError('Failed to update password.')
        }
    }

    const handleDeleteRequest = () => {
        if (deleteConfirmText !== 'DELETE') {
            setStatusTone('error')
            setSaveStatus('Please type DELETE exactly to confirm account deletion.')
            return
        }
        setShowDeleteModal(false)
        setDeleteConfirmText('')
        setStatusTone('error')
        setSaveStatus('Delete request confirmed. Our team will contact you to complete this action.')
    }

    return (
        <section className="bg-muted/10 p-10 border border-primary/10 min-h-[60vh] relative space-y-10">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold inline-flex items-center">
                Account <ChevronRight className="h-3 w-3 mx-1" /> Settings
            </div>
            <h2 className="text-xl font-bold uppercase tracking-widest gold-text">Account Settings</h2>

            <div className="border border-primary/20 bg-background p-5 shadow-[0_10px_30px_rgba(0,0,0,0.4)]">
                <div className="flex items-center justify-between mb-2">
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Profile Completion</p>
                    <p className="text-[10px] uppercase tracking-widest text-primary font-bold">{profileCompletion}% Complete</p>
                </div>
                <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                    <div className="h-full bg-primary transition-all duration-500" style={{ width: `${profileCompletion}%` }} />
                </div>
                <div className="mt-4 space-y-2">
                    {profileChecklist.map((item) => (
                        <div key={item.label} className="flex items-center gap-2 text-xs">
                            <CheckCircle2 className={`h-3.5 w-3.5 ${item.done ? 'text-primary' : 'text-muted-foreground/50'}`} />
                            <span className={item.done ? 'text-foreground/90' : 'text-muted-foreground'}>{item.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            <form onSubmit={handleSave} className="space-y-10 max-w-3xl">
                <div className="border border-primary/15 bg-background/60 p-6 space-y-5 shadow-[0_10px_30px_rgba(0,0,0,0.4)]">
                    <h3 className="text-sm font-bold uppercase tracking-[0.15em] flex items-center text-primary">
                        <User className="h-4 w-4 mr-2" />
                        Personal Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Full Name</label>
                            <input
                                name="name"
                                className={inputClass}
                                value={profile.name}
                                onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Email Address</label>
                            <input
                                name="email"
                                dir="ltr"
                                className={inputClass}
                                value={profile.email}
                                onChange={(e) => setProfile((prev) => ({ ...prev, email: e.target.value }))}
                            />
                            <p className="text-[11px] text-muted-foreground">Changing email will require verification.</p>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Phone Number</label>
                            <input
                                name="phone"
                                className={inputClass}
                                value={profile.phone}
                                onChange={(e) => setProfile((prev) => ({ ...prev, phone: e.target.value }))}
                                placeholder="+91 98765 43210"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Birthday (Optional)</label>
                            <input
                                name="birthday"
                                type="date"
                                className={inputClass}
                                value={profile.birthday}
                                onChange={(e) => setProfile((prev) => ({ ...prev, birthday: e.target.value }))}
                            />
                        </div>
                    </div>
                </div>

                <div className="border border-primary/15 bg-background/60 p-6 space-y-5 shadow-[0_10px_30px_rgba(0,0,0,0.4)]">
                    <h3 className="text-sm font-bold uppercase tracking-[0.15em] flex items-center text-primary">
                        <Shield className="h-4 w-4 mr-2" />
                        Security
                    </h3>
                    <div className="space-y-4">
                        <button
                            type="button"
                            onClick={() => setShowPasswordModal(true)}
                            className="text-[10px] uppercase tracking-widest font-bold border border-secondary px-6 py-3 hover:bg-secondary hover:text-foreground transition-all cursor-pointer"
                        >
                            Change Password
                        </button>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{passwordChangedLabel}</p>
                        <div className="text-[11px] text-muted-foreground/70 space-y-1">
                            <p>Two Factor Authentication: Coming soon</p>
                            <p>Last login activity: Jaipur, India - Chrome on Windows</p>
                        </div>
                        <div className="border border-primary/20 bg-background/70 p-4 space-y-3">
                            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Active Devices</p>
                            <div className="space-y-2 text-xs">
                                <p className="inline-flex items-center gap-2"><Smartphone className="h-3.5 w-3.5 text-primary" /> Chrome - Jaipur</p>
                                <p className="inline-flex items-center gap-2"><Smartphone className="h-3.5 w-3.5 text-primary" /> iPhone - Delhi</p>
                            </div>
                            <button
                                type="button"
                                className="text-[10px] uppercase tracking-widest font-bold border border-primary/25 px-4 py-2 hover:border-primary/60 hover:bg-primary/5 transition-all"
                            >
                                Log Out Of All Devices
                            </button>
                        </div>
                    </div>
                </div>

                <div className="border border-primary/15 bg-background/60 p-6 space-y-5 shadow-[0_10px_30px_rgba(0,0,0,0.4)]">
                    <h3 className="text-sm font-bold uppercase tracking-[0.15em] flex items-center text-primary">
                        <Bell className="h-4 w-4 mr-2" />
                        Preferences
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                        {[
                            ['emailNotifications', 'Email Notifications'],
                            ['orderUpdates', 'Order Updates'],
                            ['promotions', 'Promotions'],
                            ['newArrivals', 'New Arrivals'],
                            ['wishlistAlerts', 'Wishlist Alerts'],
                        ].map(([key, label]) => (
                            <label key={key} className="flex items-center justify-between gap-3 border border-primary/10 p-3">
                                <span className="text-xs">{label}</span>
                                <input
                                    type="checkbox"
                                    checked={Boolean(preferences[key as keyof Preferences])}
                                    onChange={(e) =>
                                        setPreferences((prev) => ({ ...prev, [key]: e.target.checked }))
                                    }
                                    className="h-4 w-4 rounded border-primary/30 bg-background text-primary focus:ring-primary"
                                />
                            </label>
                        ))}
                    </div>
                </div>

                <div className="pt-2 flex flex-col items-start gap-3">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="flex items-center space-x-2 bg-gradient-to-r from-primary to-primary/80 text-foreground px-8 py-4 text-xs uppercase tracking-widest font-bold hover:from-primary/95 hover:to-primary transition-all cursor-pointer disabled:opacity-50 shadow-[0_12px_24px_rgba(212,175,55,0.25)]"
                    >
                        <Save className="h-4 w-4" />
                        <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                    </button>
                    <p className={`text-[10px] uppercase tracking-widest font-bold ${hasUnsavedChanges ? 'text-amber-300' : 'text-muted-foreground'}`}>
                        {autosaveLabel}
                    </p>
                    {saveStatus && (
                        <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`text-[10px] uppercase tracking-widest font-bold ${statusTone === 'error' ? 'text-destructive' : 'text-primary'}`}
                        >
                            {saveStatus}
                        </motion.span>
                    )}
                </div>
            </form>

            <div className="border border-destructive/30 bg-[rgba(88,16,16,0.28)] p-6 max-w-3xl shadow-[0_10px_30px_rgba(0,0,0,0.4)]">
                <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-destructive inline-flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Danger Zone
                </h3>
                <p className="text-xs text-muted-foreground mt-2">Manage sensitive account actions carefully.</p>
                <div className="mt-4 flex flex-wrap gap-3">
                    <button type="button" className="px-4 py-2 text-[10px] uppercase tracking-widest font-bold border border-destructive/40 text-destructive hover:bg-destructive/10 transition-colors">Download My Data</button>
                    <button
                        type="button"
                        onClick={() => setShowDeleteModal(true)}
                        className="px-4 py-2 text-[10px] uppercase tracking-widest font-bold border border-destructive/40 text-destructive hover:bg-destructive/10 transition-colors"
                    >
                        Delete Account
                    </button>
                </div>
            </div>

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
                                        className={inputClass}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest font-bold">New Password</label>
                                    <input
                                        type="password"
                                        required
                                        value={passwordForm.newPassword}
                                        onChange={(e) => setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))}
                                        className={inputClass}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest font-bold">Confirm New Password</label>
                                    <input
                                        type="password"
                                        required
                                        value={passwordForm.confirmPassword}
                                        onChange={(e) => setPasswordForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                                        className={inputClass}
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
                {showDeleteModal && (
                    <div className="fixed inset-0 z-[105] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.92 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.92 }}
                            className="bg-background border border-destructive/30 p-8 max-w-md w-full shadow-2xl space-y-6"
                        >
                            <h3 className="text-lg font-bold uppercase tracking-widest text-destructive">Delete Account</h3>
                            <p className="text-xs text-muted-foreground">Type DELETE to confirm this action.</p>
                            <input
                                value={deleteConfirmText}
                                onChange={(e) => setDeleteConfirmText(e.target.value)}
                                className="w-full bg-background border border-destructive/30 p-4 text-xs outline-none focus:border-destructive"
                                placeholder="DELETE"
                            />
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={handleDeleteRequest}
                                    className="flex-1 px-4 py-3 text-[10px] uppercase tracking-widest font-bold border border-destructive/50 text-destructive hover:bg-destructive/10 transition-colors"
                                >
                                    Confirm Delete
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowDeleteModal(false)
                                        setDeleteConfirmText('')
                                    }}
                                    className="flex-1 px-4 py-3 text-[10px] uppercase tracking-widest font-bold border border-primary/20 hover:bg-secondary transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </section>
    )
}

export default SettingsPage
