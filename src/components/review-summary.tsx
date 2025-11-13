
"use client"

import { Star } from 'lucide-react';
import { Progress } from './ui/progress';

type Review = {
  id: string;
  rating: number;
};

type RatingDistribution = {
  star: number;
  count: number;
}

interface ReviewSummaryProps {
    reviews: Review[];
    distribution: RatingDistribution[];
}

export function ReviewSummary({ reviews, distribution }: ReviewSummaryProps) {
    const totalReviews = reviews.length;
    const averageRating = (reviews.reduce((acc, review) => acc + review.rating, 0) / totalReviews).toFixed(1);

    const totalDistributionCount = distribution.reduce((acc, item) => acc + item.count, 0);

    return (
        <div>
            <h2 className="text-2xl font-semibold flex items-center gap-2">
                <Star className="w-6 h-6 text-primary" />
                <span>{averageRating} • {totalReviews} reviews</span>
            </h2>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-4">
                {distribution.map(({ star, count }) => {
                    const percentage = totalDistributionCount > 0 ? (count / totalDistributionCount) * 100 : 0;
                    return (
                        <div key={star} className="flex items-center gap-4">
                            <span className="text-sm font-medium w-12">{star} star{star > 1 && 's'}</span>
                            <Progress value={percentage} className="w-full h-2" />
                            <span className="text-sm text-muted-foreground w-8 text-right">{count}</span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
