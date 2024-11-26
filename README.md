# SSMQE


## Features

SSE(Server-Sent Events) を使ってMQTTブローカーっぽい事を実現。
phpが動けばOKなので、普通のレンタルサーバ上でもリアルタイム通信が可能。

## Usage

A. sse/ssmqe_broadcaster.php  
情報配信用プログラム  
  
B. sse/ssmqe_publisher.php  
情報送信用プログラム  
  
C. sse/outbox/  
配信情報一時保存ディレクトリ  
  
D. js/cSSMQE.js  
クライアント用JavaScriptファイル  
  
  
A、B、Cはサーバに設置  
Cには書き込み権限を付与する（777）

