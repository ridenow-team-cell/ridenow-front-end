"use client"
import React from 'react';
import { Trash2, MapPin, Check, X, Clock } from 'lucide-react';
import { RouteStop } from '@/types/route';

interface StopDetailOverlayProps {
    stop: Omit<RouteStop, 'order'>;
    index: number;
    totalStops: number;
    onUpdate: (field: keyof RouteStop, value: any) => void;
    onRemove: () => void;
    onClose: () => void;
}

const StopDetailOverlay: React.FC<StopDetailOverlayProps> = ({
    stop,
    index,
    totalStops,
    onUpdate,
    onRemove,
    onClose
}) => {
    return (
        <div className="p-4 min-w-[280px] bg-white rounded-2xl shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm ${
                        index === 0 ? 'bg-green-500' : index === totalStops - 1 ? 'bg-red-500' : 'bg-[#E7A533]'
                    }`}>
                        {index + 1}
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-800 leading-tight">
                            {index === 0 ? 'Starting Point' : index === totalStops - 1 ? 'Destination' : `Stop ${index + 1}`}
                        </h4>
                        <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider font-montserrat">Stop Details</p>
                    </div>
                </div>
                <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors text-gray-400">
                    <X size={16} />
                </button>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block tracking-wider">Stop Name</label>
                    <input 
                        type="text"
                        value={stop.name}
                        onChange={(e) => onUpdate('name', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-[#0066CC] transition-all"
                    />
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 p-2 rounded-xl border border-gray-100">
                    <MapPin size={14} className="text-gray-400 flex-shrink-0" />
                    <span className="truncate" title={stop.address}>{stop.address}</span>
                </div>

                <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer group">
                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${stop.isPickupPoint ? 'bg-[#0066CC] border-[#0066CC]' : 'border-gray-300 group-hover:border-[#0066CC]'}`}>
                            {stop.isPickupPoint && <Check size={10} className="text-white" />}
                        </div>
                        <input 
                            type="checkbox" 
                            checked={stop.isPickupPoint} 
                            onChange={(e) => onUpdate('isPickupPoint', e.target.checked)}
                            className="hidden" 
                        />
                        <span className="text-xs font-medium text-gray-600">Pickup</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer group">
                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${stop.isDropoffPoint ? 'bg-[#0066CC] border-[#0066CC]' : 'border-gray-300 group-hover:border-[#0066CC]'}`}>
                            {stop.isDropoffPoint && <Check size={10} className="text-white" />}
                        </div>
                        <input 
                            type="checkbox" 
                            checked={stop.isDropoffPoint} 
                            onChange={(e) => onUpdate('isDropoffPoint', e.target.checked)}
                            className="hidden" 
                        />
                        <span className="text-xs font-medium text-gray-600">Drop-off</span>
                    </label>
                </div>

                {index > 0 && (
                    <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block tracking-wider">Time Offset (HH:MM:SS)</label>
                        <div className="flex items-center gap-2">
                            <Clock size={14} className="text-gray-400" />
                            <input 
                                type="text"
                                value={stop.estimatedArrivalTimeOffset}
                                onChange={(e) => onUpdate('estimatedArrivalTimeOffset', e.target.value)}
                                placeholder="00:15:00"
                                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-[#0066CC] transition-all"
                            />
                        </div>
                    </div>
                )}

                <button 
                    onClick={onRemove}
                    className="w-full py-2.5 flex items-center justify-center gap-2 text-xs font-bold text-red-500 bg-red-50 hover:bg-red-100 rounded-xl transition-all border border-red-100"
                >
                    <Trash2 size={14} /> Remove Stop
                </button>
            </div>
        </div>
    );
};

export default StopDetailOverlay;
