//���ڻ�ȡ������ָ�����Ƶ�WebGL��չ
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

//����dxt5����Ŀ�Ⱥ͸߶ȼ������������ֽ����ĺ���
function textureLevelSizeS3tcDxt5(width, height) 
{
    return ((width + 3) >> 2) * ((height + 3) >> 2) * 16;
}

//���ݸ�����dds�ļ�url�Լ��������Ƽ���dxt5ѹ������
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

//����pkm�ļ����ݵķ���
function doLoadS3tcDxt5Texture(gl,req,texture,texName)
{
	var DDS_HEADER_LENGTH = 31;//dds�ļ�ͷ����
	var DDS_HEADER_HEIGHT = 3;//������ƫ����
    var DDS_HEADER_WIDTH = 4;//����߶�ƫ����
	var DDS_HEADER_SIZE = 1;//�ļ�ͷ����ƫ����
	var DDSD_MIPMAPCOUNT = 0x20000;//MIPMAP����������־����
	var DDS_HEADER_MIPMAPCOUNT = 7;//MIPMAP��������ƫ����
	var DDS_HEADER_FLAGS = 2;//dds�ļ�ͷ���ƫ����

    if (req.readyState == 4) 
    {
        var arrayBuffer = req.response;		        
        if (arrayBuffer) 
        {			
		    //��ȡ������WEBGL_compressed_texture_s3tc��չ����֧��s3tc���͵�ѹ������
			var ext = getExtension(gl, "WEBGL_compressed_texture_s3tc");	        
			//��ȡdds�ļ����ļ�ͷ����32������������
			var header = new Int32Array(arrayBuffer, 0, DDS_HEADER_LENGTH);
			//��ȡ������
			var width = header[DDS_HEADER_WIDTH];
			//��ȡ����߶�
			var height = header[DDS_HEADER_HEIGHT];
			//���������θ�������
			var levels = 1;
			if(header[DDS_HEADER_FLAGS] & DDSD_MIPMAPCOUNT) 
			{
			  //�����ʵ�ʵ�MipMap����������
			  levels = Math.max(1, header[DDS_HEADER_MIPMAPCOUNT]);
			}
			//�������ݵ���ʼƫ����
			var dataOffset = header[DDS_HEADER_SIZE] + 4;
			//��ȡ��������
			var dxtData = new Uint8Array(arrayBuffer, dataOffset);
			//������
			gl.bindTexture(gl.TEXTURE_2D, texture);
			//����ÿ������������ֽ�ƫ����
			var offset = 0;
			//��ÿ��mipmap��������ѭ��
			for (var i = 0; i < levels; ++i) 
			{
				//���㱾������������ֽ���
				var levelSize = textureLevelSizeS3tcDxt5(width, height);
				//��ȡ��������������ֽ�����
				var dxtLevel = new Uint8Array(dxtData.buffer, dxtData.byteOffset+offset, levelSize);
				//���������ݼ��ؽ��Դ�
				gl.compressedTexImage2D(gl.TEXTURE_2D, i, ext.COMPRESSED_RGBA_S3TC_DXT5_EXT, width, height, 0, dxtLevel);
				//������һ������Ŀ��
				width = width >> 1;
				//������һ������ĸ߶�
				height = height >> 1;
				//������һ������������ֽ�ƫ����
				offset += levelSize;
			}
			//���������MIN�Լ�MAG������ʽ
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
			//������������򼰺������췽ʽ
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
			//������ض�����
			gl.bindTexture(gl.TEXTURE_2D, null);
        }
    }
}






