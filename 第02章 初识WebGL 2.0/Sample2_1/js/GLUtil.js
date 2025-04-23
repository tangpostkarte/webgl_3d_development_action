//初始化WebGL Canvas的方法
function initWebGLCanvas(canvasName) {
    canvas = document.getElementById(canvasName);//获取Canvas对象
    var context = canvas.getContext('webgl2', { antialias: true });//获取GL上下文
    return context;//返回GL上下文对象
}
//加载单个着色器的方法
function loadSingleShader(ctx, shaderScript)
{
	if (shaderScript.type == "vertex")//若为顶点着色器
	{
        var shaderType = ctx.VERTEX_SHADER;//顶点着色器类型
	}
	else if (shaderScript.type == "fragment")//若为片元着色器
    {
        var shaderType = ctx.FRAGMENT_SHADER;//片元着色器类型
    }

	else {//否则打印错误信息
        console.log("*** Error: shader script of undefined type '"+shaderScript.type+"'");
		return null;
	}

	//根据类型创建着色器程序
	var shader = ctx.createShader(shaderType);

	//加载着色器脚本
	ctx.shaderSource(shader, shaderScript.text);

	//编译着色器
	ctx.compileShader(shader);

	//检查编译状态
	var compiled = ctx.getShaderParameter(shader, ctx.COMPILE_STATUS);
	if (!compiled && !ctx.isContextLost()) {//若编译出错
		var error = ctx.getShaderInfoLog(shader);//获取错误信息
		console.log("*** Error compiling shader :"+error);//打印错误信息
		ctx.deleteShader(shader);//删除着色器程序
		return null;//返回空
	}
	return shader;//返回着色器程序
}

//加载链接顶点、片元着色器的方法
function loadShaderSerial(gl, vshader, fshader)
{
	//加载顶点着色器
	var vertexShader = loadSingleShader(gl, vshader);
	//加载片元着色器
	var fragmentShader = loadSingleShader(gl, fshader);

	//创建着色器程序
	var program = gl.createProgram();

	//将顶点着色器和片元着色器挂接到着色器程序
	gl.attachShader (program, vertexShader);//将顶点着色器添加到着色器程序中
	gl.attachShader (program, fragmentShader);//将片元着色器添加到着色器程序中

	//链接着色器程序
	gl.linkProgram(program);

	//检查链接是否成功
	var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
	if (!linked && !gl.isContextLost())//若链接不成功
	{
		//获取并在控制台打印错误信息
		var error = gl.getProgramInfoLog (program);//获取错误信息
		console.log("Error in program linking:"+error);//打印错误信息

		gl.deleteProgram(program);//删除着色器程序
		gl.deleteProgram(fragmentShader);//删除片元着色器
		gl.deleteProgram(vertexShader);//删除顶点着色器

		return null;//返回空
	}
	gl.useProgram(program);//
	gl.enable(gl.DEPTH_TEST);//打开深度检测
	return program;//返回着色器程序
}
				
