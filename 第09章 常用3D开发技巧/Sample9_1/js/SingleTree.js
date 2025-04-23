function SingleTree (x,z,yAngle,tg)
{
		tg=new TreeGroup();
		this.x=x;
		this.z=z;				//
		this.yAngle=yAngle;
		this.tg=tg;
	this.drawSelf=function(ms,texture)
	{
		ms.pushMatrix();		
		ms.translate(x, 0, z);
		ms.rotate(yAngle, 0, 1, 0);
		tfd.drawSelf(ms,texture);
		ms.popMatrix();
	}
	this.calculateBillboardDirection=function()
	{//根据摄像机位置计算树木面朝向
		var xspan=x-cx;
		var zspan=z-cz;
		
		if(zspan<=0)
		{
			yAngle=180/Math.PI *(Math.atan(xspan/zspan));	
		}
		else
		{
			yAngle=180+180/Math.PI *(Math.atan(xspan/zspan));
		}
	}
}