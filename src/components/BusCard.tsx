"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Armchair, Wifi, Clock } from "lucide-react";

export interface BusCardProps {
  operator: string;
  busType: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  rating: number;
  reviews: number;
  price: number;
  seatsAvailable: number;
  amenities: string[];
}


export const BusCard = ({
  operator,
  busType,
  departureTime,
  arrivalTime,
  duration,
  rating,
  reviews,
  price,
  seatsAvailable,
  amenities,
}: BusCardProps) => {
  const router = useRouter();
  return (
    <div className="bg-card rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow border border-border">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1 space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-lg">{operator}</h3>
              <p className="text-sm text-muted-foreground">{busType}</p>
            </div>
            <div className="flex items-center gap-1 bg-success px-2 py-1 rounded">
              <Star className="h-3 w-3 fill-success-foreground text-success-foreground" />
              <span className="text-xs font-medium text-success-foreground">
                {rating}
              </span>
              <span className="text-xs text-success-foreground/80">
                ({reviews})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div>
              <p className="text-2xl font-bold">{departureTime}</p>
              <p className="text-xs text-muted-foreground">Borivali East</p>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <Clock className="h-4 w-4 text-muted-foreground mb-1" />
              <p className="text-sm text-muted-foreground">{duration}</p>
              <div className="w-full h-px bg-border mt-1"></div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">{arrivalTime}</p>
              <p className="text-xs text-muted-foreground">Pune</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {amenities.includes("wifi") && (
              <Badge variant="secondary" className="text-xs">
                <Wifi className="h-3 w-3 mr-1" />
                WiFi
              </Badge>
            )}
            {amenities.includes("charging") && (
              <Badge variant="secondary" className="text-xs">
                Charging Point
              </Badge>
            )}
            {amenities.includes("water") && (
              <Badge variant="secondary" className="text-xs">
                Water Bottle
              </Badge>
            )}
          </div>
        </div>

        <div className="flex md:flex-col items-center md:items-end gap-4 md:gap-3">
          <div className="text-right">
            <p className="text-sm text-muted-foreground line-through">
              ₹{Math.round(price * 1.2)}
            </p>
            <p className="text-3xl font-bold">₹{price}</p>
            <p className="text-xs text-muted-foreground mt-1">per seat</p>
          </div>

          <div className="flex flex-col gap-2">
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground" onClick={() => router.push('/bus/booking')}>
              VIEW SEATS
            </Button>
            <p className="text-xs text-center">
              <span className="font-medium text-success">{seatsAvailable}</span>{" "}
              <span className="text-muted-foreground">seats left</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
