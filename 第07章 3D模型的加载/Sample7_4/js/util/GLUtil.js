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

//加载纹理图的方法
function loadImageTexture(gl,url,texName)
{
    var texture = gl.createTexture();
    var image = new Image();
    image.onload = function() { doLoadImageTexture(gl, image, texture) }
    image.src = url;
    //texMap.set(texName,texture);
    texMap[texName]=texture;
}

function doLoadImageTexture(gl, image, texture)
{
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.bindTexture(gl.TEXTURE_2D, null);
}

//加载顶点着色器与片元着色器的套件
function loadShaderSerial(gl, vshader, fshader)
{
    //加载顶点着色器
    var vertexShader = loadSingleShader(gl, vshader);
    //加载片元着色器
    var fragmentShader = loadSingleShader(gl, fshader);

    //创建着色器程序
    var program = gl.createProgram();

    //将顶点着色器和片元着色器挂接到着色器程序
    gl.attachShader (program, vertexShader);
    gl.attachShader (program, fragmentShader);


    //链接着色器程序
    gl.linkProgram(program);

    //检查链接是否成功
    var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!linked && !gl.isContextLost())
    {
        //获取并在控制台打印错误信息
        var error = gl.getProgramInfoLog (program);
        log("Error in program linking:"+error);

        gl.deleteProgram(program);
        gl.deleteProgram(fragmentShader);
        gl.deleteProgram(vertexShader);

        return null;
    }

    gl.useProgram(program);
    gl.enable(gl.DEPTH_TEST);
    return program;
}