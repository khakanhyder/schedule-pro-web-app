import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three-stdlib';

interface KitchenRoom3DProps {
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
  onMaterialQuantityChange?: (category: string, quantity: number) => void;
}

export default function KitchenRoom3D({
  roomLength,
  roomWidth,
  roomHeight,
  selectedMaterials,
  materials,
  onMaterialQuantityChange
}: KitchenRoom3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);

  // Kitchen layout calculations
  const getKitchenLayout = () => {
    const layout = {
      // L-shaped kitchen layout
      cabinetRuns: [
        { // Main wall cabinets
          position: { x: 0, y: 1.5, z: -roomWidth / 2 + 1 },
          dimensions: { width: roomLength * 0.8, height: 3, depth: 2 },
          type: 'wall'
        },
        { // Island or peninsula
          position: { x: 0, y: 1.5, z: 0 },
          dimensions: { width: 6, height: 3, depth: 3 },
          type: 'island'
        }
      ],
      // Countertop areas
      countertops: [
        { // Main countertop
          position: { x: 0, y: 3.1, z: -roomWidth / 2 + 1 },
          dimensions: { width: roomLength * 0.8, height: 0.2, depth: 2.2 },
          area: (roomLength * 0.8) * 2.2 // actual square footage
        },
        { // Island countertop
          position: { x: 0, y: 3.1, z: 0 },
          dimensions: { width: 6, height: 0.2, depth: 3.2 },
          area: 6 * 3.2 // actual square footage
        }
      ],
      // Backsplash areas
      backsplash: [
        {
          position: { x: 0, y: 4.5, z: -roomWidth / 2 + 0.9 },
          dimensions: { width: roomLength * 0.8, height: 1.5, depth: 0.1 },
          area: (roomLength * 0.8) * 1.5 // actual square footage
        }
      ],
      // Flooring area (excluding cabinet footprints)
      floorArea: (roomLength * roomWidth) - ((roomLength * 0.8 * 2) + (6 * 3))
    };

    // Notify parent of actual quantities
    if (onMaterialQuantityChange) {
      const totalCountertopArea = layout.countertops.reduce((sum, ct) => sum + ct.area, 0);
      const totalBacksplashArea = layout.backsplash.reduce((sum, bs) => sum + bs.area, 0);
      
      onMaterialQuantityChange('tiles', totalCountertopArea); // countertops
      onMaterialQuantityChange('backsplash', totalBacksplashArea); // backsplash tiles
      onMaterialQuantityChange('flooring', layout.floorArea);
      onMaterialQuantityChange('cabinets', roomLength * 0.8 + 6); // linear feet
    }

    return layout;
  };

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
    scene.background = new THREE.Color(0xf8f9fa);
    sceneRef.current = scene;

    // Camera positioned for kitchen view
    const camera = new THREE.PerspectiveCamera(
      50,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(15, 12, 15);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setClearColor(0xf8f9fa);
    mountRef.current.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.set(0, 3, 0);

    // Lighting setup for kitchen
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
    mainLight.position.set(10, 15, 10);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    scene.add(mainLight);

    // Kitchen-specific lighting
    const kitchenLight = new THREE.PointLight(0xffffff, 0.5, 20);
    kitchenLight.position.set(0, 8, 0);
    scene.add(kitchenLight);

    // Get kitchen layout
    const layout = getKitchenLayout();

    // Create room group
    const roomGroup = new THREE.Group();

    // Floor with realistic proportions
    const floorGeometry = new THREE.PlaneGeometry(roomLength, roomWidth);
    const floorMaterial = new THREE.MeshLambertMaterial({ 
      color: getMaterialColor('flooring'),
      roughness: 0.8
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
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

    // Right wall
    const rightWall = new THREE.Mesh(
      new THREE.PlaneGeometry(roomWidth, roomHeight),
      wallMaterial
    );
    rightWall.position.set(roomLength / 2, roomHeight / 2, 0);
    rightWall.rotation.y = -Math.PI / 2;
    roomGroup.add(rightWall);

    // Kitchen elements
    const cabinetMaterial = new THREE.MeshLambertMaterial({ 
      color: getMaterialColor('cabinets')
    });

    // Build cabinet runs
    layout.cabinetRuns.forEach((cabinet, index) => {
      const cabinetGeometry = new THREE.BoxGeometry(
        cabinet.dimensions.width,
        cabinet.dimensions.height,
        cabinet.dimensions.depth
      );
      const cabinetMesh = new THREE.Mesh(cabinetGeometry, cabinetMaterial);
      cabinetMesh.position.set(
        cabinet.position.x,
        cabinet.position.y,
        cabinet.position.z
      );
      cabinetMesh.castShadow = true;
      cabinetMesh.receiveShadow = true;
      cabinetMesh.userData = { type: 'cabinet', index };
      roomGroup.add(cabinetMesh);

      // Add cabinet doors/details
      const doorMaterial = new THREE.MeshLambertMaterial({ 
        color: getMaterialColor('cabinets'),
        transparent: true,
        opacity: 0.9
      });

      // Upper cabinets
      if (cabinet.type === 'wall') {
        const upperCabinet = new THREE.Mesh(
          new THREE.BoxGeometry(cabinet.dimensions.width, 2, cabinet.dimensions.depth * 0.6),
          doorMaterial
        );
        upperCabinet.position.set(
          cabinet.position.x,
          cabinet.position.y + 3,
          cabinet.position.z - 0.3
        );
        upperCabinet.castShadow = true;
        roomGroup.add(upperCabinet);
      }
    });

    // Build countertops
    const countertopMaterial = new THREE.MeshLambertMaterial({ 
      color: getMaterialColor('tiles')
    });

    layout.countertops.forEach((countertop, index) => {
      const countertopGeometry = new THREE.BoxGeometry(
        countertop.dimensions.width,
        countertop.dimensions.height,
        countertop.dimensions.depth
      );
      const countertopMesh = new THREE.Mesh(countertopGeometry, countertopMaterial);
      countertopMesh.position.set(
        countertop.position.x,
        countertop.position.y,
        countertop.position.z
      );
      countertopMesh.castShadow = true;
      countertopMesh.receiveShadow = true;
      countertopMesh.userData = { type: 'countertop', index, area: countertop.area };
      roomGroup.add(countertopMesh);
    });

    // Build backsplash
    const backsplashMaterial = new THREE.MeshLambertMaterial({ 
      color: getMaterialColor('backsplash') || getMaterialColor('tiles')
    });

    layout.backsplash.forEach((backsplash, index) => {
      const backsplashGeometry = new THREE.PlaneGeometry(
        backsplash.dimensions.width,
        backsplash.dimensions.height
      );
      const backsplashMesh = new THREE.Mesh(backsplashGeometry, backsplashMaterial);
      backsplashMesh.position.set(
        backsplash.position.x,
        backsplash.position.y,
        backsplash.position.z
      );
      backsplashMesh.userData = { type: 'backsplash', index, area: backsplash.area };
      roomGroup.add(backsplashMesh);
    });

    // Add kitchen appliances for realism
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

    // Mouse interaction for element info
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
          setHoveredElement(object.userData.type);
        }
      } else {
        setHoveredElement(null);
      }
    };

    renderer.domElement.addEventListener('mousemove', onMouseMove);

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
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [roomLength, roomWidth, roomHeight, selectedMaterials, materials]);

  return (
    <div className="relative w-full h-96 bg-gray-50 rounded-lg overflow-hidden border">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
          <div className="text-gray-600">Loading kitchen preview...</div>
        </div>
      )}
      <div ref={mountRef} className="w-full h-full" />
      
      {/* Kitchen-specific controls */}
      <div className="absolute bottom-4 left-4 bg-white bg-opacity-95 px-4 py-2 rounded-md text-sm shadow-lg">
        <div className="space-y-1">
          <p className="font-medium text-gray-800">Kitchen Preview</p>
          <p className="text-gray-600">
            Drag to rotate • Scroll to zoom • Hover for details
          </p>
          {hoveredElement && (
            <p className="text-blue-600 font-medium">
              Hovering: {hoveredElement}
            </p>
          )}
        </div>
      </div>

      {/* Material quantities display */}
      <div className="absolute top-4 right-4 bg-white bg-opacity-95 px-4 py-2 rounded-md text-sm shadow-lg">
        <div className="space-y-1">
          <p className="font-medium text-gray-800">Actual Quantities</p>
          <div className="space-y-1 text-xs">
            <p>Countertops: {((roomLength * 0.8 * 2.2) + (6 * 3.2)).toFixed(1)} sq ft</p>
            <p>Cabinets: {(roomLength * 0.8 + 6).toFixed(1)} linear ft</p>
            <p>Backsplash: {(roomLength * 0.8 * 1.5).toFixed(1)} sq ft</p>
            <p>Flooring: {(roomLength * roomWidth - ((roomLength * 0.8 * 2) + (6 * 3))).toFixed(1)} sq ft</p>
          </div>
        </div>
      </div>
    </div>
  );
}