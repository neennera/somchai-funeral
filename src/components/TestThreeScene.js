"use client";
import * as THREE from "three";
import { useEffect, useRef } from "react";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { parseAppSegmentConfig } from "next/dist/build/segment-config/app/app-segment-config";

export default function TestThreeScene({setPopupId}) {
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
    camera.position.set(-5, 5, 12);
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
    const boxGeometry = new THREE.BoxGeometry(2, 2, 2);
    const cylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, 2);
    const material = new THREE.MeshLambertMaterial();

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

    const cylinders = new THREE.Group();
    cylinders.add(createMesh(cylinderGeometry, material, 3, 1, 0, "1", 0));
    cylinders.add(createMesh(cylinderGeometry, material, 4.2, 1, 0, "2", 0));
    cylinders.add(createMesh(cylinderGeometry, material, 3.6, 3, 0, "3", 0));
    scene.add(cylinders);

    const boxes = new THREE.Group();
    boxes.add(createMesh(boxGeometry, material, -1, 1, 0, "4", 0));
    boxes.add(createMesh(boxGeometry, material, -4, 1, 0, "5", 0));
    boxes.add(createMesh(boxGeometry, material, -2.5, 3, 0, "6", 0));
    scene.add(boxes);

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
        // const color = new THREE.Color(Math.random(), Math.random(), Math.random());
        // selectedObject.material.color = color;
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

  return <div ref={containerRef} className="w-full h-full overflow-hidden"></div>;
}