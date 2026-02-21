import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const FAQ = () => {
    const { t } = useTranslation();
    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
        {
            question: "Is hiring on Uliyar free?",
            answer: "Job posting is free for the first 3 listings. After that, we offer competitive pricing plans tailored to your hiring needs. Browsing contracts is always free."
        },
        {
            question: "How do you verify workers?",
            answer: "We have a rigorous 3-step verification process including identity checks, potential criminal background checks (optional), and skill assessments where applicable."
        },
        {
            question: "Can I cancel a job post?",
            answer: "Yes, you can cancel a job post at any time from your dashboard. If you've boosted the post, pro-rated credits may be refunded to your account."
        },
        {
            question: "How are payments handled?",
            answer: "We use a secure escrow system. You fund the milestone, the worker completes the job, you approve the work, and then funds are released. This protects both parties."
        },
        {
            question: "What happens if there is a dispute?",
            answer: "We have a dedicated dispute resolution team. If you're not satisfied or there's a disagreement, you can open a ticket and our team will mediate based on the contract terms."
        },
        {
            question: "Do I need to sign up to view jobs?",
            answer: "You can browse a limited number of job listings as a guest, but to apply or see full details, you'll need to create a free account."
        }
    ];

    return (
        <div className="py-24 bg-white" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', letterSpacing: '-0.02em' }}>
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-primary font-bold text-[12px] tracking-wider uppercase mb-3">{t("FAQ")}</h2>
                    <h3 className="text-4xl md:text-5xl font-[700] leading-[1.2] text-slate-800 mb-6">Frequently asked questions</h3>
                    <p className="text-[17px] text-slate-600 font-[500] max-w-lg mx-auto">
                        Frequently asked questions about our process, pricing, and security.
                    </p>
                </div>

                <div className="space-y-2">
                    {faqs.map((faq, idx) => (
                        <div key={idx} className="bg-white rounded-lg overflow-hidden">
                            <button
                                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                                className="w-full flex items-center justify-between p-5 text-left bg-white hover:bg-gray-50 transition-colors focus:outline-none"
                            >
                                <span className="text-sm font-bold text-gray-900">{faq.question}</span>
                                {openIndex === idx ? <Minus size={16} className="text-gray-500" /> : <Plus size={16} className="text-gray-500" />}
                            </button>
                            <div
                                className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === idx ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}
                            >
                                <div className="p-5 pt-0 text-sm text-gray-600 leading-relaxed">
                                    {faq.answer}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FAQ;
