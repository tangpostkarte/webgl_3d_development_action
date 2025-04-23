function addResult(content){
	var table=document.getElementById("operateTable");
	oldLength=table.rows.length;
	var row=table.insertRow(oldLength);
	var cell1=row.insertCell(0);
	cell1.innerHTML=oldLength;
	var cell2=row.insertCell(1);
	cell2.innerHTML=content;
	//alert(content);
}
function deleteResult(){
	var table=document.getElementById("operateTable");
	oldLength=table.rows.length;
	//alert(oldLength);
	if(oldLength==1){return;}
	table.deleteRow(oldLength-1);
}