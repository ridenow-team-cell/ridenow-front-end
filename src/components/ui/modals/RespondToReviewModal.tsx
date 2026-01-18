"use client"
import React, { useState } from 'react';
import { MessageSquare, Star } from 'lucide-react';
import BaseModal from './BaseModal';

interface RespondToReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (response: string) => void;
    review?: any;
}

const RespondToReviewModal: React.FC<RespondToReviewModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    review
}) => {
    const [response, setResponse] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!response.trim()) return;

        setIsSubmitting(true);
        try {
            onSubmit(response);
            setResponse('');
        } catch (error) {
            console.error('Error submitting response:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="Respond to Review"
            size="lg"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Review Preview */}
                {review && (
                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="flex">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                size={14}
                                                className={`${star <= review.overallRating
                                                    ? 'text-yellow-500 fill-yellow-500'
                                                    : 'text-gray-300'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-sm text-gray-500">
                                        {review.overallRating.toFixed(1)} rating
                                    </span>
                                </div>
                                <p className="text-gray-700 text-sm line-clamp-3">{review.comment}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Response Input */}
                <div>
                    <label className="block text-gray-800 text-base font-medium mb-3">
                        Your Response *
                    </label>
                    <div className="relative">
                        <MessageSquare size={20} className="absolute left-3 top-3 text-gray-400" />
                        <textarea
                            value={response}
                            onChange={(e) => setResponse(e.target.value)}
                            placeholder="Type your response here... Be professional and helpful."
                            className="w-full h-40 px-10 py-3 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#0066CC] focus:ring-1 focus:ring-[#0066CC] resize-none"
                            required
                        />
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                        Your response will be visible to the user and other readers.
                    </p>
                </div>

                {/* Tips */}
                <div className="bg-blue-50 rounded-lg p-4">
                    <p className="font-medium text-blue-800 mb-2">Response Tips:</p>
                    <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Be professional and courteous</li>
                        <li>• Acknowledge the user's feedback</li>
                        <li>• Address specific concerns if mentioned</li>
                        <li>• Thank the user for their review</li>
                    </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-3 bg-[#E7A533] text-gray-800 rounded-lg text-base font-medium hover:bg-[#d69420] transition-colors"
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-3 bg-[#0066CC] text-white rounded-lg text-base font-medium hover:bg-[#0052a3] transition-colors flex items-center gap-2"
                        disabled={!response.trim() || isSubmitting}
                    >
                        {isSubmitting ? 'Sending...' : 'Send Response'}
                        <MessageSquare size={18} />
                    </button>
                </div>
            </form>
        </BaseModal>
    );
};

export default RespondToReviewModal;