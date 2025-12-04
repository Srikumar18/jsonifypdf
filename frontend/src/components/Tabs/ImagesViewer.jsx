import React from 'react';
import { useStore } from '../../store/useStore';
import { Image as ImageIcon } from 'lucide-react';

const ImagesViewer = () => {
    const { currentFile } = useStore();
    // Flatten images from all pages
    const images = currentFile?.pages?.flatMap(p => p.images.map(img => ({ src: img, page: p.page }))) || [];

    if (images.length === 0) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-2">
                <ImageIcon size={48} className="opacity-20" />
                <p>No images found in this document.</p>
            </div>
        );
    }

    return (
        <div className="h-full overflow-y-auto p-6 bg-background">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((img, index) => (
                    <div key={index} className="group relative aspect-square bg-muted/30 rounded-lg border border-border overflow-hidden hover:shadow-md transition-all">
                        <img
                            src={`http://localhost:8000${img.src}`}
                            alt="Extracted"
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors cursor-pointer" />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ImagesViewer;
