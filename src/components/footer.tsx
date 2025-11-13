"use client";

import React from 'react';
import Link from 'next/link';
import { Building2 } from 'lucide-react';

const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start md:items-center">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center space-x-2">
              <Building2 className="h-8 w-8 text-primary" />
              <span className="font-bold font-headline text-2xl">Lodgify Lite</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">Your next unforgettable stay is just a few clicks away.</p>
          </div>

          <div>
            <h3 className="font-headline text-lg font-semibold">Quick Links</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/" className="text-sm hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="/search" className="text-sm hover:text-primary transition-colors">Featured Hotels</Link></li>
              <li><Link href="/admin" className="text-sm hover:text-primary transition-colors">Admin Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-headline text-lg font-semibold">Support</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="#" className="text-sm hover:text-primary transition-colors">Contact Us</Link></li>
              <li><Link href="#" className="text-sm hover:text-primary transition-colors">FAQ</Link></li>
              <li><Link href="#" className="text-sm hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          <div className="flex flex-col">
            <h3 className="font-headline text-lg font-semibold">Connect</h3>
            <div className="flex mt-4 justify-center md:justify-start space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <TwitterIcon className="h-6 w-6" />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Lodgify Lite. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
