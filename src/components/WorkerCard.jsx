import React from 'react';
import { MapPin, Star, Shield, Clock } from 'lucide-react';

const WorkerCard = ({ worker }) => {
    return (
        <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300 group">
            <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                    <img
                        src={worker.image || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + worker.name}
                        alt={worker.name}
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <h3 className="text-lg font-bold text-[#031d31] group-hover:text-blue-600 transition-colors">
                            {worker.name}
                        </h3>
                        {worker.available && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                Available
                            </span>
                        )}
                    </div>
                    <p className="text-blue-600 font-medium text-sm">{worker.role}</p>
                    <div className="flex items-center text-gray-500 text-xs mt-1">
                        <MapPin size={12} className="mr-1" />
                        {worker.location}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4 text-sm bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                    <Star size={14} className="text-yellow-500" />
                    <span className="font-medium text-gray-700">{worker.experience} Exp</span>
                </div>
                <div className="flex items-center gap-2 text-blue-700">
                    <Shield size={14} />
                    <span className="font-medium">Verified</span>
                </div>
                <div className="col-span-2 flex items-center gap-2 border-t border-gray-200 pt-2 mt-1">
                    <Clock size={14} className="text-gray-400" />
                    <span className="font-medium text-gray-900">{worker.hourlyRate}</span>
                </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
                {worker.skills.slice(0, 3).map((skill, index) => (
                    <span key={index} className="text-xs text-gray-500 bg-white border border-gray-200 px-2 py-1 rounded">
                        {skill}
                    </span>
                ))}
                {worker.skills.length > 3 && (
                    <span className="text-xs text-gray-400 px-1 py-1">+ {worker.skills.length - 3} more</span>
                )}
            </div>

            <button className="w-full bg-white border-2 border-[#031d31] text-[#031d31] group-hover:bg-[#031d31] group-hover:text-white px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300">
                Contact Worker
            </button>
        </div>
    );
};

export default WorkerCard;
