"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { MapPin, Plus } from 'lucide-react'

const AddressesPage = () => {
    const [addresses, setAddresses] = React.useState<any[]>([])
    const [isEditing, setIsEditing] = React.useState(false)
    const [currentAddress, setCurrentAddress] = React.useState<any>(null)

    const handleRemove = (id: number) => {
        setAddresses(addresses.filter(a => a.id !== id))
    }

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault()
        const formData = new FormData(e.target as HTMLFormElement)
        const newAddr = {
            id: currentAddress?.id || Date.now(),
            name: formData.get('name') as string,
            street: formData.get('street') as string,
            city: formData.get('city') as string,
            state: formData.get('state') as string,
            zip: formData.get('zip') as string,
            phone: formData.get('phone') as string,
            isDefault: currentAddress?.isDefault || false
        }

        if (currentAddress) {
            setAddresses(addresses.map(a => a.id === currentAddress.id ? newAddr : a))
        } else {
            setAddresses([...addresses, newAddr])
        }
        setIsEditing(false)
        setCurrentAddress(null)
    }

    return (
        <section className="bg-muted/10 p-10 border border-primary/10 min-h-[60vh] relative">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold uppercase tracking-widest gold-text">Manage Addresses</h2>
                {!isEditing && (
                    <button
                        onClick={() => { setCurrentAddress(null); setIsEditing(true); }}
                        className="flex items-center space-x-2 text-[10px] uppercase tracking-widest font-bold bg-primary text-foreground px-4 py-2 hover:bg-primary/90 transition-all cursor-pointer"
                    >
                        <Plus className="h-3 w-3" />
                        <span>Add New</span>
                    </button>
                )}
            </div>

            {isEditing ? (
                <motion.form
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onSubmit={handleSave}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-background p-8 border border-primary/20"
                >
                    <div className="space-y-4">
                        <label className="text-[10px] uppercase font-bold tracking-widest">Full Name</label>
                        <input name="name" defaultValue={currentAddress?.name} required className="w-full p-3 bg-muted/10 border border-primary/10 text-xs outline-none focus:border-primary" />
                    </div>
                    <div className="space-y-4">
                        <label className="text-[10px] uppercase font-bold tracking-widest">Phone</label>
                        <input name="phone" defaultValue={currentAddress?.phone} required className="w-full p-3 bg-muted/10 border border-primary/10 text-xs outline-none focus:border-primary" />
                    </div>
                    <div className="md:col-span-2 space-y-4">
                        <label className="text-[10px] uppercase font-bold tracking-widest">Street Address</label>
                        <input name="street" defaultValue={currentAddress?.street} required className="w-full p-3 bg-muted/10 border border-primary/10 text-xs outline-none focus:border-primary" />
                    </div>
                    <div className="grid grid-cols-3 gap-4 md:col-span-2">
                        <div className="space-y-4">
                            <label className="text-[10px] uppercase font-bold tracking-widest">City</label>
                            <input name="city" defaultValue={currentAddress?.city} required className="w-full p-3 bg-muted/10 border border-primary/10 text-xs outline-none focus:border-primary" />
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] uppercase font-bold tracking-widest">State</label>
                            <input name="state" defaultValue={currentAddress?.state} required className="w-full p-3 bg-muted/10 border border-primary/10 text-xs outline-none focus:border-primary" />
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] uppercase font-bold tracking-widest">ZIP</label>
                            <input name="zip" defaultValue={currentAddress?.zip} required className="w-full p-3 bg-muted/10 border border-primary/10 text-xs outline-none focus:border-primary" />
                        </div>
                    </div>
                    <div className="md:col-span-2 pt-4 flex space-x-4">
                        <button type="submit" className="bg-primary text-foreground px-8 py-3 text-[10px] uppercase font-bold tracking-widest hover:bg-primary/90 transition-all cursor-pointer">Save Address</button>
                        <button type="button" onClick={() => setIsEditing(false)} className="border border-primary/20 px-8 py-3 text-[10px] uppercase font-bold tracking-widest hover:bg-secondary hover:text-foreground transition-all cursor-pointer">Cancel</button>
                    </div>
                </motion.form>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {addresses.map(addr => (
                        <div key={addr.id} className="p-8 bg-background border border-primary/20 relative group">
                            {addr.isDefault && <div className="absolute top-4 right-4 text-[10px] uppercase tracking-widest font-bold text-primary">Default</div>}
                            <h3 className="text-xs font-bold uppercase tracking-widest mb-4 flex items-center">
                                <MapPin className="h-3 w-3 mr-2 text-primary" />
                                {addr.isDefault ? 'Shipping Address' : 'Additional Address'}
                            </h3>
                            <p className="text-xs text-muted-foreground font-serif leading-relaxed mb-6">
                                {addr.name}<br />
                                {addr.street},<br />
                                {addr.city}, {addr.state} {addr.zip}<br />
                                Phone: {addr.phone}
                            </p>
                            <div className="flex space-x-4">
                                <button
                                    onClick={() => { setCurrentAddress(addr); setIsEditing(true); }}
                                    className="text-[10px] uppercase tracking-widest font-bold border-b border-secondary pb-1 hover:text-primary hover:border-primary transition-colors cursor-pointer"
                                >Edit</button>
                                <button
                                    onClick={() => handleRemove(addr.id)}
                                    className="text-[10px] uppercase tracking-widest font-bold border-b border-secondary pb-1 hover:text-destructive hover:border-destructive transition-colors cursor-pointer"
                                >Remove</button>
                            </div>
                        </div>
                    ))}

                    <div
                        onClick={() => { setCurrentAddress(null); setIsEditing(true); }}
                        className="p-8 border-2 border-dashed border-primary/10 flex flex-col items-center justify-center text-center space-y-4 hover:border-primary/30 transition-all cursor-pointer group min-h-[200px]"
                    >
                        <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                            <Plus className="h-6 w-6 text-primary" />
                        </div>
                        <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Add New Address</p>
                    </div>
                </div>
            )}
        </section>
    )
}

export default AddressesPage

