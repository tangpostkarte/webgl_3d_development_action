//绕y轴旋转角度
var currentYAngle=0;
//绕x轴旋转角度
var currentXAngle=0;
//旋转角度步长值
var incAngle=0.5;
//上次触控点X,Y坐标
var lastClickX,lastClickY;
var ismoved=false;//是否移动标志位
function mouseListener() {
    //鼠标按下的监听
    document.onmousedown=function(event)
    {
        var x=event.clientX;
        var y=event.clientY;
        console.log(x+"|||"+y);
        //如果鼠标在<canvas>内开始移动
        var rect= (event.target||event.srcElement).getBoundingClientRect();
        if(rect.left<=x&&x<rect.right&&rect.top<=y&&y<rect.bottom)
        {
            ismoved=true;
            lastClickX=x;
            lastClickY=y;
        }
    };
    //鼠标抬起的监听
    document.onmouseup=function(event){ismoved=false;};
    //鼠标移动时的监听
    document.onmousemove = function(event)
    {
        var x=event.clientX,y=event.clientY;
        if(ismoved)
        {
            currentYAngle=currentYAngle+(x-lastClickX)*incAngle;
            currentXAngle=currentXAngle+(y-lastClickY)*incAngle;
        }
        lastClickX=x;
        lastClickY=y;
    };
}