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
    let meshArray=[];
    const shadowGenerator = new BABYLON.ShadowGenerator(1024, directionLight);
    let loader = new BABYLON.AssetsManager(scene);//创建资源管理 
    let  kjzTask = loader.addMeshTask("ch_gltf", "","./model/", "skull.babylon");//创建加载任务
    kjzTask.onSuccess = (task)=> {//加载成功后任务
        for(let mesh of task.loadedMeshes)//遍历加载到的模型
        {
            mesh.position=new BABYLON.Vector3(0,2,0);//设置每个物体的位置
            mesh.scaling=new BABYLON.Vector3(0.3,0.3,0.3);
            meshArray.push(mesh);
            mesh.physicsImpostor = new BABYLON.PhysicsImpostor(mesh,BABYLON.PhysicsImpostor.MeshImpostor,{mass:0},scene);
            console.log(mesh.name);
            console.log(`${mesh.scaling}||${mesh.position}||${meshArray.length}`);
        }
    };
    console.log(`meshArray.length:${meshArray.length}`);
    //如果加载过程中出现错误，提示简单的错误信息
    kjzTask.onError =  (task, message, exception)=> {
        console.log(`kjzTask short error message:${message},specific error information:${exception}.`);//打印错误信息
    }

    
    setTimeout(()=>{
        console.log(`meshArray${meshArray.length}`);
        for(let tempMesh of meshArray)
        {
            tempMesh.receiveShadows=true;
            shadowGenerator.getShadowMap().renderList.push(tempMesh);
            shadowGenerator.useBlurExponentialShadowMap = true;
            shadowGenerator.blurBoxOffset = 2.0;
        }
    },1000);
    //创建高度图，并添加刚体
    let planeMesh = BABYLON.Mesh.CreateGroundFromHeightMap("planeMesh", "pic/hightMap/default.png", 100, 100, 50, 0, 30, scene, false, function () {
        planeMesh.physicsImpostor = new BABYLON.PhysicsImpostor(planeMesh, BABYLON.PhysicsImpostor.HeightmapImpostor, { mass: 0 });
    });
    planeMesh.sideOrientation = 2;
    planeMesh.position=new BABYLON.Vector3(0,-30,0);//设置平面位置
    planeMesh.rotation.x=-Math.PI/6;//设置旋转
    let myMaterial = new BABYLON.StandardMaterial("myMaterial", scene);//新建纹理对象
    let textureTask = loader.addTextureTask("image task", "./pic/hightMap/ground.jpg");//加载图片
    textureTask.onSuccess = function(task) {//资源加载成功
        myMaterial.diffuseTexture=task.texture;//设置纹理对象的散射纹理图为加载到的纹理图
        planeMesh.material=myMaterial;//设置平面的纹理为纹理对象
    }
    planeMesh.receiveShadows=true;//设置平面接收阴影
    loader.load();//开始所有任务
}
const createSphere=(scene,time,spheres)=>{
    let sphereMaterial = new BABYLON.StandardMaterial('material',scene);
    if(time%100==0&&time<600)
    {
        let s = BABYLON.MeshBuilder.CreateSphere("s", {diameter: 3.0});
        sphereMaterial.diffuseColor = new BABYLON.Color3(Math.random(),Math.random(),Math.random());
        s.material = sphereMaterial;
        s.position.y = 50;
        s.physicsImpostor = new BABYLON.PhysicsImpostor(s, BABYLON.PhysicsImpostor.SphereImpostor, {mass: 2.5});
        spheres.push(s);
    }
    else{
        return;
    }
    
    spheres.forEach(function(sphere) {
        if(sphere.position.y < -35) {
            sphere.dispose();
        }
    });
    spheres = spheres.filter(s => !s.isDisposed());
}