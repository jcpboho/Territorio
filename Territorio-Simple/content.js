
$(document).ready(function() {

	var dominio = "https://app-3f9396ac-a8f4-474b-a986-d8295b7770e9.cleverapps.io/"

	var ficha = $(_x('//*[@id="groupTitle tt"]/text()')).text()
    ficha = ficha.split("(");
    ficha = ficha[1].split(")");
    ficha = ficha[0];

	var idficha = $(_x('//*[@id="IDCLASS"]')).val()


    var meses = new Array ("Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre");
	var f=new Date();
	var fecha = " "+f.getDate() + " de " + meses[f.getMonth()] + " de " + f.getFullYear();

	function _x(STR_XPATH) {
	    var xresult = document.evaluate(STR_XPATH, document, null, XPathResult.ANY_TYPE, null);
	    var xnodes = [];
	    var xres;
	    while (xres = xresult.iterateNext()) {
	        xnodes.push(xres);
	    }

	    return xnodes;
	}
	var body = `
		<div id="modalJavascript" class="modal " tabindex="-1" role="dialog">
		  <div class="modal-dialog" role="document">
		    <div class="modal-content">
		      <div class="modal-header">
		        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
		          <span aria-hidden="true">&times;</span>
		        </button>
		        <h5 id="titte_modal" class="modal-title"></h5>
		      </div>
		      <div class="modal-body">
		      	<center>
			      	<image id="loading" src="images/loading_territorium_transparent.gif"/>
			      	<image id="complete" style="display:none" src="https://vuelosenglobo.mx/wp-content/uploads/2019/01/pago-viaje-en-globo.gif"/>
			      	<image id="delete" style="display:none; width:100px; heigth:100px" src="https://i.pinimg.com/originals/ff/fa/9b/fffa9b880767231e0d965f4fc8651dc2.gif"/>
			      	<h3 id="mensaje" style="display:none"></h3>
		      	</center>
		      </div>
		      <div class="modal-footer">		      
		        <button id="eliminarFichaConfirm" type="button" class="btn btn-danger" >Confirmar</button>
		      </div>
		    </div>
		  </div>
		</div>
      	
      	<div id="ajax" style="display:none">
      	</div>

      	<style type="text/css">
      		.font11{
      			font-size: 11px;
      			margin: 5px;
      		}
      	</style>

        <div style=" z-index: 9999;width: 200px;margin-left:80%; background: #000000e6;position: fixed; border-radius: 50px; ">
            <h2 id="tittle_div" style="font-size: 18px; text-align: center; color: #fc7323; ">Notas - ${ficha}</h2>
        	<center>
	        	<button class="btn btn-primary font11 registrarFicha" >Registrar Ficha</button></br>
	        	<input type="checkbox" id="cualitativa" name="nota" checked>
						<label for="cualitativa"> Nota Cualitativa</label>
	        	<button class="btn btn-primary font11 actualizarNotas" >Actualizar Notas</button><br>
		        <form method="POST" action="${dominio}excel.php"> 
					<input id="ficha1" type="hidden" name="ficha" value="${ficha}">
					<input id="fecha" type="hidden" name="fecha" value="${fecha}">
					<input id="excel" type="submit" class="btn btn-primary font11" value="Decargar notas">
				</form>
			   <button  type="button" class="btn btn-danger font11 eliminarFicha" style="" >Eliminar</button>
		   </center> 
        </div>`;


    $.ajax({

	       type: 'POST',
		   contentType: 'application/x-www-form-urlencoded; charset=utf-8',
	       url: dominio+"fichasDisponibles.php",
	       data:{ficha:ficha},
	       asyc: false //Se puede utilizar para realizar peticiones una por una asyncrona

	}).done(function (result) {
	    if (result.count>0) {

			$('body').prepend(body);

    	    $.ajax({

			       type: 'POST',
				   contentType: 'application/x-www-form-urlencoded; charset=utf-8',
			       url: dominio+"alumnosDisponibles.php",
			       data:{ficha:ficha},
			       asyc: false //Se puede utilizar para realizar peticiones una por una asyncrona

			}).done(function (result) {
			    if (result.count>0) {
			    	$(".registrarFicha").prop("disabled", true)
			    }else{
			    	$(".actualizarNotas").prop("disabled", true)
			    	$("#excel").prop("disabled", true)

			    };

			});	



    
    $('.registrarFicha').click(function(){
        registroAprendices();
    })

    $('.actualizarNotas').click(function(){
        Notas("actualizar");
    })

    $('.eliminarFicha').click(function(){

    	$("#loading").hide();
    	$("#complete").hide();
    	$("#delete").show();
		$("#modalJavascript").modal("show");
		$("#titte_modal").text("¿Seguro de eliminar los datos de la ficha "+ficha+"?");
		$("#eliminarFichaConfirm").show();
    })

    $('#eliminarFichaConfirm').click(function(){

        eliminarFicha();
    })

    function showModal(argument) {

		$("#modalJavascript").modal("show");
		$("#titte_modal").text(argument);
		$("#eliminarFichaConfirm").hide();
    	$("#delete").hide();
    	$("#loading").show();

    }

    function registroAprendices(){
		showModal("Registrando Aprendices");

        $.ajax({

           type: 'POST',
           url: "https://sena.territorio.la/webservices/academico.php",
           data: {method: 'getCalificacionesV2',param: '{"idGrupo":"'+idficha+'","id_universidad":"1256","usuarioSocialGrupo":null,"idParcial":null}'}, //Se envian los datos para su registro
           asyc: false //Se puede utilizar para realizar peticiones una por una asyncrona

        }).done(function (result) {
			Alumnos = JSON.parse(result)
           	////console.log(Alumnos)// Prueba de consola
           	$.ajax({

	               type: 'POST',
            	   contentType: 'application/x-www-form-urlencoded; charset=utf-8',
	               url: dominio+"registroAlumnos.php",
	               data: JSON.stringify(Alumnos), //Se envian los datos para su registro
	               asyc: false //Se puede utilizar para realizar peticiones una por una asyncrona

	        }).done(function (result) {
	        	$("#modalJavascript").modal("hide");
	        	registrarEvidencias();
	           	//alert(result)// Prueba de consola
	           	////console.log(result)// Prueba de consola

	        });
        });      	
    }
	function registrarEvidencias(){
		showModal("Registrando Evidencias");

    	$.ajax({
               type: 'GET',
               url: "https://sena.territorio.la/tareas_desglose.php?c="+idficha+"&esProfesor=esProfesor"
        }).done(function (result) {

			$("#ajax").html(result); //Inscrusto el resultado a div ajax creado anteriormente

			var datos  = [];
			var i = 0;
			$("#myTable05>thead>tr>th").each(function(){   //Tomo de referencia el tr para registrar las evidencias 		
				if (i<2) {
					i++;
				}else{
				  	var th = $(this); //Se toma de referencia un objeto del array y se elimina
			       	var idevs =	th.prop("id").split("["); //Se obtiene el id de la evidencia
			       	idevs = idevs[1];
			       	var nomEVS = th.children("a").text().trim( ); //Se obtiene el nombre de la evidenci
			       	////console.log(nomEVS);
			       	datos.push({ 
						        "idEVS"    : idevs,
						        "nomEVS"  : nomEVS
						    });
				}
			});

	        $.ajax({

	               type: 'POST',
            	   contentType: 'application/x-www-form-urlencoded; charset=utf-8',
	               url: dominio+"registroEvidencias.php",
	               data: {ficha: ficha,tipo:0,param: datos}, //Se envian los datos para su registro
	               asyc: false //Se puede utilizar para realizar peticiones una por una asyncrona

	        }).done(function (result) {
	        	$("#modalJavascript").modal("hide");
	        	registrarForos()
	           	//alert(result)// Prueba de consola
	           	////console.log(result)// Prueba de consola

	        });

        });	
	} 
	function registrarForos(){
		showModal("Registrando Foros");
    	$.ajax({

               type: 'POST',
               data: {llamadoAjax: true},
               url: "https://sena.territorio.la/foro.php?c="+idficha

        }).done(function (result) {

			$("#ajax").html(result); //Inscrusto el resultado a div ajax creado anteriormente

			
			var datos  = [];
			$("#divListaDiscusiones>div").each(function(){
        	    var id = $(this).prop("id").split("_"); 
        	    id = id[1]; 

        	    var nombreForo = $(this).children("table").children("tbody").children("tr:nth-child(1)").children("td:nth-child(1)").text()
        	    var disponible =$(this).children("table").children("tbody").children("tr:nth-child(5)").children("td:nth-child(1)").children("span").text();
        	    var calificable = $(this).children("table").children("tbody").children("tr:nth-child(3)").children("td:nth-child(1)").children("span").text()

        	   	if( disponible ==="Si" && calificable==="Si"){
        	   		disponible = 1;
	        	   	datos.push({ 
						        "idEVS"    : id,
						        "nomEVS"  : nombreForo
						    });
        	   	}else{
        	   		disponible = 0;
        	   	}

        	    ////console.log(divs)
        	});
        	    ////console.log(disponible); 

        	if (datos.length>0) {
	    	    $.ajax({

	               type: 'POST',
	        	   contentType: 'application/x-www-form-urlencoded; charset=utf-8',
	               url: dominio+"registroEvidencias.php",
	               data: {ficha: ficha,tipo:1,param: datos}, //Se envian los datos para su registro
	               asyc: false //Se puede utilizar para realizar peticiones una por una asyncrona

		        }).done(function (result) {
	        	$("#modalJavascript").modal("hide");
		        	registrarEvaluaciones()
		           	//alert(result)// Prueba de consola
		           	////console.log(result)// Prueba de consola

		        });
	    	}


        });	
	}
	function registrarEvaluaciones(){
		showModal("Registrando Evaluaciones");
    	$.ajax({

               type: 'POST',
               data: {llamadoAjax: true},
               url: "https://sena.territorio.la/examenes.php?clase="+idficha

        }).done(function (result) {
		        	
			document.getElementById("ajax").innerHTML = result; //Inscrusto el resultado a div ajax creado anteriormente

			
			var datos  = [];
			$("#contentPosts>div").each(function(){

        	    var id = $(this).find("table>tbody>tr:nth-child(2)>td:nth-child(1)>input:nth-child(4)").prop("id").split("_")
        	    id=id[1];
        	    var nombreEvaluacion = $(this).find("table>tbody>tr:nth-child(2)>td:nth-child(1)>input:nth-child(4)").val()

        	   	if( id !="" && nombreEvaluacion!=""){
        	   		disponible = 1;
	        	   	datos.push({ 
						        "idEVS"    : id,
						        "nomEVS"  : nombreEvaluacion
						    });
        	   	}else{
        	   		disponible = 0;
        	   	}

        	    ////console.log(divs)
        	});
        	    ////console.log(disponible); 

        	if (datos.length>0) {
	    	    $.ajax({

	               type: 'POST',
	        	   contentType: 'application/x-www-form-urlencoded; charset=utf-8',
	               url: dominio+"registroEvidencias.php",
	               data: {ficha: ficha,tipo:2,param: datos}, //Se envian los datos para su registro
	               asyc: false //Se puede utilizar para realizar peticiones una por una asyncrona

		        }).done(function (result) {
	        		$("#modalJavascript").modal("hide");
		        	Notas("insertar");
		           	//alert(result)// Prueba de consola
		           	////console.log(result)// Prueba de consola

		        });
	    	}


        });	
	}   
    function Notas(accion){
		showModal("Notas");
    	$.ajax({

               type: 'GET',
               url: "https://sena.territorio.la/tareas_desglose.php?c="+idficha+"&esProfesor=esProfesor"

        }).done(function (result) {

			$("#ajax").html(result); //Inscrusto el resultado a div ajax creado anteriormente

			 // Tomo de referencia la tabla de evidencias consultada
			$("#myTable05").find('[style="background-color:#e3f0da;"]>[value="SC"]').each(function() {   //Tomo de referencia el tr para registrar las evidencias 
				$(this).val("SN")
			});
        	var nota;
			if ($("#cualitativa").is(':checked')) {
				nota = "si"
			}else{
				nota = "no"
			}

			var data = $('#formDesglose').serializeArray();
		    var dataString = { proceso: accion,nota:nota,param:JSON.stringify(data)};
			$.ajax({

	               type: 'POST',
            	   contentType: 'application/x-www-form-urlencoded; charset=utf-8',
	               url: dominio+"registroNotasSimple.php",
	               data: dataString, //Se envian los datos para su registro
	               asyc: false //Se puede utilizar para realizar peticiones una por una asyncrona

	        }).done(function (result) {

	        	$("#modalJavascript").modal("hide");
        		NotasForos(accion);
	           	//alert(result)// Prueba de consola
	           	////console.log(result)// Prueba de consola

	        });	

        });		
    }  
    function NotasForos(accion){
		showModal("Foros");
		$.ajax({

               type: 'POST',
        	   contentType: 'application/x-www-form-urlencoded; charset=utf-8',
               url: dominio+"forosDisponibles.php",
               data:{ficha:ficha},
               asyc: false //Se puede utilizar para realizar peticiones una por una asyncrona

        }).done(function (result) {

           	evaluaciones=result.length;
       		$.each(result, function(i, item) {
				$.ajax({

	               type: 'POST',
	               data: {llamadoAjax: true},
	    	   	   contentType: 'application/x-www-form-urlencoded; charset=utf-8',
	               url: "https://sena.territorio.la/foro_pregunta.php?c="+idficha+"&idfp="+item+"&foroEquipo=0",
	               asyc: false //Se puede utilizar para realizar peticiones una por una asyncrona

		        }).done(function (result) {
		        	
					document.getElementById("ajax").innerHTML = result; //Inscrusto el resultado a div ajax creado anteriormente

					var $table = $("#Cajon"); // Tomo de referencia la tabla de evidencias consultada
					$table.find('table>tbody>tr>td>div:nth-child(2)>span').each(function() {   //Tomo de referencia el tr para registrar las evidencias
					    var sc = $("#formCalificarForo>div:eq(1)>table>tbody>tr>td:contains('"+$(this).text()+"')").parent('').find('input:nth-child(1)').val();
					    if (sc === "") {
					    	$("#formCalificarForo>div:eq(1)>table>tbody>tr>td:contains('"+$(this).text()+"')").parent('').find('input:nth-child(1)').val("SN");
					    }
					});

					var datos  = [];
					var i = 0;
					$("#formCalificarForo>div:eq(1)>table>tbody>tr").each(function(){
		        	    
		        	    if (i!=0) {
			        	    var id = $(this).prop("id").split("_"); 
			        	    id = id[1]; 

			        	    var cc = $(this).children("td:nth-child(1)").text().split(" ");
							cc = cc[0];

			        	    var nota = $(this).children("td:nth-child(2)").children("div").children("input:nth-child(1)").val();
			        	    
			        	   	if( cc != null){
			        	   		if (nota =="") {
			        	   			nota="SC";
			        	   		}
				        	   	datos.push({ 
									        "cc"    : cc,
									        "value"  : nota
									    });
			        	   	}else{
			        	   	}
		        	   	}else{
		        	   		i++;
		        	   	}

		        	    ////console.log(divs)
		        	});
			        	   		//console.log(datos)

					var nota;
					if ($("#cualitativa").is(':checked')) {
						nota = "si"
					}else{
						nota = "no"
					}

					var dataString = { proceso: accion,nota:nota,evs:item,param:JSON.stringify(datos)};

					$.ajax({

			               type: 'POST',
		            	   contentType: 'application/x-www-form-urlencoded; charset=utf-8',
			               url: dominio+"registroNotasForo.php",mode: "no-cors",
			               data: dataString, //Se envian los datos para su registro
			               asyc: false //Se puede utilizar para realizar peticiones una por una asyncrona

			        }).done(function (result) {
			        	if (evaluaciones==1) {
							NotasEvaluaciones(accion);
			        	}else{
			        		evaluaciones--;
			        	}
			           	//alert(result)// Prueba de consola
			           	////console.log(result)// Prueba de consola

			        });	
					//var data = $('#formCalificarForo').serializeArray();

			       
		        });
			});



        });	
    } 
    function NotasEvaluaciones(accion){
		showModal("Evaluaciones");
		$.ajax({

               type: 'POST',
        	   contentType: 'application/x-www-form-urlencoded; charset=utf-8',
               url: dominio+"evaluacionesDisponibles.php",
               data:{ficha:ficha},
               asyc: false //Se puede utilizar para realizar peticiones una por una asyncrona

        }).done(function (result) {

           	//console.log(result.ide)// Prueba de consola
           	////console.log(result)// Prueba de consola
           	excel = result.ide.length;
       		$.each(result.ide, function(i, item) {
				$.ajax({

	               type: 'POST',
	               data: {llamadoAjax: true},
	    	   	   contentType: 'application/x-www-form-urlencoded; charset=utf-8',
	               url: "https://sena.territorio.la/show_quiz.php?idExamen="+item+"&c="+idficha,
               		asyc: false //Se puede utilizar para realizar peticiones una por una asyncrona

		        }).done(function (result) {
		        	
					document.getElementById("ajax").innerHTML = result; //Inscrusto el resultado a div ajax creado anteriormente

					var datos  = [];
					$("#contentContainer>table").each(function(){
		        	    
         	    		var nota = $(this).find(_x('//*[@id="contentContainer"]/table/tbody/tr[2]/td/text()[1]')).text().trim().split(":");
         	    		nota = nota[1];
         	    		console.log(nota)
         	    		var id = $(this).find(_x('//*[@id="contentContainer"]/table/tbody/tr/td/a[2]')).prop("href");
         	    		if (id!=null) {
         	    			id = id.split(/[=&]/);
         	    			id = id[3];

	     	    			if(nota!=""){
				        	   	datos.push({ 
									        "alumno": id,
									        "evs": item,
									        "value": nota
									    });
		        	   		}

         	    		}
		        	    ////console.log(divs)
		        	});
			        	   		////console.log(datos)

					var nota;
					if ($("#cualitativa").is(':checked')) {
						nota = "si"
					}else{
						nota = "no"
					}

					var dataString = { proceso: accion,nota:nota,evs:item,ficha:ficha,param:JSON.stringify(datos)};

					$.ajax({

			               type: 'POST',
		            	   contentType: 'application/x-www-form-urlencoded; charset=utf-8',
			               url: dominio+"registroNotasEvaluaciones.php",
			               data: dataString, //Se envian los datos para su registro
			               asyc: false //Se puede utilizar para realizar peticiones una por una asyncrona

			        }).done(function (result) {
			           	console.log(result)// Prueba de consola
			        	if (excel==1) {
				        	$("#loading").hide()
				        	$("#complete").show()
				        	setTimeout(function() {
	        					$("#modalJavascript").modal("hide");
					        	$("#loading").show()
					        	$("#complete").hide()
				        	}, 2000);
			        		console.log("entro excel")
       						descargarExcel();
			        	}else{
			        		console.log(excel)
			        		excel--;
			        	}
			           	//alert(result)// Prueba de consola

			        });	
					//var data = $('#formCalificarForo').serializeArray();

			       
		        });
			});

        });	
    } 
    function descargarExcel() {
	    $(".registrarFicha").prop("disabled", true)
    	$(".actualizarNotas").prop("disabled", false)
    	$("#excel").prop("disabled", false)
    	$("#excel").click();
    }
    function eliminarFicha() {
    	
		$.ajax({

               type: 'POST',
        	   contentType: 'application/x-www-form-urlencoded; charset=utf-8',
               url: dominio+"eliminarFicha.php",
               data:{ficha:ficha},
               asyc: false //Se puede utilizar para realizar peticiones una por una asyncrona

        }).done(function (result) {
        	if (result>0) {
		    	$(".registrarFicha").prop("disabled", false)
		    	$(".actualizarNotas").prop("disabled", true)
		    	$("#excel").prop("disabled", true)
		        $("#delete").hide()
	        	$("#complete").show()
	        	setTimeout(function() {
					$("#modalJavascript").modal("hide");
		        	$("#loading").show()
		        	$("#complete").hide()
	        	}, 2000);
        	}else{

		    	$("#mensaje").show()
		    	$("#mensaje").text("Error al eliminar la ficha "+ ficha)
	        	setTimeout(function() {
					$("#modalJavascript").modal("hide");
		        	$("#loading").show()
		        	$("#complete").hide()
		    		$("#mensaje").hide()
	        	}, 3000);

        	}

        });	
    }






	    }else{
	    	$(".actualizarNotas").prop("disabled", true)
	    	$("#excel").prop("disabled", true)

	    };

	});	
    
})



/*

var data = $('#formDesglose').serialize();
				    var dataString = { proceso:"actualizar",param:JSON.stringify(data)};
				
				    $.ajax({
				    	type:'POST',
				    	url:'http://localhost/adsi/registroNotasSimple.php',
				    	data:dataString,
				    	success:function(resultado) {
				    		//console.log(resultado)
				    	},
				    	error:function(xhr) {
				    		//console.log(xhr);
				    	}
				    });	
*/


/*
		var urls =  []; 
		var idurl =  []; 


		var ficha=$(_x('//*[@id="table-container"]/div[1]/div[1]/h5')).text();
		ficha = ficha.split("(")
		ficha = ficha[1].split(")")
		ficha = ficha[0]

		$.ajax({

	           method: 'GET',
	           url: dominio+"aprendices.php",
	           asyc: true
	   
	    }).done(function (result) {

	        result=JSON.parse(result);
	    	for(var value in result){
	    		urls.push("https://sena.territorio.la/calificaciones_v2_detalle.php?idGrupo=328094&idPonderacion=1132883&idPersona="+result[value]);
	    		idurl.push(result[value]);
	    	}

			function ajaxRequest (urls) {
		       if (urls.length > 0) {
		           
		           $.ajax({

		               method: 'GET',
		               url: urls.pop(),
	   				   asyc: true
		           
		            }).done(function (result) {

					  	$("#ajax").html(result);

					  	var EV01=$(_x('//*[@id="calificadas"]/table[1]/tbody/tr[1]/td[1]/p')).text();
					  	var EV01N=$(_x('//*[@id="calificadas"]/table[1]/tbody/tr[1]/td[2]')).html();

					  	var EV02=$(_x('//*[@id="calificadas"]/table[1]/tbody/tr[2]/td[1]/p')).text();
					  	var EV02N=$(_x('//*[@id="calificadas"]/table[1]/tbody/tr[2]/td[2]')).html();

					  	var EV04=$(_x('//*[@id="calificadas"]/table[1]/tbody/tr[3]/td[1]')).html();
					  	var EV04N=$(_x('//*[@id="calificadas"]/table[1]/tbody/tr[3]/td[2]')).html();

					  	var EV05=$(_x('//*[@id="calificadas"]/table[1]/tbody/tr[4]/td[1]/p')).text();
					  	var EV05N=$(_x('//*[@id="calificadas"]/table[1]/tbody/tr[4]/td[2]')).html();

					  	var EV07=$(_x('//*[@id="calificadas"]/table[1]/tbody/tr[5]/td[1]/p')).text();
					  	var EV07N=$(_x('//*[@id="calificadas"]/table[1]/tbody/tr[5]/td[2]')).html();

					  	var EV08=$(_x('//*[@id="calificadas"]/table[1]/tbody/tr[6]/td[1]/p')).text();
					  	var EV08N=$(_x('//*[@id="calificadas"]/table[1]/tbody/tr[6]/td[2]')).html();

					  	var EV09=$(_x('//*[@id="calificadas"]/table[1]/tbody/tr[7]/td[1]/p')).text();
					  	var EV09N=$(_x('//*[@id="calificadas"]/table[1]/tbody/tr[7]/td[2]')).html();

					  	var EV10=$(_x('//*[@id="calificadas"]/table[1]/tbody/tr[8]/td[1]')).html();
					  	var EV10N=$(_x('//*[@id="calificadas"]/table[1]/tbody/tr[8]/td[2]')).html();

					  	var EV03=$(_x('//*[@id="calificadas"]/table[2]/tbody/tr/td[1]/p[1]/strong')).text();
					  	var EV03N=$(_x('//*[@id="calificadas"]/table[2]/tbody/tr/td[2]')).html();

					  	var EV06=$(_x('//*[@id="calificadas"]/table[3]/tbody/tr/td[1]')).html();
					  	var EV06N=$(_x('//*[@id="calificadas"]/table[3]/tbody/tr/td[2]')).html();

					  	var EVS=[{"name":EV01,"n":EV01N},
					  			{"name":EV02,"n":EV02N},
					  			{"name":EV03,"n":EV03N},
					  			{"name":EV04,"n":EV04N},
					  			{"name":EV05,"n":EV05N},
					  			{"name":EV06,"n":EV06N},
					  			{"name":EV07,"n":EV07N},
					  			{"name":EV08,"n":EV08N},
					  			{"name":EV09,"n":EV09N},
					  			{"name":EV10,"n":EV10N}]

			        		////console.log(EVS)
					  	var nota=[];
					  	var id= idurl.pop();
					  	
			        	for(var value in EVS){
			        		////console.log("Valor:"+value+", evs:"+EVS[value]["name"]);
			        		if (!!EVS[value]["name"]) {
				        		if (EVS[value]["name"].includes("EV01")) {
				        			nota.push({"id":id,"name":1,"n":EVS[value]["n"],"ficha": ficha});
				        		}
				        		if (EVS[value]["name"].includes("EV02")) {
				        			nota.push({"id":id,"name":2,"n":EVS[value]["n"],"ficha": ficha});
				        		}
				        		if (EVS[value]["name"].includes("Cordial")) {
				        			nota.push({"id":id,"name":3,"n":EVS[value]["n"],"ficha": ficha});
				        		}
				        		if (EVS[value]["name"].includes("EV04")) {
				        			nota.push({"id":id,"name":4,"n":EVS[value]["n"],"ficha": ficha});
				        		}
				        		if (EVS[value]["name"].includes("EV05")) {
				        			nota.push({"id":id,"name":5,"n":EVS[value]["n"],"ficha": ficha});
				        		}
				        		if (EVS[value]["name"].includes("EV06")) {
				        			nota.push({"id":id,"name":6,"n":EVS[value]["n"],"ficha": ficha});
				        		}
				        		if (EVS[value]["name"].includes("EV07")) {
				        			nota.push({"id":id,"name":7,"n":EVS[value]["n"],"ficha": ficha});
				        		}
				        		if (EVS[value]["name"].includes("EV08")) {
				        			nota.push({"id":id,"name":8,"n":EVS[value]["n"],"ficha": ficha});
				        		}
				        		if (EVS[value]["name"].includes("EV09")) {
				        			nota.push({"id":id,"name":9,"n":EVS[value]["n"],"ficha": ficha});
				        		}
				        		if (EVS[value]["name"].includes("EV10")) {
				        			nota.push({"id":id,"name":10,"n":EVS[value]["n"],"ficha": ficha});
				        		}
			        		}
			        	}
			        	$.ajax({

				               method: 'POST',
				               url: dominio+"registronotas.php",
				               data: JSON.stringify(nota), //en este caso
				               dataType: 'json',
				               asyc: false

				        }).done(function (result) {

				           	consol.log(result)

				        });
			        		////console.log(nota)


					  	////console.log(urls)
		                ajaxRequest(urls);
		            });
		        }
			}

			ajaxRequest(urls); 

	    		
	   });
*/