/**
 * Quote Actions Component
 * 
 * Client component to handle user interactions on the public quote page.
 * Includes:
 * - Accept button (triggers ConfirmModal or SignatureModal)
 * - Reject button (triggers RejectModal with optional reason)
 */

'use client'

import { useState } from 'react'
import {
    Button,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Textarea,
} from '@heroui/react'
import { Pen, XCircle, AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react'
import { SignatureModal } from './signature-modal'
import { acceptQuote, rejectQuote } from '@/lib/actions/quote'
import { ENABLE_DIGITAL_SIGNATURE } from '@/lib/config'
import { useRouter } from 'next/navigation'

interface QuoteActionsProps {
    quoteId: string
    accessToken: string
    confirmationNumber: string
    status: string
}

export function QuoteActions({
    quoteId,
    accessToken,
    confirmationNumber,
    status
}: QuoteActionsProps) {
    const [isSignModalOpen, setIsSignModalOpen] = useState(false)
    const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false)
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [rejectReason, setRejectReason] = useState('')
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const router = useRouter()

    // Only show for 'quoted' status
    if (status !== 'quoted') {
        return null
    }

    const handleDirectAccept = async () => {
        setIsSubmitting(true)
        setErrorMessage(null)
        try {
            const result = await acceptQuote(quoteId, accessToken)
            if (result.success) {
                setIsAcceptModalOpen(false)
                router.refresh()
            } else {
                setErrorMessage(result.error || 'Failed to accept quote')
            }
        } catch (error) {
            console.error('Accept quote error:', error)
            setErrorMessage('An unexpected error occurred')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleSignQuote = async (formData: FormData) => {
        setIsSubmitting(true)
        try {
            const result = await acceptQuote(quoteId, accessToken, formData)
            if (result.success) {
                setIsSignModalOpen(false)
                router.refresh()
            } else {
                setErrorMessage(result.error || 'Failed to accept quote')
                setIsSignModalOpen(false)
            }
        } catch (error) {
            console.error('Sign quote error:', error)
            setErrorMessage('An unexpected error occurred')
            setIsSignModalOpen(false)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleRejectQuote = async () => {
        setIsSubmitting(true)
        setErrorMessage(null)
        try {
            const result = await rejectQuote(quoteId, accessToken, rejectReason.trim() || undefined)
            if (result.success) {
                setIsRejectModalOpen(false)
                router.refresh()
            } else {
                setErrorMessage(result.error || 'Failed to reject quote')
            }
        } catch (error) {
            console.error('Reject quote error:', error)
            setErrorMessage('An unexpected error occurred')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <>
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
                <Button
                    color="danger"
                    variant="bordered"
                    size="lg"
                    className="font-semibold"
                    startContent={<XCircle className="w-5 h-5" />}
                    onPress={() => setIsRejectModalOpen(true)}
                >
                    Decline Quote
                </Button>

                {ENABLE_DIGITAL_SIGNATURE ? (
                    <Button
                        color="success"
                        size="lg"
                        className="font-semibold shadow-lg shadow-green-600/20"
                        startContent={<Pen className="w-5 h-5" />}
                        onPress={() => setIsSignModalOpen(true)}
                    >
                        Accept & Sign Quote
                    </Button>
                ) : (
                    <Button
                        color="success"
                        size="lg"
                        className="font-semibold shadow-lg shadow-green-600/20"
                        onPress={() => {
                            setErrorMessage(null)
                            setIsAcceptModalOpen(true)
                        }}
                    >
                        Accept Quote
                    </Button>
                )}
            </div>

            {/* Accept Confirmation Modal */}
            <Modal
                isOpen={isAcceptModalOpen}
                onClose={() => !isSubmitting && setIsAcceptModalOpen(false)}
                size="md"
                backdrop="blur"
                classNames={{
                    base: 'bg-zinc-900 border border-zinc-800',
                    header: 'border-b border-zinc-800',
                    body: 'py-6',
                    footer: 'border-t border-zinc-800',
                }}
            >
                <ModalContent>
                    <ModalHeader className="flex items-center gap-3">
                        <div className="p-2 bg-green-500/10 rounded-lg">
                            <CheckCircle className="w-5 h-5 text-green-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white">
                                Accept Quote #{confirmationNumber}
                            </h2>
                            <p className="text-sm text-zinc-400 font-normal">
                                Confirm your rental agreement
                            </p>
                        </div>
                    </ModalHeader>

                    <ModalBody>
                        <p className="text-zinc-300">
                            By accepting this quote, you confirm your agreement to the rental
                            terms and pricing outlined in the quote document.
                        </p>
                        <p className="text-zinc-500 text-sm mt-2">
                            Our team will reach out to finalize the details and schedule your rental.
                        </p>
                        {errorMessage && (
                            <div className="flex items-start gap-2 p-3 mt-2 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
                                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                <p className="text-sm">{errorMessage}</p>
                            </div>
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            variant="ghost"
                            onPress={() => setIsAcceptModalOpen(false)}
                            isDisabled={isSubmitting}
                            className="text-zinc-400"
                        >
                            Cancel
                        </Button>
                        <Button
                            color="success"
                            onPress={handleDirectAccept}
                            isLoading={isSubmitting}
                            startContent={!isSubmitting ? <CheckCircle className="w-4 h-4" /> : undefined}
                        >
                            Confirm Acceptance
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Signature Modal */}
            <SignatureModal
                isOpen={isSignModalOpen}
                onClose={() => setIsSignModalOpen(false)}
                onSubmit={handleSignQuote}
                isLoading={isSubmitting}
                confirmationNumber={confirmationNumber}
            />

            {/* Reject Modal */}
            <Modal
                isOpen={isRejectModalOpen}
                onClose={() => !isSubmitting && setIsRejectModalOpen(false)}
                size="md"
                classNames={{
                    base: 'bg-zinc-900 border border-zinc-800',
                    header: 'border-b border-zinc-800',
                    body: 'py-6',
                    footer: 'border-t border-zinc-800',
                }}
            >
                <ModalContent>
                    <ModalHeader className="flex items-center gap-3">
                        <div className="p-2 bg-red-500/10 rounded-lg">
                            <AlertTriangle className="w-5 h-5 text-red-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white">
                                Decline Quote #{confirmationNumber}
                            </h2>
                            <p className="text-sm text-zinc-400 font-normal">
                                This action cannot be undone
                            </p>
                        </div>
                    </ModalHeader>

                    <ModalBody>
                        <p className="text-zinc-300 mb-4">
                            Are you sure you want to decline this quote?
                            If you have concerns or need changes, please contact us first.
                        </p>
                        <Textarea
                            label="Reason (optional)"
                            placeholder="Help us improve by sharing why you're declining..."
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            classNames={{
                                input: 'text-white',
                                inputWrapper: 'bg-zinc-800 border-zinc-700',
                            }}
                            minRows={3}
                        />
                        {errorMessage && (
                            <div className="flex items-start gap-2 p-3 mt-2 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
                                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                <p className="text-sm">{errorMessage}</p>
                            </div>
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            variant="ghost"
                            onPress={() => setIsRejectModalOpen(false)}
                            isDisabled={isSubmitting}
                            className="text-zinc-400"
                        >
                            Cancel
                        </Button>
                        <Button
                            color="danger"
                            onPress={handleRejectQuote}
                            isLoading={isSubmitting}
                        >
                            Confirm Decline
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Standalone Error Modal (for signature flow errors) */}
            {errorMessage && !isAcceptModalOpen && !isRejectModalOpen && (
                <Modal
                    isOpen={true}
                    onClose={() => setErrorMessage(null)}
                    size="sm"
                    classNames={{
                        base: 'bg-zinc-900 border border-zinc-800',
                        body: 'py-6',
                    }}
                >
                    <ModalContent>
                        <ModalBody>
                            <div className="flex flex-col items-center text-center gap-3">
                                <div className="p-3 bg-red-500/10 rounded-full">
                                    <AlertCircle className="w-6 h-6 text-red-400" />
                                </div>
                                <p className="text-zinc-300">{errorMessage}</p>
                                <Button
                                    color="danger"
                                    variant="flat"
                                    onPress={() => setErrorMessage(null)}
                                    className="mt-2"
                                >
                                    Close
                                </Button>
                            </div>
                        </ModalBody>
                    </ModalContent>
                </Modal>
            )}
        </>
    )
}
