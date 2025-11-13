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
import { Checkbox } from "./ui/checkbox";
import { Wifi, ParkingSquare, UtensilsCrossed, Dumbbell, Waves, Sparkles, Clock } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { cn } from "@/lib/utils";

export const addHotelFacilitiesSchema = z.object({
  facilities: z.array(z.string()).refine(value => value.some(item => item), {
    message: "You have to select at least one facility.",
  }),
  checkInTime: z.string().min(1, { message: "Check-in time is required." }),
  checkOutTime: z.string().min(1, { message: "Check-out time is required." }),
  cancellationPolicy: z.string().min(10, { message: "Cancellation policy must be at least 10 characters." }),
  isPetFriendly: z.boolean().default(false),
});

const facilityOptions = [
    { id: "wifi", label: "Free WiFi", icon: Wifi },
    { id: "parking", label: "Parking", icon: ParkingSquare },
    { id: "restaurant", label: "Restaurant", icon: UtensilsCrossed },
    { id: "gym", label: "Gym", icon: Dumbbell },
    { id: "pool", label: "Swimming Pool", icon: Waves },
    { id: "spa", label: "Spa", icon: Sparkles },
]

export function AddHotelFacilitiesForm() {
    const form = useFormContext();

    return (
        <div className="space-y-8">
            <h2 className="text-xl font-semibold">Facilities & Policies</h2>
            
            <FormField
                control={form.control}
                name="facilities"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Facilities</FormLabel>
                        <FormControl>
                             <ToggleGroup
                                type="multiple"
                                variant="outline"
                                className="grid grid-cols-2 md:grid-cols-3 gap-4"
                                value={field.value}
                                onValueChange={field.onChange}
                            >
                                {facilityOptions.map(facility => (
                                    <ToggleGroupItem 
                                        key={facility.id} 
                                        value={facility.id} 
                                        className="h-12 justify-start px-4"
                                        aria-label={`Toggle ${facility.label}`}
                                    >
                                        <facility.icon className="mr-2 h-5 w-5" />
                                        {facility.label}
                                    </ToggleGroupItem>
                                ))}
                            </ToggleGroup>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <div className="grid grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="checkInTime"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Check-in time</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input {...field} className="pl-10" />
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="checkOutTime"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Check-out time</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input {...field} className="pl-10" />
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
             <FormField
                control={form.control}
                name="cancellationPolicy"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Cancellation Policy</FormLabel>
                        <FormControl>
                            <Textarea className="resize-none h-24" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

             <FormField
                control={form.control}
                name="isPetFriendly"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                        <FormControl>
                            <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                            <FormLabel>
                            Pet-friendly
                            </FormLabel>
                            <FormDescription>
                            Allow guests to bring their pets.
                            </FormDescription>
                        </div>
                    </FormItem>
                )}
            />

        </div>
    )
}

