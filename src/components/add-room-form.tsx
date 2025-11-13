
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { createRoom } from "@/lib/data";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "./ui/card";
import { Loader2, PlusCircle, Trash2 } from "lucide-react";
import type { Hotel } from "@/lib/types";
import Image from "next/image";

const imageRegex = /\.(jpg|jpeg|png|webp)$/i;

const addRoomFormSchema = z.object({
  hotelId: z.string({ required_error: "Please select a hotel." }),
  title: z.string().min(2, {
    message: "Room title must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  price: z.coerce.number().positive({ message: "Price must be a positive number." }),
  capacity: z.coerce.number().int().positive({ message: "Capacity must be a positive integer." }),
  images: z.array(
      z.object({
          url: z.string()
            .url({ message: "Please enter a valid URL." })
            .refine(val => imageRegex.test(val), { message: "URL must end in .jpg, .jpeg, .png, or .webp" })
      })
  ).min(2, "Please add at least 2 images.").max(4, "You can add a maximum of 4 images."),
});

type AddRoomFormValues = z.infer<typeof addRoomFormSchema>;

interface AddRoomFormProps {
    ownerHotels: Hotel[];
    selectedHotelId?: string;
    onRoomAdded?: () => void;
}

export function AddRoomForm({ ownerHotels, selectedHotelId, onRoomAdded }: AddRoomFormProps) {
  const { toast } = useToast();
  const form = useForm<AddRoomFormValues>({
    resolver: zodResolver(addRoomFormSchema),
    defaultValues: {
        hotelId: selectedHotelId || '',
        title: '',
        description: '',
        price: 0,
        capacity: 2,
        images: [{ url: "" }, { url: "" }],
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "images"
  });

  const watchedImages = form.watch("images");

  const onSubmit = async (data: AddRoomFormValues) => {
    try {
        const imageUrls = data.images.map(img => img.url);
        await createRoom({ ...data, images: imageUrls });
        toast({
            title: "Room Submitted",
            description: "Your new room has been submitted for approval.",
        });
        form.reset();
        if (onRoomAdded) {
            onRoomAdded();
        }
    } catch (error) {
        toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "There was a problem with your request.",
        });
    }
  };

  const hasApprovedHotels = ownerHotels.some(h => h.status === 'approved');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add a New Room</CardTitle>
        <CardDescription>Fill out the form below to add a new room to one of your approved hotels.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="hotelId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hotel</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!!selectedHotelId}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a hotel to add the room to" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ownerHotels.filter(h => h.status === 'approved').map(hotel => (
                        <SelectItem key={hotel.id} value={hotel.id}>
                          {hotel.name}
                        </SelectItem>
                      ))}
                       {!hasApprovedHotels && <p className="p-4 text-sm text-muted-foreground">You have no approved hotels.</p>}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Room Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Deluxe Queen Room" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us a little bit about the room"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
                 <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price per night (INR)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g. 250" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="capacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Capacity (guests)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g. 2" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>
            
            <div>
                 <FormLabel>Room Images</FormLabel>
                 <FormDescription className="mb-2">
                    Enter at least 2 image URLs, up to a maximum of 4.
                 </FormDescription>
                {fields.map((field, index) => (
                    <div key={field.id} className="flex items-start gap-2 mb-2">
                        <div className="flex-grow">
                             <FormField
                                control={form.control}
                                name={`images.${index}.url`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input {...field} placeholder="https://example.com/room.jpg" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                                />
                             {watchedImages?.[index]?.url && !form.formState.errors.images?.[index] && (
                                <div className="mt-2 rounded-lg border bg-card text-card-foreground shadow-sm w-full aspect-video relative overflow-hidden">
                                    <Image 
                                        src={watchedImages[index].url} 
                                        alt={`Room image ${index + 1} preview`} 
                                        layout="fill" 
                                        objectFit="cover" 
                                        className="bg-muted"
                                    />
                                </div>
                             )}
                        </div>
                         <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            onClick={() => remove(index)}
                            disabled={fields.length <= 2}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
                 {form.formState.errors.images && form.formState.errors.images.root && (
                    <p className="text-sm font-medium text-destructive">{form.formState.errors.images.root.message}</p>
                 )}
                 <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => append({ url: "" })}
                    disabled={fields.length >= 4}
                >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add another image
                </Button>
            </div>

          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={form.formState.isSubmitting || !hasApprovedHotels}>
              {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Room for Approval
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
