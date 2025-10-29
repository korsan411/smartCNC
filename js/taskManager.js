/* TaskManager */
(function(){
  function TaskManager(){
    this.queue=[];this.isRunning=false;this.onTaskStart=null;this.onTaskEnd=null;
  }
  TaskManager.prototype.addTask=function(taskFn,meta){
    const task={fn:taskFn,meta:meta||{}};
    this.queue.push(task);
    if(!this.isRunning) this._runNext();
    return task;
  };
  TaskManager.prototype._runNext=function(){
    const self=this;
    if(self.queue.length===0){ self.isRunning=false; return; }
    const task=self.queue.shift();
    try{
      self.isRunning=true;
      if(typeof self.onTaskStart==='function'){ try{ self.onTaskStart(task.meta); }catch(e){} }
      const res=task.fn();
      Promise.resolve(res).then((v)=>{
        if(typeof self.onTaskEnd==='function'){ try{ self.onTaskEnd(null,task.meta,v);}catch(e){}}
      }).catch((err)=>{
        if(typeof self.onTaskEnd==='function'){ try{ self.onTaskEnd(err,task.meta);}catch(e){} }else{ console.error('Task error',err); }
      }).finally(()=>{ setTimeout(()=> self._runNext(),10);});
    }catch(err){ console.error('TaskManager _runNext caught', err); setTimeout(()=> self._runNext(),10);}
  };
  TaskManager.prototype.clear=function(){ this.queue=[]; };
  TaskManager.prototype.isIdle=function(){ return !this.isRunning && this.queue.length===0; };
  window.SmartCNC = window.SmartCNC || {}; window.SmartCNC.taskManager = new TaskManager();
})();
