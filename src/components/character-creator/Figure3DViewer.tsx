import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import { Loader2 } from "lucide-react";
import * as THREE from "three";

interface Figure3DViewerProps {
  imageUrl: string | null;
  isLoading?: boolean;
}

// Create a curved plane that gives depth illusion
function FigurePlane({ imageUrl }: { imageUrl: string }) {
  const texture = useLoader(THREE.TextureLoader, imageUrl);
  const meshRef = useRef<THREE.Mesh>(null);

  // Create curved geometry for depth effect
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(2, 2.5, 32, 32);
    const positions = geo.attributes.position;
    
    // Add curvature to the plane
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      
      // Curved surface - bulge in the center
      const distFromCenter = Math.sqrt(x * x + y * y);
      const z = Math.cos(distFromCenter * 0.8) * 0.3 - 0.1;
      
      positions.setZ(i, z);
    }
    
    geo.computeVertexNormals();
    return geo;
  }, []);

  // Subtle floating animation
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
    }
  });

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshStandardMaterial 
        map={texture} 
        transparent 
        side={THREE.DoubleSide}
        metalness={0.1}
        roughness={0.8}
      />
    </mesh>
  );
}

// Round base for the figure
function RoundBase() {
  return (
    <group position={[0, -1.35, 0]}>
      {/* Main base */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <cylinderGeometry args={[0.8, 0.9, 0.12, 32]} />
        <meshStandardMaterial 
          color="#1a1a1a" 
          metalness={0.5} 
          roughness={0.4} 
        />
      </mesh>
      {/* Rim */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, 0]}>
        <torusGeometry args={[0.85, 0.02, 8, 32]} />
        <meshStandardMaterial 
          color="#333333" 
          metalness={0.7} 
          roughness={0.3} 
        />
      </mesh>
    </group>
  );
}

function LoadingIndicator() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-2 text-white">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="text-sm">Загрузка...</p>
      </div>
    </Html>
  );
}

export function Figure3DViewer({ imageUrl, isLoading }: Figure3DViewerProps) {
  if (!imageUrl && !isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-zinc-800 to-zinc-900 rounded-lg">
        <p className="text-muted-foreground text-center px-4">
          Сгенерируйте фигурку,<br />чтобы увидеть её здесь
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-zinc-800 to-zinc-900 rounded-lg gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Генерация фигурки...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full rounded-lg overflow-hidden bg-gradient-to-b from-zinc-800 to-zinc-900">
      <Canvas
        camera={{ position: [0, 0, 4], fov: 45 }}
        shadows
        gl={{ antialias: true }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <spotLight 
          position={[5, 5, 5]} 
          angle={0.4} 
          penumbra={1} 
          intensity={1.2} 
          castShadow 
        />
        <spotLight 
          position={[-3, 3, -3]} 
          angle={0.4} 
          penumbra={1} 
          intensity={0.6} 
        />
        <pointLight position={[0, 2, 3]} intensity={0.5} color="#ffffff" />
        
        <Suspense fallback={<LoadingIndicator />}>
          {imageUrl && <FigurePlane imageUrl={imageUrl} />}
          <RoundBase />
        </Suspense>
        
        <OrbitControls 
          enablePan={false}
          minDistance={2.5}
          maxDistance={6}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2}
          autoRotate
          autoRotateSpeed={2}
          enableDamping
          dampingFactor={0.05}
        />
      </Canvas>
    </div>
  );
}
