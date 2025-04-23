function getRadio1()
	{
        var chkObjs = document.getElementsByName("size");
        for(var i=0;i<chkObjs.length;i++){
			if(chkObjs[i].checked){
               chk = i;
			   trIndex=chk;
            }
        }
    }
function getRadio2()
	{
        var chkObjs = document.getElementsByName("stretching");
        for(var i=0;i<chkObjs.length;i++){
			if(chkObjs[i].checked){
               chk = i;
			   if(chk==0)
					{currText=textId;}
				else
					{currText=textIdD;}
            }
        }
    }