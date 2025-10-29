/* utils.js */
(function(){
  window.SmartCNC = window.SmartCNC || {};
  const Utils = {
    delay(ms){ return new Promise(res=>setTimeout(res,ms)); },
    formatTime(){ const d=new Date(); return d.toLocaleTimeString('ar-EG'); },
    clamp(v,min,max){ return Math.max(min,Math.min(max,v)); }
  };
  window.SmartCNC.utils = Utils;
})();
