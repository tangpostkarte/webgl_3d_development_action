function rectdrawScreen(){
	//画布背景色为白色不利于辨识，填充一个有颜色的区域便于标示。
	context.fillStyle="#aaaaaa";
	context.fillRect(0,0,500,500);
	//绘制矩形
	context.fillStyle='#000000';//设置Canvas绘图时所需的填充或描边样式。
	context.strokeStyle='#ff00ff';
	context.lineWidth=2;//设置画笔
	context.fillRect(10,10,40,40);//绘制填充矩形,绘制矩形的四个参数前两个为位置，后两个为宽与高
	context.strokeRect(0,0,60,60);//绘制矩形边框，需要使用当前strokeStyle、lineWidth、lineJoin以及miterLimit设置。
	context.clearRect(20,20,20,20);//清除指定区域并使其完全透明。
}