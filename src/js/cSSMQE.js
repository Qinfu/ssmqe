/*---------------------------------

SSMQE（Server-Sent Message Queueing Events）
JavaSCript Class

Ver 1.0
update; 2024.11.24

by P.P

---------------------------------*/


const oSSMQEInit = {
	_broker:"../src/ssmqe_broadcaster.php",
	_publisher:"../src/ssmqe_publisher.php"
}


class cSSMQE{

	constructor(){
		if (!window.EventSource) return false;
		this._sse = null;
		this._mqid = null;
		this._uid = generateUniqueId();
		this._lasttime = 0;
		this._upcheak = true;
	}

	set mqid(xVal){
		this._mqid = xVal;
	}
	get mqid(){
		return(this._mqid);
	}

	set user_id(xVal){
		this._uid = xVal;
	}
	get user_id(){
		return(this._uid);
	}


	/*SSE 接続*/
	open(xMQid = null){
		if(!xMQid) return false;

		this._mqid = xMQid;
		this._lasttime = new Date().getTime();

		const xServer = `${oSSMQEInit._broker}?mqid=${this._mqid}`;
		this._sse = new EventSource(xServer,{
			withCredentials: true
		});
		//console.log(this._sse.readyState);

		this._sse.onopen = (evt) =>{
			this.on_open(evt);
		}

		this._sse.onerror = (evt) =>{
			this.on_error(evt);
		};

		this._sse.onmessage = (evt) =>{
			const xData = JSON.parse(evt.data);
			//const xData = evt.data;
			if(this.fsCheakUpdate(xData)){
				this.on_message(xData);
			}
		};

		console.log("[cSSMQE]Connect SSE",this._mqid);
	}


	fsCheakUpdate(xData){
		let xRes = false;

		if(this._upcheak){
			//const xJson = JSON.parse(xData);
			const xTime = Number(xData.date);
			if(xTime > this._lasttime){
				this._lasttime = xTime;
				xRes = true;
			}
		}
		return xRes;
	}


	/*SSE 切断*/
	close(){
		if(!this._sse) return false;
		this._sse.close();
		this._sse = null;
		console.log("[cSSMQE]Close SSE",this._mqid);
	}

	on_open(evt){
		console.log("[cSSMQE]Open SSE Connection");
	}

	on_message(xData){
		console.log("[cSSMQE]Get Message");
		console.log(xData);
	}

	on_error(evt){
		console.error("[cSSMQE]EventSource failed:", evt.type);
	}


	/*データ送信*/
	async publish(xMsg=""){
		if(xMsg == "") return false;

		const xSendMsg = {
			"mid":this._mqid,
			"uid":this._uid,
			"date":new Date().getTime(),
			"value":xMsg
		};

		try{
			const xRes = await fetch(oSSMQEInit._publisher, {
				method: 'POST',
				headers: {
					"Content-Type":" application/json",
				},
				body: JSON.stringify(xSendMsg)
			});

			//console.log(xRes);
		} catch (err) {
			console.error(err);
		};
	}

}


/*--------------------------------------------*/


/*ユニーク値生成 
 （xStrong = true ：重複確率の極めて低いものを生成）
*/
const generateUniqueId = (xStrong=false) =>{
	let xUID = "id-" + crypto.getRandomValues(new Uint32Array(1))[0].toString(36);
	if(xStrong){
		xUID += Date.now().toString(36);
	}
	//xUID += Math.random().toString(36).substr(2, 9);

	return xUID;
}

/*ユニークUUIDを生成*/
const generateUUID = () =>{
	const cryptoObj = window.crypto || window.msCrypto; // for IE 11
	const array = new Uint8Array(16);
	cryptoObj.getRandomValues(array);

	// Set the version to 4 (random)
	array[6] = (array[6] & 0x0f) | 0x40;
	array[8] = (array[8] & 0x3f) | 0x80;

	const hexArray = Array.from(array, byte => byte.toString(16).padStart(2, '0'));
	const xUID = `${hexArray.slice(0, 4).join('')}-${hexArray.slice(4, 6).join('')}-${hexArray.slice(6, 8).join('')}-${hexArray.slice(8, 10).join('')}-${hexArray.slice(10, 16).join('')}`;

	return xUID;
}
