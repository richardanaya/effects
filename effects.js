// effects.js
// repo    : https://github.com/richardanaya/effects
// license : MIT

(function (window, module) {
  "use strict";
  function effect(fn){
    return (data)=>{
      var state = {
        isDisposed: false,
        effectDispose: null,
        dispose: function(){
          if(this.isDisposed) return;
          this.disposables.forEach((o)=>o.dispose());
          this.isDisposed = true;
          if(this.effectDispose){
            this.effectDispose()
          }
        },
        disposables: []
      }

      //iterate through generator and collect all the disposables
      var it = fn.call(state,data);
      var res = it.next();
      while(!res.done){
        state.disposables.push(res.value);
        res = it.next();
      }
      //if they returned something, use it as effect's dispose
      state.effectDispose = res.value
      return state;
    }
  }
  window.effects = module.exports = {
    effect:effect
  };
})(
  typeof window !== "undefined" ? window : {},
  typeof module !== "undefined" ? module : {}
);
