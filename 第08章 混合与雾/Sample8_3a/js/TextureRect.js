 function TextureRect(								//声明绘制用物体对象所属类
	gl,						 					//GL上下文
	programIn
){
	//this.vertexData=vertexDataIn;						//初始化顶点坐标数据
	this.vertexData= [3.0,0.0,0.0,
					  0.0,0.0,0.0,
					  0.0,3.0,0.0,
					  0.0,3.0,0.0,
					  3.0,3.0,0.0,
					  3.0,0.0,0.0];  
	this.vcount=this.vertexData.length/3;					//得到顶点数量
	this.vertexBuffer=gl.createBuffer();				//创建顶点坐标数据缓冲
	gl.bindBuffer(gl.ARRAY_BUFFER,this.vertexBuffer); 	//绑定顶点坐标数据缓冲
	//将顶点坐标数据送入缓冲
	gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(this.vertexData),gl.STATIC_DRAW);
	
	this.colorsData=[	
						0,1, 
						1,1,
						1,0,
						1,0,
						0,0,
						0,1					
						];
	this.colorBuffer=gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER,this.colorBuffer); 	//绑定颜色数据缓冲
	//将颜色数据送入缓冲
	gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(this.colorsData),gl.STATIC_DRAW);
	
	
	this.program=programIn;		//初始化着色器程序id
	
	this.drawSelf=function(ms,texture)//绘制物体的方法
	{	
		gl.useProgram(this.program);//指定使用某套着色器程序
		//执行平移
		
		var uMVPMatrixHandle=gl.getUniformLocation(this.program, "uMVPMatrix");
		//将总变换矩阵送入渲染管线
		gl.uniformMatrix4fv(uMVPMatrixHandle,false,new Float32Array(ms.getFinalMatrix()));
		
		gl.enableVertexAttribArray(gl.getAttribLocation(this.program, "aPosition"));//启用顶点坐标数据数组
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);	//绑定顶点坐标数据缓冲
		//给管线指定顶点坐标数据
		gl.vertexAttribPointer(gl.getAttribLocation(this.program,"aPosition"),3,gl.FLOAT,false,0, 0);
		
			//启用顶点纹理坐标数据数组
		gl.enableVertexAttribArray(gl.getAttribLocation(this.program, "aTexCoor")); 
		//绑定顶点纹理坐标数据缓冲
		gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
		//给管线指定顶点纹理坐标数据
		gl.vertexAttribPointer(gl.getAttribLocation(this.program, "aTexCoor"), 2, gl.FLOAT, false, 0, 0); 
		
		
		gl.activeTexture(gl.TEXTURE0);//设置使用的纹理编号-0
		gl.bindTexture(gl.TEXTURE_2D, texture);//绑定纹理
		//设置纹理
		gl.uniform1i(gl.getUniformLocation(this.program, "sTexture"), 0);//将纹理送入渲染管线  	
		gl.drawArrays(gl.TRIANGLES, 0, this.vcount);		//用顶点法绘制物体
	}
}
