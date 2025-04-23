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
}

const addMesh=(scene)=>{
    let meshArray=[];
    let loader = new BABYLON.AssetsManager(scene);//创建资源管理 
    let  task = loader.addMeshTask("SSAO_OBJ", "","./model/", "obj.obj");//创建加载任务
    task.onSuccess = (task)=> {//加载成功后任务
        for(let mesh of task.loadedMeshes)//遍历加载到的模型
        {
            mesh.position=new BABYLON.Vector3(0,0,0);//设置每个物体的位置
            mesh.scaling=new BABYLON.Vector3(0.005,0.005,0.005);
            meshArray.push(mesh);
        }
        console.log(`2`);
    };
    //如果加载过程中出现错误，提示简单的错误信息
    task.onError =  (task, message, exception)=> {
        console.log(`task short error message:${message},specific error information:${exception}.`);//打印错误信息
    }

    const planeMesh=new BABYLON.MeshBuilder.CreatePlane('plane_mesh',{size:100,sideOrientation:2,},scene);//新建一个平面对象
    planeMesh.position=new BABYLON.Vector3(0,0,0);//设置平面位置
    planeMesh.rotation.x=Math.PI/2;//设置旋转
    let myMaterial = new BABYLON.StandardMaterial("myMaterial", scene);//新建纹理对象
    let textureTask = loader.addTextureTask("image task", "./pic/floor2.png");//加载图片
    textureTask.onSuccess = function(task) {//资源加载成功
        myMaterial.diffuseTexture=task.texture;//设置纹理对象的散射纹理图为加载到的纹理图
        planeMesh.material=myMaterial;//设置平面的纹理为纹理对象
    }
    planeMesh.receiveShadows=true;//设置平面接收阴影
    loader.load();//开始所有任务
    
}

addGUIandSSAO=(scene,camera)=>{
    // let ssao = new BABYLON.SSAORenderingPipeline("ssao", scene, 0.5);
    // ssao.fallOff = 0.000001;//衰减速率
    // ssao.area = 1;//作用范围
    // ssao.radius = 0.0001;//作用半径 
    // ssao.totalStrength = 1.0;//总强度
    // ssao.base = 0.5;//整体效果 越小越明显
    let ssao = new BABYLON.SSAO2RenderingPipeline("ssao", scene, 0.75);
    ssao.radius = 3.5;
    ssao.totalStrength = 1.3;
    ssao.expensiveBlur = true;
    ssao.samples = 16;
    ssao.maxZ = 250;
    scene.postProcessRenderPipelineManager.attachCamerasToRenderPipeline("ssao", camera);
    let GUICamera=new BABYLON.ArcRotateCamera("BGCamera", Math.PI / 2 + Math.PI / 7, Math.PI / 2, 100,
    new BABYLON.Vector3(0, 20, 0),
    scene);
    GUICamera.layerMask = 0x10000000;
    let clickFlag = false; 
    let advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("ui"); 
    advancedTexture.layer.layerMask = 0x10000000;
    advancedTexture.renderScale = 1.0; 
    let panel = new BABYLON.GUI.StackPanel();  
    panel.width = "400px";
    panel.fontFamily = "25px";
    panel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    panel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    advancedTexture.addControl(panel);   
    let textblock = new BABYLON.GUI.TextBlock();
    textblock.width = "400px";
    textblock.textHorizontalAlignment=BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    textblock.textVerticalAlignment=BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    textblock.height = "50px"; 
    textblock.fontSize = "35px"; 
    textblock.text = "请选择SSAO模式:";
    panel.addControl(textblock);  
    let addRadio = (text, parent,index)=> {
        var button = new BABYLON.GUI.RadioButton();
        button.width = "20px";
        button.height = "20px";
        button.color = "white";
        button.background = "green";  
        button.onPointerDownObservable.add(function() {
            switch (index) {
                case 1:
                if (!clickFlag) {
                    clickFlag = true;
                    scene.postProcessRenderPipelineManager.attachCamerasToRenderPipeline("ssao", camera);
                }
                scene.postProcessRenderPipelineManager.enableEffectInPipeline("ssao", ssao.SSAOCombineRenderEffect, camera);
                    break;
                case 2:
                clickFlag = false;
                scene.postProcessRenderPipelineManager.detachCamerasFromRenderPipeline("ssao", camera);
                    break;
                case 3:
                if (!clickFlag) {
                    clickFlag = true;
                    scene.postProcessRenderPipelineManager.attachCamerasToRenderPipeline("ssao", camera);
                }
                scene.postProcessRenderPipelineManager.disableEffectInPipeline("ssao", ssao.SSAOCombineRenderEffect, camera);
                    break;
            }
        });
        var header = BABYLON.GUI.Control.AddHeader(button, text, "300px", { isHorizontal: true, controlFirst: true });
        header.height = "50px";
        header.children[1].onPointerDownObservable.add(()=> {
            button.isChecked = !button.isChecked;});
        parent.addControl(header); }   
    addRadio("在场景中开启SSAO", panel,1);
    addRadio("不开启SSAO", panel,2);
    addRadio("仅开启SSAO", panel,3);   
    scene.activeCameras.push(GUICamera);
}
