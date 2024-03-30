"use client"

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import "./globals.css";
import ParticleBackground from 'react-particle-backgrounds'

const inter = Inter({ subsets: ["latin"] });
const settings = {
  canvas: {
    canvasFillSpace: true,
    width: "100%",
    height: "100vh",
    useBouncyWalls: true
  },
  particle: {
    particleCount: 6,
    color: '#0f74ff',
    minSize: 2,
    maxSize: 5
  },
  velocity: {
    directionAngle: 0,
    directionAngleVariance: 360,
    minSpeed: 1,
    maxSpeed: 3
  },
  opacity: {
    minOpacity: 0,
    maxOpacity: 0.5,
    opacityTransitionTime: 3000
  }
}



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={GeistMono.className}>
        {children}
        <ParticleBackground className=" fixed top-0 -z-50" settings={settings} />
        </body>
    </html>
  );
}
