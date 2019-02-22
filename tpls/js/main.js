var app = {};
app.count = 0;
app.lock = false;
app.initBusca = function initBusca() {
	app.mask();
	app.searchXML();

	$("#resultok").hide();
	$("#resultok").html("");
	$("#mainok").show();
	$("#bxloading").hide();
	$("#consultaIden").show();
	$('#consultaIden').attr('disabled', false);
	$("#cpf").focus();
	$("#cpf").val("");
};

app.mask = function() {
	$('#cpf').mask("999.999.999-99");
};

app.pesquisar = function(doc, score, callback) {
	$("#alertcpfinvalido").hide();
	$("#alertnadaencontrado").hide();
	$("#alertindisponivel").hide();
	$("#alertprocessando").hide();
	$("#consultaIden").hide();
	$("#bxloading").show();

	$.ajax({
		method : "POST",
	    url : './credimaxCpf.php',
	    data: { dados: doc, score:score },
	    dataType: 'json',
	    timeout: 15000
	})
	.done(function(res) {

		if(res.msg) {
			if(res.msg === 'reload') {
				callback({msg:'reload'});
			}else if(res.msg === 'fail') {
				callback({msg:'fail'});
			}else if(res.msg === 'invalido') {
				callback({msg:'invalido'});
			}else if(res.msg === 'nadaencontrado') {
				callback({msg:'reload'});
			}else{
				callback(res);
			}
		} else {
			callback(res);
		}
	})
	.fail(function() {
		callback({msg:'reload'});
	});

};


app.consultar = function() {

	var score = $("input[name='comScore']:checked").val();
	var cpfFiltro 	= $('#cpf').val();
	var feed 		= $('.feedback-result').addClass('bg-danger');
	var cpfError	= $('#cpf').parent().addClass('has-error');

	if(cpfFiltro == '') {
		$("#alertcpfinvalido").fadeIn();
	} else if(cpfFiltro.length < 14) {
		$("#alertcpfinvalido").fadeIn();
	} else {
		$('#cpf').parent().removeClass('has-error');
		$('#loader').fadeIn();
		$('#consultaIden').attr('disabled', true);

		var doc = $("#cpf").val();
		doc = doc.replace(".", "");
		doc = doc.replace(".", "");
		doc = doc.replace("-", "");
		doc = doc.replace("	", "");
		doc = doc.replace(" ", "");
		doc = doc.replace("	", "");
		doc = doc.replace("\t", "");
		doc = doc.replace("\n", "");
		doc = Number(doc);
		
		app.lock = true;
		
		app.pesquisar(doc, score, function(res) {

			if(res.msg) {
				if(res.msg === 'reload') {
					app.count++;
					if(app.count >= 3) {
						$("#bxloading").hide();
						$("#alertindisponivel").show();
						$("#alertprocessando").hide();
						$("#consultaIden").show();
						$('#consultaIden').attr('disabled', false);
						app.lock = false;
						app.count =0;
						return;
					}else {
						setTimeout( function() {
							$("#alertindisponivel").hide();
							app.consultar();
							$("#alertprocessando").show();
							app.lock = true;
						}, 2000);

						return false;
					}
				}else{
					app.lock = false;
					$("#alertprocessando").hide();
				}

				if(res.msg === 'fail') {
					$("#alertindisponivel").show();
					$('#consultaIden').attr('disabled', false);
				}else{
					$("#alertindisponivel").hide();
				}

				if(res.msg === 'invalido') {
					$('#consultaIden').attr('disabled', false);
					$("#alertcpfinvalido").show();
				}else{
					$("#alertcpfinvalido").hide();
				}

				if(res.msg === 'nadaencontrado') {
					$("#alertnadaencontrado").show();
				}else{
					$("#alertnadaencontrado").hide();
				}

				$("#consultaIden").show();
				$("#bxloading").hide();
				app.lock = false;
			}else if(res.dados) {
				app.lock = false;
				$("#alertcpfinvalido").hide();
				$("#alertnadaencontrado").hide();
				$("#alertindisponivel").hide();
				$("#alertprocessando").hide();
				$("#consultaIden").hide();
				$("#bxloading").hide();
				$("#mainok").hide();
				$("#resultok").html(res.dados).show();

			}else{

				app.count++;
				if(app.count >= 3) {
					$("#bxloading").hide();
					$("#alertindisponivel").show();
					$("#alertprocessando").hide();
					$("#consultaIden").show();
					$('#consultaIden').attr('disabled', false);
					app.lock = false;
					app.count=0;
					return;
				}else {

					setTimeout( function() {
						app.lock = true;
						$("#alertindisponivel").hide();
						app.consultar();
						$("#alertprocessando").show();
					}, 1500);

					return false;
				}

			}

//			alert(res);
		});
	}
};

$.fn.onEnterKey = function(closure) {
    $(this).keypress(function(event) {
        var code = event.keyCode ? event.keyCode : event.which;

        if (code == 13) {
        	if(app.lock !== true) {
	            closure();
	            return false;
        	}
        }
    });
};

app.searchXML = function() {
	$('#consultaIden').off().on({
		'click' : function() {
			app.consultar();
			return false;
		}
	});
	$('input').onEnterKey(function() {
		app.consultar();
		return false;
	});
};
function printer() {
	window.print();
}

function newcon() {
	app.initBusca();
}
$( document ).ready(function() {
	newcon();
	$("#index").css("background", "url('tpls/img/bg-top.jpg') center -100px repeat-x");
});


