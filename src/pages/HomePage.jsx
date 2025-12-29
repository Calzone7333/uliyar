import React from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import GallerySection from '../components/GallerySection';
import HowItWorks from '../components/HowItWorks';
import Benefits from '../components/Benefits';
import FAQ from '../components/FAQ';

const HomePage = () => {
    return (
        <>
            <Hero />
            <Features />
            <GallerySection />
            <HowItWorks />
            <Benefits />
            <FAQ />
        </>
    );
};

export default HomePage;
