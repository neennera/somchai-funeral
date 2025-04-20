"use client";
import * as THREE from "three";
import { useEffect, useRef, useState } from "react";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from "three/addons/loaders/MTLLoader.js";
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";

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

    // Setup scene lighting ---------------------
    const light = new THREE.DirectionalLight(0xffffff,0.5);
    light.intensity = 2;
    light.position.set(2, 5, 10);
    light.castShadow = true;
    scene.add(light);
    scene.add(new THREE.AmbientLight(0x8f7553, 0.5));
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Soft light
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    // Setup camera
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const controls = new OrbitControls(camera, renderer.domElement);
    camera.position.set(0, 5, 10);
    camera.layers.enable(1);
    controls.target.set(0, 0, 0);
    controls.update();

    // Render loop --- update render image
    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    }

    // Add objects to the scene

    // Floor ----
    const floorGeometry = new THREE.PlaneGeometry(30, 20);
    const floorMesh = new THREE.Mesh(
      floorGeometry,
      new THREE.MeshLambertMaterial({ color: 0x343336 })
    );
    floorMesh.rotation.x = -Math.PI / 2.0;
    floorMesh.name = "Floor";
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    const mtlLoader = new MTLLoader().setPath('/models/');
    function addObjectToSceen(obj, name, x, y, z, rx = 0, ry = 0, rz = 0, sx = 1, sy = 1, sz = 1) {
      obj.name = name;
      obj.position.set(x, y, z); 
      obj.rotation.set(rx, ry, rz);
      obj.scale.set(sx, sy, sz);
      obj.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
            child.receiveShadow = true;
          child.name = name;
        }
      });
      scene.add(obj); 
    }

    // import objects with mtl
    mtlLoader.load('coffin.mtl', (materials) => {
      materials.preload();
      const coffinLoader = new OBJLoader().setMaterials(materials).setPath('/models/');
      coffinLoader.load('coffin.obj', (obj) => {
        addObjectToSceen(obj, "1", 0, 0, 0);
      });
    });
    
    mtlLoader.load('guitar.mtl', (materials) => {
      materials.preload();
      const guitarLoader = new OBJLoader().setMaterials(materials).setPath('/models/');
      guitarLoader.load('guitar.obj', (obj) => {
        addObjectToSceen(obj, "2", -3.5, -0.2, 2.3, 150, 0, 0, 4, 4, 4);
      });
    });
    
    mtlLoader.load('money.mtl', (materials) => {
      materials.preload();
      const moneyLoader = new OBJLoader().setMaterials(materials).setPath('/models/');
      moneyLoader.load('money.obj', (obj) => {
        addObjectToSceen(obj, "5", 3.7, 0.9, 1, 0, 5, 0, 2, 2, 2);
      });
    });


    // import object with fbx
    function addFBXToScene(filePath, name, x, y, z, rx = 0, ry = 0, rz = 0, sx = 1, sy = 1, sz = 1, defaultColor = 0xffffff) {
      const fbxLoader = new FBXLoader();
      fbxLoader.load(filePath, (fbx) => {
        fbx.name = name;
        fbx.position.set(x, y, z);
        fbx.rotation.set(rx, ry, rz);
        fbx.scale.set(sx, sy, sz);
        fbx.traverse((child) => {
          if (child.isMesh) {
            
            child.castShadow = true;
            child.receiveShadow = true;
            if (!child.material.map) {
              child.material = new THREE.MeshLambertMaterial({ color: defaultColor }); 
            }
            child.name = name;
          }
        });
        scene.add(fbx);
      });
    }
    addFBXToScene("/models/plant.fbx", "4", 5, 0, 1,0,0,0,0.002,0.002,0.002,0x499e6e);
    addFBXToScene("/models/noodle.fbx", "3",0, 1, 0,0,0,0,0.007,0.007,0.007,0xffffff);
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