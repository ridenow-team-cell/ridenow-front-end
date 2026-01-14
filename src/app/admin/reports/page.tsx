"use client"
import React, { useState } from 'react';
import { Calendar, Download, FileText, BarChart, Users, User, Check } from 'lucide-react';
import FilterSection from '@/components/ui/FilterSection';

const ReportsPage = () => {
    const [selectedDates, setSelectedDates] = useState<string[]>(['Dec 29,2025', 'Dec 30,2025', 'Dec 31,2025']);
    const [selectedReport, setSelectedReport] = useState<string>('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [generatedReport, setGeneratedReport] = useState<any>(null);

    const reportTypes = [
        {
            id: 'trip',
            title: 'Trip Report',
            icon: <FileText className="text-[#0066CC]" size={24} />,
            description: 'Detailed trip information and analytics'
        },
        {
            id: 'revenue',
            title: 'Revenue Report',
            icon: <BarChart className="text-[#E7A533]" size={24} />,
            description: 'Revenue breakdown and financial analytics'
        },
        {
            id: 'driver',
            title: 'Driver Report',
            icon: <User className="text-[#0066CC]" size={24} />,
            description: 'Driver performance and activity reports'
        },
        {
            id: 'user',
            title: 'User Report',
            icon: <Users className="text-[#E7A533]" size={24} />,
            description: 'User activity and engagement analytics'
        }
    ];

    const handleDateChange = (index: number, newDate: string) => {
        const newDates = [...selectedDates];
        newDates[index] = newDate;
        setSelectedDates(newDates);
    };

    const handleGenerateReport = () => {
        if (!selectedReport) {
            alert('Please select a report type');
            return;
        }

        // Simulate generating a report
        const reportData = {
            type: selectedReport,
            dateRange: selectedDates,
            generatedAt: new Date().toLocaleString(),
            data: {
                totalTrips: 245,
                totalRevenue: '₦2,860,000',
                activeDrivers: 64,
                activeUsers: 345,
                averageRating: 4.5
            }
        };

        setGeneratedReport(reportData);
    };

    const handleDownloadReport = () => {
        if (generatedReport) {
            const dataStr = JSON.stringify(generatedReport, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${selectedReport}-report-${new Date().getTime()}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }
    };

    return (
        <div className="p-4 sm:p-6">



            {/* Report Generation Section */}
            <div className="bg-white min-h-[600px] rounded-lg p-4 sm:p-6 mb-8">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-6">Generate Report</h2>

                <FilterSection
                    showAddButton={true}
                    addButtonText="Generate Report"
                />

            </div>


        </div>
    );
};

export default ReportsPage;