<%@ page
 contentType="text/html;charset=gbk"
 import="com.bn.zxjhxt.DBUtil,java.util.*,java.io.*"
%>

<%! 
    public void forward(String path,HttpServletRequest req,HttpServletResponse resp) throws ServletException,IOException
    {
    	req.getRequestDispatcher("/"+path).forward(req,resp);    	
    }
 %>


<%  String local=(String)session.getAttribute("local");
	String loginPage = local+"3dbianji.jsp";

	String currUid=(String)session.getAttribute("login");System.out.println("currUid"+currUid);
	if(currUid==null)
	{
	   request.setAttribute("msg","�����ȵ�½��");System.out.println("�����ȵ�½��"+currUid);
       forward("login.jsp",request,response); 
	}
	else
	{
		String mid=request.getParameter("mid");
		String fname=request.getParameter("fname");
		String picData=request.getParameter("picData");
		if
		(
			mid!=null&&mid.length()!=0&&
			fname!=null&&fname.length()!=0&&
			picData!=null&&picData.length()!=0
		)
		{
			DBUtil.uploadPic(currUid,Integer.parseInt(mid),fname,picData);
			session.setAttribute("needUpdate","true");
			
		}
    } 
%>
<html>
<head>
<title>�ϴ�����</title>

<link href="css/uploadTex.css" rel="stylesheet" type="text/css"/>
</head>
<body>
	<div class="chuizhijuzhong">
		<div class="sk-fading-circle">
			<div class="sk-circle1 sk-circle"></div>
			<div class="sk-circle2 sk-circle"></div>
			<div class="sk-circle3 sk-circle"></div>
			<div class="sk-circle4 sk-circle"></div>
			<div class="sk-circle5 sk-circle"></div>
			<div class="sk-circle6 sk-circle"></div>
			<div class="sk-circle7 sk-circle"></div>
			<div class="sk-circle8 sk-circle"></div>
			<div class="sk-circle9 sk-circle"></div>
			<div class="sk-circle10 sk-circle"></div>
			<div class="sk-circle11 sk-circle"></div>
			<div class="sk-circle12 sk-circle"></div>
		</div>
		<div class="tishi">�ϴ������У��Ժ�ҳ�潫�Զ���ת��</div>
	</div>
	<div style="display:none"><a id='tiaozhuan' href="<%=loginPage%>">��ת</a></div>
	<script>
	function go3dbianji(){//��ת3Dģ�ͱ༭ҳ��ķ���
		setTimeout("document.getElementById('tiaozhuan').click()",5000);
		
		
	}
	window.onload = go3dbianji;
	</script>
</body>
</html>