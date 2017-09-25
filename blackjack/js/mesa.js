/*const remote = require('electron').remote;
var win = remote.getCurrentWindow();
win.maximize();
*/

function jugador(nombre) {
    this.nombre = nombre;
    this.stack = [];
    this.puntos = 0;
    this.imprimir = function(){
        for (var i = 0; i < this.stack.length; i++) {
            console.log(this.stack[i]);
        }
        console.log("\n");
    }
}

function carta(valor,tipo){
    this.img="";
    this.valor=valor;
    this.tipo=tipo;
}

function blackjack(){
	this.aux= new Array();
	this.mazo=new Array();
    this.mazo2=new Array();
	this.jugadores=new Array();

	this.cargar_mazo = function(){
		var valor = 1;
        var tipo = 0;
        var nro_carta = ["A",2,3,4,5,6,7,8,9,10,"J","Q","K"];
        for (var i = 0; i < 104; i++) {
            this.aux.push(new carta(valor, tipo));
            if(tipo==0){
               	this.aux[i].img="../img/Corazon/"+nro_carta[valor-1]+".png";
            }
            if(tipo==1){
               	this.aux[i].img="../img/Diamante/"+nro_carta[valor-1]+".png";
            }
            if(tipo==2){
               	this.aux[i].img="../img/Pica/"+nro_carta[valor-1]+".png";
            }
            if(tipo==3){
               	this.aux[i].img="../img/Trebol/"+nro_carta[valor-1]+".png";
            }
            valor++;
            if (valor == 14) {
                valor = 1;
                tipo++;
                if (tipo == 4) {
                    tipo = 0;
                }
            }
        }
	}
    this.mazo2=this.mazo;
	this.barajear = function(){
        var r=0;
		while(this.aux.length>0){
		    r = Math.floor((Math.random() * this.aux.length));
			this.mazo.push(this.aux[r]);
			this.aux.splice(r,1);
		}
	}

    this.cargar_jugadores = function(){
        for(var i=0; i<4; i++){
            //alert("Creando Jugador "+(i+1),"Ventana");
            this.jugadores.push(new jugador("jugador "+(i+1)));
        }
        this.jugadores.push(new jugador("Mesa"));
    }
}
var bb = new blackjack();
bb.cargar_mazo();
bb.barajear();
bb.cargar_jugadores();

/*Entregando Primera Carta*/
for(var i=0; i<5;i++){
    bb.jugadores[i].stack.push(bb.mazo.pop());
}

/*Entregando Segunda Carta*/
window.setTimeout("cargar2()",4000);

var ronda=0;
var turno=1;
var intevalo;
var Njugadores=bb.jugadores.length;

jugar =function(){

        if(turno == 1)
            {
                document.getElementById("j1n").style.color = "#FFC416";
                document.getElementById("j2n").style.color = "#FFF";
                document.getElementById("j3n").style.color = "#FFF";
                document.getElementById("j4n").style.color = "#FFF";
            }
        if(turno == 2)
            {
                
                document.getElementById("j1n").style.color = "#FFF";
                document.getElementById("j2n").style.color = "#FFC416";
                document.getElementById("j3n").style.color = "#FFF";
                document.getElementById("j4n").style.color = "#FFF";
            }
        if(turno == 3)
            {
                
                document.getElementById("j1n").style.color = "#FFF";
                document.getElementById("j2n").style.color = "#FFF";
                document.getElementById("j3n").style.color = "#FFC416";
                document.getElementById("j4n").style.color = "#FFF";
            }
        if(turno == 4)
            {
                document.getElementById("j1n").style.color = "#FFF";
                document.getElementById("j2n").style.color = "#FFF";
                document.getElementById("j3n").style.color = "#FFF";
                document.getElementById("j4n").style.color = "#FFC416";
            } 
        if(turno == 5)
            {
                document.getElementById("j1n").style.color = "#FFF";
                document.getElementById("j2n").style.color = "#FFF";
                document.getElementById("j3n").style.color = "#FFF";
                document.getElementById("j4n").style.color = "#FFF";
            } 
            
        if( pensar()=="pedir" && Poder_pedir()==true)
         {                  
            bb.jugadores[turno-1].stack.push(bb.mazo.pop());
            var nj = "j"+turno;
            var img = document.createElement("img");
            img.src = bb.jugadores[turno-1].stack[bb.jugadores[turno-1].stack.length-1].img;
            var src = document.getElementById(nj);
            src.appendChild(img);
            contar();
        }
        else
        {
            turno++;
                if(turno == 6)
                {
                    turno = 1;    
                    window.setTimeout("buscar_ganador();",2000);
                }
        }
        

}

buscar_ganador = function()
{
    var t1,t2,t3,t4,t5;
    t1=document.getElementById("j1t").innerHTML;
    if (t1>21) t1=0;
    t2=document.getElementById("j2t").innerHTML;
    if (t2>21) t2=0;
    t3=document.getElementById("j3t").innerHTML;
    if (t3>21) t3=0;
    t4=document.getElementById("j4t").innerHTML;
    if (t4>21) t4=0;
    t5=document.getElementById("j4t").innerHTML;
    if (t5>21) t5=0;
    var gan="",ganG="",j,GP=0,GT=0;

    if ((t1>=t2 && t1>=t3 && t1>=t4 && t1>=t5 && t1!=0) || t1==21  ){
        j=1;GP=0;GT=0;
        for (var i = 0; i < bb.jugadores[j].stack.length; i++) {
            if(bb.jugadores[j].stack[i].tipo==2)
                GP++;
            if(bb.jugadores[j].stack[i].tipo==3)
                GT++;
        }
        gan=gan+j;
        if(GP==bb.jugadores[j].stack.length) ganG=ganG+j;
        if(GT==bb.jugadores[j].stack.length) ganG=ganG+j;
    }
    if ((t2>=t1 && t2>=t3 && t2>=t4 && t2>=t5 && t2!=0) || t2==21){
        j=2;GP=0;GT=0;
        for (var i = 0; i < bb.jugadores[j].stack.length; i++) {
            if(bb.jugadores[j].stack[i].tipo!=2)
                GP=false;
            if(bb.jugadores[j].stack[i].tipo!=3)
                GT=false;
        }
        gan=gan+j;
        if(GP==bb.jugadores[j].stack.length) ganG=ganG+j;
        if(GT==bb.jugadores[j].stack.length) ganG=ganG+j;
    }
    if ((t3>=t2 && t3>=t1 && t3>=t4 && t3>=t5 && t3!=0) || t3==21){
        j=3;GP=0;GT=0;
        for (var i = 0; i < bb.jugadores[j].stack.length; i++) {
            if(bb.jugadores[j].stack[i].tipo!=2)
                GP=false;
            if(bb.jugadores[j].stack[i].tipo!=3)
                GT=false;
        }
        gan=gan+j;
        if(GP==bb.jugadores[j].stack.length) ganG=ganG+j;
        if(GT==bb.jugadores[j].stack.length) ganG=ganG+j;
    }
    if ((t4>=t2 && t4>=t3 && t4>=t1 && t4>=t5 && t4!=0) || t4==21){
        j=4;GP=0;GT=0;
        for (var i = 0; i < bb.jugadores[j].stack.length; i++) {
            if(bb.jugadores[j].stack[i].tipo!=2)
                GP=false;
            if(bb.jugadores[j].stack[i].tipo!=3)
                GT=false;
        }
        gan=gan+j;
        if(GP==bb.jugadores[j].stack.length) ganG=ganG+j;
        if(GT==bb.jugadores[j].stack.length) ganG=ganG+j;
    }
    if(ganG.length>0){
        if (ganG.length==1) {
            var p=parseInt (document.getElementById("j"+ganG.charAt(0)+"p").innerHTML);
            p+=3;
            document.getElementById("j"+ganG.charAt(0)+"p").innerHTML = p; 
        }
        else {
            for (var i = 0; i < ganG.length; i++) {
                var p=parseInt (document.getElementById("j"+ganG.charAt(i)+"p").innerHTML);
                p++;
                document.getElementById("j"+ganG.charAt(i)+"p").innerHTML = p;
            }
        }
    }
    if(gan.length>0 && ganG.length==0){
        if (gan.length==1) {
            var p=parseInt (document.getElementById("j"+gan.charAt(0)+"p").innerHTML);
            p+=2;
            document.getElementById("j"+gan.charAt(0)+"p").innerHTML = p; 
        }
        else {
            for (var i = 0; i < gan.length; i++) {
                var p=parseInt (document.getElementById("j"+gan.charAt(i)+"p").innerHTML);
                p++;
                document.getElementById("j"+gan.charAt(i)+"p").innerHTML = p;
            }
        }
    }
    window.clearInterval(intevalo);
    document.getElementById("j1n").style.color = "#FFF";
    document.getElementById("j2n").style.color = "#FFF";
    document.getElementById("j3n").style.color = "#FFF";
    document.getElementById("j4n").style.color = "#FFF";
    for (var i = 0; i < bb.jugadores.length; i++) {
        var nj = "j"+(i+1);
        var d = document.getElementById(nj);
        document.getElementById(nj+"t").innerHTML = 0;
        while (d.hasChildNodes())
            d.removeChild(d.firstChild);
        bb.jugadores[i].stack.length=0;
    }
    if (Poder_repartir()==true) {
    window.setTimeout("repartir()",2000); 
    }
    
}

repartir = function()
{
    /*Entregando Primera Carta*/
    for(var i=0; i<5;i++){
        bb.jugadores[i].stack.push(bb.mazo.pop());
    }
    cargar();
    /*Entregando Segunda Carta*/
    window.setTimeout("cargar2()",4000);    
}
 
pensar = function()
{
    var resp;
    var nj = "j"+turno+"t";
    var total = document.getElementById(nj).innerHTML;
    if (total >=17 || total == 21 || total>21) 
    {
        resp="pase";
    }
    else
        resp="pedir";

    return resp;
}

contar = function(){
    
    for (var i = 0; i < bb.jugadores.length; i++) {
        var nj = "j"+(i+1)+"t";
        var cont=0; 
        for (var j = 0; j < bb.jugadores[i].stack.length; j++) {
            if (bb.jugadores[i].stack[j].valor>9) {
                cont+=10;
            }
            else if (bb.jugadores[i].stack[j].valor == 1 && (cont+11)<=21) {
                cont+=11;
            }
            else if (bb.jugadores[i].stack[j].valor<=9 ) {
                cont+=bb.jugadores[i].stack[j].valor;
            }
        }
        document.getElementById(nj).innerHTML = cont;
    }
}

Poder_pedir = function()
{
    if(bb.mazo.length>=Njugadores*5)
    {
        return true;
    } 
    else
    {
        return false;
    }

}

Poder_repartir = function()
{
    if(bb.mazo.length>=Njugadores*2)
    {
        return true;
    } 
    else
    {
        return false;
    }

}


cargar = function(){

    for (var i = 0; i < bb.jugadores.length; i++) {
        var nj = "j"+(i+1);
        for (var j = 0; j < bb.jugadores[i].stack.length; j++) {
            var img = document.createElement("img");
            img.src = bb.jugadores[i].stack[j].img;
            var src = document.getElementById(nj);
            src.appendChild(img);
        }
    }
contar();
}


cargar2 = function(){
    for(var i=0; i<5;i++){
        bb.jugadores[i].stack.push(bb.mazo.pop());
    }
    for (var i = 0; i < bb.jugadores.length; i++) {
        var nj = "j"+(i+1);
        var img = document.createElement("img");
        img.src = bb.jugadores[i].stack[bb.jugadores[i].stack.length-1].img;
        var src = document.getElementById(nj);
        src.appendChild(img);
    }
    contar();
    intevalo= window.setInterval('jugar()',2000);

}