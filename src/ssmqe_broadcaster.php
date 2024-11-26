<?php
/*---------------------------------

SSMQE (Server-Sent Message Queueing Events) 

Broadcaster Script
Ver 1.0
update; 2024.11.24

by P.P

---------------------------------*/

header('Content-Type: text/event-stream');
header('X-Accel-Buffering: no');
header('Cache-Control: no-cache');
header("Access-Control-Allow-Origin: *");

//ドキュメント保存ディレクトリ
$docdir = "./outbox/";

//データコード
$mqid = null;

//アップデートチェック実行
$updatecheak = false;


if (isset($_GET["mqid"]) && !empty($_GET["mqid"])) {
	$mqid = $_GET["mqid"];
}

//最新送信日時
$lasttime = round(microtime(true) * 1000);


/*最後の配信メッセージと時間を比較*/
function fsUpdateCheak($rowdata){
	global $lasttime,$updatecheak;

	if($updatecheak){
		$res = true;
	}else{
		$json = json_decode($rowdata, true);
		$time = intval($json[date]);

		if($time > $lasttime){
			//更新されている
			$lasttime = $time;
			$res = true;
		}else{
			$res = false;
		}
	}

	return $res;
}


/*配信データの生成*/
function fsGetMsgData(){
	global $mqid,$lasttime,$docdir;

	$content = '{"error":"data empty"}';

	if (is_null($mqid)) {
		$content = '{"error":"no room id"}';
	}else{
		// 送信データファイルのパス
		$file = "{$docdir}{$mqid}.json";
		if (file_exists($file)) {
			$rowdata = file_get_contents($file);
			if (!empty($rowdata) && fsUpdateCheak($rowdata)){
				$content = $rowdata;
			}
		}else{
			file_put_contents($file,$content);
		}
	}
	return $content;
}


if (ob_get_level() == 0) ob_start();

ob_get_clean();

while (true) {
	$mqtt = fsGetMsgData();

	if (!empty($mqtt)) {
		//データがあれば配信！
		//echo "event: mmqqtt\n";
		//echo "id: 001\n";
		echo "data: {$mqtt}\n\n";
		echo str_pad('',8196)."\n";
		ob_flush();
		flush();
	}

	if(!$updatecheak){
		$updatecheak = true;
	}

	//1秒停止
	sleep(1);
}

ob_end_flush();


?>



