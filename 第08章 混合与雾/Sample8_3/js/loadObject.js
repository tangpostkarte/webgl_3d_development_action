function loadObjFile(url,object,id)//从服务器获取Obj文本内容的函数
{
	var req = new XMLHttpRequest();//异步请求对象
	//设置响应回调函数，调用processObjectLoadObj处理响应
	req.onreadystatechange = function () { processObjectLoadObj(req,object,id) };
	req.open("GET", url, true);//用GET方式打开指定URL
	req.responseType = "text";//设置响应类型
	req.send(null);//发送HTTP请求
}
function createObject(objDataIn,object,id)//创建物体绘制对象的方法
{
	if(shaderProgArray[id])//如果指定着色器已加载完毕
	{
		switch(object)
		{//物体编号
			case 0://创建地图对象
				masss=new ObjObject(gl,objDataIn.vertices,objDataIn.normals,shaderProgArray[id]);
			break;
	  
			case 1://创建天空盒对象
				masss1=new ObjObject(gl,objDataIn.vertices,objDataIn.normals,shaderProgArray[id]);
			break;
		  
			case 2://创建矩形绘制对象
				masss2=new ObjObject(gl,objDataIn.vertices,objDataIn.normals,shaderProgArray[id]); 
			break;
		  
			case 3://创建水池对象
				masss3=new ObjObject(gl,objDataIn.vertices,objDataIn.normals,shaderProgArray[id]);
			break;
		  
			case 4://创建草坪对象
				masss4=new ObjObject(gl,objDataIn.vertices,objDataIn.normals,shaderProgArray[id]);
			break;
			
			
		}
		
	}
	else
	{
		setTimeout(function(){createObject(objDataIn,object,id);},10); //休息10ms后再执行
	}
}

function processObjectLoadObj(req,object,id)//处理obj文本内容的回调函数
{
	if (req.readyState == 4) //若状态为4
	{
		var objStr = req.responseText;		//获取响应文本	
		this.dataTemp=fromObjStrToObjectData(objStr);//将obj文本解析为数据对象
		createObject(dataTemp,object,id); 	//创建绘制用物体对象
	}
} 