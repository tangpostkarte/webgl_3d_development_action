function Momnet(								//声明绘制用物体对象所属类
	gl,						 					//GL上下文
	programIn									//着色器程序id
	){
	var vertices=new Array();					//顶点数组
    var vnormals=new Array();					//顶点法向量数组
	var vcolors=new Array();					//顶点颜色数组

    //初始化顶点坐标和顶点法向量
	this.initVertexAndVectorData=function(){
	var count=0;var count2=0;
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

                vnormals[count2++]=-normals[j][i][0];
                vnormals[count2++]=-normals[j][i][1];
                vnormals[count2++]=-normals[j][i][2];

        		vertices[count++]=zsx;
        		vertices[count++]=result[j+1][i];
        		vertices[count++]=zsz+1;

                vnormals[count2++]=-normals[j+1][i][0];
                vnormals[count2++]=-normals[j+1][i][1];
                vnormals[count2++]=-normals[j+1][i][2];

        		vertices[count++]=zsx+1;
        		vertices[count++]=result[j][i+1];
        		vertices[count++]=zsz;

                vnormals[count2++]=-normals[j][i+1][0];
                vnormals[count2++]=-normals[j][i+1][1];
                vnormals[count2++]=-normals[j][i+1][2];
        		
        		vertices[count++]=zsx+1;
        		vertices[count++]=result[j][i+1];
        		vertices[count++]=zsz;

                vnormals[count2++]=-normals[j][i+1][0];
                vnormals[count2++]=-normals[j][i+1][1];
                vnormals[count2++]=-normals[j][i+1][2];

        		vertices[count++]=zsx;
        		vertices[count++]=result[j+1][i];
        		vertices[count++]=zsz+1;

                vnormals[count2++]=-normals[j+1][i][0];
                vnormals[count2++]=-normals[j+1][i][1];
                vnormals[count2++]=-normals[j+1][i][2];

        		vertices[count++]=zsx+1;
        		vertices[count++]=result[j+1][i+1];
        		vertices[count++]=zsz+1;

                vnormals[count2++]=-normals[j+1][i+1][0];
                vnormals[count2++]=-normals[j+1][i+1][1];
                vnormals[count2++]=-normals[j+1][i+1][2];
        	}
        }
	};
	this.initVertexAndVectorData();

	this.vcount=vertices.length/3;
	this.vertexBuffer=gl.createBuffer();				//创建顶点坐标数据缓冲
	gl.bindBuffer(gl.ARRAY_BUFFER,this.vertexBuffer); 	//绑定顶点坐标数据缓冲
	//将顶点坐标数据送入缓冲
	gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(vertices),gl.STATIC_DRAW);

	this.normalData=vnormals;
	this.normalBuffer=gl.createBuffer();                //创建顶点法向量数据缓冲
	gl.bindBuffer(gl.ARRAY_BUFFER,this.normalBuffer);   //绑定顶点法向量数据缓冲
	//将法向量坐标数据送入缓冲
	gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(this.normalData),gl.STATIC_DRAW);

    //初始化顶点纹理坐标
	this.ColorsD=function(){
    	var sizew=1/rowsPlusOne;//列数
    	var sizeh=1/colsPlusOne;//行数
    	var c=0;
    	for(var i=0;i<colsPlusOne-1;i++){
    		for(var j=0;j<rowsPlusOne-1;j++){
    			//每行列一个矩形，由两个三角形构成，共六个点，12个纹理坐标
    			var s=j*sizew;
    			var t=i*sizeh;
                vcolors[c++]=s;
                vcolors[c++]=t;
                vcolors[c++]=s;
                vcolors[c++]=t+sizeh;
                vcolors[c++]=s+sizew;
                vcolors[c++]=t;
                vcolors[c++]=s+sizew;
                vcolors[c++]=t;
                vcolors[c++]=s;
                vcolors[c++]=t+sizeh;
                vcolors[c++]=s+sizew;
                vcolors[c++]=t+sizeh;
    	}}
	}
	this.ColorsD();

	this.colorsData=vcolors;					        //初始化顶点纹理坐标数据
	this.colorBuffer=gl.createBuffer();                 //绑定顶点纹理坐标数据缓冲
	gl.bindBuffer(gl.ARRAY_BUFFER,this.colorBuffer);    //绑定颜色数据缓冲
	//将颜色数据送入缓冲
	gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(this.colorsData),gl.STATIC_DRAW);

    //初始化着色器程序id
	this.program=programIn;

    //绘制物体的方法
	this.drawSelf=function(ms,texture) {
        //指定使用某套着色器程序
		gl.useProgram(this.program);

		//获取总变换矩阵引用id
		var uMVPMatrixHandle=gl.getUniformLocation(this.program, "uMVPMatrix");
		//将总变换矩阵送入渲染管线
		gl.uniformMatrix4fv(uMVPMatrixHandle,false,new Float32Array(ms.getFinalMatrix()));

        //获取变换矩阵引用id
        var uMMatrixHandle=gl.getUniformLocation(this.program, "uMMatrix");
        //将变换矩阵送入渲染管线
        gl.uniformMatrix4fv(uMMatrixHandle,false,new Float32Array(ms.currMatrix));

        //获取光源位置引用id
        var uLightLocationHandle=gl.getUniformLocation(this.program, "uLightLocationSun");
        //将光源位置送入渲染管线
        gl.uniform3fv(uLightLocationHandle,new Float32Array([sunx,6000,sunz]));

        //获取摄像机位置引用id
        var uCameraHandle=gl.getUniformLocation(this.program, "uCamera");
        //将摄像机位置送入渲染管线
        gl.uniform3fv(uCameraHandle,new Float32Array([ms.cx,ms.cy,ms.cz]));

		//启用顶点法向量数据数组
        gl.enableVertexAttribArray(gl.getAttribLocation(this.program, "aNormal"));
        //绑定顶点法向量数据缓冲
        gl.bindBuffer(gl.ARRAY_BUFFER,this.normalBuffer);
        //给管线指定顶点法向量数据
        gl.vertexAttribPointer(gl.getAttribLocation(this.program, "aNormal"), 3, gl.FLOAT, false, 0, 0);

        //启用顶点坐标数据数组
        gl.enableVertexAttribArray(gl.getAttribLocation(this.program, "aPosition"));
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
		gl.bindTexture(gl.TEXTURE_2D, texture[0]);//绑定基础颜色纹理
		gl.activeTexture(gl.TEXTURE1);//设置使用的纹理编号-1
		gl.bindTexture(gl.TEXTURE_2D, texture[1]);//绑定过程纹理
        gl.activeTexture(gl.TEXTURE2);//设置使用的纹理编号-2
        gl.bindTexture(gl.TEXTURE_2D, texture[2]);//绑定细节纹理1
        gl.activeTexture(gl.TEXTURE3);//设置使用的纹理编号-3
        gl.bindTexture(gl.TEXTURE_2D, texture[3]);//绑定细节纹理2
        gl.activeTexture(gl.TEXTURE4);//设置使用的纹理编号-4
        gl.bindTexture(gl.TEXTURE_2D, texture[4]);//绑定细节纹理3
        gl.activeTexture(gl.TEXTURE5);//设置使用的纹理编号-5
        gl.bindTexture(gl.TEXTURE_2D, texture[5]);//绑定细节纹理4
		
		//将纹理送入渲染管线
		gl.uniform1i(gl.getUniformLocation(this.program, "texC"), 0);
		gl.uniform1i(gl.getUniformLocation(this.program, "texD"), 1);
        gl.uniform1i(gl.getUniformLocation(this.program, "texD1"), 2);
        gl.uniform1i(gl.getUniformLocation(this.program, "texD2"), 3);
        gl.uniform1i(gl.getUniformLocation(this.program, "texD3"), 4);
        gl.uniform1i(gl.getUniformLocation(this.program, "texD4"), 5);
        //用顶点法绘制物体
		gl.drawArrays(gl.TRIANGLES, 0, this.vcount);
	}
}
