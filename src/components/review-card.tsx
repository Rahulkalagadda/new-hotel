

"use client"

import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Star, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import Image from 'next/image';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';
import type { Review } from '@/lib/types';
import { format } from 'date-fns';
import { useAuth } from '@/hooks/use-auth';
import { deleteReview } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';


interface ReviewCardProps {
    review: Review;
}

const MAX_TEXT_LENGTH = 180;

export function ReviewCard({ review }: ReviewCardProps) {
    const { user } = useAuth();
    const { toast } = useToast();
    const [isExpanded, setIsExpanded] = useState(false);
    
    const isLongText = review.comment.length > MAX_TEXT_LENGTH;
    const canDelete = user && user.id === review.userId;

    const toggleExpand = () => setIsExpanded(!isExpanded);

    const handleDelete = async () => {
        try {
            await deleteReview(review.hotelId, review.id);
            toast({ title: "Review deleted" });
        } catch (error) {
            toast({ variant: 'destructive', title: "Error", description: "Could not delete review." });
        }
    }

    const displayText = isLongText && !isExpanded 
        ? `${review.comment.substring(0, MAX_TEXT_LENGTH)}...` 
        : review.comment;

    return (
        <div className="flex flex-col gap-4 border-b pb-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                        <AvatarImage src={review.userAvatar} alt={review.userName} />
                        <AvatarFallback>{review.userName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h4 className="font-bold">{review.userName}</h4>
                        <p className="text-sm text-muted-foreground">{review.userCountry}</p>
                    </div>
                </div>
                {canDelete && (
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your review.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">Delete</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}
            </div>
            <div className="flex items-center gap-2">
                <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'text-primary fill-primary' : 'text-muted-foreground/50'}`} />
                    ))}
                </div>
                <p className="text-sm font-semibold">{format(review.createdAt as Date, 'LLLL yyyy')}</p>
            </div>
            <p className="text-muted-foreground leading-relaxed">
                {displayText}
                {isLongText && (
                    <Button variant="link" className="p-0 h-auto ml-2" onClick={toggleExpand}>
                        {isExpanded ? 'Read less' : 'Read more'}
                    </Button>
                )}
            </p>
            
            {/* This part for review images is currently disabled as we are not collecting images yet */}
            {/* {review.images && review.images.length > 0 && ( ... )} */}
        </div>
    );
}
