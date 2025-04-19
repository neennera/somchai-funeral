"use client";
import * as THREE from "three";
import { useEffect, useRef, useState } from "react";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

export default function TestThreeScene({ setPopupId }) {
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);

  useEffect(() => {
    // Setup the renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true }); // bg transparent
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;

    // Append renderer to the container
    const container = containerRef.current;
    container.appendChild(renderer.domElement);

    // Create a new scene
    const scene = new THREE.Scene();

    // Setup scene lighting
    const light = new THREE.DirectionalLight(0xfff8e3,0.5);
    light.intensity = 2;
    light.position.set(2, 5, 10);
    light.castShadow = true;
    scene.add(light);
    scene.add(new THREE.AmbientLight(0x8f7553, 0.5));

    // Setup camera
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const controls = new OrbitControls(camera, renderer.domElement);
    camera.position.set(-5, 5, 10);
    camera.layers.enable(1);
    controls.target.set(-1, 2, 0);
    controls.update();

    // Render loop --- update render image
    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    }

    // Add objects to the scene
    const floorGeometry = new THREE.PlaneGeometry(30, 20);


    const floorMesh = new THREE.Mesh(
      floorGeometry,
      new THREE.MeshLambertMaterial({ color: 0x343336 })
    );
    floorMesh.rotation.x = -Math.PI / 2.0;
    floorMesh.name = "Floor";
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    function createMesh(geometry, material, x, y, z, name, layer) {
      const mesh = new THREE.Mesh(geometry, material.clone());
      mesh.position.set(x, y, z);
      mesh.name = name;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.layers.set(layer);
      return mesh;
    }

    function addObjectToSceens(obj, name, colorChoice, x, y, z, rx = 0, ry = 0, rz = 0, sx = 1, sy = 1, sz = 1) {
      console.log(colorChoice);
      obj.name = name;
      obj.position.set(x, y, z); 
      obj.rotation.set(rx, ry, rz);
      obj.scale.set(sx, sy, sz);
      const brownMaterial = new THREE.MeshLambertMaterial({ color : parseInt(colorChoice, 16) });
      obj.traverse((child) => {
        if (child.isMesh) {
          child.material = brownMaterial; 
          child.name = name; 
        }
      });
      scene.add(obj); 
    }

    // import objects
    const loader = new OBJLoader().setPath('/models/');
    loader.load('coffin.obj', (obj) => { addObjectToSceens(obj, "1", "0x8B4513",0, 0, 0)})
    loader.load('guitar.obj', (obj) => { addObjectToSceens(obj, "2", "0xb07768",-3.5, -0.2, 2.3,150,0,0,4,4,4)})
    loader.load('money.obj', (obj) => { addObjectToSceens(obj, "5", "0xb75fd4",3.7, 0.9, 1, 0,5,0,2, 2, 2)})
    loader.load('noodle.obj', (obj) => { addObjectToSceens(obj, "3", "0x9619e",0, 1, 0,0,0,0,0.8,0.8,0.8)})
    loader.load('plant.obj', (obj) => { addObjectToSceens(obj, "4", "0x499e6e",5, 0, 1)})
    setLoading(false);

    // Raycaster for click -------------
    const raycaster = new THREE.Raycaster();
    document.addEventListener("mousedown", onMouseDown);

    // The position in Three.js is [-1, 1] ; cast it from box
    function onMouseDown(event) {
      const coords = new THREE.Vector2(
        (event.clientX / renderer.domElement.clientWidth) * 2 - 1,
        -((event.clientY / renderer.domElement.clientHeight) * 2 - 1)
      );

      raycaster.setFromCamera(coords, camera);

      const intersections = raycaster.intersectObjects(scene.children, true);
      if (intersections.length > 0) {
        const selectedObject = intersections[0].object;
        console.log(`${selectedObject.name} was clicked!`);
        setPopupId(parseInt(selectedObject.name))
      }
    }

    // Start animation
    animate();

    // Cleanup on component unmount
    return () => {
      container.removeChild(renderer.domElement);
      document.removeEventListener("mousedown", onMouseDown);
    };
  }, []);

   
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
        {
          loading &&
          <div className="w-full h-full flex items-center justify-center flex-col space-y-2">
              <p>กำลังใช้เวลาโหลดภาพ...</p>
              <p>อาจจะใช้เวลานานราวหนึ่งนาที เนื่องจาก deploy บนเซิร์ฟฟรีที่มีลิมิต</p>
              <div className="mt-5 w-5 h-5 rounded-full bg-white animate-bounce"></div>
          </div>
        }
        <div ref={containerRef} className="w-full h-full overflow-hidden"></div>
      </div>
    );
 
}