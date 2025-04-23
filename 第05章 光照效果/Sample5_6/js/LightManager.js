function LightManager(lxIn,lyIn,lzIn)
{
   this.lx=lxIn;
   this.ly=lyIn;
   this.lz=lzIn;
   this.setLightDirection=setLightDirectionF;
}
function setLightDirectionF(lxIn,lyIn,lzIn)//设置定向光的方法
{
   this.lx=lxIn;
   this.ly=lyIn;
   this.lz=lzIn;
}