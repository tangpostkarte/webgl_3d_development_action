function linedrawScreen(){
	//画布背景色为白色不利于辨识，填充一个有颜色的区域便于标示。
	context.fillStyle="#aaaaaa";
	context.fillRect(0,0,500,500);
	//简单直线路径
	context.strokeStyle="red";//设置笔触样式，定义线和形状边框的颜色和样式。
	context.lineWidth=10;//设置线宽
	context.lineCap='square';//定义上下文中线的端点，butt为默认值，端点是垂直于线段边缘的平直边缘
	//round端点是在线段边缘处以线宽为直径的半圆square端点在线段边缘处以线宽为长一半线宽为宽的矩形。
	context.beginPath();//调用函数开始一个路径
	context.moveTo(20,80);//设置起点
	context.lineTo(100,80);//设置终点
	context.stroke();//画出构建的路径
	context.closePath();//结束一个路径
}