import { Component, ElementRef, ViewChild } from "@angular/core";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

@Component({
  selector: "app-particals",
  standalone: true,
  imports: [],
  templateUrl: "./particals.component.html",
  styleUrl: "./particals.component.css",
})
export class ParticalsComponent {
  @ViewChild("canvas", { static: true })
  canvasRef!: ElementRef<HTMLCanvasElement>;

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    //create a scene----------------------------------------
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("black");

    //debugger dat.ui-------------------------------------------

    //adding light-------------------------------------------
    //few matreial require light to be visible
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(2, 3, 4);
    scene.add(ambientLight, pointLight);

    //texture loader-------------------------------------------
    const loadingManager = new THREE.LoadingManager();

    const loader = new THREE.TextureLoader();
    const texture = loader.load("../../../assets/textures/snowflake_dark.png");

    // scene.background = textureCube;
    loadingManager.onStart = () => {
      console.log("loading started");
    };
    loadingManager.onLoad = () => {
      console.log("loading completed");
    };
    loadingManager.onProgress = () => {
      console.log("loading in progress");
    };
    loadingManager.onError = () => {
      console.log("loading error");
    };

    //create a object(MESH==geometry and material)----------------------------------------
    const geometry = new THREE.BufferGeometry();
    const vertices = 15000;
    const positions = new Float32Array(vertices * 3);
    for (let i = 0; i < vertices * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 5;
    }
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({});
    material.size = 0.05;
    material.transparent = true;
    material.alphaMap = texture;
    material.depthTest = false;
    const mesh = new THREE.Points(geometry, material);
    scene.add(mesh);

    //create a camera------------------------------------------
    const aspect = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    const camera = new THREE.PerspectiveCamera(
      75,
      aspect.width / aspect.height,
      0.01,
      100
    );
    camera.position.z = 5;

    //create a renderer-------------------------------------------
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true }); //add canvas to renderer
    renderer.setSize(aspect.width, aspect.height); //set size of renderer

    //orbit controls-----------------------------------------------
    const orbitcontrols = new OrbitControls(camera, canvas);
    orbitcontrols.dampingFactor = 0.2;

    orbitcontrols.autoRotateSpeed = 0.5;
    orbitcontrols.autoRotate = true;

    //create a animate function------------------------------------
    const clock = new THREE.Clock();
    let zoomDirection = 1; // 1 for zooming in, -1 for zooming out

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();
      requestAnimationFrame(animate);
      //we can move particle by changing position of geometry
      // we are moving camera for performance
      orbitcontrols.update();
      // Automatic zoom in and out
      camera.position.z += zoomDirection * 0.02;
      if (camera.position.z >= 5) {
        zoomDirection = -1; // Reverse to zoom out
      } else if (camera.position.z <= -5) {
        zoomDirection = 1; // Reverse to zoom in
      }
      console.log(camera.position.z);
      renderer.render(scene, camera); //render the scene
    };
    animate();

    //resize canvas---------------

    window.addEventListener("resize", () => {
      //update sizes
      aspect.width = window.innerWidth;
      aspect.height = window.innerHeight;
      //update camera
      camera.aspect = aspect.width / aspect.height;
      camera.updateProjectionMatrix();
      //update renderer
      renderer.setSize(aspect.width, aspect.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); //for retina display
    });
  }
}
