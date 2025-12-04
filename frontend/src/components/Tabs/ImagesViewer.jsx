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
                        {/* Placeholder for actual image since we don't have the files */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
                            <ImageIcon size={32} className="mb-2 opacity-50" />
                            <span className="text-xs font-medium">{img.src}</span>
                            <span className="text-[10px] mt-1 bg-background/80 px-1.5 py-0.5 rounded">Page {img.page}</span>
                        </div>

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors cursor-pointer" />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ImagesViewer;
