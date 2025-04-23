function MtlManage(material)
{
	this.material = material;//指向读取的材质
	this.information = [];//用来储存当前的材质信息
	this.localPlane = new THREE.Plane( new THREE.Vector3( 0, - 1, 0 ), 0.5 );//用来进行剖切的平面
	this.output='';//用来存储材质文件的结果
}
MtlManage.prototype.getMtl = function(){
	/*for(matName in this.information){
		console.log(matName +""+ this.information[matName]);
	}*/
	//console.log(this.material.materials);
	for(var mat in this.material.materials)//遍历读取的材质信息
	{
		var material = this.material.materials[mat];
		//var material = new THREE.MeshPhongMaterial({color:0xffffff});
		material.side = THREE.DoubleSide;
		return material;
	}
}

MtlManage.prototype.getTextureName = function(){
	
	var texturePath;
	for(var matName in this.material.materials)//遍历读取的材质信息
	{
		texturePath = this.material.materialsInfo[matName].map_kd;//导出模型贴图的路径
		if(texturePath!==undefined){
			return texturePath;
		}
	}
	
}
MtlManage.prototype.getInformation = function()
{
	//console.log(this.material.materialsInfo);
	for(var typeName in this.material.materialsInfo){//遍历读取到的所有属性
		this.information[typeName] = this.material.materialsInfo[typeName];
		//将当前信息存入到数组中方便管理
	}
	console.log(this.information);
};

MtlManage.prototype.setkd = function(r,g,b)//改变物体固有颜色的方法 范围为0-1*****************
{
	console.log(this.material.materials);
	for(var matName in this.material.materials)//遍历读取的材质信息
	{
		var mat = this.material.materials[matName];
		mat.color.r = r;
		mat.color.g = g;
		mat.color.b = b;
		mat.color.needsUpdate = true;
	}
};

MtlManage.prototype.getkd = function()//改变物体固有颜色的方法 范围为0-1*****************
{
	var tempColor = new THREE.Vector3();//代表物体固有颜色的变量
	for(var matName in this.material.materials)//遍历读取的材质信息
	{
		var mat = this.material.materials[matName];
		if(mat.color!==undefined)
		{
			tempColor.x =	mat.color.r;
			tempColor.y =	mat.color.g;
			tempColor.z =	mat.color.b;
		}
	}
	return tempColor;//将当前颜色返回
};


MtlManage.prototype.setks = function(r,g,b)//改变物体镜面光的方法 范围为0-1
{
	for(var matName in this.material.materials)//遍历读取的材质信息
	{
		var mat = this.material.materials[matName];
		mat.specular.r = r;
		mat.specular.g = g;
		mat.specular.b = b;
		mat.needsUpdate = true;//更新材质信息
	}
};
MtlManage.prototype.getks = function()//改变物体镜面光的方法 范围为0-1
{
	var currentks;//代表当前材质对光线的反射强度
	for(var matName in this.material.materials)//遍历读取的材质信息
	{
		var mat = this.material.materials[matName];
		if(mat.specular.r!==undefined)
		{
			currentks = mat.specular.r;
			//currentks = currentks.toFixed(2);
		}
	}
	//alert(currentks);
	return currentks;//返回当前的反射强度
};

MtlManage.prototype.setns = function(ns)//设置材质的高光区域大小的方法,取值范围位0-1000
{
	for(var matName in this.material.materials)
	{
		var mat = this.material.materials[matName];
		mat.shininess = ns;//通过修改材质的shiniess属性设置高光区域
		mat.needsUpdate = true;//更新材质信息
	}
};
MtlManage.prototype.getns = function()//返回当前物体高光区域值的方法
{
	var currentns;//表示当前高光区域的值
	for(var matName in this.material.materials)//对当前的材质信息进行遍历
	{
		var mat = this.material.materials[matName];
		//console.log(mat.shininess);
		if(mat.shininess!== undefined)//如果当前材质中shininess属性不为空
		{
			//alert(mat.shininess);
			currentns= mat.shininess;//将其赋值给变量ns
		}
	}
	return currentns;//返回当前物体的高光区域值
};


MtlManage.prototype.settr = function(tr)//设置材质透明度的方法
{
	for(var matName in this.material.materials)//遍历读取的材质信息
	{
		var mat = this.material.materials[matName];
		mat.opacity = 1-tr;//根据透明度来计算不透明度并设置
		mat.transparent = true;//开启材质的透明选项
		mat.needsUpdate = true;//更新材质信息
	}
};

MtlManage.prototype.gettr = function()//获取材质透明度的方法
{
	var currenttr;//表示材质当前透明度
	for(var matName in this.material.materials)//遍历读取的材质信息
	{
		var mat = this.material.materials[matName];
		if(mat.opacity!== undefined)//如果当前材质中shininess属性不为空
		{
			currenttr = 1 - mat.opacity;//根据透明度来计算不透明度并设置
		}
	}
	return currenttr;//返回获得的透明度
};

MtlManage.prototype.enablePQ = function()//开启剖切的方法
{
	for(var matName in this.material.materials)//遍历读取到的材质信息
	{
		var mat = this.material.materials[matName];
		mat.clippingPlanes = [this.localPlane];//设置用来完成剖切的平面
		mat.needsUpdate = true;//更新材质信息
	}
};

MtlManage.prototype.disEnablePQ = function()//关闭剖切的方法
{
	for(var matName in this.material.materials)//遍历读取的材质信息
	{
		var mat = this.material.materials[matName];
		mat.clippingPlanes = null;//将材质的clippingPlanes置为null，从而关闭剖切功能
		mat.needsUpdate = true;//更新材质信息
	}
};

MtlManage.prototype.setPQHeight = function(height)//设置剖切高度的方法
{
	this.localPlane.constant = height;//改变剖切面的constant属性
};
MtlManage.prototype.getMtlName = function()
{
	for(var matName in this.material.materials)//遍历读取的材质信息
	{
		var mat = this.material.materials[matName];
		return mat.name;
	}
}
MtlManage.prototype.toOne = function(str)//传入的是16进制字符串
{
	var temp = [];
	var result = [];
	var colorArray = str.split('');
	console.log(colorArray);
	temp["r"] = parseInt("0x"+colorArray[1] + colorArray[2])/256;
	temp["g"] = parseInt("0x"+colorArray[3] + colorArray[4])/256;
	temp["b"] = parseInt("0x"+colorArray[5] + colorArray[6])/256;
	result["r"] = temp["r"].toFixed(2);
	result["g"] = temp["g"].toFixed(2);
	result["b"] = temp["b"].toFixed(2);
	return result;
};
MtlManage.prototype.exportMtl=function()//将当前材质导出为字符串的方法
{
	var temp;//用来的存储单个数字的变量
	var tempVector = new THREE.Vector3();//用来保存三维向量的变量
	this.output="";//重置导出结果
	for(var matName in this.material.materials)//遍历读取的材质信息
	{
		var mat = this.material.materials[matName];
		this.output = this.output + "newmtl " + mat.name+" \r\n";//导出时写出
		this.output += "illum 4\r\n";
		tempVector = this.getkd();
		this.output += "kd " + tempVector.x +' '+tempVector.y+' '+tempVector.z+' \r\n';//导出物体原本的颜色
		temp = this.getks();
		temp = temp.toFixed(2);
		this.output += "ks " + temp +' '+temp+' '+temp+' \r\n';//导出物体的反射光强度
		temp = this.gettr();
		this.output += "Tr " + temp +' \r\n';//导出物体的透明度
		temp = this.getns();
		this.output += "ns " + temp +" \r\n";
		var texturePath = this.material.materialsInfo[matName].map_kd;//导出模型贴图的路径
		if(texturePath!==undefined)
		{
			this.output += "map_kd " + texturePath;
		}
	}
	//alert(this.output);
	return this.output;
}


