// effects.js
// repo    : https://github.com/richardanaya/effects
// license : MIT

(function (window, module) {
  "use strict";
  function Effect(fn){
    return ()=>{
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
      var it = fn.apply(state,arguments);
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
  window.Effect = module.exports = Effect;
})(
  typeof window !== "undefined" ? window : {},
  typeof module !== "undefined" ? module : {}
);
