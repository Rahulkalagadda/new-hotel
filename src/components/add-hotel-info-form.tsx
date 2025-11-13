
"use client";

import { useFormContext } from "react-hook-form";
import { z } from "zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";

const imageRegex = /\.(jpg|jpeg|png|webp)$/i;

export const addHotelInfoSchema = z.object({
  name: z.string().min(2, { message: "Hotel name must be at least 2 characters." }),
  location: z.string().min(2, { message: "Location must be at least 2 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  address: z.string().min(10, { message: "Full address must be at least 10 characters." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  website: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
  coverImage: z.string()
    .url({ message: "Please enter a valid URL." })
    .refine(val => imageRegex.test(val), { message: "URL must end in .jpg, .jpeg, .png, or .webp" })
    .optional()
    .or(z.literal('')),
});

export function AddHotelInfoForm() {
    const form = useFormContext();
    const coverImage = form.watch("coverImage");

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-6">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Hotel Name *</FormLabel>
                        <FormControl>
                            <Input {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                    <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Location (City, State) *</FormLabel>
                        <FormControl>
                            <Input {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
                <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Hotel Description *</FormLabel>
                    <FormControl>
                        <Textarea className="resize-none h-24" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
             <FormField
                control={form.control}
                name="coverImage"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Hotel Image URL</FormLabel>
                        <FormControl>
                            <Input placeholder="https://example.com/hotel.jpg" {...field} />
                        </FormControl>
                         <FormDescription>
                            Paste an image link. The preview will update below.
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
            {coverImage && form.getFieldState("coverImage").invalid === false && (
                 <div className="rounded-xl border bg-card text-card-foreground shadow w-full aspect-video relative overflow-hidden">
                    <Image src={coverImage} alt="Hotel Preview" layout="fill" objectFit="cover" />
                 </div>
            )}
                <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Full Address *</FormLabel>
                    <FormControl>
                        <Textarea className="resize-none h-24" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Phone Number *</FormLabel>
                        <FormControl>
                            <Input type="tel" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                    <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Email Address *</FormLabel>
                        <FormControl>
                            <Input type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                    <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Website</FormLabel>
                        <FormControl>
                            <Input {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </div>
    )
}
