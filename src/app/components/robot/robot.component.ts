import { Component, ElementRef, ViewChild } from "@angular/core";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { NavbarComponent } from "../navbar/navbar.component";

@Component({
  selector: "app-robot",
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NavbarComponent],
  templateUrl: "./robot.component.html",
  styleUrl: "./robot.component.css",
})
export class RobotComponent {
  @ViewChild("canvas", { static: true })
  canvasRef!: ElementRef<HTMLCanvasElement>;
  private mixer!: THREE.AnimationMixer;
  clock = new THREE.Clock();
  cabeza!: THREE.Group<THREE.Object3DEventMap>;

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;

    //create a scene----------------------------------------
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("black");

    const directionalLight = new THREE.AmbientLight();
    directionalLight.castShadow = true;
    directionalLight.intensity = 1;
    scene.add(directionalLight);

    const lighting = new THREE.DirectionalLight();
    lighting.position.set(0, 0, 10);
    lighting.castShadow = true;
    lighting.intensity = 1;
    scene.add(lighting);

    // const datGui = new dat.GUI();
    // datGui.add(directionalLight, 'intensity', 0, 1, 0.1).step(0.1);
    // datGui.add(directionalLight, 'distance', 0, 100, 1).step(1);
    // datGui.add(directionalLight, 'angle', 0, Math.PI, 0.1).step(0.1);
    // datGui.add(directionalLight, 'position', -100, 100, 1).step(1);

    // //texture loader----------------------------------------
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(
      "../../../assets/textures/robo_rusty.jpeg"
    );

    //particals-----------------------------
    const particalGeometry = new THREE.BufferGeometry();
    const vertices = 9000;
    const positions = new Float32Array(vertices * 3);
    for (let i = 0; i < vertices * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 50;
    }
    particalGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    const particalMaterial = new THREE.PointsMaterial({});
    particalMaterial.size = 0.005;
    particalMaterial.transparent = true;
    //particalMaterial.alphaMap = texture;
    particalMaterial.blendColor = new THREE.Color("white");
    particalMaterial.depthTest = false;
    const particalMesh = new THREE.Points(particalGeometry, particalMaterial);
    scene.add(particalMesh);

    //load the model----------------------------------------
    const loader = new GLTFLoader();

    loader.load(
      // resource URL
      "../../../assets/robo_fix/fight_robo.gltf",
      // called when the resource is loaded

      (gltf) => {
        // Use an arrow function here
        const model = gltf.scene;
        // model.lookAt(0, 0, 0);
        this.cabeza = model;

        console.log("----------------------");
        model.castShadow = true;
        model.position.set(0, 0, 0);
        model.scale.set(0.5, 0.5, 0.5);
        scene.add(model);

        this.mixer = new THREE.AnimationMixer(model);

        if (gltf.animations && gltf.animations.length > 0) {
          gltf.animations.forEach((clip) => {
            console.log("clipName: ", clip.name);
            this.mixer.clipAction(clip).play();
          });
        } else {
          console.log("No animations found in the model.");
        }
      },
      // called while loading is progressing
      function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      // called when loading has errors
      function (error) {
        console.log("An error happened " + error);
      }
    );

    const lookAt = {
      x: 0,
      y: 0,
    };

    window.addEventListener("mousemove", (event) => {
      lookAt.x = event.clientX / window.innerWidth - 0.5;
      lookAt.y = event.clientY / window.innerHeight - 0.5;
    });

    //create a camera------------------------------------------
    const aspect = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    camera.position.z = 13;
    camera.position.y = 10;
    camera.position.x = 6;

    //create a renderer-------------------------------------------
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
    }); //add canvas to renderer
    renderer.setSize(window.innerWidth, window.innerHeight); //set size of renderer

    //orbit controls-----------------------------------------------
    const orbitcontrols = new OrbitControls(camera, canvas);
    orbitcontrols.dampingFactor = 0.2;

    //create a animate function------------------------------------
    const animate = () => {
      const delta = this.clock.getDelta();
      requestAnimationFrame(animate);
      particalMesh.rotateY(delta * 0.1);

      if (this.mixer) {
        this.mixer.update(delta * 0.5);
      }

      if (this.cabeza) {
        this.cabeza.lookAt(lookAt.x, -lookAt.y, 1);
      }
      //for retina display
      orbitcontrols.update();
      renderer.render(scene, camera); //render the scene
      composer.render();
    };
    // post processing----------------------------------------
    const renderScene = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1,
      0.4,
      0.85
    );
    //  bloomPass.
    renderer.toneMappingExposure = Math.pow(2, 8.0);
    bloomPass.threshold = 0.6;
    bloomPass.strength = 0.4; // Bloom strength
    bloomPass.radius = 10; // Bloom radius
    // datGui.add(bloomPass, 'threshold', 0, 1, 0.1).step(0.1);
    // datGui.add(bloomPass, 'strength', 0, 1, 0.1).step(0.1);
    // datGui.add(bloomPass, 'radius', 0, 500, 10).step(10);

    const composer = new EffectComposer(renderer);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);
    //  this.bloomObject?.layers.set(1);
    // camera.layers.enable(0);
    camera.layers.enableAll();
    animate();
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
