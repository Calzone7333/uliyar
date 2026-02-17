import React from 'react';

const GallerySection = () => {
    return (
        <div className="bg-primary py-24 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Centered */}
                <div className="text-center mb-16">
                    <h2 className="text-sm font-medium tracking-wide mb-3 opacity-90">Benefits</h2>
                    <h3 className="text-4xl md:text-5xl font-medium mb-6">What you gain here</h3>
                    <p className="text-lg text-blue-50 font-light">
                        For workers seeking steady employment and better opportunities
                    </p>
                </div>
                {/* Content Area */}
                <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 lg:gap-8 h-auto lg:h-[600px]">
                    {/* Left Column - 4 Vertical Image Strips */}
                    <div className="h-[400px] lg:h-full w-full flex gap-2 rounded-2xl overflow-hidden bg-white/10">
                        {/* Strip 1 - Factory */}
                        <div className="flex-1 hover:flex-[2] transition-all duration-500 ease-in-out h-full relative group overflow-hidden">
                            <img src="/images/gallery/strip_factory.png" className="absolute inset-0 w-full h-full object-cover object-center transition-all duration-500" alt="Factory Worker" />
                        </div>
                        {/* Strip 2 - Mechanic */}
                        <div className="flex-1 hover:flex-[2] transition-all duration-500 ease-in-out h-full relative group overflow-hidden">
                            <img src="/images/gallery/strip_mechanic.png" className="absolute inset-0 w-full h-full object-cover object-center transition-all duration-500" alt="Mechanic" />
                        </div>
                        {/* Strip 3 - Plumber */}
                        <div className="flex-1 hover:flex-[2] transition-all duration-500 ease-in-out h-full relative group overflow-hidden">
                            <img src="/images/gallery/strip_plumber.png" className="absolute inset-0 w-full h-full object-cover object-center transition-all duration-500" alt="Plumber" />
                        </div>
                        {/* Strip 4 - Cleaner */}
                        <div className="flex-1 hover:flex-[2] transition-all duration-500 ease-in-out h-full relative group overflow-hidden">
                            <img src="/images/gallery/strip_cleaner.png" className="absolute inset-0 w-full h-full object-cover object-center transition-all duration-500" alt="Cleaner" />
                        </div>
                    </div>

                    {/* Right Column - 2 Stacked Blue Cards */}
                    <div className="h-[400px] lg:h-full flex flex-col gap-6">
                        {/* Top Card - Uploads */}
                        <div className="flex-1 relative rounded-2xl overflow-hidden group cursor-pointer border border-white/20">
                            {/* Background Image - Changed to object-top to show face */}
                            <img src="/images/gallery/gallery_card_upload.png" className="absolute inset-0 w-full h-full object-cover object-top transform group-hover:scale-105 transition-transform duration-700" alt="Uploads" />

                            {/* Gradient for text readability only */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80"></div>

                            {/* Content */}
                            <div className="absolute inset-0 flex items-center justify-center z-10">
                                <h3 className="text-3xl lg:text-5xl font-bold text-white tracking-wide drop-shadow-lg">Uploads</h3>
                            </div>
                        </div>

                        {/* Bottom Card - Hire */}
                        <div className="flex-1 relative rounded-2xl overflow-hidden group cursor-pointer border border-white/20">
                            {/* Background Image - Changed to object-top to show faces */}
                            <img src="/images/gallery/gallery_card_hire.png" className="absolute inset-0 w-full h-full object-cover object-top transform group-hover:scale-105 transition-transform duration-700" alt="Hire" />

                            {/* Gradient for text readability only */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80"></div>

                            {/* Content */}
                            <div className="absolute inset-0 flex items-center justify-center z-10">
                                <h3 className="text-3xl lg:text-5xl font-bold text-white tracking-wide drop-shadow-lg">Hire</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GallerySection;
