socket.on('game_update', function(room_json) {
    var json = JSON.parse(room_json);
    
    var player;

    if(nick == json['player1']){
        player = 1;
    }
    else{
        player = 2;
    }

    if(json['round'] == player){
        information.text = "Twój ruch"
    }
    else{
        information.text = "Ruch przeciwnika"
    }

    container.removeChildren(0, container.children.length);

    var board = json['board'];
    // console.log(board);

    for(var i = 0; i < sectors.length; i++){
        for(var j = 0; j < sectors.length; j++){
            var ind = sectors.length * i + j;

            var sector = new PIXI.Sprite(PIXI.utils.TextureCache["ocean2-"+ind+".png"]);
  
            sector.alpha = 1;
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

            sectors[i][j] = sector;
    
            container.addChild(sector);
        }
    }


    for(var i = 0; i < sectors.length; i++){
        for(var j = 0; j < sectors.length; j++){
            var ind = sectors.length * i + j;
            var flag = 0;

            if(board[ind] == 5){ //missed shot
                var sector = new PIXI.Sprite(PIXI.utils.TextureCache["static/images/celownik_black.png"]);
                flag = 1;
            }
            else if(board[ind] == 6){ //crash (2 ships in one sector)
                var sector = new PIXI.Sprite(PIXI.utils.TextureCache["static/images/fire.jpg"]);
                flag = 1;
            }
            else if( (player==1 && board[ind] == 3) || (player==2 && board[ind] == 4)){ //moje zniszczone
                var sector = new PIXI.Sprite(PIXI.utils.TextureCache["static/images/fire.jpg"]);
                flag = 1;
            }
            else if( (player==1 && board[ind] == 4) || (player == 2 && board[ind] == 3)){ //przeciwnika zniszczone
                var sector = new PIXI.Sprite(PIXI.utils.TextureCache["static/images/celownik_red.png"]);
                flag = 1;
            }

            if(flag == 1){
                sector.position.set(j*interval, i*interval);
                sector.alpha = 1;
                sector.width = 44;
                sector.height = 44;
                sectors[i][j].interactive = false;
                container.addChild(sector);
            }
        }
    }

    function onButtonDown(){
    e = event;
    deactivate();
    var x = this.x/interval;
    var y = this.y/interval;

    sectors[y][x].alpha = 1;
    sectors[y][x].interactive = false;
    
    let data = {};
    data['x'] = x;
    data['y'] = y;
    data['room'] = json['room'];
    socket.emit('shot',data);
    }

    if(json['won'] != 0){
        deactivate();
        var txt = "";
        if(json['won'] == 1){
            txt = json['player1'];
        }
        else{
            txt = json['player2'];
        }
        confirm("Wygrywa "+txt+ "!");
        let data = {};
        data['room'] = json['room'];
        socket.emit('exit',data, function() {
            window.location.replace(url_games_list);
        });

    }
    else if( !(json['round'] == 1 && json['player1'] == nick) && !(json['round'] == 2 && json['player2'] == nick)) {
        deactivate();
    }
});