function Ball(								//声明绘制用物体对象所属类
	gl,						 					//GL上下文
	programIn,	//着色器程序id
	BallR
	){
	this.vertexData=new Array();
	var r=BallR;
	this.initVertexData=function()
	{
		var angleSpan=10;//将求进行单位切分的角度
		for(var vAngle = -90; vAngle < 90; vAngle = vAngle + angleSpan)
		{
			for (var hAngle = 0; hAngle <= 360; hAngle = hAngle + angleSpan)// 水平方向angleSpan度一份
				{// 纵向横向各到一个角度后计算对应的此点在球面上的坐标
					var x0 = r * Math.cos(vAngle*Math.PI/180) * Math.cos(hAngle*Math.PI/180);
					var y0 = r * Math.cos(vAngle*Math.PI/180) * Math.sin(hAngle*Math.PI/180);
					var z0 = r * Math.sin(vAngle*Math.PI/180);

					var x1 = r * Math.cos(vAngle*Math.PI/180) * Math.cos((hAngle+angleSpan)*Math.PI/180);
					var y1 = r * Math.cos(vAngle*Math.PI/180) * Math.sin((hAngle+angleSpan)*Math.PI/180);
					var z1 = r * Math.sin(vAngle*Math.PI/180);

					var x2 = r * Math.cos((vAngle+angleSpan)*Math.PI/180) * Math.cos((hAngle+angleSpan)*Math.PI/180);
					var y2 = r * Math.cos((vAngle+angleSpan)*Math.PI/180) * Math.sin((hAngle+angleSpan)*Math.PI/180);
					var z2 = r * Math.sin((vAngle + angleSpan)*Math.PI/180);

					var x3 = r * Math.cos((vAngle+angleSpan)*Math.PI/180) * Math.cos(hAngle*Math.PI/180);
					var y3 = r * Math.cos((vAngle+angleSpan)*Math.PI/180) * Math.sin(hAngle*Math.PI/180);
					var z3 = r * Math.sin((vAngle + angleSpan)*Math.PI/180);
					
					this.vertexData.push(x1,y1,z1);
					this.vertexData.push(x3,y3,z3);
					this.vertexData.push(x0,y0,z0);
					
					this.vertexData.push(x1,y1,z1);
					this.vertexData.push(x2,y2,z2);
					this.vertexData.push(x3,y3,z3);
				}
		}
	}
	this.initVertexData();
	this.vcount=this.vertexData.length/3;					//得到顶点数量
	this.vertexBuffer=gl.createBuffer();				//创建顶点坐标数据缓冲
	gl.bindBuffer(gl.ARRAY_BUFFER,this.vertexBuffer); 	//绑定顶点坐标数据缓冲
	//将顶点坐标数据送入缓冲
	gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(this.vertexData),gl.STATIC_DRAW);
	
	this.normalData=this.vertexData;
	this.normalBuffer=gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER,this.normalBuffer);
	//将法向量坐标数据送入缓冲
	gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(this.normalData),gl.STATIC_DRAW);
	
	this.program=programIn;		//初始化着色器程序id
	this.drawSelf=function(ms)//绘制物体的方法
	{	
		gl.useProgram(this.program);//指定使用某套着色器程序
		//获取总变换矩阵引用id
		var uMVPMatrixHandle=gl.getUniformLocation(this.program, "uMVPMatrix");
		//将总变换矩阵送入渲染管线
		gl.uniformMatrix4fv(uMVPMatrixHandle,false,new Float32Array(ms.getFinalMatrix()));
		
		var uMMatrixHandle=gl.getUniformLocation(this.program, "uMMatrix");
		//将总变换矩阵送入渲染管线
		gl.uniformMatrix4fv(uMMatrixHandle,false,new Float32Array(ms.getMMatrix()));
		
		var uLightLocationHandle=gl.getUniformLocation(this.program, "uLightLocation");
        gl.uniform3fv(uLightLocationHandle,new Float32Array([lightManager.lx,lightManager.ly,lightManager.lz]));
		
		var uCameraHandle=gl.getUniformLocation(this.program, "uCamera");
        gl.uniform3fv(uCameraHandle,new Float32Array([ms.cameraFB[0],ms.cameraFB[1],ms.cameraFB[2]]));
		
		gl.enableVertexAttribArray(gl.getAttribLocation(this.program, "aPosition"));//启用顶点坐标数据数组
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);	//绑定顶点坐标数据缓冲
		//给管线指定顶点坐标数据
		gl.vertexAttribPointer(gl.getAttribLocation(this.program,"aPosition"),3,gl.FLOAT,false,0, 0);
		
		gl.enableVertexAttribArray(gl.getAttribLocation(this.program, "aNormal"));//启用法向量数据数组
		gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);	//绑定法向量数据缓冲
		//给管线指定法向量坐标数据
		gl.vertexAttribPointer(gl.getAttribLocation(this.program,"aNormal"),3,gl.FLOAT,false,0, 0);
		
		var muRHandle = gl.getUniformLocation(this.program, "uR");
		gl.uniform1f(muRHandle,r);
		
		gl.drawArrays(gl.TRIANGLES, 0, this.vcount);		//用顶点法绘制物体
		
	}
}
