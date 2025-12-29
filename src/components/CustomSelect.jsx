import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const CustomSelect = ({ icon: Icon, value, onChange, options, disabled, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (option) => {
        onChange(option);
        setIsOpen(false);
    };

    return (
        <div className="relative w-full group min-w-[200px]" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between px-6 py-4 transition-all duration-300 text-left relative z-20
                    ${disabled ? 'opacity-50 cursor-not-allowed grayscale' : 'cursor-pointer'}
                    ${isOpen
                        ? 'bg-slate-950 border-2 border-primary text-white rounded-t-2xl rounded-b-none shadow-[0_0_30px_rgba(13,148,136,0.2)]'
                        : 'bg-slate-900 border border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-primary/50 rounded-2xl'
                    }
                `}
                disabled={disabled}
            >
                <div className="flex items-center flex-1 min-w-0 gap-3">
                    {Icon && (
                        <div className={`shrink-0 transition-colors ${isOpen ? 'text-primary' : 'text-slate-400 group-hover:text-primary'}`}>
                            <Icon size={20} strokeWidth={2} />
                        </div>
                    )}
                    <span className={`block truncate font-bold text-base tracking-wide ${value ? 'text-white' : 'text-slate-500'}`}>
                        {value || placeholder}
                    </span>
                </div>
                <div className={`ml-4 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : 'text-slate-500 group-hover:text-primary'}`}>
                    <ChevronDown size={20} strokeWidth={2.5} />
                </div>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 bg-slate-950 border-2 border-t-0 border-primary rounded-b-2xl shadow-[0_15px_40px_-5px_rgba(13,148,136,0.2)] z-50 max-h-[350px] overflow-y-auto custom-scrollbar animate-in slide-in-from-top-1 duration-200 flex flex-col">
                    {/* Separator Line */}
                    <div className="h-[2px] w-full bg-primary/20 shrink-0"></div>

                    <div className="py-2">
                        {options.length > 0 ? (
                            options.map((option) => (
                                <div
                                    key={option}
                                    onClick={() => handleSelect(option)}
                                    className={`px-6 py-4 text-base font-medium cursor-pointer transition-all border-l-4 ${value === option
                                        ? 'bg-primary/10 text-white border-l-primary'
                                        : 'text-slate-400 hover:bg-white/5 hover:text-white border-l-transparent'
                                        }`}
                                >
                                    {option}
                                </div>
                            ))
                        ) : (
                            <div className="px-6 py-8 text-base text-slate-500 font-medium text-center italic">
                                No options found
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomSelect;
