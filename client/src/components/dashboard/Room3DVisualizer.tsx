import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three-stdlib';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Palette, Camera, Save, Eye, EyeOff } from 'lucide-react';
import type { RoomMaterial } from '@shared/schema';

interface Room3DVisualizerProps {
  roomLength: number;
  roomWidth: number;
  roomHeight: number;
  onRoomChange: (dimensions: { length: number; width: number; height: number }) => void;
  selectedMaterials: Record<string, number>;
  onMaterialChange: (category: string, materialId: number) => void;
  materials: RoomMaterial[];
}

interface MaterialPreview {
  category: string;
  material: RoomMaterial | null;
  visible: boolean;
}

export default function Room3DVisualizer({
  roomLength = 12,
  roomWidth = 10,
  roomHeight = 9,
  onRoomChange,
  selectedMaterials,
  onMaterialChange,
  materials
}: Room3DVisualizerProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'3d' | 'wireframe'>('3d');
  const [materialPreviews, setMaterialPreviews] = useState<MaterialPreview[]>([
    { category: 'flooring', material: null, visible: true },
    { category: 'paint', material: null, visible: true },
    { category: 'tiles', material: null, visible: true },
    { category: 'fixtures', material: null, visible: false },
    { category: 'cabinets', material: null, visible: false }
  ]);

  // Initialize Three.js scene
  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(15, 10, 15);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controlsRef.current = controls;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    scene.add(directionalLight);

    // Create room geometry
    createRoom(scene, roomLength, roomWidth, roomHeight);

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
  }, []);

  // Update room when dimensions change
  useEffect(() => {
    if (sceneRef.current) {
      // Clear existing room
      const roomObjects = sceneRef.current.children.filter(child => 
        child.userData.isRoom
      );
      roomObjects.forEach(obj => sceneRef.current?.remove(obj));

      // Create new room
      createRoom(sceneRef.current, roomLength, roomWidth, roomHeight);
    }
  }, [roomLength, roomWidth, roomHeight]);

  const createRoom = (scene: THREE.Scene, length: number, width: number, height: number) => {
    const roomGroup = new THREE.Group();
    roomGroup.userData.isRoom = true;

    // Floor
    const floorGeometry = new THREE.PlaneGeometry(length, width);
    const floorMaterial = new THREE.MeshLambertMaterial({ 
      color: getColorForCategory('flooring'),
      transparent: true,
      opacity: 0.8
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    floor.userData.category = 'flooring';
    roomGroup.add(floor);

    // Walls
    const wallMaterial = new THREE.MeshLambertMaterial({ 
      color: getColorForCategory('paint'),
      transparent: true,
      opacity: 0.7
    });

    // Back wall
    const backWallGeometry = new THREE.PlaneGeometry(length, height);
    const backWall = new THREE.Mesh(backWallGeometry, wallMaterial);
    backWall.position.set(0, height / 2, -width / 2);
    backWall.userData.category = 'paint';
    roomGroup.add(backWall);

    // Front wall (partial for visibility)
    const frontWallGeometry = new THREE.PlaneGeometry(length, height);
    const frontWall = new THREE.Mesh(frontWallGeometry, wallMaterial.clone());
    frontWall.material.opacity = 0.3;
    frontWall.position.set(0, height / 2, width / 2);
    frontWall.rotation.y = Math.PI;
    frontWall.userData.category = 'paint';
    roomGroup.add(frontWall);

    // Left wall
    const leftWallGeometry = new THREE.PlaneGeometry(width, height);
    const leftWall = new THREE.Mesh(leftWallGeometry, wallMaterial);
    leftWall.position.set(-length / 2, height / 2, 0);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.userData.category = 'paint';
    roomGroup.add(leftWall);

    // Right wall
    const rightWallGeometry = new THREE.PlaneGeometry(width, height);
    const rightWall = new THREE.Mesh(rightWallGeometry, wallMaterial);
    rightWall.position.set(length / 2, height / 2, 0);
    rightWall.rotation.y = -Math.PI / 2;
    rightWall.userData.category = 'paint';
    roomGroup.add(rightWall);

    // Add some basic fixtures for demonstration
    if (materialPreviews.find(p => p.category === 'fixtures')?.visible) {
      // Simple cabinet representation
      const cabinetGeometry = new THREE.BoxGeometry(2, 1, 0.6);
      const cabinetMaterial = new THREE.MeshLambertMaterial({ 
        color: getColorForCategory('cabinets')
      });
      const cabinet = new THREE.Mesh(cabinetGeometry, cabinetMaterial);
      cabinet.position.set(-length / 2 + 1, 0.5, -width / 2 + 0.3);
      cabinet.castShadow = true;
      cabinet.userData.category = 'cabinets';
      roomGroup.add(cabinet);
    }

    scene.add(roomGroup);
  };

  const getColorForCategory = (category: string): number => {
    const material = materials.find(m => 
      m.id === selectedMaterials[category] && m.category === category
    );
    
    if (material) {
      // Convert color name to hex (simplified mapping)
      const colorMap: Record<string, number> = {
        'Natural Oak': 0xD2B48C,
        'Carrara White': 0xF8F8FF,
        'Rustic Brown': 0x8B4513,
        'Warm White': 0xFFFDD0,
        'Sage Green': 0x9CAF88,
        'Classic White': 0xFFFFFF,
        'Ocean Blue': 0x4682B4,
        'Brushed Nickel': 0xC0C0C0,
        'Navy Blue': 0x000080,
        'Espresso': 0x3C2414
      };
      return colorMap[material.color] || 0x888888;
    }
    
    // Default colors by category
    const defaultColors: Record<string, number> = {
      flooring: 0xD2B48C, // Light brown
      paint: 0xF5F5F5,    // Off white
      tiles: 0xFFFFFF,    // White
      fixtures: 0xC0C0C0, // Silver
      cabinets: 0x8B4513   // Saddle brown
    };
    
    return defaultColors[category] || 0x888888;
  };

  const toggleMaterialVisibility = (category: string) => {
    setMaterialPreviews(prev => 
      prev.map(p => 
        p.category === category 
          ? { ...p, visible: !p.visible }
          : p
      )
    );
  };

  const getMaterialsByCategory = (category: string) => {
    return materials.filter(m => m.category === category && m.isActive);
  };

  const toggleViewMode = () => {
    setViewMode(prev => prev === '3d' ? 'wireframe' : '3d');
    
    if (sceneRef.current) {
      sceneRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh && child.userData.isRoom) {
          child.material.wireframe = viewMode === '3d';
        }
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 3D Viewer */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              3D Room Preview
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleViewMode}
                className="flex items-center gap-2"
              >
                <Camera className="h-4 w-4" />
                {viewMode === '3d' ? 'Wireframe' : '3D View'}
              </Button>
              <Button size="sm" className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save View
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div
              ref={mountRef}
              className="w-full h-[400px] bg-gray-50 rounded-lg border relative"
            >
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-gray-500">Loading 3D preview...</div>
                </div>
              )}
            </div>
            
            {/* Room Dimensions Controls */}
            <div className="mt-4 grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="length">Length (ft)</Label>
                <Input
                  id="length"
                  type="number"
                  min="6"
                  max="30"
                  value={roomLength}
                  onChange={(e) => onRoomChange({ 
                    length: Number(e.target.value), 
                    width: roomWidth, 
                    height: roomHeight 
                  })}
                />
              </div>
              <div>
                <Label htmlFor="width">Width (ft)</Label>
                <Input
                  id="width"
                  type="number"
                  min="6"
                  max="30"
                  value={roomWidth}
                  onChange={(e) => onRoomChange({ 
                    length: roomLength, 
                    width: Number(e.target.value), 
                    height: roomHeight 
                  })}
                />
              </div>
              <div>
                <Label htmlFor="height">Height (ft)</Label>
                <Input
                  id="height"
                  type="number"
                  min="7"
                  max="15"
                  value={roomHeight}
                  onChange={(e) => onRoomChange({ 
                    length: roomLength, 
                    width: roomWidth, 
                    height: Number(e.target.value) 
                  })}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Material Selection Panel */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Material Selection</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="flooring" className="w-full">
              <TabsList className="flex flex-col w-full h-auto p-1 bg-gray-100">
                {materialPreviews.map(({ category, visible }) => (
                  <TabsTrigger 
                    key={category} 
                    value={category}
                    className="flex items-center justify-between w-full h-10 px-3 py-2 mb-1 last:mb-0 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                  >
                    <span className="capitalize font-medium">{category}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMaterialVisibility(category);
                      }}
                      className="h-6 w-6 p-0 ml-2"
                    >
                      {visible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                    </Button>
                  </TabsTrigger>
                ))}
              </TabsList>

              {materialPreviews.map(({ category }) => (
                <TabsContent key={category} value={category} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 capitalize">
                      Choose {category}
                    </label>
                    <Select
                      value={selectedMaterials[category]?.toString() || ""}
                      onValueChange={(value) => onMaterialChange(category, Number(value))}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={`Select ${category}...`} />
                      </SelectTrigger>
                      <SelectContent>
                        {getMaterialsByCategory(category).map((material) => (
                          <SelectItem key={material.id} value={material.id.toString()}>
                            <div className="flex items-center justify-between w-full">
                              <span>{material.name}</span>
                              <Badge variant="secondary">
                                ${material.price?.toFixed(2) || '0.00'}/{material.unit}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedMaterials[category] && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      {(() => {
                        const material = materials.find(m => m.id === selectedMaterials[category]);
                        return material ? (
                          <div className="space-y-2">
                            <div className="font-medium">{material.name}</div>
                            <div className="text-sm text-gray-600">{material.description}</div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Color: {material.color}</span>
                              <span className="font-medium">
                                ${material.price?.toFixed(2) || '0.00'}/{material.unit}
                              </span>
                            </div>
                            {material.brand && (
                              <div className="text-sm text-gray-500">
                                Brand: {material.brand}
                              </div>
                            )}
                          </div>
                        ) : null;
                      })()}
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}