import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three-stdlib';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { 
  RotateCcw, 
  Lightbulb,
  Grid3x3,
  Sun,
  Moon,
  Droplets,
  Bath
} from 'lucide-react';

interface ProfessionalBathroom3DProps {
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

export default function ProfessionalBathroom3D({
  roomLength,
  roomWidth,
  roomHeight,
  selectedMaterials,
  materials,
  onMaterialChange
}: ProfessionalBathroom3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lightIntensity, setLightIntensity] = useState(1.0);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [isGridVisible, setIsGridVisible] = useState(false);
  const [isDaytime, setIsDaytime] = useState(true);

  // Professional material colors
  const getMaterialColor = (category: string): number => {
    const materialId = selectedMaterials[category];
    if (!materialId) {
      const defaultColors = {
        'flooring': 0xE5E5E5, // Light gray tile
        'paint': 0xF8F8F8,   // Off-white
        'tiles': 0xFFFFFF,   // White subway tiles
        'fixtures': 0xF0F0F0, // Chrome/white fixtures
        'countertops': 0x2F2F2F // Dark granite
      };
      return defaultColors[category as keyof typeof defaultColors] || 0xCCCCCC;
    }

    const material = materials.find(m => m.id === materialId);
    if (!material) return 0xCCCCCC;
    return parseInt(material.color.replace('#', '0x'));
  };

  // Create realistic material
  const createRealisticMaterial = (category: string, color: number) => {
    const materialProps = {
      'flooring': { roughness: 0.3, metalness: 0.0 }, // Ceramic tiles
      'paint': { roughness: 0.8, metalness: 0.0 },    // Matte paint
      'tiles': { roughness: 0.1, metalness: 0.0 },    // Glossy tiles
      'fixtures': { roughness: 0.2, metalness: 0.8 }, // Chrome fixtures
      'countertops': { roughness: 0.4, metalness: 0.1 } // Stone countertops
    };

    const props = materialProps[category as keyof typeof materialProps] || { roughness: 0.5, metalness: 0.1 };
    
    return new THREE.MeshStandardMaterial({
      color,
      roughness: props.roughness,
      metalness: props.metalness,
      envMapIntensity: 0.8
    });
  };

  // Update lighting
  const updateLighting = () => {
    if (!sceneRef.current) return;
    
    const scene = sceneRef.current;
    
    // Remove existing lights
    const lights = scene.children.filter(child => child.type.includes('Light'));
    lights.forEach(light => scene.remove(light));

    if (isDaytime) {
      // Natural bathroom lighting
      const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
      scene.add(ambientLight);

      const mainLight = new THREE.DirectionalLight(0xffffff, lightIntensity);
      mainLight.position.set(8, 12, 8);
      mainLight.castShadow = true;
      mainLight.shadow.mapSize.width = 2048;
      mainLight.shadow.mapSize.height = 2048;
      scene.add(mainLight);

      // Window light
      const windowLight = new THREE.DirectionalLight(0xB0E0E6, 0.4);
      windowLight.position.set(-5, 8, 5);
      scene.add(windowLight);
    } else {
      // Evening bathroom lighting
      const ambientLight = new THREE.AmbientLight(0x2A2A2A, 0.3);
      scene.add(ambientLight);

      // Vanity lights
      const vanityLight = new THREE.PointLight(0xFFE4B5, 0.8, 12);
      vanityLight.position.set(0, 6, -roomWidth / 2 + 1);
      scene.add(vanityLight);

      // Shower light
      const showerLight = new THREE.PointLight(0xFFE4B5, 0.6, 8);
      showerLight.position.set(roomLength / 2 - 2, 6, roomWidth / 2 - 2);
      scene.add(showerLight);

      // General lighting
      const generalLight = new THREE.PointLight(0xFFE4B5, lightIntensity * 0.5, 15);
      generalLight.position.set(0, roomHeight - 1, 0);
      scene.add(generalLight);
    }

    scene.background = new THREE.Color(isDaytime ? 0xf5f5f5 : 0x1a1a1a);
  };

  // Reset camera
  const resetCamera = () => {
    if (!cameraRef.current || !controlsRef.current) return;
    
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    
    camera.position.set(roomLength * 0.7, roomHeight * 0.8, roomWidth * 0.7);
    controls.target.set(0, 2, 0);
    controls.update();
  };

  // Toggle grid
  const toggleGrid = () => {
    if (!sceneRef.current) return;
    
    const scene = sceneRef.current;
    const existingGrid = scene.getObjectByName('grid');
    
    if (existingGrid) {
      scene.remove(existingGrid);
      setIsGridVisible(false);
    } else {
      const gridHelper = new THREE.GridHelper(Math.max(roomLength, roomWidth), 10, 0x888888, 0xcccccc);
      gridHelper.name = 'grid';
      scene.add(gridHelper);
      setIsGridVisible(true);
    }
  };

  // Handle element click
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
    scene.background = new THREE.Color(0xf5f5f5);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(roomLength * 0.7, roomHeight * 0.8, roomWidth * 0.7);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    rendererRef.current = renderer;
    mountRef.current.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.set(0, 2, 0);
    controls.maxPolarAngle = Math.PI * 0.85;
    controls.minDistance = 3;
    controls.maxDistance = 25;
    controlsRef.current = controls;

    // Bathroom group
    const bathroomGroup = new THREE.Group();

    // Floor
    const floorGeometry = new THREE.PlaneGeometry(roomLength, roomWidth);
    const floorMaterial = createRealisticMaterial('flooring', getMaterialColor('flooring'));
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    floor.userData = { category: 'flooring', clickable: true };
    bathroomGroup.add(floor);

    // Walls
    const wallMaterial = createRealisticMaterial('paint', getMaterialColor('paint'));

    // Back wall
    const backWall = new THREE.Mesh(
      new THREE.PlaneGeometry(roomLength, roomHeight),
      wallMaterial
    );
    backWall.position.set(0, roomHeight / 2, -roomWidth / 2);
    backWall.receiveShadow = true;
    backWall.userData = { category: 'paint', clickable: true };
    bathroomGroup.add(backWall);

    // Left wall
    const leftWall = new THREE.Mesh(
      new THREE.PlaneGeometry(roomWidth, roomHeight),
      wallMaterial
    );
    leftWall.position.set(-roomLength / 2, roomHeight / 2, 0);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.receiveShadow = true;
    bathroomGroup.add(leftWall);

    // Right wall
    const rightWall = new THREE.Mesh(
      new THREE.PlaneGeometry(roomWidth, roomHeight),
      wallMaterial
    );
    rightWall.position.set(roomLength / 2, roomHeight / 2, 0);
    rightWall.rotation.y = -Math.PI / 2;
    rightWall.receiveShadow = true;
    bathroomGroup.add(rightWall);

    // Bathroom elements
    const fixtureMaterial = createRealisticMaterial('fixtures', getMaterialColor('fixtures'));
    const tileMaterial = createRealisticMaterial('tiles', getMaterialColor('tiles'));
    const countertopMaterial = createRealisticMaterial('countertops', getMaterialColor('countertops'));

    // Vanity
    const vanity = new THREE.Mesh(
      new THREE.BoxGeometry(4, 2.5, 1.5),
      fixtureMaterial
    );
    vanity.position.set(0, 1.25, -roomWidth / 2 + 0.75);
    vanity.castShadow = true;
    vanity.receiveShadow = true;
    vanity.userData = { category: 'fixtures', clickable: true };
    bathroomGroup.add(vanity);

    // Vanity countertop
    const vanityTop = new THREE.Mesh(
      new THREE.BoxGeometry(4, 0.2, 1.5),
      countertopMaterial
    );
    vanityTop.position.set(0, 2.6, -roomWidth / 2 + 0.75);
    vanityTop.castShadow = true;
    vanityTop.userData = { category: 'countertops', clickable: true };
    bathroomGroup.add(vanityTop);

    // Bathtub
    const bathtub = new THREE.Mesh(
      new THREE.BoxGeometry(5, 1.5, 2.5),
      fixtureMaterial
    );
    bathtub.position.set(-roomLength / 2 + 2.5, 0.75, roomWidth / 2 - 1.25);
    bathtub.castShadow = true;
    bathtub.receiveShadow = true;
    bathroomGroup.add(bathtub);

    // Shower area
    const showerBase = new THREE.Mesh(
      new THREE.BoxGeometry(3, 0.2, 3),
      tileMaterial
    );
    showerBase.position.set(roomLength / 2 - 1.5, 0.1, roomWidth / 2 - 1.5);
    showerBase.castShadow = true;
    showerBase.receiveShadow = true;
    showerBase.userData = { category: 'tiles', clickable: true };
    bathroomGroup.add(showerBase);

    // Shower walls
    const showerWall1 = new THREE.Mesh(
      new THREE.PlaneGeometry(3, 6),
      tileMaterial
    );
    showerWall1.position.set(roomLength / 2 - 1.5, 3, roomWidth / 2 - 0.01);
    showerWall1.rotation.y = Math.PI;
    showerWall1.userData = { category: 'tiles', clickable: true };
    bathroomGroup.add(showerWall1);

    const showerWall2 = new THREE.Mesh(
      new THREE.PlaneGeometry(3, 6),
      tileMaterial
    );
    showerWall2.position.set(roomLength / 2 - 0.01, 3, roomWidth / 2 - 1.5);
    showerWall2.rotation.y = -Math.PI / 2;
    showerWall2.userData = { category: 'tiles', clickable: true };
    bathroomGroup.add(showerWall2);

    // Toilet
    const toilet = new THREE.Mesh(
      new THREE.BoxGeometry(1.5, 2, 2),
      fixtureMaterial
    );
    toilet.position.set(roomLength / 2 - 2, 1, -roomWidth / 2 + 1);
    toilet.castShadow = true;
    toilet.receiveShadow = true;
    bathroomGroup.add(toilet);

    // Mirror
    const mirror = new THREE.Mesh(
      new THREE.PlaneGeometry(3, 2),
      new THREE.MeshStandardMaterial({ 
        color: 0x888888, 
        roughness: 0.1, 
        metalness: 0.9 
      })
    );
    mirror.position.set(0, 4, -roomWidth / 2 + 0.02);
    bathroomGroup.add(mirror);

    scene.add(bathroomGroup);

    // Mouse interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseMove = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(bathroomGroup.children);

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
      const intersects = raycaster.intersectObjects(bathroomGroup.children);

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

    // Initial lighting
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
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Bath className="h-5 w-5" />
            Bathroom Designer
          </h3>
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
            <div className="text-gray-600">Loading 3D bathroom...</div>
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
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {['flooring', 'paint', 'tiles', 'fixtures', 'countertops'].map((category) => {
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