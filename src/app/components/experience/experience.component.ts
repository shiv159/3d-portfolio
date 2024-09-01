import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Experience } from '../../models/experience';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [NavbarComponent, MatCardModule],
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.css',
})
export class ExperienceComponent {
  experiences?: Experience[];
  constructor() {}

  @ViewChild('canvas', { static: true })
  canvasRef!: ElementRef<HTMLCanvasElement>;
  private mixer?: THREE.AnimationMixer;
  clock = new THREE.Clock();

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;

    //create a renderer-------------------------------------------
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
    }); //add canvas to renderer

    renderer.setSize(window.innerWidth, window.innerHeight);

    //create a scene----------------------------------------
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('black');
    //LIghts----------------------------------------
    const light = new THREE.DirectionalLight('white', 1);
    light.position.set(0, 0, 10);
    scene.add(light);

    //particals-----------------------------
    const particalGeometry = new THREE.BufferGeometry();
    const vertices = 25000;
    const positions = new Float32Array(vertices * 3);
    for (let i = 0; i < vertices * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 20;
    }
    particalGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(positions, 3)
    );
    const particalMaterial = new THREE.PointsMaterial({});
    particalMaterial.size = 0.007;
    particalMaterial.transparent = true;
    //particalMaterial.alphaMap = texture;
    particalMaterial.blendColor = new THREE.Color('white');
    particalMaterial.depthTest = false;
    const particalMesh = new THREE.Points(particalGeometry, particalMaterial);
    scene.add(particalMesh);

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
    camera.position.z = 4;
    //set size of renderer

    //orbit controls-----------------------------------------------
    const orbitcontrols = new OrbitControls(camera, canvas);
    orbitcontrols.dampingFactor = 0.2;

    //create a animate function------------------------------------
    const animate = () => {
      const delta = this.clock.getDelta();
      if (this.mixer) {
        this.mixer.update(delta);
        // console.log(delta);
      }
      particalMesh.rotateY(delta * 0.1);
      requestAnimationFrame(animate);
      camera.layers.enableAll();
      renderer.render(scene, camera);
    };
    animate();
  }
}
