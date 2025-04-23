package com.bn.zxjhxt;
import java.io.*;
import java.util.*;
import javax.servlet.*;
import javax.servlet.http.*;
import com.jspsmart.upload.*;

public class servletUpload extends HttpServlet 
{	
    public void forward(String path,HttpServletRequest req,HttpServletResponse resp) throws ServletException,IOException
    {
    	req.getRequestDispatcher("/"+path).forward(req,resp);
    }

	/**
	* 处理GET请求
	*/
	public void doGet(HttpServletRequest request, 
	                  HttpServletResponse response) 
	                  throws ServletException, IOException 
	{
		PrintWriter out = response.getWriter();
		out.println("<HTML>");
		out.println("<BODY BGCOLOR='white'>");
		out.println("<H1>jspSmartUpload : Servlet Sample</H1>");
		out.println("<HR><BR>");
		out.println("The method of the HTML form must be POST.");
		out.println("</BODY>");
		out.println("</HTML>");
	}
	
	/**
	* 响应POST请求
	*/
	protected void doPost(HttpServletRequest request, 
	                       HttpServletResponse response) 
	                       throws ServletException, IOException 
	{
		// 变量定义
		int count=0;
		String type ="0";//表示上传的模型还是材质  1代表模型 2代表材质和贴图
		SmartUpload mySmartUpload = new SmartUpload();
		String prefix=null;
		String dstPage=null;

		try 
		{
			// 初始化
			mySmartUpload.initialize(this.getServletConfig(),request,response);
			// 上载
			mySmartUpload.upload();
			
			//获取用户名
			String uid=mySmartUpload.getRequest().getParameter("uid");
			//判断用户目录是否存在,不存在则创建目录
			java.io.File dir=new java.io.File("../webapps/zxjhxt/model/"+uid);
			System.out.println(dir.getAbsoluteFile().getAbsolutePath());
			if(!dir.exists())
			{
				dir.mkdir();
			}
			
			//获取动作
			String action=mySmartUpload.getRequest().getParameter("action");
			if(action.equals("uploadmodel"))
			{
				prefix="模型";
				dstPage="uploadModel.jsp";
				
				//获取模型类型编号
				String modeltypeid=mySmartUpload.getRequest().getParameter("modeltypeid");
				
				com.jspsmart.upload.File f=mySmartUpload.getFiles().getFile(0);		
				prefix=prefix+f.getFileName();	
				int modelId=DBUtil.addModel(uid,f.getFileName(),Integer.parseInt(modeltypeid));
				dir=new java.io.File("../webapps/zxjhxt/model/"+uid+"/"+modelId);
				if(!dir.exists())
				{
					dir.mkdir();
				}			
				//保存上载文件到指定目录
				count = mySmartUpload.save("../webapps/zxjhxt/model/"+uid+"/"+modelId);
				type = "model";
				
			}
			else if(action.equals("uploadmaterial"))
			{
				prefix="材质";
				dstPage="uploadModel.jsp";
				
				//获取模型编号
				String modelid=mySmartUpload.getRequest().getParameter("modelid");
				dir=new java.io.File("../webapps/zxjhxt/model/"+uid+"/"+modelid);
				if(!dir.exists())
				{
					dir.mkdir();
				}			
				
				com.jspsmart.upload.File f=mySmartUpload.getFiles().getFile(0);		
				prefix=prefix+f.getFileName();	
				
				DBUtil.addMaterial(Integer.parseInt(modelid),f.getFileName());
				
				//保存上载文件到指定目录
				count = mySmartUpload.save("../webapps/zxjhxt/model/"+uid+"/"+modelid);
				System.out.println("count="+count);		
				type = "mtl";				
			}
			request.setAttribute("type",type);
			if((count==2)||(count==1)){
				request.setAttribute("msg","文件上传成功！");
				forward(dstPage,request,response);
			}else{
				request.setAttribute("msg","文件上传失败！");
				forward(dstPage,request,response);
			}
			
		} catch (Exception e)
		{
			request.setAttribute("msg",prefix+"文件上传失败！");
		    forward(dstPage,request,response);
		}
    }
} 
