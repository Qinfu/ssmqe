
//////////////////////////////////////////

let pSSmqe = null;

$(function(){

	let xID = "";
	if(getParamArgs()["mqid"]){
		xID = getParamArgs()["mqid"];
	};
	$("input[name='dataId']").val(xID);

	pSSmqe = new cSSMQE(xID);

	pSSmqe.on_open = (evt) =>{
		console.log("Open SSE Connection");
	}

	pSSmqe.on_message = (xData) =>{
		console.log("Get SSE Message");
		fsGetMSg(xData);
	}

	pSSmqe.on_error = (evt) =>{
		console.log("Error",evt);
	};

	$("input[name='brodcaster']").val(oSSMQEInit._broker);
	$("input[name='publisher']").val(oSSMQEInit._publisher);
	$("input[name='usrId']").val(pSSmqe.user_id);


	//SSE 接続・切断ボタン
	$("input[name='connectBtn']").on("change",(evt) =>{
		const xState = $(evt.target).prop("checked");
		$("button[name='pubBtn']").prop("disabled",!xState);
		
		if(xState){
			fsOpenConenction();
		}else{
			fsCloseConenction();
		}
	});

	//メッセージ送信ボタン
	$("button[name='pubBtn']").on("click",(evt) =>{
		fsPublishMsg();
	});

	$(window).on("load",() =>{
		trace("page loaded");
	});
});


/*SSTサーバ接続*/
const fsOpenConenction = () =>{
	const xMQid = $("input[name='dataId']").val();
	if(xMQid && xMQid != ""){
		//SSTサーバ接続
		pSSmqe.open(xMQid);
	}else{
		alert("Plese inut Data ID");
		$("input[name='connectBtn']").prop("checked",false);
		$("button[name='pubBtn']").prop("disabled",true);
	}
}

/*SSTサーバ切断*/
const fsCloseConenction = () =>{
	pSSmqe.close();
}


/*メッセージ受信*/
const fsGetMSg = (xJson) =>{
	console.log(xJson);
	const xTgFld = $("textarea[name='resultFld']");

	let xLogData = xTgFld.val();
	xLogData += JSON.stringify(xJson) +'\n';
	xTgFld.val(xLogData);

	const xHeight =  xTgFld[0].scrollHeight - $(xTgFld).height();
	xTgFld.scrollTop(xHeight);
}


/*メッセージ送信*/
const fsPublishMsg = () =>{
	if(!pSSmqe) return false;
	const xMsg = $("input[name='msgTxt']").val();
	if(xMsg == "") return false;

	pSSmqe.publish(xMsg);

}



