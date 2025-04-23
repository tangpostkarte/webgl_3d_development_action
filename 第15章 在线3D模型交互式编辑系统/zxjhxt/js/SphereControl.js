		function addCubeControl()//������ι켣�������ķ���
		{
			var hasload=0;
			var cubeGeo = new THREE.CubeGeometry(1,1,1);//�½�������ķ���
			var textLoader = new THREE.TextureLoader();//�½�������ͼ�ļ�����
			
			var textureArray=[
				new THREE.MeshBasicMaterial({map: (new THREE.TextureLoader).load("xitongtu/0.jpg")}),
				new THREE.MeshBasicMaterial({map: (new THREE.TextureLoader).load("xitongtu/1.jpg")}),
				new THREE.MeshBasicMaterial({map: (new THREE.TextureLoader).load("xitongtu/2.jpg")}),
				new THREE.MeshBasicMaterial({map: (new THREE.TextureLoader).load("xitongtu/3.jpg")}),
				new THREE.MeshBasicMaterial({map: (new THREE.TextureLoader).load("xitongtu/4.jpg")}),	
				new THREE.MeshBasicMaterial({map: (new THREE.TextureLoader).load("xitongtu/5.jpg")})
			];//���������ͼ������
			
			
			var cubeMaterial = new THREE.MeshFaceMaterial(textureArray);//�½�����
			cube = new THREE.Mesh(cubeGeo, cubeMaterial);//�����������������
			cubeScene.add(cube);//�������������ӵ�������
			
			//console.log(textureArray);
			renderer.domElement.addEventListener( 'mousedown', onSphereMouseDown, false );//�����갴�µļ���
			renderer.domElement.addEventListener( 'mousemove', onSphereMousemove, false );
			//�������ƶ��ļ���
			renderer.domElement.addEventListener( 'mouseup', onSphereMouseup , false);
			//������̧��ļ���
			
			renderer.domElement.addEventListener( 'mousewheel', onMouseWheel , false);
			renderer.domElement.addEventListener( 'MozMousePixelScroll', onMouseWheel , false);
		}
		function onSphereMouseDown(event){
			
			var Xmax = renderer.domElement.clientWidth, Xmin = Xmax-100;//ȷ��������������Ļ������
			var Ymax = 100, Ymin = Ymax-100;
			
			mouse.x = ( (event.clientX-Xmin) / 100 ) * 2 - 1;//����갴�µ�X�������ת��
			mouse.y = - ( (event.clientY-Ymin) / 100 ) * 2 + 1;//����갴�µ�Y�������ת��

			raycaster.setFromCamera( mouse, ortCamera );//��ת�������������������raycaster��
			
			var intersects = raycaster.intersectObject( cube,true);//ʹ�������ж��Ƿ�ʰȡ����������
			
			
			if ( intersects.length > 0 ) {		//����ж����Ͷ�䵽����������

				pointdown.x = event.clientX;	//��¼�µ�ǰ���������X����
				pointdown.y = event.clientY;	//��¼�µ�ǰ���������Y����
				prePointX = event.clientX;		//prePointX������¼�ϴ�������ڵ�X����
				prePointY = event.clientY;		//prePointY������¼�ϴ�������ڵ�Y����

				isPointInCube = true;			//���Ķ�Ӧ�ı�־λ

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
				
				var cy = Math.sin(yj*Math.PI/180) * radius;			//��ת�İ뾶
				var cxz = Math.cos(yj*Math.PI/180) * radius;			//��ת�İ뾶
				var cx = Math.sin(degree*Math.PI/180)* cxz;
				var cz = Math.cos(degree*Math.PI/180)* cxz;
				
				
				//���㵱ǰ�������UP����
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
				camera.lookAt(scene.position);//�������������
				
				camera.updateProjectionMatrix();

				
			}
		    prePointX  =  currentX;
			prePointY  =  currentY;
			
		}
		function onSphereMouseup(event)
		{	//���̧��󴥷����¼�
			
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
				var cy = Math.sin(yj*Math.PI/180) * radius;			//��ת�İ뾶
				var cxz = Math.cos(yj*Math.PI/180) * radius;			//��ת�İ뾶
				var cx = Math.sin(degree*Math.PI/180)* cxz;
				var cz = Math.cos(degree*Math.PI/180)* cxz;
				
				camera.position.x = cx;
				camera.position.y = cy;
				camera.position.z = cz;
			
		}