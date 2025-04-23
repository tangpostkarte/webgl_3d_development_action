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
				<input type="submit" id="textureSub" value="�ύ">
			</form>
		</div>
		<!--�����������ݵı�-->
		<form action="3dbianji.jsp" id="mf">
			<input type="hidden" name="mid" id="mid">
			<input type="hidden" name="cmd" id="cmd">
			<input type="hidden" name="fromPlace" value="pageSlef">
		</form>
		<div style="width:180px; height:100px; overflow-y:auto;position:absolute;">
			<table id="operateTable"style="width:150px;cellspacing:0;" >
			<tr>
				<th>�������</th><th>�����б�</th>
			</tr>
			</table>
		</div>
		<canvas id="myCanvas"  style="display:none"></canvas>
		<div id = "3Dbianji"></div>
		<div id = "gongjulan">
			<div class = "toolbar">
			    <div class="toolTital">����༭��</div>
				<button type="button" id = "transformBtn">ƽ ��</button>
				<button type="button" id = "rotateBtn">�� ת</button>
				<button type="button" id = "scaleBtn">�� ��</button>
				<div><button type="button" id = "pouqieBtn">�� ��</button>
				���и߶�<input type="range" id="myRange" style="width:105px"  max="100" min="-100" />
				</div>
			</div>
			<div class = "toolbar">
			    <div class="toolTital">ʰȡģ��</div>
				<button type="button" id = "dianxuanBtn">�� ѡ</button>
				<button type="button" id = "yanseBtn">����ɫ</button>
				<button type="button" id = "fanhuiBtn">������ҳ</button>
				
			</div>
			<div class = "toolbar">
			    <div class="toolTital">��۱༭</div>
					<div style="display:none">
						<input type="color" id = "yanseban" defaultValue="#ffffff" />
					</div>
				<button type="button" id = "zhuoseBtn">�� ɫ</button>
				<button type="button" id = "wenliBtn">�� ��</button>
				<button type="button" id = "xiankuangBtn">�߿�ģʽ</button>
			</div>
			<div class = "toolbar">
			    <div class="toolTital">�༭ģ��</div>
				<button type="button" id = "chexiaoBtn">�� ��</button>
				<button type="button" id = "huifuBtn">�� ��</button>
				<button type="button" id = "baocunBtn">�� ��</button>
			</div>
			
			<div class = "toolbar" >
			    <div class="toolTital">�����޸�</div>
				�����ǿ��<input type="text" class ="mtlInput" id="ksInput"/>
				͸����<input type="text" class ="mtlInput" id="trInput"/>
				�߹����ߴ�<input type="text" class ="mtlInput" id="nsInput"/><br/>
				
			</div>
			<div class = "toolbar">
			    <div class="toolTital">����ģ��</div>
				<button type="button" id = "downModelBtn">ģ ��</button>
				<button type="button" id = "downMtlBtn">�� ��</button>
				<button type="button" id = "downTuBtn">�� ��</button>
			</div>
		</div>
		<div style="display:none"><a id='tiaozhuan' href="<%=upModelPage%>">��ת</a></div>
		
		<script>
			//console.log(ss);
			var isXianKuang = false;
			var isPickColor = false;
			var matrixManage;//����任�Ĺ�����
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
			var mainDivWidth = 0.8;//3Dģ�ͱ༭�ӿڿ��ռҳ���ܿ�ȵı���
			var divWidth;//3Dģ�ͱ༭�ӿڵ�ʵ�ʿ��
			var loadMesh;//������ɺ��mesh����
			var localPlane;//����ƽ��
			var isEnablePQ = false;
			var mtlManage;//�������������Ϣ�Ķ���
			var isPointInCube;
			var currentX,currentY;
			var pointdown = new THREE.Vector2();
			var ortRadius = 500;
			var radius = 500;
			var yj = 45;				//�����������
			var degree = 45;			//������ĳ����
			var ortCamera;
			var cube;
			var selectPoint =new THREE.Object3D();
			selectPoint.name = "sPoint";
			var selectPointRaycaster = new THREE.Raycaster();//����ʰȡ���Ͷ����
			var isPointSelectMode=false;//��ʾ�Ƿ���е�ѡ�ı�־λ
			var img;//����ͼ������
			var nest_index;//ѡ�еĵ������
			var modelType;
			var lightSphere;
			init();
			animate();
			
			function init() {
			
				container = document.getElementById('3Dbianji');
				document.body.appendChild(container);
				divWidth = innerWidth* mainDivWidth;	//����3Dģ�ͱ༭�ӿڵ�ʵ�ʿ��
				//�½�͸��ͶӰ�����
				scene = new THREE.Scene();//�½���������
				camera = new THREE.PerspectiveCamera( 45, divWidth / window.innerHeight, 1, 2000 );
				ortCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, -200, 10000);
				var cy = Math.sin(yj*Math.PI/180) * radius;			//��ת�İ뾶
				var cxz = Math.cos(yj*Math.PI/180) * radius;			//��ת�İ뾶
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
				
				
				var axes = new THREE.AxisHelper(200);//�½����긨������
        		scene.add(axes);//�����긨��������ӵ�������
				
				var ambient = new THREE.AmbientLight( 0xffffff,0.5 );//����������
				scene.add( ambient );//�ڳ�������ӻ�����

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
					var mtlLoader = new THREE.MTLLoader();//�½����ʵļ�����
					mtlLoader.setPath( '<%=parentName%>' );
					mtlLoader.load( '<%=mtlName%>', function( materials ) {//��ȡ�����ļ�
						materials.preload();
						mtlManage = new MtlManage(materials);
						mtlManage.getInformation();
						initCanvas();
						var objLoader = new THREE.OBJLoader();//�½�obj�ļ��ļ�����
							objLoader.setPath('<%=parentName%>');
							objLoader.setMaterials( materials );//���ò���
							objLoader.load( '<%=modelName%>', function ( object ) {//��ȡobj�ļ�
					
							matrixManage = new MatrixManage(object,ss);
							matrixManage.goCurrent();
							//����ģ�Ͳ����ؼ�
							control = new THREE.TransformControls( camera, renderer.domElement,	matrixManage);
							control.setSpace( "world" );//���ÿؼ��ı����ģ�͵�����
							control.attach( object );	//���ռ���3Dģ�ͽ��а�
							scene.add( control );		//���ռ���ӵ�������
						
							loadMesh = object;			//��ģ�͸�ֵ��ȫ�ֱ���������֮��Ĳ���
							scene.add( object );								//�򳡾������ģ��
							loadMesh.traverse( function ( child ) {				//�������������Ӷ���
							if ( child instanceof THREE.Mesh ) {			//����Ӷ�������Mesh����
							
								child.material.side = THREE.DoubleSide;			//�رձ������
								//child.material.wireframe = true;
							}
							pageOnLoad();
						});
						});
					});
				}else{
					//initCanvas();
					var mtlLoader = new THREE.MTLLoader();//�½����ʵļ�����
					mtlLoader.setPath( '<%=parentName%>' );
					mtlLoader.load( '<%=mtlName%>', function( materials ) {//��ȡ�����ļ�
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
							control.setSpace( "world" );//���ÿؼ��ı����ģ�͵�����
							control.attach( loadMesh );	//���ռ���3Dģ�ͽ��а�
							scene.add( control );		//���ռ���ӵ�������
							scene.add( loadMesh );
							pageOnLoad();
						
						});
					});
				}
				
				
				
				
				renderer = new THREE.WebGLRenderer({antialias:true});//�½���Ⱦ������
				
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth * mainDivWidth, window.innerHeight );//������Ⱦ���ĳߴ�
				
				renderer.localClippingEnabled = true;//������Ⱦ���ļ��ã���ģ���ʷֹ����йأ�
				renderer.autoClear = false;

				
				container.addEventListener( 'mousedown', onDocumentMouseDown, false );
				container.addEventListener( 'mousedown', onMouseDown, false );
				container.addEventListener( 'mousedown', changeLight, false );
				container.appendChild( renderer.domElement );//����Ⱦ������ֵ�ҳ����
				window.addEventListener( 'resize', onWindowResize, false ); //����ҳ���С�仯ʱ�ļ���
				
				addButtonListener();
				//addOrbitControls();//���������ת������Ŀؼ�
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

				divWidth = mainDivWidth * window.innerWidth;//������Ⱦ���Ŀ��
				camera.aspect = divWidth / window.innerHeight;//����������ĳ����
				camera.updateProjectionMatrix();//�����������͸��ͶӰ����
				renderer.setSize( divWidth, window.innerHeight );//����������Ⱦ���ĳߴ�
			}

			
			function animate() {
				requestAnimationFrame( animate );//���������һ֡
				render();						//����ÿһ֡�ķ���
				
			}

			function render() {
				//camera.lookAt( scene.position );//����������Ľ���λ��
				renderer.clear();
				renderer.setViewport(0, 0, divWidth, window.innerHeight);
				renderer.render(scene, camera);
			
				renderer.clearDepth();

				renderer.setViewport(divWidth - 100, window.innerHeight - 100, 100, 100);
				renderer.render(cubeScene,ortCamera);//�������Ͻǵ�������
				//renderer.render( scene, camera );//���Ƶ�ǰ����
				
			}
			
			function addButtonListener()
			{
				//===============================����༭��==============================
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
					if(isEnablePQ==false)		//�жϵ�ǰ״̬û�п������й���
					{
						mtlManage.enablePQ();	//�ر����й���
						isEnablePQ = true;		//����Ӧ�ı�־λ��Ϊtrue
					}else{						//�жϵ�ǰ״̬�Ѿ��������й���
						mtlManage.disEnablePQ();//�������й���
						isEnablePQ = false;		//����Ӧ�ı�־λ��Ϊfalse
					}
					isPointSelectMode = false;
				}, false);
				document.getElementById("myRange").onchange = function(){//�������ֵ�����ı�ʱ�������¼�
					var poqieOffset = document.getElementById("myRange").value;//��õ�ǰ�������ֵ
					mtlManage.setPQHeight(poqieOffset);//����������ֵ����Ϊ������ĸ߶�
				};
				//===============================ʰȡģ��===============================
				
				
				document.getElementById('dianxuanBtn').addEventListener('click', function() {
					control.setMode( "translate" );
					isPointSelectMode = true;
					container.addEventListener( 'mousedown', onMouseDown, false );
				},false);
				
				document.getElementById('yanseBtn').addEventListener('click', function() {
					if(modelType[1]=="stl"){
						alert('stl��ʽ��3Dģ�Ͳ�֧������');
						return ;
					}
					isPickColor=!isPickColor;
				},false);
				
				document.getElementById('fanhuiBtn').addEventListener('click', function() {
					document.getElementById('tiaozhuan').click();
				},false);
				
				//===============================��۱༭��==============================
				document.getElementById('zhuoseBtn').addEventListener('click', function() {
					document.getElementById('yanseban').click();
				},false);
				document.getElementById('yanseban').onchange = function(){
					var currentColor = mtlManage.toOne(this.value);
					mtlManage.setkd(currentColor.r,currentColor.g,currentColor.b);
				};
				
				
				document.getElementById('wenliBtn').addEventListener('click', function() {
					if(modelType[1]=="stl"){
						alert('stl��ʽ��3Dģ�Ͳ�֧������');
						return ;
					}
					var textureName = mtlManage.getTextureName();
					var textureP = parentName + textureName;
					document.getElementById('texturePath').value = textureP;
					document.getElementById('textureName').value = textureName;
					document.getElementById('textureSub').click();
				},false);
				
				document.getElementById('xiankuangBtn').addEventListener('click', function() {
					loadMesh.traverse( function ( child ) {				//�������������Ӷ���
						if ( child instanceof THREE.Mesh ) {			//����Ӷ�������Mesh����
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
				
				//===============================�༭ģ����==============================ok
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
				}, false);//�����水ť���ӵ���obj�ļ���
				//===============================���ʱ༭��==============================ok
				document.getElementById('ksInput').onchange = function(){
					if(this.value<0||this.value>1){
						alert("�����ǿ�ȵ�ȡֵ��ΧΪ0-1,���������롣");
						return;
					}
					var tempks = this.value;			//��ȡ�����ǿ��������ֵ
					mtlManage.setks(tempks,tempks,tempks);//����setks�������þ����ǿ��
				}
				
				document.getElementById('trInput').onchange = function(){
					if(this.value<0||this.value>1){
						alert("͸���ȵ�ȡֵ��ΧΪ0-1,���������롣");
						return;
					}
					var temptr = this.value;//��ȡ͸���ȿ��ֵ
					mtlManage.settr(temptr);//����settr��������͸����
				}
				
				
				document.getElementById('nsInput').onchange = function(){
					if(this.value<0||this.value>1000){
						alert("�߹�����ȡֵ��ΧΪ0-1000,���������롣");
						return;
					}
					var tempns = this.value;//��ȡ�߹�����С���ֵ
					mtlManage.setns(tempns);//����setns�������ø߹�����С
				}
				
				

				//**************************����ģ��*****************************ok
				
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
						alert('stl��ʽ��3Dģ�Ͳ�֧������');
						return ;
					}
					exportCanvasAsPNG('myCanvas',mtlManage.getTextureName());
				}, false);

			}
			function exportToObj() {
				var result = exporter.parse( loadMesh);//���༭������������е���
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
		
				//��������ϵ��ת����x��y��ȡֵ��Χ��0~1֮��
				mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
				mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;
				selectPointRaycaster.setFromCamera( mouse, camera );//��ת�������������������raycaster��
				var intersects = selectPointRaycaster.intersectObject( loadMesh,true);	//ʹ��raycaster����Ͷ�䣬�۲����Ƿ���ָ����3D�����ཻ
				if ( intersects.length > 0 ) {//����ж����Ͷ�䵽��������
					//alert("���������");
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
