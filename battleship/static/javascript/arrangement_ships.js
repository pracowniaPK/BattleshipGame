//Create table for battlefield
//IMPORTANT!!! size array

var length_battlefield = 11;
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
//  [L] - LOCKED - your ships can't touch
//  [1] - my ship

//array for sprites
var sectors = new Array(length_battlefield);
for (i = 0; i < sectors.length; i++){
  sectors[i] = new Array(sectors.length);
}

var ships = [];

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
      backgroundColor: 0xeff0f2
    }
  )
  document.getElementsByClassName("main_container")[0].appendChild(app.view);

  //Create a Pixi Container for Battlefield
  var container = new PIXI.Container();
  app.stage.addChild(container);

  //Load textures to memory
  PIXI.loader
    .add('static/images/battlefield.json')
    // .add('static/images/texture_ship2.png')
    .add('static/images/celownik_black.png')
    .add('static/images/celownik_red.png')
    .add('static/images/fire.jpg')
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
          .on('mouseover',onButtonOverSector)
          .on('mouseout', onButtonOutSector)
          .on('mousedown', onButtonDown)
          
        sectors[i][j] = sector;
        
        container.addChild(sector);
      }
    }
  }

var information = new PIXI.Text('Rozmieść swoje statki\n na planszy!',{fontFamily : 'Arial', fontSize: 12, fill : 0x3d5d8e, align : 'center'});
information.position.set(520,10);
app.stage.addChild(information);

document.addEventListener('keypress', logKey);

function logKey(e) {
  if(e.code == "Space" && vertical== true){
    vertical = false; 
  }
  else if(e.code == "Space" && vertical== false){
    vertical = true;
  }
}

function onButtonOver(){
  this.isOver = true;
  this.alpha =  0.5;
}

function onButtonOut(){
  this.isOver = false;
  this.alpha = 1;
} 

function onButtonOverSector(){
  e = event;
    var x = this.x/interval;
    var y = this.y/interval;

    var flag = chech_locked(x,y,flag_ship[flag_ship.length-1]);

    if(flag == false){
      if(flag_ship[flag_ship.length-1] == 1){
        sectors[y][x].alpha = 0.5;
      }
      else{
        for(var i = 0; i < flag_ship[flag_ship.length-1]; i++){
          if(vertical == true){
            sectors[y-1+i][x].alpha = 0.5;
          }
          else{
            sectors[y][x-1+i].alpha = 0.5;
          }
        }
      }
    }
  }

function onButtonOutSector(){
  
  for(var i = 0; i < sectors.length; i++){
    for(var j = 0; j < sectors.length; j++){
      if(battlefield[i][j] != 1){
      sectors[i][j].alpha = 1;
      }
    }
  }
}

function onButtonDown(){
  e = event;

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
  set_lock(x,y,flag_ship[flag_ship.length-1]);
  // write_all_battlefield();
  flag_ship.pop();
  }
  if(flag_ship.length == 0){
    var board = [];
    for(var i = 0; i < battlefield.length; i++){
      for(var j = 0; j < battlefield.length; j++){
        board.push(battlefield[i][j]);
      }
    }
  var obj = '{ "room":"'+room+'","nick":"'+nick+'","board":"'+board+'" }';
  var parcel = JSON.parse(obj);
  socket.emit('setup',parcel);
  deactivate();
  information.text = "Oczekiwanie\n na drugiego gracza!"
  }
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
  // console.log(flag_ship);
  if(flag_ship == 1){
    if(sectors[y][x].interactive == false){
      return true;
    }
  }
  else{
    for(var i = 0; i < flag_ship; i++){
      if(vertical == true){
        if((y-1+i) < 0 || (y-1+i) > battlefield.length - 1  || sectors[y-1+i][x].interactive == false || battlefield[y-1+i][x] == 1){
          return true;
        }
      }
      else{
        if((x-1+i) < 0 || (x-1+i) > battlefield.length - 1 || sectors[y][x-1+i].interactive == false || battlefield[y][x-1+i] == 1){
          return true;
        }
      }
    }
  }
  return false;
}

function set_lock(x ,y ,flag_ship){
  if(flag_ship == 1){
    for(var i = 0; i < 3; i++){
      for(var j = 0; j < 3; j++){
        if((y-1+j)>=0  && (y-1+j)<battlefield.length && (x-1+i) >=0 && (x-1+i) < battlefield.length && battlefield[y-1+j][x-1+i] != 1){
          sectors[y-1+j][x-1+i].interactive = false;
        }
      }
    }
  }
  else{
    for(var i = 0; i < 3; i++){
      for(var j = 0; j < flag_ship+2; j++){
        if(vertical == true && (y-2+j)>=0  && (y-2+j)<battlefield.length && (x-1+i) >=0 && (x-1+i) < battlefield.length && battlefield[y-2+j][x-1+i] != 1){
          sectors[y-2+j][x-1+i].interactive = false;
        }
        else if(vertical == false && (y-1+i)>=0  && (y-1+i)<battlefield.length && (x-2+j) >=0 && (x-2+j) < battlefield.length && battlefield[y-1+i][x-2+j] != 1){
          sectors[y-1+i][x-2+j].interactive = false;
        }
      }
    }
  }
}

function deactivate(){
  for(var i = 0; i < sectors.length; i++){
    for(var j = 0; j < sectors.length; j++){
      sectors[i][j].interactive = false;
    }
  }
}
