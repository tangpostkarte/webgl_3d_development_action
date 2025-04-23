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
   String local = "http://localhost:8080/zxjhxt/";
   String action=request.getParameter("action");
   System.out.println("action="+action);

   if(action.equals("login"))
   {
       String uid=request.getParameter("uid");
       String pwd=request.getParameter("pwd");
       
       if(uid!=null&&uid.length()!=0&&pwd!=null&&pwd.length()!=0)
       {
       		boolean flag=DBUtil.login(uid,pwd);
       		if(flag)
       		{
       			session.setAttribute("login",uid);
				
				session.setAttribute("local",local);
       			forward("uploadModel.jsp",request,response);
       		}
       		else
       		{
       			request.setAttribute("msg","请输入正确的用户名和密码！");
           		forward("login.jsp",request,response);
       		}
       }
       else
       {
           request.setAttribute("msg","请输入用户名和密码！");
           forward("login.jsp",request,response);
       }
   }

%>