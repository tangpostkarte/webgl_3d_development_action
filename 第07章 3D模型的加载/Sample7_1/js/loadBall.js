function loadObjFile(url)//请求读取obj文件的方法
{
	var req = new XMLHttpRequest();//创建对服务器的请求
	req.onreadystatechange = function () { processLoadObj(req) };//重写请求的onreadystatechange事件
	req.open("GET", url, true);//设置请求的类型和obj文件的路径
	req.responseType = "text";//设置回应的类型
	req.send(null);
}

function createObj(objDataIn)//用提取的数据创建绘制对象的方法
{
	if(shaderProgArray[0])//如果着色器已经进行编译
	{
		ooTri=new ObjObject(gl,objDataIn.vertices,shaderProgArray[0]); //创建绘制用的物体
	}
	else{//如果着色器还未进行编译
		setTimeout(function(){createObj(objDataIn);},10); //10毫秒之后再次进行调用
	}
}

function processLoadObj(req)//重写后的onreadystatechange事件
{
	if (req.readyState == 4) //当接受到服务器传来的数据后
	{
		var objStr = req.responseText;//得到obj文件的文本数据
		var dataTemp=fromObjStrToObjectData(objStr);//对数据进行处理和提取
		createObj(dataTemp);//用提取的数据创建绘制对象
	}
}