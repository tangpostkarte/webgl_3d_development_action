function getRadio()
	{
        var chkObjs = document.getElementsByName("size");
        for(var i=0;i<chkObjs.length;i++){
			if(chkObjs[i].checked){
               chk = i;
			   currText32=textId32[chk];
			   currText256=textId256[chk];
            }
        }
    }
