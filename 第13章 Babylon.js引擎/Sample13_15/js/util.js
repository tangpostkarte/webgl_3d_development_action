const createBoxSky=(scene,sphere)=>{
    let skybox = BABYLON.Mesh.CreateBox("skyBox", 2000.0, scene);//创建一个天空盒
    let skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);//创建天空盒纹理
    skyboxMaterial.backFaceCulling = false;//关闭背面剪裁
    skyboxMaterial.disableLighting = true;//不接受任何光源
    skybox.material = skyboxMaterial;//设置纹理
    skybox.infiniteDistance = true;//设置天空盒相机移动
    skyboxMaterial.disableLighting = true;//去除光照反射
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture('pic/skyBox/skybox', scene);//加载纹理
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;//设置加载模式
    skybox.renderingGroupId = 0;//设置渲染天空盒在其他物体渲染之后
}

addMesh=(scene,directionLight,engine)=>{
    let meshArray=[];
    const shadowGenerator = new BABYLON.ShadowGenerator(1024, directionLight);
    let loader = new BABYLON.AssetsManager(scene);//创建资源管理 
    let  kjzTask = loader.addMeshTask("kjz obj", "","./obj/", "kjz.obj");//创建加载任务
    kjzTask.onSuccess = (task)=> {//加载成功后任务
        for(let mesh of task.loadedMeshes){//遍历加载到的模型
            mesh.position=new BABYLON.Vector3(20,0,0);//设置每个物体的位置
            meshArray.push(mesh);
            console.log(`${mesh.scaling}||${mesh.position}||${meshArray.length}`);}};
    kjzTask.onError =  (task, message, exception)=> {//如果加载过程中出现错误，提示简单的错误信息
        console.log(`kjzTask short error message:${message},specific error information:${exception}.`);}//打印错误信息
    loader.onProgress = function(remainingCount, totalCount, lastFinishedTask) {
        console.log(`We are loading the scene.${remainingCount} out of ${totalCount} items still need to be loaded.`)};
    loader.onFinish = function(tasks) {
        console.log(`Task loading completed.`);};
    loader.onTaskSuccess = function(tasks) {
        console.log(`Task loading success.`);};
    loader.onTaskError = function(tasks) {
        console.log(`Task loading error.`);};
    let ppTask=loader.addMeshTask('pp obj','','./obj/','pp.obj');
    ppTask.onSuccess=(task)=>{
        for(let ppObj of task.loadedMeshes){
        
            ppObj.scaling=new BABYLON.Vector3(30,30,30);
            ppObj.position=new BABYLON.Vector3(-20,0,0);
            meshArray.push(ppObj);}};
    ppTask.onError=(task,message,exception)=>{
        console.log(`ppTask short error message:${message},specific error information:${exception}.`);}
    setTimeout(()=>{
        for(let tempMesh of meshArray){
            tempMesh.receiveShadows=true;
            shadowGenerator.getShadowMap().renderList.push(tempMesh);
            shadowGenerator.useBlurExponentialShadowMap = true;
            shadowGenerator.blurBoxOffset = 2.0;}},1500);
    let planeMesh=new BABYLON.MeshBuilder.CreatePlane('plane_mesh',{size:100,sideOrientation:2,},scene);//新建一个平面对象
    planeMesh.position=new BABYLON.Vector3(0,-2,0);//设置平面位置
    planeMesh.rotation.x=Math.PI/2;//设置旋转
    let myMaterial = new BABYLON.StandardMaterial("myMaterial", scene);//新建纹理对象
    let textureTask = loader.addTextureTask("image task", "./pic/floor2.png");//加载图片
    textureTask.onSuccess = function(task) {//资源加载成功
        myMaterial.diffuseTexture=task.texture;//设置纹理对象的散射纹理图为加载到的纹理图
        planeMesh.material=myMaterial;}//设置平面的纹理为纹理对象
    planeMesh.receiveShadows=true;//设置平面接收阴影
    loader.load();//开始所有任务
}