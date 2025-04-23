package com.bn.zxjhxt;

import java.io.*;
import org.apache.commons.codec.binary.Base64;

public class BASE64Util
{
    //base64字符串转化成图片
	public static boolean generateImage(String imgStr,String path) 
	{ // 对字节数组字符串进行Base64解码并生成图片
		if (imgStr == null) // 图像数据为空
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