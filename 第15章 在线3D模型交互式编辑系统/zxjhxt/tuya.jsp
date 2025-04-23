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
 <title>����༭</title>
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
		<input id="submit" type="submit" value="ȷ��">
	</form>
</div>
<div class="fa">
    <div class="top">
        <div id="color">
            ��ѡ�񻭱���ɫ��
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
            ��ѡ�񻭱ʵĿ�ȣ�
            <input type="button" value="ϸ" />
            <input type="button" value="��" class="grea"/>
            <input type="button" value="��" />
        </div>
        <div>
            <span id="error">����д�����ʹ����Ƥ����</span>
            <input id="eraser" style="width:60px;font-size:14px;"type="button" value="��Ƥ��" />
        </div>
  <input id="clear" type="button" value="���û���" style="width:80px;"/>

  <input id="imgurl" type="button" value="��������" style="width:80px;"/>
  <input id="goHistory"type="button"  value="����" style="width:80px;"onclick="javascript:history.go(-1)"/> 
    </div>
    <canvas id="canvas" width="512" height="512">�����������֧�� canvas ��ǩ</canvas>
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
            this.x=[];//��¼����ƶ��ǵ�X����
            this.y=[];//��¼����ƶ��ǵ�Y����
            this.clickDrag=[];
            this.lock=false;//����ƶ�ǰ���ж�����Ƿ���
            this.isEraser=false;
            //this.Timer=null;//��Ƥ��������ʱ��
            //this.radius=5;
            this.storageColor="#000000";
            this.eraserRadius=15;//�����뾶ֵ
            this.color=["#000000","#FF0000","#80FF00","#00FFFF","#808080","#FF8000","#408080","#8000FF","#CCCC00"];//������ɫֵ
            this.fontWeight=[2,5,8];
            this.$=function(id){return typeof id=="string"?document.getElementById(id):id;};
            this.canvas=this.$("canvas");
            if (this.canvas.getContext) {
			
				//��ȡ��Ӧ��CanvasRenderingContext2D����(����)
				var ctx = canvas.getContext("2d");
				//�����µ�ͼƬ����
				var img = new Image();
				//ָ������ͼƬ��URL
				img.src = '<%=texturePath%>';
				img.onload = function(){
					//canvas.width = img.width;//ͼƬ�Ŀ�ȸ�ֵ��canvas
					//canvas.height = img.height;//ͼƬ�ĸ߶ȸ�ֵ��canvas
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
                alert("�����������֧�� canvas ��ǩ");
                return;
            }
            this.cxt=this.canvas.getContext('2d');
			//console.log(this.canvas);
			
            this.cxt.lineJoin = "round";//context.lineJoin - ָ�������߶ε����ӷ�ʽ
            this.cxt.lineWidth = 5;//�����Ŀ��
            this.iptClear=this.$("clear");
            this.revocation=this.$("revocation");
            this.imgurl=this.$("imgurl");//ͼƬ·����ť
            this.w=this.canvas.width;//ȡ�����Ŀ�
            this.h=this.canvas.height;//ȡ�����ĸ�
            this.touch =("createTouch" in document);//�ж��Ƿ�Ϊ�ֳ��豸
            this.StartEvent = this.touch ? "touchstart" : "mousedown";//֧�ִ���ʽʹ����Ӧ���¼����
			this.MoveEvent = this.touch ? "touchmove" : "mousemove";
			this.EndEvent = this.touch ? "touchend" : "mouseup";
			this.bind();
        },
        bind:function()
        {
            var t=this;
            /*�������*/
            this.iptClear.onclick=function()
            {
                t.clear();
            };
            /*��갴���¼�����¼���λ�ã������ƣ�����lock����mousemove�¼�*/
            this.canvas['on'+t.StartEvent]=function(e)
            {   
                var touch=t.touch ? e.touches[0] : e;
                var _x=(1/xScale)*(touch.clientX - touch.target.offsetLeft);//����ڻ����ϵ�x���꣬�Ի������Ͻ�Ϊ���
                var _y=(1/yScale)*(touch.clientY - touch.target.offsetTop);//����ڻ����ϵ�y���꣬�Ի������Ͻ�Ϊ���             
                if(t.isEraser)
                {
               
                    t.resetEraser(_x,_y,touch);
                }else
                {
                    t.movePoint(_x,_y);//��¼���λ��
                    t.drawPoint();//����·��
                }
                t.lock=true;
            };
            /*����ƶ��¼�*/
            this.canvas['on'+t.MoveEvent]=function(e)
            {
                var touch=t.touch ? e.touches[0] : e;
                if(t.lock)//t.lockΪtrue��ִ��
                {

                    var _x=(1/xScale)*(touch.clientX - touch.target.offsetLeft);//����ڻ����ϵ�x���꣬�Ի������Ͻ�Ϊ���
                    var _y=(1/yScale)*(touch.clientY - touch.target.offsetTop);//����ڻ����ϵ�y���꣬�Ի������Ͻ�Ϊ���
                    if(t.isEraser)
                    {
                        //if(t.Timer)clearInterval(t.Timer);
                        //t.Timer=setInterval(function(){
                            t.resetEraser(_x,_y,touch);
                        //},10);
                    }
                    else
                    {
                        t.movePoint(_x,_y,true);//��¼���λ��
                        t.drawPoint();//����·��
                    }
                }
            };
            this.canvas['on'+t.EndEvent]=function(e)
            {
                /*��������*/
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
            /*��Ƥ��*/
            this.$("eraser").onclick=function(e)
         {
             t.isEraser=true;
                t.$("error").style.color="red";
                t.$("error").innerHTML="����ʹ����Ƥ����";
         };
        },
        movePoint:function(x,y,dragging)
        {   
            /*�����������ӵ����Զ�Ӧ��������*/
            this.x.push(x);
            this.y.push(y);
            this.clickDrag.push(y);
        },
        drawPoint:function(x,y,radius)
        {
            for(var i=0; i < this.x.length; i++)//ѭ������
            {   
                this.cxt.beginPath();//context.beginPath() , ׼������һ��·��
                
                if(this.clickDrag[i] && i){//�����϶�����i!=0ʱ������һ���㿪ʼ���ߡ�
                    this.cxt.moveTo(this.x[i-1], this.y[i-1]);//context.moveTo(x, y) , �¿�һ��·������ָ��·�������
                }else{
                    this.cxt.moveTo(this.x[i]-1, this.y[i]);
                }
                this.cxt.lineTo(this.x[i], this.y[i]);//context.lineTo(x, y) , ����ǰ����ָ���ĵ���һ����ֱ��·����������
                this.cxt.closePath();//context.closePath() , �����ǰ·���Ǵ򿪵���ر���
                this.cxt.stroke();//context.stroke() , ���Ƶ�ǰ·��
            }
        },
        clear:function()
        {
            //this.cxt.clearRect(0, 0, this.w, this.h);//������������Ͻ�Ϊ���//****************
			this.load();
        },
        redraw:function()
        {  
            /*����*/
            this.cxt.restore();  
            
        },  
        preventDefault:function(e){
            /*��ֹĬ��*/
            var touch=this.touch ? e.touches[0] : e;
      if(this.touch)touch.preventDefault();
      else window.event.returnValue = false;
     },
     changeColor:function()
     {
         /*Ϊ��ť����¼�*/
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
                 t.$("error").innerHTML="����д�����ʹ����Ƥ����";
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
                 t.$("error").innerHTML="����д�����ʹ����Ƥ����";
                 t.isEraser=false;
                 t.cxt.strokeStyle = t.storageColor;
             }
         }
     },
     changeBackground:function(num)
     {
         /*��ӻ��ʴ�ϸ����ʾ������ɫ�л�����ɫΪ��ǰ*/
         var fontIptNum=this.$("font").getElementsByTagName("input");
         for(var j=0,m=fontIptNum.length;j<m;j++)
            {
                fontIptNum[j].className="";
                if(j==num) fontIptNum[j].className="grea";
            }
     },
     getUrl:function()
     {
		//���öԻ��򷵻ص�ֵ ��true ���� false��  
        if (confirm("��֮ǰ�ϴ������������ǣ��Ƿ������")) {  
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
         
         /*ʹ����Ƥ��-����*/
         var t=this;
            //this.cxt.lineWidth = 30;
            /*source-over Ĭ��,�ཻ�����ɺ����ͼ�ε����(��ɫ,����,����)����,ȫ�������ͨ��*/
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