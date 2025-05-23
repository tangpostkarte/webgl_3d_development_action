function MatrixManage(Object,dataFromServer)
{
	loadMesh = Object;						//读取的3D模型
	var reOfFolat=/\-*[0-9]+\.*[0-9]*e*-*[0-9]*/g;	//用来匹配数字的正则式
	var reOfWord = /[a-z]+/g;				//匹配英文的正则式
	this.Message = [];						//存储从服务器传来的数据
	this.worldMatrix;						//记录当前模型在世界坐标系下的矩阵
	this.operateName = [];
	this.historyMatrix = [];				//存放模型的历史变换矩阵
	this.indexArray=[];				//存放点平移时的点索引数组
	this.recoverIndex = [];
	this.recoverName = [];			//存放撤销操作名称的数组
	this.recoverMatrix = [];		//存放撤销操作矩阵的数组
	//console.log(dataFromServer);
	var tempArray=[];
	var oldScale = new THREE.Vector3();//操作前物体的缩放比
	var changeScale = new THREE.Vector3();//此次操作缩放比的改变值

	var parentRotationMatrix  = new THREE.Matrix4();//模型在父节点坐标系下的四元数

	var worldRotationMatrix  = new THREE.Matrix4();//表示世界坐标系的四元数
	
	var quaternion = new THREE.Quaternion();//用来表示本次操作时的四元数
	var quaternionXYZ = new THREE.Quaternion();//表示模型当前在世界坐标系下的四元数
	
	var tempMatrix = new THREE.Matrix4();//进行计算时用到的矩阵
	var tempQuaternion = new THREE.Quaternion();//计算旋转时用到的四元数

	
		
	this.getHistoryMessage = function(){//得到服务器传过来的历史记录,改了服务器 这里将会写成真的,
		var temp = [];
		var data = [];
		temp = dataFromServer.split('<#>');//此数组最后会有一个空的元素
		for(var i = 0; i<temp.length-1; i++)
		{
			data = temp[i].split('|');
			this.Message.push(data[1]+"|"+data[2]+"|");
		}
		
		//this.Message.push("tr|1,0,0,0, 0,1,0,0, 0,0,1,0, 2,0,0,1|");//将整体向X轴平移2个单位长度
		//this.Message.push("tr,[1,0,0,0, 0,1,0,0, 0,0,1,0, 0,3,0,1]");//将整体向Y轴平移3个单位长度
		//this.Message.push("ro,[0,0,-1,0, 0,1,0,0, 1,0,0,0, 0,0,0,1]");//将整体向Y轴正方向旋转Math.pi
		//this.Message.push("ro,[0,1,0,0, -1,0,0,0, 0,0,1,0, 0,0,0,1]");//将整体向Z轴正方向旋转Math.pi
		//this.Message.push("ro,[0,0,-1,0, 0,1,0,0, 1,0,0,0, 0,0,0,1]");//将整体向Y轴正方向旋转Math.pi
		//this.Message.push("tr,[1,0,0,0, 0,1,0,0, 0,0,1,0, 2,0,0,1]");//将整体向X轴平移2个单位长度
		//this.Message.push("sc,[0.5,0,0,0, 0,0.5,0,0, 0,0,0.5,0, 0,0,0,1]");//将整体向X轴平移2个单位长度
		//this.Message.push("ro,[0,0,-1,0,0,1,0,0,1,0,0,0,0,0,0,1]");
		//this.Message.push("tr,[1,0,0,0,0,1,0,0,0,0,1,0,-2,0,0,1]");
		//this.Message.push("ro,[0,0,-1,0,0,1,0,0,1,0,0,0,0,0,0,1]");
		//this.Message.push("pt|50,1,0,0,0, 0,1,0,0, 0,0,1,0, 2,0,0,1|");
		
	}
	this.executeSingle = function(str){
		var chineseName;
		var resule = str.match(reOfFolat);	//使用正则式对数据中的数字进行匹配
		var index;//选中的点的索引值
		if(resule.length===17)
		{
			index = resule[0]; 
			resule = resule.splice(1,16);
			
		}
		var matrix = new THREE.Matrix4();				//新建一个4*4的矩阵
		matrix.fromArray(resule);						//将匹配出的数字设置到矩阵中
		var name = str.match(reOfWord);//使用正则式对数据操作中的字母进行匹配
		if(name[0].localeCompare("tr")==0)//如果此次操作为平移
		{
			if(control!==undefined)
			{
				control.attach(loadMesh);
			}
			loadMesh.applyMatrix(matrix);//直接乘平移矩阵
			loadMesh.updateMatrixWorld();//更新世界坐标矩阵
			chineseName = "平移";
		}else if(name[0].localeCompare("ro")==0){//如果此次操作为旋转
			if(control!==undefined)
			{
				control.attach(loadMesh);
			}
			//从模型父节点的世界坐标矩阵中的旋转信息提取出来
			if(loadMesh.parent!==null)
			{parentRotationMatrix.extractRotation(loadMesh.parent.matrixWorld );}
			//将父节点的世界旋转矩阵的逆矩阵转换成四元数
			tempQuaternion.setFromRotationMatrix(tempMatrix.getInverse(parentRotationMatrix ));
			//得到模型的世界坐标矩阵中的旋转信息
			worldRotationMatrix.extractRotation( loadMesh.matrixWorld );
			//将传来的旋转矩阵转化成四元数
			quaternion.setFromRotationMatrix( matrix );
			//将模型的世界旋转矩阵转化成四元数
			quaternionXYZ.setFromRotationMatrix( worldRotationMatrix );
			//将模型父节点的四元数和传来的旋转信息相乘
			tempQuaternion.multiplyQuaternions( tempQuaternion, quaternion );
			//再乘以世界坐标系的旋转四元数
			tempQuaternion.multiplyQuaternions( tempQuaternion, quaternionXYZ );
			//设置模型的旋转四元数
			loadMesh.quaternion.copy( tempQuaternion );
			loadMesh.updateMatrixWorld();//更新世界坐标矩阵
			chineseName = "旋转";
		}else if(name[0].localeCompare("sc")==0){//如果此次操作为缩放
			if(control!==undefined)
			{
				control.attach(loadMesh);
			}
			oldScale.copy(loadMesh.scale);//获取物体当前的缩放倍数
			changeScale.set(matrix.elements[0],matrix.elements[5],matrix.elements[10]);	//设置本次的缩放倍数
			loadMesh.scale.set(oldScale.x*changeScale.x,oldScale.y*changeScale.y,oldScale.z*changeScale.z);//设置物体的缩放倍数结果
			chineseName = "缩放";
		}else if(name[0].localeCompare("pt")==0){
			chineseName = "点移";
				
			var worldMatrix = new THREE.Matrix4();
			worldMatrix.copy(loadMesh.matrixWorld);
			var geoArray;
			if(loadMesh.children[0]!==undefined)
			{
				 geoArray=loadMesh.children[0].geometry.getAttribute( 'position');
			}else{
				 geoArray=loadMesh.geometry.getAttribute( 'position');
			}
			
			selectPoint_position = new THREE.Vector3(geoArray.getX(index),geoArray.getY(index),geoArray.getZ(index));
			selectPoint_position.applyMatrix4(worldMatrix);
			
			var pointTr = new THREE.Matrix4();
			pointTr.copy(matrix);
			selectPoint_position.applyMatrix4(pointTr);

			
			var worldMatrixInverse = new THREE.Matrix4();
			worldMatrixInverse.getInverse(loadMesh.matrixWorld);
			selectPoint_position.applyMatrix4(worldMatrixInverse);
			
			if(loadMesh.children[0]!==undefined)
			{
				loadMesh.children[0].geometry.getAttribute( 'position').setXYZ(index,selectPoint_position.x,selectPoint_position.y,selectPoint_position.z);
				loadMesh.children[0].geometry.attributes.position.needsUpdate = true;
			}else{
				loadMesh.geometry.getAttribute( 'position').setXYZ(index,selectPoint_position.x,selectPoint_position.y,selectPoint_position.z);
				loadMesh.geometry.attributes.position.needsUpdate = true;
			}
			selectPoint_position.applyMatrix4(worldMatrix);
			selectPoint.position.set(selectPoint_position.x,selectPoint_position.y,selectPoint_position.z);
			//control.attach(selectPoint);
			//control.setIndex(index);
					
			
			this.indexArray.push(index);
			//this.recoverIndex.splice(this.recoverIndex.length-1,1);
		}
		
		addResult(chineseName);
		this.historyMatrix.push(matrix);				//将此矩阵放入数组中
		this.operateName.push(name[0]);					//已经进行过的操作
	}
	
	
	this.produceString = function(){   					//将当前的变换信息生成字符串
		var result = ""; 
		for(var i = 0; i<this.Message.length;i++)
		{
			result = result+this.Message[i]+"<#>";
		}
		console.log(result);
		return result;
	}
	this.goCurrent = function(){						//遍历得到的信息并执行
		this.getHistoryMessage();
		for(var i = 0; i < this.Message.length; i++){			//遍历历史数据
			this.executeSingle(this.Message[i]);
		}
	}		
	this.goInverse = function(){//乘以最近进行变换矩阵的逆矩阵
		//console.log(this.historyMatrix.length);
		if(this.historyMatrix.length==0){alert("模型已经撤销到最原始的状态"); return;}
		loadMesh.updateMatrixWorld();//之后要更新物体的世界坐标系
		//loadMesh.applyMatrix(tempMatrix.getInverse(this.historyMatrix[this.historyMatrix.length-1]));
		name = this.operateName[this.operateName.length-1];
		matrix = this.historyMatrix[this.historyMatrix.length-1];
		nest_index = this.indexArray[this.indexArray.length-1];
		//console.log(nest_index);
		//console.log(this.indexArray);
		if(name.localeCompare("tr")==0)//如果此次操作为平移
		{
			control.attach(loadMesh);
			loadMesh.applyMatrix(tempMatrix.getInverse(matrix));//直接乘平移矩阵
			loadMesh.updateMatrixWorld();//更新世界坐标矩阵
		}else if(name.localeCompare("ro")==0){//如果此次操作为旋转
			control.attach(loadMesh);
			//从模型父节点的世界坐标矩阵中的旋转信息提取出来
			if(loadMesh.parent!==null)
			{parentRotationMatrix.extractRotation(loadMesh.parent.matrixWorld );}
			//将父节点的世界旋转矩阵的逆矩阵转换成四元数//
			tempQuaternion.setFromRotationMatrix(tempMatrix.getInverse(parentRotationMatrix));
			//得到模型的世界坐标矩阵中的旋转信息
			worldRotationMatrix.extractRotation( loadMesh.matrixWorld );
			//将传来的旋转矩阵转化成四元数
			quaternion.setFromRotationMatrix( tempMatrix.getInverse(matrix));
			//将模型的世界旋转矩阵转化成四元数
			quaternionXYZ.setFromRotationMatrix( worldRotationMatrix);//
			
			//将模型父节点的四元数和传来的旋转信息相乘
			tempQuaternion.multiplyQuaternions( tempQuaternion, quaternion );
			//再乘以世界坐标系的旋转四元数
			tempQuaternion.multiplyQuaternions( tempQuaternion, quaternionXYZ );
			//设置模型的旋转四元数
			loadMesh.quaternion.copy( tempQuaternion );
			loadMesh.updateMatrixWorld();//更新世界坐标矩阵
		}else if(name.localeCompare("sc")==0){//如果此次操作为缩放
			control.attach(loadMesh);
			changeScale.set(matrix.elements[0],matrix.elements[5],matrix.elements[10]);//设置本次的缩放倍数
		
			loadMesh.scale.set(loadMesh.scale.x/changeScale.x,loadMesh.scale.y/changeScale.y,loadMesh.scale.z/changeScale.z);//设置物体的缩放倍数结果
		}else if(name.localeCompare("pt")==0){
			
			var worldMatrix = new THREE.Matrix4();
			worldMatrix.copy(loadMesh.matrixWorld);
			var	geoArray;
			if(loadMesh.children[0]!==undefined)
			{
				geoArray=loadMesh.children[0].geometry.getAttribute( 'position');
			}else{
				geoArray=loadMesh.geometry.getAttribute( 'position');
			}
			
			selectPoint_position = new THREE.Vector3(geoArray.getX(nest_index),geoArray.getY(nest_index),geoArray.getZ(nest_index));
			selectPoint_position.applyMatrix4(worldMatrix);
			

			var pointTrInverse = new THREE.Matrix4();
			pointTrInverse.getInverse(matrix);
			selectPoint_position.applyMatrix4(pointTrInverse);

			
			var worldMatrixInverse = new THREE.Matrix4();
			worldMatrixInverse.getInverse(loadMesh.matrixWorld);
			selectPoint_position.applyMatrix4(worldMatrixInverse);
			
			if(loadMesh.children[0]!==undefined){
				loadMesh.children[0].geometry.getAttribute( 'position').setXYZ(nest_index,selectPoint_position.x,selectPoint_position.y,selectPoint_position.z);
				loadMesh.children[0].geometry.attributes.position.needsUpdate = true;
			}else{
				loadMesh.geometry.getAttribute( 'position').setXYZ(nest_index,selectPoint_position.x,selectPoint_position.y,selectPoint_position.z);
				loadMesh.geometry.attributes.position.needsUpdate = true;
			}
			selectPoint_position.applyMatrix4(worldMatrix);
			selectPoint.position.set(selectPoint_position.x,selectPoint_position.y,selectPoint_position.z);
			control.attach(selectPoint);
			control.setIndex(nest_index);

			
				
			this.recoverIndex.push(this.indexArray[this.indexArray.length-1]);
			this.indexArray.splice(this.indexArray.length-1,1);
			

		}
		this.recoverName.push(this.operateName[this.operateName.length-1]);
		this.recoverMatrix.push(this.historyMatrix[this.historyMatrix.length-1]);
		
		this.operateName.splice(this.operateName.length-1,1);
		this.historyMatrix.splice(this.historyMatrix.length-1,1);
		deleteResult();
		
		loadMesh.updateMatrixWorld();//之后要更新物体的世界坐标系
		this.Message.splice(this.Message.length-1,1);//在系统中把对应的信息删除掉
	}
	this.noteHistory = function(str){//OK
		this.Message.push(str);
		var resule = str.match(reOfFolat);	//使用正则式对数据中的数字进行匹配
		var matrix = new THREE.Matrix4();				//新建一个4*4的矩阵
		var index ;
		//console.log(resule.length);
		if(resule.length===17)
		{
			index = resule[0]; 
			resule = resule.splice(1,16);

		}
		matrix.fromArray(resule);						//将匹配出的数字设置到矩阵中

		var name = str.match(reOfWord);		//使用正则式对数据操作中的字母进行匹配
		if(name=="tr"){addResult("平移");}
		if(name=="ro"){addResult("旋转");}
		if(name=="sc"){addResult("缩放");}
		if(name=="pt"){addResult("点移");this.indexArray.push(index);console.log(this.indexArray);}
		this.operateName.push(name);
		this.historyMatrix.push(matrix);
		this.recoverName=[];
		this.recoverMatrix=[];
	}

	this.recover = function()
	{   
		var chineseName;
		if(this.recoverName.length===0)
		{
			alert("您没有进行撤销操作");
			return;
		}else{
			name = this.recoverName[this.recoverName.length-1];
			matrix = this.recoverMatrix[this.recoverMatrix.length-1];
			if(name.localeCompare("tr")==0)//如果此次操作为平移
			{
				control.attach(loadMesh);
				chineseName = "平移";
				loadMesh.applyMatrix(matrix);//直接乘平移矩阵
				loadMesh.updateMatrixWorld();//更新世界坐标矩阵
			}else if(name.localeCompare("ro")==0){//如果此次操作为旋转
				control.attach(loadMesh);
				chineseName = "旋转";
				//从模型父节点的世界坐标矩阵中的旋转信息提取出来
				if(loadMesh.parent!==null)
				{parentRotationMatrix.extractRotation(loadMesh.parent.matrixWorld );}
				//将父节点的世界旋转矩阵的逆矩阵转换成四元数
				tempQuaternion.setFromRotationMatrix(tempMatrix.getInverse(parentRotationMatrix ));
				//得到模型的世界坐标矩阵中的旋转信息
				worldRotationMatrix.extractRotation( loadMesh.matrixWorld );
				//将传来的旋转矩阵转化成四元数
				quaternion.setFromRotationMatrix( matrix );
				//将模型的世界旋转矩阵转化成四元数
				quaternionXYZ.setFromRotationMatrix( worldRotationMatrix );
				//将模型父节点的四元数和传来的旋转信息相乘
				tempQuaternion.multiplyQuaternions( tempQuaternion, quaternion );
				//再乘以世界坐标系的旋转四元数
				tempQuaternion.multiplyQuaternions( tempQuaternion, quaternionXYZ );
				//设置模型的旋转四元数
				loadMesh.quaternion.copy( tempQuaternion );
				loadMesh.updateMatrixWorld();//更新世界坐标矩阵
			}else if(name.localeCompare("sc")==0){//如果此次操作为缩放
				control.attach(loadMesh);
				chineseName = "缩放";
				oldScale.copy(loadMesh.scale);//获取物体当前的缩放倍数
				changeScale.set(matrix.elements[0],matrix.elements[5],matrix.elements[10]);	//设置本次的缩放倍数
				loadMesh.scale.set(oldScale.x*changeScale.x,oldScale.y*changeScale.y,oldScale.z*changeScale.z);//设置物体的缩放倍数结果
			}else if(name.localeCompare("pt")==0){
				chineseName = "点移";
				var index  = this.recoverIndex[this.recoverIndex.length-1];
				
				var worldMatrix = new THREE.Matrix4();
				worldMatrix.copy(loadMesh.matrixWorld);
				
				var geoArray;
				if(loadMesh.children[0]!==undefined)
				{
					geoArray=loadMesh.children[0].geometry.getAttribute( 'position');
				}else{
					geoArray=loadMesh.geometry.getAttribute( 'position');
				}
			
				selectPoint_position = new THREE.Vector3(geoArray.getX(index),geoArray.getY(index),geoArray.getZ(index));
				selectPoint_position.applyMatrix4(worldMatrix);
			
				var pointTr = new THREE.Matrix4();
				pointTr.copy(matrix);
				selectPoint_position.applyMatrix4(pointTr);

			
				var worldMatrixInverse = new THREE.Matrix4();
				worldMatrixInverse.getInverse(loadMesh.matrixWorld);
				selectPoint_position.applyMatrix4(worldMatrixInverse);
				if(loadMesh.children[0]!==undefined){
			
					loadMesh.children[0].geometry.getAttribute( 'position').setXYZ(index,selectPoint_position.x,selectPoint_position.y,selectPoint_position.z);
					loadMesh.children[0].geometry.attributes.position.needsUpdate = true;
				}else{
					loadMesh.geometry.getAttribute( 'position').setXYZ(index,selectPoint_position.x,selectPoint_position.y,selectPoint_position.z);
					loadMesh.geometry.attributes.position.needsUpdate = true;
				}
				selectPoint_position.applyMatrix4(worldMatrix);
				selectPoint.position.set(selectPoint_position.x,selectPoint_position.y,selectPoint_position.z);	
				control.attach(selectPoint);
				control.setIndex(index);
				
				this.indexArray.push(index);
				this.recoverIndex.splice(this.recoverIndex.length-1,1);
			}
			
			addResult(chineseName);
			
			this.operateName.push(this.recoverName[this.recoverName.length-1]);
			this.historyMatrix.push(this.recoverMatrix[this.recoverMatrix.length-1]);
			
			this.recoverMatrix[this.recoverMatrix.length-1].toArray(tempArray,0);
			this.Message.push(this.recoverName[this.recoverName.length-1]+"|"+tempArray[0]+","+tempArray[1]+","+tempArray[2]+","+tempArray[3]+","+tempArray[4]+","+tempArray[5]+","+tempArray[6]+","+tempArray[7]+","+tempArray[8]+","+tempArray[9]+","+tempArray[10]+","+tempArray[11]+","+tempArray[12]+","+tempArray[13]+","+tempArray[14]+","+tempArray[15]+"|");
			this.recoverName.splice(this.recoverName.length-1,1);
			this.recoverMatrix.splice(this.recoverMatrix.length-1,1);	
		}
		
	}
	function consoleArray(array){
		console.log(array[0]+","+array[1]+","+array[2]+","+array[3]+","+array[4]+","+array[5]+","+array[6]+","+array[7]+","+array[8]+","+array[9]+","+array[10]+","+array[11]+","+array[12]+","+array[13]+","+array[14]+","+array[15]);
		
	}
	//this.history
}