grid_no = -1;
grid_empty = 0;
grid_player = 1;
grid_enemy = 2;
grid_hay = 3;
grid_carrot = 4;
grid_hay_carrot = 5;
grid_enemy_carrot =6;

class Grid {
    #limit_x = 12;
    #limit_y = 7;
    constructor()
    {
        this.matrix = [];
        for(var i=0;i<=this.#limit_x;i++){
            this.matrix[i]=[];
            for(var j=0;j<=this.#limit_y;j++){
                this.matrix[i][j]=grid_empty;
            }
        }
    }

    checkPosition(x,y)
    {
        if(x>=0 && x <= this.#limit_x && y>=0 && y<=this.#limit_y)
            return this.matrix[x][y];
        else
            return grid_no;
    }

    changePosition(x,y,i)
    {
        if(x>=0 &&x <= this.#limit_x && y>=0 && y<=this.#limit_y)
            this.matrix[x][y]=i;
    }
}

var grid_pruebas = new Grid();