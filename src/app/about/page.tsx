
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Lightbulb, Rocket, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-secondary/50">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <div className="relative h-64 w-full">
            <Image 
                src="https://picsum.photos/1600/600"
                alt="Abstract background image for about page"
                fill
                className="opacity-20 object-cover"
                data-ai-hint="abstract texture"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <h1 className="text-5xl font-headline font-bold text-primary">About Lodgify Lite</h1>
                <p className="mt-4 text-xl text-muted-foreground max-w-2xl">
                    Crafting the future of hospitality with simplicity and elegance.
                </p>
            </div>
        </div>

        <div className="container mx-auto px-4 py-16">
            {/* Introduction Section */}
            <Card className="mb-12 shadow-lg">
                <CardContent className="p-8 text-center">
                     <p className="text-lg text-muted-foreground leading-relaxed">
                        Lodgify Lite was born from a simple idea: to make hotel booking and management accessible to everyone. We believe that technology should empower property owners and delight guests. Our platform provides a streamlined, modern, and intuitive experience for browsing, booking, and managing hotel stays, ensuring that every journey starts and ends perfectly.
                    </p>
                </CardContent>
            </Card>

            {/* Mission & Vision */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
                <Card>
                    <CardHeader className="flex flex-row items-center gap-4">
                        <Rocket className="w-8 h-8 text-primary"/>
                        <CardTitle className="font-headline text-3xl">Our Mission</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">
                            To empower hotel owners with powerful, easy-to-use tools that streamline their operations, and to provide guests with a seamless and enjoyable booking experience from discovery to check-out.
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center gap-4">
                        <Lightbulb className="w-8 h-8 text-accent"/>
                        <CardTitle className="font-headline text-3xl">Our Vision</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">
                            To become the leading platform for independent and boutique hotels, celebrated for our commitment to quality, innovation, and building a community of passionate hosts and happy travelers.
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Team Section */}
             <div className="text-center mb-12">
                <h2 className="text-4xl font-headline font-bold">Meet the Team</h2>
                <p className="mt-2 text-muted-foreground">The passionate individuals behind Lodgify Lite.</p>
            </div>
            <div className="flex justify-center gap-8 flex-wrap">
                 <div className="flex flex-col items-center text-center">
                    <Avatar className="w-24 h-24 mb-2 border-4 border-primary/50">
                        <AvatarImage src="https://i.pravatar.cc/150?u=team1" alt="Team Member 1" />
                        <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <h3 className="font-semibold">Jane Doe</h3>
                    <p className="text-sm text-muted-foreground">Lead Developer</p>
                </div>
                 <div className="flex flex-col items-center text-center">
                     <Avatar className="w-24 h-24 mb-2 border-4 border-primary/50">
                        <AvatarImage src="https://i.pravatar.cc/150?u=team2" alt="Team Member 2" />
                        <AvatarFallback>JS</AvatarFallback>
                    </Avatar>
                    <h3 className="font-semibold">John Smith</h3>
                    <p className="text-sm text-muted-foreground">UI/UX Designer</p>
                </div>
                 <div className="flex flex-col items-center text-center">
                     <Avatar className="w-24 h-24 mb-2 border-4 border-primary/50">
                        <AvatarImage src="https://i.pravatar.cc/150?u=team3" alt="Team Member 3" />
                        <AvatarFallback>AB</AvatarFallback>
                    </Avatar>
                    <h3 className="font-semibold">Alex Brown</h3>
                    <p className="text-sm text-muted-foreground">Project Manager</p>
                </div>
            </div>

            {/* Back to Home */}
            <div className="text-center mt-16">
                 <Link href="/">
                    <Button variant="outline">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Home
                    </Button>
                </Link>
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
