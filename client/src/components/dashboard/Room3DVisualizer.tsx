import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three-stdlib';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Palette, Camera, Eye, EyeOff, Ruler, Navigation, StickyNote, Move3D, Calculator } from 'lucide-react';
import type { RoomMaterial } from '@shared/schema';

interface Room3DVisualizerProps {
  roomLength: number;
  roomWidth: number;
  roomHeight: number;
  doorPosition: string;
  doorWidth: number;
  projectType?: string;
  onRoomChange: (dimensions: { length: number; width: number; height: number }) => void;
  onDoorChange: (doorPosition: string, doorWidth: number) => void;
  selectedMaterials: Record<string, number>;
  onMaterialChange: (category: string, materialId: number) => void;
  materials: RoomMaterial[];
}

export default function Room3DVisualizer({
  roomLength = 12,
  roomWidth = 10,
  roomHeight = 9,
  doorPosition = 'front',
  doorWidth = 3,
  projectType = 'custom',
  onRoomChange,
  onDoorChange,
  selectedMaterials,
  onMaterialChange,
  materials
}: Room3DVisualizerProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isClientView, setIsClientView] = useState(false);
  
  // Measurement and annotation states
  const [measurementMode, setMeasurementMode] = useState(false);
  const [walkthroughMode, setWalkthroughMode] = useState(false);
  const [annotationMode, setAnnotationMode] = useState(false);
  const [measurements, setMeasurements] = useState<Array<{
    id: string;
    start: THREE.Vector3;
    end: THREE.Vector3;
    distance: number;
    label: string;
  }>>([]);
  const [annotations, setAnnotations] = useState<Array<{
    id: string;
    position: THREE.Vector3;
    note: string;
    type: 'issue' | 'note' | 'progress';
  }>>([]);
  const [measurementPoints, setMeasurementPoints] = useState<THREE.Vector3[]>([]);
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2());
  const [isDraggingDoor, setIsDraggingDoor] = useState(false);
  const [doorObject, setDoorObject] = useState<THREE.Group | null>(null);

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
    camera.position.set(25, 20, 25);

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

    // Add click event listener for measurements and annotations
    const canvas = renderer.domElement;
    canvas.addEventListener('click', handleCanvasClick);

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
        renderer.domElement.removeEventListener('click', handleCanvasClick);
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
  }, [roomLength, roomWidth, roomHeight, doorPosition, doorWidth]);

  // Update materials when selection changes
  useEffect(() => {
    if (sceneRef.current) {
      // Clear existing room
      const roomObjects = sceneRef.current.children.filter(child => 
        child.userData.isRoom
      );
      roomObjects.forEach(obj => sceneRef.current?.remove(obj));

      // Create new room with updated materials
      createRoom(sceneRef.current, roomLength, roomWidth, roomHeight);
    }
  }, [selectedMaterials]);

  // Update cursor style for measurement and annotation modes
  useEffect(() => {
    if (rendererRef.current) {
      const canvas = rendererRef.current.domElement;
      canvas.style.cursor = measurementMode || annotationMode ? 'crosshair' : 'default';
    }
  }, [measurementMode, annotationMode]);

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
    roomGroup.add(backWall);

    // Front wall (partial for visibility)
    const frontWallGeometry = new THREE.PlaneGeometry(length, height);
    const frontWall = new THREE.Mesh(frontWallGeometry, wallMaterial.clone());
    frontWall.material.opacity = 0.3;
    frontWall.position.set(0, height / 2, width / 2);
    frontWall.rotation.y = Math.PI;
    roomGroup.add(frontWall);

    // Left wall
    const leftWallGeometry = new THREE.PlaneGeometry(width, height);
    const leftWall = new THREE.Mesh(leftWallGeometry, wallMaterial);
    leftWall.position.set(-length / 2, height / 2, 0);
    leftWall.rotation.y = Math.PI / 2;
    roomGroup.add(leftWall);

    // Right wall
    const rightWallGeometry = new THREE.PlaneGeometry(width, height);
    const rightWall = new THREE.Mesh(rightWallGeometry, wallMaterial);
    rightWall.position.set(length / 2, height / 2, 0);
    rightWall.rotation.y = -Math.PI / 2;
    roomGroup.add(rightWall);

    // Add kitchen-specific elements for kitchen projects
    if (projectType === 'kitchen') {
      addKitchenElements(roomGroup, length, width, height);
    }

    // Create door
    const door = createDoor(length, width, height, doorPosition, doorWidth);
    roomGroup.add(door);
    setDoorObject(door);

    scene.add(roomGroup);
  };

  const addKitchenElements = (roomGroup: THREE.Group, length: number, width: number, height: number) => {
    // Kitchen Island
    const islandGeometry = new THREE.BoxGeometry(4, 3, 2);
    const islandMaterial = new THREE.MeshLambertMaterial({ 
      color: getColorForCategory('cabinets') || 0x8B4513
    });
    const island = new THREE.Mesh(islandGeometry, islandMaterial);
    island.position.set(0, 1.5, 0);
    island.castShadow = true;
    roomGroup.add(island);

    // Counter along back wall
    const counterGeometry = new THREE.BoxGeometry(length * 0.8, 3, 2);
    const counterMaterial = new THREE.MeshLambertMaterial({ 
      color: getColorForCategory('cabinets') || 0x8B4513
    });
    const counter = new THREE.Mesh(counterGeometry, counterMaterial);
    counter.position.set(0, 1.5, -width / 2 + 1);
    counter.castShadow = true;
    roomGroup.add(counter);

    // Countertop
    const countertopGeometry = new THREE.BoxGeometry(length * 0.8, 0.2, 2.2);
    const countertopMaterial = new THREE.MeshLambertMaterial({ 
      color: getColorForCategory('tiles') || 0xF8F8FF
    });
    const countertop = new THREE.Mesh(countertopGeometry, countertopMaterial);
    countertop.position.set(0, 3.1, -width / 2 + 1);
    countertop.castShadow = true;
    roomGroup.add(countertop);

    // Upper cabinets
    const upperCabGeometry = new THREE.BoxGeometry(length * 0.6, 2, 1.5);
    const upperCabMaterial = new THREE.MeshLambertMaterial({ 
      color: getColorForCategory('cabinets') || 0x8B4513
    });
    const upperCab = new THREE.Mesh(upperCabGeometry, upperCabMaterial);
    upperCab.position.set(0, 6, -width / 2 + 0.75);
    upperCab.castShadow = true;
    roomGroup.add(upperCab);

    // Appliances (refrigerator)
    const fridgeGeometry = new THREE.BoxGeometry(2.5, 6, 2.5);
    const fridgeMaterial = new THREE.MeshLambertMaterial({ 
      color: getColorForCategory('fixtures') || 0xC0C0C0
    });
    const fridge = new THREE.Mesh(fridgeGeometry, fridgeMaterial);
    fridge.position.set(length / 2 - 1.5, 3, -width / 2 + 1.25);
    fridge.castShadow = true;
    roomGroup.add(fridge);
  };

  const createDoor = (roomLength: number, roomWidth: number, roomHeight: number, position: string, width: number): THREE.Group => {
    const doorGroup = new THREE.Group();
    doorGroup.userData.isDoor = true;

    // Door frame
    const frameGeometry = new THREE.BoxGeometry(width, roomHeight * 0.8, 0.1);
    const frameMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
    const doorFrame = new THREE.Mesh(frameGeometry, frameMaterial);
    
    // Door panel
    const panelGeometry = new THREE.BoxGeometry(width * 0.9, roomHeight * 0.75, 0.08);
    const panelMaterial = new THREE.MeshLambertMaterial({ color: 0xD2B48C });
    const doorPanel = new THREE.Mesh(panelGeometry, panelMaterial);
    
    // Door handle
    const handleGeometry = new THREE.SphereGeometry(0.1, 8, 8);
    const handleMaterial = new THREE.MeshLambertMaterial({ color: 0xFFD700 });
    const doorHandle = new THREE.Mesh(handleGeometry, handleMaterial);
    doorHandle.position.set(width * 0.35, 0, 0.1);

    // Add shadow casting for realism
    doorFrame.castShadow = true;
    doorPanel.castShadow = true;
    doorHandle.castShadow = true;

    doorGroup.add(doorFrame);
    doorGroup.add(doorPanel);
    doorGroup.add(doorHandle);

    // Position door based on wall selection
    switch (position) {
      case 'front':
        doorGroup.position.set(0, roomHeight * 0.4, roomWidth / 2);
        doorGroup.rotation.y = Math.PI;
        break;
      case 'back':
        doorGroup.position.set(0, roomHeight * 0.4, -roomWidth / 2);
        break;
      case 'left':
        doorGroup.position.set(-roomLength / 2, roomHeight * 0.4, 0);
        doorGroup.rotation.y = Math.PI / 2;
        break;
      case 'right':
        doorGroup.position.set(roomLength / 2, roomHeight * 0.4, 0);
        doorGroup.rotation.y = -Math.PI / 2;
        break;
    }

    return doorGroup;
  };

  const getColorForCategory = (category: string): number => {
    const material = materials.find(m => 
      m.id === selectedMaterials[category] && m.category === category
    );
    
    if (material) {
      const colorMap: Record<string, number> = {
        // Flooring Colors
        'White Oak Engineered': 0xF5E6D3,
        'European Oak Wide Plank': 0xD4A574,
        'Walnut Luxury Vinyl': 0x6B4423,
        'Hickory Hardwood': 0xC49A73,
        'Bamboo Strand Woven': 0xE8D5A3,
        'Maple Hardwood': 0xF2E4C7,
        'Oak Hardwood': 0xD2B48C,
        
        // Paint Colors
        'Sage Green': 0x87A96B,
        'Warm Beige': 0xE8DCC0,
        'Soft Blue': 0xA8C5D1,
        'Classic White': 0xFFFFFF,
        'Charcoal Gray': 0x4A5568,
        'Terracotta': 0xCC7A6B,
        'Warm White': 0xFFFDD0,
        
        // Countertop Colors
        'Calacatta Quartz': 0xF8F6F0,
        'Carrara Marble': 0xE8E8E8,
        'Granite Midnight': 0x2D3748,
        'Butcher Block': 0xD69E2E,
        'Concrete Gray': 0xA0AEC0,
        'Quartzite White': 0xF7FAFC,
        'Carrara White': 0xF8F8FF,
        
        // Cabinet Colors
        'Espresso': 0x3C2414,
        'Shaker White': 0xF7FAFC,
        'Navy Blue': 0x2B6CB0,
        'Sage Cabinet': 0x68A063,
        'Gray Stain': 0x6B7280,
        'Natural Wood': 0xC49A73,
        'Rustic Brown': 0x8B4513,
        
        // Fixture Colors
        'Brushed Gold': 0xD4AF37,
        'Matte Black': 0x1A202C,
        'Brushed Nickel': 0xC5C7C7,
        'Chrome': 0xE2E8F0,
        'Oil Rubbed Bronze': 0x4A5568,
        'Brass': 0xB7791F,
        
        // Tile Colors
        'Subway White': 0xF7FAFC,
        'Marble Hexagon': 0xE2E8F0,
        'Travertine Beige': 0xD6BCB1,
        'Porcelain Gray': 0x9CA3AF,
        'Natural Stone': 0x8B7355,
        'Ceramic Black': 0x2D3748,
        
        // Legacy colors
        'Ocean Blue': 0x4682B4,
        'Charcoal': 0x36454F
      };
      return colorMap[material.name] || 0xCCCCCC;
    }
    
    return category === 'flooring' ? 0xD2B48C : 0xFFFFFF;
  };

  const getMaterialsByCategory = (category: string) => {
    return materials.filter(m => m.category === category);
  };

  const getMaterialColor = (materialName: string): string => {
    const colorMap: Record<string, string> = {
      // Flooring Colors (2024 Trends)
      'White Oak Engineered': '#F5E6D3',
      'European Oak Wide Plank': '#D4A574',
      'Walnut Luxury Vinyl': '#6B4423',
      'Hickory Hardwood': '#C49A73',
      'Bamboo Strand Woven': '#E8D5A3',
      'Maple Hardwood': '#F2E4C7',
      
      // Paint Colors (2024 Trends)
      'Sage Green': '#87A96B',
      'Warm Beige': '#E8DCC0',
      'Soft Blue': '#A8C5D1',
      'Classic White': '#FFFFFF',
      'Charcoal Gray': '#4A5568',
      'Terracotta': '#CC7A6B',
      
      // Countertop Colors
      'Calacatta Quartz': '#F8F6F0',
      'Carrara Marble': '#E8E8E8',
      'Granite Midnight': '#2D3748',
      'Butcher Block': '#D69E2E',
      'Concrete Gray': '#A0AEC0',
      'Quartzite White': '#F7FAFC',
      
      // Tile Colors
      'Subway White': '#F7FAFC',
      'Marble Hexagon': '#E2E8F0',
      'Travertine Beige': '#D6BCB1',
      'Porcelain Gray': '#9CA3AF',
      'Natural Stone': '#8B7355',
      'Ceramic Black': '#2D3748',
      
      // Fixture Colors
      'Brushed Gold': '#D4AF37',
      'Matte Black': '#1A202C',
      'Brushed Nickel': '#C5C7C7',
      'Chrome': '#E2E8F0',
      'Oil Rubbed Bronze': '#4A5568',
      'Brass': '#B7791F',
      
      // Cabinet Colors
      'Espresso': '#3C2414',
      'Shaker White': '#F7FAFC',
      'Navy Blue': '#2B6CB0',
      'Sage Cabinet': '#68A063',
      'Gray Stain': '#6B7280',
      'Natural Wood': '#C49A73'
    };
    return colorMap[materialName] || '#D1D5DB';
  };

  // Measurement and annotation functions
  const addMeasurementLine = (start: THREE.Vector3, end: THREE.Vector3, scene: THREE.Scene) => {
    const distance = start.distanceTo(end);
    const geometry = new THREE.BufferGeometry().setFromPoints([start, end]);
    const material = new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 3 });
    const line = new THREE.Line(geometry, material);
    
    // Add measurement label
    const midPoint = start.clone().add(end).divideScalar(2);
    const labelGeometry = new THREE.PlaneGeometry(2, 0.5);
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 64;
    const context = canvas.getContext('2d')!;
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#000000';
    context.font = '24px Arial';
    context.textAlign = 'center';
    context.fillText(`${distance.toFixed(2)} ft`, canvas.width / 2, canvas.height / 2 + 8);
    
    const texture = new THREE.CanvasTexture(canvas);
    const labelMaterial = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
    const labelMesh = new THREE.Mesh(labelGeometry, labelMaterial);
    labelMesh.position.copy(midPoint);
    labelMesh.lookAt(0, 0, 0);
    
    scene.add(line);
    scene.add(labelMesh);
    
    return { line, label: labelMesh, distance };
  };

  const addAnnotation = (position: THREE.Vector3, note: string, type: 'issue' | 'note' | 'progress', scene: THREE.Scene) => {
    const geometry = new THREE.SphereGeometry(0.2, 8, 8);
    const color = type === 'issue' ? 0xff0000 : type === 'progress' ? 0x00ff00 : 0x0000ff;
    const material = new THREE.MeshBasicMaterial({ color });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.copy(position);
    
    // Add note label
    const labelGeometry = new THREE.PlaneGeometry(4, 1);
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const context = canvas.getContext('2d')!;
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#000000';
    context.font = '20px Arial';
    context.textAlign = 'center';
    context.fillText(note, canvas.width / 2, canvas.height / 2 + 6);
    
    const texture = new THREE.CanvasTexture(canvas);
    const labelMaterial = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
    const labelMesh = new THREE.Mesh(labelGeometry, labelMaterial);
    labelMesh.position.copy(position);
    labelMesh.position.y += 1;
    labelMesh.lookAt(0, 0, 0);
    
    scene.add(sphere);
    scene.add(labelMesh);
    
    return { marker: sphere, label: labelMesh };
  };

  const handleCanvasClick = (event: MouseEvent) => {
    if (!sceneRef.current || !rendererRef.current) return;

    const canvas = rendererRef.current.domElement;
    const rect = canvas.getBoundingClientRect();
    
    mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    
    raycasterRef.current.setFromCamera(mouseRef.current, new THREE.PerspectiveCamera(75, rect.width / rect.height, 0.1, 1000));
    
    // Find intersection with room surfaces
    const intersects = raycasterRef.current.intersectObjects(sceneRef.current.children, true);
    
    if (intersects.length > 0) {
      const point = intersects[0].point;
      
      if (measurementMode) {
        const newPoints = [...measurementPoints, point];
        setMeasurementPoints(newPoints);
        
        if (newPoints.length === 2) {
          const { distance } = addMeasurementLine(newPoints[0], newPoints[1], sceneRef.current);
          const newMeasurement = {
            id: Date.now().toString(),
            start: newPoints[0],
            end: newPoints[1],
            distance,
            label: `${distance.toFixed(2)} ft`
          };
          setMeasurements(prev => [...prev, newMeasurement]);
          setMeasurementPoints([]);
        }
      } else if (annotationMode) {
        const note = prompt('Enter note:');
        if (note) {
          const type = prompt('Type (issue/note/progress):') as 'issue' | 'note' | 'progress' || 'note';
          addAnnotation(point, note, type, sceneRef.current);
          const newAnnotation = {
            id: Date.now().toString(),
            position: point,
            note,
            type
          };
          setAnnotations(prev => [...prev, newAnnotation]);
        }
      }
    }
  };

  const enableWalkthroughMode = () => {
    if (controlsRef.current) {
      controlsRef.current.enablePan = true;
      controlsRef.current.enableRotate = true;
      controlsRef.current.enableZoom = true;
      controlsRef.current.maxPolarAngle = Math.PI / 2.1; // Prevent going underground
      controlsRef.current.minDistance = 2;
      controlsRef.current.maxDistance = 30;
    }
  };

  const disableWalkthroughMode = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  return (
    <div className="space-y-6">
      {/* Client Presentation Mode Toggle */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button
            variant={isClientView ? "default" : "outline"}
            size="sm"
            onClick={() => setIsClientView(!isClientView)}
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            {isClientView ? 'Exit Client View' : 'Client Presentation'}
          </Button>
        </div>
        
        {isDraggingDoor && (
          <div className="bg-blue-500 text-white px-3 py-2 rounded-lg shadow-lg text-sm">
            🔄 Positioning Door - Release to Place
          </div>
        )}
      </div>

      {/* 3D Viewer */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            3D Room Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            ref={mountRef}
            className={`w-full ${isClientView ? 'h-[700px]' : 'h-[550px]'} bg-gray-50 rounded-lg border relative transition-all duration-300`}
          >
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-gray-500">Loading 3D preview...</div>
              </div>
            )}
            
            {/* Client View Overlay */}
            {isClientView && (
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                <h3 className="font-semibold text-gray-800 mb-2">Your Project Preview</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>Room: {roomLength} × {roomWidth} × {roomHeight} ft</div>
                  <div>Floor Area: {roomLength * roomWidth} sq ft</div>
                  <div>Door: {doorWidth} ft wide ({doorPosition} wall)</div>
                </div>
              </div>
            )}
          </div>
          
          {/* Room Dimension Controls */}
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="length">Length (ft)</Label>
                <Input
                  id="length"
                  type="number"
                  min="8"
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
                  min="8"
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
                  min="8"
                  max="12"
                  value={roomHeight}
                  onChange={(e) => onRoomChange({ 
                    length: roomLength, 
                    width: roomWidth, 
                    height: Number(e.target.value) 
                  })}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="doorPosition">Door Position</Label>
                <Select
                  value={doorPosition}
                  onValueChange={(value) => onDoorChange(value, doorWidth)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="front">Front Wall</SelectItem>
                    <SelectItem value="back">Back Wall</SelectItem>
                    <SelectItem value="left">Left Wall</SelectItem>
                    <SelectItem value="right">Right Wall</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="doorWidth">Door Width (ft)</Label>
                <Input
                  id="doorWidth"
                  type="number"
                  min="2"
                  max="5"
                  step="0.5"
                  value={doorWidth}
                  onChange={(e) => onDoorChange(doorPosition, Number(e.target.value))}
                />
              </div>
            </div>
          </div>
          
          <div className="mt-4 text-center p-3 bg-green-50 rounded-lg">
            <p className="text-sm text-green-700">
              💡 <strong>Interactive Controls:</strong> Use mouse to rotate and zoom the 3D view. Adjust room dimensions and door placement using the controls above.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Material Selection - Hidden in Client View */}
      {!isClientView && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Material Selection</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant={measurementMode ? "default" : "outline"}
                    onClick={() => {
                      setMeasurementMode(!measurementMode);
                      setAnnotationMode(false);
                    }}
                    className="flex items-center gap-1"
                    size="sm"
                  >
                    <Ruler className="h-3 w-3" />
                    Measure
                  </Button>
                  
                  <Button
                    variant={annotationMode ? "default" : "outline"}
                    onClick={() => {
                      setAnnotationMode(!annotationMode);
                      setMeasurementMode(false);
                    }}
                    className="flex items-center gap-1"
                    size="sm"
                  >
                    <StickyNote className="h-3 w-3" />
                    Notes
                  </Button>
                  
                  <Button
                    variant={walkthroughMode ? "default" : "outline"}
                    onClick={() => {
                      setWalkthroughMode(!walkthroughMode);
                      if (!walkthroughMode) {
                        enableWalkthroughMode();
                      } else {
                        disableWalkthroughMode();
                      }
                    }}
                    className="flex items-center gap-1"
                    size="sm"
                  >
                    <Navigation className="h-3 w-3" />
                    Walkthrough
                  </Button>
                </div>
              </CardTitle>
              <div className="text-sm text-gray-600">
                {measurementMode ? 'Click two points in the 3D view to measure distances' : 
                 annotationMode ? 'Click in the 3D view to add project notes' : 
                 'Click material swatches to see real-time changes'}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['flooring', 'paint', 'tiles', 'fixtures', 'cabinets'].map((category) => (
                  <div key={category} className="space-y-2">
                    <Label className="capitalize font-medium">{category}</Label>
                    
                    {/* Visual Material Swatches */}
                    <div className="grid grid-cols-3 gap-2 mb-2">
                      {getMaterialsByCategory(category).slice(0, 6).map((material) => (
                        <button
                          key={material.id}
                          onClick={() => onMaterialChange(category, material.id)}
                          className={`p-2 rounded-lg border-2 transition-all ${
                            selectedMaterials[category] === material.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div 
                            className="w-full h-8 rounded mb-1"
                            style={{ backgroundColor: getMaterialColor(material.name) }}
                          />
                          <div className="text-xs font-medium truncate">{material.name}</div>
                          <div className="text-xs text-gray-500">${material.price?.toFixed(0) || '0'}</div>
                        </button>
                      ))}
                    </div>

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
                            {material.name} - ${material.price?.toFixed(2) || '0.00'}/{material.unit}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Project Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-gray-50 p-3 rounded">
                    <strong>Dimensions:</strong><br />
                    {roomLength} × {roomWidth} × {roomHeight} ft
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <strong>Floor Area:</strong><br />
                    {roomLength * roomWidth} sq ft
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <strong>Door:</strong><br />
                    {doorWidth} ft ({doorPosition} wall)
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <strong>Wall Area:</strong><br />
                    {2 * (roomLength + roomWidth) * roomHeight} sq ft
                  </div>
                </div>

                {/* Measurements Summary */}
                {measurements.length > 0 && (
                  <div className="border-t pt-3">
                    <div className="font-semibold flex items-center gap-2 mb-2">
                      <Ruler className="h-4 w-4" />
                      Measurements ({measurements.length})
                    </div>
                    <div className="space-y-1">
                      {measurements.map((measurement, index) => (
                        <div key={measurement.id} className="flex justify-between text-sm bg-blue-50 p-2 rounded">
                          <span>Measurement {index + 1}:</span>
                          <span className="font-mono font-semibold">{measurement.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Annotations Summary */}
                {annotations.length > 0 && (
                  <div className="border-t pt-3">
                    <div className="font-semibold flex items-center gap-2 mb-2">
                      <StickyNote className="h-4 w-4" />
                      Project Notes ({annotations.length})
                    </div>
                    <div className="space-y-2">
                      {annotations.map((annotation, index) => (
                        <div key={annotation.id} className="text-sm bg-gray-50 p-2 rounded">
                          <div className="flex items-center gap-2 mb-1">
                            <div className={`w-2 h-2 rounded-full ${
                              annotation.type === 'issue' ? 'bg-red-500' : 
                              annotation.type === 'progress' ? 'bg-green-500' : 
                              'bg-blue-500'
                            }`} />
                            <span className="font-medium capitalize">{annotation.type}</span>
                          </div>
                          <div className="text-gray-600 ml-4">{annotation.note}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Client View Summary */}
      {isClientView && (
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Project Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{roomLength * roomWidth}</div>
                  <div className="text-sm text-blue-600">Square Feet</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{roomLength}×{roomWidth}</div>
                  <div className="text-sm text-green-600">Room Dimensions</div>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  Use your mouse to rotate and zoom the 3D preview above to see your project from all angles
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}