import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three-stdlib';

interface SimpleRoom3DProps {
  roomLength: number;
  roomWidth: number;
  roomHeight: number;
  selectedMaterials: Record<string, number>;
  materials: Array<{
    id: number;
    name: string;
    category: string;
    color: string;
  }>;
}

export default function SimpleRoom3D({
  roomLength,
  roomWidth,
  roomHeight,
  selectedMaterials,
  materials
}: SimpleRoom3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Get material color by category
  const getMaterialColor = (category: string): number => {
    const materialId = selectedMaterials[category];
    if (!materialId) {
      // Default colors
      const defaults = {
        'flooring': 0xD2B48C,
        'paint': 0xF5F5DC,
        'cabinets': 0x8B4513,
        'tiles': 0xF8F8FF
      };
      return defaults[category as keyof typeof defaults] || 0xCCCCCC;
    }

    const material = materials.find(m => m.id === materialId);
    if (!material) return 0xCCCCCC;

    // Simple color mapping
    const colorMap: Record<string, number> = {
      'White Oak Engineered': 0xE8D4B0,
      'Luxury Vinyl Plank': 0x8B4513,
      'Hickory Hardwood': 0xC19A6B,
      'Walnut Engineered': 0x5D4037,
      'Sage Green Paint': 0x9CAF88,
      'Navy Blue Paint': 0x1B365D,
      'Warm Cream Paint': 0xF5F5DC,
      'Sage Green Shaker': 0x9CAF88,
      'Navy Blue Shaker': 0x1B365D,
      'Warm White Shaker': 0xF5F5DC,
      'Calacatta Quartz': 0xF8F8FF,
      'Carrara Marble': 0xFFFFFF,
      'Warm Gray Quartz': 0x8E8E93
    };

    return colorMap[material.name] || 0xCCCCCC;
  };

  useEffect(() => {
    if (!mountRef.current) return;

    // Clear previous scene
    if (sceneRef.current) {
      mountRef.current.innerHTML = '';
    }

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      60,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(20, 15, 20);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Create room
    const roomGroup = new THREE.Group();

    // Floor
    const floorGeometry = new THREE.PlaneGeometry(roomLength, roomWidth);
    const floorMaterial = new THREE.MeshLambertMaterial({ 
      color: getMaterialColor('flooring')
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    roomGroup.add(floor);

    // Walls
    const wallMaterial = new THREE.MeshLambertMaterial({ 
      color: getMaterialColor('paint'),
      transparent: true,
      opacity: 0.8
    });

    // Back wall
    const backWall = new THREE.Mesh(
      new THREE.PlaneGeometry(roomLength, roomHeight),
      wallMaterial
    );
    backWall.position.set(0, roomHeight / 2, -roomWidth / 2);
    roomGroup.add(backWall);

    // Left wall
    const leftWall = new THREE.Mesh(
      new THREE.PlaneGeometry(roomWidth, roomHeight),
      wallMaterial
    );
    leftWall.position.set(-roomLength / 2, roomHeight / 2, 0);
    leftWall.rotation.y = Math.PI / 2;
    roomGroup.add(leftWall);

    // Right wall
    const rightWall = new THREE.Mesh(
      new THREE.PlaneGeometry(roomWidth, roomHeight),
      wallMaterial
    );
    rightWall.position.set(roomLength / 2, roomHeight / 2, 0);
    rightWall.rotation.y = -Math.PI / 2;
    roomGroup.add(rightWall);

    // Kitchen elements
    if (selectedMaterials.cabinets) {
      // Kitchen island
      const islandGeometry = new THREE.BoxGeometry(4, 3, 2);
      const islandMaterial = new THREE.MeshLambertMaterial({ 
        color: getMaterialColor('cabinets')
      });
      const island = new THREE.Mesh(islandGeometry, islandMaterial);
      island.position.set(0, 1.5, 0);
      island.castShadow = true;
      roomGroup.add(island);

      // Counter
      const counterGeometry = new THREE.BoxGeometry(roomLength * 0.6, 3, 2);
      const counter = new THREE.Mesh(counterGeometry, islandMaterial);
      counter.position.set(0, 1.5, -roomWidth / 2 + 1);
      counter.castShadow = true;
      roomGroup.add(counter);

      // Countertop
      if (selectedMaterials.tiles) {
        const countertopGeometry = new THREE.BoxGeometry(roomLength * 0.6, 0.2, 2.2);
        const countertopMaterial = new THREE.MeshLambertMaterial({ 
          color: getMaterialColor('tiles')
        });
        const countertop = new THREE.Mesh(countertopGeometry, countertopMaterial);
        countertop.position.set(0, 3.1, -roomWidth / 2 + 1);
        countertop.castShadow = true;
        roomGroup.add(countertop);
      }
    }

    scene.add(roomGroup);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    setIsLoading(false);

    // Cleanup
    return () => {
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [roomLength, roomWidth, roomHeight, selectedMaterials, materials]);

  return (
    <div className="relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-gray-600">Loading 3D preview...</div>
        </div>
      )}
      <div ref={mountRef} className="w-full h-full" />
      
      {/* Instructions overlay */}
      <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 px-3 py-2 rounded-md text-sm">
        <p className="text-gray-700">
          <strong>3D Preview:</strong> Drag to rotate • Scroll to zoom
        </p>
      </div>
    </div>
  );
}