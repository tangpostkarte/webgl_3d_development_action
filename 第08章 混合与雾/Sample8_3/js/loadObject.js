function loadObjFile(url,object,id)//�ӷ�������ȡObj�ı����ݵĺ���
{
	var req = new XMLHttpRequest();//�첽�������
	//������Ӧ�ص�����������processObjectLoadObj������Ӧ
	req.onreadystatechange = function () { processObjectLoadObj(req,object,id) };
	req.open("GET", url, true);//��GET��ʽ��ָ��URL
	req.responseType = "text";//������Ӧ����
	req.send(null);//����HTTP����
}
function createObject(objDataIn,object,id)//����������ƶ���ķ���
{
	if(shaderProgArray[id])//���ָ����ɫ���Ѽ������
	{
		switch(object)
		{//������
			case 0://������ͼ����
				masss=new ObjObject(gl,objDataIn.vertices,objDataIn.normals,shaderProgArray[id]);
			break;
	  
			case 1://������պж���
				masss1=new ObjObject(gl,objDataIn.vertices,objDataIn.normals,shaderProgArray[id]);
			break;
		  
			case 2://�������λ��ƶ���
				masss2=new ObjObject(gl,objDataIn.vertices,objDataIn.normals,shaderProgArray[id]); 
			break;
		  
			case 3://����ˮ�ض���
				masss3=new ObjObject(gl,objDataIn.vertices,objDataIn.normals,shaderProgArray[id]);
			break;
		  
			case 4://������ƺ����
				masss4=new ObjObject(gl,objDataIn.vertices,objDataIn.normals,shaderProgArray[id]);
			break;
			
			
		}
		
	}
	else
	{
		setTimeout(function(){createObject(objDataIn,object,id);},10); //��Ϣ10ms����ִ��
	}
}

function processObjectLoadObj(req,object,id)//����obj�ı����ݵĻص�����
{
	if (req.readyState == 4) //��״̬Ϊ4
	{
		var objStr = req.responseText;		//��ȡ��Ӧ�ı�	
		this.dataTemp=fromObjStrToObjectData(objStr);//��obj�ı�����Ϊ���ݶ���
		createObject(dataTemp,object,id); 	//�����������������
	}
} 