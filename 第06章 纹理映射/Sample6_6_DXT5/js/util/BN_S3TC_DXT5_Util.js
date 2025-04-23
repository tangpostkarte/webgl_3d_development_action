//用于获取并加载指定名称的WebGL扩展
function getExtension(gl, name) 
{
    var vendorPrefixes = ["", "WEBKIT_", "MOZ_"];
    var ext = null;
    for (var i in vendorPrefixes) {
      ext = gl.getExtension(vendorPrefixes[i] + name);
      if (ext) { break; }
    }
    return ext;
}

//根据dxt5纹理的宽度和高度计算纹理数据字节数的函数
function textureLevelSizeS3tcDxt5(width, height) 
{
    return ((width + 3) >> 2) * ((height + 3) >> 2) * 16;
}

//根据给定的dds文件url以及纹理名称加载dxt5压缩纹理
function loadS3tcDxt5Texture(gl,url,texName)
{
    var texture = gl.createTexture();
	var req = new XMLHttpRequest();
    req.onreadystatechange = function () { doLoadS3tcDxt5Texture(gl,req,texture,texName)};
    req.open("GET", url, true);
    req.responseType = "arraybuffer";
    req.send(null);	
	texMap[texName]=texture;
}

//处理pkm文件数据的方法
function doLoadS3tcDxt5Texture(gl,req,texture,texName)
{
	var DDS_HEADER_LENGTH = 31;//dds文件头长度
	var DDS_HEADER_HEIGHT = 3;//纹理宽度偏移量
    var DDS_HEADER_WIDTH = 4;//纹理高度偏移量
	var DDS_HEADER_SIZE = 1;//文件头长度偏移量
	var DDSD_MIPMAPCOUNT = 0x20000;//MIPMAP纹理数量标志掩码
	var DDS_HEADER_MIPMAPCOUNT = 7;//MIPMAP纹理数量偏移量
	var DDS_HEADER_FLAGS = 2;//dds文件头标记偏移量

    if (req.readyState == 4) 
    {
        var arrayBuffer = req.response;		        
        if (arrayBuffer) 
        {			
		    //获取并加载WEBGL_compressed_texture_s3tc扩展，以支持s3tc类型的压缩纹理
			var ext = getExtension(gl, "WEBGL_compressed_texture_s3tc");	        
			//获取dds文件的文件头进入32比特整型数组
			var header = new Int32Array(arrayBuffer, 0, DDS_HEADER_LENGTH);
			//获取纹理宽度
			var width = header[DDS_HEADER_WIDTH];
			//获取纹理高度
			var height = header[DDS_HEADER_HEIGHT];
			//声明纹理层次辅助变量
			var levels = 1;
			if(header[DDS_HEADER_FLAGS] & DDSD_MIPMAPCOUNT) 
			{
			  //计算出实际的MipMap纹理层次数量
			  levels = Math.max(1, header[DDS_HEADER_MIPMAPCOUNT]);
			}
			//纹理数据的起始偏移量
			var dataOffset = header[DDS_HEADER_SIZE] + 4;
			//获取纹理数据
			var dxtData = new Uint8Array(arrayBuffer, dataOffset);
			//绑定纹理
			gl.bindTexture(gl.TEXTURE_2D, texture);
			//声明每层纹理的数据字节偏移量
			var offset = 0;
			//对每个mipmap纹理层进行循环
			for (var i = 0; i < levels; ++i) 
			{
				//计算本层纹理的数据字节数
				var levelSize = textureLevelSizeS3tcDxt5(width, height);
				//获取本层纹理的数据字节序列
				var dxtLevel = new Uint8Array(dxtData.buffer, dxtData.byteOffset+offset, levelSize);
				//将纹理数据加载进显存
				gl.compressedTexImage2D(gl.TEXTURE_2D, i, ext.COMPRESSED_RGBA_S3TC_DXT5_EXT, width, height, 0, dxtLevel);
				//计算下一层纹理的宽度
				width = width >> 1;
				//计算下一层纹理的高度
				height = height >> 1;
				//计算新一层纹理的数据字节偏移量
				offset += levelSize;
			}
			//设置纹理的MIN以及MAG采样方式
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
			//设置纹理的纵向及横向拉伸方式
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
			//解除绑定特定纹理
			gl.bindTexture(gl.TEXTURE_2D, null);
        }
    }
}






