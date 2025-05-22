// CSS imports
import '../styles/styles.css';
import '../styles/dicoding-styles.css';
import '../styles/responsives.css';
import 'tiny-slider/dist/tiny-slider.css';
import 'leaflet/dist/leaflet.css';
import App from './pages/app';
import Camera from './utils/camera';
import { registerServiceWorker } from './utils';

document.addEventListener('DOMContentLoaded', async () => {
  const app = new App({
    content: document.querySelector('#main-content'),
    drawerButton: document.querySelector('#drawer-button'),
    drawerNavigation: document.querySelector('#navigation-drawer'),
    skipLinkButton: document.getElementById('skip-link'),
  });
  await registerServiceWorker();
  console.log('Berhasil mendaftar service worker.');
  await app.renderPage();

  window.addEventListener('hashchange', async () => {
    await app.renderPage();

    // Stop all active media
    Camera.stopAllStreams();
  });
});
