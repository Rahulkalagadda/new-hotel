import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ArrowLeftRight, Calendar as CalendarIcon, Bus, Search } from "lucide-react";
import { format, addDays } from "date-fns";

export const SearchBar = () => {
  const [fromCity, setFromCity] = useState("Borivali East");
  const [toCity, setToCity] = useState("Pune");
  const [date, setDate] = useState<Date>(new Date("2025-11-12"));

  const swapCities = () => {
    const temp = fromCity;
    setFromCity(toCity);
    setToCity(temp);
  };

  const setToday = () => {
    setDate(new Date());
  };

  const setTomorrow = () => {
    setDate(addDays(new Date(), 1));
  };

  return (
    <div className="bg-card shadow-lg rounded-2xl p-4 mb-8">
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* From Section */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Bus className="h-6 w-6 text-muted-foreground flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <label className="text-xs text-muted-foreground">From</label>
            <input
              value={fromCity}
              onChange={(e) => setFromCity(e.target.value)}
              className="w-full text-lg font-semibold bg-transparent border-none outline-none p-0"
              placeholder="Boarding point"
            />
          </div>
        </div>

        {/* Swap Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={swapCities}
          className="rounded-full bg-muted hover:bg-muted/80 h-10 w-10 flex-shrink-0"
        >
          <ArrowLeftRight className="h-5 w-5" />
        </Button>

        {/* To Section */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Bus className="h-6 w-6 text-muted-foreground flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <label className="text-xs text-muted-foreground">To</label>
            <input
              value={toCity}
              onChange={(e) => setToCity(e.target.value)}
              className="w-full text-lg font-semibold bg-transparent border-none outline-none p-0"
              placeholder="Destination"
            />
          </div>
        </div>

        {/* Date Section */}
        <div className="flex items-center gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <button className="flex items-center gap-3 text-left">
                <CalendarIcon className="h-6 w-6 text-muted-foreground flex-shrink-0" />
                <div>
                  <label className="text-xs text-muted-foreground block">Date of journey</label>
                  <div className="text-lg font-semibold">
                    {format(date, "dd MMM, yyyy")}
                  </div>
                </div>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-card" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => newDate && setDate(newDate)}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          {/* Today/Tomorrow Buttons */}
          <div className="flex gap-2">
            <Button
              variant="ghost"
              onClick={setToday}
              className="rounded-full bg-accent/10 hover:bg-accent/20 text-accent-foreground px-4"
            >
              Today
            </Button>
            <Button
              variant="ghost"
              onClick={setTomorrow}
              className="rounded-full bg-accent/10 hover:bg-accent/20 text-accent-foreground px-4"
            >
              Tomorrow
            </Button>
          </div>
        </div>

        {/* Search Button */}
        <Button
          size="icon"
          className="rounded-full h-12 w-12 bg-destructive hover:bg-destructive/90 text-destructive-foreground flex-shrink-0"
        >
          <Search className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}
