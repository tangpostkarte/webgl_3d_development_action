function arcdrawScreen(){
	//画布背景色为白色不利于辨识，填充一个有颜色的区域便于标示。
	context.fillStyle="#aaaaaa";
	context.fillRect(0,0,500,500);
	//绘制圆弧
	context.beginPath();
	context.strokeStyle="red";
	context.lineWidth=5;
	context.arc(100,100,20,(Math.PI/180)*0,(Math.PI/180)*360,false);//绘制整圆
	//context.arc(100,100,20,(Math.PI/180)*0,(Math.PI/180)*90,false);//绘制1/4圆
	//context.arc(100,100,20,(Math.PI/180)*0,(Math.PI/180)*90,true);//anticlockwise值改为true绘制3/4圆
	context.stroke();
	context.closePath();
}