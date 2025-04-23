function Cube(								//声明绘制用物体对象所属类
	gl,						 					//GL上下文
	programIn	//着色器程序id
	)
	{
	var UNIT_SIZE=0.3;
	this.vertexData=[
			//前面
        	0.0,0.0,UNIT_SIZE,
        	UNIT_SIZE,UNIT_SIZE,UNIT_SIZE,
        	-UNIT_SIZE,UNIT_SIZE,UNIT_SIZE,
        	0.0,0.0,UNIT_SIZE,
        	-UNIT_SIZE,UNIT_SIZE,UNIT_SIZE,
        	-UNIT_SIZE,-UNIT_SIZE,UNIT_SIZE,
        	0.0,0.0,UNIT_SIZE,
        	-UNIT_SIZE,-UNIT_SIZE,UNIT_SIZE,
        	UNIT_SIZE,-UNIT_SIZE,UNIT_SIZE,
        	0.0,0.0,UNIT_SIZE,
        	UNIT_SIZE,-UNIT_SIZE,UNIT_SIZE,
        	UNIT_SIZE,UNIT_SIZE,UNIT_SIZE,
        	//后面
        	0.0,0.0,-UNIT_SIZE,        	
        	UNIT_SIZE,UNIT_SIZE,-UNIT_SIZE,
        	UNIT_SIZE,-UNIT_SIZE,-UNIT_SIZE,
        	0.0,0.0,-UNIT_SIZE, 
        	UNIT_SIZE,-UNIT_SIZE,-UNIT_SIZE,
        	-UNIT_SIZE,-UNIT_SIZE,-UNIT_SIZE,
        	0.0,0.0,-UNIT_SIZE, 
        	-UNIT_SIZE,-UNIT_SIZE,-UNIT_SIZE,
        	-UNIT_SIZE,UNIT_SIZE,-UNIT_SIZE,
        	0.0,0.0,-UNIT_SIZE, 
        	-UNIT_SIZE,UNIT_SIZE,-UNIT_SIZE,
        	UNIT_SIZE,UNIT_SIZE,-UNIT_SIZE,
        	//左面
        	-UNIT_SIZE,0.0,0.0,      	
        	-UNIT_SIZE,UNIT_SIZE,UNIT_SIZE,
        	-UNIT_SIZE,UNIT_SIZE,-UNIT_SIZE,
        	-UNIT_SIZE,0.0,0.0,   
        	-UNIT_SIZE,UNIT_SIZE,-UNIT_SIZE,
        	-UNIT_SIZE,-UNIT_SIZE,-UNIT_SIZE,
        	-UNIT_SIZE,0.0,0.0,   
        	-UNIT_SIZE,-UNIT_SIZE,-UNIT_SIZE,
        	-UNIT_SIZE,-UNIT_SIZE,UNIT_SIZE,
        	-UNIT_SIZE,0.0,0.0,   
        	-UNIT_SIZE,-UNIT_SIZE,UNIT_SIZE,
        	-UNIT_SIZE,UNIT_SIZE,UNIT_SIZE,
        	//右面
        	UNIT_SIZE,0.0,0.0,   
        	UNIT_SIZE,UNIT_SIZE,UNIT_SIZE,
        	UNIT_SIZE,-UNIT_SIZE,UNIT_SIZE,
        	UNIT_SIZE,0.0,0.0,   
        	UNIT_SIZE,-UNIT_SIZE,UNIT_SIZE,
        	UNIT_SIZE,-UNIT_SIZE,-UNIT_SIZE,
        	UNIT_SIZE,0.0,0.0,   
        	UNIT_SIZE,-UNIT_SIZE,-UNIT_SIZE,
        	UNIT_SIZE,UNIT_SIZE,-UNIT_SIZE,
        	UNIT_SIZE,0.0,0.0,  
        	UNIT_SIZE,UNIT_SIZE,-UNIT_SIZE,
        	UNIT_SIZE,UNIT_SIZE,UNIT_SIZE,
        	//上面
        	0.0,UNIT_SIZE,0.0,      
        	UNIT_SIZE,UNIT_SIZE,UNIT_SIZE,
        	UNIT_SIZE,UNIT_SIZE,-UNIT_SIZE,
        	0.0,UNIT_SIZE,0.0,        	
        	UNIT_SIZE,UNIT_SIZE,-UNIT_SIZE,
        	-UNIT_SIZE,UNIT_SIZE,-UNIT_SIZE,
        	0.0,UNIT_SIZE,0.0,       
        	-UNIT_SIZE,UNIT_SIZE,-UNIT_SIZE,
        	-UNIT_SIZE,UNIT_SIZE,UNIT_SIZE, 	
        	0.0,UNIT_SIZE,0.0,      
        	-UNIT_SIZE,UNIT_SIZE,UNIT_SIZE,
        	UNIT_SIZE,UNIT_SIZE,UNIT_SIZE,  	
        	//下面
        	0.0,-UNIT_SIZE,0.0,        	
        	UNIT_SIZE,-UNIT_SIZE,UNIT_SIZE,
        	-UNIT_SIZE,-UNIT_SIZE,UNIT_SIZE,
        	0.0,-UNIT_SIZE,0.0,  
        	-UNIT_SIZE,-UNIT_SIZE,UNIT_SIZE,
        	-UNIT_SIZE,-UNIT_SIZE,-UNIT_SIZE,
        	0.0,-UNIT_SIZE,0.0,   
        	-UNIT_SIZE,-UNIT_SIZE,-UNIT_SIZE,
        	UNIT_SIZE,-UNIT_SIZE,-UNIT_SIZE,
        	0.0,-UNIT_SIZE,0.0,    
        	UNIT_SIZE,-UNIT_SIZE,-UNIT_SIZE,
        	UNIT_SIZE,-UNIT_SIZE,UNIT_SIZE
	];
	this.vcount=this.vertexData.length/3;					//得到顶点数量
	this.vertexBuffer=gl.createBuffer();				//创建顶点坐标数据缓冲
	gl.bindBuffer(gl.ARRAY_BUFFER,this.vertexBuffer); 	//绑定顶点坐标数据缓冲
	//将顶点坐标数据送入缓冲
	gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(this.vertexData),gl.STATIC_DRAW);
	
	this.colorsData=[
				//前面        
        		1.0,1.0,1.0,1.0,//中间为白色
        		1.0,0.0,0.0,1.0,
        		1.0,0.0,0.0,1.0,
        		1.0,1.0,1.0,1.0,//中间为白色
        		1.0,0.0,0.0,1.0,
        		1.0,0.0,0.0,1.0,
        		1.0,1.0,1.0,1.0,//中间为白色
        		1.0,0.0,0.0,1.0,
        		1.0,0.0,0.0,1.0,
        		1.0,1.0,1.0,1.0,//中间为白色
        		1.0,0.0,0.0,1.0,
        		1.0,0.0,0.0,1.0,
        		//后面
        		1.0,1.0,1.0,1.0,//中间为白色
        		0.0,0.0,1.0,1.0,
        		0.0,0.0,1.0,1.0, 
        		1.0,1.0,1.0,1.0,//中间为白色
        		0.0,0.0,1.0,1.0,
        		0.0,0.0,1.0,1.0, 
        		1.0,1.0,1.0,1.0,//中间为白色
        		0.0,0.0,1.0,1.0,
        		0.0,0.0,1.0,1.0, 
        		1.0,1.0,1.0,1.0,//中间为白色
        		0.0,0.0,1.0,1.0,
        		0.0,0.0,1.0,1.0, 
        		//左面
        		1.0,1.0,1.0,1.0,//中间为白色
        		1.0,0.0,1.0,1.0,
        		1.0,0.0,1.0,1.0, 
        		1.0,1.0,1.0,1.0,//中间为白色
        		1.0,0.0,1.0,1.0,
        		1.0,0.0,1.0,1.0, 
        		1.0,1.0,1.0,1.0,//中间为白色
        		1.0,0.0,1.0,1.0,
        		1.0,0.0,1.0,1.0, 
        		1.0,1.0,1.0,1.0,//中间为白色
        		1.0,0.0,1.0,1.0,
        		1.0,0.0,1.0,1.0, 
        		//右面
        		1.0,1.0,1.0,1.0,//中间为白色
        		1.0,1.0,0.0,1.0,
        		1.0,1.0,0.0,1.0,
        		1.0,1.0,1.0,1.0,//中间为白色
        		1.0,1.0,0.0,1.0,
        		1.0,1.0,0.0,1.0,
        		1.0,1.0,1.0,1.0,//中间为白色
        		1.0,1.0,0.0,1.0,
        		1.0,1.0,0.0,1.0,
        		1.0,1.0,1.0,1.0,//中间为白色
        		1.0,1.0,0.0,1.0,
        		1.0,1.0,0.0,1.0,
        		//上面
        		1.0,1.0,1.0,1.0,//中间为白色
        		0.0,1.0,0.0,1.0,
        		0.0,1.0,0.0,1.0,
        		1.0,1.0,1.0,1.0,//中间为白色
        		0.0,1.0,0.0,1.0,
        		0.0,1.0,0.0,1.0,
        		1.0,1.0,1.0,1.0,//中间为白色
        		0.0,1.0,0.0,1.0,
        		0.0,1.0,0.0,1.0,
        		1.0,1.0,1.0,1.0,//中间为白色
        		0.0,1.0,0.0,1.0,
        		0.0,1.0,0.0,1.0,        		
        		//下面
        		1.0,1.0,1.0,1.0,//中间为白色
        		0.0,1.0,1.0,1.0,
        		0.0,1.0,1.0,1.0,
        		1.0,1.0,1.0,1.0,//中间为白色
        		0.0,1.0,1.0,1.0,
        		0.0,1.0,1.0,1.0,
        		1.0,1.0,1.0,1.0,//中间为白色
        		0.0,1.0,1.0,1.0,
        		0.0,1.0,1.0,1.0,
        		1.0,1.0,1.0,1.0,//中间为白色
        		0.0,1.0,1.0,1.0,
        		0.0,1.0,1.0,1.0
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
		gl.vertexAttribPointer(gl.getAttribLocation(this.program,"aPosition"),3,gl.FLOAT,false,0,0);
		
		gl.enableVertexAttribArray(gl.getAttribLocation(this.program, "aColor"));//启用顶点坐标数据数组
		gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);	//绑定顶点坐标数据缓冲
		//给管线指定顶点坐标数据
		gl.vertexAttribPointer(gl.getAttribLocation(this.program,"aColor"),4,gl.FLOAT,false,0,0);
		
		gl.drawArrays(gl.TRIANGLES,0, this.vcount);		//用顶点法绘制物体
	}
}
