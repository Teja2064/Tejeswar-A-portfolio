"use client";
import React, { Suspense, lazy, useState } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { ErrorBoundary } from "react-error-boundary";

// Lazy load the World component with better error handling
const World = dynamic(
  () =>
     import("./Globe")
      .then((m) => m.World)
      .catch((err) => {
        console.error("Error loading Globe:",err);
        return () => <div className="flex items-center justify-center h-96 text-gray-500">Globe visualization unavailable</div>;
      }),
 {
  ssr: false,
  loading: () => ( 
  <div className="flex items-center justify-center h-96"> 
  <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
  </div>) 
});

// Simple fallback component for when WebGL fails
const GlobeFallback = () => {
  return (
    <div className="flex items-center justify-center h-full w-full bg-gradient-to-br from-blue-900 to-purple-900 rounded-lg">
      <div className="text-center text-white">
        <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center">
          <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
        <h3 className="text-lg font-semibold mb-2">Global Connections</h3>
        <p className="text-sm opacity-80">Interactive globe visualization</p>
      </div>
    </div>
  );
};

// Simplified and validated globe data to prevent coordinate issues
const globeData = [
  {
    order: 1,
    startLat: 40.7128,
    startLng: -74.0060,
    endLat: 51.5074,
    endLng: -0.1278,
    arcAlt: 0.1,
    color: "#06b6d4",
  },
  {
    order: 2,
    startLat: 35.6762,
    startLng: 139.6503,
    endLat: 22.3193,
    endLng: 114.1694,
    arcAlt: 0.2,
    color: "#3b82f6",
  },
  {
    order: 3,
    startLat: 48.8566,
    startLng: 2.3522,
    endLat: 40.7128,
    endLng: -74.0060,
    arcAlt: 0.3,
    color: "#6366f1",
  },
  {
    order: 4,
    startLat: 22.3193,
    startLng: 114.1694,
    endLat: 35.6762,
    endLng: 139.6503,
    arcAlt: 0.2,
    color: "#06b6d4",
  },
  {
    order: 5,
    startLat: 51.5074,
    startLng: -0.1278,
    endLat: 48.8566,
    endLng: 2.3522,
    arcAlt: 0.1,
    color: "#3b82f6",
  },
  {
    order: 6,
    startLat: 34.0522,
    startLng: -118.2437,
    endLat: 40.7128,
    endLng: -74.0060,
    arcAlt: 0.2,
    color: "#6366f1",
  },
  {
    order: 7,
    startLat: 37.7749,
    startLng: -122.4194,
    endLat: 34.0522,
    endLng: -118.2437,
    arcAlt: 0.1,
    color: "#06b6d4",
  },
  {
    order: 8,
    startLat: 52.5200,
    startLng: 13.4050,
    endLat: 48.8566,
    endLng: 2.3522,
    arcAlt: 0.2,
    color: "#3b82f6",
  },
];

export function GlobeDemo() {
  const [webglSupported, setWebglSupported] = useState(true);
  const globeConfig = {
    pointSize: 4,
    globeColor: "#062056",
    showAtmosphere: true,
    atmosphereColor: "#FFFFFF",
    atmosphereAltitude: 0.1,
    emissive: "#062056",
    emissiveIntensity: 0.1,
    shininess: 0.9,
    polygonColor: "rgba(255,255,255,0.7)",
    ambientLight: "#38bdf8",
    directionalLeftLight: "#ffffff",
    directionalTopLight: "#ffffff",
    pointLight: "#ffffff",
    arcTime: 1000,
    arcLength: 0.9,
    rings: 1,
    maxRings: 3,
    initialPosition: { lat: 22.3193, lng: 114.1694 },
    autoRotate: true,
    autoRotateSpeed: 0.5,
  };

  // Check WebGL support
  React.useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setWebglSupported(false);
      }
    } catch (error) {
      console.warn('WebGL not supported:', error);
      setWebglSupported(false);
    }
  }, []);

  return (
    <div className="flex items-center justify-center absolute -left-5 top-36 md:top-40 w-full h-full">
      <div className="max-w-7xl mx-auto w-full relative overflow-hidden px-4 h-96">
        
        <div className="absolute w-full bottom-0 inset-x-0 h-40 bg-gradient-to-b pointer-events-none select-none from-transparent dark:to-black to-white z-40" />
        <div className="absolute w-full h-72 md:h-full z-10">
        <ErrorBoundary 
          fallback={<GlobeFallback />}
        >
          <Suspense fallback={
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          }>
           {webglSupported ? (
             <World data={globeData} globeConfig={globeConfig} />
           ) : (
             <GlobeFallback />
           )}
          </Suspense>
        </ErrorBoundary>

        </div>
      </div>
    </div>
  );
}
