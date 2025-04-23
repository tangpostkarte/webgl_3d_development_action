function drawSelfCube(ms,cr){
	//总绘制思想：通过把一个颜色矩形旋转移位到立方体每个面的位置
	//绘制立方体的每个面
	//保护现场
	ms.pushMatrix();

	//绘制前小面
	ms.pushMatrix();
	ms.translate(0, 0, 0.25);
	cr.drawSelf(ms);
	ms.popMatrix();

	//绘制后小面
	ms.pushMatrix();
	ms.translate(0, 0, -0.25);
	ms.rotate(180, 0, 1, 0);
	cr.drawSelf(ms);
	ms.popMatrix();

	//绘制上大面
	ms.pushMatrix();
	ms.translate(0,0.25,0);
	ms.rotate(-90, 1, 0, 0);
	cr.drawSelf(ms);
	ms.popMatrix();

	//绘制下大面
	ms.pushMatrix();
	ms.translate(0,-0.25,0);
	ms.rotate(90, 1, 0, 0);
	cr.drawSelf(ms);
	ms.popMatrix();

	//绘制左大面
	ms.pushMatrix();
	ms.translate(0.25,0,0);
	ms.rotate(-90, 1, 0, 0);
	ms.rotate(90, 0, 1, 0);
	cr.drawSelf(ms);
	ms.popMatrix();

	//绘制右大面
	ms.pushMatrix();
	ms.translate(-0.25,0,0);
	ms.rotate(90, 1, 0, 0);
	ms.rotate(-90, 0, 1, 0);
	cr.drawSelf(ms);
	ms.popMatrix();

	//恢复现场
	ms.popMatrix();
}