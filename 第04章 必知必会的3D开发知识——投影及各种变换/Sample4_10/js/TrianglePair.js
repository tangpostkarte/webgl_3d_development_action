function TrianglePair(								//声明绘制用物体对象所属类
	gl,						 					//GL上下文
	programIn	//着色器程序id
){
	this.vertexData=[
		-8 * 0.125, 10 * 0.125, 0,
		-2 * 0.125, 2 * 0.125, 0,
		-8 * 0.125, 2 * 0.125, 0,
		8 * 0.125, 2 * 0.125, 0,
		8 * 0.125, 10 * 0.125, 0,
		2 * 0.125, 10 * 0.125, 0
	];
	this.vcount=6;					//得到顶点数量
	this.vertexBuffer=gl.createBuffer();				//创建顶点坐标数据缓冲
	gl.bindBuffer(gl.ARRAY_BUFFER,this.vertexBuffer); 	//绑定顶点坐标数据缓冲
	//将顶点坐标数据送入缓冲
	gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(this.vertexData),gl.STATIC_DRAW);

	this.colorsData=[
		1, 1, 1, 1.0,
		0, 0, 1, 1.0,
		0, 0, 1, 1.0,
		1, 1, 1, 1.0,
		0, 1, 0, 1.0,
		0, 1, 0, 1.0
	];
	this.colorBuffer=gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER,this.colorBuffer); 	//绑定颜色数据缓冲
	//将颜色数据送入缓冲
	gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(this.colorsData),gl.STATIC_DRAW);
	this.program=programIn;		//初始化着色器程序id
	this.drawSelf=function(ms)//绘制物体的方法
	{
		gl.useProgram(this.program);//指定使用某套着色器程序
		//获取总变换矩阵引用id
		var uMVPMatrixHandle=gl.getUniformLocation(this.program, "uMVPMatrix");
		//将总变换矩阵送入渲染管线
		gl.uniformMatrix4fv(uMVPMatrixHandle,false,new Float32Array(ms.getFinalMatrix()));

		gl.enableVertexAttribArray(gl.getAttribLocation(this.program, "aPosition"));//启用顶点坐标数据数组
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);	//绑定顶点坐标数据缓冲
		//给管线指定顶点坐标数据
		gl.vertexAttribPointer(gl.getAttribLocation(this.program,"aPosition"),3,gl.FLOAT,false,0, 0);

		gl.enableVertexAttribArray(gl.getAttribLocation(this.program, "aColor"));//启用顶点坐标数据数组
		gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);	//绑定顶点坐标数据缓冲
		//给管线指定顶点坐标数据
		gl.vertexAttribPointer(gl.getAttribLocation(this.program,"aColor"),4,gl.FLOAT,false,0, 0);
		gl.drawArrays(gl.TRIANGLES, 0, this.vcount);		//绘制圆
	}
}
