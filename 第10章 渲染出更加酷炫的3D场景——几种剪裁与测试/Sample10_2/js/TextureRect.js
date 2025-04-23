function TextureRect(								//声明绘制用物体对象所属类
	gl,						 					//GL上下文
	programIn	//着色器程序id
	){
	this.vcount=6;					//得到顶点数量
	this.vertices=[-4*1.0,0,-2.568*1.0,
        	-4*1.0,0,2.568*1.0,     
        	4*1.0,0,2.568*1.0,
        	
        	4*1.0,0,2.568*1.0,
        	4*1.0,0,-2.568*1.0,     
        	-4*1.0,0,-2.568*1.0];
	this.texcoor=[0,0,0,0.642,1,0.642,
            1,0.642,1,0,0,0];
	
	this.vertexBuffer=gl.createBuffer();				//创建顶点坐标数据缓冲
	gl.bindBuffer(gl.ARRAY_BUFFER,this.vertexBuffer); 	//绑定顶点坐标数据缓冲
	//将顶点坐标数据送入缓冲
	gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(this.vertices),gl.STATIC_DRAW);
    //创建顶点纹理坐标缓冲
	this.vertexTexCoorBuffer=gl.createBuffer();
	//将顶点纹理坐标数据送入缓冲
    gl.bindBuffer(gl.ARRAY_BUFFER,this.vertexTexCoorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(this.texcoor),gl.STATIC_DRAW);
	this.program=programIn;		//初始化着色器程序id
	//设置纹理
	gl.uniform1i(gl.getUniformLocation(this.program, "sTexture"), 0);
	this.drawSelf=function(ms,texture)//绘制物体的方法
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
		
		//启用纹理坐标数据
		gl.enableVertexAttribArray(gl.getAttribLocation(this.program, "aTexCoor")); 
		//将顶点纹理坐标数据送入渲染管线
	    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexTexCoorBuffer);
		gl.vertexAttribPointer(gl.getAttribLocation(this.program, "aTexCoor"), 2, gl.FLOAT, false, 0, 0);        
              
        //绑定纹理
        gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.drawArrays(gl.TRIANGLES, 0, this.vcount);		//用顶点法绘制物体
	}
}
