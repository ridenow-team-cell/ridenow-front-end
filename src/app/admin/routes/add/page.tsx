"use client"
import React from 'react';
import { useRouter } from 'next/navigation';
import RouteMapView from '@/components/ui/maps/RouteMapView';
import { useCreateRoute, useRoutes } from '@/hooks/use-routes';
import { CreateRouteRequest } from '@/types/route';
import { toast } from 'react-hot-toast';
import { ChevronLeft } from 'lucide-react';

const AddRoutePage = () => {
    const router = useRouter();
    const createRoute = useCreateRoute();
    const { data: existingRoutes } = useRoutes({ limit: 100 }); // Get some routes for the "all routes" layer

    const handleSaveRoute = (routeData: CreateRouteRequest) => {
        createRoute.mutate(routeData, {
            onSuccess: () => {
                toast.success('Route created successfully!');
                router.push('/admin/routes-schedules');
            },
            onError: (error: any) => {
                toast.error(error.message || 'Failed to create route');
            }
        });
    };

    const handleCancel = () => {
        router.back();
    };

    return (
        <div className="p-4 sm:p-6 bg-[#F9FAFB] min-h-screen">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <button 
                        onClick={handleCancel}
                        className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors mb-2 text-sm font-medium"
                    >
                        <ChevronLeft size={16} />
                        Back to Routes
                    </button>
                    <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Create New Route</h1>
                    <p className="text-gray-500 text-sm">Design your route by clicking on the map to add stops.</p>
                </div>
            </div>

            {/* Map Section */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <RouteMapView 
                    existingRoutes={existingRoutes || []}
                    onSaveRoute={handleSaveRoute}
                    isAddingRoute={true}
                    onCancelAdd={handleCancel}
                    showAllRoutes={false}
                />
            </div>
        </div>
    );
};

export default AddRoutePage;
