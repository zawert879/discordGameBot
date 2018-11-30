const input = document.getElementById('input');
const createPlayer = document.getElementById('create');
createPlayer.onclick = ()=>{
    var msg = {
        type:"create",
        nick: document.getElementById("input").value
    };
    ws.send(JSON.stringify(msg));
};
//empty line
const ws = new WebSocket('ws://localhost:3000');
players = [];
ws.onopen = ()=> {
    var msg = {
        type: "connect"
    };
    ws.send(JSON.stringify(msg));
};

var stage = new Konva.Stage({
    container: 'container',
    width: 1000,
    height: 1000
});

let layer = new Konva.Layer();
let templateObj = new Image();
let playerObj = new Image();
templateObj.onload = function() {
    function writeMessage(message) {
        text.setText(message);
        layer.draw();
    }
    var text = new Konva.Text({
        x: 10,
        y: 10,
        fontFamily: 'Calibri',
        fontSize: 24,
        text: '',
        fill: 'white'
    });

    let arr = [];
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {       
            buff= new Konva.Image({
                x: 200 * j,
                y: 200 * i,
                image: templateObj,
                width: 200,
                height: 200
            }); 
            arr.push(buff); 
        }
    }
    
    arr.forEach(item=>{
        layer.add(item);
    })
    layer.add(text);
    stage.add(layer);
    
    

    let pole = 12;

    arr.forEach(item => {
        item.on('mouseover', function () {
            writeMessage(item.index);
        });
    });
    
    arr.forEach(item => {
        item.on('mouseover', function () {
            writeMessage(item.index);
        });
    });
    //////////////////////////////////////////////////////////////////////////////////////////
    ws.onmessage = response =>{
        let data =JSON.parse(response.data);
        switch (data.type) {
            case "synchronize":
                
                players.forEach(player=>{
                    player.destroy()
                });
                data.players.forEach(player=>{
                    player = new Konva.Image({
                        name: player.nick,
                        x: arr[player.position].attrs.x,
                        y: arr[player.position].attrs.y,
                        image: playerObj,
                        width: 200,
                        height: 200
                    });
                    players.push(player);
                    layer.add(player);
                });
                break;
        
            default:
                // playerCurrent.setX(arr[qqq.position].attrs.x);
                // playerCurrent.setY(arr[qqq.position].attrs.y);
                break;
        }

    };
    //////////////////////////////////////////////////////////////////////////////////////////
    arr.forEach(item => {
        item.on('click', function () {
            var msg = {
                type: "move",
                position: item.index,
                nick: document.getElementById("input").value
            };
            ws.send(JSON.stringify(msg));
        });
    });
};
templateObj.src = 'template.jpg';
playerObj.src = 'player.png';
