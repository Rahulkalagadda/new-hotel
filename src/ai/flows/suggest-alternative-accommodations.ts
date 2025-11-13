'use server';

/**
 * @fileOverview An AI agent that suggests alternative accommodations.
 *
 * - suggestAlternativeAccommodations - A function that handles the suggestion process.
 * - SuggestAlternativeAccommodationsInput - The input type for the suggestAlternativeAccommodations function.
 * - SuggestAlternativeAccommodationsOutput - The return type for the suggestAlternativeAccommodations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestAlternativeAccommodationsInputSchema = z.object({
  location: z.string().describe('The location of the desired accommodation.'),
  priceRange: z.string().describe('The desired price range for the accommodation.'),
  amenities: z.string().describe('The desired amenities for the accommodation.'),
  unavailableAccommodation: z.string().describe('The name of the unavailable accommodation.'),
});
export type SuggestAlternativeAccommodationsInput = z.infer<
  typeof SuggestAlternativeAccommodationsInputSchema
>;

const SuggestAlternativeAccommodationsOutputSchema = z.object({
  alternativeAccommodations: z
    .string()
    .describe('A list of alternative accommodations based on the provided criteria.'),
});
export type SuggestAlternativeAccommodationsOutput = z.infer<
  typeof SuggestAlternativeAccommodationsOutputSchema
>;

export async function suggestAlternativeAccommodations(
  input: SuggestAlternativeAccommodationsInput
): Promise<SuggestAlternativeAccommodationsOutput> {
  return suggestAlternativeAccommodationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestAlternativeAccommodationsPrompt',
  input: {schema: SuggestAlternativeAccommodationsInputSchema},
  output: {schema: SuggestAlternativeAccommodationsOutputSchema},
  prompt: `The user's preferred accommodation, {{{unavailableAccommodation}}}, is unavailable. Suggest alternative accommodations in {{{location}}} based on the following criteria:

Price Range: {{{priceRange}}}
Amenities: {{{amenities}}}

Provide a list of alternative accommodations that meet these criteria.`,
});

const suggestAlternativeAccommodationsFlow = ai.defineFlow(
  {
    name: 'suggestAlternativeAccommodationsFlow',
    inputSchema: SuggestAlternativeAccommodationsInputSchema,
    outputSchema: SuggestAlternativeAccommodationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
