
"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Search, UserPlus, Calendar as CalendarIcon, Minus, Plus } from 'lucide-react';
import type { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar } from './ui/calendar';
import { Separator } from './ui/separator';
import { cn } from '@/lib/utils';

export function SearchForm() {
    const router = useRouter();
    const [destination, setDestination] = useState('');
    const [dateRange, setDateRange] = useState<DateRange | undefined>();
    const [guests, setGuests] = useState({
        adults: 1,
        children: 0,
        infants: 0
    });

    const totalGuests = guests.adults + guests.children;
    const guestText = totalGuests > 0 ? `${totalGuests} guest${totalGuests > 1 ? 's' : ''}` : 'Add guests';

    const handleGuestChange = (type: keyof typeof guests, operation: 'increment' | 'decrement') => {
        setGuests(prev => {
            const current_val = prev[type];
            const new_val = operation === 'increment' ? current_val + 1 : Math.max(0, current_val - 1);
            
            // Adults must be at least 1 if other guests are present
            if(type === 'adults' && new_val < 1 && (prev.children > 0 || prev.infants > 0)) {
                return prev;
            }

            return { ...prev, [type]: new_val };
        })
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (destination) {
            params.set('destination', destination);
        }
        if (dateRange?.from) {
            params.set('from', format(dateRange.from, 'yyyy-MM-dd'));
        }
        if (dateRange?.to) {
            params.set('to', format(dateRange.to, 'yyyy-MM-dd'));
        }
        if (totalGuests > 0) {
            params.set('guests', totalGuests.toString());
        }
        router.push(`/search?${params.toString()}`);
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row items-center border rounded-full shadow-lg h-auto md:h-20 p-2 bg-background">
                
                <div className="w-full md:w-auto flex-grow flex items-center p-2 rounded-full hover:bg-secondary/50 transition-colors cursor-pointer">
                     <div className="pl-4 pr-2 w-full">
                        <label htmlFor="destination" className="block text-xs font-bold">Where</label>
                        <input
                            id="destination"
                            type="text"
                            placeholder="Search destinations"
                            className="w-full text-sm outline-none bg-transparent"
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                        />
                     </div>
                </div>
                <Separator orientation="vertical" className="hidden md:block h-10" />

                <Popover>
                    <PopoverTrigger asChild>
                        <div className="flex items-center w-full md:w-auto">
                           <button type="button" className="w-full md:w-auto flex-grow flex items-center p-2 rounded-full hover:bg-secondary/50 transition-colors text-left">
                                <div className="px-4 py-2">
                                    <p className="text-xs font-bold">Check in</p>
                                    <p className="text-sm text-muted-foreground">{dateRange?.from ? format(dateRange.from, "LLL dd") : "Add dates"}</p>
                                </div>
                           </button>
                           <Separator orientation="vertical" className="hidden md:block h-10" />
                           <button type="button" className="w-full md:w-auto flex-grow flex items-center p-2 rounded-full hover:bg-secondary/50 transition-colors text-left">
                               <div className="px-4 py-2">
                                    <p className="text-xs font-bold">Check out</p>
                                    <p className="text-sm text-muted-foreground">{dateRange?.to ? format(dateRange.to, "LLL dd") : "Add dates"}</p>
                                </div>
                           </button>
                        </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 mt-2" align="center">
                        <Calendar
                            initialFocus
                            mode="range"
                            selected={dateRange}
                            onSelect={setDateRange}
                            numberOfMonths={2}
                        />
                    </PopoverContent>
                </Popover>

                <Separator orientation="vertical" className="hidden md:block h-10" />

                <div className="w-full md:w-auto flex items-center rounded-full hover:bg-secondary/50 transition-colors">
                    <Popover>
                        <PopoverTrigger asChild>
                           <button type="button" className="flex items-center text-left w-full pl-6 pr-2 py-2">
                             <div className="flex-grow">
                                 <label htmlFor="guests" className="block text-xs font-bold">Who</label>
                                <p className="text-sm text-muted-foreground">{guestText}</p>
                            </div>
                           </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 mt-2" align="end">
                           <div className="grid gap-4">
                                <div className="space-y-2">
                                    <h4 className="font-medium leading-none">Guests</h4>
                                    <p className="text-sm text-muted-foreground">Select the number of guests.</p>
                                </div>
                                <div className="grid gap-4">
                                    {Object.entries(guests).map(([type, count]) => (
                                        <div key={type} className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium capitalize">{type}</p>
                                                {type === 'infants' && <p className="text-xs text-muted-foreground">Under 2</p>}
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <Button variant="outline" size="icon" className="rounded-full h-8 w-8" onClick={() => handleGuestChange(type as keyof typeof guests, 'decrement')}>
                                                    <Minus className="h-4 w-4" />
                                                </Button>
                                                <span className="w-4 text-center">{count}</span>
                                                <Button variant="outline" size="icon" className="rounded-full h-8 w-8" onClick={() => handleGuestChange(type as keyof typeof guests, 'increment')}>
                                                    <Plus className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                           </div>
                        </PopoverContent>
                    </Popover>
                    <Button type="submit" size="icon" className="rounded-full bg-primary h-14 w-14 shrink-0 ml-auto md:ml-2">
                        <Search className="h-5 w-5" />
                        <span className="sr-only">Search</span>
                    </Button>
                </div>
            </div>
        </form>
    );
}
