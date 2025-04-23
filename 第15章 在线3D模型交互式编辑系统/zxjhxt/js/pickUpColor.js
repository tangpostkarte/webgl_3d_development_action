	function onDocumentMouseDown(event){
		if(isPickColor){
			//进行坐标系的转化，x、y的取值范围在0~1之间
			mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
			mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;
			raycaster.setFromCamera( mouse, camera );//将转换后的鼠标点和摄像机传进raycaster中
			var intersects = raycaster.intersectObject( loadMesh,true);//使用raycaster进行投射，观察其是否与指定的3D物体相交
			if ( intersects.length > 0 ) {//如果判断鼠标投射到了物体上
				//alert(intersects[0].uv.x+","+intersects[0].uv.y);
				getColorOfImage(intersects[0].uv.x,intersects[0].uv.y,parentName+mtlManage.getTextureName());//获得点击点的颜色值
			}
		}
	}
	
	function getColorOfImage(u,v,imagePath){//传入UV坐标和纹理图的路径
		var colorResult = "";
		var canvas = document.getElementById("myCanvas");//根据id找到对应的canvas标签
		if(canvas.getContext){ //获取画布对象的上下文
			//获取对应的CanvasRenderingContext2D对象(画笔)
			var ctx = canvas.getContext("2d");
			var imgdata = ctx.getImageData(Math.floor(img.width * u),Math.floor(img.height *(1-v)),1,1);
			var R = convert(imgdata.data[0]);//将R通道颜色值转换成16进制
			var G = convert(imgdata.data[1]);//将G通道颜色值转换成16进制
			var B = convert(imgdata.data[2]);//将B通道颜色值转换成16进制
			colorResult = "#"+R+G+B;//综合三个通道，得出最后的颜色值
			//打印出对应点的采样结果
			alert("您选取的点颜色值为："+colorResult);
			//alert(+R+","+G+","+B);
			};
	}
	
	function initCanvas(){
		var canvas = document.getElementById("myCanvas");
		if(canvas.getContext){ //获取画布对象的上下文
			var ctx = canvas.getContext("2d");
			//创建新的图片对象
			img = new Image();
			//指定纹理图片的URL
			img.src = parentName + mtlManage.getTextureName();
			img.onload = function(){
				canvas.width = img.width;//图片的宽度赋值给canvas
				canvas.height = img.height;//图片的高度赋值给canvas

				ctx.drawImage(img, 0, 0, img.width,img.height);//保持纹理图的大小不变 并绘制在canvas中
			};
		}
	}
	function convert(num){
		if(num<16){
			num=num.toString(16);
			num="0"+num;
		}else{
			num=num.toString(16);
		}
		return num;
	}