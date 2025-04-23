function shaderObject(typeIn,textIn)//声明shaderObject类
{
	this.type=typeIn;//初始化type成员变量
	this.text=textIn;//初始化text成员变量
}
var shaderStrArray=["a","a"];
var shaderNumberCount=[0,0];
var shaderTypeName=["vertex","fragment"];
function processLoadShader(req,index,sharderindex)//处理着色器脚本内容的回调函数
{
	if (req.readyState == 4) //若状态为4
	{
		var shaderStr = req.responseText;//获取响应文本
        shaderStrArray[shaderNumberCount[index]]=new shaderObject(shaderTypeName[sharderindex],shaderStr);//顶点着色器脚本内容
        shaderNumberCount[index]++;
		if(shaderNumberCount[index]>1)//如果两个着色器内容均不为空
		{
            shaderProgArray[index]=loadShaderSerial(gl,shaderStrArray[0], shaderStrArray[1]);//加载着色器
            if(shaderNumberCount[index]==2)
			{
				shaderNumberCount[index]=0;
			}
		}
	}
}
//加载着色器的方法
function loadShaderFile(url,index,sharderindex)//从服务器加载着色器脚本的函数
{
	var req = new XMLHttpRequest();//创建XMLHttpRequest对象
	req.onreadystatechange = function () //设置响应回调函数
	{ processLoadShader(req,index,sharderindex) };//调用processLoadShader处理响应
	req.open("GET", url, true);//用GET方式打开指定URL
	req.responseType = "text";//设置响应类型
	req.send(null);//发送HTTP请求
}


