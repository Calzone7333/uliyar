import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { X, Check, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';

const ImageCropper = ({ image, onCropDone, onCropCancel }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const createPlottedImage = async (imageSrc, pixelCrop, rotation = 0) => {
        const image = await new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = (error) => reject(error);
            img.src = imageSrc;
        });

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) return null;

        const rotRad = (rotation * Math.PI) / 180;
        const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
            image.width,
            image.height,
            rotation
        );

        // set canvas size to match the bounding box
        canvas.width = bBoxWidth;
        canvas.height = bBoxHeight;

        // translate canvas context to a central point to allow rotating and flipping around the center
        ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
        ctx.rotate(rotRad);
        ctx.translate(-image.width / 2, -image.height / 2);

        // draw rotated image
        ctx.drawImage(image, 0, 0);

        const data = ctx.getImageData(
            pixelCrop.x,
            pixelCrop.y,
            pixelCrop.width,
            pixelCrop.height
        );

        // set canvas width to final desired crop size - this will clear existing context
        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;

        // paste generated rotate image with correct offsets for x,y crop values.
        ctx.putImageData(data, 0, 0);

        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                resolve(blob);
            }, 'image/jpeg');
        });
    };

    function rotateSize(width, height, rotation) {
        const rotRad = (rotation * Math.PI) / 180;
        return {
            width:
                Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
            height:
                Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
        };
    }

    return (
        <div className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[80vh]">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
                    <div>
                        <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Crop Image</h3>
                        <p className="text-xs text-slate-500 font-medium tracking-wide">Adjust image to fit the requirement</p>
                    </div>
                    <button onClick={onCropCancel} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-all">
                        <X size={20} />
                    </button>
                </div>

                <div className="relative flex-1 bg-slate-100">
                    <Cropper
                        image={image}
                        crop={crop}
                        zoom={zoom}
                        rotation={rotation}
                        aspect={null} // Dynamic aspect for newspaper clippings
                        onCropChange={setCrop}
                        onCropComplete={onCropComplete}
                        onZoomChange={setZoom}
                        onRotationChange={setRotation}
                    />
                </div>

                <div className="p-6 bg-white border-t border-slate-100 space-y-6">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="flex-1 w-full space-y-2">
                            <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                <span>Zoom</span>
                                <span>{Math.round(zoom * 100)}%</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <ZoomOut size={16} className="text-slate-400" />
                                <input
                                    type="range"
                                    value={zoom}
                                    min={1}
                                    max={3}
                                    step={0.1}
                                    aria-labelledby="Zoom"
                                    onChange={(e) => setZoom(e.target.value)}
                                    className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600 outline-none"
                                />
                                <ZoomIn size={16} className="text-slate-400" />
                            </div>
                        </div>

                        <div className="flex-1 w-full space-y-2">
                            <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                <span>Rotation</span>
                                <span>{rotation}°</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <button onClick={() => setRotation(r => (r - 90) % 360)} className="p-1.5 bg-slate-50 rounded-lg text-slate-600 hover:bg-slate-100">
                                    <RotateCw size={16} className="transform -scale-x-100" />
                                </button>
                                <input
                                    type="range"
                                    value={rotation}
                                    min={0}
                                    max={360}
                                    step={1}
                                    aria-labelledby="Rotation"
                                    onChange={(e) => setRotation(e.target.value)}
                                    className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600 outline-none"
                                />
                                <button onClick={() => setRotation(r => (r + 90) % 360)} className="p-1.5 bg-slate-50 rounded-lg text-slate-600 hover:bg-slate-100">
                                    <RotateCw size={16} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-2">
                        <button
                            onClick={onCropCancel}
                            className="px-6 py-2.5 text-slate-500 font-bold text-sm hover:text-slate-700 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={async () => {
                                const croppedBlob = await createPlottedImage(image, croppedAreaPixels, rotation);
                                onCropDone(croppedBlob);
                            }}
                            className="bg-blue-600 text-white px-8 py-2.5 rounded-xl font-black text-sm shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 transition-all flex items-center gap-2"
                        >
                            <Check size={18} /> Apply Crop
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageCropper;
