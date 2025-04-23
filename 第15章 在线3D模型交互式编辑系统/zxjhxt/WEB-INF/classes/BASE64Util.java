package com.bn.zxjhxt;

import java.io.*;
import org.apache.commons.codec.binary.Base64;

public class BASE64Util
{
    //base64�ַ���ת����ͼƬ
	public static boolean generateImage(String imgStr,String path) 
	{ // ���ֽ������ַ�������Base64���벢����ͼƬ
		if (imgStr == null) // ͼ������Ϊ��
		return false;
	    
		byte[] data=Base64.decodeBase64(imgStr);
		
		try 
		{
			FileOutputStream fout=new FileOutputStream(path);
			fout.write(data);
			fout.close();
		} 
		catch (Exception e) 
		{
			e.printStackTrace();
			return false;
		}
		
		return true;
	}
}