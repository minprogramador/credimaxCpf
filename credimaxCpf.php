<?php

if(strlen(http_build_query($_POST)) > 5) {
	$doc   = $_POST['dados'];
	$score = $_POST['score'];
	if(!preg_match("#^([0-9]){3}([0-9]){3}([0-9]){3}([0-9]){2}$#i", $doc)) {
		$dados = array('msg' => 'invalido');
	} else {
		//$dados = array('msg' => 'reload');
		//$error = array('msg' => 'fail');

		$res = file_get_contents('dados.html');
		$dados = array('dados' => $res);
	}

	header("Content-type:application/json");

	if(isset($dados)) {
		echo json_encode($dados);
	}else{
		echo json_encode(array('msg'=> 'fail'));
	}

	die;
}else{
	$tpl = file_get_contents('tpls/index.html');
	echo $tpl;
}
