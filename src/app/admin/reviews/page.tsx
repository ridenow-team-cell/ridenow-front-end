"use client"
import React, { useState, useEffect } from 'react';
import { Calendar, ChevronDown, Search, MoreVertical, Star, MessageSquare, User, Filter, Download, ThumbsUp, Award, BarChart3 } from 'lucide-react';
import DataTable from '@/components/ui/DataTable';
import FilterSection from '@/components/ui/FilterSection';
import Pagination from '@/components/ui/Pagination';
import ReviewDetailsModal from '@/components/ui/modals/ReviewModal';
import RespondToReviewModal from '@/components/ui/modals/RespondToReviewModal';
import { ConfirmModal } from '@/components/ui/modals/ConfirmModal';
import SuccessModal from '@/components/ui/modals/SuccessModal';
import {
    useReviews,
    useReviewStatistics,
    useApproveReview,
    useRejectReview,
    useRespondToReview,
    useToggleFeaturedReview,
    useDeleteReview,
    useExportReviews
} from '@/hooks/use-reviews';
import { reviewService } from '@/services/review-service';
import { ReviewQueryParams } from '@/types/review';
import { toast } from 'react-hot-toast';

const ReviewsPage = () => {
    const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'featured'>('all');
    const [filters, setFilters] = useState<ReviewQueryParams>({
        page: 1,
        limit: 10,
        sortBy: 'createdAt',
        sortOrder: 'desc',
        minRating: 1,
        maxRating: 5
    });

    // Modal states
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showRespondModal, setShowRespondModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [selectedReview, setSelectedReview] = useState<any>(null);
    const [selectedAction, setSelectedAction] = useState<'approve' | 'reject' | 'delete' | 'feature'>('approve');

    // Filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [ratingFilter, setRatingFilter] = useState<number | null>(null);

    // Hooks
    const { data: reviewsData, isLoading, refetch } = useReviews(filters);
    const { data: statistics, isLoading: statsLoading } = useReviewStatistics();

    const approveReview = useApproveReview();
    const rejectReview = useRejectReview();
    const respondToReview = useRespondToReview();
    const toggleFeaturedReview = useToggleFeaturedReview();
    const deleteReview = useDeleteReview();
    const exportReviews = useExportReviews();

    // Update filters when tab changes
    useEffect(() => {
        switch (activeTab) {
            case 'pending':
                setFilters(prev => ({ ...prev, status: 'Pending', isApproved: false, page: 1 }));
                break;
            case 'approved':
                setFilters(prev => ({ ...prev, status: 'Approved', isApproved: true, page: 1 }));
                break;
            case 'featured':
                setFilters(prev => ({ ...prev, isFeatured: true, page: 1 }));
                break;
            default:
                setFilters(prev => ({ ...prev, status: undefined, isApproved: undefined, isFeatured: undefined, page: 1 }));
        }
    }, [activeTab]);

    // Update filters when rating filter changes
    useEffect(() => {
        if (ratingFilter !== null) {
            setFilters(prev => ({
                ...prev,
                minRating: ratingFilter,
                maxRating: ratingFilter,
                page: 1
            }));
        } else {
            setFilters(prev => ({
                ...prev,
                minRating: undefined,
                maxRating: undefined,
                page: 1
            }));
        }
    }, [ratingFilter]);

    // Update filters when date range changes
    useEffect(() => {
        if (dateRange.start && dateRange.end) {
            // You might need to format dates for API
            console.log('Date range filter:', dateRange);
        }
    }, [dateRange]);

    // Calculate statistics
    const calculateStats = () => {
        if (!reviewsData?.reviews) return null;

        const reviews = reviewsData.reviews;
        const total = reviews.length;
        const approved = reviews.filter(r => r.status === 'Approved').length;
        const pending = reviews.filter(r => r.status === 'Pending').length;
        const averageRating = reviewService.calculateAverageRating(reviews);
        const ratingDistribution = [5, 4, 3, 2, 1].map(stars => ({
            stars,
            count: reviews.filter(r => r.overallRating === stars).length,
            percentage: (reviews.filter(r => r.overallRating === stars).length / total) * 100
        }));

        return { total, approved, pending, averageRating, ratingDistribution };
    };

    const stats = calculateStats();

    // Table columns
    const columns = [
        {
            key: 'user',
            header: 'User',
            render: (review: any) => (
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <User size={16} className="text-gray-600" />
                    </div>
                    <div>
                        <div className="font-medium text-gray-800">User ID: {review.userId?.substring(0, 8)}...</div>
                        <div className="text-xs text-gray-500">Trip: {review.tripId?.substring(0, 8)}...</div>
                    </div>
                </div>
            )
        },
        {
            key: 'comment',
            header: 'Review',
            render: (review: any) => (
                <div className="max-w-xs">
                    <div className="text-gray-800 line-clamp-2">{review.comment}</div>
                    {review.response && (
                        <div className="mt-1 p-2 bg-blue-50 rounded text-sm text-blue-800">
                            <span className="font-medium">Response:</span> {review.response}
                        </div>
                    )}
                </div>
            )
        },
        {
            key: 'overallRating',
            header: 'Rating',
            render: (review: any) => (
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                size={16}
                                className={`${star <= review.overallRating
                                    ? 'text-yellow-500 fill-yellow-500'
                                    : 'text-gray-300'
                                    }`}
                            />
                        ))}
                        <span className="ml-2 text-sm font-medium text-gray-700">
                            {review.overallRating.toFixed(1)}
                        </span>
                    </div>
                    <div className="text-xs text-gray-500">
                        {reviewService.formatDate(review.createdAt)}
                    </div>
                </div>
            )
        },
        {
            key: 'status',
            header: 'Status',
            render: (review: any) => (
                <div className="flex flex-col gap-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${reviewService.getStatusColor(review.status)}`}>
                        {reviewService.getStatusBadge(review.status)}
                    </span>
                    {review.isFeatured && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            Featured
                        </span>
                    )}
                </div>
            )
        },
        {
            key: 'likes',
            header: 'Engagement',
            render: (review: any) => (
                <div className="flex items-center gap-2">
                    <ThumbsUp size={14} className="text-gray-500" />
                    <span className="text-sm text-gray-700">{review.likes || 0}</span>
                </div>
            )
        }
    ];

    // Actions for reviews
    const reviewActions = [
        {
            label: 'View Details',
            onClick: (review: any) => {
                setSelectedReview(review);
                setShowDetailsModal(true);
            }
        },
        {
            label: 'Respond',
            onClick: (review: any) => {
                setSelectedReview(review);
                setShowRespondModal(true);
            }
        },
        {
            label: 'Approve',
            onClick: (review: any) => {
                setSelectedReview(review);
                setSelectedAction('approve');
                setShowConfirmModal(true);
            },
            className: 'text-green-600',
            showIf: (review: any) => review.status === 'Pending'
        },
        {
            label: 'Reject',
            onClick: (review: any) => {
                setSelectedReview(review);
                setSelectedAction('reject');
                setShowConfirmModal(true);
            },
            className: 'text-red-600',
            showIf: (review: any) => review.status === 'Pending'
        },
        {
            label: 'Toggle Featured',
            onClick: (review: any) => {
                setSelectedReview(review);
                setSelectedAction('feature');
                setShowConfirmModal(true);
            },
            className: 'text-purple-600'
        },
        {
            label: 'Delete',
            onClick: (review: any) => {
                setSelectedReview(review);
                setSelectedAction('delete');
                setShowConfirmModal(true);
            },
            className: 'text-red-500'
        }
    ];

    // Handlers
    const handleApproveReview = () => {
        if (!selectedReview) return;

        approveReview.mutate(selectedReview.id, {
            onSuccess: () => {
                setShowConfirmModal(false);
                setShowSuccessModal(true);
                refetch();
            }
        });
    };

    const handleRejectReview = () => {
        if (!selectedReview) return;

        rejectReview.mutate(selectedReview.id, {
            onSuccess: () => {
                setShowConfirmModal(false);
                setShowSuccessModal(true);
                refetch();
            }
        });
    };

    const handleToggleFeatured = () => {
        if (!selectedReview) return;

        toggleFeaturedReview.mutate(selectedReview.id, {
            onSuccess: () => {
                setShowConfirmModal(false);
                setShowSuccessModal(true);
                refetch();
            }
        });
    };

    const handleDeleteReview = () => {
        if (!selectedReview) return;

        deleteReview.mutate(selectedReview.id, {
            onSuccess: () => {
                setShowConfirmModal(false);
                setShowSuccessModal(true);
                refetch();
            }
        });
    };

    const handleRespondToReview = (response: string) => {
        if (!selectedReview) return;

        respondToReview.mutate({
            id: selectedReview.id,
            response
        }, {
            onSuccess: () => {
                setShowRespondModal(false);
                setShowSuccessModal(true);
                refetch();
            }
        });
    };

    const handleSearch = (term: string) => {
        setSearchTerm(term);
        setFilters(prev => ({ ...prev, search: term, page: 1 }));
    };

    const handleDateFilter = () => {
        // Implement date filter logic
        console.log('Date filter:', dateRange);
    };

    const handleExportReviews = () => {
        exportReviews.mutate(filters);
    };

    const handlePageChange = (page: number) => {
        setFilters(prev => ({ ...prev, page }));
    };

    const getConfirmModalConfig = () => {
        switch (selectedAction) {
            case 'approve':
                return {
                    title: 'Approve Review',
                    message: 'Are you sure you want to approve this review? It will be visible to the public.',
                    confirmText: 'Approve',
                    onConfirm: handleApproveReview
                };
            case 'reject':
                return {
                    title: 'Reject Review',
                    message: 'Are you sure you want to reject this review? It will be hidden from the public.',
                    confirmText: 'Reject',
                    onConfirm: handleRejectReview
                };
            case 'feature':
                return {
                    title: selectedReview?.isFeatured ? 'Remove Featured Status' : 'Mark as Featured',
                    message: selectedReview?.isFeatured
                        ? 'Remove this review from featured reviews?'
                        : 'Mark this review as featured? It will be highlighted on the platform.',
                    confirmText: selectedReview?.isFeatured ? 'Remove' : 'Mark Featured',
                    onConfirm: handleToggleFeatured
                };
            case 'delete':
                return {
                    title: 'Delete Review',
                    message: 'Are you sure you want to delete this review? This action cannot be undone.',
                    confirmText: 'Delete',
                    onConfirm: handleDeleteReview
                };
            default:
                return {
                    title: 'Confirm Action',
                    message: 'Are you sure you want to perform this action?',
                    confirmText: 'Confirm',
                    onConfirm: () => { }
                };
        }
    };

    return (
        <div className="p-4 sm:p-6">
            {/* Header with Tabs */}
            <div className="bg-white rounded-lg mb-6">
                <div className="flex border-b overflow-x-auto">
                    {['all', 'pending', 'approved', 'featured'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`px-6 py-4 text-base font-medium whitespace-nowrap relative capitalize ${activeTab === tab ? 'text-gray-800' : 'text-gray-500'
                                }`}
                        >
                            {tab === 'all' ? 'All Reviews' : `${tab} Reviews`}
                            {activeTab === tab && (
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#E7A533]"></div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Total Reviews</p>
                            <p className="text-2xl font-bold text-gray-800">
                                {statsLoading ? '...' : statistics?.totalReviews || stats?.total || 0}
                            </p>
                        </div>
                        <div className="p-2 bg-blue-100 rounded-full">
                            <MessageSquare className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Average Rating</p>
                            <p className="text-2xl font-bold text-gray-800">
                                {statsLoading ? '...' : (statistics?.averageRating || stats?.averageRating || 0).toFixed(1)}
                                <span className="text-lg text-gray-500">/5</span>
                            </p>
                        </div>
                        <div className="p-2 bg-yellow-100 rounded-full">
                            <Star className="w-6 h-6 text-yellow-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Pending Reviews</p>
                            <p className="text-2xl font-bold text-gray-800">
                                {statsLoading ? '...' : statistics?.pendingReviews || stats?.pending || 0}
                            </p>
                        </div>
                        <div className="p-2 bg-orange-100 rounded-full">
                            <Award className="w-6 h-6 text-orange-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Featured</p>
                            <p className="text-2xl font-bold text-gray-800">
                                {statsLoading ? '...' : statistics?.featuredReviews || 0}
                            </p>
                        </div>
                        <div className="p-2 bg-purple-100 rounded-full">
                            <BarChart3 className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Rating Filter */}
            <div className="bg-white rounded-lg p-4 mb-6">
                <div className="flex flex-wrap gap-2 items-center">
                    <span className="text-gray-700 font-medium">Filter by Rating:</span>
                    {[5, 4, 3, 2, 1].map(rating => (
                        <button
                            key={rating}
                            onClick={() => setRatingFilter(ratingFilter === rating ? null : rating)}
                            className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors ${ratingFilter === rating
                                ? 'bg-[#E7A533] text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            <span className="font-medium">{rating}</span>
                            <Star size={14} className={ratingFilter === rating ? 'fill-white' : ''} />
                        </button>
                    ))}
                    <button
                        onClick={() => setRatingFilter(null)}
                        className="text-sm text-[#0066CC] hover:text-[#0055AA] font-medium"
                    >
                        Clear Filter
                    </button>
                </div>
            </div>

            {/* Filter Section */}
            <FilterSection
                onSearch={handleSearch}
                onFilter={handleDateFilter}
                onExport={handleExportReviews}
                showExportButton={true}
                exportButtonText="Export Reviews"
            />

            {/* Loading State */}
            {isLoading ? (
                <div className="bg-white rounded-lg p-8 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0066CC] mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading reviews...</p>
                </div>
            ) : (
                <>
                    {/* Data Table */}
                    {reviewsData?.reviews && reviewsData.reviews.length > 0 ? (
                        <>
                            <DataTable
                                columns={columns}
                                data={reviewsData.reviews}
                                actions={reviewActions}
                            />

                            {/* Pagination */}
                            {reviewsData.totalPages > 1 && (
                                <div className="mt-6">
                                    <Pagination
                                        currentPage={reviewsData.page}
                                        totalPages={reviewsData.totalPages}
                                        totalItems={reviewsData.total}
                                        itemsPerPage={reviewsData.limit}
                                        onPageChange={handlePageChange}
                                    />
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="bg-white rounded-lg p-8 text-center">
                            <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600">No reviews found</p>
                            <p className="text-sm text-gray-500 mt-2">
                                {activeTab === 'all'
                                    ? 'There are no reviews matching your criteria.'
                                    : `There are no ${activeTab} reviews.`
                                }
                            </p>
                        </div>
                    )}
                </>
            )}

            {/* Modals */}
            <ReviewDetailsModal
                isOpen={showDetailsModal}
                onClose={() => {
                    setShowDetailsModal(false);
                    setSelectedReview(null);
                }}
                reviewId={selectedReview?.id || ''}
            />

            <RespondToReviewModal
                isOpen={showRespondModal}
                onClose={() => {
                    setShowRespondModal(false);
                    setSelectedReview(null);
                }}
                onSubmit={handleRespondToReview}
                review={selectedReview}
            />

            <ConfirmModal
                isOpen={showConfirmModal}
                onClose={() => {
                    setShowConfirmModal(false);
                    setSelectedReview(null);
                }}
                onConfirm={getConfirmModalConfig().onConfirm}
                title={getConfirmModalConfig().title}
                message={getConfirmModalConfig().message}
                confirmText={getConfirmModalConfig().confirmText}
                cancelText="Cancel"
            />

            <SuccessModal
                isOpen={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                title={
                    selectedAction === 'approve' ? 'Review Approved Successfully' :
                        selectedAction === 'reject' ? 'Review Rejected Successfully' :
                            selectedAction === 'feature' ? 'Featured Status Updated' :
                                'Review Deleted Successfully'
                }
                type="review"
            />
        </div>
    );
};

export default ReviewsPage;