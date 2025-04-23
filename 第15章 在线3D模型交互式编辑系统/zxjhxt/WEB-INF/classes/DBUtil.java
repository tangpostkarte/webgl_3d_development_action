package com.bn.zxjhxt;

import java.util.*;
import java.sql.*;

public class DBUtil
{
	private static String sDBDriver = "org.gjt.mm.mysql.Driver";
	private static String sConnStr = "jdbc:mysql://localhost/zxjhxt?useUnicode=true&characterEncoding=UTF-8";
	
	public static Connection getConnection() throws Exception
	{
		Class.forName(sDBDriver);
		Connection con = DriverManager.getConnection(sConnStr); 
		return con;
	}
	
	//登录的方法
	public static boolean login(String uid,String pwd)
	{
		Connection con=null;
		Statement st=null;
		ResultSet rs=null;
		boolean result=false;
		try
		{
			con=getConnection();
			st=con.createStatement();
			String sql="select * from xtuser where uid='"+uid+"' and pwd='"+pwd+"'";
			rs=st.executeQuery(sql);
			if(rs.next())
			{
				result=true;
			}
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
		finally
		{
			try{rs.close();}catch(Exception e){e.printStackTrace();}
			try{st.close();}catch(Exception e){e.printStackTrace();}
			try{con.close();}catch(Exception e){e.printStackTrace();}
		}
		
		return result;
	}
	
	//返回模型类型编号及名称列表的方法
	public static List<String> getModelType()
	{
		Connection con=null;
		Statement st=null;
		ResultSet rs=null;
		List<String> result=new ArrayList<String>();
		try
		{
			con=getConnection();
			st=con.createStatement();
			String sql="select mtid,dis from modeltype";
			rs=st.executeQuery(sql);
			while(rs.next())
			{
				String mtid=rs.getString(1);
				String dis=rs.getString(2);
				result.add(mtid+"|"+dis);
			}
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
		finally
		{
			try{rs.close();}catch(Exception e){e.printStackTrace();}
			try{st.close();}catch(Exception e){e.printStackTrace();}
			try{con.close();}catch(Exception e){e.printStackTrace();}
		}
		
		return result;
	}
	
	//返回指定id用户的所有模型id及文件名列表的方法
	public static List<String> getModelsOfSpecUser(String uid)
	{
		Connection con=null;
		Statement st=null;
		ResultSet rs=null;
		List<String> result=new ArrayList<String>();
		try
		{
			con=getConnection();
			st=con.createStatement();
			String sql="select mid,filename from model where uid='"+uid+"'";
			rs=st.executeQuery(sql);
			while(rs.next())
			{
				String mid=rs.getString(1);
				String filename=rs.getString(2);
				result.add(mid+"|"+filename);
			}
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
		finally
		{
			try{rs.close();}catch(Exception e){e.printStackTrace();}
			try{st.close();}catch(Exception e){e.printStackTrace();}
			try{con.close();}catch(Exception e){e.printStackTrace();}
		}
		
		return result;		
	}
	
	//新增一个模型的方法
	public static Object modelLock=new Object();
	public static int addModel(String uid,String fname,int mtypeId)
	{
		int result=-1;
		synchronized(modelLock)
		{
			Connection con=null;
			Statement st=null;
			ResultSet rs=null;
			int currId=1;
			try
			{
				con=getConnection();
				st=con.createStatement();
				String sql="select max(mid) from model";
				rs=st.executeQuery(sql);
				if(rs.next())
				{
					currId=rs.getInt(1)+1;
				}
				sql="insert into model values("+currId+","+mtypeId+",'"+uid+"','"+fname+"')";
				int flag=st.executeUpdate(sql);
				if(flag==1)
				{
					result=currId;
				}				
			}
			catch(Exception e)
			{
				e.printStackTrace();
			}
			finally
			{
				try{rs.close();}catch(Exception e){e.printStackTrace();}
				try{st.close();}catch(Exception e){e.printStackTrace();}
				try{con.close();}catch(Exception e){e.printStackTrace();}
			}
		}
		return result;
	}
	
	//新增一个素材的方法
	public static Object materialLock=new Object();
	public static boolean addMaterial(int modelid,String fname)
	{
		boolean result=false;
		synchronized(materialLock)
		{
			Connection con=null;
			Statement st=null;
			ResultSet rs=null;
			int currId=1;
			try
			{
				con=getConnection();
				st=con.createStatement();
				String sql="select max(materialid) from material";
				rs=st.executeQuery(sql);
				if(rs.next())
				{
					currId=rs.getInt(1)+1;
				}
				sql="insert into material values("+currId+",'"+fname+"',"+modelid+")";
				int flag=st.executeUpdate(sql);
				if(flag==1)
				{
					result=true;
				}				
			}
			catch(Exception e)
			{
				e.printStackTrace();
			}
			finally
			{
				try{rs.close();}catch(Exception e){e.printStackTrace();}
				try{st.close();}catch(Exception e){e.printStackTrace();}
				try{con.close();}catch(Exception e){e.printStackTrace();}
			}
		}
		return result;
	}
	
	//获取指定编号模型素材的方法
	public static List<String> getMaterialOfSpecModel(int mid)
	{
		Connection con=null;
		Statement st=null;
		ResultSet rs=null;
		List<String> result=new ArrayList<String>();
		try
		{
			con=getConnection();
			st=con.createStatement();
			String sql="select materialid,filename from material where mid="+mid;
			rs=st.executeQuery(sql);
			while(rs.next())
			{
				String materialid=rs.getString(1);
				String filename=rs.getString(2);
				result.add(materialid+"|"+filename);
			}
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
		finally
		{
			try{rs.close();}catch(Exception e){e.printStackTrace();}
			try{st.close();}catch(Exception e){e.printStackTrace();}
			try{con.close();}catch(Exception e){e.printStackTrace();}
		}
		
		return result;		
	}
	
	//返回指定id的模型的操作列表
	public static List<String[]> getActionsOfModel(int mid)
	{
		Connection con=null;
		Statement st=null;
		ResultSet rs=null;
		List<String[]> result=new ArrayList<String[]>();
		try
		{
			con=getConnection();
			st=con.createStatement();
			String sql="select actionid,atdh,actiondata from action,actiontype where action.atid=actiontype.atid and mid="+mid+" order by actionid asc";
			rs=st.executeQuery(sql);
			while(rs.next())
			{
				String[] row=new String[3];
				row[0]=rs.getString(1);
				row[1]=rs.getString(2);
				row[2]=rs.getString(3);
				result.add(row);
			}
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
		finally
		{
			try{rs.close();}catch(Exception e){e.printStackTrace();}
			try{st.close();}catch(Exception e){e.printStackTrace();}
			try{con.close();}catch(Exception e){e.printStackTrace();}
		}
		
		return result;		
	}
	
	//更新模型的一系列动作，每次会清除原有的动作序列
	public static boolean refreshActionsOfModel(int mid,String dataList)
	{
		Connection con=null;
		Statement st=null;
		boolean result=false;
		try
		{
			con=getConnection();
			st=con.createStatement();
			
			st.execute("delete from action where mid="+mid);
			
			String[] sa=dataList.split("<#>");
			for(String s:sa)
			{
				String[] sat=s.split("\\|");
				String atdh=sat[0];
				String actionData=sat[1];
				String sql="insert into action (atid,mid,actiondata)values("+"(select atid from actiontype where atdh='"+atdh+"')"+","+mid+",'"+actionData+"')";
			    st.executeUpdate(sql);
				System.out.println(sql);
			}
			result=true;
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
		finally
		{
			try{st.close();}catch(Exception e){e.printStackTrace();}
			try{con.close();}catch(Exception e){e.printStackTrace();}
		}
		
		return result;		
	}
	
	//接收纹理图
	public static Object picLock=new Object();
	public static boolean uploadPic(String uid,int mid,String fname,String picData)
	{
		Connection con=null;
		Statement st=null;
		ResultSet rs=null;
		boolean result=false;
		try
		{
			con=getConnection();
			st=con.createStatement();
			
			//判断用户目录是否存在,不存在则创建目录
			java.io.File dir=new java.io.File("../webapps/zxjhxt/model/"+uid);
			System.out.println(dir.getAbsoluteFile().getAbsolutePath());
			if(!dir.exists())
			{
				dir.mkdir();
			}
			
			//判断模型目录是否存在,不存在则创建目录
			dir=new java.io.File("../webapps/zxjhxt/model/"+uid+"/"+mid);
			if(!dir.exists())
			{
				dir.mkdir();
			}			
			
			synchronized(picLock)
			{
				String sql="select max(textureid) from texture";
				rs=st.executeQuery(sql);
				int currId=1;
				if(rs.next())
				{
					currId=rs.getInt(1)+1;
				}
				
				sql="insert into texture values("+currId+",'"+fname+"',"+mid+")";
				System.out.println(sql);
				int c=st.executeUpdate(sql);
								
				boolean flag=BASE64Util.generateImage(picData,"../webapps/zxjhxt/model/"+uid+"/"+mid+"/"+fname);
				
				if(c==1&&flag)
				{
					result=true;
				}
			}
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
		finally
		{
			try{rs.close();}catch(Exception e){e.printStackTrace();}
			try{st.close();}catch(Exception e){e.printStackTrace();}
			try{con.close();}catch(Exception e){e.printStackTrace();}
		}
		
		return result;		
	}
	
	//查看指定模型的纹理图列表
	public static List<String> getTextureOfSpecModel(int mid)
	{
		Connection con=null;
		Statement st=null;
		ResultSet rs=null;
		List<String> result=new ArrayList<String>();
		try
		{
			con=getConnection();
			st=con.createStatement();
			String sql="select textureid,filename from texture where mid="+mid;
			rs=st.executeQuery(sql);
			while(rs.next())
			{
				String textureid=rs.getString(1);
				String filename=rs.getString(2);
				result.add(textureid+"|"+filename);
			}
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
		finally
		{
			try{rs.close();}catch(Exception e){e.printStackTrace();}
			try{st.close();}catch(Exception e){e.printStackTrace();}
			try{con.close();}catch(Exception e){e.printStackTrace();}
		}
		
		return result;		
	}
	
	public static void main(String args[])throws Exception
	{
		/*System.out.println(login("10001","123"));
		System.out.println("============================");
		List<String> mtl=getModelType();
		for(String s:mtl)
		{
			System.out.println(s);
		}
		
		System.out.println("============================");
		boolean flag=addModel("10002","Tree3.obj",1);
		System.out.println(flag);
		
		System.out.println("============================");
		List<String> mlou=getModelsOfSpecUser("10001");
		for(String s:mlou)
		{
			System.out.println(s);
		}
		
		System.out.println("============================");
		boolean flag=addMaterial(1,"aa.mtl");
		System.out.println(flag);
		*/
		
		/*List<String> materialList=getMaterialOfSpecModel(1);
		for(String s:materialList)
		{
			System.out.println(s);
		}*/
		
		/*List<String[]> actionList=getActionsOfModel(1);
		for(String[] sa:actionList)
		{
			for(String s:sa)
			{
				System.out.print(s+",");
			}	
			System.out.println();		
		}*/
		
		//String cmd="tr|1,2,3,4,5|<#>ro|2,5,6,<#>";		
		//refreshActionsOfModel(1,cmd);
		
		//String data="iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAIAAAD91JpzAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAABlJREFUeNpiZA2WNWW8xvB5h9Vnq2qAAAMAHEUFEHKIam8AAAAASUVORK5CYII=";
		//uploadPic("10001",1,"small.png",data);
		
		List<String> ll=getTextureOfSpecModel(1);
		for(String s:ll)
		{
			System.out.println(s);
		}
	}
}