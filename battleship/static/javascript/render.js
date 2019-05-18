//Create table for battlefield
//IMPORTANT!!! size array
length_battlefield = 11;
var battlefield = new Array(length_battlefield);
for (i = 0; i < battlefield.length; i++){
  battlefield[i] = new Array(length_battlefield);
}

//  (L) - LOCKED - your ships can't touch
//  (1) - my ship
// (-1) - my burning ship
//  (B) - BOMB - your bomb

var flag_ship = 4;
var vertical = true; //vertical or horizontal

render(battlefield);

function render(battlefield){

  //Create a Pixi Application
  let app = new PIXI.Application({ 
      width: 700, 
      height: 500,                       
      antialias: true, 
      transparent: false, 
      resolution: 1,
      backgroundColor: 0xDDFFFF
    }
  )
  document.body.appendChild(app.view);

  //Create a Pixi Container for Battlefield
  let container = new PIXI.Container();
  app.stage.addChild(container);

  //Load textures to memory
  PIXI.loader
    .add('static/images/battlefield.json')
    .add('static/images/texture_ship1.png') //1
    .add('static/images/texture_ship2.png') //2
    .add('static/images/texture_ship3.png') //3
    .add('static/images/texture_ship4.png') //4
    .load(setup);
    
    //This `setup` function will run when the image has loaded
    function setup() {
    
      //IMPORTANT!!! distance between left top corner each sprite
      interval = 45;
    
      for (var i = 0; i < battlefield.length; i++) { //wiersze
        for (var j = 0; j < battlefield.length; j++){ //kolumny

          var nr_ocean = i*battlefield.length + j;
          var texture = PIXI.utils.TextureCache["ocean2-"+nr_ocean+".png"];
    
          var sector = new PIXI.Sprite(texture);
          
          sector.position.set(j*interval, i*interval);
          sector.alpha = 1;
    
          sector.interactive = true;      
          sector.buttonMode = true;
    
          sector
            .on('mouseover',onButtonOver)
            .on('mouseout', onButtonOut)
            .on('mousedown', onButtonDown)
            
          
          container.addChild(sector);
        }
      }

      for (var i = 0; i < 4; i++) { //wiersze
        
        var url = "static/images/texture_ship"+(i+1)+".png";
        console.log(url);
        var texture_ship = PIXI.utils.TextureCache[url];
        var ship = new PIXI.Sprite(texture_ship);
        ship.position.set(500+i*50,10);

        ship.interactive = true;      
        ship.buttonMode = true;
        
        ship
        .on('mouseover',onButtonOver)
        .on('mouseout', onButtonOut)
        .on('mousedown', onButtonDown)

        container.addChild(ship);
      }
    }
}

document.addEventListener('keypress', logKey);

function logKey(e) {
  if(e.code == "Space" && vertical== true){
    vertical = false; 
  }
  else if(e.code == "Space" && vertical== false){
    vertical = true;
  }
  console.log(vertical);
}

function onButtonOver(){
    this.isOver = true;
    this.alpha =  0.5;
}

function onButtonOut(){
    this.isOver = false;
    this.alpha = 1;
} 



function onButtonDown(){
  e = event;
  if(e.clientX > 0 && e.clientY > 0 && e.clientX < 500 && e.clientY < 500){
    console.log('tak!');
  }
  console.log(this.x/45+" "+this.y/45);
}

function mouse_position(e){
    var posX = e.clientX;
    var posY = e.clientY;

    // console.log(posX+" "+posY);
}