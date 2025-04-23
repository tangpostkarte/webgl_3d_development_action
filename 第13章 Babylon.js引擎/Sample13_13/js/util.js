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

const addMesh=(scene,directionLight)=>{
    let meshArray=[];//新建物体数组
    const shadowGenerator = new BABYLON.ShadowGenerator(1024, directionLight);//新建阴影
    shadowGenerator.useBlurExponentialShadowMap = true;//设置采样为指数 
    shadowGenerator.blurKernel = 32;//设置阴影内核数量
    shadowGenerator.blurBoxOffset = 4.0;//设置阴影偏移量
    const animationArray=[];//新建动画数组
    BABYLON.SceneLoader.ImportMesh("", "./model/", "dummy3.babylon", scene, (Meshes, particleSystems, skeletons)=> {
        let skeleton=skeletons[0];
        for(let tempMesh of Meshes)
        {
            console.log(`Meshes:${Meshes.length}||shadowGenerator:${shadowGenerator}${Date()}`);
            tempMesh.scaling=new BABYLON.Vector3(4.0,4.0,4.0);
            tempMesh.position=new BABYLON.Vector3(0,0,5);
            tempMesh.receiveShadows=false;     
            shadowGenerator.getShadowMap().renderList.push(tempMesh);    
        }
        skeleton.animationPropertiesOverride = new BABYLON.AnimationPropertiesOverride();
        skeleton.animationPropertiesOverride.enableBlending = true;
        skeleton.animationPropertiesOverride.blendingSpeed = 0.05;
        skeleton.animationPropertiesOverride.loopMode = 1;
        animationArray.push(
            skeleton.getAnimationRange("YBot_Idle"),
            skeleton.getAnimationRange("YBot_Walk"),
            skeleton.getAnimationRange('YBot_Run'),
            skeleton.getAnimationRange('YBot_LeftStrafeWalk'),
            skeleton.getAnimationRange('YBot_RightStrafeWalk'),
        );
    
        setInterval(
            ()=>{
                let random=Math.floor(Math.random()*5);
                //console.log(`skelten.lenght${animationArray.length}||||${random}`);
                scene.beginAnimation(skeleton, animationArray[random].from, animationArray[random].to, true);
            },2000);
    });
    
    let planeMesh=new BABYLON.MeshBuilder.CreatePlane('plane_mesh',{size:100,sideOrientation:2,},scene);//新建一个平面对象
    planeMesh.position=new BABYLON.Vector3(0,0,0);//设置平面位置
    planeMesh.rotation.x=Math.PI/2;//设置旋转
    let myMaterial = new BABYLON.StandardMaterial("myMaterial", scene);//新建纹理对象
    myMaterial.diffuseTexture=new BABYLON.Texture("./pic/floor2.png", scene);//设置纹理对象的散射纹理图为加载到的纹理图
    planeMesh.material=myMaterial;//设置平面的纹理为纹理对象
    planeMesh.receiveShadows=true;//设置平面接收阴影
}