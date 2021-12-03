import * as THREE from 'three';
import totum from 'totum';
const {useApp, useInternals, useCleanup, useLocalPlayer} = totum;

export default e => {
  const app = useApp();
  app.appType = 'spawnpoint';
  
  const srcUrl = '${this.srcUrl}';

  (async () => {
    const res = await fetch(srcUrl);
    const j = await res.json();
    if (j) {
      
      const localPlayer = useLocalPlayer();
      const {camera} = useInternals();

      if (j.position) {
        localPlayer.position.fromArray(j.position);
      }
      if (j.quaternion) {
        localPlayer.quaternion.fromArray(j.quaternion);
        camera.quaternion.fromArray(j.quaternion);
      }
    }
  })();
  
  useCleanup(() => {
  });

  return app;
};
