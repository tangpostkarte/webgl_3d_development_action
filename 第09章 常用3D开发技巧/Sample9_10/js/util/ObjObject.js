//加载的用于绘制的3D物体
function ObjObject
(
    gl,				//GL上下文
    vertexDataIn,    //顶点坐标数组
    vertexNormalIn,
    programIn		//着色器程序对象
)
{
    //接收顶点数据
    this.vertexData=vertexDataIn;
    //得到顶点数量
    this.vcount=this.vertexData.length/3;
    //创建顶点数据缓冲
    this.vertexBuffer=gl.createBuffer();
    //将顶点数据送入缓冲
    gl.bindBuffer(gl.ARRAY_BUFFER,this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(this.vertexData),gl.STATIC_DRAW);
    //接收顶点法向量数据
    this.vertexNormal=vertexNormalIn;
    console.log("vertexNormalIn"+vertexNormalIn);
    //创建顶点法向量数据缓冲
    this.vertexNormalBuffer=gl.createBuffer();
    //将顶点法向量数据送入缓冲
    gl.bindBuffer(gl.ARRAY_BUFFER,this.vertexNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(this.vertexNormal),gl.STATIC_DRAW);
    //加载着色器程序
    this.program=programIn;

    this.drawSelf=function(ms,texture)
    {
        //送入总矩阵
        var uMVPMatrixHandle=gl.getUniformLocation(this.program, "uMVPMatrix");
        gl.uniformMatrix4fv(uMVPMatrixHandle,false,new Float32Array(ms.getFinalMatrix()));

        //送入变换矩阵
        var uMMatrixHandle=gl.getUniformLocation(this.program, "uMMatrix");
        gl.uniformMatrix4fv(uMMatrixHandle,false,new Float32Array(ms.currMatrix));

        //送入摄像机位置
        var uCameraHandle=gl.getUniformLocation(this.program, "uCamera");
        gl.uniform3fv(uCameraHandle,new Float32Array([ms.cx,ms.cy,ms.cz]));

        //送入光源位置
        var uLightLocationHandle=gl.getUniformLocation(this.program, "uLightLocation");
        gl.uniform3fv(uLightLocationHandle,new Float32Array([lightManager.lx,lightManager.ly,lightManager.lz]));

        //启用顶点数据
        gl.enableVertexAttribArray(gl.getAttribLocation(this.program, "aPosition"));
        //将顶点数据送入渲染管线
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.vertexAttribPointer(gl.getAttribLocation(this.program, "aPosition"), 3, gl.FLOAT, false, 0, 0);
        //启用顶点纹理坐标数据数组
        gl.enableVertexAttribArray(gl.getAttribLocation(this.program, "aTexCoor"));
        //绑定顶点纹理坐标数据缓冲
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        //给管线指定顶点纹理坐标数据
        gl.vertexAttribPointer(gl.getAttribLocation(this.program, "aTexCoor"), 2, gl.FLOAT, false, 0, 0);

        gl.activeTexture(gl.TEXTURE0);//设置使用的纹理编号-0
        gl.bindTexture(gl.TEXTURE_2D, texture);//绑定白天纹理
        //设置纹理
        gl.uniform1i(gl.getUniformLocation(this.program, "sTexture"), 0);//将白天纹理送入渲染管线
        //启用法向量数据
        gl.enableVertexAttribArray(gl.getAttribLocation(this.program, "aNormal"));
        //将顶点法向量数据送入渲染管线
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexNormalBuffer);
        gl.vertexAttribPointer(gl.getAttribLocation(this.program, "aNormal"), 3, gl.FLOAT, false, 0, 0);

        //用顶点法绘制物体
        gl.drawArrays(gl.TRIANGLES, 0, this.vcount);
    }
}