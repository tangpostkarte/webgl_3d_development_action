function Sky(								//声明绘制用物体对象所属类
	gl,						 					//GL上下文
	programIn,	//着色器程序id
	BallR
	){
	this.vertexData=new Array();
	var r=BallR;
	var angleSpan=5;//将求进行单位切分的角度
	var bw=360/angleSpan;
	var bh=90/angleSpan;
	this.initVertexData=function(){
		
		for(var vAngle = 90; vAngle >0; vAngle = vAngle - angleSpan)
		{
			for (var hAngle =360; hAngle>0; hAngle = hAngle - angleSpan)// 水平方向angleSpan度一份
				{// 纵向横向各到一个角度后计算对应的此点在球面上的坐标
					var x0 = r * Math.cos(vAngle*Math.PI/180) * Math.cos(hAngle*Math.PI/180);
					var y0 = r * Math.cos(vAngle*Math.PI/180) * Math.sin(hAngle*Math.PI/180);
					var z0 = r * Math.sin(vAngle*Math.PI/180);

					var x1 = r * Math.cos(vAngle*Math.PI/180) * Math.cos((hAngle-angleSpan)*Math.PI/180);
					var y1 = r * Math.cos(vAngle*Math.PI/180) * Math.sin((hAngle-angleSpan)*Math.PI/180);
					var z1 = r * Math.sin(vAngle*Math.PI/180);

					var x2 = r * Math.cos((vAngle-angleSpan)*Math.PI/180) * Math.cos((hAngle-angleSpan)*Math.PI/180);
					var y2 = r * Math.cos((vAngle-angleSpan)*Math.PI/180) * Math.sin((hAngle-angleSpan)*Math.PI/180);
					var z2 = r * Math.sin((vAngle - angleSpan)*Math.PI/180);

					var x3 = r * Math.cos((vAngle-angleSpan)*Math.PI/180) * Math.cos(hAngle*Math.PI/180);
					var y3 = r * Math.cos((vAngle-angleSpan)*Math.PI/180) * Math.sin(hAngle*Math.PI/180);
					var z3 = r * Math.sin((vAngle - angleSpan)*Math.PI/180);
					
					this.vertexData.push(x0,y0,z0);
					this.vertexData.push(x3,y3,z3);
					this.vertexData.push(x1,y1,z1);
					
					this.vertexData.push(x1,y1,z1);
					this.vertexData.push(x3,y3,z3);
					this.vertexData.push(x2,y2,z2);
				}
		}
	};
	this.initVertexData();
	this.vcount=this.vertexData.length/3;
	this.vertexBuffer=gl.createBuffer();				//创建顶点坐标数据缓冲
	gl.bindBuffer(gl.ARRAY_BUFFER,this.vertexBuffer); 	//绑定顶点坐标数据缓冲
	//将顶点坐标数据送入缓冲
	gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(this.vertexData),gl.STATIC_DRAW);
	
	this.normalData=this.vertexData;
	this.normalBuffer=gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER,this.normalBuffer);
	//将法向量坐标数据送入缓冲
	gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(this.normalData),gl.STATIC_DRAW);
	
	this.result=new Array(); 
	this.ColorsD=function(){
    	
    	var sizew=1.0/bw;//列数
    	var sizeh=1.0/bh;//行数
    	var c=0;
    	for(var i=0;i<bh;i++){
    		for(var j=0;j<bw;j++){
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
