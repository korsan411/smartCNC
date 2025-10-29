/* validators.js */
(function(){
  window.SmartCNC = window.SmartCNC || {};
  const Validators = {
    isPositive(n){ return typeof n==='number' && n>=0; },
    isInt(n){ return Number.isInteger(n); },
    ensureRange(v,min,max){ return Math.max(min,Math.min(max,v)); }
  };
  window.SmartCNC.validators = Validators;
})();
