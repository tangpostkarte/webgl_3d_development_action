
THREE.OBJExporter = function () {

};

THREE.OBJExporter.prototype = {

	constructor: THREE.OBJExporter,

	parse: function ( object ) {
		this.mtlname = mtlname;
		var output = '';				//导出结果

		var indexVertex = 0;			//初始化顶点坐标索引
		var indexVertexUvs = 0;			//初始化顶点纹理坐标索引
		var indexNormals = 0;			//初始化法向量索引

		var vertex = new THREE.Vector3();//用来存储顶点坐标
		var normal = new THREE.Vector3();//用来存储法向量
		var uv = new THREE.Vector2();	 //用来存储顶点纹理坐标

		var i, j, l, m, face = [];

		var parseMesh = function ( mesh ) {

			var nbVertex = 0;
			var nbNormals = 0;
			var nbVertexUvs = 0;

			var geometry = mesh.geometry;

			var normalMatrixWorld = new THREE.Matrix3();//新建一个3*3的矩阵

			if ( geometry instanceof THREE.Geometry ) {//如果网格对象中的几何对象属于Geometry类型

				geometry = new THREE.BufferGeometry().setFromObject( mesh );//将网格对象转换成BufferGeometry类型

			}

			if ( geometry instanceof THREE.BufferGeometry ) {//如果网格对象中的几何对象属于BufferGeometry类型

				// shortcuts
				var vertices = geometry.getAttribute( 'position' );//得到几何对象中的顶点坐标数据
				var normals = geometry.getAttribute( 'normal' );//得到几何对象中的法向量数据
				var uvs = geometry.getAttribute( 'uv' );//得到几何对象中的纹理坐标数据
				var indices = geometry.getIndex();//得到顶点索引数据

				// name of the mesh object
				//output += 'o ' + mesh.name + '\r\n';//输出3D物体的名称
				output += 'mtllib '+this.mtlname+'\r\n';
				// vertices

				if( vertices !== undefined ) {//如果顶点坐标数据不为空

					for ( i = 0, l = vertices.count; i < l; i ++, nbVertex++ ) {//遍历所有的顶点信息

						vertex.x = vertices.getX( i );//得到顶点的X坐标
						vertex.y = vertices.getY( i );//得到顶点的Y坐标
						vertex.z = vertices.getZ( i );//得到顶点的Z坐标

						vertex.applyMatrix4( mesh.matrixWorld );//计算每个顶点在世界坐标下的坐标

						output += 'v ' + vertex.x.toFixed(2) + ' ' + vertex.y.toFixed(2) + ' ' + vertex.z.toFixed(2) + '\r\n';//将此坐标输出到结果中
						
					}

				}

				// uvs

				if( uvs !== undefined ) {//如果顶点的纹理坐标不为空

					for ( i = 0, l = uvs.count; i < l; i ++, nbVertexUvs++ ) {//遍历所有的顶点纹理坐标

						uv.x = uvs.getX( i );//得到纹理坐标的第一个值
						uv.y = uvs.getY( i );//得到纹理坐标的第二个值

						output += 'vt ' + uv.x.toFixed(3) + ' ' + uv.y.toFixed(3) +'\r\n';//将此纹理坐标输出到结果中
					}
				}

				if( normals !== undefined ) {                                   //如果法向量坐标不为空

					normalMatrixWorld.getNormalMatrix( mesh.matrixWorld );		//？？？？？？？？？？？

					for ( i = 0, l = normals.count; i < l; i ++, nbNormals++ ) {

						normal.x = normals.getX( i );//得到法向量的X分量
						normal.y = normals.getY( i );//得到法向量的Y分量
						normal.z = normals.getZ( i );//得到法向量的Z分量

						normal.applyMatrix3( normalMatrixWorld );//???????????????????????????????????????????????????

						output += 'vn ' + normal.x.toFixed(2) + ' ' + normal.y.toFixed(2) + ' ' + normal.z.toFixed(2) + ' \r\n';//将数据整理到结果中

					}
				}
				// faces
				output +="g default \r\n";
				output +="usemtl "+mtlManage.getMtlName()+"\r\n";
				if( indices !== null ) {//如果顶点索引不为空

					for ( i = 0, l = indices.count; i < l; i += 3 ) {//遍历顶点索引

						for( m = 0; m < 3; m ++ ){

							j = indices.getX( i + m ) + 1;//遍历时得到顶点索引
							//将每一个三角形面片中的每个顶点的索引，纹理坐标索引和法向量索引输出到结果中
							face[ m ] = ( indexVertex + j ) + '/' + ( uvs ? ( indexVertexUvs + j ) : '' ) + '/' + ( indexNormals + j );
						
						}

						// transform the face to export format
						output += 'f ' + face.join( ' ' ) + "\r\n";//输出模型的面信息

					}

				} else {//如果顶点索引为空

					for ( i = 0, l = vertices.count; i < l; i += 3 ) {//遍历每个顶点坐标

						for( m = 0; m < 3; m ++ ){

							j = i + m + 1;
                            //将每一个三角形面片中的每个顶点的索引，纹理坐标索引和法向量索引输出到结果中
							face[ m ] = ( indexVertex + j ) + '/' + ( uvs ? ( indexVertexUvs + j ) : '' ) + '/' + ( indexNormals + j );

						}
						output += 'f ' + face.join( ' ' ) + "\r\n";//输出模型的面信息
					}

				}

			} else {

				console.warn( 'THREE.OBJExporter.parseMesh(): geometry type unsupported', geometry );//如果几何对象为geometry类型则弹出警告

			}

			// update index
			indexVertex += nbVertex;//更新顶点坐标索引
			indexVertexUvs += nbVertexUvs;//更新顶点纹理坐标索引
			indexNormals += nbNormals;//更新顶点法向量索引

		};

		var parseLine = function( line ) {//导出线模型的方法

			var nbVertex = 0;

			var geometry = line.geometry;//得到线模型的几何对象
			var type = line.type;//设置模型类型

			if ( geometry instanceof THREE.Geometry ) {//如果几何对象属于Geometry类型

				geometry = new THREE.BufferGeometry().setFromObject( line );//将其转换成BufferGeometry()类型

			}

			if ( geometry instanceof THREE.BufferGeometry ) {//如果几何对象属于BufferGeometry类型

				var vertices = geometry.getAttribute( 'position' );//得到线模型的顶点坐标
				var indices = geometry.getIndex();//得到模型的索引信息

				output += 'o ' + line.name + ' \r\n';//输出模型的名字

				if( vertices !== undefined ) {//如果顶点坐标不为空

					for ( i = 0, l = vertices.count; i < l; i ++, nbVertex++ ) {//遍历每一个顶点

						vertex.x = vertices.getX( i );//得到顶点的X坐标
						vertex.y = vertices.getY( i );//得到顶点的Y坐标
						vertex.z = vertices.getZ( i );//得到顶点的Z坐标

						vertex.applyMatrix4( line.matrixWorld );//将顶点变换到世界坐标系下

						output += 'v ' + vertex.x + ' ' + vertex.y + ' ' + vertex.z + '\r\n';//将顶点坐标添加到结果中

					}

				}

				if ( type === 'Line' ) {//如果模型类型为Line

					output += 'l ';// 用“l”表示线

					for ( j = 1, l = vertices.count; j <= l; j++ ) {//遍历线模型中的顶点坐标

						output += ( indexVertex + j ) + ' ';//输出到最终结果中

					}

					output += '\r\n';//在结果中加入换行符

				}

				if ( type === 'LineSegments' ) {//如果模型类型为LineSegments

					for ( j = 1, k = j + 1, l = vertices.count; j < l; j += 2, k = j + 1 ) {

						output += 'l ' + ( indexVertex + j ) + ' ' + ( indexVertex + k ) + '\r\n';

					}

				}

			} else {

				console.warn('THREE.OBJExporter.parseLine(): geometry type unsupported', geometry );//如果线模型为geometry类型则弹出警告

			}

			// update index
			indexVertex += nbVertex;//更新顶点坐标索引

		};

		object.traverse( function ( child ) {//遍历模型中的子对象

			if ( child instanceof THREE.Mesh ) {//如果子对象为Mesh类型

				parseMesh( child );//则执行parseMesh方法进行导出

			}

			if ( child instanceof THREE.Line ) {//如果子对象为Line类型

				parseLine( child );//则执行parseLine方法进行导出

			}

		} );

		return output;//返回最终导出结果

	}

};
