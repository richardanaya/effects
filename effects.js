// effects.js
// repo    : https://github.com/richardanaya/effects
// license : MIT

(function (window, module) {
  "use strict";

  function isIterable(obj) {
    // checks for null and undefined
    if (obj == null) {
      return false
    }
    return obj[Symbol.iterator] !== undefined
  }


  function Effect(fn){
    return function(){
      var state = {
        isDisposed: false,
        effectDispose: null,
        dispose: function(){
          if(this.isDisposed) return;
          this.disposables.forEach((o)=>o.dispose());
          this.disposables = null;
          this.isDisposed = true;
          if(this.effectDispose){
            this.effectDispose()
          }
        },
        disposables: []
      }

      //iterate through generator and collect all the disposables
      var it = fn.apply(state,Array.prototype.slice.call(arguments));
      var ret = null;
      if(!Array.isArray(it) && isIterable(it)){
        var res = it.next();
        while(!res.done){
          state.disposables.push(res.value);
          res = it.next();
        }
        ret =  res.value;
      }
      else {
        ret = it;
      }

      if(Array.isArray(ret)){
        ret.forEach(function(x){
            state.disposables.push(x);
        })
      }
      else  {
        //if they returned something, use it as effect's dispose
        state.effectDispose = ret;
      }
      return state;
    }
  }

  Effect.bundle = function(effects){
    var state = {
      isDisposed: false,
      dispose: function(){
        if(state.isDisposed) return;
        for(var i in effects){
          effects[i].dispose();
        }
        state.isDisposed = true;
      }
    }
    return state;
  }

  window.Effect = module.exports = Effect;
})(
  typeof window !== "undefined" ? window : {},
  typeof module !== "undefined" ? module : {}
);
