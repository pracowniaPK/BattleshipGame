socket.on('game_update', function(room_json) {
    console.log('update');
    var json = JSON.parse(room_json);
    console.log(json['player1']);
    console.log(json['player2']);
    console.log(nick);
    console.log(json['round']);
    
    var player;

    if(nick == json['player1']){
        player = 1;
    }
    else{
        player = 2;
    }

    container.removeChildren(0, container.children.length);

    var board = json['board'];
    console.log(board);

    for(var i = 0; i < sectors.length; i++){
        console.log('update2');
        for(var j = 0; j < sectors.length; j++){
            var ind = sectors.length * i + j;

            if(board[ind] == 0 || board[ind] == 1 || board[ind] == 2){
                var sector = new PIXI.Sprite(PIXI.utils.TextureCache["ocean2-"+ind+".png"]);
  
                sector.interactive = true;      
                sector.buttonMode = true;

                sector.position.set(j*interval, i*interval);
                if(board[ind] == player){
                    sector.alpha = 0.5;
                    sector.interactive = false;
                }
  
                sector
                    .on('mouseover',onButtonOver)
                    .on('mouseout', onButtonOut)
                    .on('mousedown', onButtonDown)
        
                container.addChild(sector);
            }
            else if(board[ind] == 5){ //missed shot
                var sector = new PIXI.Sprite(PIXI.utils.TextureCache["static/images/celownik.png"]);
                sector.position.set(j*interval, i*interval);
                sector.alpha = 1;
                sector.width = 45;
                sector.height = 45;
        
                container.addChild(sector);
            }
            else if(board[ind] == 6){ //crash
                var sector = new PIXI.Sprite(PIXI.utils.TextureCache["static/images/fire.jpg"]);
                sector.position.set(j*interval, i*interval);
                sector.alpha = 1;
                sector.width = 45;
                sector.height = 45;
        
                container.addChild(sector);
            }

            
        }
    }

    function onButtonDown(){
        deactivate();
        e = event;
        if(e.clientX > 0 && e.clientY > 0 && e.clientX < 500 && e.clientY < 500){
          var x = this.x/interval;
          var y = this.y/interval;

        sectors[y][x].alpha = 0.5;
        sectors[y][x].interactive = false;

        let data = {};
        data['x'] = x;
        data['y'] = y;
        socket.emit('shot',data);
        }
    }

    // if( !(json['round'] == 1 && json['player1'] == nick) && !(json['round'] == 2 && json['player2'] == nick)) {
    //     deactivate();
    // }
    
});