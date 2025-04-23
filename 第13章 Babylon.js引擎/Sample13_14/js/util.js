const addMesh=(scene,directionLight)=>{
    let meshArray=[];//新建物体数组
    const shadowGenerator = new BABYLON.ShadowGenerator(1024, directionLight);//新建阴影
    shadowGenerator.useBlurExponentialShadowMap = true;//设置采样为指数 
    shadowGenerator.blurKernel = 32;//设置阴影内核数量
    shadowGenerator.blurBoxOffset = 4.0;//设置阴影偏移量
    const animationArray=[];//新建动画数组
    BABYLON.SceneLoader.ImportMesh("", "./model/", "chair.babylon", scene, (Meshes, particleSystems, skeletons)=> {
        const defaultEnvironment=scene.createDefaultEnvironment();
        defaultEnvironment.setMainColor(BABYLON.Color3.Gray());
        for(let tempMesh of Meshes)
        {
            console.log(`Meshes:${Meshes.length}||shadowGenerator:${shadowGenerator}${Date()}`);
            tempMesh.scaling=new BABYLON.Vector3(0.01,0.01,0.01);
            tempMesh.position=new BABYLON.Vector3(0,-4  ,0);
            tempMesh.receiveShadows=false;     
            shadowGenerator.getShadowMap().renderList.push(tempMesh);    
        }
    });
}