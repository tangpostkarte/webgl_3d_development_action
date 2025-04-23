function Belt(								//声明绘制用物体对象所属类
	gl,						 					//GL上下文
	programIn	//着色器程序id
	){
		this.vcount=22;//设置顶点数量
		var angdegBegin=0;//角度起始值
		var angdegEnd=90;//角度终止值
		var angdegSpan=(angdegEnd-angdegBegin)/3;//角度步长值
		var angdegBegin1=180;//第二段起始值
		var angdegEnd1=270;//第二段终止值
		var angdegSpan1=(angdegEnd1-angdegBegin1)/5;//第二段角度步长值
		
		var vertexarray=new Array();//声明顶点数组
		var colorarray=new Array();//声明颜色坐标数组
		var count=0;
		for(var i=angdegBegin;i<=angdegEnd;i+=angdegSpan){
			var angrad=i*Math.PI/180;//当前弧度
			//当前点
			vertexarray[count++]=-0.6*0.5*Math.sin(angrad);
			vertexarray[count++]=0.6*0.5*Math.cos(angrad);
			vertexarray[count++]=0;
			//当前点
			vertexarray[count++]=-0.5*Math.sin(angrad);
			vertexarray[count++]=0.5*Math.cos(angrad);
			vertexarray[count++]=0;
		}
		//重复第一条带的最后一个顶点
		vertexarray[count++]=vertexarray[count-4];
		vertexarray[count++]=vertexarray[count-4];
		vertexarray[count++]=0;
		for(var j=angdegBegin1;j<=angdegEnd1;j+=angdegSpan1){
			var angrad1=j*Math.PI/180;//当前弧度
			//重复第二条带的第一个顶点
			if(j==angdegBegin1){
				vertexarray[count++]=-0.6*0.5*Math.sin(angrad1);
				vertexarray[count++]=0.6*0.5*Math.cos(angrad1);
				vertexarray[count++]=0;
			}
			//大圆上的点
			vertexarray[count++]=-0.6*0.5*Math.sin(angrad1);
			vertexarray[count++]=0.6*0.5*Math.cos(angrad1);
			vertexarray[count++]=0;
			//当前点
			vertexarray[count++]=-0.5*Math.sin(angrad1);
			vertexarray[count++]=0.5*Math.cos(angrad1);
			vertexarray[count++]=0;
		}
	this.vertexData=vertexarray;
	this.vertexBuffer=gl.createBuffer();				//创建顶点坐标数据缓冲
	gl.bindBuffer(gl.ARRAY_BUFFER,this.vertexBuffer); 	//绑定顶点坐标数据缓冲
	//将顶点坐标数据送入缓冲
	gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(this.vertexData),gl.STATIC_DRAW);
	
	count = 0;
       for(var i=0; i<88; i+=8){
        	colorarray[count++] = 1; 
        	colorarray[count++] = 1; 
        	colorarray[count++] = 1; 
        	colorarray[count++] = 1.0;
        	
        	colorarray[count++] = 0; 
        	colorarray[count++] = 1; 
        	colorarray[count++] = 1; 
        	colorarray[count++] = 1.0;
        }
	this.colorsData=colorarray;
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
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.vcount);		//绘制条状物
	}
}
