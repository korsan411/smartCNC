/* cv-processing.js */
(function(){
  window.SmartCNC = window.SmartCNC || {};
  const mm = window.SmartCNC.memoryManager;
  const dbg = window.SmartCNC.debug || console;
  let cvReady=false, srcMat=null, grayMat=null;
  function waitForCvReady(callback){
    const check=setInterval(()=>{
      if(window.cv && cv.imread){ clearInterval(check); cvReady=true; if(window.SmartCNC && window.SmartCNC.debug) window.SmartCNC.debug.info("✅ OpenCV جاهز"); callback(); }
    },200);
  }
  function loadImageToCanvas(file,canvasId){
    return new Promise((resolve,reject)=>{
      const img=new Image();
      img.onload=function(){
        const canvas=document.getElementById(canvasId); const ctx=canvas.getContext('2d');
        canvas.width=img.width; canvas.height=img.height; ctx.drawImage(img,0,0);
        try{ srcMat = cv.imread(canvasId); grayMat=new cv.Mat(); cv.cvtColor(srcMat, grayMat, cv.COLOR_RGBA2GRAY); if(window.SmartCNC && window.SmartCNC.debug) window.SmartCNC.debug.info("🖼️ تم تحميل الصورة"); resolve(grayMat); }catch(err){ if(window.SmartCNC && window.SmartCNC.debug) window.SmartCNC.debug.error("فشل تحميل الصورة: "+err); reject(err); }
      };
      img.onerror=()=> reject("خطأ في تحميل الصورة");
      img.src = URL.createObjectURL(file);
    });
  }
  function detectEdges(method,sensitivity=100){
    if(!grayMat){ if(window.SmartCNC && window.SmartCNC.debug) window.SmartCNC.debug.warn("لم يتم تحميل صورة"); return null; }
    const dst=new cv.Mat(); const low=sensitivity; const high=sensitivity*2.5;
    switch(method){
      case "canny": cv.Canny(grayMat,dst,low,high); break;
      case "sobel": var gx=new cv.Mat(), gy=new cv.Mat(); cv.Sobel(grayMat,gx,cv.CV_16S,1,0,3); cv.Sobel(grayMat,gy,cv.CV_16S,0,1,3); cv.convertScaleAbs(gx,gx); cv.convertScaleAbs(gy,gy); cv.addWeighted(gx,0.5,gy,0.5,0,dst); mm.safeDelete([gx,gy]); break;
      case "laplace": cv.Laplacian(grayMat,dst,cv.CV_8U,3); break;
      default: cv.Canny(grayMat,dst,low,high); break;
    }
    if(window.SmartCNC && window.SmartCNC.debug) window.SmartCNC.debug.info("🔍 كشف الحواف ("+method+")");
    return dst;
  }
  function createHeatmap(mat,colormap=cv.COLORMAP_JET,canvasId='canvasHeatmap'){
    const colorDst=new cv.Mat();
    try{ cv.applyColorMap(mat,colorDst,colormap); cv.imshow(canvasId,colorDst); }catch(err){ if(window.SmartCNC && window.SmartCNC.debug) window.SmartCNC.debug.error("خطأ Heatmap: "+err);} finally{ mm.safeDelete(colorDst); }
  }
  function showMat(mat,canvasId){ try{ cv.imshow(canvasId,mat);}catch(err){ if(window.SmartCNC && window.SmartCNC.debug) window.SmartCNC.debug.error("عرض الصورة فشل: "+err);} }
  function cleanup(){ mm.safeDelete([srcMat,grayMat]); srcMat=null; grayMat=null; if(window.SmartCNC && window.SmartCNC.debug) window.SmartCNC.debug.info("🧹 تنظيف موارد"); }
  window.SmartCNC.cv = { waitForCvReady, loadImageToCanvas, detectEdges, createHeatmap, showMat, cleanup, get grayMat(){ return grayMat; } };
})();
