//Create table for battlefield
//IMPORTANT!!! size array
console.log('{{nick}}')

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

//  Game object, keeps current state of game.  
//     battlefield states:  
//     [0] - nothing  
//     [1] - player1 uncovered ship  
//     [2] - player2 uncovered ship  
//     [3] - player1 destroyed ship  
//     [4] - player2 destroyed ship  
//     [5] - missed shot
//     [6] - ship crash (2 ships on 1 field)

//array for sprites
var sectors = new Array(length_battlefield);
for (i = 0; i < sectors.length; i++){
  sectors[i] = new Array(sectors.length);
}

//IMPORTANT!!! distance between left top corner each sprite
var interval = 45;

//Create a Pixi Application
let app = new PIXI.Application({ 
    width: 500, 
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
    .add('static/images/celownik.png')
    .load(setup);
  
function setup() {

    for (var i = 0; i < battlefield.length; i++) {
        for (var j = 0; j < battlefield.length; j++){
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

}

// TODO
socket.on('game_update', function() {

});


//************************************************** */
//helper functions
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
    }
}