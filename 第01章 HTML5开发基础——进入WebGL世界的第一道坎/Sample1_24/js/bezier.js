function bezierdrawScreen(){
	context.beginPath();
	context.strokeStyle="red";
	context.lineWidth=5;
	//画布背景色为白色不利于辨识，填充一个有颜色的区域便于标示。
	context.fillStyle="#aaaaaa";
	context.fillRect(0,0,500,500);
	//绘制简单平法贝塞尔曲线
	context.moveTo(0,0);
	context.quadraticCurveTo(100,25,0,50);
	//有两个控制点的贝塞尔曲线
	context.moveTo(150,0);
	context.bezierCurveTo(0,125,300,175,150,300);
	context.stroke();
	context.closePath();
}