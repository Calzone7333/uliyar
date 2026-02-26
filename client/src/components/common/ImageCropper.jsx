import React, { useState, useRef } from 'react';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { X, Check, RotateCw, ZoomIn, ZoomOut } from 'lucide-react';

const ImageCropper = ({ image, onCropDone, onCropCancel }) => {
    const [crop, setCrop] = useState();
    const [completedCrop, setCompletedCrop] = useState();
    const imgRef = useRef(null);

    function onImageLoad(e) {
        const { width, height } = e.currentTarget;
        const initialCrop = centerCrop(
            makeAspectCrop(
                {
                    unit: '%',
                    width: 90,
                },
                null,
                width,
                height
            ),
            width,
            height
        );
        setCrop(initialCrop);
    }

    async function handleApply() {
        if (!completedCrop || !imgRef.current) return;

        const canvas = document.createElement('canvas');
        const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
        const scaleY = imgRef.current.naturalHeight / imgRef.current.height;

        canvas.width = completedCrop.width * scaleX;
        canvas.height = completedCrop.height * scaleY;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(
            imgRef.current,
            completedCrop.x * scaleX,
            completedCrop.y * scaleY,
            completedCrop.width * scaleX,
            completedCrop.height * scaleY,
            0,
            0,
            canvas.width,
            canvas.height
        );

        canvas.toBlob((blob) => {
            if (blob) {
                onCropDone(blob);
            }
        }, 'image/jpeg', 0.95);
    }

    async function handleUploadOriginal() {
        const response = await fetch(image);
        const blob = await response.blob();
        onCropDone(blob);
    }

    return (
        <div className="fixed inset-0 z-[100] bg-slate-900/95 backdrop-blur-md flex items-center justify-center p-4">
            <style>
                {`
                .ReactCrop__crop-selection {
                    border: 1px solid rgba(255, 255, 255, 0.8) !important;
                    box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.6) !important;
                }
                .ReactCrop__rule-of-thirds-vt::before, .ReactCrop__rule-of-thirds-vt::after,
                .ReactCrop__rule-of-thirds-hz::before, .ReactCrop__rule-of-thirds-hz::after {
                    background-color: rgba(255, 255, 255, 0.4) !important;
                }
                /* Custom Handles to match screenshot */
                .ReactCrop__drag-handle {
                    width: 12px !important;
                    height: 12px !important;
                    background-color: #fff !important;
                    border: 1.5px solid #555 !important;
                }
                .ReactCrop__drag-handle.ord-nw, .ReactCrop__drag-handle.ord-ne,
                .ReactCrop__drag-handle.ord-sw, .ReactCrop__drag-handle.ord-se {
                    border-radius: 50% !important;
                    width: 14px !important;
                    height: 14px !important;
                }
                .ReactCrop__drag-handle.ord-n, .ReactCrop__drag-handle.ord-e,
                .ReactCrop__drag-handle.ord-s, .ReactCrop__drag-handle.ord-w {
                    border-radius: 2px !important;
                    width: 12px !important;
                    height: 8px !important;
                }
                .ReactCrop__drag-handle.ord-e, .ReactCrop__drag-handle.ord-w {
                    width: 8px !important;
                    height: 12px !important;
                }
                `}
            </style>

            <div className="bg-white w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[85vh]">
                <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between bg-white relative z-10">
                    <div>
                        <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Adjust Selection</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Drag corners to crop or upload original image</p>
                    </div>
                    <button
                        onClick={onCropCancel}
                        className="p-2.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-all border border-transparent hover:border-slate-200"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 bg-[#1a1c1e] relative flex items-center justify-center overflow-hidden p-8">
                    <ReactCrop
                        crop={crop}
                        onChange={(c) => setCrop(c)}
                        onComplete={(c) => setCompletedCrop(c)}
                        ruleOfThirds
                    >
                        <img
                            ref={imgRef}
                            alt="Crop me"
                            src={image}
                            onLoad={onImageLoad}
                            className="max-h-[60vh] object-contain select-none"
                        />
                    </ReactCrop>
                </div>

                <div className="p-8 bg-white border-t border-slate-100">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                            <div className="flex flex-col gap-1">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Dimensions</span>
                                <span className="text-xs font-bold text-slate-600">
                                    {completedCrop ? `${Math.round(completedCrop.width)} x ${Math.round(completedCrop.height)} px` : 'Select area'}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <button
                                onClick={onCropCancel}
                                className="px-6 py-3 text-slate-500 font-bold text-sm tracking-tight hover:text-slate-800 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUploadOriginal}
                                className="px-6 py-3 border-2 border-slate-200 text-slate-600 rounded-2xl font-black text-sm hover:bg-slate-50 transition-all"
                            >
                                Upload Original
                            </button>
                            <button
                                onClick={handleApply}
                                className="flex-1 sm:flex-none bg-blue-600 text-white px-10 py-3.5 rounded-2xl font-black text-sm shadow-xl shadow-blue-500/20 hover:bg-blue-700 hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center gap-3"
                            >
                                <Check size={20} strokeWidth={3} /> Save Selection
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageCropper;
