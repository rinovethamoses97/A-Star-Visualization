var size=40;
var rows;
var columns;
var cells=[];
var player;
var open=[];
var close=[];
var finalPath=[];
var searchFinised=false;
function setup(){
    createCanvas(400,400);
    rows=width/size;
    columns=height/size
    for(var i=0;i<rows;i++){
        var row=[];
        for(var j=0;j<columns;j++){
            row.push(new Cell(i,j));    
        }
        cells.push(row);
    }
    player=new Player(cells[0][0],cells[rows-1][columns-1]);
    for(var i=0;i<rows;i++){
        for(var j=0;j<columns;j++){
            if(random(1)<0.3 && (i!=player.source.i || j!=player.source.j) && (i!=player.destination.i || j!=player.destination.j)){
                cells[i][j].setObstacle();
            }
        }
    }
    // for testing
    // cells[9][8].obstacle=true;
    // cells[8][8].obstacle=true;
    // cells[7][8].obstacle=true;
    open.push(cells[0][0])
}
function getMin(){
    var min=Infinity;
    var minCell=open[0];
    for(var i=1;i<open.length;i++){
        if(open[i].f<min){
            min=open[i].f;
            minCell=open[i];
        }
    }
    return minCell;
}
function popCell(c){
    for(var i=0;i<open.length;i++){
        if(open[i]===c){
            open.splice(i,1);
            return;
        }
    }
}
function draw(){
    frameRate(5);
    background(255);
    if(open.length>0){
        var q=getMin();
        popCell(q);
        player.path.push(q);
        if(q==player.destination){
            console.log("Searching Done");
            var tempCell=player.destination;
            finalPath.push(tempCell);
            while(tempCell!==player.source){
                tempCell=tempCell.parent;
                finalPath.push(tempCell)
            }
            searchFinised=true;
        }
        for(var i=-1;i<=1;i++){
            for(j=-1;j<=1;j++){
                var tempi=q.i+i;
                var tempj=q.j+j;
                if(tempi>=0 && tempi<rows && tempj>=0 && tempj<columns && (tempi!=q.i || tempj!=q.j)){
                    if(!cells[tempi][tempj].obstacle){
                        var inClose=false;
                        var inOpen=false;
                        for(var x in close){
                            if(cells[tempi][tempj]===close[x]){
                                inClose=true;
                                break;
                            }
                        }
                        if(inClose){
                            continue;
                        }
                        var g=q.g+1;
                        var h=dist(cells[tempi][tempj].x+(cells[tempi][tempj].size/2),cells[tempi][tempj].y+(cells[tempi][tempj].size/2),player.destination.x+(player.destination.size/2),player.destination.y+(player.destination.size/2));
                        var f=g+h;
                        for(var x in open){
                            if(cells[tempi][tempj]===open[x]){
                                inOpen=true;
                                if(f<open[x].f){
                                    open[x].g=g;
                                    open[x].h=h;
                                    open[x].f=f;
                                    open[x].parent=q;
                                }
                                break;
                            }
                        }
                        if(!inOpen){
                            cells[tempi][tempj].g=g;
                            cells[tempi][tempj].h=h;
                            cells[tempi][tempj].f=f;
                            cells[tempi][tempj].parent=q;
                            open.push(cells[tempi][tempj])
                        }
                    }
                }
            }
        }
        close.push(q);
        // for debugging step by step
        // if(frameCount==2){
        //     noLoop();
        // }
    }
    else{
        console.log("No path");
        noLoop();
    }
    for(var i=0;i<rows;i++){
        for(var j=0;j<columns;j++){
            cells[i][j].show();
        }
    }
    player.show();
    if(searchFinised){
        stroke(0,0,255);
        strokeWeight(2);
        noFill();
        beginShape();
        for(var i in finalPath){
            vertex(finalPath[i].x+(finalPath[i].size/2),finalPath[i].y+(finalPath[i].size/2));
        }
        endShape();
        noLoop();
    }
}
