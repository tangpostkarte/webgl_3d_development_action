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
	* ����GET����
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
	* ��ӦPOST����
	*/
	protected void doPost(HttpServletRequest request, 
	                       HttpServletResponse response) 
	                       throws ServletException, IOException 
	{
		// ��������
		int count=0;
		String type ="0";//��ʾ�ϴ���ģ�ͻ��ǲ���  1����ģ�� 2������ʺ���ͼ
		SmartUpload mySmartUpload = new SmartUpload();
		String prefix=null;
		String dstPage=null;

		try 
		{
			// ��ʼ��
			mySmartUpload.initialize(this.getServletConfig(),request,response);
			// ����
			mySmartUpload.upload();
			
			//��ȡ�û���
			String uid=mySmartUpload.getRequest().getParameter("uid");
			//�ж��û�Ŀ¼�Ƿ����,�������򴴽�Ŀ¼
			java.io.File dir=new java.io.File("../webapps/zxjhxt/model/"+uid);
			System.out.println(dir.getAbsoluteFile().getAbsolutePath());
			if(!dir.exists())
			{
				dir.mkdir();
			}
			
			//��ȡ����
			String action=mySmartUpload.getRequest().getParameter("action");
			if(action.equals("uploadmodel"))
			{
				prefix="ģ��";
				dstPage="uploadModel.jsp";
				
				//��ȡģ�����ͱ��
				String modeltypeid=mySmartUpload.getRequest().getParameter("modeltypeid");
				
				com.jspsmart.upload.File f=mySmartUpload.getFiles().getFile(0);		
				prefix=prefix+f.getFileName();	
				int modelId=DBUtil.addModel(uid,f.getFileName(),Integer.parseInt(modeltypeid));
				dir=new java.io.File("../webapps/zxjhxt/model/"+uid+"/"+modelId);
				if(!dir.exists())
				{
					dir.mkdir();
				}			
				//���������ļ���ָ��Ŀ¼
				count = mySmartUpload.save("../webapps/zxjhxt/model/"+uid+"/"+modelId);
				type = "model";
				
			}
			else if(action.equals("uploadmaterial"))
			{
				prefix="����";
				dstPage="uploadModel.jsp";
				
				//��ȡģ�ͱ��
				String modelid=mySmartUpload.getRequest().getParameter("modelid");
				dir=new java.io.File("../webapps/zxjhxt/model/"+uid+"/"+modelid);
				if(!dir.exists())
				{
					dir.mkdir();
				}			
				
				com.jspsmart.upload.File f=mySmartUpload.getFiles().getFile(0);		
				prefix=prefix+f.getFileName();	
				
				DBUtil.addMaterial(Integer.parseInt(modelid),f.getFileName());
				
				//���������ļ���ָ��Ŀ¼
				count = mySmartUpload.save("../webapps/zxjhxt/model/"+uid+"/"+modelid);
				System.out.println("count="+count);		
				type = "mtl";				
			}
			request.setAttribute("type",type);
			if((count==2)||(count==1)){
				request.setAttribute("msg","�ļ��ϴ��ɹ���");
				forward(dstPage,request,response);
			}else{
				request.setAttribute("msg","�ļ��ϴ�ʧ�ܣ�");
				forward(dstPage,request,response);
			}
			
		} catch (Exception e)
		{
			request.setAttribute("msg",prefix+"�ļ��ϴ�ʧ�ܣ�");
		    forward(dstPage,request,response);
		}
    }
} 
