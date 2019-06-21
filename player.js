class Player{
    constructor(src,dest){
        this.path=[];
        this.source=src;
        this.destination=dest
    }
    show(){
        stroke(255,0,0);
        strokeWeight(2);
        noFill();
        beginShape();
        for(var i in this.path){
            vertex(this.path[i].x+(this.path[i].size/2),this.path[i].y+(this.path[i].size/2));
        }
        endShape();
    }
}