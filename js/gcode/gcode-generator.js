/* gcode-generator.js */
(function(){
  window.SmartCNC = window.SmartCNC || {};
  const dbg = window.SmartCNC.debug || console;
  function generateRasterGcode(mat,step=2){
    if(!mat){ dbg.error("لا توجد بيانات Raster"); return ""; }
    const rows=mat.rows, cols=mat.cols; let gcode=[]; gcode.push("; --- SmartCNC Raster Gcode ---"); gcode.push("G21"); gcode.push("G90"); gcode.push("G1 F1000");
    for(let y=0;y<rows;y+=step){
      const dir = y % (step*2) === 0 ? 1 : -1;
      const xStart = dir===1 ? 0 : cols-1;
      const xEnd = dir===1 ? cols : -1;
      for(let x=xStart; x!==xEnd; x+=dir*step){
        const val = mat.ucharPtr(y,x)[0];
        const z = (255-val)/255*2;
        gcode.push(`G1 X${x} Y${y} Z${z.toFixed(2)}`);
      }
    }
    dbg.info("🪚 تم توليد G-code Raster");
    return gcode.join("\n");
  }
  function generateContourGcode(contours){
    if(!contours || !contours.size){ dbg.error("لا توجد حدود"); return ""; }
    let gcode=[]; gcode.push("; --- SmartCNC Contour Gcode ---"); gcode.push("G21"); gcode.push("G90"); gcode.push("G1 F800");
    for(let i=0;i<contours.size();i++){ const c=contours.get(i); if(c.data32S){ gcode.push("; contour "+i); for(let j=0;j<c.data32S.length;j+=2){ const x=c.data32S[j], y=c.data32S[j+1]; gcode.push(`G1 X${x} Y${y} Z0`); } } }
    dbg.info("✏️ تم توليد G-code Contour"); return gcode.join("\n");
  }
  window.SmartCNC.gcodeGen = { generateRasterGcode, generateContourGcode };
})();
