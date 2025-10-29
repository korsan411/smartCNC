/* simulation3d.js */
(function(){
  window.SmartCNC = window.SmartCNC || {};
  const dbg = window.SmartCNC.debug || console;
  let scene, camera, renderer, pathLine;
  function init3D(containerId="threeContainer"){
    const container = document.getElementById(containerId) || document.getElementById('sim3d');
    const w = container.clientWidth, h=container.clientHeight;
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, w/h, 0.1, 10000);
    camera.position.set(0,-150,150);
    const light = new THREE.DirectionalLight(0xffffff,1); light.position.set(0,0,200); scene.add(light);
    renderer = new THREE.WebGLRenderer({antialias:true}); renderer.setSize(w,h); renderer.setClearColor(0x101214);
    container.innerHTML=""; container.appendChild(renderer.domElement);
    animate();
    dbg.info("🎥 محاكاة 3D جاهزة");
  }
  function animate(){ requestAnimationFrame(animate); if(renderer && scene && camera) renderer.render(scene,camera); }
  function drawGcodePath(gcodeText){
    if(!gcodeText) return;
    const lines=gcodeText.split("\n"); const points=[];
    let x=0,y=0,z=0;
    lines.forEach(line=>{
      if(line.startsWith("G1")){
        const xm=line.match(/X([\d.-]+)/), ym=line.match(/Y([\d.-]+)/), zm=line.match(/Z([\d.-]+)/);
        if(xm) x=parseFloat(xm[1]); if(ym) y=parseFloat(ym[1]); if(zm) z=parseFloat(zm[1]);
        points.push(new THREE.Vector3(x,y,z));
      }
    });
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: 0x00ffcc });
    const line = new THREE.Line(geometry, material);
    if(pathLine) scene.remove(pathLine);
    pathLine = line; scene.add(line); dbg.info("🧭 رسم مسار G-code في 3D");
  }
  function rotateScene(angle=0.02){ if(scene) scene.rotation.z += angle; }
  window.SmartCNC.sim3D = { init3D, drawGcodePath, rotateScene, _internal:{ scene, camera, renderer } };
})();
