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
var mPreviousY;//上次的触控位置Y坐标
var mPreviousX;//上次的触控位置X坐标
var down=false;//是否按下鼠标
var rex=0;
var canvas;
var TOUCH_SCALE_FACTOR = 180.0/500;//角度缩放比例


