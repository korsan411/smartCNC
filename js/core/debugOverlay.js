/* Debug Overlay */
(function(){
  var overlay,logArea,btnClear,btnClose,btnToggleSize;
  function createElements(){
    overlay=document.getElementById('debugOverlay');
    logArea=document.getElementById('debugLog');
    btnClear=document.getElementById('dbgClear');
    btnClose=document.getElementById('dbgClose');
    btnToggleSize=document.getElementById('dbgToggleSize');
    if(!overlay||!logArea){ overlay=overlay||document.createElement('div'); overlay.id='debugOverlay'; overlay.style.display='none'; logArea=logArea||document.createElement('pre'); logArea.id='debugLog'; overlay.appendChild(logArea); document.body.appendChild(overlay); }
  }
  function appendLog(msg){ if(!logArea) return; var time=new Date().toLocaleTimeString(); var line='['+time+'] '+msg+'\n'; logArea.textContent = line + logArea.textContent; }
  function showOverlay(){ if(!overlay) return; overlay.style.display='flex'; }
  function hideOverlay(){ if(!overlay) return; overlay.style.display='none'; }
  function clearLog(){ if(!logArea) return; logArea.textContent=''; }
  function toggleSize(){ if(!overlay) return; if(overlay.classList.contains('big')){ overlay.classList.remove('big'); overlay.style.width='380px'; overlay.style.maxHeight='60vh'; } else { overlay.classList.add('big'); overlay.style.width='720px'; overlay.style.maxHeight='80vh'; } }
  function initDebug(){
    createElements();
    if(btnClear) btnClear.addEventListener('click', clearLog);
    if(btnClose) btnClose.addEventListener('click', hideOverlay);
    if(btnToggleSize) btnToggleSize.addEventListener('click', toggleSize);
    window.SmartCNC = window.SmartCNC || {};
    window.SmartCNC.debug = {
      log:function(msg){ appendLog(String(msg)); showOverlay(); },
      info:function(msg){ appendLog('[i] '+String(msg)); showOverlay(); },
      warn:function(msg){ appendLog('[!] '+String(msg)); showOverlay(); },
      error:function(msg){ appendLog('[x] '+String(msg)); showOverlay(); },
      clear: clearLog, show: showOverlay, hide: hideOverlay, toggleSize: toggleSize
    };
    window.SmartCNC.debug.info('Debug overlay initialized');
  }
  if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded', initDebug); } else { initDebug(); }
})();
