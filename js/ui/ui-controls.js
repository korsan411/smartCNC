/* ui-controls.js */
(function(){
  window.SmartCNC = window.SmartCNC || {};
  const dbg = window.SmartCNC.debug || console;
  const cvCore = window.SmartCNC.cv;
  const gcodeGen = window.SmartCNC.gcodeGen;
  const sim = window.SmartCNC.sim3D;
  const tm = window.SmartCNC.taskManager;

  function setupTabs(){
    const buttons=document.querySelectorAll('.tabs button');
    buttons.forEach(btn=>btn.addEventListener('click',()=>{
      buttons.forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const target=btn.dataset.tab;
      document.querySelectorAll('.tab-content').forEach(tc=>tc.classList.remove('active'));
      const el=document.getElementById('tab-'+target) || document.getElementById('tab-'+target);
      if(el) el.classList.add('active');
    }));
  }

  function setupColormapButtons(){
    const cmapBtns=document.querySelectorAll('.colormap-buttons button');
    cmapBtns.forEach(btn=>btn.addEventListener('click',()=>{
      const map=btn.dataset.map; let cmapType=cv.COLORMAP_JET;
      switch(map){ case 'hot': cmapType=cv.COLORMAP_HOT; break; case 'cool': cmapType=cv.COLORMAP_COOL; break; case 'gray': cmapType=cv.COLORMAP_BONE; break; default: cmapType=cv.COLORMAP_JET; break; }
      const gray = cvCore.grayMat;
      if(gray) cvCore.createHeatmap(gray,cmapType,'canvasHeatmap');
      dbg.info("🎨 تغيير خريطة الألوان إلى "+map);
    }));
  }

  function setup3DControls(){
    const btnRot=document.getElementById('btnRotate');
    if(btnRot) btnRot.addEventListener('click',()=> sim.rotateScene(0.1));
    const zIn=document.getElementById('btnZoomIn'), zOut=document.getElementById('btnZoomOut');
    if(zIn) zIn.addEventListener('click',()=>{ if(sim._internal && sim._internal.camera) sim._internal.camera.position.z -= 10; });
    if(zOut) zOut.addEventListener('click',()=>{ if(sim._internal && sim._internal.camera) sim._internal.camera.position.z += 10; });
  }

  function setupButtons(){
    const imgInput=document.getElementById('imgInput');
    const btnGen=document.getElementById('btnGen');
    const btnSim=document.getElementById('btnSim');
    const gOut=document.getElementById('gcodeOut');

    if(imgInput){ imgInput.addEventListener('change', e=>{
      const file=e.target.files[0];
      if(file){
        tm.addTask(async ()=>{
          await cvCore.loadImageToCanvas(file,'canvasOriginalViewBig');
          const edges = cvCore.detectEdges('canny',100);
          if(edges) cvCore.createHeatmap(edges);
        }, {name:'تحميل الصورة'});
      }
    }); }

    if(btnGen){ btnGen.addEventListener('click', ()=> {
      tm.addTask(()=> {
        const gray = cvCore.grayMat;
        if(!gray){ if(window.SmartCNC && window.SmartCNC.debug) window.SmartCNC.debug.error("لم يتم تحميل الصورة"); return; }
        const g = gcodeGen.generateRasterGcode(gray,3);
        gOut.value = g;
        if(window.SmartCNC && window.SmartCNC.debug) window.SmartCNC.debug.info("✅ تم توليد G-code");
      }, {name:'توليد Gcode'});
    }); }

    if(btnSim){ btnSim.addEventListener('click', ()=> {
      tm.addTask(()=> {
        sim.init3D('threeContainer');
        sim.drawGcodePath(gOut.value);
      }, {name:'محاكاة 3D'});
    }); }
  }

  window.SmartCNC.ui = { setupTabs, setupButtons, setupColormapButtons, setup3DControls };
})();
