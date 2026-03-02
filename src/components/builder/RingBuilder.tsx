"use client"

import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ArrowRight, Upload, Info } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { submitCustomOrder } from '@/actions/orderActions'

const DRAFT_KEY_PREFIX = 'ring_builder_draft'
const MAX_FILE_SIZE = 5 * 1024 * 1024
const SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

const RingBuilder = () => {
    const router = useRouter()
    const { data: session } = useSession()
    const formRef = useRef<HTMLFormElement>(null)
    const previousOwnerRef = useRef<string | null>(null)

    const draftOwner = (session?.user?.email || 'guest').toLowerCase()
    const getDraftKey = (owner: string) => `${DRAFT_KEY_PREFIX}_${owner}`

    const [step, setStep] = useState(1)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [feedbackModal, setFeedbackModal] = useState({
        open: false,
        title: '',
        message: '',
        isSuccess: true,
    })
    const [previewUrls, setPreviewUrls] = useState<string[]>([])
    const [fileError, setFileError] = useState('')
    const [fieldErrors, setFieldErrors] = useState({
        size: '',
        name: '',
        email: '',
        phone: '',
    })
    const [selections, setSelections] = useState({
        stoneType: '',
        metal: '',
        carats: '',
    })
    const [formValues, setFormValues] = useState({
        size: '',
        engraving: '',
        name: '',
        email: '',
        phone: ''
    })
    const resolvedName = (formValues.name || session?.user?.name || '').trim()
    const resolvedEmail = (formValues.email || session?.user?.email || '').trim()
    const resolvedPhone = formValues.phone.trim()
    const resolvedSize = formValues.size.trim()

    useEffect(() => {
        return () => {
            previewUrls.forEach((url) => URL.revokeObjectURL(url))
        }
    }, [previewUrls])

    useEffect(() => {
        if (typeof window === 'undefined') return
        const owner = draftOwner
        const ownerChanged = previousOwnerRef.current !== null && previousOwnerRef.current !== owner
        previousOwnerRef.current = owner

        queueMicrotask(() => {
            if (ownerChanged) {
                setSelections({ stoneType: '', metal: '', carats: '' })
                setFormValues({ size: '', engraving: '', name: '', email: '', phone: '' })
                setPreviewUrls([])
                setFileError('')
                setFieldErrors({ size: '', name: '', email: '', phone: '' })
                setStep(1)
            }

            const draftKey = getDraftKey(owner)
            const rawDraft = localStorage.getItem(draftKey)
            if (!rawDraft) return

            try {
                const draft = JSON.parse(rawDraft)
                setSelections({
                    stoneType: draft.stoneType || '',
                    metal: draft.metal || '',
                    carats: draft.carats || '',
                })
                setFormValues({
                    size: draft.size || '',
                    engraving: draft.engraving || '',
                    name: draft.name || '',
                    email: draft.email || '',
                    phone: draft.phone || '',
                })
                setStep(4)
            } catch {
                localStorage.removeItem(draftKey)
            }
        })
    }, [draftOwner])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        const invalidFile = files.find((file) => !SUPPORTED_IMAGE_TYPES.includes(file.type) || file.size > MAX_FILE_SIZE)
        if (invalidFile) {
            setFileError('Only JPG, JPEG, PNG, WEBP files up to 5MB are allowed.')
            previewUrls.forEach((url) => URL.revokeObjectURL(url))
            setPreviewUrls([])
            e.target.value = ''
            return
        }

        setFileError('')
        previewUrls.forEach((url) => URL.revokeObjectURL(url))
        setPreviewUrls(files.map((file) => URL.createObjectURL(file)))
    }

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

    const buildFormData = () => {
        if (!formRef.current) return null
        const formData = new FormData(formRef.current)
        formData.set('stoneType', selections.stoneType)
        formData.set('metal', selections.metal)
        formData.set('carats', selections.carats)
        return formData
    }

    const validateSelectedFiles = (formData: FormData) => {
        const files = formData.getAll('referenceImages') as File[]
        if (!files.length || files[0]?.size === 0) return null
        const invalid = files.find((file) => !SUPPORTED_IMAGE_TYPES.includes(file.type) || file.size > MAX_FILE_SIZE)
        if (!invalid) return null
        return 'Only JPG, JPEG, PNG, WEBP files up to 5MB are allowed.'
    }

    const validateDetails = () => {
        const nextErrors = {
            size: '',
            name: '',
            email: '',
            phone: '',
        }

        if (!resolvedSize) {
            nextErrors.size = 'Ring size is required.'
        }
        if (!resolvedName || resolvedName.length < 2) {
            nextErrors.name = 'Enter a valid name.'
        }
        if (!resolvedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resolvedEmail)) {
            nextErrors.email = 'Enter a valid email address.'
        }
        if (!/^\d{10}$/.test(resolvedPhone)) {
            nextErrors.phone = 'Phone number must be 10 digits.'
        }

        setFieldErrors(nextErrors)
        return !Object.values(nextErrors).some(Boolean)
    }

    const isDetailsValid =
        Boolean(resolvedSize) &&
        resolvedName.length >= 2 &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resolvedEmail) &&
        /^\d{10}$/.test(resolvedPhone)

    const openFeedbackModal = (title: string, message: string, isSuccess = true) => {
        setFeedbackModal({
            open: true,
            title,
            message,
            isSuccess,
        })
    }

    const persistDraft = () => {
        localStorage.setItem(getDraftKey(draftOwner), JSON.stringify({
            ...selections,
            ...formValues,
            name: resolvedName,
            email: resolvedEmail,
        }))
    }

    const resetBuilder = () => {
        previewUrls.forEach((url) => URL.revokeObjectURL(url))
        setPreviewUrls([])
        setSelections({ stoneType: '', metal: '', carats: '' })
        setFormValues({ size: '', engraving: '', name: '', email: '', phone: '' })
        setFileError('')
        setFieldErrors({ size: '', name: '', email: '', phone: '' })
        setFeedbackModal({ open: false, title: '', message: '', isSuccess: true })
        localStorage.removeItem(getDraftKey(draftOwner))
        if (formRef.current) {
            formRef.current.reset()
        }
        setStep(1)
    }

    const handleSaveDraft = async () => {
        const formData = buildFormData()
        if (!formData) return
        const detailsValid = validateDetails()
        if (!detailsValid) return
        const fileValidationError = validateSelectedFiles(formData)
        if (fileValidationError) {
            setFileError(fileValidationError)
            return
        }

        setIsSubmitting(true)
        formData.set('quotationStatus', 'PendingAuth')
        const result = await submitCustomOrder(formData)
        setIsSubmitting(false)

        if (result.success) {
            persistDraft()
            openFeedbackModal('Your draft is saved', 'You can continue this design any time from this device.')
        } else {
            openFeedbackModal('Failed to save draft', result.error || 'Please try again.', false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const formData = buildFormData()
        if (!formData) return
        const detailsValid = validateDetails()
        if (!detailsValid) return
        const fileValidationError = validateSelectedFiles(formData)
        if (fileValidationError) {
            setFileError(fileValidationError)
            return
        }

        setIsSubmitting(true)
        if (!session) {
            formData.set('quotationStatus', 'PendingAuth')
            const draftResult = await submitCustomOrder(formData)
            setIsSubmitting(false)
            if (draftResult.success) {
                persistDraft()
                router.push('/auth/signin?callbackUrl=/custom')
            } else {
                openFeedbackModal('Failed to save draft', draftResult.error || 'Please try again.', false)
            }
            return
        }

        formData.set('quotationStatus', 'Pending')
        const result = await submitCustomOrder(formData)
        setIsSubmitting(false)
        if (result.success) {
            localStorage.removeItem(getDraftKey(draftOwner))
            setStep(6)
        } else {
            openFeedbackModal('Unable to submit request', result.error || 'Please try again.', false)
        }
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-20">
            <div className="text-center mb-16 space-y-4 flex flex-col items-center">
                <h1 className="text-4xl font-bold gold-text uppercase tracking-widest text-center">Design Your Masterpiece</h1>
                <p className="text-muted-foreground font-serif italic text-center">Your vision, our craftsmanship. Create a ring as unique as your story.</p>
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
                                        type="button"
                                        onClick={() => { setSelections({ ...selections, stoneType: stone.name }); }}
                                        className={`p-6 border-2 transition-all text-center space-y-4 hover:border-primary active:scale-95 cursor-pointer group ${selections.stoneType === stone.name ? 'border-primary bg-primary/5' : 'border-muted'}`}
                                    >
                                        <div className="text-4xl group-hover:scale-110 transition-transform">{stone.image}</div>
                                        <span className="text-xs font-bold uppercase tracking-widest">{stone.name}</span>
                                    </button>
                                ))}
                            </div>
                            <div className="flex justify-end items-center">
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    disabled={!selections.stoneType}
                                    className="px-8 py-3 bg-primary text-foreground text-xs font-bold uppercase tracking-widest hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
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
                                        type="button"
                                        onClick={() => { setSelections({ ...selections, metal: metal }); }}
                                        className={`p-6 border-2 transition-all text-left flex justify-between items-center hover:border-primary active:scale-[0.98] cursor-pointer ${selections.metal === metal ? 'border-primary bg-primary/5' : 'border-muted'}`}
                                    >
                                        <span className="font-bold uppercase tracking-widest text-sm">{metal}</span>
                                        {selections.metal === metal && <Check className="h-4 w-4 text-primary" />}
                                    </button>
                                ))}
                            </div>
                            <div className="flex justify-between items-center">
                                <button type="button" onClick={prevStep} className="text-xs uppercase tracking-widest font-bold text-muted-foreground hover:text-primary cursor-pointer transition-colors">Back</button>
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    disabled={!selections.metal}
                                    className="px-8 py-3 bg-primary text-foreground text-xs font-bold uppercase tracking-widest hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
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
                                        type="button"
                                        onClick={() => { setSelections({ ...selections, carats: carat }); }}
                                        className={`p-6 border-2 transition-all text-center hover:border-primary active:scale-95 cursor-pointer ${selections.carats === carat ? 'border-primary bg-primary/5' : 'border-muted'}`}
                                    >
                                        <span className="text-sm font-bold uppercase tracking-widest">{carat}</span>
                                    </button>
                                ))}
                            </div>
                            <div className="flex justify-between items-center">
                                <button type="button" onClick={prevStep} className="text-xs uppercase tracking-widest font-bold text-muted-foreground hover:text-primary cursor-pointer transition-colors">Back</button>
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    disabled={!selections.carats}
                                    className="px-8 py-3 bg-primary text-foreground text-xs font-bold uppercase tracking-widest hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {step === 4 && (
                        <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
                            <h2 className="text-2xl font-bold uppercase tracking-tight">Custom <span className="text-primary">Details</span></h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <label className="text-xs uppercase tracking-widest font-bold">Ring Size</label>
                                    <input
                                        name="size"
                                        required
                                        placeholder="e.g. 52"
                                        value={formValues.size}
                                        onChange={(e) => {
                                            setFormValues(prev => ({ ...prev, size: e.target.value }))
                                            if (fieldErrors.size) setFieldErrors(prev => ({ ...prev, size: '' }))
                                        }}
                                        className="w-full p-4 bg-muted/20 border border-muted focus:border-primary outline-none transition-all"
                                    />
                                    {fieldErrors.size && <p className="text-xs text-destructive">{fieldErrors.size}</p>}
                                </div>
                                <div className="space-y-4">
                                    <label className="text-xs uppercase tracking-widest font-bold">Engraving Text (Optional)</label>
                                    <input
                                        name="engraving"
                                        placeholder="e.g. Forever Yours"
                                        value={formValues.engraving}
                                        onChange={(e) => setFormValues(prev => ({ ...prev, engraving: e.target.value }))}
                                        className="w-full p-4 bg-muted/20 border border-muted focus:border-primary outline-none transition-all"
                                    />
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
                                            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                                            onChange={handleFileChange}
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                        />
                                        <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Click to upload or drag & drop</p>
                                        <p className="text-[10px] text-muted-foreground/60 italic font-serif">Upload your inspiration or sketch for a more precise quote.</p>
                                        <p className="text-[10px] text-muted-foreground/70 uppercase tracking-wider">Supported: JPG, JPEG, PNG, WEBP | Max size: 5MB</p>
                                    </div>
                                    {fileError && (
                                        <p className="text-xs text-destructive">{fileError}</p>
                                    )}
                                    {previewUrls.length > 0 && (
                                        <div className="flex flex-wrap justify-center gap-4">
                                            {previewUrls.map((url, idx) => (
                                                <div key={`${url}-${idx}`} className="w-28 h-28 overflow-hidden border border-primary/20 bg-muted/10">
                                                    <img
                                                        src={url}
                                                        alt={`Reference preview ${idx + 1}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="md:col-span-2 space-y-4">
                                    <label className="text-xs uppercase tracking-widest font-bold">Your Contact Details</label>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <input
                                            name="name"
                                            required
                                            placeholder="Name"
                                            value={resolvedName}
                                            onChange={(e) => {
                                                setFormValues(prev => ({ ...prev, name: e.target.value }))
                                                if (fieldErrors.name) setFieldErrors(prev => ({ ...prev, name: '' }))
                                            }}
                                            className="p-4 bg-muted/20 border border-muted focus:border-primary outline-none"
                                        />
                                        {fieldErrors.name && <p className="text-xs text-destructive">{fieldErrors.name}</p>}
                                        <input
                                            name="email"
                                            type="email"
                                            required
                                            placeholder="Email"
                                            value={resolvedEmail}
                                            onChange={(e) => {
                                                setFormValues(prev => ({ ...prev, email: e.target.value }))
                                                if (fieldErrors.email) setFieldErrors(prev => ({ ...prev, email: '' }))
                                            }}
                                            className="p-4 bg-muted/20 border border-muted focus:border-primary outline-none"
                                        />
                                        {fieldErrors.email && <p className="text-xs text-destructive">{fieldErrors.email}</p>}
                                        <input
                                            name="phone"
                                            required
                                            placeholder="Phone"
                                            value={formValues.phone}
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/\D/g, '').slice(0, 10)
                                                setFormValues(prev => ({ ...prev, phone: value }))
                                                if (fieldErrors.phone) setFieldErrors(prev => ({ ...prev, phone: '' }))
                                            }}
                                            className="p-4 bg-muted/20 border border-muted focus:border-primary outline-none"
                                        />
                                        {fieldErrors.phone && <p className="text-xs text-destructive">{fieldErrors.phone}</p>}
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-between items-center pt-8">
                                <button type="button" onClick={prevStep} className="text-xs uppercase tracking-widest font-bold text-muted-foreground hover:text-primary">Back</button>
                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={handleSaveDraft}
                                        disabled={isSubmitting || !isDetailsValid}
                                        className="px-6 py-4 border border-primary/30 text-primary uppercase tracking-widest text-xs font-bold hover:bg-primary/10 transition-all disabled:opacity-50"
                                    >
                                        Save Draft
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="px-10 py-4 bg-primary text-foreground uppercase tracking-widest text-xs font-bold hover:bg-primary/90 transition-all flex items-center disabled:opacity-50"
                                    >
                                        {session ? 'Request Quotation' : 'Sign In to Request'}
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </button>
                                </div>
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
                            <h2 className="text-3xl font-bold uppercase tracking-tight text-center">Request <span className="text-primary">Received</span></h2>
                            <p className="text-muted-foreground font-serif italic text-center">Our master craftsmen are reviewing your design. We will contact you with a quotation within 24-48 hours.</p>
                            <button
                                onClick={resetBuilder}
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

            <AnimatePresence>
                {feedbackModal.open && (
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
                            className="w-full max-w-md bg-background border border-primary/20 p-8 text-center space-y-6"
                        >
                            <div className={`w-14 h-14 mx-auto rounded-full flex items-center justify-center ${feedbackModal.isSuccess ? 'bg-primary/15' : 'bg-destructive/15'}`}>
                                {feedbackModal.isSuccess ? (
                                    <Check className="h-7 w-7 text-primary" />
                                ) : (
                                    <Info className="h-7 w-7 text-destructive" />
                                )}
                            </div>
                            <h3 className="text-xl font-bold text-center">{feedbackModal.title}</h3>
                            <p className="text-sm text-muted-foreground text-center">{feedbackModal.message}</p>
                            <button
                                type="button"
                                onClick={() => setFeedbackModal((prev) => ({ ...prev, open: false }))}
                                className="px-8 py-3 bg-primary text-foreground text-xs font-bold uppercase tracking-widest hover:bg-primary/90 transition-all"
                            >
                                OK
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default RingBuilder

