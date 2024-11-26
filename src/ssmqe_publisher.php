<?php
/*---------------------------------

SSMQE (Server-Sent Message Queueing Events) 

Publisher Script
Ver 1.0
update; 2024.11.24

by P.P

---------------------------------*/

//ドキュメント保存ディレクトリ
$docdir = "./outbox/";

$posted = file_get_contents('php://input');

//受信データが空でないか確認
if (!empty($posted)) {

	//配信コードをチェック
	$jsonData = json_decode($posted,true);
	$mqid = $jsonData['mid'];

	if (!empty($mqid)) {
		//配信コードがあれば、データ登録（上書き保存）
		$file = "{$docdir}{$mqid}.json";
		file_put_contents($file , $posted);
		echo $mqid;
	}else{
		echo false;
	}
} else {
	echo false;
}

?>



