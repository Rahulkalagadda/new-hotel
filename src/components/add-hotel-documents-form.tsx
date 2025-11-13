
"use client";

import React, { useState } from 'react';
import { useFormContext, Controller } from "react-hook-form";
import { z } from "zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UploadCloud, File, X } from "lucide-react";
import { Button } from './ui/button';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "application/pdf"];

export const addHotelDocumentsSchema = z.object({
  documents: z.array(z.instanceof(File))
    .refine(files => files.every(file => file.size <= MAX_FILE_SIZE), `Max file size is 5MB.`)
    .refine(
      files => files.every(file => ACCEPTED_IMAGE_TYPES.includes(file.type)),
      "Only .jpg, .jpeg, .png, .webp and .pdf formats are supported."
    ).optional(),
});


export function AddHotelDocumentsForm() {
    const { control, getValues, setValue } = useFormContext();
    const [files, setFiles] = useState<File[]>(getValues("documents") || []);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const fileList = event.target.files;
        if (fileList) {
            const newFiles = Array.from(fileList);
            const currentFiles = getValues("documents") || [];
            const updatedFiles = [...currentFiles, ...newFiles];
            setValue("documents", updatedFiles, { shouldValidate: true });
            setFiles(updatedFiles);
        }
    };

    const removeFile = (index: number) => {
        const currentFiles = getValues("documents") || [];
        const updatedFiles = currentFiles.filter((_:any, i: number) => i !== index);
        setValue("documents", updatedFiles, { shouldValidate: true });
        setFiles(updatedFiles);
    };

    return (
        <div className="space-y-8">
            <h2 className="text-xl font-semibold">Verification Documents</h2>
            <FormDescription>
                Please upload documents for verification purposes. e.g., Business License, Property Ownership Deed. (Optional)
            </FormDescription>
            <FormField
                control={control}
                name="documents"
                render={({ fieldState }) => (
                    <FormItem>
                        <FormLabel>Verification Documents</FormLabel>
                        <FormControl>
                            <div className="relative border-2 border-dashed border-muted-foreground/50 rounded-lg p-8 text-center">
                                <div className="flex flex-col items-center space-y-2">
                                    <UploadCloud className="w-12 h-12 text-muted-foreground" />
                                    <p className="text-muted-foreground">Drag & drop files here, or click to browse.</p>
                                    <p className="text-xs text-muted-foreground">PDF, PNG, JPG up to 5MB</p>
                                </div>
                                <Controller
                                    name="documents"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            type="file"
                                            multiple
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            onChange={handleFileChange}
                                        />
                                    )}
                                />
                            </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {files.length > 0 && (
                <div className="space-y-2">
                    <p className="font-medium">Uploaded Files:</p>
                    <ul className="space-y-2">
                        {files.map((file, index) => (
                            <li key={index} className="flex items-center justify-between p-2 rounded-md border bg-secondary">
                                <div className="flex items-center gap-2">
                                    <File className="w-5 h-5 text-muted-foreground" />
                                    <span className="text-sm">{file.name}</span>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => removeFile(index)}>
                                    <X className="w-4 h-4" />
                                </Button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
