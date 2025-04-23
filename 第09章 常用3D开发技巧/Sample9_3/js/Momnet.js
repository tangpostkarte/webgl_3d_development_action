function Momnet(								//声明绘制用物体对象所属类
	gl,						 					//GL上下文
	programIn	//着色器程序id
	){
	var vertices=new Array();
	this.initVertexData=function(){
	var count=0;
	for(var j=0;j<rowsPlusOne-1;j++)
        {
        	for(var i=0;i<colsPlusOne-1;i++) 
        	{        		
        		//计算当前格子左上侧点坐标 
        		var zsx=-1*colsPlusOne/2+i*1;
        		var zsz=-1*rowsPlusOne/2+j*1;

        		vertices[count++]=zsx;
        		vertices[count++]=result[j][i];
        		vertices[count++]=zsz;
				
        		vertices[count++]=zsx;
        		vertices[count++]=result[j+1][i];
        		vertices[count++]=zsz+1;
        		
        		vertices[count++]=zsx+1;
        		vertices[count++]=result[j][i+1];
        		vertices[count++]=zsz;
        		
        		vertices[count++]=zsx+1;
        		vertices[count++]=result[j][i+1];
        		vertices[count++]=zsz;
        		
        		vertices[count++]=zsx;
        		vertices[count++]=result[j+1][i];
        		vertices[count++]=zsz+1;
        		
        		vertices[count++]=zsx+1;
        		vertices[count++]=result[j+1][i+1];
        		vertices[count++]=zsz+1;
        	}
        }
	};
	this.initVertexData();
	this.vcount=vertices.length/3;
	this.vertexBuffer=gl.createBuffer();				//创建顶点坐标数据缓冲
	gl.bindBuffer(gl.ARRAY_BUFFER,this.vertexBuffer); 	//绑定顶点坐标数据缓冲
	//将顶点坐标数据送入缓冲
	gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(vertices),gl.STATIC_DRAW);
	
	this.normalData=vertices;
	this.normalBuffer=gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER,this.normalBuffer);
	//将法向量坐标数据送入缓冲
	gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(this.normalData),gl.STATIC_DRAW);
	
	this.result=new Array(); 
	this.ColorsD=function(){
    	
    	var sizew=16/rowsPlusOne;//列数
    	var sizeh=16/colsPlusOne;//行数
    	var c=0;
    	for(var i=0;i<colsPlusOne-1;i++){
    		for(var j=0;j<rowsPlusOne-1;j++){
    			//每行列一个矩形，由两个三角形构成，共六个点，12个纹理坐标
    			var s=j*sizew;
    			var t=i*sizeh;
    			this.result[c++]=s;
    			this.result[c++]=t;
    			this.result[c++]=s;
    			this.result[c++]=t+sizeh;
    			this.result[c++]=s+sizew;
    			this.result[c++]=t;    			
    			this.result[c++]=s+sizew;
    			this.result[c++]=t;
    			this.result[c++]=s;
    			this.result[c++]=t+sizeh;
    			this.result[c++]=s+sizew;
    			this.result[c++]=t+sizeh;    			
    	}}
	}
	this.ColorsD();	
	this.colorsData=this.result;					//初始化顶点颜色数据	
	
	this.colorBuffer=gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER,this.colorBuffer); 	//绑定颜色数据缓冲
	//将颜色数据送入缓冲
	gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(this.colorsData),gl.STATIC_DRAW);
	
	this.program=programIn;		//初始化着色器程序id
	this.drawSelf=function(ms,texture0,texture1)//绘制物体的方法
	{	
		gl.useProgram(this.program);//指定使用某套着色器程序
		//执行平移
		ms.translate(0,0,0);
		//获取总变换矩阵引用id
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
		gl.bindTexture(gl.TEXTURE_2D, texture0);//绑定白天纹理
		gl.activeTexture(gl.TEXTURE1);//设置使用的纹理编号-1
		gl.bindTexture(gl.TEXTURE_2D, texture1);//绑定黑夜纹理
		
		
		gl.uniform1f(gl.getUniformLocation(this.program, "landStartY"), 0);
		gl.uniform1f(gl.getUniformLocation(this.program, "landYSpan"), 20);
		
		//设置纹理
		gl.uniform1i(gl.getUniformLocation(this.program, "sTextureGrass"), 0);//将纹理送入渲染管线 
		gl.uniform1i(gl.getUniformLocation(this.program, "sTextureRock"), 1);	 //将纹理送入渲染管线		  
		
	
		gl.drawArrays(gl.TRIANGLES, 0, this.vcount);		//用顶点法绘制物体
	}
}
