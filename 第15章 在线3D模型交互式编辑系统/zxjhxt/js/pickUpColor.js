	function onDocumentMouseDown(event){
		if(isPickColor){
			//��������ϵ��ת����x��y��ȡֵ��Χ��0~1֮��
			mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
			mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;
			raycaster.setFromCamera( mouse, camera );//��ת�������������������raycaster��
			var intersects = raycaster.intersectObject( loadMesh,true);//ʹ��raycaster����Ͷ�䣬�۲����Ƿ���ָ����3D�����ཻ
			if ( intersects.length > 0 ) {//����ж����Ͷ�䵽��������
				//alert(intersects[0].uv.x+","+intersects[0].uv.y);
				getColorOfImage(intersects[0].uv.x,intersects[0].uv.y,parentName+mtlManage.getTextureName());//��õ�������ɫֵ
			}
		}
	}
	
	function getColorOfImage(u,v,imagePath){//����UV���������ͼ��·��
		var colorResult = "";
		var canvas = document.getElementById("myCanvas");//����id�ҵ���Ӧ��canvas��ǩ
		if(canvas.getContext){ //��ȡ���������������
			//��ȡ��Ӧ��CanvasRenderingContext2D����(����)
			var ctx = canvas.getContext("2d");
			var imgdata = ctx.getImageData(Math.floor(img.width * u),Math.floor(img.height *(1-v)),1,1);
			var R = convert(imgdata.data[0]);//��Rͨ����ɫֵת����16����
			var G = convert(imgdata.data[1]);//��Gͨ����ɫֵת����16����
			var B = convert(imgdata.data[2]);//��Bͨ����ɫֵת����16����
			colorResult = "#"+R+G+B;//�ۺ�����ͨ�����ó�������ɫֵ
			//��ӡ����Ӧ��Ĳ������
			alert("��ѡȡ�ĵ���ɫֵΪ��"+colorResult);
			//alert(+R+","+G+","+B);
			};
	}
	
	function initCanvas(){
		var canvas = document.getElementById("myCanvas");
		if(canvas.getContext){ //��ȡ���������������
			var ctx = canvas.getContext("2d");
			//�����µ�ͼƬ����
			img = new Image();
			//ָ������ͼƬ��URL
			img.src = parentName + mtlManage.getTextureName();
			img.onload = function(){
				canvas.width = img.width;//ͼƬ�Ŀ�ȸ�ֵ��canvas
				canvas.height = img.height;//ͼƬ�ĸ߶ȸ�ֵ��canvas

				ctx.drawImage(img, 0, 0, img.width,img.height);//��������ͼ�Ĵ�С���� ��������canvas��
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