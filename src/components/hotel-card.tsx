

import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Hotel } from '@/lib/types';
import { MapPin, Star } from 'lucide-react';
import { cn, formatINR } from '@/lib/utils';

interface HotelCardProps {
  hotel: Hotel;
  price?: number;
  variant?: 'default' | 'compact';
}

export function HotelCard({ hotel, price, variant = 'default' }: HotelCardProps) {

  if (variant === 'compact') {
    return (
      <div className="group cursor-pointer">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl">
           <Image
              src={hotel.coverImage}
              alt={`Exterior of ${hotel.name}`}
              layout="fill"
              objectFit="cover"
              data-ai-hint={(hotel as any)['data-ai-hint'] || 'hotel exterior'}
              className="group-hover:scale-105 transition-transform duration-300"
            />
             {hotel.category && (
              <Badge className="absolute top-2 right-2" variant="secondary">{hotel.category}</Badge>
            )}
        </div>
        <div className="mt-2">
          <div className="flex justify-between items-start">
             <h3 className="font-bold text-sm truncate pr-2">{hotel.name}</h3>
             <div className="flex items-center gap-1 shrink-0">
                <Star className="w-4 h-4" />
                <span className="text-sm">4.8</span>
             </div>
          </div>
          <p className="text-sm text-muted-foreground">{hotel.location}</p>
          {price && (
            <p className="text-sm mt-1"><span className="font-bold">{formatINR(price)}</span> / night</p>
          )}
        </div>
      </div>
    )
  }

  return (
    <Card className="overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="relative h-56 w-full">
        <Image
          src={hotel.coverImage}
          alt={`Exterior of ${hotel.name}`}
          layout="fill"
          objectFit="cover"
          data-ai-hint={(hotel as any)['data-ai-hint'] || 'hotel exterior'}
        />
         {hotel.category && (
          <Badge className="absolute top-2 right-2" variant="secondary">{hotel.category}</Badge>
        )}
      </div>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">{hotel.name}</CardTitle>
        <CardDescription className="flex items-center pt-1">
          <MapPin className="h-4 w-4 mr-1.5" />
          {hotel.location}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-3">{hotel.description}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
      <div className="flex items-center gap-1">
      {price ? (
        <p className="text-lg"><span className="font-bold">{formatINR(price)}</span> / night</p>
      ) : (
                <>
                 <Star className="w-5 h-5 text-accent fill-accent" />
                 <span className="font-bold">4.8</span>
                 <span className="text-sm text-muted-foreground">(245 reviews)</span>
                </>
            )}
        </div>
        <Badge variant={hotel.status === 'approved' ? 'default' : 'secondary'} className={hotel.status === 'approved' ? 'bg-green-600/20 text-green-600 border-green-600/20' : ''}>
          {hotel.status}
        </Badge>
      </CardFooter>
    </Card>
  );
}
