/*----------------------------------------------------------------------------------------------------------------
funcion que captura la ip del equipo y la guarda en la variable ip
----------------------------------------------------------------------------------------------------------------*/
var ip =function(){
    var os = require('os');
    var ifaces = os.networkInterfaces();
    try{
        if (os.platform() === 'darwin'){
            return ifaces.en1[1].address;
        } else{
            var alias = 0;
            var ip;
            Object.keys(ifaces).forEach(function(ifname){

                ifaces[ifname].forEach(function(iface){

                    if ('IPv4' !== iface.family || iface.internal !== false){
                        return;
                    }
                    if (alias==0){
                        ip = iface.address;
                    }
                     alias++;
                });
            });
            return ip;
        }
    }catch(err){
        console.log(err);
    }
}();
/*----------------------------------------------------------------------------------------------------------------
funcion que retorna los mensajes tipo json para mandar
----------------------------------------------------------------------------------------------------------------*/
var mensaje = function(codigo){
    var json;
    switch (codigo) {
        case 1:
            json = {codigo:1,
                    nombre:"servidor",
                    tiempo:120,
                    espacios: 4}
            break;
        case 3:
            json = {codigo:3,
                    aceptado:true,
                    direccion:ip_multi,
                    puerto:port_multi,
                    id:0}
            break;
        case 4:
            json = {codigo:4,
                    /*jugadores:[{nombre,id}]*/                    
                    jugadores:[]}
            break;
        case 5:
                    /*puntaje:[{id:0,puntaje:0}]*/
				if (Njugadores==5) {
					json ={
								codigo:5,
								puntaje:[{id:null,puntaje:null},{id:null,puntaje:null},{id:null,puntaje:null},{id:null,puntaje:null},{id:null,puntaje:null}]
								};
				};
				if (Njugadores==4) {
					json ={
								codigo:5,
								puntaje:[{id:null,puntaje:null},{id:null,puntaje:null},{id:null,puntaje:null},{id:null,puntaje:null}]
					};
				};
				if (Njugadores==3) {
					json ={
								codigo:5,
								puntaje:[{id:null,puntaje:null},{id:null,puntaje:null},{id:null,puntaje:null}]
					};
				};
				if (Njugadores==2) {
					json ={
								codigo:5,
								puntaje:[{id:null,puntaje:null},{id:null,puntaje:null}]
					};
				};
				if (Njugadores==1) {
					json ={
								codigo:5,
								puntaje:[{id:null,puntaje:null}]
					};
				};
            break;
        case 7:
            json = {codigo:7,
                    id:0}
            break;
        case 9:
            json = {codigo:9,
                    id:7,
                    carta:"#tipo"}
            break;
        case 10:
				if (Njugadores==5) {
				json ={
						codigo:10,
						rondas:0,
						cartas_jugadas:0,
						puntaje:[{id:null,puntaje:null},{id:null,puntaje:null},{id:null,puntaje:null},{id:null,puntaje:null},{id:null,puntaje:null}],
						desempate:null
					};
				};
				if (Njugadores==4) {
				json ={
						codigo:10,
						rondas:0,
						cartas_jugadas:0,
						puntaje:[{id:null,puntaje:null},{id:null,puntaje:null},{id:null,puntaje:null},{id:null,puntaje:null}],
						desempate:null
						};
				};
				if (Njugadores==3) {
				json ={
						codigo:10,
						rondas:0,
						cartas_jugadas:0,
						puntaje:[{id:null,puntaje:null},{id:null,puntaje:null},{id:null,puntaje:null}],
						desempate:null
						};
				};
				if (Njugadores==2) {
				json ={
						codigo:10,
						rondas:0,
						cartas_jugadas:0,
						puntaje:[{id:null,puntaje:null},{id:null,puntaje:null}],
						desempate:null
					};
				};
				if (Njugadores==1) {
				json ={
						codigo:10,
						rondas:0,
						cartas_jugadas:0,
						puntaje:[{id:null,puntaje:null}],
						desempate:null
					};
				};  
            break;
        case 11:
            json = {codigo:11,
                    id:0}
            break;
    }
    return json;
}
/*----------------------------------------------------------------------------------------------------------------
                                            varibles de conexion
----------------------------------------------------------------------------------------------------------------*/
var dgram = require('dgram');
var net = require('net');
var message;
var ip_broadcast;
var ip_multi;
var port_udp;
var port_tcp;
var port_multi;
var json = mensaje(1);
var clients =[];
var Cnom=[];
var Cnom2=[];
var jugador0={nombre:"",id_asignado:null}; 
var jugador1={nombre:"",id_asignado:null};
var jugador2={nombre:"",id_asignado:null};
var jugador3={nombre:"",id_asignado:null};
var jugador4={nombre:"",id_asignado:null};
var Empatados=[];
var Bonus=[false,false,false,false,false];
var AcptarBonus=true;
var cartas = ["pica","corazon","trebol","diamante"];
var serverUDP;
var serverTCP;
var serverMUL;
var hilo;
var id=1;
var jugando;
var nombre;
/*----------------------------------------------------------------------------------------------------------------
                                            varibles de blackjack
----------------------------------------------------------------------------------------------------------------*/
var bb;
var turno=1;
var ronda=0;
var jugando;
var Njugadores=4;
var Cartas_Mazo=4; //104
var cartas_jugadas=0;
/*----------------------------------------------------------------------------------------------------------------
                                            funciones de conexion
----------------------------------------------------------------------------------------------------------------*/
/*----------------------------------------------------------------------------------------------------------------
funcion encargada de leer la configuracion y ejecutar el TCP UDP y Multicast
----------------------------------------------------------------------------------------------------------------*/
function iniciar() {
    var fs = require('fs');
    fs.readFile('./dir/configuracion.txt', 'utf8', function(err, data) {
        if( err ){
            console.log(err)
        }
        else{
            res = data.split("-");
            ip_broadcast= res[0];
            ip_multi= res[1];
            port_udp= res[2];
            port_tcp= res[3];
            port_multi= res[4];
            console.log("Datos de conexion: "+"IB: "+ip_broadcast+"IM: "+ip_multi+"PU: "+port_udp+"PT: "+port_tcp+"PM: "+port_multi);
            json.nombre=nombre;
            UDP(json,ip_broadcast,port_udp);
            TCP(mensaje(3),ip,port_tcp);
            Multicast(ip_multi,port_multi);
      }
    });
}
/*----------------------------------------------------------------------------------------------------------------
funcion encargada de mandar el broacast y escuchar por UDP recibe el mensaje que recibe 
es para mandar la presentacion del servidor, la ip de bradcast y el puerto UDP
----------------------------------------------------------------------------------------------------------------*/
function UDP(json,ip_broadcast,port){
    serverUDP = dgram.createSocket("udp4");
    serverUDP.on('error', (err) => {
    console.log(`server error:\n${err.stack}`);
    serverUDP.close();
    });

    serverUDP.bind(function(){
        serverUDP.setBroadcast(true);   
    });

    hilo =setInterval(function(){
            json.tiempo=""+json.tiempo;
            json.espacios=""+(4-clients.length);
            message = new Buffer(JSON.stringify(json));
            console.log(json.nombre+" "+json.espacios+" "+json.tiempo);
            serverUDP.send(message, 0, message.length, port, ip_broadcast, function(err, bytes) {
            if(err){console.log(err);}});
        json.tiempo=json.tiempo-1;
        if(json.espacios<=0){
            enviar_empezar();
        }
        if(json.tiempo==0 && json.espacios<=2){
            enviar_empezar();
        }
        if(json.tiempo==0){
            json.tiempo=120;
        }
        if(json.espacios==2){
            document.getElementsByTagName("button")[0].disabled=false;
        }
    },1000);    
}
/*----------------------------------------------------------------------------------------------------------------
funcion encargada de mandar el TCP y escuchar por TCP recibe, el json corresponde al mensaje de acepacion la 
ip del cliente y el puerto TCP para asi crear el socket con ese cliente y mandar mensajes mas adelante
----------------------------------------------------------------------------------------------------------------*/
function TCP(json,ip,port_tcp){
    serverTCP = net.createServer(function(socket) {

    console.log('client connected');
    socket.name = socket.remoteAddress;
    clients.push(socket);
    socket.on('error', (e) => {
            /*Llamar aqui la funcion que quita el cliente de los vectores
                la ip del cliente q se desconecta esta guarda en socket.name
            */
            console.log(socket.name);
            var pos = busacar_socket(socket.name)+1;
            var json2 = mensaje(11);
            json2.id=Cnom[pos].id;
            enviarmulti(json2);  
            quitar_desconectados(pos);
            quitar_desconectados_vectores(pos);

     });
    socket.on('end', () => {
        console.log('client disconnected');
    });
    
    socket.on('data', (data) => {
        var recibido = JSON.parse(data);
        var j={nombre:"",id:null}  
        j.nombre=recibido.nombre;
        j.id=id;
        id++;
        if(Cnom.length<Njugadores){
            Cnom.push(j);
        }
        console.log("llego por TCP.......");
        console.log(recibido);
        switch (recibido.codigo) {
            case 2:
                var cuadro = document.getElementById(clients.length+"n");
                cuadro.innerHTML=recibido.nombre;
                cuadro.style.backgroundColor="Chocolate";
                cuadro = document.getElementById(clients.length);
                cuadro.style.backgroundImage="url('../img/"+cartas[clients.length-1]+".png')";
                cuadro.innerHTML="";   
            break;
            case 6:
                var pos=busacar_socket(socket.name)+1;
                if (AcptarBonus==true && bb.jugadores[pos].puntos>0){
                    Bonus[pos]=recibido.bono;
                }
            break;
            case 8:                
                if(recibido.jugar==true && Poder_pedir()==true && document.getElementById("j"+turno+"t").innerHTML<21)
                {                  
                    
                    bb.jugadores[turno].stack.push(bb.mazo.pop());
                    var j =buscar_id(turno);
                    enviar_carta(bb.jugadores[turno].stack[bb.jugadores[turno].stack.length-1],j);
                    cargar3(turno);
                    contar();
                }
                else
                {
                    turno++;
                    if(turno == Njugadores)
                    {
                        turno = 0;    
                    }
                }
            break;        
        }
    });  
    json.id=id;
    socket.write(JSON.stringify(json));
    });
    serverTCP.listen(port_tcp,ip, () => {
    console.log('server escuchando');
    });
} 
/*----------------------------------------------------------------------------------------------------------------
funcion encargada de escuchar por Multicast recibe la ip de multicast y el puerto milticast
----------------------------------------------------------------------------------------------------------------*/
function Multicast(ip_multi,port_multi){
  var dgram = require('dgram'); 
  serverMUL = dgram.createSocket("udp4"); 
  serverMUL.bind( function() {
    serverMUL.setBroadcast(true)
    serverMUL.setMulticastTTL(128);
  });  
}
/*----------------------------------------------------------------------------------------------------------------
funcion encargada de escuchar por Multicast recibe la ip de multicast y el puerto milticast
----------------------------------------------------------------------------------------------------------------*/
function enviarmulti(json) {

      var message = new Buffer(JSON.stringify(json));
      serverMUL.send(message, 0, message.length, port_multi,ip_multi);
      console.log("Enviando Multicast...");
      console.log(json);
}
/*----------------------------------------------------------------------------------------------------------------
funcion encargada de mandar el mensaje prentacion del juego por multicast y agregar a la mesa a la lista de 
jugadores y llama a empezar()
----------------------------------------------------------------------------------------------------------------*/
function enviar_empezar(){
    var json2 = mensaje(4);
    var j2={nombre:"",id:null}; 
    j2.nombre="Mesa";
    j2.id=0;
    Cnom.push(j2);
    for (var i = 0; i <Cnom.length; i++) {
    	if (i==0)
    	 {
    		jugador0.id_asignado=Cnom[i].id;
    		jugador0.nombre=Cnom[i].nombre;
    		Cnom2.push(jugador0); 	
    	 }
    	 if (i==1)
    	 {
    		jugador1.id_asignado=Cnom[i].id;
    		jugador1.nombre=Cnom[i].nombre;
    		Cnom2.push(jugador1); 	
    	 }
    	 if (i==2)
    	 {
    		jugador2.id_asignado=Cnom[i].id;
    		jugador2.nombre=Cnom[i].nombre;
    		Cnom2.push(jugador2); 	
    	 }
    	 if (i==3)
    	 {
    		jugador3.id_asignado=Cnom[i].id;
    		jugador3.nombre=Cnom[i].nombre;
    		Cnom2.push(jugador3); 	
    	 }
    	 if (i==4)
    	 {
    		jugador4.id_asignado=Cnom[i].id;
    		jugador4.nombre=Cnom[i].nombre;
    		Cnom2.push(jugador4); 	
    	 }
    	
    }
    for (var i = 0; i <Cnom.length; i++) {
        json2.jugadores.push(Cnom2[i]);
    } 
    enviarmulti(json2);           
    empezar();
}
/*----------------------------------------------------------------------------------------------------------------
funcion encargada de enviar  por Multicast la carta hace la conversion de los numeros a las letras
1->A 11->J 12->Q 13->K asi como abreviar los tipos a C,D,P,T recibe la carta y el id del jugador que le corrsponde
----------------------------------------------------------------------------------------------------------------*/
function enviar_carta(carta,id){
    var json2 = mensaje(9);
    json2.id=id;
    var tipo=["C","D","P","T"];
    switch (carta.valor) {
        case 1:
            json2.carta="A"+ tipo[carta.tipo];        
        break;
        case 11:
            json2.carta="J"+ tipo[carta.tipo];
        break;
        case 12:
            json2.carta="Q"+ tipo[carta.tipo];
        break;
        case 13:
            json2.carta="K"+ tipo[carta.tipo];
        break;
        default:
            json2.carta=""+carta.valor+ tipo[carta.tipo];
        break;
    }
    cartas_jugadas++;
    json2.carta=json2.carta.toLowerCase();
    enviarmulti(json2);  
}
/*----------------------------------------------------------------------------------------------------------------
funcion encargada de enviar por Multicast el mensaje de iniciar la ronda limpia la interfaz y manda los puntos asi
como empeiza a repartir de nuevo
----------------------------------------------------------------------------------------------------------------*/
function inicio_ronda(){
    var json2  =mensaje(5);  
    Bonus=[false,false,false,false,false];
    var AcptarBonus=true;
    turno=1;
    ronda++;
    limpiar();
    var p1={id:null,puntaje:null};
    var p2={id:null,puntaje:null};
    var p3={id:null,puntaje:null};
    var p4={id:null,puntaje:null};
    var enviar=[];    
    for (var i = 1; i < Njugadores; i++) {
        json2.puntaje[i-1].id=Cnom[i].id;
        json2.puntaje[i-1].puntaje=bb.jugadores[i].puntos;
    }
    json2.puntaje[Njugadores-1].id=Cnom[0].id;
    json2.puntaje[Njugadores-1].puntaje=0;

    enviarmulti(json2);
    window.setTimeout("repartir()",2000);    
}
/*----------------------------------------------------------------------------------------------------------------
funcion encargada de enviar por Multicast el mensaje de final de ronda
----------------------------------------------------------------------------------------------------------------*/
function fin_partida(){
	var json2=mensaje(10);
    limpiar();
    for (var i = 1; i < Njugadores; i++) {
        json2.puntaje[i-1].id=Cnom[i].id;
        json2.puntaje[i-1].puntaje=bb.jugadores[i].puntos;
    }
    json2.puntaje[Njugadores-1].id=Cnom[0].id;
    json2.puntaje[Njugadores-1].puntaje=0;
    
    json2.rondas=ronda;
    json2.desempate=buscar_empate();
    json2.cartas_jugadas=0;
    json2.cartas_jugadas+=cartas_jugadas;
    enviarmulti(json2);
    if (buscar_empate()==true)
        jugar_empate();
    else
        mostrar_estadisticas(json2);
}
/*----------------------------------------------------------------------------------------------------------------
funcion que recibe el turno en el que se encuentra la partida y te da el id del jugador que juega en ese turno
----------------------------------------------------------------------------------------------------------------*/
function buscar_id(turno){
    for (var i = 0; i < Njugadores; i++) {
        if (i==turno) {
            return Cnom[i].id;
        }
    }
    return null;
}
/*----------------------------------------------------------------------------------------------------------------
funcion encargada conseguir el turno correspondiente de cada jugador con su id
----------------------------------------------------------------------------------------------------------------*/
function buscar_jugador(id){
    var pos;
    for (var i = 0; i < Cnom.length; i++) {
        if (Cnom[i].id==id) {
            pos=i;
            break;
        }
    }
    return pos;
}
/*----------------------------------------------------------------------------------------------------------------
funcion encargada de devolver la posicion del socket segun su nombre
----------------------------------------------------------------------------------------------------------------*/
function busacar_socket(name){
    var pos;
    for (var i = 0; i < clients.length; i++) {
        if (clients[i].name==name) {
            pos=i;
            break;
        }
    }
    return pos;
}
/*----------------------------------------------------------------------------------------------------------------
funcion encargada de enviar por TCP a cada jugador si desea pedir otra carta recibe el turno
para saber a que jugador enviar el mensaje
----------------------------------------------------------------------------------------------------------------*/
function ofertar_carta(turno){
        
    var json2 = mensaje(7);
    json2.id=buscar_id(turno);
    clients[turno-1].write(JSON.stringify(json2));
}
/*----------------------------------------------------------------------------------------------------------------
                                                objetos de mesa
----------------------------------------------------------------------------------------------------------------*/
/*----------------------------------------------------------------------------------------------------------------
objeto jugador recibe el nombre tiene su pila de cartas y sus puntos
----------------------------------------------------------------------------------------------------------------*/
function jugador(nombre) {
    this.nombre = nombre;
    this.stack = [];
    this.puntos = 0;
}
/*----------------------------------------------------------------------------------------------------------------
objeto carta recibe el valor que son numeros de 1 al 13 siendo asi
1 2 3 4 5 6 7 8 9 10 11 12 13
A 2 3 4 5 6 7 8 9 10 J  Q  K
a nivel de logica se trabaja con numeros de interfaz y envio de mensajes son con letras y numeros
y el tipo en nuemros del 0 al 4
0->Corazon
1->Diamente
2->Pica
3->Trebol
----------------------------------------------------------------------------------------------------------------*/
function carta(valor,tipo){
    this.img="";
    this.valor=valor;
    this.tipo=tipo;
}
/*----------------------------------------------------------------------------------------------------------------
objeto de blackjack que carga el mazo lo barajea y carga a los jugadores que jugaran en la partida los jugadores
que llegan por multicast estan ordenados con la mesa como ultimo jugador el metodo cargar jugador se encarga de
poner a la mesa como el primer jugador debido a que de esta forma trabaja nuestro juego
----------------------------------------------------------------------------------------------------------------*/
function blackjack(){
    this.aux= new Array();
    this.mazo=new Array();
    this.mazo2=new Array();
    this.jugadores=new Array();

    this.cargar_mazo = function(){
        var valor = 1;
        var tipo = 0;
        var nro_carta = ["A",2,3,4,5,6,7,8,9,10,"J","Q","K"];
        for (var i = 0; i < Cartas_Mazo; i++) {
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

    this.cargar_jugadores = function(t){
        var aux_cnom = [];
        aux_cnom[0] = Cnom[t-1];
        for (var i = 0; i < t-1; i++) {
            aux_cnom[i+1]=Cnom[i];
        }
        Cnom = aux_cnom;

        for(var i=0;i<t;i++){
            this.jugadores.push(new jugador(Cnom[i].nombre));
            this.jugadores[i].puntos=0;
            if (i!=0) {
            var nj="j"+i+"n";
            document.getElementById(nj).innerHTML=Cnom[i].nombre;
            }
        }
    }
}
/*----------------------------------------------------------------------------------------------------------------
                                                funciones de mesa
----------------------------------------------------------------------------------------------------------------*/
/*----------------------------------------------------------------------------------------------------------------
funcion encargada de quitar los puntos y los totales de los jugadores no conectados
----------------------------------------------------------------------------------------------------------------*/
function quitar_desconectados(turno){

    var nj="j"+turno+"t";
    document.getElementById(nj).innerHTML = "";
    var nj="j"+turno+"p";
    document.getElementById(nj).innerHTML = "";
    nj="j"+turno+"n";
    document.getElementById(nj).innerHTML= "Desconectado";
}
/*----------------------------------------------------------------------------------------------------------------
funcion encargada de borrar los jugaores de los vetores que se usan para jugar 
----------------------------------------------------------------------------------------------------------------*/
function quitar_desconectados_vectores(pos){

    bb.jugadores.splice(pos,1);
    Cnom.splice(pos,1);
    Njugadores=bb.jugadores.length;
    console.log("se desconecto..................");
    console.log("juadores");
    console.log(bb.jugadores);
    console.log("Cnom");
    console.log(Cnom);
    if (Njugadores==1)
     {
        window.alert("Se desconectaron todos jugadores");
        volver();
     }

}
/*----------------------------------------------------------------------------------------------------------------
funcion encargada de epmezar la partida de blackjack limpiado el html por la mesa asi como crear los objetos y 
iniciar la ronda
----------------------------------------------------------------------------------------------------------------*/
function empezar(){
    var node = document.getElementById("hserver");
    if (node.parentNode) {
      node.parentNode.removeChild(node);
    }    
    document.getElementsByTagName("HEAD")[0].innerHTML+='<link rel="stylesheet" href="../css/mesa.css">';
    clearInterval(hilo);
    serverUDP.close();
    const remote = require('electron').remote;
    var win = remote.getCurrentWindow();
    win.maximize();
    bb = new blackjack();
    bb.cargar_mazo();
    bb.barajear();

    bb.cargar_jugadores(Cnom.length);
    console.log("------------------Jugadores:-----------------");
    console.log(bb.jugadores);
    Njugadores=Cnom.length;//
    for (var i =Njugadores; i <5 ; i++) {
        quitar_desconectados(i);
    }
    inicio_ronda();
}
/*----------------------------------------------------------------------------------------------------------------
funcion encargada quitar las cartas y reiciar los totales en cada ronda
----------------------------------------------------------------------------------------------------------------*/
function limpiar(){
    window.clearInterval(jugando);
    for (var i = 0; i < Njugadores; i++) {
        var nj = "j"+i;
        var d = document.getElementById(nj);
        document.getElementById(nj+"t").innerHTML = 0;
        while (d.hasChildNodes())
            d.removeChild(d.firstChild);
        bb.jugadores[i].stack.length=0;
    }
}
/*----------------------------------------------------------------------------------------------------------------
funcion encargada de jugar manda las solicitud a cada jugador para que juegue y pintar el nombrer de cada jugador
segun su turno, envia multicast cuando el turno es de la mesa 
----------------------------------------------------------------------------------------------------------------*/
function jugar (){
        console.log("turno-----------");
        console.log(turno);
        console.log("cartas restantes........");
        console.log(bb.mazo.length);
        console.log("cartas jugadas........");
        console.log(cartas_jugadas);
        if(turno == 0)
        {
            document.getElementById("j1n").style.color = "#FFF";
            document.getElementById("j2n").style.color = "#FFF";
            document.getElementById("j3n").style.color = "#FFF";
            document.getElementById("j4n").style.color = "#FFF";
            if (pensar()=="pedir" && Poder_pedir()==true) {
                bb.jugadores[0].stack.push(bb.mazo.pop());
                cargar3(0);
                enviar_carta(bb.jugadores[0].stack[bb.jugadores[0].stack.length-1],Cnom[0].id);
            }
            else
            {
                buscar_ganador();
                clearInterval(jugando);
            }
            
        } 
        if(turno == 1)
        {
            document.getElementById("j1n").style.color = "#FFC416";
            document.getElementById("j2n").style.color = "#FFF";
            document.getElementById("j3n").style.color = "#FFF";
            document.getElementById("j4n").style.color = "#FFF";
            ofertar_carta(1);   
        }
        if(turno == 2)
        {
            
            document.getElementById("j1n").style.color = "#FFF";
            document.getElementById("j2n").style.color = "#FFC416";
            document.getElementById("j3n").style.color = "#FFF";
            document.getElementById("j4n").style.color = "#FFF";
            ofertar_carta(2);
        }
        if(turno == 3)
        {
            
            document.getElementById("j1n").style.color = "#FFF";
            document.getElementById("j2n").style.color = "#FFF";
            document.getElementById("j3n").style.color = "#FFC416";
            document.getElementById("j4n").style.color = "#FFF";
            ofertar_carta(3);
        }
        if(turno == 4)
        {
            document.getElementById("j1n").style.color = "#FFF";
            document.getElementById("j2n").style.color = "#FFF";
            document.getElementById("j3n").style.color = "#FFF";
            document.getElementById("j4n").style.color = "#FFC416";
            ofertar_carta(4);
        }     
}
/*----------------------------------------------------------------------------------------------------------------
funcion encargada tomar la desicion de la mesa para saber si pedir o pasar se basa en que si tiene 
menos de 17 pide de lo contrario pasa
----------------------------------------------------------------------------------------------------------------*/
function pensar(){
    var resp;
    var nj = "j0t";
    var total = document.getElementById(nj).innerHTML;
    if (total >=17 || total == 21 || total>21) 
    {
        resp="pase";
    }
    else
        resp="pedir";

    return resp;
}
/*----------------------------------------------------------------------------------------------------------------
funcion encargada de verificar lo acumulado por cada jugador y la mesa para saber quien gano la ronda
asi como sumar los puntos en caso de empate y victoria normal o victoria de blackjack perfecta luego inicia la
ronda nueva al ajustar estos valores para luego mandar
----------------------------------------------------------------------------------------------------------------*/
function buscar_ganador(){
    var gan=[],ganG=[],j,GP=true,GT=true;
    var mayor=0;
    p=0;
    var t=[5];
    t[0]=document.getElementById("j0t").innerHTML;
    if (t[0]>21) t[0]=0;
    t[1]=document.getElementById("j1t").innerHTML;
    if (t[1]>21) t[1]=0;
    t[2]=document.getElementById("j2t").innerHTML;
    if (t[2]>21) t[2]=0;
    t[3]=document.getElementById("j3t").innerHTML;
    if (t[3]>21) t[3]=0;
    t[4]=document.getElementById("j4t").innerHTML;
    if (t[4]>21) t[4]=0;
    

    for (var i = 0; i < Njugadores; i++)
    {
        if (t[i]>=mayor) {
            mayor=t[i];
        }
    }
    if (t[0]==mayor)
    {
        j=0;GP=true;GT=true;
        gan.push(j);
        if (document.getElementById("j"+j+"t").innerHTML==21)
        {
            for (var i = 0; i < bb.jugadores[j].stack.length; i++) {
                if(bb.jugadores[j].stack[i].tipo!=2)
                    GP=false;
                if(bb.jugadores[j].stack[i].tipo!=3)
                    GT=false;
            }
            if(GP==true) ganG.push(j);
            if(GT==true) ganG.push(j);
        }
        
    }


    if (t[1]==mayor)
    {
        j=1;GP=true;GT=true;
        gan.push(j);
        if (document.getElementById("j"+j+"t").innerHTML==21)
        {
            for (var i = 0; i < bb.jugadores[j].stack.length; i++) {
                if(bb.jugadores[j].stack[i].tipo!=2)
                    GP=false;
                if(bb.jugadores[j].stack[i].tipo!=3)
                    GT=false;
            }
            if(GP==true) ganG.push(j);
            if(GT==true) ganG.push(j);
        }
    }
    if (t[2]==mayor)
    {
        j=2;GP=true;GT=true;
        gan.push(j);
        if (document.getElementById("j"+j+"t").innerHTML==21)
        {
            for (var i = 0; i < bb.jugadores[j].stack.length; i++) {
                if(bb.jugadores[j].stack[i].tipo!=2)
                    GP=false;
                if(bb.jugadores[j].stack[i].tipo!=3)
                    GT=false;
            }
            if(GP==true) ganG.push(j);
            if(GT==true) ganG.push(j);
        }
    }
    if (t[3]==mayor)
    {
        j=3;GP=true;GT=true;
        gan.push(j);
        if (document.getElementById("j"+j+"t").innerHTML==21)
        {
            for (var i = 0; i < bb.jugadores[j].stack.length; i++) {
                if(bb.jugadores[j].stack[i].tipo!=2)
                    GP=false;
                if(bb.jugadores[j].stack[i].tipo!=3)
                    GT=false;
            }
            if(GP==true) ganG.push(j);
            if(GT==true) ganG.push(j);
        }
    }
    if (t[4]==mayor)
    {
        j=4;GP=true;GT=true;
        gan.push(j);
        if (document.getElementById("j"+j+"t").innerHTML==21)
        {
            for (var i = 0; i < bb.jugadores[j].stack.length; i++) {
                if(bb.jugadores[j].stack[i].tipo!=2)
                    GP=false;
                if(bb.jugadores[j].stack[i].tipo!=3)
                    GT=false;
            }
            if(GP==true) ganG.push(j);
            if(GT==true) ganG.push(j);
        }
    }
    for (var i = 0; i < Njugadores-1; i++) {
        var t=parseInt (document.getElementById("j"+i+"t").innerHTML);   
        if (Bonus[i]==true && t!=21){
            var p=parseInt (document.getElementById("j"+i+"p").innerHTML);
            p--;
            document.getElementById("j"+i+"p").innerHTML = p; 
            }
    }

    if(ganG.length>0){
        if (ganG.length==1) {
            if (ganG[0]!=0) 
                {
                var p=parseInt (document.getElementById("j"+ganG[0]+"p").innerHTML);
                var t=parseInt (document.getElementById("j"+ganG[0]+"t").innerHTML);   
                if (Bonus[ganG[0]]==true && t==21)
                    p+=6;
                else
                    p+=3;
                document.getElementById("j"+ganG[0]+"p").innerHTML = p; 
                }
        }
        else {
            for (var i = 0; i < ganG.length; i++) {
            if (ganG[i]!=0) 
                {
                var p=parseInt (document.getElementById("j"+ganG[i]+"p").innerHTML);
                var t=parseInt (document.getElementById("j"+ganG[i]+"t").innerHTML);   
                if (Bonus[ganG[i]]==true && t==21)
                    p+=2;
                else
                    p++;
                document.getElementById("j"+ganG[i]+"p").innerHTML = p; 
                }
            }
        }
    }
    else{
        if (gan.length==1) {
            if (gan[0]!=0) 
                {
                var p=parseInt (document.getElementById("j"+gan[0]+"p").innerHTML);
                var t=parseInt (document.getElementById("j"+gan[0]+"t").innerHTML);   
                if (Bonus[gan[0]]==true && t==21)
                    p+=4;
                else
                    p+=2;
                document.getElementById("j"+gan[0]+"p").innerHTML = p; 
                }
        }
        else {
            for (var i = 0; i < gan.length; i++) {
            if (gan[i]!=0) 
                {
                var p=parseInt (document.getElementById("j"+gan[i]+"p").innerHTML);
                var t=parseInt (document.getElementById("j"+gan[i]+"t").innerHTML);   
                if (Bonus[gan[i]]==true && t==21)
                    p+=4;
                else
                    p+=2;
                document.getElementById("j"+gan[i]+"p").innerHTML = p; 
                }
            }
        }
    }

    for (var i = 1; i < Njugadores; i++) {
        var nj = "j"+i+"p";
        bb.jugadores[i].puntos=document.getElementById(nj).innerHTML;
    }
    if (Poder_repartir()==true) {
        window.setTimeout("inicio_ronda()",2000); 
    }
    else
    {
        window.setTimeout("fin_partida()",2000);    
    }
}
/*----------------------------------------------------------------------------------------------------------------
funcion encargada repartir las dos primeras cartas a todos los jugadores
----------------------------------------------------------------------------------------------------------------*/
function repartir(){
    /*Entregando Primera Carta*/
    turno=1;
    var AcptarBonus=false;
    for(var i=0; i<Njugadores;i++){
        bb.jugadores[i].stack.push(bb.mazo.pop());
        enviar_carta(bb.jugadores[i].stack[bb.jugadores[i].stack.length-1],Cnom[i].id);
    }
    cargar();
    /*Entregando Segunda Carta*/
    window.setTimeout("cargar2()",2000);    
}
/*----------------------------------------------------------------------------------------------------------------
funcion encargada de contar los puntos que acumula con las cartas cada jugador asi como cambiar el valor de A ya 
sea por 1 o 11 dependiendo del caso
----------------------------------------------------------------------------------------------------------------*/
function contar(){
    for (var i = 0; i < Njugadores; i++) {
        var nj = "j"+i+"t";
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
/*----------------------------------------------------------------------------------------------------------------
funcion que se encarga de buscar si existe un empate al final de la partida
----------------------------------------------------------------------------------------------------------------*/
function buscar_empate(){
    var mayor=0;
    Empatados.length=0;
    for (var i = 1; i < Njugadores; i++) {
        if(bb.jugadores[i].puntos>mayor)
        {
            mayor=bb.jugadores[i].puntos;
        }
    }
    for (var i = 1; i < Njugadores; i++) {
        if(bb.jugadores[i].puntos==mayor)
        {
            Empatados.push(Cnom[i]);
        }
    }
    if (Empatados.length==1)
        return false;
    else
        return true;
}
/*----------------------------------------------------------------------------------------------------------------
funcion que se encarga de solucionar el empate de la partidad le entrega una carta a todos lo jugadores empatados
al que tenga la mayor le suma un punto en caso de que varios salgan con la mayor se los suma a ambos de esta forma
llama de nuevo a buscar empate en caso de haberlo se llama a si misma la funcion y en caso de ya haber solucionado
el empate llama de nuevo a fin_partida para ya terminar con la partida
----------------------------------------------------------------------------------------------------------------*/
function jugar_empate(){

    var pos;
    var carta_alta=[];
    carta_alta.length=0;
    var mayor=0;
    for (var i = 0; i < Empatados.length; i++) {
        pos = buscar_jugador(Empatados[i].id);
        if (bb.mazo.length>0){
            bb.jugadores[pos].stack.push(bb.mazo.pop());    
            enviar_carta(bb.jugadores[pos].stack[bb.jugadores[pos].stack.length-1],Empatados[i].id);
            cargar3(pos);
            carta_alta.push(bb.jugadores[pos].stack[bb.jugadores[pos].stack.length-1].valor);
            cartas_jugadas++;
        }else{
            bb.jugadores[pos].stack.push(bb.mazo2.pop());    
            enviar_carta(bb.jugadores[pos].stack[bb.jugadores[pos].stack.length-1],Empatados[i].id);
            cargar3(pos);
            carta_alta.push(bb.jugadores[pos].stack[bb.jugadores[pos].stack.length-1].valor);
            cartas_jugadas++;
        }
    }
    for (var i = 0; i < Empatados.length; i++) {
        if (carta_alta[i]>mayor) {
            mayor=carta_alta[i];
        }
    }
    for (var i = 0; i < Empatados.length; i++) {
        pos=buscar_jugador(Empatados[i].id);
        if (carta_alta[i]==mayor) {
            bb.jugadores[pos].puntos++;
        }
    }
    if(buscar_empate()==true)
        jugar_empate();
    else
        fin_partida();
}
/*----------------------------------------------------------------------------------------------------------------
funcion encargada de mostrar las estadisticas finales del juego 
----------------------------------------------------------------------------------------------------------------*/
function mostrar_estadisticas(json){
   var node = document.getElementById("hmesa");
    if (node.parentNode) {
      node.parentNode.removeChild(node);
    }    
    document.getElementsByTagName("HEAD")[0].innerHTML+='<link rel="stylesheet" href="../css/estadisticas.css">'; 
    var table = document.getElementById("estadisticas"); 
    var mayor=-1;
    var aux;
    for (var i = 0; i < json.puntaje.length; i++) {
    	if (json.puntaje[i].puntaje>mayor) {
    		aux=Cnom[i];
    	}
    }
     /*fila*/
    var Ganador = table.insertRow(1);
    /*celas o columnas de la fila*/
    var titulo_Ganador = Ganador.insertCell(0);
    var valor_Ganador= Ganador.insertCell(1);
    titulo_Ganador.innerHTML = "Ganador";
    valor_Ganador.innerHTML = aux.nombre+" ID: "+aux.id;
    /*fila*/
    var ronda = table.insertRow(2);
    /*celas o columnas de la fila*/
    var titulo_ronda = ronda.insertCell(0);
    var valor_ronda= ronda.insertCell(1);
    titulo_ronda.innerHTML = "Ronda";
    valor_ronda.innerHTML = json.rondas;
    /*fila*/
    var Cartas_J = table.insertRow(3);
    /*celas o columnas de la fila*/
    var titulo_Cartas_J = Cartas_J.insertCell(0);
    var valor_Cartas_J= Cartas_J.insertCell(1);
    titulo_Cartas_J.innerHTML = "Cartas jugadas";
    valor_Cartas_J.innerHTML = json.cartas_jugadas;
    var puntos;
    var titulo_puntos;
    var valor_puntos;
    var j=4;
    for (var i = 0; i < json.puntaje.length; i++) {
        j+=i;
        /*fila*/
        var puntos = table.insertRow(j);
        /*celas o columnas de la fila*/
        var titulo_puntos = puntos.insertCell(0);
        var valor_puntos= puntos.insertCell(1);
        titulo_puntos.innerHTML = "Puntos de "+Cnom[buscar_jugador(json.puntaje[i].id)].nombre+" ID: "+json.puntaje[i].id;
        valor_puntos.innerHTML = json.puntaje[i].puntaje;
    }
    /*fila*/
    var Empate = table.insertRow(j+1);
    /*celas o columnas de la fila*/
    var titulo_Empate = Empate.insertCell(0);
    var valor_Empate= Empate.insertCell(1);
    titulo_Empate.innerHTML = "Empate";
    valor_Empate.innerHTML = json.desempate;
}
/*----------------------------------------------------------------------------------------------------------------
funcion que da permiso de pedir cartas en la ronda si cumple la regla que el mazo debe poseer 5 cartaspor cada 
jugador incluyendo la mesa
----------------------------------------------------------------------------------------------------------------*/
function Poder_pedir(){
    if(bb.mazo.length>=(Njugadores*5))
    {
        return true;
    } 
    else
    {
        return false;
    }
}
/*----------------------------------------------------------------------------------------------------------------
funcion que que indica si se puede jugar otra ronda si cumple la regla que el mazo debe poseer 2 cartas
por cada jugador incluyendo la mesa
----------------------------------------------------------------------------------------------------------------*/
function Poder_repartir(){
    if(bb.mazo.length>=(Njugadores*2))
    {
        return true;
    } 
    else
    {
        return false;
    }
}
/*----------------------------------------------------------------------------------------------------------------
funcion encargada de cargar la imagen al html para hacer la animacion de que llega la carta gracias al css
----------------------------------------------------------------------------------------------------------------*/
function cargar(){

    for (var i = 0; i < Njugadores; i++) {
        var nj = "j"+i;

        for (var j = 0; j < bb.jugadores[i].stack.length; j++) {
            var img = document.createElement("img");
            img.src = bb.jugadores[i].stack[j].img;
            var src = document.getElementById(nj);
            src.appendChild(img);
        }
    }
    contar();
}
/*----------------------------------------------------------------------------------------------------------------
funcion encargada de cargar la imagen al html para hacer la animacion de que llega la carta gracias al css esta se
usa en la segunda carta y inicia el juego
----------------------------------------------------------------------------------------------------------------*/
function cargar2(){
    for(var i=0; i<Njugadores;i++){
        bb.jugadores[i].stack.push(bb.mazo.pop());
        enviar_carta(bb.jugadores[i].stack[bb.jugadores[i].stack.length-1],Cnom[i].id);
    }
    for (var i = 0; i < Njugadores; i++) {
        var nj = "j"+i;
        var img = document.createElement("img");
        img.src = bb.jugadores[i].stack[bb.jugadores[i].stack.length-1].img;
        var src = document.getElementById(nj);
        src.appendChild(img);
    }
    contar();
 jugando= window.setInterval('jugar()',2000);
}
/*----------------------------------------------------------------------------------------------------------------
funciona igual que cargar solo que con una carta a la vez
----------------------------------------------------------------------------------------------------------------*/
function cargar3(i){

    var nj = "j"+i;
    var j=bb.jugadores[i].stack.length -1;
        var img = document.createElement("img");
        img.src = bb.jugadores[i].stack[j].img;
        var src = document.getElementById(nj);
        src.appendChild(img);
    contar();
}
/*----------------------------------------------------------------------------------------------------------------
funcion encargada de devolver todo al index o menu principal donde se escoje si ser servidor o cliente
----------------------------------------------------------------------------------------------------------------*/
function volver()
{
    window.location = ("../index.html"); 
}
/*----------------------------------------------------------------------------------------------------------------
                                    ejecucion de udp tcp y multicast
----------------------------------------------------------------------------------------------------------------*/
/*----------------------------------------------------------------------------------------------------------------
esta funcion detecta el nombre ingresado en login y lanza a TCP UDP Y MULTICAST con la funcion iniciar()
----------------------------------------------------------------------------------------------------------------*/
function lanzar(){
    nombre = document.getElementById("nombre").value;
    if (nombre ) 
    {
        var node = document.getElementById("login");
        if (node.parentNode) {
          node.parentNode.removeChild(node);
        }    
        document.getElementsByTagName("HEAD")[0].innerHTML+='<link rel="stylesheet" href="../css/servidor.css">';
        iniciar();
    }
}