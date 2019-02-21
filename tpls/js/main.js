var app = {};

app.initBusca = function initBusca() {
	app.mask();
	app.searchXML();
};

app.mask = function() {
	$('#cpf').mask("999.999.999-99");
};

app.consultaXML = function() {
	var cpfFiltro 	= $('#cpf').val(),
		tokenFiltro = $('#token').val(),
		feed 		= $('.feedback-result').addClass('bg-danger'),
		cpfError	= $('#cpf').parent().addClass('has-error');

	if(cpf == '') {
		feed.html('<strong>POR FAVOR, PREENCHA O CAMPO CPF</strong>').fadeIn();
		cpfError;
	} else if(cpfFiltro.length < 14) {
		feed.html('<strong>POR FAVOR, DIGITE UM CPF VÁLIDO</strong>').fadeIn();
		cpfError;
	} else {
		$('#cpf').parent().removeClass('has-error');
		$('#loader').fadeIn();
		$('#consultaIden').attr('disabled', true);
		document.getElementById("formIden").submit();
	}
};

$.fn.onEnterKey = function(closure) {
    $(this).keypress(function(event) {
        var code = event.keyCode ? event.keyCode : event.which;

        if (code == 13) {
            closure();
            return false;
        }
    });
};

app.searchXML = function() {
	$('#consultaIden').off().on({
		'click' : function() {
			app.consultaXML();
			return false;
		}
	});
	$('input').onEnterKey(function() {
		app.consultaXML();
		return false;
	});
};

app.initBusca();
