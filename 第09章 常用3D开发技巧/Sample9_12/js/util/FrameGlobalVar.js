//GLES上下文
var gl;
//着色器程序列表，集中管理
var shaderProgArray=new Array();
//变换矩阵管理类对象
var ms=new MatrixState();
//光源位置管理器
var lightManager=new LightManager(100,100,100);
//四个物体
var masss,masss1,masss2,masss3;



