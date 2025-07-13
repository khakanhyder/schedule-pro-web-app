import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three-stdlib';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { 
  RotateCcw, 
  Lightbulb,
  Maximize2,
  Grid3x3,
  Palette,
  Home,
  Eye,
  Sun,
  Moon
} from 'lucide-react';

interface ProfessionalKitchen3DProps {
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
  onMaterialChange: (category: string, materialId: number) => void;
}

export default function ProfessionalKitchen3D({
  roomLength,
  roomWidth,
  roomHeight,
  selectedMaterials,
  materials,
  onMaterialChange
}: ProfessionalKitchen3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lightIntensity, setLightIntensity] = useState(0.8);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [isGridVisible, setIsGridVisible] = useState(false);
  const [isDaytime, setIsDaytime] = useState(true);

  // Professional material colors with realistic textures
  const getMaterialColor = (category: string): number => {
    const materialId = selectedMaterials[category];
    if (!materialId) {
      const defaultColors = {
        'flooring': 0xD2B48C,
        'paint': 0xF5F5DC,
        'cabinets': 0x8B4513,
        'tiles': 0xF8F8FF,
        'backsplash': 0xE6E6FA
      };
      return defaultColors[category as keyof typeof defaultColors] || 0xCCCCCC;
    }

    const material = materials.find(m => m.id === materialId);
    if (!material) return 0xCCCCCC;

    // Convert hex color to number
    return parseInt(material.color.replace('#', '0x'));
  };

  // Create realistic material with proper lighting
  const createRealisticMaterial = (category: string, color: number) => {
    const materialProps = {
      'flooring': { roughness: 0.8, metalness: 0.1 },
      'cabinets': { roughness: 0.3, metalness: 0.05 },
      'tiles': { roughness: 0.1, metalness: 0.9 },
      'backsplash': { roughness: 0.2, metalness: 0.1 },
      'paint': { roughness: 0.9, metalness: 0.0 }
    };

    const props = materialProps[category as keyof typeof materialProps] || { roughness: 0.5, metalness: 0.1 };
    
    return new THREE.MeshStandardMaterial({
      color,
      roughness: props.roughness,
      metalness: props.metalness,
      envMapIntensity: 0.5
    });
  };

  // Update lighting based on time of day
  const updateLighting = () => {
    if (!sceneRef.current) return;
    
    const scene = sceneRef.current;
    
    // Remove existing lights
    const lights = scene.children.filter(child => child.type.includes('Light'));
    lights.forEach(light => scene.remove(light));

    if (isDaytime) {
      // Daytime lighting
      const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
      scene.add(ambientLight);

      const mainLight = new THREE.DirectionalLight(0xffffff, lightIntensity);
      mainLight.position.set(10, 15, 10);
      mainLight.castShadow = true;
      mainLight.shadow.mapSize.width = 2048;
      mainLight.shadow.mapSize.height = 2048;
      scene.add(mainLight);

      // Natural light from window
      const windowLight = new THREE.DirectionalLight(0x87CEEB, 0.3);
      windowLight.position.set(-10, 8, 5);
      scene.add(windowLight);
    } else {
      // Evening lighting
      const ambientLight = new THREE.AmbientLight(0x2A2A2A, 0.2);
      scene.add(ambientLight);

      // Under-cabinet lighting
      const underCabinetLight = new THREE.PointLight(0xFFE135, 0.5, 15);
      underCabinetLight.position.set(0, 2.5, -roomWidth / 2 + 1);
      scene.add(underCabinetLight);

      // Pendant lights over island
      const pendantLight = new THREE.PointLight(0xFFF8DC, 0.6, 10);
      pendantLight.position.set(0, 6, 0);
      scene.add(pendantLight);

      // General room lighting
      const roomLight = new THREE.PointLight(0xFFE4B5, lightIntensity * 0.4, 20);
      roomLight.position.set(0, roomHeight - 1, 0);
      scene.add(roomLight);
    }

    scene.background = new THREE.Color(isDaytime ? 0xf0f0f0 : 0x1a1a1a);
  };

  // Reset camera to optimal viewing angle
  const resetCamera = () => {
    if (!cameraRef.current || !controlsRef.current) return;
    
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    
    // Professional viewing angle
    camera.position.set(roomLength * 0.8, roomHeight * 0.8, roomWidth * 0.8);
    controls.target.set(0, 2, 0);
    controls.update();
  };

  // Toggle grid helper
  const toggleGrid = () => {
    if (!sceneRef.current) return;
    
    const scene = sceneRef.current;
    const existingGrid = scene.getObjectByName('grid');
    
    if (existingGrid) {
      scene.remove(existingGrid);
      setIsGridVisible(false);
    } else {
      const gridHelper = new THREE.GridHelper(Math.max(roomLength, roomWidth), 20, 0x888888, 0xcccccc);
      gridHelper.name = 'grid';
      scene.add(gridHelper);
      setIsGridVisible(true);
    }
  };

  // Handle material selection from 3D view
  const handleElementClick = (category: string) => {
    const categoryMaterials = materials.filter(m => m.category === category);
    const currentMaterialId = selectedMaterials[category];
    const currentIndex = categoryMaterials.findIndex(m => m.id === currentMaterialId);
    const nextIndex = (currentIndex + 1) % categoryMaterials.length;
    
    onMaterialChange(category, categoryMaterials[nextIndex].id);
  };

  useEffect(() => {
    if (!mountRef.current) return;

    // Clear previous scene
    mountRef.current.innerHTML = '';

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    sceneRef.current = scene;

    // Camera with professional settings
    const camera = new THREE.PerspectiveCamera(
      45,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(roomLength * 0.8, roomHeight * 0.8, roomWidth * 0.8);
    cameraRef.current = camera;

    // Renderer with professional settings
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    rendererRef.current = renderer;
    mountRef.current.appendChild(renderer.domElement);

    // Professional camera controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.set(0, 2, 0);
    controls.maxPolarAngle = Math.PI * 0.85;
    controls.minDistance = 5;
    controls.maxDistance = 50;
    controlsRef.current = controls;

    // Room group
    const roomGroup = new THREE.Group();

    // Floor with realistic material
    const floorGeometry = new THREE.PlaneGeometry(roomLength, roomWidth);
    const floorMaterial = createRealisticMaterial('flooring', getMaterialColor('flooring'));
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    floor.userData = { category: 'flooring', clickable: true };
    roomGroup.add(floor);

    // Walls with realistic paint
    const wallMaterial = createRealisticMaterial('paint', getMaterialColor('paint'));

    // Back wall
    const backWall = new THREE.Mesh(
      new THREE.PlaneGeometry(roomLength, roomHeight),
      wallMaterial
    );
    backWall.position.set(0, roomHeight / 2, -roomWidth / 2);
    backWall.receiveShadow = true;
    backWall.userData = { category: 'paint', clickable: true };
    roomGroup.add(backWall);

    // Left wall
    const leftWall = new THREE.Mesh(
      new THREE.PlaneGeometry(roomWidth, roomHeight),
      wallMaterial
    );
    leftWall.position.set(-roomLength / 2, roomHeight / 2, 0);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.receiveShadow = true;
    roomGroup.add(leftWall);

    // Right wall
    const rightWall = new THREE.Mesh(
      new THREE.PlaneGeometry(roomWidth, roomHeight),
      wallMaterial
    );
    rightWall.position.set(roomLength / 2, roomHeight / 2, 0);
    rightWall.rotation.y = -Math.PI / 2;
    rightWall.receiveShadow = true;
    roomGroup.add(rightWall);

    // Kitchen elements with realistic materials
    const cabinetMaterial = createRealisticMaterial('cabinets', getMaterialColor('cabinets'));
    const countertopMaterial = createRealisticMaterial('tiles', getMaterialColor('tiles'));
    const backsplashMaterial = createRealisticMaterial('backsplash', getMaterialColor('backsplash'));

    // Main cabinets
    const mainCabinet = new THREE.Mesh(
      new THREE.BoxGeometry(roomLength * 0.8, 3, 2),
      cabinetMaterial
    );
    mainCabinet.position.set(0, 1.5, -roomWidth / 2 + 1);
    mainCabinet.castShadow = true;
    mainCabinet.receiveShadow = true;
    mainCabinet.userData = { category: 'cabinets', clickable: true };
    roomGroup.add(mainCabinet);

    // Upper cabinets
    const upperCabinet = new THREE.Mesh(
      new THREE.BoxGeometry(roomLength * 0.8, 2, 1.2),
      cabinetMaterial
    );
    upperCabinet.position.set(0, 6, -roomWidth / 2 + 0.6);
    upperCabinet.castShadow = true;
    upperCabinet.userData = { category: 'cabinets', clickable: true };
    roomGroup.add(upperCabinet);

    // Island
    const island = new THREE.Mesh(
      new THREE.BoxGeometry(6, 3, 3),
      cabinetMaterial
    );
    island.position.set(0, 1.5, 0);
    island.castShadow = true;
    island.receiveShadow = true;
    island.userData = { category: 'cabinets', clickable: true };
    roomGroup.add(island);

    // Countertops
    const mainCountertop = new THREE.Mesh(
      new THREE.BoxGeometry(roomLength * 0.8, 0.2, 2.2),
      countertopMaterial
    );
    mainCountertop.position.set(0, 3.1, -roomWidth / 2 + 1.1);
    mainCountertop.castShadow = true;
    mainCountertop.userData = { category: 'tiles', clickable: true };
    roomGroup.add(mainCountertop);

    const islandCountertop = new THREE.Mesh(
      new THREE.BoxGeometry(6, 0.2, 3.2),
      countertopMaterial
    );
    islandCountertop.position.set(0, 3.1, 0);
    islandCountertop.castShadow = true;
    islandCountertop.userData = { category: 'tiles', clickable: true };
    roomGroup.add(islandCountertop);

    // Backsplash
    const backsplash = new THREE.Mesh(
      new THREE.PlaneGeometry(roomLength * 0.8, 1.5),
      backsplashMaterial
    );
    backsplash.position.set(0, 4.5, -roomWidth / 2 + 0.05);
    backsplash.userData = { category: 'backsplash', clickable: true };
    roomGroup.add(backsplash);

    // Add realistic appliances
    const stainlessSteel = new THREE.MeshStandardMaterial({ 
      color: 0x8C92AC, 
      roughness: 0.1, 
      metalness: 0.9 
    });
    
    // Refrigerator
    const fridge = new THREE.Mesh(
      new THREE.BoxGeometry(3, 6, 2.5),
      stainlessSteel
    );
    fridge.position.set(roomLength * 0.3, 3, -roomWidth / 2 + 1.25);
    fridge.castShadow = true;
    roomGroup.add(fridge);

    // Stove
    const stove = new THREE.Mesh(
      new THREE.BoxGeometry(2.5, 3, 2),
      stainlessSteel
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
        if (object.userData.clickable) {
          renderer.domElement.style.cursor = 'pointer';
        }
      } else {
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
        if (object.userData.clickable) {
          setSelectedElement(object.userData.category);
          handleElementClick(object.userData.category);
        }
      }
    };

    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('click', onMouseClick);

    // Initial lighting setup
    updateLighting();

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

  // Update lighting when settings change
  useEffect(() => {
    updateLighting();
  }, [lightIntensity, isDaytime]);

  // Update materials when selection changes
  useEffect(() => {
    if (!sceneRef.current) return;
    
    const scene = sceneRef.current;
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.userData.category) {
        const category = child.userData.category;
        const newColor = getMaterialColor(category);
        const newMaterial = createRealisticMaterial(category, newColor);
        child.material = newMaterial;
      }
    });
  }, [selectedMaterials]);

  return (
    <div className="space-y-4">
      {/* Professional control panel */}
      <div className="bg-white border rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Kitchen Designer</h3>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDaytime(!isDaytime)}
              className="flex items-center gap-2"
            >
              {isDaytime ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              {isDaytime ? 'Evening' : 'Daytime'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleGrid}
              className="flex items-center gap-2"
            >
              <Grid3x3 className="h-4 w-4" />
              Grid
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              Light Intensity
            </label>
            <Slider
              value={[lightIntensity]}
              onValueChange={(value) => setLightIntensity(value[0])}
              min={0.1}
              max={2}
              step={0.1}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Room Size</label>
            <div className="text-sm text-gray-600">
              {roomLength}' × {roomWidth}' × {roomHeight}'
            </div>
          </div>
        </div>
      </div>

      {/* 3D Viewport */}
      <div className="relative w-full h-[500px] bg-gray-100 rounded-lg overflow-hidden border">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-gray-600">Loading 3D kitchen...</div>
          </div>
        )}
        <div ref={mountRef} className="w-full h-full" />
        
        {/* Selected element indicator */}
        {selectedElement && (
          <div className="absolute top-4 left-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            {selectedElement} selected
          </div>
        )}

        {/* Instructions */}
        <div className="absolute bottom-4 left-4 bg-white bg-opacity-95 px-4 py-2 rounded-lg text-sm shadow-lg">
          <p className="font-medium text-gray-800">
            Click elements to change materials • Drag to rotate • Scroll to zoom
          </p>
        </div>
      </div>

      {/* Material quick selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {['flooring', 'cabinets', 'tiles', 'backsplash'].map((category) => {
          const material = materials.find(m => m.id === selectedMaterials[category]);
          return (
            <Card key={category} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-8 h-8 rounded border-2 border-gray-300"
                    style={{ backgroundColor: material?.color || '#ccc' }}
                  />
                  <div>
                    <p className="font-medium text-sm capitalize">{category}</p>
                    <p className="text-xs text-gray-600">{material?.name || 'Default'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}