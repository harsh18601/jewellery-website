"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ArrowRight, Upload, Info } from 'lucide-react'
import { submitCustomOrder } from '@/actions/orderActions'

const RingBuilder = () => {
    const [step, setStep] = useState(1)
    const [selections, setSelections] = useState({
        stoneType: '',
        metal: '',
        carats: '',
        size: '',
        engraving: ''
    })

    const stones = [
        { name: 'Round Brilliant', image: '💎' },
        { name: 'Oval Cut', image: '💍' },
        { name: 'Princess Cut', image: '✨' },
        { name: 'Emerald Cut', image: '🧊' }
    ]

    const metals = ['18K Yellow Gold', '18K White Gold', 'Platinum', 'Rose Gold']
    const caratOptions = ['0.50 ct', '0.75 ct', '1.00 ct', '1.50 ct', '2.00 ct', 'Custom']

    const nextStep = () => setStep(s => s + 1)
    const prevStep = () => setStep(s => s - 1)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const formData = new FormData(e.target as HTMLFormElement)
        formData.append('stoneType', selections.stoneType)
        formData.append('metal', selections.metal)
        formData.append('carats', selections.carats)
        // size and engraving are already in the form inputs

        const result = await submitCustomOrder(formData)
        if (result.success) {
            setStep(6)
        }
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-20">
            <div className="text-center mb-16 space-y-4">
                <h1 className="text-4xl font-bold gold-text uppercase tracking-widest">Design Your Masterpiece</h1>
                <p className="text-muted-foreground font-serif italic">Your vision, our craftsmanship. Create a ring as unique as your story.</p>
            </div>

            <div className="flex justify-center mb-12">
                {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="flex items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${step >= i ? 'bg-primary border-primary text-foreground' : 'border-muted text-muted-foreground'}`}>
                            {step > i ? <Check className="h-5 w-5" /> : i}
                        </div>
                        {i < 5 && <div className={`w-12 h-0.5 ${step > i ? 'bg-primary' : 'bg-muted'}`} />}
                    </div>
                ))}
            </div>

            <div className="bg-background border border-primary/10 p-8 md:p-12 shadow-2xl relative overflow-hidden">
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                        >
                            <h2 className="text-2xl font-bold uppercase tracking-tight">Select Your <span className="text-primary font-serif italic text-3xl lowercase">Stone Shape</span></h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {stones.map(stone => (
                                    <button
                                        key={stone.name}
                                        onClick={() => { setSelections({ ...selections, stoneType: stone.name }); nextStep(); }}
                                        className={`p-6 border-2 transition-all text-center space-y-4 hover:border-primary active:scale-95 cursor-pointer group ${selections.stoneType === stone.name ? 'border-primary bg-primary/5' : 'border-muted'}`}
                                    >
                                        <div className="text-4xl group-hover:scale-110 transition-transform">{stone.image}</div>
                                        <span className="text-xs font-bold uppercase tracking-widest">{stone.name}</span>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                        >
                            <h2 className="text-2xl font-bold uppercase tracking-tight">Choose Your <span className="text-primary font-serif italic text-3xl lowercase">Metal</span></h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {metals.map(metal => (
                                    <button
                                        key={metal}
                                        onClick={() => { setSelections({ ...selections, metal: metal }); nextStep(); }}
                                        className={`p-6 border-2 transition-all text-left flex justify-between items-center hover:border-primary active:scale-[0.98] cursor-pointer ${selections.metal === metal ? 'border-primary bg-primary/5' : 'border-muted'}`}
                                    >
                                        <span className="font-bold uppercase tracking-widest text-sm">{metal}</span>
                                        {selections.metal === metal && <Check className="h-4 w-4 text-primary" />}
                                    </button>
                                ))}
                            </div>
                            <button onClick={prevStep} className="text-xs uppercase tracking-widest font-bold text-muted-foreground hover:text-primary cursor-pointer transition-colors">Back</button>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                        >
                            <h2 className="text-2xl font-bold uppercase tracking-tight">Select <span className="text-primary font-serif italic text-3xl lowercase">Carat Weight</span></h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {caratOptions.map(carat => (
                                    <button
                                        key={carat}
                                        onClick={() => { setSelections({ ...selections, carats: carat }); nextStep(); }}
                                        className={`p-6 border-2 transition-all text-center hover:border-primary active:scale-95 cursor-pointer ${selections.carats === carat ? 'border-primary bg-primary/5' : 'border-muted'}`}
                                    >
                                        <span className="text-sm font-bold uppercase tracking-widest">{carat}</span>
                                    </button>
                                ))}
                            </div>
                            <button onClick={prevStep} className="text-xs uppercase tracking-widest font-bold text-muted-foreground hover:text-primary cursor-pointer transition-colors">Back</button>
                        </motion.div>
                    )}

                    {step === 4 && (
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <h2 className="text-2xl font-bold uppercase tracking-tight">Custom <span className="text-primary">Details</span></h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <label className="text-xs uppercase tracking-widest font-bold">Ring Size</label>
                                    <input name="size" required placeholder="e.g. 52" className="w-full p-4 bg-muted/20 border border-muted focus:border-primary outline-none transition-all" />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-xs uppercase tracking-widest font-bold">Engraving Text (Optional)</label>
                                    <input name="engraving" placeholder="e.g. Forever Yours" className="w-full p-4 bg-muted/20 border border-muted focus:border-primary outline-none transition-all" />
                                </div>

                                <div className="md:col-span-2 space-y-4">
                                    <label className="text-xs uppercase tracking-widest font-bold flex items-center">
                                        <Upload className="h-3 w-3 mr-2" /> Upload Reference Images (Optional)
                                    </label>
                                    <div className="border-2 border-dashed border-muted p-8 text-center space-y-4 hover:border-primary transition-colors cursor-pointer relative">
                                        <input
                                            type="file"
                                            name="referenceImages"
                                            multiple
                                            accept="image/*"
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                        />
                                        <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Click to upload or drag & drop</p>
                                        <p className="text-[10px] text-muted-foreground/60 italic font-serif">Upload your inspiration or sketch for a more precise quote.</p>
                                    </div>
                                </div>

                                <div className="md:col-span-2 space-y-4">
                                    <label className="text-xs uppercase tracking-widest font-bold">Your Contact Details</label>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <input name="name" required placeholder="Name" className="p-4 bg-muted/20 border border-muted focus:border-primary outline-none" />
                                        <input name="email" type="email" required placeholder="Email" className="p-4 bg-muted/20 border border-muted focus:border-primary outline-none" />
                                        <input name="phone" required placeholder="Phone" className="p-4 bg-muted/20 border border-muted focus:border-primary outline-none" />
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-between items-center pt-8">
                                <button type="button" onClick={prevStep} className="text-xs uppercase tracking-widest font-bold text-muted-foreground hover:text-primary">Back</button>
                                <button type="submit" className="px-10 py-4 bg-primary text-foreground uppercase tracking-widest text-xs font-bold hover:bg-primary/90 transition-all flex items-center">
                                    Request Quotation <ArrowRight className="ml-2 h-4 w-4" />
                                </button>
                            </div>
                        </form>
                    )}

                    {step === 6 && (
                        <motion.div
                            key="step6"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center space-y-6"
                        >
                            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
                                <Check className="h-10 w-10 text-primary" />
                            </div>
                            <h2 className="text-3xl font-bold uppercase tracking-tight">Request <span className="text-primary">Received</span></h2>
                            <p className="text-muted-foreground font-serif italic">Our master craftsmen are reviewing your design. We will contact you with a quotation within 24-48 hours.</p>
                            <button
                                onClick={() => setStep(1)}
                                className="mt-8 text-xs uppercase tracking-widest font-bold border-b-2 border-primary pb-1 hover:text-primary transition-colors"
                            >
                                Start Another Design
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="mt-12 flex items-center justify-center space-x-8 text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">
                <span className="flex items-center"><Info className="h-3 w-3 mr-2 text-primary" /> Handcrafted in Jaipur</span>
                <span className="flex items-center"><Info className="h-3 w-3 mr-2 text-primary" /> Certified Lab Diamonds</span>
            </div>
        </div>
    )
}

export default RingBuilder

