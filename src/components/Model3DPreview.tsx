import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Environment } from "@react-three/drei";
import { Suspense } from "react";

interface Model3DPreviewProps {
  modelUrl?: string;
}

const Box = () => {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#8b5cf6" />
    </mesh>
  );
};

const Sphere = () => {
  return (
    <mesh position={[2, 0, 0]}>
      <sphereGeometry args={[0.7, 32, 32]} />
      <meshStandardMaterial color="#ec4899" metalness={0.5} roughness={0.2} />
    </mesh>
  );
};

const Torus = () => {
  return (
    <mesh position={[-2, 0, 0]}>
      <torusGeometry args={[0.7, 0.3, 16, 100]} />
      <meshStandardMaterial color="#06b6d4" />
    </mesh>
  );
};

const Model3DPreview = ({ modelUrl }: Model3DPreviewProps) => {
  return (
    <div className="w-full h-64 bg-muted rounded-lg overflow-hidden">
      <Canvas>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 0, 5]} />
          <OrbitControls enableZoom={true} enablePan={false} />
          
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <pointLight position={[-10, -10, -5]} intensity={0.5} />
          
          <Box />
          <Sphere />
          <Torus />
          
          <Environment preset="sunset" />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Model3DPreview;
