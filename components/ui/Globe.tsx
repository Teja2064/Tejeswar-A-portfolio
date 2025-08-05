"use client";
import { useEffect, useRef, useState } from "react";
import { Color, Scene, Fog, PerspectiveCamera, Vector3 } from "three";
import ThreeGlobe from "three-globe";
import { useThree, Object3DNode, Canvas, extend } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

// Import countries data directly to avoid lazy loading issues
import countries from "@/data/globe.json";

declare module "@react-three/fiber" {
  interface ThreeElements {
    threeGlobe: Object3DNode<ThreeGlobe, typeof ThreeGlobe>;
  }
}

extend({ ThreeGlobe });

const RING_PROPAGATION_SPEED = 3;
const aspect = 1.2;
const cameraZ = 300;

type Position = {
  order: number;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  arcAlt: number;
  color: string;
};

export type GlobeConfig = {
  pointSize?: number;
  globeColor?: string;
  showAtmosphere?: boolean;
  atmosphereColor?: string;
  atmosphereAltitude?: number;
  emissive?: string;
  emissiveIntensity?: number;
  shininess?: number;
  polygonColor?: string;
  ambientLight?: string;
  directionalLeftLight?: string;
  directionalTopLight?: string;
  pointLight?: string;
  arcTime?: number;
  arcLength?: number;
  rings?: number;
  maxRings?: number;
  initialPosition?: {
    lat: number;
    lng: number;
  };
  autoRotate?: boolean;
  autoRotateSpeed?: number;
};

interface WorldProps {
  globeConfig: GlobeConfig;
  data: Position[];
}

let numbersOfRings = [0];

// Validate and sanitize position data with strict checks
const validatePosition = (pos: Position): Position | null => {
  const { startLat, startLng, endLat, endLng, arcAlt, order } = pos;
  
  // Check for NaN, undefined, or null values
  if (isNaN(startLat) || isNaN(startLng) || isNaN(endLat) || isNaN(endLng) || isNaN(arcAlt) || isNaN(order)) {
    console.warn('Invalid position data detected (NaN values):', pos);
    return null;
  }
  
  // Check for infinite values
  if (!isFinite(startLat) || !isFinite(startLng) || !isFinite(endLat) || !isFinite(endLng) || !isFinite(arcAlt)) {
    console.warn('Invalid position data detected (infinite values):', pos);
    return null;
  }
  
  // Validate latitude range (-90 to 90)
  if (startLat < -90 || startLat > 90 || endLat < -90 || endLat > 90) {
    console.warn('Latitude out of range:', pos);
    return null;
  }
  
  // Validate longitude range (-180 to 180)
  if (startLng < -180 || startLng > 180 || endLng < -180 || endLng > 180) {
    console.warn('Longitude out of range:', pos);
    return null;
  }
  
  // Ensure arcAlt is positive and reasonable
  if (arcAlt <= 0 || arcAlt > 10) {
    console.warn('Invalid arcAlt value:', arcAlt);
    return null;
  }
  
  return pos;
};

// Safe number conversion with fallbacks
const safeNumber = (value: any, fallback: number = 0): number => {
  const num = Number(value);
  return isNaN(num) || !isFinite(num) ? fallback : num;
};

export function Globe({ globeConfig, data }: WorldProps) {
  const [globeData, setGlobeData] = useState<
    | {
        size: number;
        order: number;
        color: (t: number) => string;
        lat: number;
        lng: number;
      }[]
    | null
  >(null);

  const globeRef = useRef<ThreeGlobe | null>(null);

  const defaultProps = {
    pointSize: 1,
    atmosphereColor: "#ffffff",
    showAtmosphere: true,
    atmosphereAltitude: 0.1,
    polygonColor: "rgba(255,255,255,0.7)",
    globeColor: "#1d072e",
    emissive: "#000000",
    emissiveIntensity: 0.1,
    shininess: 0.9,
    arcTime: 2000,
    arcLength: 0.9,
    rings: 1,
    maxRings: 3,
    ...globeConfig,
  };

  useEffect(() => {
    if (globeRef.current) {
      _buildData();
      _buildMaterial();
    }
  }, [globeRef.current]);

  const _buildMaterial = () => {
    if (!globeRef.current) return;

    try {
      const globeMaterial = globeRef.current.globeMaterial() as unknown as {
        color: Color;
        emissive: Color;
        emissiveIntensity: number;
        shininess: number;
      };
      globeMaterial.color = new Color(globeConfig.globeColor);
      globeMaterial.emissive = new Color(globeConfig.emissive);
      globeMaterial.emissiveIntensity = safeNumber(globeConfig.emissiveIntensity, 0.1);
      globeMaterial.shininess = safeNumber(globeConfig.shininess, 0.9);
    } catch (error) {
      console.error("Error building material:", error);
    }
  };

  const _buildData = () => {
    try {
      // Filter and validate data
      const validArcs = data.filter(arc => validatePosition(arc) !== null);
      
      if (validArcs.length === 0) {
        console.warn('No valid arc data found, using fallback data');
        setGlobeData([]);
        return;
      }

      let points = [];
      for (let i = 0; i < validArcs.length; i++) {
        const arc = validArcs[i];
        const rgb = hexToRgb(arc.color) as { r: number; g: number; b: number };
        if (rgb) {
          points.push({
            size: safeNumber(defaultProps.pointSize, 1),
            order: safeNumber(arc.order, 1),
            color: (t: number) => `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${1 - t})`,
            lat: safeNumber(arc.startLat, 0),
            lng: safeNumber(arc.startLng, 0),
          });
          points.push({
            size: safeNumber(defaultProps.pointSize, 1),
            order: safeNumber(arc.order, 1),
            color: (t: number) => `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${1 - t})`,
            lat: safeNumber(arc.endLat, 0),
            lng: safeNumber(arc.endLng, 0),
          });
        }
      }

      // remove duplicates for same lat and lng
      const filteredPoints = points.filter(
        (v, i, a) =>
          a.findIndex((v2) =>
            ["lat", "lng"].every(
              (k) => v2[k as "lat" | "lng"] === v[k as "lat" | "lng"]
            )
          ) === i
      );

      setGlobeData(filteredPoints);
    } catch (error) {
      console.error("Error building data:", error);
      setGlobeData([]);
    }
  };

  useEffect(() => {
    if (globeRef.current && countries?.features?.length > 0 && data?.length > 0) {
      try {
        globeRef.current
          .hexPolygonsData(countries.features)
          .hexPolygonResolution(3)
          .hexPolygonMargin(0.7)
          .showAtmosphere(defaultProps.showAtmosphere)
          .atmosphereColor(defaultProps.atmosphereColor)
          .atmosphereAltitude(safeNumber(defaultProps.atmosphereAltitude, 0.1))
          .hexPolygonColor(() => defaultProps.polygonColor);
        
        requestAnimationFrame(() => {
          startAnimation();
        });
      } catch (error) {
        console.error("Error setting up globe:", error);
      }
    }
  }, [globeData]);

  const startAnimation = () => {
    if (!globeRef.current || !globeData) return;

    try {
      // Use validated data
      const validArcs = data.filter(arc => validatePosition(arc) !== null);
      
      if (validArcs.length === 0) {
        console.warn('No valid arcs for animation');
        return;
      }

      globeRef.current
        .arcsData(validArcs)
        .arcStartLat((d) => safeNumber((d as { startLat: number }).startLat, 0))
        .arcStartLng((d) => safeNumber((d as { startLng: number }).startLng, 0))
        .arcEndLat((d) => safeNumber((d as { endLat: number }).endLat, 0))
        .arcEndLng((d) => safeNumber((d as { endLng: number }).endLng, 0))
        .arcColor((e: any) => (e as { color: string }).color)
        .arcAltitude((e) => safeNumber((e as { arcAlt: number }).arcAlt, 0.1))
        .arcStroke((e) => {
          return [0.32, 0.28, 0.3][Math.round(Math.random() * 2)];
        })
        .arcDashLength(safeNumber(defaultProps.arcLength, 0.9))
        .arcDashInitialGap((e) => safeNumber((e as { order: number }).order, 1))
        .arcDashGap(15)
        .arcDashAnimateTime((e) => safeNumber(defaultProps.arcTime, 2000));

      if (globeData.length > 0) {
        globeRef.current
          .pointsData(validArcs)
          .pointColor((e) => (e as { color: string }).color)
          .pointsMerge(true)
          .pointAltitude(0.0)
          .pointRadius(safeNumber(defaultProps.pointSize, 2));
      }

      globeRef.current
        .ringsData([])
        .ringColor((e: any) => (t: any) => e.color(t))
        .ringMaxRadius(safeNumber(defaultProps.maxRings, 3))
        .ringPropagationSpeed(RING_PROPAGATION_SPEED)
        .ringRepeatPeriod(
          (safeNumber(defaultProps.arcTime, 2000) * safeNumber(defaultProps.arcLength, 0.9)) / safeNumber(defaultProps.rings, 1)
        );
    } catch (err) {
      console.error("Error in startAnimation:", err);
    }
  };

  useEffect(() => {
    if (!globeRef.current || !globeData) return;

    const interval = setInterval(() => {
      if (!globeRef.current || !globeData) return;
      try {
        const validArcs = data.filter(arc => validatePosition(arc) !== null);
        numbersOfRings = genRandomNumbers(
          0,
          validArcs.length,
          Math.floor((validArcs.length * 4) / 5)
        );

        globeRef.current.ringsData(
          globeData.filter((d, i) => numbersOfRings.includes(i))
        );
      } catch (error) {
        console.error("Error updating rings:", error);
      }
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, [globeRef.current, globeData, data.length]);

  return (
    <>
      <threeGlobe ref={globeRef} />
    </>
  );
}

export function WebGLRendererConfig() {
  const { gl, size } = useThree();

  useEffect(() => {
    try {
      gl.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio to prevent context loss
      gl.setSize(size.width, size.height);
      gl.setClearColor(0xffaaff, 0);
      
      // Add context lost/restored handlers
      const handleContextLost = (event: Event) => {
        console.warn('WebGL context lost, attempting to restore...');
        event.preventDefault();
      };

      const handleContextRestored = () => {
        console.log('WebGL context restored');
        gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        gl.setSize(size.width, size.height);
      };

      gl.domElement.addEventListener('webglcontextlost', handleContextLost, false);
      gl.domElement.addEventListener('webglcontextrestored', handleContextRestored, false);

      return () => {
        gl.domElement.removeEventListener('webglcontextlost', handleContextLost);
        gl.domElement.removeEventListener('webglcontextrestored', handleContextRestored);
      };
    } catch (error) {
      console.error("Error configuring WebGL renderer:", error);
    }
  }, [gl, size]);

  return null;
}

export function World(props: WorldProps) {
  const { globeConfig } = props;
  const scene = new Scene();
  scene.fog = new Fog(0xffffff, 400, 2000);
  
  return (
    <Canvas 
      scene={scene} 
      camera={new PerspectiveCamera(50, aspect, 180, 1800)}
      onError={(error) => {
        console.error("Canvas error:", error);
      }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        failIfMajorPerformanceCaveat: false,
        preserveDrawingBuffer: false,
        stencil: false,
        depth: true,
      }}
    >
      <WebGLRendererConfig />
      <ambientLight color={globeConfig.ambientLight} intensity={0.6} />
      <directionalLight
        color={globeConfig.directionalLeftLight}
        position={new Vector3(-400, 100, 400)}
      />
      <directionalLight
        color={globeConfig.directionalTopLight}
        position={new Vector3(-200, 500, 200)}
      />
      <pointLight
        color={globeConfig.pointLight}
        position={new Vector3(-200, 500, 200)}
        intensity={0.8}
      />
      <Globe {...props} />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minDistance={cameraZ}
        maxDistance={cameraZ}
        autoRotateSpeed={1}
        autoRotate={true}
        minPolarAngle={Math.PI / 3.5}
        maxPolarAngle={Math.PI - Math.PI / 3}
      />
    </Canvas>
  );
}

export function hexToRgb(hex: string) {
  try {
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
      return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  } catch (error) {
    console.error("Error converting hex to RGB:", error);
    return null;
  }
}

export function genRandomNumbers(min: number, max: number, count: number) {
  try {
    const arr = [];
    while (arr.length < count) {
      const r = Math.floor(Math.random() * (max - min)) + min;
      if (arr.indexOf(r) === -1) arr.push(r);
    }
    return arr;
  } catch (error) {
    console.error("Error generating random numbers:", error);
    return [];
  }
}