

"use client"

import React, { useState, useEffect } from 'react';
import { ReviewSummary } from './review-summary';
import { ReviewCard } from './review-card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Loader2, Search } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import type { Review } from '@/lib/types';
import { db } from '@/lib/firebase';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { AddReviewForm } from './add-review-form';
import { Separator } from './ui/separator';
import { fromFirestore } from '@/lib/data';


interface ReviewsSectionProps {
    hotelId: string;
}

export function ReviewsSection({ hotelId }: ReviewsSectionProps) {
    const { user } = useAuth();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [visibleReviews, setVisibleReviews] = useState(4);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        setLoading(true);
        const reviewsQuery = query(collection(db, `hotels/${hotelId}/reviews`), orderBy('createdAt', 'desc'));
        
        const unsubscribe = onSnapshot(reviewsQuery, (snapshot) => {
            const reviewsData = snapshot.docs.map(doc => fromFirestore<Review>(doc)).filter(Boolean) as Review[];
            setReviews(reviewsData);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching reviews: ", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [hotelId]);


    const filteredReviews = reviews.filter(review => 
        review.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.userName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const loadMoreReviews = () => {
        setVisibleReviews(prev => prev + 4);
    }

    const ratingDistribution = [5, 4, 3, 2, 1].map(star => ({
        star,
        count: reviews.filter(r => r.rating === star).length
    }));
    
    return (
        <div>
            {loading ? (
                <div className="flex justify-center items-center h-48">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : reviews.length > 0 ? (
                <>
                    <ReviewSummary reviews={reviews} distribution={ratingDistribution} />
                    
                    <div className="my-8">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input 
                                placeholder="Search reviews" 
                                className="pl-10 max-w-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                        {filteredReviews.slice(0, visibleReviews).map(review => (
                            <ReviewCard key={review.id} review={review} />
                        ))}
                    </div>
                    
                    {visibleReviews < filteredReviews.length && (
                        <div className="mt-8">
                            <Button variant="outline" onClick={loadMoreReviews}>
                                Show all {filteredReviews.length} reviews
                            </Button>
                        </div>
                    )}
                </>
            ) : (
                <p className="text-muted-foreground text-center py-8">Be the first to leave a review!</p>
            )}

            {user && (
                <div className="mt-12">
                    <Separator className="my-8" />
                    <AddReviewForm hotelId={hotelId} onReviewAdded={() => { /* Can add refresh logic if not realtime */}} />
                </div>
            )}
        </div>
    )
}
