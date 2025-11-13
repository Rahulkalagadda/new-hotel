
"use client"

import Image from 'next/image';
import { Button } from './ui/button';
import { ThumbsUp, Grid3x3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';

interface ImageGridProps {
    images: string[];
}

export function ImageGrid({ images }: ImageGridProps) {
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);

    if (!images || images.length === 0) {
        return (
            <div className="relative h-[60vh] w-full overflow-hidden rounded-2xl bg-muted flex items-center justify-center">
                <p>No images available</p>
            </div>
        )
    }

    const openGallery = () => setIsGalleryOpen(true);

    return (
        <>
            <div className="relative h-[60vh] w-full overflow-hidden rounded-2xl group">
                <div 
                    className="grid grid-cols-4 grid-rows-2 gap-2 h-full cursor-pointer"
                    onClick={openGallery}
                >
                    {/* Main Image */}
                    <div className="col-span-2 row-span-2">
                        <div className="relative w-full h-full">
                            <Image
                                src={images[0]}
                                alt="Main hotel view"
                                layout="fill"
                                objectFit="cover"
                                className="bg-muted group-hover:opacity-90 transition-opacity"
                            />
                        </div>
                    </div>

                    {/* Other Images */}
                    {images.slice(1, 5).map((src, index) => (
                        <div key={index} className={cn("relative w-full h-full", index > 1 ? 'hidden md:block' : '')}>
                            <Image
                                src={src}
                                alt={`Hotel view ${index + 2}`}
                                layout="fill"
                                objectFit="cover"
                                className="bg-muted group-hover:opacity-90 transition-opacity"
                            />
                        </div>
                    ))}
                </div>
                <Button variant="secondary" className="absolute bottom-4 right-4" onClick={openGallery}>
                    <Grid3x3 className="mr-2 h-4 w-4"/>
                    Show all photos
                </Button>
            </div>
            
            <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
                <DialogContent className="max-w-7xl h-[90vh] p-0 border-0 flex items-center justify-center">
                    <DialogHeader className="sr-only">
                        <DialogTitle>Image Gallery</DialogTitle>
                        <DialogDescription>A carousel of all images for this hotel.</DialogDescription>
                    </DialogHeader>
                   <Carousel className="w-full h-full">
                        <CarouselContent className="h-full">
                            {images.map((src, index) => (
                                <CarouselItem key={index} className="h-full flex items-center justify-center p-4">
                                    <div className="relative h-full w-full">
                                        <Image
                                            src={src}
                                            alt={`Gallery image ${index + 1}`}
                                            layout="fill"
                                            objectFit="contain"
                                        />
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                         {images.length > 1 && (
                            <>
                                <CarouselPrevious className="absolute left-4 bg-background/50 hover:bg-background" />
                                <CarouselNext className="absolute right-4 bg-background/50 hover:bg-background" />
                            </>
                         )}
                    </Carousel>
                </DialogContent>
            </Dialog>
        </>
    );
}
