/* ui-init.js */
(function(){
  window.SmartCNC = window.SmartCNC || {};
  const dbg = window.SmartCNC.debug || console;
  const cvCore = window.SmartCNC.cv;
  const ui = window.SmartCNC.ui;
  const tm = window.SmartCNC.taskManager;

  function initApp(){
    dbg.info("🚀 بدء تهيئة SmartCNC...");
    cvCore.waitForCvReady(()=>{
      ui.setupTabs();
      ui.setupButtons();
      ui.setupColormapButtons();
      ui.setup3DControls();
      dbg.info("✅ SmartCNC جاهز للاستخدام");
    });

    tm.onTaskStart = (meta) => {
      const overlay = document.getElementById('progressOverlay');
      if (overlay) overlay.classList.add('active');
      dbg.info("🔄 بدء المهمة: " + (meta?.name || ''));
    };

    tm.onTaskEnd = () => {
      const overlay = document.getElementById('progressOverlay');
      if (overlay) overlay.classList.remove('active');
      dbg.info("✅ تم إنهاء المهمة");
    };
  }

  window.initApp = initApp;
})();
