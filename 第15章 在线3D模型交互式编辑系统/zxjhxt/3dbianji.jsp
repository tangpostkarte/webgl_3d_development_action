<%@ page
 contentType="text/html;charset=gbk"
 import="com.bn.zxjhxt.DBUtil,java.util.*,java.io.*"
%>

<!DOCTYPE html>
<html lang="en">
	<head>
		<title>3Dmodel</title>
		<meta charset="GBK">
		<meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
		<link href="css/3dbianji.css" rel="stylesheet" type="text/css"/>
		<script src="js/pickUpColor.js"></script>
		<script src="js/download.js"></script>
		<script src="js/MtlManage.js"></script>
		<script src="js/SphereControl.js"></script>
		<script src="util/three.js"></script>
		<script src="util/MTLLoader.js"></script>
		<script src="util/OBJLoader.js"></script>
		<script src="util/TransformControls.js"></script>
		<script src="util/OBJExporter.js"></script>
		<script src="util/OrbitControls.js"></script>
		<script type="text/javascript" src="js/MatrixManage.js"></script>
		<script type="text/javascript" src="js/operateTable.js"></script>
		<script type="text/javascript" src="util/STLLoader.js"></script>
		<script type="text/javascript" src="util/STLExporter.js"></script>
	</head>
	
	<body>
		
		<%
		
			String local=(String)session.getAttribute("local");
			String upModelPage = local+"uploadModel.jsp";
		
			String needUpdate = (String)session.getAttribute("needUpdate");
			
			if(needUpdate!=null&&needUpdate.equals("true"))
			{
				session.setAttribute("needUpdate","false");
				
				%>
				<script>
					window.location.reload(true);
				</script>
				<%
				
			}
			String parentName = request.getParameter("parentPath");
			String modelName = request.getParameter("modelName");
			String mtlName = request.getParameter("mtlName");
			String mid=request.getParameter("mid");
			if(mtlName!=null&&modelName!=null&&parentName!=null)
			{
				session.setAttribute("sModelName",modelName);
				session.setAttribute("sMtlName",mtlName);
				session.setAttribute("sParentName",parentName);
				session.setAttribute("mid",mid);
			}
			modelName = (String)session.getAttribute("sModelName");
			mtlName = (String)session.getAttribute("sMtlName");
			parentName = (String)session.getAttribute("sParentName");
			mid = (String)session.getAttribute("mid");
			String fromPlace = request.getParameter("fromPlace");
			
			if(fromPlace!=null&&fromPlace.equals("pageSlef")){
				String cmd=request.getParameter("cmd");
				String getmid=request.getParameter("mid");
				System.out.println(cmd+"|"+getmid);
				if(cmd!=null&&cmd.length()!=0&&getmid!=null&&mid.length()!=0)
				{
					DBUtil.refreshActionsOfModel(Integer.parseInt(getmid),cmd);
				} 
			}
			if(mid!=null&&mid.length()!=0)
			{
				List<String[]> actionList=DBUtil.getActionsOfModel(Integer.parseInt(mid));
				StringBuilder sb=new StringBuilder();
				for(String[] sa:actionList)
				{
					for(String s:sa)
					{
						sb.append(s);
						sb.append("|");
					}	
					sb.append("<#>");	
				}
				out.println("<script language=\"JavaScript\">");
				out.println("var parentName = \""+parentName.toString()+"\";");
				out.println("var ss = \""+sb.toString()+"\";");
				out.println("</script>");

			} 
	
		%>
		<div style="display:none">
			<form action="tuya.jsp" method = "post">
				<input type="hidden" id="texturePath" name="texturePath">
				<input type="hidden" id="textureName" name="textureName">
				<input type="submit" id="textureSub" value="提交">
			</form>
		</div>
		<!--用来更新数据的表单-->
		<form action="3dbianji.jsp" id="mf">
			<input type="hidden" name="mid" id="mid">
			<input type="hidden" name="cmd" id="cmd">
			<input type="hidden" name="fromPlace" value="pageSlef">
		</form>
		<div style="width:180px; height:100px; overflow-y:auto;position:absolute;">
			<table id="operateTable"style="width:150px;cellspacing:0;" >
			<tr>
				<th>操作编号</th><th>操作列表</th>
			</tr>
			</table>
		</div>
		<canvas id="myCanvas"  style="display:none"></canvas>
		<div id = "3Dbianji"></div>
		<div id = "gongjulan">
			<div class = "toolbar">
			    <div class="toolTital">整体编辑栏</div>
				<button type="button" id = "transformBtn">平 移</button>
				<button type="button" id = "rotateBtn">旋 转</button>
				<button type="button" id = "scaleBtn">缩 放</button>
				<div><button type="button" id = "pouqieBtn">剖 切</button>
				剖切高度<input type="range" id="myRange" style="width:105px"  max="100" min="-100" />
				</div>
			</div>
			<div class = "toolbar">
			    <div class="toolTital">拾取模块</div>
				<button type="button" id = "dianxuanBtn">点 选</button>
				<button type="button" id = "yanseBtn">纹理色</button>
				<button type="button" id = "fanhuiBtn">返回上页</button>
				
			</div>
			<div class = "toolbar">
			    <div class="toolTital">外观编辑</div>
					<div style="display:none">
						<input type="color" id = "yanseban" defaultValue="#ffffff" />
					</div>
				<button type="button" id = "zhuoseBtn">着 色</button>
				<button type="button" id = "wenliBtn">纹 理</button>
				<button type="button" id = "xiankuangBtn">线框模式</button>
			</div>
			<div class = "toolbar">
			    <div class="toolTital">编辑模块</div>
				<button type="button" id = "chexiaoBtn">撤 销</button>
				<button type="button" id = "huifuBtn">恢 复</button>
				<button type="button" id = "baocunBtn">保 存</button>
			</div>
			
			<div class = "toolbar" >
			    <div class="toolTital">材质修改</div>
				镜面光强度<input type="text" class ="mtlInput" id="ksInput"/>
				透明度<input type="text" class ="mtlInput" id="trInput"/>
				高光区尺寸<input type="text" class ="mtlInput" id="nsInput"/><br/>
				
			</div>
			<div class = "toolbar">
			    <div class="toolTital">下载模块</div>
				<button type="button" id = "downModelBtn">模 型</button>
				<button type="button" id = "downMtlBtn">材 质</button>
				<button type="button" id = "downTuBtn">纹 理</button>
			</div>
		</div>
		<div style="display:none"><a id='tiaozhuan' href="<%=upModelPage%>">跳转</a></div>
		
		<script>
			//console.log(ss);
			var isXianKuang = false;
			var isPickColor = false;
			var matrixManage;//矩阵变换的管理者
			var mouse = new THREE.Vector2();
			var raycaster = new THREE.Raycaster();
			var exporter = new THREE.OBJExporter();
			var mtlname = '<%=mtlName%>';
			
			var container, stats;
			var camera,scene,renderer,control;
			var cubeScene = new THREE.Scene();
			var mouseX = 0, mouseY = 0;
			var windowHalfX = window.innerWidth / 2;
			var windowHalfY = window.innerHeight / 2;
			var mainDivWidth = 0.8;//3D模型编辑视口宽度占页面总宽度的比例
			var divWidth;//3D模型编辑视口的实际宽度
			var loadMesh;//加载完成后的mesh对象
			var localPlane;//剪裁平面
			var isEnablePQ = false;
			var mtlManage;//用来管理材质信息的对象
			var isPointInCube;
			var currentX,currentY;
			var pointdown = new THREE.Vector2();
			var ortRadius = 500;
			var radius = 500;
			var yj = 45;				//摄像机的仰角
			var degree = 45;			//摄像机的朝向角
			var ortCamera;
			var cube;
			var selectPoint =new THREE.Object3D();
			selectPoint.name = "sPoint";
			var selectPointRaycaster = new THREE.Raycaster();//用来拾取点的投射器
			var isPointSelectMode=false;//表示是否进行点选的标志位
			var img;//纹理图的引用
			var nest_index;//选中的点的索引
			var modelType;
			var lightSphere;
			init();
			animate();
			
			function init() {
			
				container = document.getElementById('3Dbianji');
				document.body.appendChild(container);
				divWidth = innerWidth* mainDivWidth;	//计算3D模型编辑视口的实际宽度
				//新建透视投影摄像机
				scene = new THREE.Scene();//新建场景对象
				camera = new THREE.PerspectiveCamera( 45, divWidth / window.innerHeight, 1, 2000 );
				ortCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, -200, 10000);
				var cy = Math.sin(yj*Math.PI/180) * radius;			//旋转的半径
				var cxz = Math.cos(yj*Math.PI/180) * radius;			//旋转的半径
				var cx = Math.sin(degree*Math.PI/180)* cxz;
				var cz = Math.cos(degree*Math.PI/180)* cxz;
				
				camera.position.x = cx;
				camera.position.y = cy;
				camera.position.z = cz;
				camera.lookAt(scene.position);
				
				ortCamera.position.x = cx;
				ortCamera.position.y = cy;
				ortCamera.position.z = cz;
				ortCamera.lookAt(scene.position);
				
				
				var axes = new THREE.AxisHelper(200);//新建坐标辅助对象
        		scene.add(axes);//将坐标辅助对象添加到场景中
				
				var ambient = new THREE.AmbientLight( 0xffffff,0.5 );//创建环境光
				scene.add( ambient );//在场景中添加环境光

				var light = new THREE.PointLight( 0xffffff, 5, 100 );
				//light.position.set( 50, 50, 50 );
				//scene.add(  );
				var geometry = new THREE.SphereGeometry( 3, 16, 16);
				var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
				
				lightSphere = new THREE.Mesh( geometry, material );
				lightSphere.add(light);
				lightSphere.position.set(50,50,50);
				lightSphere.distance = 10000;
				lightSphere.name = "lightSphere";
				lightSphere.decay = 0.001;
				
				var map = new THREE.TextureLoader().load( "xitongtu/sprite.png" );
                var material = new THREE.SpriteMaterial( { map: map, color: 0xffffff } );
                var sprite = new THREE.Sprite( material );
				sprite.scale.set(13,13,13);
				//sprite.frustumCulled = false;
                lightSphere.add( sprite );
				
				console.log(sprite);
				scene.add( lightSphere );
				
				
				
				//console.log(selectPoint);
				
				var onError = function ( xhr ) { };
				var modelNamejs = '<%=modelName%>';
				modelType=modelNamejs.split(".");
				//alert(modelType[1]);
				if(modelType[1]=='obj')
				{
					var mtlLoader = new THREE.MTLLoader();//新建材质的加载器
					mtlLoader.setPath( '<%=parentName%>' );
					mtlLoader.load( '<%=mtlName%>', function( materials ) {//读取材质文件
						materials.preload();
						mtlManage = new MtlManage(materials);
						mtlManage.getInformation();
						initCanvas();
						var objLoader = new THREE.OBJLoader();//新建obj文件的加载器
							objLoader.setPath('<%=parentName%>');
							objLoader.setMaterials( materials );//设置材质
							objLoader.load( '<%=modelName%>', function ( object ) {//读取obj文件
					
							matrixManage = new MatrixManage(object,ss);
							matrixManage.goCurrent();
							//创建模型操作控件
							control = new THREE.TransformControls( camera, renderer.domElement,	matrixManage);
							control.setSpace( "world" );//设置控件改变的是模型的坐标
							control.attach( object );	//将空间与3D模型进行绑定
							scene.add( control );		//将空间添加到场景中
						
							loadMesh = object;			//将模型赋值给全局变量，方便之后的操作
							scene.add( object );								//向场景中添加模型
							loadMesh.traverse( function ( child ) {				//遍历网格对象的子对象
							if ( child instanceof THREE.Mesh ) {			//如果子对象属于Mesh对象
							
								child.material.side = THREE.DoubleSide;			//关闭背面剪裁
								//child.material.wireframe = true;
							}
							pageOnLoad();
						});
						});
					});
				}else{
					//initCanvas();
					var mtlLoader = new THREE.MTLLoader();//新建材质的加载器
					mtlLoader.setPath( '<%=parentName%>' );
					mtlLoader.load( '<%=mtlName%>', function( materials ) {//读取材质文件
						materials.preload();
						mtlManage = new MtlManage(materials);
						mtlManage.getInformation();
						console.log(materials);
						//console.log(mtlManage.information);
						var loader = new THREE.STLLoader();
						loader.load( '<%=parentName%>' + '<%=modelName%>', function ( geometry ) {
							bufferGeo = new THREE.BufferGeometry().fromGeometry ( geometry );
							loadMesh = new THREE.Mesh( bufferGeo, mtlManage.getMtl() );
							matrixManage = new MatrixManage(loadMesh,ss);
							matrixManage.goCurrent();
							//loadMesh.scale.set(100,100,100);
							control = new THREE.TransformControls( camera, renderer.domElement,		matrixManage);
							control.setSpace( "world" );//设置控件改变的是模型的坐标
							control.attach( loadMesh );	//将空间与3D模型进行绑定
							scene.add( control );		//将空间添加到场景中
							scene.add( loadMesh );
							pageOnLoad();
						
						});
					});
				}
				
				
				
				
				renderer = new THREE.WebGLRenderer({antialias:true});//新建渲染器对象
				
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth * mainDivWidth, window.innerHeight );//设置渲染器的尺寸
				
				renderer.localClippingEnabled = true;//开启渲染器的剪裁（与模型剖分功能有关）
				renderer.autoClear = false;

				
				container.addEventListener( 'mousedown', onDocumentMouseDown, false );
				container.addEventListener( 'mousedown', onMouseDown, false );
				container.addEventListener( 'mousedown', changeLight, false );
				container.appendChild( renderer.domElement );//将渲染结果呈现到页面上
				window.addEventListener( 'resize', onWindowResize, false ); //增加页面大小变化时的监听
				
				addButtonListener();
				//addOrbitControls();//添加自由旋转摄像机的控件
				addCubeControl();
				
			}
			function changeLight(event){
				mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
				mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;
				selectPointRaycaster.setFromCamera( mouse, camera );
				var intersects = selectPointRaycaster.intersectObject( lightSphere,true);
				if(intersects.length>0){
					control.attach(lightSphere);
					control.setMode("translate");
				}
			}
			

			function onWindowResize() {

				divWidth = mainDivWidth * window.innerWidth;//更新渲染器的宽度
				camera.aspect = divWidth / window.innerHeight;//计算摄像机的长宽比
				camera.updateProjectionMatrix();//更新摄像机的透视投影矩阵
				renderer.setSize( divWidth, window.innerHeight );//重新设置渲染器的尺寸
			}

			
			function animate() {
				requestAnimationFrame( animate );//请求绘制下一帧
				render();						//绘制每一帧的方法
				
			}

			function render() {
				//camera.lookAt( scene.position );//设置摄像机的焦点位置
				renderer.clear();
				renderer.setViewport(0, 0, divWidth, window.innerHeight);
				renderer.render(scene, camera);
			
				renderer.clearDepth();

				renderer.setViewport(divWidth - 100, window.innerHeight - 100, 100, 100);
				renderer.render(cubeScene,ortCamera);//绘制右上角的正方体
				//renderer.render( scene, camera );//绘制当前画面
				
			}
			
			function addButtonListener()
			{
				//===============================整体编辑栏==============================
				document.getElementById('transformBtn').addEventListener('click', function() {
				control.attach(loadMesh);
				control.setMode( "translate" );
				isPointSelectMode = false;}, false);
				document.getElementById('rotateBtn').addEventListener('click', function() {
				control.attach(loadMesh);
				control.setMode( "rotate" );
				isPointSelectMode = false;}, false);
				document.getElementById('scaleBtn').addEventListener('click', function() {
				control.attach(loadMesh);
				control.setMode( "scale" );
				isPointSelectMode = false;}, false);
				document.getElementById('pouqieBtn').addEventListener('click', function() {
					if(isEnablePQ==false)		//判断当前状态没有开启剖切功能
					{
						mtlManage.enablePQ();	//关闭剖切功能
						isEnablePQ = true;		//将对应的标志位置为true
					}else{						//判断当前状态已经开启剖切功能
						mtlManage.disEnablePQ();//开启剖切功能
						isEnablePQ = false;		//将对应的标志位置为false
					}
					isPointSelectMode = false;
				}, false);
				document.getElementById("myRange").onchange = function(){//滑动框的值发生改变时触发的事件
					var poqieOffset = document.getElementById("myRange").value;//获得当前滑动框的值
					mtlManage.setPQHeight(poqieOffset);//将滑动栏的值设置为剖切面的高度
				};
				//===============================拾取模块===============================
				
				
				document.getElementById('dianxuanBtn').addEventListener('click', function() {
					control.setMode( "translate" );
					isPointSelectMode = true;
					container.addEventListener( 'mousedown', onMouseDown, false );
				},false);
				
				document.getElementById('yanseBtn').addEventListener('click', function() {
					if(modelType[1]=="stl"){
						alert('stl格式的3D模型不支持纹理');
						return ;
					}
					isPickColor=!isPickColor;
				},false);
				
				document.getElementById('fanhuiBtn').addEventListener('click', function() {
					document.getElementById('tiaozhuan').click();
				},false);
				
				//===============================外观编辑栏==============================
				document.getElementById('zhuoseBtn').addEventListener('click', function() {
					document.getElementById('yanseban').click();
				},false);
				document.getElementById('yanseban').onchange = function(){
					var currentColor = mtlManage.toOne(this.value);
					mtlManage.setkd(currentColor.r,currentColor.g,currentColor.b);
				};
				
				
				document.getElementById('wenliBtn').addEventListener('click', function() {
					if(modelType[1]=="stl"){
						alert('stl格式的3D模型不支持纹理');
						return ;
					}
					var textureName = mtlManage.getTextureName();
					var textureP = parentName + textureName;
					document.getElementById('texturePath').value = textureP;
					document.getElementById('textureName').value = textureName;
					document.getElementById('textureSub').click();
				},false);
				
				document.getElementById('xiankuangBtn').addEventListener('click', function() {
					loadMesh.traverse( function ( child ) {				//遍历网格对象的子对象
						if ( child instanceof THREE.Mesh ) {			//如果子对象属于Mesh对象
							child.material.wireframe = !child.material.wireframe;
						}
					});
					isXianKuang = !isXianKuang;
					if(isXianKuang == true){
						document.getElementById('xiankuangBtn').style.backgroundColor="#409b93";
					}else{
						document.getElementById('xiankuangBtn').style.backgroundColor="#400071";
					}	
				},false);
				
				//===============================编辑模块栏==============================ok
				document.getElementById('chexiaoBtn').addEventListener('click', function() {
					matrixManage.goInverse();
					control.updatePosition();
				},false);
				document.getElementById('huifuBtn').addEventListener('click', function() {
					matrixManage.recover();
					control.updatePosition();
				},false);
				
				document.getElementById('baocunBtn').addEventListener('click', function() {
					tj();
				}, false);//给保存按钮增加导出obj的监听
				//===============================材质编辑栏==============================ok
				document.getElementById('ksInput').onchange = function(){
					if(this.value<0||this.value>1){
						alert("镜面光强度的取值范围为0-1,请重新输入。");
						return;
					}
					var tempks = this.value;			//获取镜面光强度输入框的值
					mtlManage.setks(tempks,tempks,tempks);//调用setks方法设置镜面光强度
				}
				
				document.getElementById('trInput').onchange = function(){
					if(this.value<0||this.value>1){
						alert("透明度的取值范围为0-1,请重新输入。");
						return;
					}
					var temptr = this.value;//获取透明度框的值
					mtlManage.settr(temptr);//调用settr方法设置透明度
				}
				
				
				document.getElementById('nsInput').onchange = function(){
					if(this.value<0||this.value>1000){
						alert("高光区的取值范围为0-1000,请重新输入。");
						return;
					}
					var tempns = this.value;//获取高光区大小框的值
					mtlManage.setns(tempns);//调用setns方法设置高光区大小
				}
				
				

				//**************************下载模块*****************************ok
				
				document.getElementById('downModelBtn').addEventListener('click', function() {
					if(modelType[1]=="obj")
					{
						downloadFile(exportToObj(),'<%=modelName%>');
					}else{
						
						
						downloadFile(exportToSTL(),'<%=modelName%>');
					}
				}, false);
					
				document.getElementById('downMtlBtn').addEventListener('click', function() {
					downloadFile(mtlManage.exportMtl(),'<%=mtlName%>');
				}, false);
				
				document.getElementById('downTuBtn').addEventListener('click', function() {
					if(modelType[1]=="stl"){
						alert('stl格式的3D模型不支持纹理');
						return ;
					}
					exportCanvasAsPNG('myCanvas',mtlManage.getTextureName());
				}, false);

			}
			function exportToObj() {
				var result = exporter.parse( loadMesh);//将编辑后的网格对象进行导出
				return result;
			}
			function exportToSTL(){
				var geo = new THREE.Geometry().fromBufferGeometry(loadMesh.geometry);
				var mesh = new THREE.Mesh(geo,mtlManage.getMtl());
				var stlExport = new THREE.STLExporter();
				var result = stlExport.parse(mesh);
				return result;
			}
			function tj()
			{

				document.all.mid.value = <%=mid%>;
				document.all.cmd.value = matrixManage.produceString();
				document.all.mf.submit();   
				
			}	
			
			function pageOnLoad(){
				
				document.getElementById('ksInput').value = mtlManage.getks().toFixed(2);
				document.getElementById('trInput').value = mtlManage.gettr();
				document.getElementById('nsInput').value = mtlManage.getns();
			}
			function onMouseDown(event){
				if(isPointSelectMode==false){return;}
				var max_distants = 5;
		
				//进行坐标系的转化，x、y的取值范围在0~1之间
				mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
				mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;
				selectPointRaycaster.setFromCamera( mouse, camera );//将转换后的鼠标点和摄像机传进raycaster中
				var intersects = selectPointRaycaster.intersectObject( loadMesh,true);	//使用raycaster进行投射，观察其是否与指定的3D物体相交
				if ( intersects.length > 0 ) {//如果判断鼠标投射到了物体上
					//alert("点击到物体");
					//console.log(intersects[0].object.geometry.attributes.position);
					var vertexArray = intersects[0].object.geometry.attributes.position;
					//var vertexArray = intersects[0].vertices;
					indexA = intersects[0].face.a;
					indexB = intersects[0].face.b;
					indexC = intersects[0].face.c;
					var vertexA = new THREE.Vector3(
						vertexArray.getX(indexA),vertexArray.getY(indexA),vertexArray.getZ(indexA)).applyMatrix4( loadMesh.matrixWorld );
					var vertexB = new THREE.Vector3(
						vertexArray.getX(indexB),vertexArray.getY(indexB),vertexArray.getZ(indexB)).applyMatrix4( loadMesh.matrixWorld );
					var vertexC = new THREE.Vector3(
						vertexArray.getX(indexC),vertexArray.getY(indexC),vertexArray.getZ(indexC)).applyMatrix4( loadMesh.matrixWorld );

					var distanceA = vertexA.distanceTo(intersects[0].point);
					var distanceB = vertexB.distanceTo(intersects[0].point);
					var distanceC = vertexC.distanceTo(intersects[0].point);
				
					var min_distance = (distanceA>distanceB)?distanceB:distanceA;
					nest_point = (distanceA>distanceB)?vertexB:vertexA;
					nest_index = (distanceA>distanceB)?indexB:indexA;
				
					nest_point = (min_distance>distanceC)?vertexC:nest_point;
					nest_index = (min_distance>distanceC)?indexC:nest_index;
					min_distance = (min_distance>distanceC)?distanceC:min_distance;
					
					selectPoint.position.copy(nest_point);
					control.setIndex(nest_index);
					control.attach(selectPoint);
					
				}
			}
			function onMouseMove(){
				if(isPointSelectMode==false){return;}
				
				
				if(loadMesh!==undefined){
					//group.matrixWorld.set(mesh.matrixWorld);
					
					var worldMatrixInverse = new THREE.Matrix4();
					worldMatrixInverse.getInverse(loadMesh.matrixWorld);
					
					selectPoint_position = new THREE.Vector3(selectPoint.position.x,selectPoint.position.y,selectPoint.position.z);
					selectPoint_position.applyMatrix4(worldMatrixInverse);
					if(loadMesh.children[0]!==undefined)
					{
						loadMesh.children[0].geometry.getAttribute( 'position').setXYZ(nest_index,selectPoint_position.x,selectPoint_position.y,selectPoint_position.z);
						loadMesh.children[0].geometry.attributes.position.needsUpdate = true;
					}else{
						loadMesh.geometry.getAttribute( 'position').setXYZ(nest_index,selectPoint_position.x,selectPoint_position.y,selectPoint_position.z);
						loadMesh.geometry.attributes.position.needsUpdate = true;
					}
					
				}


			}
			
		</script>
		
	</body>
</html>
