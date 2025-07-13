import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three-stdlib';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  RotateCcw, 
  Maximize2,
  Info,
  Eye,
  Home
} from 'lucide-react';

interface SimpleKitchen3DProps {
  roomLength: number;
  roomWidth: number;
  roomHeight: number;
  selectedMaterials: Record<string, number>;
  materials: Array<{
    id: number;
    name: string;
    category: string;
    color: string;
    price: number;
    unit: string;
  }>;
}

export default function SimpleKitchen3D({
  roomLength,
  roomWidth,
  roomHeight,
  selectedMaterials,
  materials
}: SimpleKitchen3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);
  const [selectedInfo, setSelectedInfo] = useState<{name: string; area: number; cost: number} | null>(null);
  const [viewMode, setViewMode] = useState<'normal' | 'overview'>('normal');

  // Get material color by category
  const getMaterialColor = (category: string): number => {
    const materialId = selectedMaterials[category];
    if (!materialId) {
      const defaults = {
        'flooring': 0xD2B48C,
        'paint': 0xF5F5DC,
        'cabinets': 0x8B4513,
        'tiles': 0xF8F8FF,
        'backsplash': 0xE6E6FA
      };
      return defaults[category as keyof typeof defaults] || 0xCCCCCC;
    }

    const material = materials.find(m => m.id === materialId);
    if (!material) return 0xCCCCCC;

    return parseInt(material.color.replace('#', '0x'));
  };

  // Calculate quantities for display
  const getQuantities = () => {
    const countertopArea = (roomLength * 0.8 * 2.2) + (6 * 3.2);
    const cabinetLinearFeet = roomLength * 0.8 + 6;
    const backsplashArea = roomLength * 0.8 * 1.5;
    const floorArea = (roomLength * roomWidth) - ((roomLength * 0.8 * 2) + (6 * 3));
    
    return {
      countertops: countertopArea,
      cabinets: cabinetLinearFeet,
      backsplash: backsplashArea,
      flooring: floorArea
    };
  };

  // Reset camera to good viewing angle
  const resetCamera = () => {
    if (!cameraRef.current || !controlsRef.current) return;
    
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    
    if (viewMode === 'overview') {
      // Bird's eye view
      camera.position.set(roomLength * 1.2, roomHeight * 2, roomWidth * 1.2);
      controls.target.set(0, 0, 0);
    } else {
      // Normal walkthrough view
      camera.position.set(roomLength * 0.6, 6, roomWidth * 0.8);
      controls.target.set(0, 3, 0);
    }
    
    controls.update();
  };

  // Toggle between normal and overview
  const toggleView = () => {
    const newMode = viewMode === 'normal' ? 'overview' : 'normal';
    setViewMode(newMode);
    
    if (cameraRef.current && controlsRef.current) {
      const camera = cameraRef.current;
      const controls = controlsRef.current;
      
      if (newMode === 'overview') {
        camera.position.set(roomLength * 1.2, roomHeight * 2, roomWidth * 1.2);
        controls.target.set(0, 0, 0);
      } else {
        camera.position.set(roomLength * 0.6, 6, roomWidth * 0.8);
        controls.target.set(0, 3, 0);
      }
      
      controls.update();
    }
  };

  useEffect(() => {
    if (!mountRef.current) return;

    // Clear previous scene
    mountRef.current.innerHTML = '';

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
    camera.position.set(roomLength * 0.6, 6, roomWidth * 0.8);
    cameraRef.current = camera;

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
    controls.target.set(0, 3, 0);
    controls.maxPolarAngle = Math.PI * 0.8; // Prevent going under floor
    controlsRef.current = controls;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
    mainLight.position.set(10, 15, 10);
    mainLight.castShadow = true;
    scene.add(mainLight);

    // Room group
    const roomGroup = new THREE.Group();

    // Floor
    const floorGeometry = new THREE.PlaneGeometry(roomLength, roomWidth);
    const floorMaterial = new THREE.MeshLambertMaterial({ 
      color: getMaterialColor('flooring')
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    floor.userData = { 
      type: 'flooring', 
      name: 'Flooring',
      area: getQuantities().flooring,
      cost: getQuantities().flooring * (materials.find(m => m.id === selectedMaterials['flooring'])?.price || 0)
    };
    roomGroup.add(floor);

    // Walls
    const wallMaterial = new THREE.MeshLambertMaterial({ 
      color: getMaterialColor('paint'),
      transparent: true,
      opacity: 0.9
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

    // Main cabinets (L-shaped)
    const cabinetMaterial = new THREE.MeshLambertMaterial({ 
      color: getMaterialColor('cabinets')
    });

    // Lower cabinets - main wall
    const mainCabinet = new THREE.Mesh(
      new THREE.BoxGeometry(roomLength * 0.8, 3, 2),
      cabinetMaterial
    );
    mainCabinet.position.set(0, 1.5, -roomWidth / 2 + 1);
    mainCabinet.castShadow = true;
    mainCabinet.userData = { 
      type: 'cabinets', 
      name: 'Kitchen Cabinets',
      area: getQuantities().cabinets,
      cost: getQuantities().cabinets * (materials.find(m => m.id === selectedMaterials['cabinets'])?.price || 0)
    };
    roomGroup.add(mainCabinet);

    // Upper cabinets
    const upperCabinet = new THREE.Mesh(
      new THREE.BoxGeometry(roomLength * 0.8, 2, 1.2),
      cabinetMaterial
    );
    upperCabinet.position.set(0, 6, -roomWidth / 2 + 0.6);
    upperCabinet.castShadow = true;
    roomGroup.add(upperCabinet);

    // Island
    const island = new THREE.Mesh(
      new THREE.BoxGeometry(6, 3, 3),
      cabinetMaterial
    );
    island.position.set(0, 1.5, 0);
    island.castShadow = true;
    roomGroup.add(island);

    // Countertops
    const countertopMaterial = new THREE.MeshLambertMaterial({ 
      color: getMaterialColor('tiles')
    });

    // Main countertop
    const mainCountertop = new THREE.Mesh(
      new THREE.BoxGeometry(roomLength * 0.8, 0.2, 2.2),
      countertopMaterial
    );
    mainCountertop.position.set(0, 3.1, -roomWidth / 2 + 1.1);
    mainCountertop.castShadow = true;
    mainCountertop.userData = { 
      type: 'countertops', 
      name: 'Countertops',
      area: getQuantities().countertops,
      cost: getQuantities().countertops * (materials.find(m => m.id === selectedMaterials['tiles'])?.price || 0)
    };
    roomGroup.add(mainCountertop);

    // Island countertop
    const islandCountertop = new THREE.Mesh(
      new THREE.BoxGeometry(6, 0.2, 3.2),
      countertopMaterial
    );
    islandCountertop.position.set(0, 3.1, 0);
    islandCountertop.castShadow = true;
    roomGroup.add(islandCountertop);

    // Backsplash
    const backsplashMaterial = new THREE.MeshLambertMaterial({ 
      color: getMaterialColor('backsplash') || getMaterialColor('tiles')
    });

    const backsplash = new THREE.Mesh(
      new THREE.PlaneGeometry(roomLength * 0.8, 1.5),
      backsplashMaterial
    );
    backsplash.position.set(0, 4.5, -roomWidth / 2 + 0.05);
    backsplash.userData = { 
      type: 'backsplash', 
      name: 'Backsplash',
      area: getQuantities().backsplash,
      cost: getQuantities().backsplash * (materials.find(m => m.id === selectedMaterials['backsplash'])?.price || 0)
    };
    roomGroup.add(backsplash);

    // Add some appliances for realism
    const applianceMaterial = new THREE.MeshLambertMaterial({ color: 0x2C2C2C });
    
    // Refrigerator
    const fridge = new THREE.Mesh(
      new THREE.BoxGeometry(3, 6, 2.5),
      applianceMaterial
    );
    fridge.position.set(roomLength * 0.3, 3, -roomWidth / 2 + 1.25);
    fridge.castShadow = true;
    roomGroup.add(fridge);

    // Stove
    const stove = new THREE.Mesh(
      new THREE.BoxGeometry(2.5, 3, 2),
      applianceMaterial
    );
    stove.position.set(-roomLength * 0.2, 1.5, -roomWidth / 2 + 1);
    stove.castShadow = true;
    roomGroup.add(stove);

    scene.add(roomGroup);

    // Mouse interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseMove = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(roomGroup.children);

      if (intersects.length > 0) {
        const object = intersects[0].object;
        if (object.userData.type) {
          setHoveredElement(object.userData.name || object.userData.type);
          renderer.domElement.style.cursor = 'pointer';
        }
      } else {
        setHoveredElement(null);
        renderer.domElement.style.cursor = 'default';
      }
    };

    const onMouseClick = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(roomGroup.children);

      if (intersects.length > 0) {
        const object = intersects[0].object;
        if (object.userData.type && object.userData.area) {
          setSelectedInfo({
            name: object.userData.name || object.userData.type,
            area: object.userData.area,
            cost: object.userData.cost || 0
          });
        }
      }
    };

    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('click', onMouseClick);

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
      renderer.domElement.removeEventListener('mousemove', onMouseMove);
      renderer.domElement.removeEventListener('click', onMouseClick);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [roomLength, roomWidth, roomHeight, selectedMaterials, materials]);

  const quantities = getQuantities();

  return (
    <div className="space-y-4">
      {/* Simple control bar */}
      <div className="flex items-center justify-between bg-white border rounded-lg p-3">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-gray-900">Kitchen Preview</h3>
          <span className="text-sm text-gray-600">
            {roomLength}' × {roomWidth}' × {roomHeight}'
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleView}
            className="flex items-center gap-2"
          >
            {viewMode === 'normal' ? <Home className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {viewMode === 'normal' ? 'Overview' : 'Normal'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={resetCamera}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>
      </div>

      {/* 3D Viewport */}
      <div className="relative w-full h-96 bg-gray-50 rounded-lg overflow-hidden border">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <div className="text-gray-600">Loading kitchen...</div>
          </div>
        )}
        <div ref={mountRef} className="w-full h-full" />
        
        {/* Simple info panel */}
        {selectedInfo && (
          <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-xs">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">{selectedInfo.name}</h4>
              <div className="space-y-1 text-xs">
                <p className="text-gray-600">
                  Area: {selectedInfo.area.toFixed(1)} sq ft
                </p>
                <p className="text-gray-600">
                  Cost: ${selectedInfo.cost.toLocaleString()}
                </p>
              </div>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => setSelectedInfo(null)}
                className="w-full"
              >
                Close
              </Button>
            </div>
          </div>
        )}

        {/* Simple instructions */}
        <div className="absolute bottom-4 left-4 bg-white bg-opacity-95 px-3 py-2 rounded-md text-sm shadow-lg">
          <p className="font-medium text-gray-800">
            {hoveredElement ? `Hover: ${hoveredElement}` : 'Drag to rotate • Scroll to zoom • Click for details'}
          </p>
        </div>
      </div>

      {/* Quantities summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-gray-600">Countertops</p>
            <p className="text-xl font-semibold">{quantities.countertops.toFixed(1)}</p>
            <p className="text-xs text-gray-500">sq ft</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-gray-600">Cabinets</p>
            <p className="text-xl font-semibold">{quantities.cabinets.toFixed(1)}</p>
            <p className="text-xs text-gray-500">linear ft</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-gray-600">Backsplash</p>
            <p className="text-xl font-semibold">{quantities.backsplash.toFixed(1)}</p>
            <p className="text-xs text-gray-500">sq ft</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-gray-600">Flooring</p>
            <p className="text-xl font-semibold">{quantities.flooring.toFixed(1)}</p>
            <p className="text-xs text-gray-500">sq ft</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}