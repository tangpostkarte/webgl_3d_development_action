/**
 * @author kovacsv / http://kovacsv.hu/
 * @author mrdoob / http://mrdoob.com/
 */

THREE.STLExporter = function () {};

THREE.STLExporter.prototype = {

	constructor: THREE.STLExporter,

	parse: ( function () {

		var vector = new THREE.Vector3();
		var normalMatrixWorld = new THREE.Matrix3();
		
		function num2e(num){
			num = num.toExponential(6);
		
			var arrayNumber = num.split("e");
			
			//alert(arrayNumber[1]);//+1
			arrayNumber[1]=arrayNumber[1].replace('+','+00');
			arrayNumber[1]=arrayNumber[1].replace('-','-00');
			num = arrayNumber[0]+'e'+arrayNumber[1];
			
			return num;
		}

		return function parse( object ) {

			var output = '';

			output += 'solid exported\n';


				if ( object instanceof THREE.Mesh ) {

					var geometry = object.geometry;
					var matrixWorld = object.matrixWorld;

					if ( geometry instanceof THREE.Geometry ) {

						var vertices = geometry.vertices;
						var faces = geometry.faces;

						normalMatrixWorld.getNormalMatrix( matrixWorld );

						for ( var i = 0, l = faces.length; i < l; i ++ ) {

							var face = faces[ i ];

							vector.copy( face.normal ).applyMatrix3( normalMatrixWorld ).normalize();

							output += '  facet normal ' + num2e(vector.x) + ' ' + num2e(vector.y) + ' ' + num2e(vector.z) + '\n';
							output += '    outer loop\n';

							var indices = [ face.a, face.b, face.c ];

							for ( var j = 0; j < 3; j ++ ) {

								vector.copy( vertices[ indices[ j ] ] ).applyMatrix4( matrixWorld );

								output += '      vertex ' + num2e(vector.x) + ' ' + num2e(vector.y) + ' ' + num2e(vector.z) + '\n';

							}

							output += '    endloop\n';
							output += '  endfacet\n';

						}

					}

				}



			output += 'endsolid exported\n';

			return output;

		};

	}() )

};
