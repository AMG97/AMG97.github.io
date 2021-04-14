grid_no = -1;
grid_empty = 0;
grid_player = 1;
grid_enemy = 2;
grid_hay = 3;
grid_carrot = 4;
grid_hay_carrot = 5;
grid_enemy_carrot =6;

var win=0;
var lose=0;

var create_player, create_carrot, create_hay, create_cow, create_selected;

grid_size=2;

class Grid {
    #limit_x = 11;
    #limit_y = 19;
    constructor()
    {
        this.matrix = [];
        for(var i=0;i<=this.#limit_x;i++){
            this.matrix[i]=[];
            for(var j=0;j<=this.#limit_y;j++){
                this.matrix[i][j]={value:grid_empty,object:"",carrot:""};
            }
        }
        this.carrots=0;
    }

    checkPosition(x,y)
    {
        if(x>=0 && x <= this.#limit_x && y>=0 && y<=this.#limit_y)
            return this.matrix[x][y].value;
        else
            return grid_no;
    }

    changePosition(x,y,i,object)
    {
        if(x>=0 &&x <= this.#limit_x && y>=0 && y<=this.#limit_y)
        {
            if(i == grid_hay &&  this.matrix[x][y].value==grid_carrot){
                this.matrix[x][y].value=grid_hay_carrot;
                this.matrix[x][y].carrot.animPause();
            }
            else if(i == grid_enemy && this.matrix[x][y].value==grid_carrot){
                this.matrix[x][y].carrot.animDown();
            }
            else if(i == grid_empty && this.matrix[x][y].carrot!=""){
                this.matrix[x][y].carrot.animUp();
                this.matrix[x][y].value=grid_carrot;
            }
            else if(i == grid_player && this.matrix[x][y].value==grid_carrot){
                this.deleteCarrot(x,y);
                if(this.carrots == 0)
                    win = true;
            }
            else
                this.matrix[x][y].value=i;
            this.matrix[x][y].object=object;
        }
    }

    deleteObject(x,y)
    {
        if(x>=0 &&x <= this.#limit_x && y>=0 && y<=this.#limit_y)
        {
            if(this.matrix[x][y].value==grid_hay_carrot)
            {
                this.matrix[x][y].value=grid_carrot;
                this.matrix[x][y].carrot.animResume();
            }
            else
            {
                this.matrix[x][y].value=grid_empty;
            }
            if(this.matrix[x][y].object != "" && this.matrix[x][y].object != undefined)
            {
                this.matrix[x][y].object.destroy();
                delete this.matrix[x][y].object;
                this.matrix[x][y].object="";
            }
        }
    }

    addCarrot(x,y,carrot)
    {
        if(x>=0 &&x <= this.#limit_x && y>=0 && y<=this.#limit_y)
        {
            this.matrix[x][y].carrot=carrot;
            this.carrots ++;
            var state = this.checkPosition(x,y);
            if(state == grid_empty)
            {
                this.matrix[x][y].value=grid_carrot;
            }
            else if(state==grid_hay)
            {
                this.matrix[x][y].value=grid_hay_carrot;
            }
        }
    }

    deleteCarrot(x,y)
    {
        if(x>=0 &&x <= this.#limit_x && y>=0 && y<=this.#limit_y)
        {
            this.carrots --;
            this.matrix[x][y].carrot.destroy();
            delete this.matrix[x][y].carrot;
            this.matrix[x][y].carrot="";
            this.matrix[x][y].value=grid_empty;
        }
    }

    deleteAll()
    {
        for(var i=0;i<=this.#limit_x;i++){
            for(var j=0;j<=this.#limit_y;j++){
                this.deleteObject(i,j);
                if(this.matrix[i][j].carrot!="")
                    this.deleteCarrot(i,j);
            }
        }
    }

    checkCarrots
}

var grid_pruebas = new Grid();