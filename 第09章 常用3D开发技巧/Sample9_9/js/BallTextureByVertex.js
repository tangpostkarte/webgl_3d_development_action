function BallTextureByVertex(								//声明绘制用物体对象所属类
	gl,						 					//GL上下文
	programIn	//着色器程序id
	){
	var vertices=new Array();//顶点坐标数组
	var texcoor=new Array();//纹理坐标数组
	var texCoorArray=generateTexCoor(360/11.25,180/11.25);//获取切分整图的纹理数组
	var tc=0,ts=texCoorArray.length,i=0,j=0;//纹理数组计数器和纹理数组长度
	for(var vAngle=90;vAngle>-90;vAngle=vAngle-11.25)//垂直方向angleSpan度一份
        {
        	for(var hAngle=360;hAngle>0;hAngle=hAngle-11.25)//水平方向angleSpan度一份
        	{
        		//纵向横向各到一个角度后计算对应的此点在球面上的四边形顶点坐标
        		//并构建两个组成四边形的三角形
        		
        		var xozLength=1.0*0.8*Math.cos(Math.PI*vAngle/180);
        		var x1=xozLength*Math.cos(Math.PI*hAngle/180);
        		var z1=xozLength*Math.sin(Math.PI*hAngle/180);
        		var y1=1.0*0.8*Math.sin(Math.PI*vAngle/180);
        		
        		xozLength=1.0*0.8*Math.cos(Math.PI*(vAngle-11.25)/180);//
        		var x2=xozLength*Math.cos(Math.PI*hAngle/180);
        		var z2=xozLength*Math.sin(Math.PI*hAngle/180);
        		var y2=1.0*0.8*Math.sin(Math.PI*(vAngle-11.25)/180);
        		
        		xozLength=1.0*0.8*Math.cos(Math.PI*(vAngle-11.25)/180);
        		var x3=xozLength*Math.cos(Math.PI*(hAngle-11.25)/180);
        		var z3=xozLength*Math.sin(Math.PI*(hAngle-11.25)/180);
        		var y3=1.0*0.8*Math.sin(Math.PI*(vAngle-11.25)/180);
        		
        		xozLength=1.0*0.8*Math.cos(Math.PI*vAngle/180);
        		var x4=xozLength*Math.cos(Math.PI*(hAngle-11.25)/180);
        		var z4=xozLength*Math.sin(Math.PI*(hAngle-11.25)/180);
        		var y4=1.0*0.8*Math.sin(Math.PI*vAngle/180);   
        		//构建第一个三角形
				vertices[i*18]=x1;vertices[i*18+1]=y1;vertices[i*18+2]=z1;
				vertices[i*18+3]=x2;vertices[i*18+4]=y2;vertices[i*18+5]=z2;
				vertices[i*18+6]=x4;vertices[i*18+7]=y4;vertices[i*18+8]=z4;       		
        		//构建第二三角形
				vertices[i*18+9]=x4;vertices[i*18+10]=y4;vertices[i*18+11]=z4;
				vertices[i*18+12]=x2;vertices[i*18+13]=y2;vertices[i*18+14]=z2;
				vertices[i*18+15]=x3;vertices[i*18+16]=y3;vertices[i*18+17]=z3;
        		//第一三角形3个顶点的6个纹理坐标
				texcoor[j*12]=texCoorArray[tc++%ts];
				texcoor[j*12+1]=texCoorArray[tc++%ts];
				texcoor[j*12+2]=texCoorArray[tc++%ts];
				texcoor[j*12+3]=texCoorArray[tc++%ts];
				texcoor[j*12+4]=texCoorArray[tc++%ts];
				texcoor[j*12+5]=texCoorArray[tc++%ts];
        		//第二三角形3个顶点的6个纹理坐标
				texcoor[j*12+6]=texCoorArray[tc++%ts];
				texcoor[j*12+7]=texCoorArray[tc++%ts];
				texcoor[j*12+8]=texCoorArray[tc++%ts];
				texcoor[j*12+9]=texCoorArray[tc++%ts];
				texcoor[j*12+10]=texCoorArray[tc++%ts];
				texcoor[j*12+11]=texCoorArray[tc++%ts];    		
        	}
        }
	this.vcount=vertices.length/3;					//得到顶点数量
	this.vertice=vertices;
	this.texcoors=texcoor;
	this.vertexBuffer=gl.createBuffer();				//创建顶点坐标数据缓冲
	gl.bindBuffer(gl.ARRAY_BUFFER,this.vertexBuffer); 	//绑定顶点坐标数据缓冲
	//将顶点坐标数据送入缓冲
	gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(this.vertice),gl.STATIC_DRAW);
    //创建顶点纹理坐标缓冲
	this.vertexTexCoorBuffer=gl.createBuffer();
	//将顶点纹理坐标数据送入缓冲
    gl.bindBuffer(gl.ARRAY_BUFFER,this.vertexTexCoorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(this.texcoors),gl.STATIC_DRAW);
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
	//this.generateTexCoor=function(bw,bh)
	function generateTexCoor(bw,bh)
	{
		var result=new Array(bw*bh*6*2);
		var sizew=1.0/bw,sizeh=1.0/bh,c=0;
		for(var i=0;i<bh;i++)
    	{
    		for(var j=0;j<bw;j++)
    		{
    			//每行列一个矩形，由两个三角形构成，共六个点，12个纹理坐标
    			var s=j*sizew,t=i*sizeh;
    			
    			result[c++]=s;
    			result[c++]=t;
    			
    			result[c++]=s;
    			result[c++]=t+sizeh;
    			
    			result[c++]=s+sizew;
    			result[c++]=t;
    			
    			
    			result[c++]=s+sizew;
    			result[c++]=t;
    			
    			result[c++]=s;
    			result[c++]=t+sizeh;
    			
    			result[c++]=s+sizew;
    			result[c++]=t+sizeh;    			
    		}
    	}
		return result;
	}
}
