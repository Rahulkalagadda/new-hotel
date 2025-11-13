
"use client";

import { z } from "zod";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

// For this demo, we're not adding rooms in the initial hotel setup flow.
// This schema is a placeholder.
export const addHotelRoomsSchema = z.object({
  roomsPlaceholder: z.any().optional(),
});


export function AddHotelRoomsForm() {
    return (
        <div className="space-y-8">
            <h2 className="text-xl font-semibold">Add Rooms</h2>
            <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Rooms can be added later</AlertTitle>
                <AlertDescription>
                   Once your hotel is approved, you will be able to add and manage individual rooms from your owner dashboard. This ensures that all hotel details are verified before rooms become available for booking.
                </AlertDescription>
            </Alert>
        </div>
    )
}
