
"use client";

import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { createHotel } from "@/lib/data";
import { Card, CardContent } from "./ui/card";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { AddHotelInfoForm, addHotelInfoSchema } from "./add-hotel-info-form";
import { AddHotelFacilitiesForm, addHotelFacilitiesSchema } from "./add-hotel-facilities-form";
import { AddHotelRoomsForm, addHotelRoomsSchema } from "./add-hotel-rooms-form";
import { AddHotelDocumentsForm, addHotelDocumentsSchema } from "./add-hotel-documents-form";


const addHotelFormSchema = addHotelInfoSchema
  .merge(addHotelFacilitiesSchema)
  .merge(addHotelRoomsSchema)
  .merge(addHotelDocumentsSchema);

type AddHotelFormValues = z.infer<typeof addHotelFormSchema>;

const defaultValues: Partial<AddHotelFormValues> = {
  name: "",
  location: "",
  description: "",
  address: "",
  phone: "",
  email: "",
  website: "",
  coverImage: "",
  facilities: [],
  checkInTime: "15:00",
  checkOutTime: "11:00",
  cancellationPolicy: "",
  isPetFriendly: false,
  documents: [],
};


const steps = [
  { id: '1', name: 'Info', component: AddHotelInfoForm, schema: addHotelInfoSchema },
  { id: '2', name: 'Facilities', component: AddHotelFacilitiesForm, schema: addHotelFacilitiesSchema },
  { id: '3', name: 'Rooms', component: AddHotelRoomsForm, schema: addHotelRoomsSchema },
  { id: '4', name: 'Documents', component: AddHotelDocumentsForm, schema: addHotelDocumentsSchema },
];

export function AddHotelForm({ onFinished }: { onFinished: () => void }) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods = useForm<AddHotelFormValues>({
    resolver: zodResolver(addHotelFormSchema),
    defaultValues,
    mode: "onChange",
  });


  const onSubmit = async (data: AddHotelFormValues) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "You must be logged in to create a hotel.",
      });
      return;
    }
    setIsSubmitting(true);
    try {
      // In a real app, you would handle file uploads here to a service like Firebase Storage
      // and get back URLs to store in Firestore. For this demo, we'll just use the file names.
      const documentsForDb = (data.documents || []).map(doc => ({
          name: doc.name,
          url: `placeholder/path/for/${doc.name}` // Placeholder URL
      }));

      await createHotel({
        name: data.name,
        location: data.location,
        description: data.description,
        address: data.address,
        phone: data.phone,
        email: data.email,
        website: data.website || '',
        coverImage: data.coverImage,
        facilities: data.facilities,
        checkInTime: data.checkInTime,
        checkOutTime: data.checkOutTime,
        cancellationPolicy: data.cancellationPolicy,
        isPetFriendly: data.isPetFriendly,
        documents: documentsForDb,
        ownerId: user.id,
        ownerName: user.name,
        ownerEmail: user.email,
      });
      toast({
        title: "Hotel Submitted",
        description: "Your new hotel has been submitted for approval.",
      });
      methods.reset();
      onFinished();
    } catch (error) {
        console.error(error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    } finally {
        setIsSubmitting(false);
    }
  };

  const nextStep = async () => {
    const currentStepSchema = steps[currentStep - 1].schema;
    if (currentStepSchema) {
        const output = await methods.trigger(Object.keys(currentStepSchema.shape) as any, { shouldFocus: true });
        if (output) {
            setCurrentStep(prev => Math.min(prev + 1, steps.length));
        }
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };


  const ActiveStepComponent = steps[currentStep - 1].component;

  return (
    <div>
        <h1 className="text-3xl font-bold">Add a New Hotel</h1>
        <p className="text-muted-foreground">Complete the steps below to list your property.</p>

        <Card className="mt-8">
            <CardContent className="p-6">
                 {/* Steps Indicator */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        {steps.map((step, index) => (
                        <React.Fragment key={step.id}>
                            <div className="flex flex-col items-center">
                                <div className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center border-2",
                                    currentStep >= parseInt(step.id) ? "bg-primary text-primary-foreground border-primary" : "bg-secondary border-secondary-foreground/20"
                                )}>
                                    {step.id}
                                </div>
                                <p className={cn("mt-2 text-sm", currentStep >= parseInt(step.id) ? 'font-semibold' : 'text-muted-foreground')}>{step.name}</p>
                            </div>
                            {index < steps.length - 1 && (
                                <div className={cn(
                                    "flex-1 h-0.5 mx-4",
                                    currentStep > index + 1 ? 'bg-primary' : 'bg-secondary-foreground/20'
                                )} />
                            )}
                        </React.Fragment>
                        ))}
                    </div>
                </div>

                <FormProvider {...methods}>
                    <form onSubmit={methods.handleSubmit(onSubmit)}>
                        <div style={{ display: currentStep === 1 ? 'block' : 'none' }}>
                            <AddHotelInfoForm />
                        </div>
                         <div style={{ display: currentStep === 2 ? 'block' : 'none' }}>
                            <AddHotelFacilitiesForm />
                        </div>
                         <div style={{ display: currentStep === 3 ? 'block' : 'none' }}>
                            <AddHotelRoomsForm />
                        </div>
                         <div style={{ display: currentStep === 4 ? 'block' : 'none' }}>
                            <AddHotelDocumentsForm />
                        </div>

                        <div className="flex justify-between pt-8">
                            {currentStep > 1 ? (
                                <Button type="button" variant="outline" onClick={prevStep}>
                                    Back
                                </Button>
                            ) : <div></div>}

                            {currentStep < steps.length ? (
                                <Button type="button" onClick={nextStep}>
                                    Next
                                </Button>
                            ) : (
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Submit for Approval
                                </Button>
                            )}
                        </div>
                    </form>
                </FormProvider>
            </CardContent>
        </Card>
    </div>
  );
}
