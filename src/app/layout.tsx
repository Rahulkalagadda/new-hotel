
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/hooks/use-auth.tsx';
import { Inter, Playfair_Display, PT_Sans } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: '700',
  display: 'swap',
  variable: '--font-playfair-display',
});

const ptSans = PT_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-pt-sans',
});

export const metadata: Metadata = {
  title: 'Lodgify Lite',
  description: 'A modern hotel reservation system.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfairDisplay.variable} ${ptSans.variable}`} suppressHydrationWarning>
      <head>
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <AuthProvider>
                {children}
                <Toaster />
            </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
