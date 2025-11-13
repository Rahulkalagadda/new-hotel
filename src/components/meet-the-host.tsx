
"use client"

import type { Hotel } from "@/lib/types"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Button } from "./ui/button"
import { Card } from "./ui/card"
import { Star } from "lucide-react"

interface MeetTheHostProps {
    hotel: Hotel
}

export function MeetTheHost({ hotel }: MeetTheHostProps) {
    return (
        <div>
            <h2 className="text-2xl font-semibold mb-4">Meet your host</h2>
            <Card className="p-6">
                <div className="flex flex-col sm:flex-row items-start gap-6">
                    <div className="flex flex-col items-center">
                         <Avatar className="h-24 w-24">
                            <AvatarImage src={`https://i.pravatar.cc/150?u=${hotel.ownerId}`} alt={hotel.ownerName} />
                            <AvatarFallback>{hotel.ownerName?.charAt(0).toUpperCase()}</AvatarFallback>
                         </Avatar>
                         <h3 className="mt-4 font-bold text-lg">{hotel.ownerName}</h3>
                         <p className="text-sm text-muted-foreground">Superhost</p>
                    </div>

                    <div className="flex-grow grid grid-cols-2 gap-y-4 gap-x-8">
                         <div className="flex items-center gap-2">
                             <Star className="w-5 h-5"/>
                             <div>
                                <p className="font-bold">245 Reviews</p>
                            </div>
                         </div>
                         <div className="flex items-center gap-2">
                             <Star className="w-5 h-5"/>
                             <div>
                                <p className="font-bold">4.8 Rating</p>
                            </div>
                         </div>
                         <div className="flex items-center gap-2">
                            <Star className="w-5 h-5"/>
                             <div>
                                <p className="font-bold">5 years hosting</p>
                            </div>
                         </div>
                    </div>

                     <div className="w-full sm:w-auto">
                        <Button variant="outline">Message host</Button>
                    </div>

                </div>
                 <div className="mt-6 pt-6 border-t">
                    <p className="text-sm text-muted-foreground">
                        Response rate: 100% <br/>
                        Responds within an hour
                    </p>
                </div>
            </Card>
        </div>
    )
}
