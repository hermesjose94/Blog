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
        
        case 2:
            json = {codigo:2,
                    nombre:"luis jose"}     
            break;
        case 6:
            json = {codigo:6,
                    bono:true}     
            break;    
        case 8:
            json = {codigo:8,
                    jugar:true}
            break;   
    }
    return json;
}
/*----------------------------------------------------------------------------------------------------------------
                                            varibles de conexion
----------------------------------------------------------------------------------------------------------------*/
var dgram = require('dgram');
var net = require('net');
var port_udp;
var port_tcp;
var ip_multi;
var port_multi;
var message;
var json = mensaje(2);
var list_server = new Array();
var list_json = new Array();
var aux_list_server = new Array();
var cartas = ["pica","corazon","trebol","diamante"];
var n = 0;
var id;
var clientUDP;
var clientTCP;
var clientMUL;
var actualizar;
var Cnom=[];
var Cpts=[];
var mostrar_udp=true;
var pintar=0;
var nombre;
var manual=false;
var jugador0={nombre:"",id:null}; 
var jugador1={nombre:"",id:null};
var jugador2={nombre:"",id:null};
var jugador3={nombre:"",id:null};
var jugador4={nombre:"",id:null};
/*----------------------------------------------------------------------------------------------------------------
                                            varibles de blackjack
----------------------------------------------------------------------------------------------------------------*/
var bb;
var turno=1;
var Njugadores;
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
            ip_multi= res[1];
            port_udp= res[2];
            port_tcp= res[3];
            port_multi= res[4];
            console.log("Datos de conexion: "+"IM: "+ip_multi+"PU: "+port_udp+"PT: "+port_tcp+"PM: "+port_multi);
            UDP(port_udp);
        }
    });
}
/*----------------------------------------------------------------------------------------------------------------
funcion encargada escuchar por UDP recibe el puerto UDP
----------------------------------------------------------------------------------------------------------------*/
function UDP(port){
    clientUDP = dgram.createSocket("udp4");
    clientUDP.on('err',function(err){
        console.log("Error -------- UDP");
        console.log(err);
        clientUDP.close();
    })
    clientUDP.on('message', (msg, rinfo) => {
    json = JSON.parse(msg);
    console.log("llego por UDP.......");
    console.log(json);
    console.log(rinfo.address+" "+rinfo.port);
    if(mostrar_udp){
        if(list_server.indexOf(rinfo.address)==-1){
            aux_list_server.push(rinfo.address);
            list_server.push(rinfo.address);
            list_json.push(json);
            insertar(json,rinfo,cartas[n]);
            n++;
            if(n==4){
                n=0;
            }
        }
        else{
            var i = list_server.indexOf(rinfo.address);
            list_json[i].tiempo = json.tiempo;
            list_json[i].espacios = json.espacios;
            document.getElementById(list_server[i]+"espacios").innerHTML=json.espacios;
            document.getElementById(list_server[i]+"tiempo").innerHTML=json.tiempo+"s";
            if(aux_list_server.indexOf(list_server[i])==-1){
                aux_list_server.push(list_server[i]);
            }
    }
    }
    });
    clientUDP.bind(port);
}
/*----------------------------------------------------------------------------------------------------------------
funcion encargada de mandar el TCP y escuchar por TCP recibe, el json corresponde al mensaje json a enviar en este
el inicial es el de preguntar si puede jugar ip del cliente y el puerto TCP para asi crear el socket con ese 
cliente y mandar mensajes mas adelante
----------------------------------------------------------------------------------------------------------------*/
function TCP(json,ip_tcp,port_tcp){
    clientTCP = net.connect({port:port_tcp, host:ip_tcp}, () => {
    console.log('connected to server!');
    json.nombre=nombre;
    clientTCP.write(JSON.stringify(json));
    });
    clientTCP.on('data', (data) => {
    var recibido = JSON.parse(data);
    console.log("llego por TCP.......");
    console.log(recibido);
    switch (recibido.codigo) {
      case 3:
                if (recibido.aceptado==true) {
                    window.alert("Aceptado");
                    document.getElementById("titulo").innerHTML="Esperando Partida...";
                    ip_multi=recibido.direccion;
                    id = recibido.id;
                    Multicast(ip_multi,port_multi);
                    mostrar_udp=false;
                } 
          break;
      case 7:
      			if(recibido.id==id){
      				if (manual==false) {
                        responder_oferta();    
                    }
                    else
                    {
                        var i=buscar_jugador(id);
                        nj="b"+i+"pe";
                        document.getElementById(nj).disabled=false;
                        nj="b"+i+"pa";
                        document.getElementById(nj).disabled=false;
                    }
                    
      			}
                var i=buscar_jugador(recibido.id);
                jugar(i);
          break;
    }
    });
    clientTCP.on('error', () => {
        window.alert("El Servidor se Desconecto");
        location.href='../index.html';
    });
}
/*----------------------------------------------------------------------------------------------------------------
funcion encargada de escuchar por Multicast recibe la ip de multicast y el puerto milticast
----------------------------------------------------------------------------------------------------------------*/
function Multicast(ip_multi,port_multi){
  var dgram2 = require('dgram');
  clientMUL = dgram2.createSocket('udp4');
  
  clientMUL.on('listening', function () {
      var address = clientMUL.address();
      console.log('UDP Client listening on ' + address.address + ":" + address.port);
      clientMUL.setBroadcast(true)
      clientMUL.setMulticastTTL(128); 
      clientMUL.addMembership(ip_multi);
  });
  
  clientMUL.on('message', function (message, remote) {   
    console.log('From: ' + remote.address + ':' + remote.port);      var recibido = JSON.parse(message);
    console.log("llego por Multicast.......");
    console.log(recibido);
    switch (recibido.codigo) {
        case 4:
                for (var i = 0; i < recibido.jugadores.length; i++) {
                    if (i==0)
					{
					jugador0.id=recibido.jugadores[i].id_asignado;
					jugador0.nombre=recibido.jugadores[i].nombre;
					Cnom.push(jugador0); 	
					}
					if (i==1)
					{
					jugador1.id=recibido.jugadores[i].id_asignado;
					jugador1.nombre=recibido.jugadores[i].nombre;
					Cnom.push(jugador1); 	
					}
					if (i==2)
					{
					jugador2.id=recibido.jugadores[i].id_asignado;
					jugador2.nombre=recibido.jugadores[i].nombre;
					Cnom.push(jugador2); 	
					}
					if (i==3)
					{
					jugador3.id=recibido.jugadores[i].id_asignado;
					jugador3.nombre=recibido.jugadores[i].nombre;
					Cnom.push(jugador3); 	
					}
					if (i==4)
					{
					jugador4.id=recibido.jugadores[i].id_asignado;
					jugador4.nombre=recibido.jugadores[i].nombre;
					Cnom.push(jugador4); 	
					}
                }
                empezar();          
        break;
        case 5:
                pintar=0;
                limpiar();
                for (var i = 1; i < Njugadores; i++) {
                    document.getElementById("j"+i+"p").innerHTML = recibido.puntaje[i-1].puntaje;                    
                }
                Cpts.length=0;
                //mandar_bono();

        break;
        case 9:
                var c=recibido.carta.toUpperCase();
                procesar_carta(c,recibido.id);
                var i = buscar_jugador(recibido.id);
                if(pintar<Njugadores*2)
                    pintar++;
                else
                    jugar(i);
        break;
        case 10:
                if (recibido.desempate==true) {
                    limpiar();
                }else{
                    mostrar_estadisticas(recibido);
                }
                

        break;
        case 11:
                var pos = busacar_jugador(recibido.id);
                quitar_desconectados(pos);
                quitar_desconectados_vectores(pos);
        break;
    }

  });
  
  clientMUL.bind(port_multi);    
}
/*----------------------------------------------------------------------------------------------------------------
funcion encargada de insertar las cartas que representan a los servidores para asi conecetarse a los mismos
----------------------------------------------------------------------------------------------------------------*/
function insertar(json,rinfo,carta){
  var section = document.getElementById("area_server");
  var button = document.createElement("button");
  button.id = rinfo.address;
  button.onclick=function(){conectar(this);};
    var h3 = document.createElement("h3");
    h3.innerHTML=json.nombre;
    var img = document.createElement("img");
    img.src="../img/"+carta+".png";
    var div = document.createElement("div");
      var p = document.createElement("p");
      p.id=rinfo.address+"espacios";
      p.innerHTML=json.espacios;
      var p2 = document.createElement("p");
      p2.id=rinfo.address+"tiempo";
      p2.innerHTML=json.tiempo+"s";
  
  section.appendChild(button);
  button.appendChild(h3);
  button.appendChild(img);
  button.appendChild(div);
  div.appendChild(p);
  div.appendChild(p2);
}
/*----------------------------------------------------------------------------------------------------------------
funcion encargada de actualizar las cartas de los servidores para manipular si se desconectan o aparecen nuevos
----------------------------------------------------------------------------------------------------------------*/
actualizar = setInterval(function(){
   
  var i_eliminar = new Array();
  for (var i = 0; i < list_json.length; i++) {
    if(aux_list_server.indexOf(list_server[i])==-1){
        i_eliminar.push(i);
    }
  }
  var j;
  for (var i = 0; i < i_eliminar.length; i++) {
      j = i_eliminar[i];
      document.getElementById(list_server[j]).remove();
      list_server.splice(j,1);
      list_json.splice(j,1);      
  }
  aux_list_server = new Array();
},1000);
/*----------------------------------------------------------------------------------------------------------------
funcion encargada mandar la solicitud tcp a saber si se puede unir a la partida
----------------------------------------------------------------------------------------------------------------*/
function conectar(element){
    TCP(mensaje(2),element.id,port_tcp);
}
/*----------------------------------------------------------------------------------------------------------------
funcion encargada de enviar por TCP al servidor si desea pedir o no otra carta
----------------------------------------------------------------------------------------------------------------*/
function responder_oferta(){
	var json2=mensaje(8);
    var i=buscar_jugador(id);
	if(pensar(i)=="pedir"){
		json2.jugar = true;
	}
	else{
		json2.jugar=false;
	}
    json2.id=id;
	clientTCP.write(JSON.stringify(json2));
}
/*----------------------------------------------------------------------------------------------------------------
funcion encargada de enviar por TCP al servidor si desea bonus o no
----------------------------------------------------------------------------------------------------------------*/
function mandar_bono(){
    var json2=mensaje(6);
    json2.bono=false;
    clientTCP.write(JSON.stringify(json2));
}

/*----------------------------------------------------------------------------------------------------------------
funcion encargada de enviar por TCP al servidor si desea pedir en el modo manual
----------------------------------------------------------------------------------------------------------------*/
function clic_pedir(){
    var json2=mensaje(8);
    json2.jugar = true;
    json2.id=id;
    clientTCP.write(JSON.stringify(json2));
    var i=buscar_jugador(id);
    nj="b"+i+"pe";
    document.getElementById(nj).disabled=true;
    nj="b"+i+"pa";
    document.getElementById(nj).disabled=true;
}
/*----------------------------------------------------------------------------------------------------------------
funcion encargada de enviar por TCP al servidor si desea pasar en el modo manual
----------------------------------------------------------------------------------------------------------------*/
function clic_pasar(){
    var json2=mensaje(8);
    json2.jugar = false;
    json2.id=id;
    clientTCP.write(JSON.stringify(json2));
    var i=buscar_jugador(id);
    nj="b"+i+"pe";
    document.getElementById(nj).disabled=true;
    nj="b"+i+"pa";
    document.getElementById(nj).disabled=true;
}
/*----------------------------------------------------------------------------------------------------------------
funcion encargada de recibir la carta y hacer la conversion de los numeros a las letras
1->A 11->J 12->Q 13->K asi como convertir los tipos a C,D,P,T a
C->0->Corazon
D->1->Diamente
P->2->Pica
T->3->Trebol
----------------------------------------------------------------------------------------------------------------*/
function procesar_carta(c,id){
    var tipo;
    var valor;
    if (c.length==2) {
        switch (c.charAt(0)) {
            case 'A':
                valor=1;
            break;
            case 'J':
                valor=11;
            break;
            case 'Q':
                valor=12;
            break;
            case 'K':
                valor=13;
            break;
            default:
                valor=c.charAt(0);
            break;
        }
        switch (c.charAt(1)) {
            case 'C':
                tipo=0;
            break;
            case 'D':
                tipo=1;
            break;
            case 'P':
                tipo=2;
            break;
            case 'T':
                tipo=3;
            break;
        }                                        
    } else if (c.length==3) {
        valor=10;
        switch (c.charAt(2)) {
            case 'C':
                tipo=0;
            break;
            case 'D':
                tipo=1;
            break;
            case 'P':
                tipo=2;
            break;
            case 'T':
                tipo=3;
            break;
        }                    
    }
    var Carta = new carta(valor,tipo);
    var nro_carta = ["A",2,3,4,5,6,7,8,9,10,"J","Q","K"];
    if(tipo==0){

        Carta.img="../img/Corazon/"+nro_carta[valor-1]+".png";
    }
    if(tipo==1){
        Carta.img="../img/Diamante/"+nro_carta[valor-1]+".png";
    }
    if(tipo==2){
        Carta.img="../img/Pica/"+nro_carta[valor-1]+".png";
    }
    if(tipo==3){
        Carta.img="../img/Trebol/"+nro_carta[valor-1]+".png";
    }
    console.log("Carta que llego..........")
    console.log(Carta);
    var i=buscar_jugador(id);
    turno=i;
    bb.jugadores[i].stack.push(Carta);
    cargar(i);
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
    this.jugadores=new Array();

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
funcion encargada de epmezar la partida de blackjack limpiado el html por la mesa asi como crear los objetos
----------------------------------------------------------------------------------------------------------------*/
function empezar(){
    var node = document.getElementById("hclient");
    if (node.parentNode) {
      node.parentNode.removeChild(node);
    }    
    document.getElementsByTagName("HEAD")[0].innerHTML+='<link rel="stylesheet" href="../css/mesa.css">';
    clientUDP.close();
    clearInterval(actualizar);
    const remote = require('electron').remote;
    var win = remote.getCurrentWindow();
    win.maximize();

    bb = new blackjack();
    bb.cargar_jugadores(Cnom.length);
    Njugadores=Cnom.length;
    for (var i =Njugadores; i <5 ; i++) {
        quitar_desconectados(i);
    }
    if(manual==false)
    {
        document.getElementById("b1").style.display = "none";
        document.getElementById("b2").style.display = "none";
        document.getElementById("b3").style.display = "none";
        document.getElementById("b4").style.display = "none";
    }
    else
    {
        var t = buscar_jugador(id);
        var nj;
        for (var i = 1; i < 5; i++) {
            if (i!=t) {
                nj="b"+i;
                document.getElementById(nj).style.display = "none";
            }
        }
    }
    console.log("-------------Jugadores--------------------");
    console.log(bb.jugadores);
}
/*----------------------------------------------------------------------------------------------------------------
funcion encargada quitar las cartas y reiciar los totales en cada ronda
----------------------------------------------------------------------------------------------------------------*/
function limpiar(){
    
    document.getElementById("j1n").style.color = "#FFF";
    document.getElementById("j2n").style.color = "#FFF";
    document.getElementById("j3n").style.color = "#FFF";
    document.getElementById("j4n").style.color = "#FFF";
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
funcion encargada de pintar el nombrer de cada jugador segun su turno
----------------------------------------------------------------------------------------------------------------*/
function jugar (turno){
        
        if(turno == 0)
            {
                document.getElementById("j1n").style.color = "#FFF";
                document.getElementById("j2n").style.color = "#FFF";
                document.getElementById("j3n").style.color = "#FFF";
                document.getElementById("j4n").style.color = "#FFF";
            }
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
}
/**Futuramente heuristica*/
/*----------------------------------------------------------------------------------------------------------------
funcion encargada tomar la desicion de los jugadores para saber si pedir o pasar se basa en que si tiene 
menos de 17 pide de lo contrario pasa
----------------------------------------------------------------------------------------------------------------*/
function pensar(turno){
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
/*----------------------------------------------------------------------------------------------------------------
funcion encargada de contar los puntos que acumula con las cartas cada jugador asi como cambiar el valor de A ya 
sea por 1 o 11 dependiendo del caso
----------------------------------------------------------------------------------------------------------------*/
function contar(){
    
    for (var i = 0; i < Njugadores; i++) {
        var nj = "j"+i+"t";
        var cont=0; 
        for (var j = 0; j < bb.jugadores[i].stack.length; j++) {
            if (parseInt(bb.jugadores[i].stack[j].valor)>9) {
                cont+=10;
            }
            else if (parseInt(bb.jugadores[i].stack[j].valor) == 1 && (cont+11)<=21) {
                cont+=11;
            }
            else if (parseInt(bb.jugadores[i].stack[j].valor)<=9 ) {
                cont+=parseInt(bb.jugadores[i].stack[j].valor);
            }
        }
        document.getElementById(nj).innerHTML = cont;
    }
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
funcion encargada de cargar la imagen al html para hacer la animacion de que llega la carta gracias al css recibe 
a una carta 
----------------------------------------------------------------------------------------------------------------*/
function cargar(i){

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
function volver(){
    window.location = ("../index.html");    
}
/*----------------------------------------------------------------------------------------------------------------
                                    ejecucion de udp tcp y multicast
----------------------------------------------------------------------------------------------------------------*/
/*----------------------------------------------------------------------------------------------------------------
esta funcion detecta el nombre ingresado en login y lanza UDP con la funcion iniciar()
----------------------------------------------------------------------------------------------------------------*/
function lanzar(){
    nombre = document.getElementById("nombre").value;
    if (nombre ) 
    {
        var node = document.getElementById("login");
        if (node.parentNode) {
          node.parentNode.removeChild(node);
        }    
        document.getElementsByTagName("HEAD")[0].innerHTML+='<link rel="stylesheet" href="../css/cliente.css">';
        iniciar();
    }
}
/*----------------------------------------------------------------------------------------------------------------
esta funcion detecta el nombre ingresado en login y lanza UDP con la funcion iniciar() pero en modo automatico
----------------------------------------------------------------------------------------------------------------*/
function lanzar2(){
    nombre = document.getElementById("nombre").value;
    if (nombre ) 
    {
        manual=true;
        var node = document.getElementById("login");
        if (node.parentNode) {
          node.parentNode.removeChild(node);
        }    
        document.getElementsByTagName("HEAD")[0].innerHTML+='<link rel="stylesheet" href="../css/cliente.css">';
        iniciar();
       
    }
}