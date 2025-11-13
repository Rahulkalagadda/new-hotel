
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Star } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { createReview } from "@/lib/data";
import { useState } from "react";
import { cn } from "@/lib/utils";

const addReviewFormSchema = z.object({
  rating: z.number().min(1, { message: "Please select a rating." }).max(5),
  comment: z.string().min(10, {
    message: "Comment must be at least 10 characters.",
  }).max(500, {
    message: "Comment cannot be longer than 500 characters."
  }),
});

type AddReviewFormValues = z.infer<typeof addReviewFormSchema>;

interface AddReviewFormProps {
    hotelId: string;
    onReviewAdded: () => void;
}

export function AddReviewForm({ hotelId, onReviewAdded }: AddReviewFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [hoverRating, setHoverRating] = useState(0);

  const form = useForm<AddReviewFormValues>({
    resolver: zodResolver(addReviewFormSchema),
    defaultValues: {
      rating: 0,
      comment: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data: AddReviewFormValues) => {
    if (!user) {
        toast({ variant: 'destructive', title: 'Not logged in' });
        return;
    }

    try {
        await createReview({
            ...data,
            hotelId,
            userId: user.id,
            userName: user.name,
            userAvatar: `https://i.pravatar.cc/150?u=${user.id}`,
            userCountry: "Unknown" // In a real app, this might come from user profile
        });
        toast({
            title: "Review Submitted",
            description: "Thank you for your feedback!",
        });
        form.reset();
        onReviewAdded();
    } catch (error) {
        toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "There was a problem with your request.",
        });
    }
  };

  return (
    <div>
        <h3 className="text-2xl font-semibold mb-4">Leave a Review</h3>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Your Rating</FormLabel>
                <FormControl>
                    <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                className={cn(
                                    "h-8 w-8 cursor-pointer",
                                    (hoverRating || field.value) >= star
                                    ? "text-primary fill-primary"
                                    : "text-muted-foreground/50"
                                )}
                                onClick={() => field.onChange(star)}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                            />
                        ))}
                    </div>
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="comment"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Your Comment</FormLabel>
                <FormControl>
                    <Textarea
                    placeholder="Tell us about your stay..."
                    className="resize-none h-32"
                    {...field}
                    />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit Review
            </Button>
        </form>
        </Form>
    </div>
  );
}
