//Create table for battlefield
//IMPORTANT!!! size array
length_battlefield = 11;
var battlefield = new Array(length_battlefield);
for (i = 0; i < battlefield.length; i++){
  battlefield[i] = new Array(length_battlefield);
}

for(var i = 0; i < battlefield.length; i++){
  for(var j = 0; j < battlefield.length; j++){
    battlefield[i][j] = 0;
  }
}

//signs for array battlefield
//  (L) - LOCKED - your ships can't touch
//  (1) - my ship
// (-1) - my burning ship
//  (B) - BOMB - your bomb

//array for sprites
var sectors = new Array(length_battlefield);
for (i = 0; i < sectors.length; i++){
  sectors[i] = new Array(sectors.length);
}

var flag_ship = [1,1,1,1,2,2,2,3,3,4];
var vertical = true; //vertical or horizontal

//IMPORTANT!!! distance between left top corner each sprite
var interval = 45;

var button;


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
    .add('static/images/celownik.png')
    .load(setup);
    
  //This `setup` function will run when the image has loaded
  function setup() {
    // container.removeChildren(0,container.children.length);

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
          
        sectors[i][j] = sector;
        
        container.addChild(sector);
      }
    }

    for (var i = 0; i < 4; i++) { //wiersze
      
      var texture_ship = PIXI.utils.TextureCache["static/images/texture_ship"+(i+1)+".png"];
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

    var texture_button = PIXI.utils.TextureCache["static/images/celownik.png"];
    button = new PIXI.Sprite(texture_button);
    button.buttonMode = true;

    button.scale.set(0.1, 0.1);
    button.alpha = 1;

    button.x = 500;
    button.y = 200;

    // make the button interactive...
    button.interactive = false;
    button.buttonMode = true;

    button
      .on('mouseover',onButtonOver)
      .on('mouseout', onButtonOut)
      .on('mousedown', onButtonDown1)

    container.addChild(button);
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
    var x = this.x/interval;
    var y = this.y/interval;

    var flag = chech_locked(x,y,flag_ship[flag_ship.length-1]);

    if(flag == false){
      if(flag_ship[flag_ship.length-1] == 1){
        battlefield[y][x] = 1;
        sectors[y][x].alpha = 0.5;
        sectors[y][x].interactive = false;
      }
      else{
      for(var i = 0; i < flag_ship[flag_ship.length-1]; i++){
        if(vertical == true){
          battlefield[y-1+i][x] = 1;
          sectors[y-1+i][x].alpha = 0.5;
          sectors[y-1+i][x].interactive = false;
        }
        else{
          battlefield[y][x-1+i] = 1;
          sectors[y][x-1+i].alpha = 0.5;
          sectors[y][x-1+i].interactive = false;
        }
      }
    }
  }
    write_all_battlefield();
    flag_ship.pop();

    if(flag_ship.length == 0){
      button.interactive = true;
    }
  }
}

function onButtonDown1(){
  if(flag_ship.length == 0){
    socket.emit('shot',battlefield);
  }
}

function mouse_position(e){
    var posX = e.clientX;
    var posY = e.clientY;

    // console.log(posX+" "+posY);
}

//************************************************** */
//helper functions
function write_all_battlefield(){
  for(var i = 0; i < battlefield.length; i++){
    var text = "";
    for(var j = 0; j < battlefield.length; j++){
      text = text + " " + battlefield[i][j];
    }
    console.log(text);
  }
}

function chech_locked(x, y, flag_ship){
  // console.log(x+" "+y);
  for(var i = 0; i < flag_ship; i++){
    if(vertical == true){
      if(battlefield[y-1+i][x] == 'L' || battlefield[y-1+i][x] == 1){
        return true;
      }
    }
    else{
      if(battlefield[y][x-1+i] == 'L' || battlefield[y][x-1+i] == 1){
        return true;
      }
    }
  }
  return false;
}