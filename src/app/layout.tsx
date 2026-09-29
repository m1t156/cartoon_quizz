import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CARTOON SUPER CUP 256 — The Ultimate Childhood Cartoon Tournament",
  description:
    "256 cartoons, 255 knockout battles, 1 champion! Vote between iconic Cartoon Network, Disney, Nickelodeon, Anime, BiBi, Classic, and Superhero cartoons to discover your true childhood champion.",
  keywords: [
    "Cartoon Super Cup",
    "Cartoon Tournament",
    "Anime Knockout",
    "Childhood Cartoons",
    "Would You Rather Cartoon",
    "Gravity Falls",
    "Adventure Time",
    "BiBi TV",
    "Doraemon",
    "Robo Trái Cây",
  ],
  authors: [{ name: "Cartoon Super Cup Team" }],
  openGraph: {
    title: "CARTOON SUPER CUP 256",
    description: "256 cartoons. 255 battles. 1 champion.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased selection:bg-amber-300 selection:text-slate-900">
        {children}
      </body>
    </html>
  );
}
