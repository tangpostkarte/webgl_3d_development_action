<%@ page
 contentType="text/html;charset=gbk"
 import="com.bn.zxjhxt.DBUtil,java.util.*,java.io.*"
%>

<html>
 <head>
   <title>在线3D模型交互式编辑系统--登陆</title>
    <style type="text/css">
	* {
  		margin: 0;
  		padding: 0;
  		border: 1;
  		text-decoration: none;
  		outline: none;
	}
	body,a {
  		font-family: calibri;
  		font-size: 14px;
  		font-weight: normal;
  		color: #3B424D;
	}
	.main-wrap {
 		background: #0566c7;
  		width: 100%;
  		height: 100%;
  		position: absolute;
	}
	.login-main {
  		width: 300px;
  		height: 100px;
  		position: absolute;
  		margin: auto;
  		top: 0;
  		bottom: 0;
  		left: 0;
  		right: 0;
  		background: #3c7fc3;/*登陆大框*/
  		padding: 10px;
 		-webkit-border-radius: 10px;
 		-moz-border-radius: 10px;
  		-ms-border-radius: 10px;
  		-o-border-radius: 10px;
  		border-radius: 10px;
	}
	.box1 {
  		background: #cdd9e5;/*输入框背景色*/
  		height: 40px;
  		text-indent: 10px;
  		width: 90%;
  		margin-bottom: 2px;
  		color: #3B424D;
  		font-size: 15px;
  		font-weight: 400;
	}
	.border1 {
  		-webkit-border-radius: 5px 5px 0 0;
  		-moz-border-radius: 5px 5px 0 0;
  		-ms-border-radius: 5px 5px 0 0;
  		-o-border-radius: 5px 5px 0 0;
  		border-radius: 5px 5px 0 0;
	}
	.border2 {
  		-webkit-border-radius: 0px 0 5px 5px;
  		-moz-border-radius: 0px 0 5px 5px;
  		-ms-border-radius: 0px 0 5px 5px;
  		-o-border-radius: 0px 0 5px 5px;
  		border-radius: 0px 0 5px 5px;
	}
	.send {
  		width: 60px;
  		height: 60px;
  		-webkit-border-radius: 50%;
  		-moz-border-radius: 50%;
  		-ms-border-radius: 50%;
  		-o-border-radius: 50%;
  		border-radius: 50%;
  		position: absolute;
  		right: 9px;
  		top: 20px;
  		border: 5px solid #0566c7;/*边框颜色*/
  		background: #3c7fc3;
  		font-size: 18px;
  		color: #fff;
  		font-weight: normal;
  		text-shadow: 1px 1px 2px #000;
  		box-sizing: border-box;
  		-webkit-box-sizing: border-box;
	}
	.send:hover {
 	 	animation: spin 0.3s ease-in-out;
  		-webkit-animation: spin 0.3s ease-in-out;
  		-moz-animation: spin 0.3s ease-in-out;
  		-ms-animation: spin 0.3s ease-in-out;
  		-o-animation: spin 0.3s ease-in-out;
  		cursor: pointer;
	}
	@keyframes spin {
  		from {
   			transform: rotate(0deg);
  		}
  		to {
    		transform: rotate(360deg);
  		}
	}
	@-webkit-keyframes spin {
  		from {
    		-webkit-transform: rotate(0deg);
  		}
  		to {
    		-webkit-transform: rotate(360deg);
  		}
	}
	@-moz-keyframes spin {
  		from {
    		-moz-transform: rotate(0deg);
  		}
  		to {
    		-moz-transform: rotate(360deg);
  		}
	}
	@-o-keyframes spin {
  		from {
    		-o-transform: rotate(0deg);
  		}
  		to {
    	-o-transform: rotate(360deg);
  		}
	}	
	
    </style>
 </head>
 <body>
 	<div class="main-wrap">
		<div class="login-main">
   	 		<form action="center.jsp" method="post">
     	        <input type="text" placeholder="用户名" name="uid" class="box1 border1"/><br/>
                <input type="password" placeholder="密码" name="pwd" class="box1 border2"/><br/>
           		<input type="hidden" name="action" value="login">
                <input type="submit" value="确定"class="send">
        	</form>
		</div>
	</div>
    <% 
       String msg=(String)request.getAttribute("msg");
       if(msg!=null)
       {
          out.print(msg);
       }
    %>
 </body>
</html>