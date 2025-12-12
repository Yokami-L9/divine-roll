import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment, ContactShadows, Html } from "@react-three/drei";
import { Loader2 } from "lucide-react";
import * as THREE from "three";

interface Figure3DViewerProps {
  modelUrl: string | null;
  isLoading?: boolean;
}

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  const modelRef = useRef<THREE.Group>(null);

  // Center and scale the model
  useFrame(() => {
    if (modelRef.current) {
      // Auto-rotate slowly when not being controlled
    }
  });

  // Calculate bounding box to center the model
  const box = new THREE.Box3().setFromObject(scene);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  
  // Scale to fit in view
  const maxDim = Math.max(size.x, size.y, size.z);
  const scale = 2 / maxDim;

  return (
    <group ref={modelRef}>
      <primitive 
        object={scene} 
        scale={scale}
        position={[-center.x * scale, -box.min.y * scale, -center.z * scale]}
      />
    </group>
  );
}

function LoadingIndicator() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-2 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="text-sm">Загрузка модели...</p>
      </div>
    </Html>
  );
}

function RoundBase() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
      <cylinderGeometry args={[1.2, 1.3, 0.1, 32]} />
      <meshStandardMaterial color="#1a1a1a" metalness={0.3} roughness={0.7} />
    </mesh>
  );
}

export function Figure3DViewer({ modelUrl, isLoading }: Figure3DViewerProps) {
  if (!modelUrl && !isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-muted to-muted/50 rounded-lg">
        <p className="text-muted-foreground text-center">
          Сгенерируйте 3D-фигурку,<br />чтобы увидеть её здесь
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-muted to-muted/50 rounded-lg gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Генерация 3D-модели...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full rounded-lg overflow-hidden bg-gradient-to-b from-zinc-800 to-zinc-900">
      <Canvas
        camera={{ position: [3, 2, 3], fov: 45 }}
        shadows
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <spotLight 
          position={[5, 5, 5]} 
          angle={0.3} 
          penumbra={1} 
          intensity={1} 
          castShadow 
        />
        <spotLight 
          position={[-5, 5, -5]} 
          angle={0.3} 
          penumbra={1} 
          intensity={0.5} 
        />
        
        <Suspense fallback={<LoadingIndicator />}>
          {modelUrl && <Model url={modelUrl} />}
          <RoundBase />
          <Environment preset="studio" />
        </Suspense>
        
        <ContactShadows 
          position={[0, -0.1, 0]} 
          opacity={0.5} 
          scale={5} 
          blur={2} 
        />
        
        <OrbitControls 
          enablePan={false}
          minDistance={2}
          maxDistance={8}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2}
          autoRotate
          autoRotateSpeed={1}
        />
      </Canvas>
    </div>
  );
}
