#Effects.js

This library gives a simple container for asynchronous processes and observation.  

#Install

```
<script src="https://cdn.rawgit.com/richardanaya/effects/master/effects.js"></script>
```

or

```
npm install effects
```

#Why do I need this?

Modern javascript is becoming increasingly about managing data flow.  Effects give you a simple container for data flow behavior centered around particular data and be easily dispose of that behavior when needed.  Specifically it manages **disposable** streams, ie. anything that conforms to:

```javascript
interface IDisposable {
    dispose()
}
```

##Getting Started

Say you have this data object and a stream of actions from RxJS

```javascript
var MyPlayer = {
  x:0,
  y:0
}

var moveLeft = ... //Observable stream of left key presses
var moveRight = ... //Observable stream of right key presses
var moveUp = ... //Observable stream of up key presses
var moveDown = ... //Observable stream of down key presses
```

And you want to have this peice of data updated by actions received on those streams

```javascript
var PlayerEffect = Effect(function(player,name){
  console.log("Managing "+name);
  return [
    moveLeft.subscribe(()=>{
      player.x-=1
    }),
    moveRight.subscribe(()=>{
      player.x+=1
    }),
    moveUp.subscribe(()=>{
      player.y+=1
    }),
    moveDown.subscribe(()=>{
      player.y-=1
    })
  ]
})
```

Notice how we return an array. That array is  a list of disposable interfaces. In this case, whenever we subscribe to a stream, we get a disposable handle that we can use to shut it off.  Before we get to disposing though, lets setup this effect to work on a particular player:

```javascript
var myEffect = PlayerEffect(MyPlayer,"Wizard")
```

Simple yah? So now lets say you no longer have need to listen to key events effecting a player. Effects.js allows you to easily dispose all the streams at once:

```javascript
myEffect.dispose()
```

##Fun With Co-Routines

Effects.js is setup to work well with coroutines too using libraries such as https://github.com/tj/co . Within the function, you have access to the current state of the effect.

```javascript
var TestEffect = Effect(function(){
  var _this = this;

  co(function* (){
    console.log("started")
    while(!_this.isDisposed){
      console.log("operating")
      yield sleep(1000)
    }
    console.log("destroyed")
  })

  setTimeout(()=>_this.dispose(),3000)
});
```

##Using generators

As an alternative syntax for the more ES6 inclined, you can also use generators to return the disposables you would like your effect to manage:

```javascript
var PlayerEffect = Effect(function *(player){
  yield moveLeft.subscribe(()=>{
      player.x-=1
    })
  ...
})
```
