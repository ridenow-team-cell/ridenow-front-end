"use client"
import React, { useState } from 'react';
import { Calendar, ChevronDown, Search, MoreVertical, Star, MessageSquare, User, Filter } from 'lucide-react';
import DataTable from '@/components/ui/DataTable';
import FilterSection from '@/components/ui/FilterSection';

interface Review {
    id: number;
    staffStudentId: string;
    message: string;
    rating: number;
    date: string;
    userName: string;
}

const ReviewsPage = () => {
    const [reviews, setReviews] = useState<Review[]>([
        { id: 1, staffStudentId: 'dora_2023', message: 'admin@ridenow.com', rating: 4, date: '18/12/2025', userName: 'John Doe' },
        { id: 2, staffStudentId: 'dora_2023', message: 'admin@ridenow.com', rating: 3, date: '18/12/2025', userName: 'Jane Smith' },
        { id: 3, staffStudentId: 'dora_2023', message: 'admin@ridenow.com', rating: 5, date: '18/12/2025', userName: 'Mike Johnson' },
        { id: 4, staffStudentId: 'dora_2023', message: 'admin@ridenow.com', rating: 2, date: '18/12/2025', userName: 'Sarah Williams' },
        { id: 5, staffStudentId: 'dora_2023', message: 'admin@ridenow.com', rating: 4, date: '18/12/2025', userName: 'Robert Brown' },
        { id: 6, staffStudentId: 'dora_2023', message: 'admin@ridenow.com', rating: 3, date: '18/12/2025', userName: 'Lisa Davis' },
        { id: 7, staffStudentId: 'dora_2023', message: 'admin@ridenow.com', rating: 5, date: '18/12/2025', userName: 'Tom Wilson' },
    ]);

    const [filterRating, setFilterRating] = useState<number | null>(null);

    // Filter reviews by rating
    const filteredReviews = filterRating === null
        ? reviews
        : reviews.filter(review => review.rating === filterRating);

    // Calculate rating statistics
    const totalReviews = reviews.length;
    const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
    const ratingDistribution = [5, 4, 3, 2, 1].map(stars => ({
        stars,
        count: reviews.filter(r => r.rating === stars).length,
        percentage: (reviews.filter(r => r.rating === stars).length / reviews.length) * 100
    }));

    const columns = [
        { key: 'staffStudentId', header: 'Staff/Student ID' },
        { key: 'message', header: 'Message' },
        { key: 'rating', header: 'Rating' },

    ];

    const renderStars = (rating: number) => {
        return (
            <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        size={16}
                        className={`${star <= rating
                            ? 'text-yellow-500 fill-yellow-500'
                            : 'text-[#005BAF]'
                            }`}
                    />
                ))}
            </div>
        );
    };

    const formatData = (review: Review) => ({
        ...review,
        staffStudentId: (
            <div className="flex items-center gap-2">
                <span>{review.staffStudentId}</span>
            </div>
        ),
        message: (
            <div className="flex items-center gap-2">
                <span>{review.message}</span>
            </div>
        ),
        rating: renderStars(review.rating),
        date: review.date,
    });

    const formattedData = filteredReviews.map(formatData);

    const actions = [
        {
            label: 'View Details',
            onClick: (review: Review) => console.log('View review:', review)
        },
        {
            label: 'Reply',
            onClick: (review: Review) => console.log('Reply to review:', review)
        },
        {
            label: 'Delete',
            onClick: (review: Review) => {
                setReviews(reviews.filter(r => r.id !== review.id));
            },
            className: 'text-red-500'
        }
    ];

    return (
        <div className="p-4 sm:p-6">



            {/* Filter Section */}
            <div className="bg-white rounded-lg p-4 sm:p-6 mb-6">
                <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1 w-full lg:w-auto">
                        <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2">
                            <Calendar size={20} className="text-gray-400" />
                            <span className="text-sm text-gray-700">Dec 29,2025</span>
                            <span className="text-gray-400">-</span>
                            <span className="text-sm text-gray-700">Dec 30,2025</span>
                        </div>

                        <button className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50 transition-colors">
                            <span className="text-sm text-gray-700">Filter</span>
                            <ChevronDown size={20} className="text-gray-400" />
                        </button>

                        <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2 flex-1 w-full sm:w-auto">
                            <Search size={20} className="text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search reviews..."
                                className="border-none outline-none text-sm flex-1 bg-transparent placeholder-gray-400 text-gray-700"
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 w-full lg:w-auto">
                        <button className="flex items-center justify-center gap-2 bg-[#E7A533] text-gray-800 px-6 py-2 rounded-lg hover:bg-[#d69420] transition-colors flex-1 lg:flex-initial">
                            <span className="text-base font-medium">Search</span>
                        </button>
                        <button className="flex items-center justify-center gap-2 bg-[#0066CC] text-white px-6 py-2 rounded-lg hover:bg-[#0052a3] transition-colors flex-1 lg:flex-initial">
                            <Filter size={20} />
                            <span className="text-base font-medium">Advanced Filter</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Reviews Table */}
            <div className="bg-white rounded-lg overflow-hidden">
                <div className="p-4 sm:p-6">


                    <DataTable
                        columns={columns}
                        data={formattedData}
                        actions={actions}
                    />

                    <div className="flex justify-center items-center gap-2 mt-6">
                        <button className="w-10 h-10 flex items-center justify-center bg-[#E7A533] text-white rounded-lg hover:bg-[#d69420] transition-colors">
                            ‹
                        </button>
                        <button className="w-10 h-10 flex items-center justify-center bg-[#E7A533] text-gray-800 rounded-lg">
                            1
                        </button>
                        <button className="w-10 h-10 flex items-center justify-center bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                            2
                        </button>
                        <button className="w-10 h-10 flex items-center justify-center bg-[#E7A533] text-white rounded-lg hover:bg-[#d69420] transition-colors">
                            ›
                        </button>
                    </div>
                </div>
            </div>


        </div>
    );
};

export default ReviewsPage;