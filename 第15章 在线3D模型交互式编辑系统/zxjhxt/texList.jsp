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


<% 
	String currUid=(String)session.getAttribute("login");
	if(currUid==null)
	{
	   request.setAttribute("msg","请首先登陆！");
       forward("login.jsp",request,response);
	}
%>

<html>
 <head>
   <title>在线交互系统--动作列表</title>
 </head>
 <body>
    <% 
	   String mid=request.getParameter("mid");
	   if(mid!=null&&mid.length()!=0)
	   {
		   	List<String> texList=DBUtil.getTextureOfSpecModel(Integer.parseInt(mid));
		   	StringBuilder sb=new StringBuilder();
			for(String s:texList)
			{
				sb.append(s);
				sb.append("|");	
			}
			out.println("<script language=\"JavaScript\">");
			out.println("alert(\""+sb.toString()+"\");");
			out.println("</script>");
			
			out.println(sb.toString());
	   }       
    %>
 
 </body>
</html>