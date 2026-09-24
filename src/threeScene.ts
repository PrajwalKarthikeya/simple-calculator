import * as THREE from 'three';

export class ThreeScene {
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    particles: THREE.Points;
    particleMaterial: THREE.PointsMaterial;

    constructor(canvas: HTMLCanvasElement) {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x02050A); // Match --bg-deep

        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        this.camera.position.z = 5;

        // Add cyan particles
        const geometry = new THREE.BufferGeometry();
        const vertices = [];
        for (let i = 0; i < 2000; i++) {
            vertices.push(THREE.MathUtils.randFloatSpread(100), THREE.MathUtils.randFloatSpread(100), THREE.MathUtils.randFloatSpread(100));
        }
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        this.particleMaterial = new THREE.PointsMaterial({ color: 0x00F2FF, size: 0.15, transparent: true, opacity: 0.4 });
        this.particles = new THREE.Points(geometry, this.particleMaterial);
        this.scene.add(this.particles);

        // Add some "data lines"
        const lineGeometry = new THREE.BufferGeometry();
        const lineVertices = [];
        for (let i = 0; i < 50; i++) {
            lineVertices.push(THREE.MathUtils.randFloatSpread(50), THREE.MathUtils.randFloatSpread(50), THREE.MathUtils.randFloatSpread(50));
        }
        lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(lineVertices, 3));
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0x00F2FF, opacity: 0.2, transparent: true });
        const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
        this.scene.add(lines);

        window.addEventListener('resize', this.onWindowResize.bind(this));
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    update(dt: number, state: { processing: boolean, progress: number, time: number }) {
        if (state.processing) {
            // Intense animation during processing
            this.particles.rotation.y += state.progress * 0.05;
            this.particleMaterial.size = 0.15 + (Math.sin(state.time * 10) * 0.1);
        } else {
            // Idle state
            this.particles.rotation.y += 0.0002;
            this.particleMaterial.size = 0.15;
        }
        this.renderer.render(this.scene, this.camera);
    }
}
