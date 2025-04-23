
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
	   request.setAttribute("msg","�����ȵ�½��");
       forward("login.jsp",request,response);
	}
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=GBK" />
<title>����3Dģ�ͽ���ʽ�༭ϵͳ</title>
<link rel="stylesheet" type="text/css" href="css/reset.css" />
<link rel="stylesheet" type="text/css" href="css/3DModel.css" />
<script type="text/javascript" src="js/jquery-1.8.3.min.js"></script>
<script type="text/javascript" src="js/jquery.uploadify.js"></script>
<script>
	var isSelectMtl = false;
	var isSelectTex = false;
	function changeInput(val)
	{
		
		if(sa[val]==undefined){
			document.getElementById('wenli').style.display='block';
			document.getElementById('submitButton').style.position='relative';
			document.getElementById('submitButton').style.bottom='55px';
		}
		
		var typeName = sa[val].split(".")[1];
		
		if(typeName=="stl")
		{
			document.getElementById('wenli').style.display='none';
			document.getElementById('submitButton').style.position = "static";
			document.getElementById('submitButton').style.bottom='0px';
		}else if (typeName=="obj")
		{
			document.getElementById('wenli').style.display='block';
			document.getElementById('submitButton').style.position='relative';
			document.getElementById('submitButton').style.bottom='55px';
		}
	}
	function checkSubmit(){
		var index = document.getElementById('modelSelect').value;
		
		var type = sa[index].split(".")[1];
		if (type=="obj")
		{
			if(isSelectMtl==false)
			{
				alert("��ѡ������ļ�");
				return false;
			}else if(isSelectTex == false)
			{
				alert("��ѡ��������ͼ");
				return false;
			}
		}
		return true;
		
	}
	function checkModel(){
		var upModel= document.getElementById('wbb1029fileupload-1').value;
		if(upModel=="")
		{
			alert("��ѡ��ģ���ļ�");
			return false;
		}
		return true;

		
	}
	function changeName(){
		
	}
	function init(){
		//document.getElementById('left').style.height=document.getElementById('right').style.height;
		changeInput(1);
		
		var leftArea = document.querySelector('.wbb10293Dmodel-Left');
		var rigthArea = document.querySelector('.wbb10293Dmodel-right');
		var height = rigthArea.offsetHeight;
		leftArea.style.height = height+'px';
		leftArea.style.background=" #2c3840 none repeat scroll 0 0";

	}
	
   </script>
</head>

<body>
<div style="overflow:hidden;height:100%">
<div class="wbb10293Dmodel-Left fl" >
	<div class="wbb3Dxitong">
    	<span style="color:#fff;font-size:24px;">����3Dģ�ͽ���ʽ�༭ϵͳ</span>
    </div>
    <div class="wbb1029Userprofile">
    	<ul style="font-size:18px;width:50%;margin:0 auto;overflow:hidden;">
            <li class="fl" style="margin:32px 20px 0 0;">
            	<a href="javascript:;" class="userprofileImg"><img src="images/sheji.png" /></a>
            </li>
            <li class="fl"><span>�û�<%=currUid%></span></li>
        </ul>
        <div class="clear"></div>
    </div>
    <div class="wbb1029xitongguanli" >
    	<ul>
        	<li class="wbb1029libg1c282c">ϵͳ����</li>
            <li><img src="images/wbb102901.png"/>&nbsp;&nbsp;&nbsp;3D���ܱ༭</li>
        </ul>
    </div>
</div>
<div class="wbb10293Dmodel-right fl">
	<div class="wbb10293Dmodel-right-top">
    </div>
    <div class="wbb1029Welcomehome">
    	<ul>
		<%
			String local=(String)session.getAttribute("local");
			String loginPage = local+"login.jsp";
		%>
        	<li class="fl"><a href="<%=loginPage%>"><img src="images/wbb102902.png" /></a></li>
            <li class="fl"><a href="javascript:;" class="welcomehomeA">��ӭ��ҳ</a></li>
        </ul>
        <div class="clear"></div>
    </div>
    <div class="wbb1029Bge5e5e5" id='right'>
    	<ul class="wbb1029Bge5e5e5Ul">
        	<form action="servletUpload"  method="post"  enctype="multipart/form-data" onsubmit="return checkModel()">
				<input type="hidden" name="action" value="uploadmodel"/>
      			<input type="hidden" name="uid" value="<%=currUid%>"/>
        	<li class="fl wbb1028Uploadmodel"> 
            	<div style="background:#8474a4;" class="wbb10298474a4">
                	�ϴ�ģ�� 
					<div style="text-align:right;display:inline;float:right;margin-right:150px;">
					<% 
						String fType=(String)request.getAttribute("type");
						
						if((fType!=null)&&(fType.equals("model")))
						{
							String msg=(String)request.getAttribute("msg");
							if(msg!=null)
							{
								out.print(msg);
							}
							request.setAttribute("type","");
						}
					%>
					</div>
                </div>
                <div style="margin-top:5px;background:#8474a4;" class="wbb1028Uploadmodelfile">
                    <ul style="padding-top:30px;">
                        <li class="fl colorFff" style="line-height:35px;text-align:center;">ģ������</li>
                        <li class="fl">
                            <select class="selectObj" name="modeltypeid">
                            <% 
								List<String> sl= DBUtil.getModelType();//����ģ������б�
								List<String> modelOfUser= DBUtil.getModelsOfSpecUser(currUid);//��ȡ���û����е�ģ��id��ģ������
								//out.print("���ϴ�����ģ����---");
								List<String> modelIdArray = new ArrayList<String>();//�������ģ��id���б�
								List<String> modelFileArray = new ArrayList<String>();//�������ģ�����Ƶ��б�
								List<String> ms=DBUtil.getModelsOfSpecUser(currUid);
			
								for(String s:sl)
								{
									String[] sa=s.split("\\|");            
							%>
									<option value="<%=sa[0]%>"><%=sa[1]%></option>
							<%
								}
							%>
                            </select>
                        </li>
                        <div class="clear"></div>
                    </ul>
                    <ul style="margin:20px 0;">
                        <li class="fl colorFff" style="line-height:35px;text-align:center;">ģ���ļ�</li>
                        <li class="fl">
                           <div class="pass-portrait-openimg-1029-1">
                                <input id="openImgBtn1" class="pass-portrait-filebtn-1029-1" name="openImgBtn" value="ѡ���ϴ�" type="button"  >
                                <input id="wbb1029fileupload-1" class="pass-portrait-file-1029-1" name="wbb1029fileupload-1" type="file" onchange="document.getElementById('openImgBtn1').value=this.value">
                            </div>
                        </li>
                        <div class="clear"></div>
                    </ul>
					
                    <div id="file-name-a-1" class="file-name-1025"></div>
                    <div style="text-align:center;padding:30px 0;">
                    	<input type="submit" value="ȷ��" class="wbb1029Determine" />
						</form>
                    </div>
                </div>
            </li>
            <li class="fl" style="margin-left:4%;">
            	<div style="background:#f09400;" class="wbb10298474a4">
                	�ϴ�����
					<div style="text-align:right;display:inline;float:right;margin-right:150px;">
					<%
						if((fType!=null)&&(fType.equals("mtl")))
						{
							String msg=(String)request.getAttribute("msg");
							if(msg!=null)
							{
								out.print(msg);
							}
							request.setAttribute("type","");
						}
					
					%></div>
                </div>
                <div style="margin-top:5px;background:#f09400;height:250px;" class="wbb1028Uploadmodelfile">
                	<ul style="padding-top:30px;">
                        <li class="fl colorFff" style="line-height:35px;text-align:center;">��Ӧģ��</li>
                        <li class="fl">
						<form 
						action="servletUpload"
						method="post"
						enctype="multipart/form-data"
						onsubmit="return checkSubmit()">
                            <select id="modelSelect"class="selectObj" name="modelid" onchange="changeInput(this.value)">
								<script>
									  sa=[];
								</script>
								<% 
									
									for(String s:ms)
									{
										String[] sa=s.split("\\|");  
										out.println("alert(\""+sa[0]+"\");");
										
								%>
									<option value="<%=sa[0]%>"><%=sa[1]%></option>
									<script>
									  sa["<%=sa[0]%>"] = "<%=sa[1]%>";
									</script>
								<%
									}
								%>
                            </select>
                        </li>
                        <div class="clear"></div>
                    </ul>
                    <ul style="margin:20px 0;">
					<input type="hidden" name="action" value="uploadmaterial"/>
					<input type="hidden" name="uid" value="<%=currUid%>"/>
                        <li class="fl colorFff" style="line-height:35px;text-align:center;">�����ļ�</li>
                        <li class="fl">
                           <div class="pass-portrait-openimg-1029-1">
                                <input id="openImgBtn2" class="pass-portrait-filebtn-1029-1" name="openImgBtn" value="ѡ���ϴ�" type="button">
                                <input id="wbb1029fileupload-2" class="pass-portrait-file-1029-1" name="modelfile" type="file" onchange="document.getElementById('openImgBtn2').value=this.value;isSelectMtl=true;">
                            </div>
                        </li>
                        <div class="clear"></div>
                    </ul>
					 <ul style="margin:20px 0;" id="wenli">
                        <li class="fl colorFff" style="line-height:35px;text-align:center;">������ͼ</li>
                        <li class="fl">
                           <div class="pass-portrait-openimg-1029-1">
                                <input id="openImgBtn3" class="pass-portrait-filebtn-1029-1" name="openImgBtn" value="ѡ���ϴ�" type="button">
                                <input id="textureInput" class="pass-portrait-file-1029-1" name="texturefile" type="file" onchange="document.getElementById('openImgBtn3').value=this.value;isSelectTex=true;">
                            </div>
                        </li>
                        <div class="clear"></div>
                    </ul>
					
                    <div id="file-name-a-2" class="file-name-1025"></div>
                    <div style="text-align:center;padding:30px 0;">
                    	<input id="submitButton" type="submit" value="ȷ��" class="wbb1029Determine" />
                    </div>
                </div>
            </li>
            </form>
			
        </ul>
        <div class="clear"></div>
        <div style="margin:35px 0;font-size:18px;color:#787878;margin-left:20px;">
        	<img src="images/wbb102905.png" /> &nbsp;&nbsp;&nbsp;ģ�����
        </div>
        <div style="background:#fff;width:92%">
        	<table width="100%" border="0">
              <tr class="wbb1029Tabletr1">
                <th>���</th>
                <th>ģ������</th>
                <th>��������</th>
                <th>����༭</th>
              </tr>
			  <% 
       			
	   			//-----------------------�������û���ӵ�е�ģ��--------------------------
	   			for(int i=0;i<modelOfUser.size();i++)
	   			{
		   			String[] sa = modelOfUser.get(i).split("\\|");
		   			modelIdArray.add(sa[0]);						//����ģ�͵�id����modelIdArray
		   			modelFileArray.add(sa[1]);					//����ģ�͵��ļ�������modelFileArray
					out.print("<tr>");
					out.print("<td>"+(i+1)+"</td>");
		   			out.print("<td>"+modelFileArray.get(i)+"</td>");
		   			String parentPath = "model/"+currUid+"/"+modelIdArray.get(i)+"/";//ģ������Ŀ¼
		   			String objPath = parentPath + modelFileArray.get(i);             //ָ��obj�ļ���·��
					String mid = sa[0];
		   			List<String> materialList = DBUtil.getMaterialOfSpecModel(Integer.parseInt(modelIdArray.get(i)));										//��ѯ��ģ��ӵ�е����в���


		   	%>
             			<form action="3dbianji.jsp" method = "post">
						<input type="hidden" name="parentPath" value="<%=parentPath%>">
						<input type="hidden" name="modelName" value="<%=modelFileArray.get(i)%>">
						<input type="hidden" name="mid" value="<%=mid%>">
						<input type="hidden" name="fromPlace" id="fromPlace" value="upModelPage">
						<td><div class="styled-select"><select name="mtlName">
						<%
						for(int j=0;j<materialList.size();j++)
						{
							String[] mt = materialList.get(j).split("\\|");
						%>
							<option value="<%=mt[1]%>"><%=mt[1]%></option>
						<%
						}
						%>
						</select></div></td>
						<td><input type="submit" class="btn" value="�༭"></td>
		    		</form>
					
			<%

					out.print("</tr>");
	   			}
			%>
            </table>
        </div>
    </div>
</div>
<div class="clear"></div>

</div>
<script>
	window.onload =init();
</script>
</body>
</html>
