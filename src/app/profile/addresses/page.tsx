"use client"

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Plus, Pencil, Trash2, House, BriefcaseBusiness, Circle } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'

type AddressLabel = 'Home' | 'Work' | 'Other'

type Address = {
    id: number
    label: AddressLabel
    name: string
    phone: string
    pincode: string
    state: string
    city: string
    house: string
    area: string
    landmark?: string
    street?: string
    zip?: string
    isDefault: boolean
    country: string
}

type AddressForm = Omit<Address, 'id' | 'isDefault' | 'country'>

const labelOptions: AddressLabel[] = ['Home', 'Work', 'Other']

const cityStateHints: Record<string, { city: string; state: string }> = {
    '302001': { city: 'Jaipur', state: 'Rajasthan' },
    '302017': { city: 'Jaipur', state: 'Rajasthan' },
    '110001': { city: 'New Delhi', state: 'Delhi' },
    '400001': { city: 'Mumbai', state: 'Maharashtra' },
    '560001': { city: 'Bengaluru', state: 'Karnataka' },
}

const emptyForm: AddressForm = {
    label: 'Home',
    name: '',
    phone: '',
    pincode: '',
    state: '',
    city: '',
    house: '',
    area: '',
    landmark: '',
    street: '',
    zip: '',
}

const mapLegacyAddress = (addr: any): Address => {
    const pincode = String(addr?.pincode || addr?.zip || '').trim()
    const house = String(addr?.house || '').trim()
    const area = String(addr?.area || addr?.street || '').trim()
    const street = area || String(addr?.street || '').trim()
    return {
        id: Number(addr?.id || Date.now()),
        label: (addr?.label as AddressLabel) || 'Home',
        name: String(addr?.name || '').trim(),
        phone: String(addr?.phone || '').trim(),
        pincode,
        state: String(addr?.state || '').trim(),
        city: String(addr?.city || '').trim(),
        house,
        area,
        landmark: String(addr?.landmark || '').trim(),
        street,
        zip: pincode,
        isDefault: Boolean(addr?.isDefault),
        country: String(addr?.country || 'India'),
    }
}

const labelIcon = (label: AddressLabel) => {
    if (label === 'Home') return <House className="h-3.5 w-3.5 text-primary" />
    if (label === 'Work') return <BriefcaseBusiness className="h-3.5 w-3.5 text-primary" />
    return <Circle className="h-3.5 w-3.5 text-primary" />
}

const AddressesPageContent = () => {
    const [addresses, setAddresses] = React.useState<Address[]>([])
    const [isEditing, setIsEditing] = React.useState(false)
    const [currentAddressId, setCurrentAddressId] = React.useState<number | null>(null)
    const [form, setForm] = React.useState<AddressForm>(emptyForm)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false)
    const [pendingDeleteId, setPendingDeleteId] = React.useState<number | null>(null)
    const [isCheckingPin, setIsCheckingPin] = React.useState(false)
    const [pinStatus, setPinStatus] = React.useState('')
    const { data: session } = useSession()
    const searchParams = useSearchParams()
    const router = useRouter()
    const callbackUrl = searchParams.get('callbackUrl') || ''

    React.useEffect(() => {
        if (!session) return
        const fetchAddresses = async () => {
            try {
                const res = await fetch('/api/user/sync')
                if (!res.ok) return
                const data = await res.json()
                const parsed: Address[] = Array.isArray(data.addresses)
                    ? (data.addresses as unknown[]).map((item) => mapLegacyAddress(item))
                    : []
                const normalized: Address[] = parsed.map((addr: Address, idx: number) => ({
                    ...addr,
                    isDefault: parsed.some(a => a.isDefault) ? addr.isDefault : idx === 0,
                }))
                setAddresses(normalized)
            } catch (e) {
                console.error('Failed to load addresses', e)
            }
        }
        fetchAddresses()
    }, [session])

    const syncAddresses = async (nextAddresses: Address[]) => {
        try {
            const payload = nextAddresses.map((addr) => ({
                ...addr,
                street: addr.area || addr.street || '',
                zip: addr.pincode,
            }))
            await fetch('/api/user/sync', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ addresses: payload }),
            })
        } catch (e) {
            console.error('Failed to save addresses', e)
        }
    }

    const resetForm = () => {
        setForm(emptyForm)
        setCurrentAddressId(null)
        setPinStatus('')
    }

    const openCreateForm = () => {
        resetForm()
        setIsEditing(true)
    }

    const openEditForm = (addr: Address) => {
        setCurrentAddressId(addr.id)
        setForm({
            label: addr.label,
            name: addr.name,
            phone: addr.phone,
            pincode: addr.pincode,
            state: addr.state,
            city: addr.city,
            house: addr.house,
            area: addr.area,
            landmark: addr.landmark || '',
            street: addr.street || '',
            zip: addr.zip || addr.pincode,
        })
        setPinStatus('')
        setIsEditing(true)
    }

    const setAsDefault = async (id: number) => {
        const next = addresses.map((addr) => ({ ...addr, isDefault: addr.id === id }))
        setAddresses(next)
        await syncAddresses(next)
    }

    const handleRemove = async (id: number) => {
        const removed = addresses.find((a) => a.id === id)
        const filtered = addresses.filter((a) => a.id !== id)
        const next = removed?.isDefault && filtered.length > 0
            ? filtered.map((addr, idx) => ({ ...addr, isDefault: idx === 0 }))
            : filtered
        setAddresses(next)
        await syncAddresses(next)
    }

    const autoFillFromPincode = async (pin: string) => {
        const clean = pin.replace(/\D/g, '').slice(0, 6)
        if (clean.length !== 6) {
            setPinStatus('')
            return
        }

        if (cityStateHints[clean]) {
            setForm((prev) => ({
                ...prev,
                pincode: clean,
                city: prev.city || cityStateHints[clean].city,
                state: prev.state || cityStateHints[clean].state,
            }))
            setPinStatus('City and state auto-filled from pincode.')
            return
        }

        try {
            setIsCheckingPin(true)
            const res = await fetch(`https://api.postalpincode.in/pincode/${clean}`)
            const data = await res.json()
            const office = data?.[0]?.PostOffice?.[0]
            if (office) {
                setForm((prev) => ({
                    ...prev,
                    pincode: clean,
                    city: prev.city || String(office.District || ''),
                    state: prev.state || String(office.State || ''),
                }))
                setPinStatus('City and state auto-filled from pincode.')
            } else {
                setPinStatus('Could not auto-fill this pincode.')
            }
        } catch {
            setPinStatus('Could not auto-fill this pincode.')
        } finally {
            setIsCheckingPin(false)
        }
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        const pincode = form.pincode.replace(/\D/g, '').slice(0, 6)
        const newAddr: Address = {
            id: currentAddressId || Date.now(),
            label: form.label,
            name: form.name.trim(),
            phone: form.phone.trim(),
            pincode,
            state: form.state.trim(),
            city: form.city.trim(),
            house: form.house.trim(),
            area: form.area.trim(),
            landmark: form.landmark?.trim() || '',
            street: form.area.trim(),
            zip: pincode,
            isDefault: currentAddressId
                ? Boolean(addresses.find((a) => a.id === currentAddressId)?.isDefault)
                : addresses.length === 0,
            country: 'India',
        }

        let nextAddresses: Address[] = []
        if (currentAddressId) {
            nextAddresses = addresses.map((addr) => (addr.id === currentAddressId ? newAddr : addr))
        } else {
            nextAddresses = [...addresses, newAddr]
        }

        if (!nextAddresses.some((addr) => addr.isDefault) && nextAddresses[0]) {
            nextAddresses = nextAddresses.map((addr, idx) => ({ ...addr, isDefault: idx === 0 }))
        }

        setAddresses(nextAddresses)
        await syncAddresses(nextAddresses)
        setIsEditing(false)
        resetForm()

        if (callbackUrl) {
            router.push(callbackUrl)
        }
    }

    return (
        <section className="bg-muted/10 p-10 border border-primary/10 min-h-[60vh] relative">
            <div className="mb-8">
                <h2 className="text-xl font-bold uppercase tracking-widest gold-text">Manage Addresses</h2>
                <p className="mt-2 text-xs text-muted-foreground inline-flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-primary" />
                    Delivering to Jaipur
                </p>
            </div>

            {isEditing ? (
                <motion.form
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onSubmit={handleSave}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-background p-10 border border-primary/20 shadow-[0_14px_34px_rgba(0,0,0,0.32)]"
                >
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold tracking-widest">Address Label</label>
                        <select
                            value={form.label}
                            onChange={(e) => setForm((prev) => ({ ...prev, label: e.target.value as AddressLabel }))}
                            className="w-full p-3 bg-muted/10 border border-primary/10 text-xs outline-none focus:border-primary"
                        >
                            {labelOptions.map((label) => (
                                <option key={label} value={label}>{label}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold tracking-widest">Full Name</label>
                        <input
                            name="name"
                            value={form.name}
                            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                            required
                            className="w-full p-3 bg-muted/10 border border-primary/10 text-xs outline-none focus:border-primary"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold tracking-widest">Phone Number</label>
                        <input
                            name="phone"
                            value={form.phone}
                            onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                            required
                            className="w-full p-3 bg-muted/10 border border-primary/10 text-xs outline-none focus:border-primary"
                            placeholder="+91 98765 43210"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold tracking-widest">Pincode</label>
                        <input
                            name="pincode"
                            value={form.pincode}
                            onChange={(e) => {
                                const next = e.target.value.replace(/\D/g, '').slice(0, 6)
                                setForm((prev) => ({ ...prev, pincode: next, zip: next }))
                                if (next.length === 6) void autoFillFromPincode(next)
                            }}
                            required
                            className="w-full p-3 bg-muted/10 border border-primary/10 text-xs outline-none focus:border-primary"
                            placeholder="302017"
                        />
                        {isCheckingPin && <p className="text-[10px] text-muted-foreground">Checking pincode...</p>}
                        {pinStatus && <p className="text-[10px] text-primary">{pinStatus}</p>}
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold tracking-widest">State</label>
                        <input
                            name="state"
                            value={form.state}
                            onChange={(e) => setForm((prev) => ({ ...prev, state: e.target.value }))}
                            required
                            className="w-full p-3 bg-muted/10 border border-primary/10 text-xs outline-none focus:border-primary"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold tracking-widest">City</label>
                        <input
                            name="city"
                            value={form.city}
                            onChange={(e) => setForm((prev) => ({ ...prev, city: e.target.value }))}
                            required
                            className="w-full p-3 bg-muted/10 border border-primary/10 text-xs outline-none focus:border-primary"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold tracking-widest">House / Building</label>
                        <input
                            name="house"
                            value={form.house}
                            onChange={(e) => setForm((prev) => ({ ...prev, house: e.target.value }))}
                            required
                            className="w-full p-3 bg-muted/10 border border-primary/10 text-xs outline-none focus:border-primary"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold tracking-widest">Area / Street</label>
                        <input
                            name="area"
                            value={form.area}
                            onChange={(e) => setForm((prev) => ({ ...prev, area: e.target.value, street: e.target.value }))}
                            required
                            className="w-full p-3 bg-muted/10 border border-primary/10 text-xs outline-none focus:border-primary"
                        />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] uppercase font-bold tracking-widest">Landmark (Optional)</label>
                        <input
                            name="landmark"
                            value={form.landmark}
                            onChange={(e) => setForm((prev) => ({ ...prev, landmark: e.target.value }))}
                            className="w-full p-3 bg-muted/10 border border-primary/10 text-xs outline-none focus:border-primary"
                        />
                    </div>
                    <div className="md:col-span-2 pt-4 flex space-x-4">
                        <button type="submit" className="bg-primary text-foreground px-8 py-3 text-[10px] uppercase font-bold tracking-widest hover:bg-primary/90 transition-all cursor-pointer">Save Address</button>
                        <button type="button" onClick={() => { setIsEditing(false); resetForm() }} className="border border-primary/20 px-8 py-3 text-[10px] uppercase font-bold tracking-widest hover:bg-secondary hover:text-foreground transition-all cursor-pointer">Cancel</button>
                    </div>
                </motion.form>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <AnimatePresence initial={false}>
                        {addresses.map((addr) => (
                            <motion.div
                                key={addr.id}
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                className="p-10 bg-background border border-primary/20 relative group transition-all hover:border-primary/55 hover:shadow-[0_16px_34px_rgba(212,175,55,0.12)]"
                            >
                                <div className="flex items-start justify-between mb-5">
                                    <div>
                                        <h3 className="text-xs font-bold uppercase tracking-widest mb-1 flex items-center gap-2">
                                            <MapPin className="h-3 w-3 text-primary" />
                                            Shipping Address
                                        </h3>
                                        <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground inline-flex items-center gap-1">
                                            {labelIcon(addr.label)}
                                            {addr.label}
                                        </p>
                                    </div>
                                    {addr.isDefault && (
                                        <span className="text-[10px] uppercase tracking-widest font-bold text-primary border border-primary/40 px-2 py-1">
                                            Default
                                        </span>
                                    )}
                                </div>

                                <div className="space-y-2 text-xs leading-relaxed">
                                    <p className="font-bold text-foreground">{addr.name}</p>
                                    <p className="text-muted-foreground">
                                        {addr.house}, {addr.area}
                                        {addr.landmark ? `, ${addr.landmark}` : ''}, {addr.city}, {addr.state} {addr.pincode}
                                    </p>
                                    <p className="text-muted-foreground">Phone: {addr.phone}</p>
                                    <p className="text-[10px] uppercase tracking-widest font-bold text-emerald-400">
                                        {addr.pincode.length === 6 ? 'Deliverable' : 'Delivery not available'}
                                    </p>
                                </div>

                                <div className="mt-6 flex items-center gap-4 text-[10px] uppercase tracking-widest font-bold">
                                    <button
                                        onClick={() => openEditForm(addr)}
                                        className="inline-flex items-center gap-1.5 border-b border-secondary pb-1 hover:text-primary hover:border-primary transition-colors cursor-pointer"
                                    >
                                        <Pencil className="h-3 w-3" />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => {
                                            setPendingDeleteId(addr.id)
                                            setIsDeleteModalOpen(true)
                                        }}
                                        className="inline-flex items-center gap-1.5 border-b border-secondary pb-1 hover:text-destructive hover:border-destructive transition-colors cursor-pointer"
                                    >
                                        <Trash2 className="h-3 w-3" />
                                        Remove
                                    </button>
                                    {!addr.isDefault && (
                                        <button
                                            onClick={() => void setAsDefault(addr.id)}
                                            className="border-b border-secondary pb-1 hover:text-primary hover:border-primary transition-colors cursor-pointer"
                                        >
                                            Set Default
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    <motion.div
                        layout
                        onClick={openCreateForm}
                        className="p-10 border-2 border-dashed border-primary/15 flex flex-col items-center justify-center text-center space-y-4 hover:border-primary/40 hover:shadow-[0_16px_34px_rgba(212,175,55,0.1)] transition-all cursor-pointer group min-h-[220px]"
                    >
                        <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                            <Plus className="h-6 w-6 text-primary" />
                        </div>
                        <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Add New Address</p>
                    </motion.div>
                </div>
            )}

            <AnimatePresence>
                {isDeleteModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[120] bg-black/70 flex items-center justify-center px-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="w-full max-w-md bg-background border border-primary/20 p-8 space-y-6"
                        >
                            <h3 className="text-xl font-bold text-center">Delete address?</h3>
                            <p className="text-sm text-muted-foreground text-center">
                                This action cannot be undone.
                            </p>
                            <div className="flex items-center justify-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsDeleteModalOpen(false)
                                        setPendingDeleteId(null)
                                    }}
                                    className="px-6 py-3 border border-primary/30 text-primary text-xs font-bold uppercase tracking-widest hover:bg-primary/10 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={async () => {
                                        if (pendingDeleteId !== null) {
                                            await handleRemove(pendingDeleteId)
                                        }
                                        setIsDeleteModalOpen(false)
                                        setPendingDeleteId(null)
                                    }}
                                    className="px-6 py-3 bg-destructive text-destructive-foreground text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-all"
                                >
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    )
}

const AddressesPage = () => {
    return (
        <React.Suspense
            fallback={
                <section className="bg-muted/10 p-10 border border-primary/10 min-h-[60vh] relative flex items-center justify-center">
                    <p className="text-sm text-muted-foreground font-serif italic">Loading addresses...</p>
                </section>
            }
        >
            <AddressesPageContent />
        </React.Suspense>
    )
}

export default AddressesPage
