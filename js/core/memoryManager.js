/* MemoryManager */
(function(){
  function MemoryManager(){ this.registry=new WeakMap(); }
  MemoryManager.prototype.track=function(obj){ if(!obj) return; try{ this.registry.set(obj,true); }catch(e){} };
  MemoryManager.prototype.safeDelete=function(obj){
    if(!obj) return;
    try{
      if(Array.isArray(obj)){ obj.forEach(item=> this.safeDelete(item)); return; }
      if(typeof obj.delete==='function'){ try{ obj.delete(); }catch(e){}; return; }
      if(typeof obj.dispose==='function'){ try{ obj.dispose(); }catch(e){}; return; }
      if(obj instanceof HTMLImageElement){ try{ obj.src=''; }catch(e){}; return; }
    }catch(e){ console.warn('MemoryManager.safeDelete error', e); }
  };
  MemoryManager.prototype.safeDeleteProps=function(obj,propNames){
    if(!obj) return; propNames.forEach(name=>{ if(obj[name]){ this.safeDelete(obj[name]); try{ delete obj[name]; }catch(e){} } });
  };
  window.SmartCNC = window.SmartCNC || {}; window.SmartCNC.memoryManager = new MemoryManager();
})();
