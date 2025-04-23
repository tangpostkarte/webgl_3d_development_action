function downloadFile(str,fileName){//将下载指定字符串的方法
	var blob = new Blob([str]);
	var a = document.createElement("a");
	a.href = window.URL.createObjectURL(blob);
	a.download = fileName;
	a.textContent = "Download";
	document.body.appendChild(a);
	a.click();
}
function dataURLtoBlob(dataurl,fileName) {
  var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
  while(n--){
    u8arr[n] = bstr.charCodeAt(n);
  }
  var blob= new Blob([u8arr], {type:mime});
  var a = document.createElement("a");
	a.href = window.URL.createObjectURL(blob);
	a.download = fileName;
	a.textContent = "Download";
	document.body.appendChild(a);
	a.click();
}
function exportCanvasAsPNG(id, fileName) {
    var canvasElement = document.getElementById(id);

    var MIME_TYPE = "image/png";

    var imgURL = canvasElement.toDataURL(MIME_TYPE);

    var dlLink = document.createElement('a');
    dlLink.download = fileName;
    dlLink.href = imgURL;
    dlLink.dataset.downloadurl = [MIME_TYPE, dlLink.download, dlLink.href].join(':');

    document.body.appendChild(dlLink);
    dlLink.click();
    document.body.removeChild(dlLink);
}

