		function addCubeControl()//添加球形轨迹控制器的方法
		{
			var hasload=0;
			var cubeGeo = new THREE.CubeGeometry(1,1,1);//新建正方体的方法
			var textLoader = new THREE.TextureLoader();//新建纹理贴图的加载器
			
			var textureArray=[
				new THREE.MeshBasicMaterial({map: (new THREE.TextureLoader).load("xitongtu/0.jpg")}),
				new THREE.MeshBasicMaterial({map: (new THREE.TextureLoader).load("xitongtu/1.jpg")}),
				new THREE.MeshBasicMaterial({map: (new THREE.TextureLoader).load("xitongtu/2.jpg")}),
				new THREE.MeshBasicMaterial({map: (new THREE.TextureLoader).load("xitongtu/3.jpg")}),
				new THREE.MeshBasicMaterial({map: (new THREE.TextureLoader).load("xitongtu/4.jpg")}),	
				new THREE.MeshBasicMaterial({map: (new THREE.TextureLoader).load("xitongtu/5.jpg")})
			];//存放纹理贴图的数组
			
			
			var cubeMaterial = new THREE.MeshFaceMaterial(textureArray);//新建材质
			cube = new THREE.Mesh(cubeGeo, cubeMaterial);//生成正方体网格对象
			cubeScene.add(cube);//将此网格对象添加到场景中
			
			//console.log(textureArray);
			renderer.domElement.addEventListener( 'mousedown', onSphereMouseDown, false );//添加鼠标按下的监听
			renderer.domElement.addEventListener( 'mousemove', onSphereMousemove, false );
			//添加鼠标移动的监听
			renderer.domElement.addEventListener( 'mouseup', onSphereMouseup , false);
			//添加鼠标抬起的监听
			
			renderer.domElement.addEventListener( 'mousewheel', onMouseWheel , false);
			renderer.domElement.addEventListener( 'MozMousePixelScroll', onMouseWheel , false);
		}
		function onSphereMouseDown(event){
			
			var Xmax = renderer.domElement.clientWidth, Xmin = Xmax-100;//确定正方体所在屏幕的区域
			var Ymax = 100, Ymin = Ymax-100;
			
			mouse.x = ( (event.clientX-Xmin) / 100 ) * 2 - 1;//将鼠标按下的X坐标进行转换
			mouse.y = - ( (event.clientY-Ymin) / 100 ) * 2 + 1;//将鼠标按下的Y坐标进行转换

			raycaster.setFromCamera( mouse, ortCamera );//将转换后的鼠标点和摄像机传进raycaster中
			
			var intersects = raycaster.intersectObject( cube,true);//使用射线判断是否拾取到了正方体
			
			
			if ( intersects.length > 0 ) {		//如果判断鼠标投射到了正方体上

				pointdown.x = event.clientX;	//记录下当前鼠标点击到的X坐标
				pointdown.y = event.clientY;	//记录下当前鼠标点击到的Y坐标
				prePointX = event.clientX;		//prePointX用来记录上次鼠标所在的X坐标
				prePointY = event.clientY;		//prePointY用来记录上次鼠标所在的Y坐标

				isPointInCube = true;			//更改对应的标志位

			}
		}
		function onSphereMousemove(event){

			if(isPointInCube)
			{
				currentX = event.clientX;
				currentY = event.clientY;
				
				var pointYcha = currentY - prePointY;
				var pointXCha = currentX - prePointX;
				var MAX_YJ = Math.PI/2*180;
				var MIN_YJ = -Math.PI/2*180;
				
				yj +=pointYcha;
				
				
				degree = degree - pointXCha;
				if(degree>=360){
					degree=degree-360;
				}else if(degree<=0){
					degree=degree+360;
				}
				
				var cy = Math.sin(yj*Math.PI/180) * radius;			//旋转的半径
				var cxz = Math.cos(yj*Math.PI/180) * radius;			//旋转的半径
				var cx = Math.sin(degree*Math.PI/180)* cxz;
				var cz = Math.cos(degree*Math.PI/180)* cxz;
				
				
				//计算当前摄像机的UP向量
				var upY=Math.cos(yj*Math.PI/180);
				var upXZ=Math.sin(yj*Math.PI/180);
				var upX=-upXZ*Math.sin(degree*Math.PI/180);
				var upZ=-upXZ*Math.cos(degree*Math.PI/180);
				
				
				camera.up.x = upX;
				camera.up.y = upY;
				camera.up.z = upZ;
				
				
				ortCamera.position.x = cx;
				ortCamera.position.y = cy;
				ortCamera.position.z = cz;
				ortCamera.up.x = upX;
				ortCamera.up.y = upY;
				ortCamera.up.z = upZ;
				ortCamera.lookAt(cubeScene.position);
				
				ortCamera.updateProjectionMatrix();
				camera.position.copy(ortCamera.position);
				camera.lookAt(scene.position);//设置摄像机焦点
				
				camera.updateProjectionMatrix();

				
			}
		    prePointX  =  currentX;
			prePointY  =  currentY;
			
		}
		function onSphereMouseup(event)
		{	//鼠标抬起后触发的事件
			
			isPointInCube = false;
		}
		function onMouseWheel(event){
				event.preventDefault();
				event.stopPropagation();
			
				if ( event.wheelDelta !== undefined ) {

					// WebKit / Opera / Explorer 9

					delta = event.wheelDelta;

				} else if ( event.detail !== undefined ) {

					// Firefox

					delta = - event.detail;

				}
				//console.log(delta);
				if(delta>0){
			
					radius+=10;
			
				}else{
					radius-=10;
				}
				var cy = Math.sin(yj*Math.PI/180) * radius;			//旋转的半径
				var cxz = Math.cos(yj*Math.PI/180) * radius;			//旋转的半径
				var cx = Math.sin(degree*Math.PI/180)* cxz;
				var cz = Math.cos(degree*Math.PI/180)* cxz;
				
				camera.position.x = cx;
				camera.position.y = cy;
				camera.position.z = cz;
			
		}