function SixPointedStar(								//声明绘制用物体对象所属类
	gl,						 					//GL上下文
	programIn,	//着色器程序id
	z
	){
	var vertexarray=new Array();
	var colorarray=new Array();
	var angle=0,i=0;
	for(angle;angle<360;angle=angle+60)
	{
		vertexarray[i*18]=0;//1   1.5 第一个三角形，第一个中点
		vertexarray[i*18+1]=0;
		vertexarray[i*18+2]=z;
		//第二个点
		vertexarray[i*18+3]=0.4*Math.cos(angle*Math.PI/180);
		vertexarray[i*18+4]=0.4*Math.sin(angle*Math.PI/180);
		vertexarray[i*18+5]=z;
		//第三个点
		vertexarray[i*18+6]=1.0*Math.cos((angle+30)*Math.PI/180);
		vertexarray[i*18+7]=1.0*Math.sin((angle+30)*Math.PI/180);
		vertexarray[i*18+8]=z;
		//第二个三角形，第一个中点
		vertexarray[i*18+9]=0;
		vertexarray[i*18+10]=0;
		vertexarray[i*18+11]=z;
		//第二个点
		vertexarray[i*18+12]=1.0*Math.cos((angle+30)*Math.PI/180);
		vertexarray[i*18+13]=1.0*Math.sin((angle+30)*Math.PI/180);
		vertexarray[i*18+14]=z;
		//第三个点
		vertexarray[i*18+15]=0.4*Math.cos((angle+60)*Math.PI/180);
		vertexarray[i*18+16]=0.4*Math.sin((angle+60)*Math.PI/180);
		vertexarray[i*18+17]=z;
		i++;
	}
	this.vertexData=vertexarray; 
	this.vcount=this.vertexData.length/3;					//得到顶点数量
	this.vertexBuffer=gl.createBuffer();				//创建顶点坐标数据缓冲
	gl.bindBuffer(gl.ARRAY_BUFFER,this.vertexBuffer); 	//绑定顶点坐标数据缓冲
	//将顶点坐标数据送入缓冲
	gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(this.vertexData),gl.STATIC_DRAW);
	
	for(i=0;i<vertexarray.length;i++)
	{
		if(i%3==0)//中心点为白色
		{
			colorarray[i*4]=1;
			colorarray[i*4+1]=1;
			colorarray[i*4+2]=1;
			colorarray[i*4+3]=1;
		}else{//边上的点为蓝色
			colorarray[i*4]=0.45;
			colorarray[i*4+1]=0.75;
			colorarray[i*4+2]=0.75;
			colorarray[i*4+3]=1;
		}
		
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
		
		gl.drawArrays(gl.TRIANGLES, 0, this.vcount);		//用顶点法绘制物体
	}
}
