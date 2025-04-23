<%@ page
 contentType="text/html;charset=gbk"
 import="com.bn.zxjhxt.DBUtil,java.util.*,java.io.*"
%>
<% 
   String texturePath = request.getParameter("texturePath");
   System.out.println("texturePath="+texturePath);
   String textureName = request.getParameter("textureName");
   System.out.println("textureName="+textureName);
   String mid = (String)session.getAttribute("mid");
   
%>
<!doctype html>
<html>
<head>
 <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
 <title>纹理编辑</title>
 <meta http-equiv="X-UA-Compatible" content="IE=7" />
 <meta name="keywords" content="" />
 <meta name="description" content="" />
 <style>
 *{margin:0;padding:0;}
 body{
	 background: #0566c7;
	 color: #d2f5e3;
 }
 div{margin:10px 0;}
 .fa{width:512px;margin:0 auto;}
 .top{margin:20px 0;}
 .top input{width:25px;height:25px;border:1px solid #fff;border-radius:4px;background:#ddd;}
 .top .i1{background:#000000;}
 .top .i2{background:#FF0000;}
 .top .i3{background:#80FF00;}
 .top .i4{background:#00FFFF;}
 .top .i5{background:#808080;}
 .top .i6{background:#FF8000;}
 .top .i7{background:#408080;}
 .top .i8{background:#8000FF;}
 .top .i9{background:#CCCC00;}
 #canvas{background:#eee;cursor:default;border:1px solid #fff;border-radius:4px;}
 .font input{font-size:14px;}
 .top .grea{background:#aaa;}
 </style>
</head>
<body>
<div style="display:none">
	<form action="http://localhost:8080/zxjhxt/uploadTex.jsp" method="post">
		<input type="hidden" id="mid" name="mid" /><br/>
		<input type="hidden" id="fname" name="fname" /><br/>
		<input type="hidden" id="picData" name="picData" /><br/>
		<input id="submit" type="submit" value="确定">
	</form>
</div>
<div class="fa">
    <div class="top">
        <div id="color">
            请选择画笔颜色：
            <input class="i1" type="button" value="" />
            <input class="i2" type="button" value="" />
            <input class="i3" type="button" value="" />
            <input class="i4" type="button" value="" />
            <input class="i5" type="button" value="" />
            <input class="i6" type="button" value="" />
            <input class="i7" type="button" value="" />
            <input class="i8" type="button" value="" />
            <input class="i9" type="button" value="" />
        </div>
        <div class="font" id="font">
            请选择画笔的宽度：
            <input type="button" value="细" />
            <input type="button" value="中" class="grea"/>
            <input type="button" value="粗" />
        </div>
        <div>
            <span id="error">如果有错误，请使用橡皮擦：</span>
            <input id="eraser" style="width:60px;font-size:14px;"type="button" value="橡皮擦" />
        </div>
  <input id="clear" type="button" value="重置画布" style="width:80px;"/>

  <input id="imgurl" type="button" value="保存纹理" style="width:80px;"/>
  <input id="goHistory"type="button"  value="返回" style="width:80px;"onclick="javascript:history.go(-1)"/> 
    </div>
    <canvas id="canvas" width="512" height="512">您的浏览器不支持 canvas 标签</canvas>
    <div id="div1"></div>
</div>
<div id="html">

</div>
<script>
(function(){
	var xScale,yScale;
	var isInit = false; 	
    var paint={
        init:function()
        {
            this.load();
            
        },
        load:function()
        {   
            this.x=[];//记录鼠标移动是的X坐标
            this.y=[];//记录鼠标移动是的Y坐标
            this.clickDrag=[];
            this.lock=false;//鼠标移动前，判断鼠标是否按下
            this.isEraser=false;
            //this.Timer=null;//橡皮擦启动计时器
            //this.radius=5;
            this.storageColor="#000000";
            this.eraserRadius=15;//擦除半径值
            this.color=["#000000","#FF0000","#80FF00","#00FFFF","#808080","#FF8000","#408080","#8000FF","#CCCC00"];//画笔颜色值
            this.fontWeight=[2,5,8];
            this.$=function(id){return typeof id=="string"?document.getElementById(id):id;};
            this.canvas=this.$("canvas");
            if (this.canvas.getContext) {
			
				//获取对应的CanvasRenderingContext2D对象(画笔)
				var ctx = canvas.getContext("2d");
				//创建新的图片对象
				var img = new Image();
				//指定纹理图片的URL
				img.src = '<%=texturePath%>';
				img.onload = function(){
					//canvas.width = img.width;//图片的宽度赋值给canvas
					//canvas.height = img.height;//图片的高度赋值给canvas
					//console.log(img.width);
					if(isInit==false){
					ctx.scale(512/img.width,512/img.height);
					xScale = 512/img.width ;
					yScale = 512/img.height;
					isInit = true;
					}
				//	console.log(512/img.height);
				//	console.log(xScale);
					ctx.drawImage(img, 0, 0, img.width,img.height);
				}
            } else {
                alert("您的浏览器不支持 canvas 标签");
                return;
            }
            this.cxt=this.canvas.getContext('2d');
			//console.log(this.canvas);
			
            this.cxt.lineJoin = "round";//context.lineJoin - 指定两条线段的连接方式
            this.cxt.lineWidth = 5;//线条的宽度
            this.iptClear=this.$("clear");
            this.revocation=this.$("revocation");
            this.imgurl=this.$("imgurl");//图片路径按钮
            this.w=this.canvas.width;//取画布的宽
            this.h=this.canvas.height;//取画布的高
            this.touch =("createTouch" in document);//判定是否为手持设备
            this.StartEvent = this.touch ? "touchstart" : "mousedown";//支持触摸式使用相应的事件替代
			this.MoveEvent = this.touch ? "touchmove" : "mousemove";
			this.EndEvent = this.touch ? "touchend" : "mouseup";
			this.bind();
        },
        bind:function()
        {
            var t=this;
            /*清除画布*/
            this.iptClear.onclick=function()
            {
                t.clear();
            };
            /*鼠标按下事件，记录鼠标位置，并绘制，解锁lock，打开mousemove事件*/
            this.canvas['on'+t.StartEvent]=function(e)
            {   
                var touch=t.touch ? e.touches[0] : e;
                var _x=(1/xScale)*(touch.clientX - touch.target.offsetLeft);//鼠标在画布上的x坐标，以画布左上角为起点
                var _y=(1/yScale)*(touch.clientY - touch.target.offsetTop);//鼠标在画布上的y坐标，以画布左上角为起点             
                if(t.isEraser)
                {
               
                    t.resetEraser(_x,_y,touch);
                }else
                {
                    t.movePoint(_x,_y);//记录鼠标位置
                    t.drawPoint();//绘制路线
                }
                t.lock=true;
            };
            /*鼠标移动事件*/
            this.canvas['on'+t.MoveEvent]=function(e)
            {
                var touch=t.touch ? e.touches[0] : e;
                if(t.lock)//t.lock为true则执行
                {

                    var _x=(1/xScale)*(touch.clientX - touch.target.offsetLeft);//鼠标在画布上的x坐标，以画布左上角为起点
                    var _y=(1/yScale)*(touch.clientY - touch.target.offsetTop);//鼠标在画布上的y坐标，以画布左上角为起点
                    if(t.isEraser)
                    {
                        //if(t.Timer)clearInterval(t.Timer);
                        //t.Timer=setInterval(function(){
                            t.resetEraser(_x,_y,touch);
                        //},10);
                    }
                    else
                    {
                        t.movePoint(_x,_y,true);//记录鼠标位置
                        t.drawPoint();//绘制路线
                    }
                }
            };
            this.canvas['on'+t.EndEvent]=function(e)
            {
                /*重置数据*/
                t.lock=false;
                t.x=[];
                t.y=[];
                t.clickDrag=[];
                clearInterval(t.Timer);
                t.Timer=null;
                
            };
            
            this.changeColor();
            this.imgurl.onclick=function()
            {
                t.getUrl();
            };
            /*橡皮擦*/
            this.$("eraser").onclick=function(e)
         {
             t.isEraser=true;
                t.$("error").style.color="red";
                t.$("error").innerHTML="您已使用橡皮擦！";
         };
        },
        movePoint:function(x,y,dragging)
        {   
            /*将鼠标坐标添加到各自对应的数组里*/
            this.x.push(x);
            this.y.push(y);
            this.clickDrag.push(y);
        },
        drawPoint:function(x,y,radius)
        {
            for(var i=0; i < this.x.length; i++)//循环数组
            {   
                this.cxt.beginPath();//context.beginPath() , 准备绘制一条路径
                
                if(this.clickDrag[i] && i){//当是拖动而且i!=0时，从上一个点开始画线。
                    this.cxt.moveTo(this.x[i-1], this.y[i-1]);//context.moveTo(x, y) , 新开一个路径，并指定路径的起点
                }else{
                    this.cxt.moveTo(this.x[i]-1, this.y[i]);
                }
                this.cxt.lineTo(this.x[i], this.y[i]);//context.lineTo(x, y) , 将当前点与指定的点用一条笔直的路径连接起来
                this.cxt.closePath();//context.closePath() , 如果当前路径是打开的则关闭它
                this.cxt.stroke();//context.stroke() , 绘制当前路径
            }
        },
        clear:function()
        {
            //this.cxt.clearRect(0, 0, this.w, this.h);//清除画布，左上角为起点//****************
			this.load();
        },
        redraw:function()
        {  
            /*撤销*/
            this.cxt.restore();  
            
        },  
        preventDefault:function(e){
            /*阻止默认*/
            var touch=this.touch ? e.touches[0] : e;
      if(this.touch)touch.preventDefault();
      else window.event.returnValue = false;
     },
     changeColor:function()
     {
         /*为按钮添加事件*/
         var t=this,iptNum=this.$("color").getElementsByTagName("input"),fontIptNum=this.$("font").getElementsByTagName("input");
         for(var i=0,l=iptNum.length;i<l;i++)
         {
             iptNum[i].index=i;
             iptNum[i].onclick=function()
             {
                 t.cxt.save();
                 t.cxt.strokeStyle = t.color[this.index];
                 t.storageColor=t.color[this.index];
                 t.$("error").style.color="#000";
                 t.$("error").innerHTML="如果有错误，请使用橡皮擦：";
                 t.cxt.strokeStyle = t.storageColor;
                 t.isEraser=false;
             }
         }
         for(var i=0,l=fontIptNum.length;i<l;i++)
         {
             t.cxt.save();
             fontIptNum[i].index=i;
             fontIptNum[i].onclick=function()
             {
                 t.changeBackground(this.index);
                 t.cxt.lineWidth = t.fontWeight[this.index];
                 t.$("error").style.color="#000";
                 t.$("error").innerHTML="如果有错误，请使用橡皮擦：";
                 t.isEraser=false;
                 t.cxt.strokeStyle = t.storageColor;
             }
         }
     },
     changeBackground:function(num)
     {
         /*添加画笔粗细的提示背景颜色切换，灰色为当前*/
         var fontIptNum=this.$("font").getElementsByTagName("input");
         for(var j=0,m=fontIptNum.length;j<m;j++)
            {
                fontIptNum[j].className="";
                if(j==num) fontIptNum[j].className="grea";
            }
     },
     getUrl:function()
     {
		//利用对话框返回的值 （true 或者 false）  
        if (confirm("您之前上传的纹理将被覆盖，是否继续？")) {  
           var imageAll = this.canvas.toDataURL("image/jpeg");
		   imageAll = imageAll.split(',');
		   imageData = imageAll[1];
		   console.log(imageData);
		   document.getElementById('picData').value = imageData;
		   document.getElementById('fname').value = '<%=textureName%>';
		   document.getElementById('mid').value = '<%=mid%>';
		   document.getElementById('submit').click();
        }  
    
      },
        resetEraser:function(_x,_y,touch)
     {   
         
         /*使用橡皮擦-提醒*/
         var t=this;
            //this.cxt.lineWidth = 30;
            /*source-over 默认,相交部分由后绘制图形的填充(颜色,渐变,纹理)覆盖,全部浏览器通过*/
            t.cxt.globalCompositeOperation = "destination-out";
            t.cxt.beginPath();
            t.cxt.arc(_x, _y, t.eraserRadius, 0, Math.PI * 2);
            t.cxt.strokeStyle = "rgba(250,250,250,0)";
            t.cxt.fill();
            t.cxt.globalCompositeOperation = "source-over"
     }
     
        
    };
    paint.init();
})();
</script>
</body>

</html>