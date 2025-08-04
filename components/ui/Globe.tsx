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
      globeMaterial.emissiveIntensity = globeConfig.emissiveIntensity || 0.1;
      globeMaterial.shininess = globeConfig.shininess || 0.9;
    } catch (error) {
      console.error("Error building material:", error);
    }
  };

  const _buildData = () => {
    try {
      const arcs = data;
      let points = [];
      for (let i = 0; i < arcs.length; i++) {
        const arc = arcs[i];
        const rgb = hexToRgb(arc.color) as { r: number; g: number; b: number };
        if (rgb) {
          points.push({
            size: defaultProps.pointSize,
            order: arc.order,
            color: (t: number) => `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${1 - t})`,
            lat: arc.startLat,
            lng: arc.startLng,
          });
          points.push({
            size: defaultProps.pointSize,
            order: arc.order,
            color: (t: number) => `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${1 - t})`,
            lat: arc.endLat,
            lng: arc.endLng,
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
          .atmosphereAltitude(defaultProps.atmosphereAltitude)
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
      globeRef.current
        .arcsData(data)
        .arcStartLat((d) => (d as { startLat: number }).startLat * 1)
        .arcStartLng((d) => (d as { startLng: number }).startLng * 1)
        .arcEndLat((d) => (d as { endLat: number }).endLat * 1)
        .arcEndLng((d) => (d as { endLng: number }).endLng * 1)
        .arcColor((e: any) => (e as { color: string }).color)
        .arcAltitude((e) => {
          return (e as { arcAlt: number }).arcAlt * 1;
        })
        .arcStroke((e) => {
          return [0.32, 0.28, 0.3][Math.round(Math.random() * 2)];
        })
        .arcDashLength(defaultProps.arcLength)
        .arcDashInitialGap((e) => (e as { order: number }).order * 1)
        .arcDashGap(15)
        .arcDashAnimateTime((e) => defaultProps.arcTime);

      if (globeData.length > 0) {
        globeRef.current
          .pointsData(data)
          .pointColor((e) => (e as { color: string }).color)
          .pointsMerge(true)
          .pointAltitude(0.0)
          .pointRadius(2);
      }

      globeRef.current
        .ringsData([])
        .ringColor((e: any) => (t: any) => e.color(t))
        .ringMaxRadius(defaultProps.maxRings)
        .ringPropagationSpeed(RING_PROPAGATION_SPEED)
        .ringRepeatPeriod(
          (defaultProps.arcTime * defaultProps.arcLength) / defaultProps.rings
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
        numbersOfRings = genRandomNumbers(
          0,
          data.length,
          Math.floor((data.length * 4) / 5)
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