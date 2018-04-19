//构造游戏对象
function Game_2048(container){
    this.container = container;
    this.tiles = new Array(16);
}
 //原型对象添加游戏实例
Game_2048.prototype = {
    //初始化游戏盒子
    init(){
        for(let i = 0, len = this.tiles.length; i < len; i++){
            let tile = this.newTile(0);
            tile.setAttribute('index', i);
            this.container.appendChild(tile);
            this.tiles[i] = tile;
        }
        this.randomTile();
        this.randomTile();
    },
    //创建一个小格子
    newTile(val){
        let tile = document.createElement('div');
        this.setTileVal(tile, val)
        return tile;
    },
    //填充小格子
    setTileVal(tile, val){
        tile.className = 'tile tile_' + val;
        tile.setAttribute('val', val);
        tile.innerHTML = val > 0 ? val : '';
    },
    //小格子产生随机数
    randomTile(){
        let zeroTiles = [];
        for(let i = 0, len = this.tiles.length; i < len; i++){
            if(this.tiles[i].getAttribute('val') == 0){
                zeroTiles.push(this.tiles[i]);
            }
        }
        let rTile = zeroTiles[Math.floor(Math.random() * zeroTiles.length)];
        this.setTileVal(rTile, Math.random() < 0.8 ? 2 : 4);
    },
    //按键操作
    move(direction){
        let j;
        switch(direction){
            case 38:
                for(let i = 4, len = this.tiles.length; i < len; i++){
                    j = i;
                    while(j >= 4){
                        this.mix(this.tiles[j - 4], this.tiles[j]);
                        j -= 4;
                    }
                }
                break;
            case 40:
                for(let i = 11; i >= 0; i--){
                    j = i;
                    while(j <= 11){
                        this.mix(this.tiles[j + 4], this.tiles[j]);
                        j += 4;
                    }
                }
                break;
            case 37:
                for(let i = 1, len = this.tiles.length; i < len; i++){
                    j = i;
                    while(j % 4 != 0){//除了最左边的格子
                        this.mix(this.tiles[j - 1], this.tiles[j]);
                        j -= 1;
                    }
                }
                break;
            case 39:
                for(let i = 14; i >= 0; i--){
                    j = i;
                    while(j % 4 != 3){//除了最右边的格子
                        this.mix(this.tiles[j + 1], this.tiles[j]);
                        j += 1;
                    }
                }
                break;
        }
        this.randomTile();
        flag = false;
    },
    mix(prevTile, currTile){
        let prevVal = prevTile.getAttribute('val');
        let currVal = currTile.getAttribute('val');
        if(currVal != 0){
            if(prevVal == 0){
                this.setTileVal(prevTile, currVal);
                this.setTileVal(currTile, 0);
            }
            else if(prevVal == currVal){
                this.setTileVal(prevTile, prevVal * 2);
                this.setTileVal(currTile, 0);
                score += parseInt(prevVal * 2);                
            }
        }
    },
    equal(tile1, tile2){
        return tile1.getAttribute('val') == tile2.getAttribute('val');
    },
    over(){
        for(let i = 0, len = this.tiles.length; i < len; i++){
            if(this.tiles[i].getAttribute('val') == 0){//还有剩余格子
                return false;
            }
            if(i % 4 != 3){//不包括最右侧的格子
                if(this.equal(this.tiles[i], this.tiles[i + 1])){
                    return false;
                }
            } 
            if(i < 12){//不包括最下面的格子
                if(this.equal(this.tiles[i], this.tiles[i + 4])){
                    return false;
                }
            }
        }
        return true;
    },
    clean(){
        for(let i = 0, len = this.tiles.length; i < len; i++){
            this.container.removeChild(this.tiles[i]);
        }
        this.tiles = new Array(16);
    }
}

let game = null;
let startBtn;
let flag = true;
let score = 0;
//页面加载显示
window.onload = function(){
    let container = document.getElementById('box');
    startBtn = document.getElementById('start');
    startBtn.onclick = function(){
        this.style.display = 'none';
        game = game || new Game_2048(container);
        game.init();
    }
}
//按键触发
window.onkeydown = function(e){
    let keynum, keychar;
    if(flag){
        if(window.event){       // IE
            keynum = e.keyCode;
        }
        else if(e.which){       // Netscape/Firefox/Opera
            keynum = e.which;
        }
        if([37,38,39,40].indexOf(keynum) > -1){
            if(game.over()){
                game.clean();
                startBtn.style.display = 'block';
                startBtn.style.backgroundColor = 'green';
                startBtn.innerHTML = 'GAME OVER！';
                return;
            }
            this.setTimeout(function(){
                game.move(keynum);
                document.getElementById('score').innerHTML = score;
            },70);
        }
    } 
}
window.onkeyup = function(){
    flag = true;
}