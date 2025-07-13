import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { 
  Sun, 
  Moon, 
  Grid3X3, 
  RotateCcw, 
  Lightbulb, 
  Maximize2,
  Eye,
  Palette,
  Home,
  Zap
} from 'lucide-react';

interface Material {
  id: number;
  name: string;
  category: string;
  pricePerSqFt: number;
  color: string;
  description: string;
  texture?: string;
}

interface RoomDimensions {
  length: number;
  width: number;
  height: number;
}

interface Professional3DRoomViewerProps {
  roomType: string;
  dimensions: RoomDimensions;
  materials: Material[];
  selectedMaterials: Record<string, number>;
  onMaterialChange: (category: string, materialId: number) => void;
}

export default function Professional3DRoomViewer({
  roomType,
  dimensions,
  materials,
  selectedMaterials,
  onMaterialChange
}: Professional3DRoomViewerProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const roomMeshesRef = useRef<Record<string, THREE.Mesh>>({});
  const texturesRef = useRef<Record<string, THREE.Texture>>({});
  const animationIdRef = useRef<number | null>(null);
  const controlsRef = useRef<any>(null);
  
  const [isDay, setIsDay] = useState(true);
  const [lightIntensity, setLightIntensity] = useState([0.8]);
  const [showGrid, setShowGrid] = useState(true);
  const [viewMode, setViewMode] = useState('normal');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);

  // Initialize Three.js scene
  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75, 
      mountRef.current.clientWidth / mountRef.current.clientHeight, 
      0.1, 
      1000
    );
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: "high-performance"
    });
    
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.outputEncoding = THREE.sRGBEncoding;
    
    mountRef.current.appendChild(renderer.domElement);
    
    // Store references
    sceneRef.current = scene;
    rendererRef.current = renderer;
    cameraRef.current = camera;
    
    // Camera position
    camera.position.set(8, 6, 8);
    camera.lookAt(0, 0, 0);
    
    // Setup lighting
    setupLighting(scene);
    
    // Create room
    createRoom(scene);
    
    // Setup controls (basic orbit)
    setupControls(camera, renderer);
    
    // Raycaster for interaction
    setupInteraction(scene, camera, renderer);
    
    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      
      renderer.render(scene, camera);
    };
    animate();
    
    setIsLoading(false);
    
    // Handle resize
    const handleResize = () => {
      if (!mountRef.current) return;
      
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Setup professional lighting
  const setupLighting = (scene: THREE.Scene) => {
    // Remove existing lights
    scene.children.filter(child => child.type.includes('Light')).forEach(light => {
      scene.remove(light);
    });
    
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);
    
    // Main directional light (sun)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 8, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    directionalLight.shadow.camera.left = -10;
    directionalLight.shadow.camera.right = 10;
    directionalLight.shadow.camera.top = 10;
    directionalLight.shadow.camera.bottom = -10;
    scene.add(directionalLight);
    
    // Point lights for interior
    const pointLight1 = new THREE.PointLight(0xffffff, 0.5, 20);
    pointLight1.position.set(0, 6, 0);
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0xffffff, 0.3, 15);
    pointLight2.position.set(-3, 4, 3);
    scene.add(pointLight2);
    
    // Update lighting based on time of day
    if (isDay) {
      directionalLight.color.setHex(0xffffff);
      directionalLight.intensity = lightIntensity[0];
      ambientLight.intensity = 0.4;
    } else {
      directionalLight.color.setHex(0x404080);
      directionalLight.intensity = lightIntensity[0] * 0.3;
      ambientLight.intensity = 0.2;
    }
  };

  // Create room geometry
  const createRoom = (scene: THREE.Scene) => {
    const roomMeshes: Record<string, THREE.Mesh> = {};
    
    // Floor
    const floorGeometry = new THREE.PlaneGeometry(dimensions.length, dimensions.width);
    const floorMaterial = new THREE.MeshLambertMaterial({ 
      color: 0xcccccc,
      side: THREE.DoubleSide 
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    floor.receiveShadow = true;
    floor.userData = { category: 'flooring', name: 'Floor' };
    scene.add(floor);
    roomMeshes['floor'] = floor;
    
    // Walls
    const wallMaterial = new THREE.MeshLambertMaterial({ 
      color: 0xf8f8f8,
      side: THREE.DoubleSide 
    });
    
    // Back wall
    const backWallGeometry = new THREE.PlaneGeometry(dimensions.length, dimensions.height);
    const backWall = new THREE.Mesh(backWallGeometry, wallMaterial.clone());
    backWall.position.set(0, dimensions.height / 2, -dimensions.width / 2);
    backWall.receiveShadow = true;
    backWall.userData = { category: 'paint', name: 'Back Wall' };
    scene.add(backWall);
    roomMeshes['backWall'] = backWall;
    
    // Left wall
    const leftWallGeometry = new THREE.PlaneGeometry(dimensions.width, dimensions.height);
    const leftWall = new THREE.Mesh(leftWallGeometry, wallMaterial.clone());
    leftWall.position.set(-dimensions.length / 2, dimensions.height / 2, 0);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.receiveShadow = true;
    leftWall.userData = { category: 'paint', name: 'Left Wall' };
    scene.add(leftWall);
    roomMeshes['leftWall'] = leftWall;
    
    // Right wall
    const rightWallGeometry = new THREE.PlaneGeometry(dimensions.width, dimensions.height);
    const rightWall = new THREE.Mesh(rightWallGeometry, wallMaterial.clone());
    rightWall.position.set(dimensions.length / 2, dimensions.height / 2, 0);
    rightWall.rotation.y = -Math.PI / 2;
    rightWall.receiveShadow = true;
    rightWall.userData = { category: 'paint', name: 'Right Wall' };
    scene.add(rightWall);
    roomMeshes['rightWall'] = rightWall;
    
    // Ceiling
    const ceilingGeometry = new THREE.PlaneGeometry(dimensions.length, dimensions.width);
    const ceilingMaterial = new THREE.MeshLambertMaterial({ 
      color: 0xffffff,
      side: THREE.DoubleSide 
    });
    const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.y = dimensions.height;
    ceiling.receiveShadow = true;
    scene.add(ceiling);
    
    // Add room-specific elements
    if (roomType === 'kitchen') {
      createKitchenElements(scene, roomMeshes);
    } else if (roomType === 'bathroom') {
      createBathroomElements(scene, roomMeshes);
    }
    
    roomMeshesRef.current = roomMeshes;
  };

  // Create kitchen-specific elements
  const createKitchenElements = (scene: THREE.Scene, roomMeshes: Record<string, THREE.Mesh>) => {
    // Kitchen island
    const islandGeometry = new THREE.BoxGeometry(4, 1, 2);
    const islandMaterial = new THREE.MeshLambertMaterial({ color: 0x8b4513 });
    const island = new THREE.Mesh(islandGeometry, islandMaterial);
    island.position.set(0, 0.5, 0);
    island.castShadow = true;
    island.receiveShadow = true;
    island.userData = { category: 'cabinets', name: 'Kitchen Island' };
    scene.add(island);
    roomMeshes['island'] = island;
    
    // Countertop
    const countertopGeometry = new THREE.BoxGeometry(4.2, 0.1, 2.2);
    const countertopMaterial = new THREE.MeshLambertMaterial({ color: 0x2f2f2f });
    const countertop = new THREE.Mesh(countertopGeometry, countertopMaterial);
    countertop.position.set(0, 1.05, 0);
    countertop.castShadow = true;
    countertop.receiveShadow = true;
    countertop.userData = { category: 'countertops', name: 'Countertop' };
    scene.add(countertop);
    roomMeshes['countertop'] = countertop;
    
    // Wall cabinets
    const wallCabinetGeometry = new THREE.BoxGeometry(6, 2, 1);
    const wallCabinetMaterial = new THREE.MeshLambertMaterial({ color: 0x8b4513 });
    const wallCabinet = new THREE.Mesh(wallCabinetGeometry, wallCabinetMaterial);
    wallCabinet.position.set(0, 6, -dimensions.width / 2 + 0.5);
    wallCabinet.castShadow = true;
    wallCabinet.receiveShadow = true;
    wallCabinet.userData = { category: 'cabinets', name: 'Wall Cabinets' };
    scene.add(wallCabinet);
    roomMeshes['wallCabinet'] = wallCabinet;
    
    // Backsplash
    const backsplashGeometry = new THREE.PlaneGeometry(6, 2);
    const backsplashMaterial = new THREE.MeshLambertMaterial({ color: 0xe6e6fa });
    const backsplash = new THREE.Mesh(backsplashGeometry, backsplashMaterial);
    backsplash.position.set(0, 4, -dimensions.width / 2 + 0.01);
    backsplash.userData = { category: 'backsplash', name: 'Backsplash' };
    scene.add(backsplash);
    roomMeshes['backsplash'] = backsplash;
  };

  // Create bathroom-specific elements
  const createBathroomElements = (scene: THREE.Scene, roomMeshes: Record<string, THREE.Mesh>) => {
    // Vanity
    const vanityGeometry = new THREE.BoxGeometry(3, 2, 1.5);
    const vanityMaterial = new THREE.MeshLambertMaterial({ color: 0x4a5568 });
    const vanity = new THREE.Mesh(vanityGeometry, vanityMaterial);
    vanity.position.set(-1, 1, -dimensions.width / 2 + 0.75);
    vanity.castShadow = true;
    vanity.receiveShadow = true;
    vanity.userData = { category: 'cabinets', name: 'Vanity' };
    scene.add(vanity);
    roomMeshes['vanity'] = vanity;
    
    // Vanity countertop
    const vanityTopGeometry = new THREE.BoxGeometry(3.2, 0.1, 1.7);
    const vanityTopMaterial = new THREE.MeshLambertMaterial({ color: 0x2f2f2f });
    const vanityTop = new THREE.Mesh(vanityTopGeometry, vanityTopMaterial);
    vanityTop.position.set(-1, 2.05, -dimensions.width / 2 + 0.75);
    vanityTop.castShadow = true;
    vanityTop.receiveShadow = true;
    vanityTop.userData = { category: 'countertops', name: 'Vanity Top' };
    scene.add(vanityTop);
    roomMeshes['vanityTop'] = vanityTop;
    
    // Shower
    const showerGeometry = new THREE.BoxGeometry(2.5, dimensions.height, 2.5);
    const showerMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff, transparent: true, opacity: 0.3 });
    const shower = new THREE.Mesh(showerGeometry, showerMaterial);
    shower.position.set(2, dimensions.height / 2, 1);
    shower.userData = { category: 'tiles', name: 'Shower' };
    scene.add(shower);
    roomMeshes['shower'] = shower;
    
    // Tub
    const tubGeometry = new THREE.BoxGeometry(1.8, 0.6, 3);
    const tubMaterial = new THREE.MeshLambertMaterial({ color: 0xf0f0f0 });
    const tub = new THREE.Mesh(tubGeometry, tubMaterial);
    tub.position.set(-2, 0.3, 1);
    tub.castShadow = true;
    tub.receiveShadow = true;
    tub.userData = { category: 'fixtures', name: 'Bathtub' };
    scene.add(tub);
    roomMeshes['tub'] = tub;
  };

  // Setup basic orbit controls
  const setupControls = (camera: THREE.Camera, renderer: THREE.WebGLRenderer) => {
    // Simple mouse controls
    let isMouseDown = false;
    let mouseX = 0;
    let mouseY = 0;
    
    const onMouseDown = (event: MouseEvent) => {
      isMouseDown = true;
      mouseX = event.clientX;
      mouseY = event.clientY;
    };
    
    const onMouseMove = (event: MouseEvent) => {
      if (!isMouseDown) return;
      
      const deltaX = event.clientX - mouseX;
      const deltaY = event.clientY - mouseY;
      
      // Rotate camera around center
      const spherical = new THREE.Spherical();
      spherical.setFromVector3(camera.position);
      spherical.theta -= deltaX * 0.01;
      spherical.phi += deltaY * 0.01;
      spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi));
      
      camera.position.setFromSpherical(spherical);
      camera.lookAt(0, 2, 0);
      
      mouseX = event.clientX;
      mouseY = event.clientY;
    };
    
    const onMouseUp = () => {
      isMouseDown = false;
    };
    
    const onWheel = (event: WheelEvent) => {
      const distance = camera.position.distanceTo(new THREE.Vector3(0, 2, 0));
      const newDistance = Math.max(5, Math.min(20, distance + event.deltaY * 0.01));
      camera.position.normalize().multiplyScalar(newDistance);
      camera.position.y = Math.max(2, camera.position.y);
    };
    
    renderer.domElement.addEventListener('mousedown', onMouseDown);
    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('mouseup', onMouseUp);
    renderer.domElement.addEventListener('wheel', onWheel);
    
    controlsRef.current = {
      update: () => {},
      dispose: () => {
        renderer.domElement.removeEventListener('mousedown', onMouseDown);
        renderer.domElement.removeEventListener('mousemove', onMouseMove);
        renderer.domElement.removeEventListener('mouseup', onMouseUp);
        renderer.domElement.removeEventListener('wheel', onWheel);
      }
    };
  };

  // Setup interaction (clicking on elements)
  const setupInteraction = (scene: THREE.Scene, camera: THREE.Camera, renderer: THREE.WebGLRenderer) => {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    
    const onMouseClick = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);
      
      if (intersects.length > 0) {
        const selectedObject = intersects[0].object as THREE.Mesh;
        if (selectedObject.userData?.category) {
          setSelectedElement(selectedObject.userData.name);
          // Cycle through materials for this category
          const category = selectedObject.userData.category;
          const categoryMaterials = materials.filter(m => m.category === category);
          if (categoryMaterials.length > 0) {
            const currentMaterialId = selectedMaterials[category];
            const currentIndex = categoryMaterials.findIndex(m => m.id === currentMaterialId);
            const nextIndex = (currentIndex + 1) % categoryMaterials.length;
            const nextMaterial = categoryMaterials[nextIndex];
            onMaterialChange(category, nextMaterial.id);
          }
        }
      }
    };
    
    renderer.domElement.addEventListener('click', onMouseClick);
  };

  // Apply material changes
  useEffect(() => {
    if (!sceneRef.current || !roomMeshesRef.current) return;
    
    Object.entries(selectedMaterials).forEach(([category, materialId]) => {
      const material = materials.find(m => m.id === materialId);
      if (!material) return;
      
      // Find all meshes with this category
      Object.values(roomMeshesRef.current).forEach(mesh => {
        if (mesh.userData?.category === category) {
          // Update material color
          const meshMaterial = mesh.material as THREE.MeshLambertMaterial;
          meshMaterial.color.setHex(parseInt(material.color.replace('#', '0x')));
          meshMaterial.needsUpdate = true;
        }
      });
    });
  }, [selectedMaterials, materials]);

  // Update lighting
  useEffect(() => {
    if (!sceneRef.current) return;
    setupLighting(sceneRef.current);
  }, [isDay, lightIntensity]);

  // Get material categories for current room type
  const getMaterialCategories = () => {
    if (roomType === 'kitchen') {
      return ['flooring', 'paint', 'cabinets', 'countertops', 'backsplash'];
    } else if (roomType === 'bathroom') {
      return ['flooring', 'paint', 'tiles', 'fixtures', 'countertops'];
    }
    return ['flooring', 'paint', 'tiles'];
  };

  const resetCamera = () => {
    if (!cameraRef.current) return;
    cameraRef.current.position.set(8, 6, 8);
    cameraRef.current.lookAt(0, 2, 0);
  };

  return (
    <div className="space-y-4">
      {/* Professional Controls */}
      <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-lg">
        <Button
          variant={viewMode === 'normal' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode('normal')}
        >
          <Home className="h-4 w-4 mr-1" />
          Normal
        </Button>
        <Button
          variant={viewMode === 'overview' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode('overview')}
        >
          <Maximize2 className="h-4 w-4 mr-1" />
          Overview
        </Button>
        <Button
          variant={isDay ? 'default' : 'outline'}
          size="sm"
          onClick={() => setIsDay(!isDay)}
        >
          {isDay ? <Sun className="h-4 w-4 mr-1" /> : <Moon className="h-4 w-4 mr-1" />}
          {isDay ? 'Day' : 'Night'}
        </Button>
        <Button
          variant={showGrid ? 'default' : 'outline'}
          size="sm"
          onClick={() => setShowGrid(!showGrid)}
        >
          <Grid3X3 className="h-4 w-4 mr-1" />
          Grid
        </Button>
        <Button variant="outline" size="sm" onClick={resetCamera}>
          <RotateCcw className="h-4 w-4 mr-1" />
          Reset
        </Button>
        {selectedElement && (
          <Badge variant="secondary" className="ml-2">
            <Eye className="h-3 w-3 mr-1" />
            {selectedElement}
          </Badge>
        )}
      </div>

      {/* 3D Canvas */}
      <div className="relative bg-white rounded-lg shadow-lg overflow-hidden">
        <div
          ref={mountRef}
          className="w-full h-96 cursor-move"
          style={{ minHeight: '400px' }}
        />
        
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Loading 3D Room...</p>
            </div>
          </div>
        )}
        
        {/* Lighting Controls */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-md">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            <span className="text-sm font-medium">Light</span>
            <Slider
              value={lightIntensity}
              onValueChange={setLightIntensity}
              max={1}
              min={0.1}
              step={0.1}
              className="w-20"
            />
          </div>
        </div>
        
        {/* Instructions */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-md">
          <p className="text-xs text-gray-600">
            <Zap className="h-3 w-3 inline mr-1" />
            Click any surface to change materials
          </p>
        </div>
      </div>

      {/* Interactive Material Selection */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Material Selection
        </h3>
        <div className="grid gap-3 md:grid-cols-2">
          {getMaterialCategories().map((category) => (
            <Card key={category} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm capitalize flex items-center justify-between">
                  {category}
                  {selectedMaterials[category] && (
                    <Badge variant="outline" className="text-xs">
                      Selected
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {materials
                    .filter(m => m.category === category)
                    .slice(0, 3)
                    .map((material) => (
                      <div
                        key={material.id}
                        className={`p-2 rounded border cursor-pointer transition-all ${
                          selectedMaterials[category] === material.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => onMaterialChange(category, material.id)}
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{material.name}</span>
                          <span className="text-xs text-gray-500">${material.pricePerSqFt}/sq ft</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <div
                            className="w-4 h-4 rounded border"
                            style={{ backgroundColor: material.color }}
                          />
                          <span className="text-xs text-gray-600">{material.description}</span>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}