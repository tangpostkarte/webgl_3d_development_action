//���ص�����ɫ���ķ���
				function loadSingleShader(ctx, shaderScript)
				{
					if (shaderScript.type == "vertex")//��Ϊ������ɫ��
						var shaderType = ctx.VERTEX_SHADER;//������ɫ������
					else if (shaderScript.type == "fragment")//��ΪƬԪ��ɫ��
						var shaderType = ctx.FRAGMENT_SHADER;//ƬԪ��ɫ������
					else {//�����ӡ������Ϣ
						log("*** Error: shader script of undefined type '"+shaderScript.type+"'");
					return null;
					}

					//�������ʹ�����ɫ������
					var shader = ctx.createShader(shaderType);

					//������ɫ���ű�
					ctx.shaderSource(shader, shaderScript.text);

					//������ɫ��
					ctx.compileShader(shader);

					//������״̬
					var compiled = ctx.getShaderParameter(shader, ctx.COMPILE_STATUS);
					if (!compiled && !ctx.isContextLost()) {//���������
						var error = ctx.getShaderInfoLog(shader);//��ȡ������Ϣ
						log("*** Error compiling shader '"+shaderId+"':"+error);//��ӡ������Ϣ
						ctx.deleteShader(shader);//ɾ����ɫ������
						return null;//���ؿ�
					}
					return shader;//������ɫ������
				}

				//�������Ӷ��㡢ƬԪ��ɫ���ķ���
				function loadShaderSerial(gl, vshader, fshader)
				{
				    //���ض�����ɫ��
				    var vertexShader = loadSingleShader(gl, vshader);
				    //����ƬԪ��ɫ��
				    var fragmentShader = loadSingleShader(gl, fshader);

				    //������ɫ������
				    var program = gl.createProgram();

				    //��������ɫ����ƬԪ��ɫ���ҽӵ���ɫ������
				    gl.attachShader (program, vertexShader);//��������ɫ����ӵ���ɫ��������
				    gl.attachShader (program, fragmentShader);//��ƬԪ��ɫ����ӵ���ɫ��������

				    //������ɫ������
				    gl.linkProgram(program);

				    //��������Ƿ�ɹ�
				    var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
				    if (!linked && !gl.isContextLost())//�����Ӳ��ɹ�
				    {
				        //��ȡ���ڿ���̨��ӡ������Ϣ
				        var error = gl.getProgramInfoLog (program);//��ȡ������Ϣ
				        log("Error in program linking:"+error);//��ӡ������Ϣ

				        gl.deleteProgram(program);//ɾ����ɫ������
				        gl.deleteProgram(fragmentShader);//ɾ��ƬԪ��ɫ��
				        gl.deleteProgram(vertexShader);//ɾ��������ɫ��

				        return null;//���ؿ�
				    }
					gl.useProgram(program);
				    gl.enable(gl.DEPTH_TEST);
				    return program;//������ɫ������
				}

