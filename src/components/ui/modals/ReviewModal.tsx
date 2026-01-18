"use client"
import React from 'react';
import { Star, User, Car, Route as RouteIcon, Calendar, Clock, MessageSquare, ThumbsUp, Award, MapPin } from 'lucide-react';
import BaseModal from './BaseModal';
import { useReviewDetails } from '@/hooks/use-reviews';
import { reviewService } from '@/services/review-service';

interface ReviewDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    reviewId: string;
}

const ReviewDetailsModal: React.FC<ReviewDetailsModalProps> = ({
    isOpen,
    onClose,
    reviewId
}) => {
    const { data: reviewDetails, isLoading, error } = useReviewDetails(reviewId);

    if (isLoading) {
        return (
            <BaseModal isOpen={isOpen} onClose={onClose} title="Review Details" size="xl">
                <div className="flex justify-center items-center p-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0066CC]"></div>
                </div>
            </BaseModal>
        );
    }

    if (error || !reviewDetails) {
        return (
            <BaseModal isOpen={isOpen} onClose={onClose} title="Review Details" size="xl">
                <div className="text-center p-8">
                    <p className="text-red-500">Failed to load review details</p>
                </div>
            </BaseModal>
        );
    }

    const ratingCategories = [
        { label: 'Overall', rating: reviewDetails.overallRating },
        { label: 'Punctuality', rating: reviewDetails.punctualityRating },
        { label: 'Comfort', rating: reviewDetails.comfortRating },
        { label: 'Safety', rating: reviewDetails.safetyRating },
        { label: 'Driver', rating: reviewDetails.driverRating }
    ];

    return (
        <BaseModal isOpen={isOpen} onClose={onClose} title="Review Details" size="xl">
            <div className="space-y-6">
                {/* User Information */}
                <div className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                            {reviewDetails.user?.photoUrl ? (
                                <img
                                    src={reviewDetails.user.photoUrl}
                                    alt={reviewDetails.user.name}
                                    className="w-full h-full object-cover rounded-full"
                                />
                            ) : (
                                <User size={24} className="text-gray-600" />
                            )}
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-800">{reviewDetails.user?.name || 'Anonymous User'}</h3>
                            <p className="text-gray-600">{reviewDetails.user?.email || 'No email provided'}</p>
                            <div className="flex items-center gap-4 mt-2">
                                <span className="text-sm text-gray-500">User Type: {reviewDetails.user?.userType || 'Passenger'}</span>
                                <span className="text-sm text-gray-500">ID: {reviewDetails.userId?.substring(0, 8)}...</span>
                            </div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${reviewService.getStatusColor(reviewDetails.status)}`}>
                            {reviewService.getStatusBadge(reviewDetails.status)}
                        </div>
                    </div>
                </div>

                {/* Review Content */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Review Content</h3>
                    <div className="space-y-4">
                        <div className="prose max-w-none">
                            <p className="text-gray-700 whitespace-pre-wrap">{reviewDetails.comment}</p>
                        </div>

                        {reviewDetails.response && (
                            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                                <div className="flex items-center gap-2 mb-2">
                                    <MessageSquare size={16} className="text-blue-600" />
                                    <span className="font-medium text-blue-800">Admin Response</span>
                                    {reviewDetails.responseDate && (
                                        <span className="text-sm text-blue-600 ml-auto">
                                            {reviewService.formatDateTime(reviewDetails.responseDate)}
                                        </span>
                                    )}
                                </div>
                                <p className="text-blue-700">{reviewDetails.response}</p>
                            </div>
                        )}

                        <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                            <div className="flex items-center gap-2">
                                <ThumbsUp size={16} className="text-gray-500" />
                                <span className="text-gray-700">{reviewDetails.likes || 0} likes</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar size={16} className="text-gray-500" />
                                <span className="text-gray-700">
                                    Submitted: {reviewService.formatDate(reviewDetails.createdAt)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Rating Breakdown */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Rating Breakdown</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {ratingCategories.map((category) => (
                            <div key={category.label} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <span className="font-medium text-gray-700">{category.label}</span>
                                <div className="flex items-center gap-2">
                                    <div className="flex">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                size={16}
                                                className={`${star <= category.rating
                                                    ? 'text-yellow-500 fill-yellow-500'
                                                    : 'text-gray-300'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <span className="font-bold text-gray-800">{category.rating.toFixed(1)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Trip Information */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Trip Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Route Info */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <RouteIcon size={20} className="text-green-600" />
                                <span className="font-medium text-gray-700">Route</span>
                            </div>
                            {reviewDetails.route ? (
                                <div className="pl-6">
                                    <p className="font-semibold text-gray-800">{reviewDetails.route.name}</p>
                                    <p className="text-sm text-gray-600">{reviewDetails.route.description}</p>
                                </div>
                            ) : (
                                <p className="pl-6 text-gray-500">No route information</p>
                            )}
                        </div>

                        {/* Bus Info */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <Car size={20} className="text-blue-600" />
                                <span className="font-medium text-gray-700">Bus</span>
                            </div>
                            {reviewDetails.bus ? (
                                <div className="pl-6">
                                    <p className="font-semibold text-gray-800">{reviewDetails.bus.name}</p>
                                    <p className="text-sm text-gray-600">Reg: {reviewDetails.bus.registrationName}</p>
                                </div>
                            ) : (
                                <p className="pl-6 text-gray-500">No bus information</p>
                            )}
                        </div>

                        {/* Driver Info */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <User size={20} className="text-purple-600" />
                                <span className="font-medium text-gray-700">Driver</span>
                            </div>
                            {reviewDetails.driver ? (
                                <div className="pl-6">
                                    <p className="font-semibold text-gray-800">{reviewDetails.driver.name}</p>
                                    <p className="text-sm text-gray-600">License: {reviewDetails.driver.licenseNumber}</p>
                                </div>
                            ) : (
                                <p className="pl-6 text-gray-500">No driver information</p>
                            )}
                        </div>
                    </div>

                    {/* Trip Details */}
                    {reviewDetails.trip && (
                        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-2">
                                    <Clock size={16} className="text-gray-500" />
                                    <div>
                                        <p className="text-sm text-gray-500">Start Time</p>
                                        <p className="font-medium text-gray-800">
                                            {new Date(reviewDetails.trip.startTime).toLocaleTimeString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock size={16} className="text-gray-500" />
                                    <div>
                                        <p className="text-sm text-gray-500">End Time</p>
                                        <p className="font-medium text-gray-800">
                                            {new Date(reviewDetails.trip.endTime).toLocaleTimeString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar size={16} className="text-gray-500" />
                                    <div>
                                        <p className="text-sm text-gray-500">Trip Date</p>
                                        <p className="font-medium text-gray-800">
                                            {reviewService.formatDate(reviewDetails.trip.startTime)}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Award size={16} className="text-gray-500" />
                                    <div>
                                        <p className="text-sm text-gray-500">Trip Status</p>
                                        <p className="font-medium text-gray-800 capitalize">
                                            {reviewDetails.trip.status}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                    >
                        Close
                    </button>
                    <button
                        onClick={() => {
                            // Handle respond action
                            onClose();
                        }}
                        className="px-6 py-2 bg-[#0066CC] text-white rounded-lg font-medium hover:bg-[#0055AA] transition-colors"
                    >
                        Respond to Review
                    </button>
                </div>
            </div>
        </BaseModal>
    );
};

export default ReviewDetailsModal;