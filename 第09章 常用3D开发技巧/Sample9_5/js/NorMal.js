//向量类
function Normal(nx,ny,nz) {

    this.nx = nx;
    this.ny = ny;
    this.nz = nz;

    this.compareNormal = function (normal) {
        var DIFF = 0.000001;
        if ((this.nx - normal.nx < DIFF) && (this.ny - normal.ny < DIFF) && (this.nz - normal.nz < DIFF)) {
            return false;
        } else {
            return true;
        }
    }
}
//法向量管理类
function SetOfNormal()
{
    this.array=new Array();
    this.add=function(index,normal) {
        if(this.array[index]==null) {
            this.array[index]= new Array();
            this.array[index].push(normal);
        }else{
            var flag=true;
            for(var j=0;j<this.array[index].length;j++) {
                if(this.array[index][j].compareNormal(normal)==false) {
                    flag=false;
                }
            }
            if(flag==true){
                this.array[index].push(normal);
            }
        }
    }
}
//向量规格化
function vectorNormal (vector) {
    var len=Math.sqrt(vector[0]*vector[0]+vector[1]*vector[1]+vector[2]*vector[2]);
    return [vector[0]/len,vector[1]/len,vector[2]/len];
}
//求两个向量的叉积
function getCrossProduct (vector_1,vector_2){
    return[
        vector_1[1]*vector_2[2]-vector_1[2]*vector_2[1],
        vector_1[2]*vector_2[0]-vector_1[0]*vector_2[2],
        vector_1[0]*vector_2[1]-vector_1[1]*vector_2[0]
    ];
}

//求法向量平均值的工具方法
function getAverage(normalSet) {
    var result = new Array(0,0,0);
    normalSet.forEach(function (normal) {
        result[0]+=normal.nx;
        result[1]+=normal.ny;
        result[2]+=normal.nz;
    })
    return vectorNormal(result);
}

//根据灰度图高度数组进行计算顶点法向量
function caleNormalVector( yArray) {
    //存放山地顶点位置的三维数组
    var verticess = new Array( yArray.length);
    for(var i = 0; i < yArray.length; i++){
        verticess[i] = new Array(yArray[0].length);
        for(var j = 0; j <yArray[0].length; j++){
            verticess[i][j] = new Array(3);
        }}
    //存放山地顶点法向量的三维数组
    var normals = new Array(yArray.length);
    for(var i = 0; i < yArray.length; i++){
        normals[i] = new Array(yArray[0].length);
        for(var j = 0; j <yArray[0].length; j++){
            normals[i][j] = new Array(3);
        }}
    //对高度数组进行遍历,计算顶点位置坐标
    for(var i=0;i<yArray.length;i++) {
        for(var j=0;j<yArray[0].length;j++){
            //计算当前格子左上侧点坐标
            var zsx=-1*yArray.length/2+i*1;
            var zsz=-1*yArray[0].length/2+j*1;

            verticess[i][j][0]=zsx; 			//顶点的X坐标
            verticess[i][j][1]=yArray[i][j];	//顶点的Y坐标
            verticess[i][j][2]=zsz; 			//顶点的Z坐标
        }
    }
    //用于存放顶点法向量的Map,其键为顶点索引，值为对应顶点法向量的集合
    var norVectorManage=new SetOfNormal();

    //地形网格的行数
    var rows=yArray.length-1;
    var cols=yArray[0].length-1;
    //对地形网格进行遍历
    for(var i=0;i<rows;i++) {
        for(var j=0;j<cols;j++) {
            var index=new Array();		//创建用于存放当前网格四个顶点索引的数组
            index[0]=i*(cols+1)+j;		//网格中0号点的索引		0---------1
            index[1]=index[0]+1;		//网格中1号点的索引		|     /   |
            index[2]=index[0]+cols+1;	//网格中2号点的索引		|   /	  |
            index[3]=index[1]+cols+1;	//网格中3号点的索引		2---------3
            //计算当前地形网络左上三角形面的法向量
            var vxa=verticess[i+1][j][0]-verticess[i][j][0];
            var vya=verticess[i+1][j][1]-verticess[i][j][1];
            var vza=verticess[i+1][j][2]-verticess[i][j][2];
            var vxb=verticess[i][j+1][0]-verticess[i][j][0];
            var vyb=verticess[i][j+1][1]-verticess[i][j][1];
            var vzb=verticess[i][j+1][2]-verticess[i][j][2];
            var vNormal1=vectorNormal(getCrossProduct([vxa,vya,vza],[vxb,vyb,vzb]));
            var nolVector = new Normal(vNormal1[0],vNormal1[1],vNormal1[2]);
            for(var k=0;k<3;k++){
                norVectorManage.add(index[k],nolVector);
            }
            //计算当前地形网格右下三角形的法向量
            vxa=verticess[i+1][j][0]-verticess[i+1][j+1][0];
            vya=verticess[i+1][j][1]-verticess[i+1][j+1][1];
            vza=verticess[i+1][j][2]-verticess[i+1][j+1][2];
            vxb=verticess[i][j+1][0]-verticess[i+1][j+1][0];
            vyb=verticess[i][j+1][1]-verticess[i+1][j+1][1];
            vzb=verticess[i][j+1][2]-verticess[i+1][j+1][2];
            var vNormal2=vectorNormal(getCrossProduct([vxb,vyb,vzb],[vxa,vya,vza]));
            var nolVector= new Normal(vNormal2[0],vNormal2[1],vNormal2[2]);
            for(var k=1;k<4;k++){
                norVectorManage.add(index[k],nolVector);
            }
        }
    }
    //遍历顶点数组，计算每个顶点的平均法向量
    for(var i=0;i<yArray.length;i++) {
        for(var j=0;j<yArray[0].length;j++){
            var index=i*(cols+1)+j;
            var nolVector=norVectorManage.array[index];
            var tn=getAverage(nolVector);
            normals[i][j]=tn;
        }}
        return normals;
}