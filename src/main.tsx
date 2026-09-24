import React from 'react';
import { createRoot } from 'react-dom/client';
import { ThreeScene } from './threeScene';
import App from './App';
import './style.css';

// Initialize Three.js Backround
const canvas = document.getElementById('bg') as HTMLCanvasElement;
const scene = new ThreeScene(canvas);

let isProcessing = false;
let sceneProgress = 0;

// Expose a function for React to update the scene
window.threeSceneUpdate = (processing: boolean, progress: number) => {
  isProcessing = processing;
  sceneProgress = progress;
};

function animate() {
  scene.update(0, {
    processing: isProcessing,
    progress: sceneProgress,
    time: performance.now() / 1000
  });

  scene.renderer.render(scene.scene, scene.camera);
  requestAnimationFrame(animate);
}

// Start Three.js loop
animate();

// Initialize React UI
const rootElement = document.getElementById('react-root');
if (rootElement) {
  createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
