var mixap_webaccess_document_download_servlet = "servlet/file.download";
var mixap_webaccess_document_uplolad_servlet = "servlet/file.upload";

function getCurrentUserAuthCookie()
{
}

/*
* 返回应用服务器基础路径
*/
function getServerURI()
{
	var uri = window.location.protocol + "//" + window.location.host + "/mkoa/";
	return uri;
}

/*
* 返回文档下载路径
*/
function getDocumentDownloadURI()
{
	return getServerURI() + mixap_webaccess_document_download_servlet;
}

/*
* 返回文档上传路径
*/
function getDocumentUploadURI()
{
	return getServerURI() + mixap_webaccess_document_uplolad_servlet;
}

/*
* 下载文档到指定位置
* @param objid
* @param url
* @param localpath
* @param cookiestr
*/
function downloadDocument(objid, url, localpath, cookiestr)
{
	 if(objid != "")
	 {
	 		var obj = document.getElementById(objid);
	 		if(obj.id != "" && obj.id != "undefine")
	 		{
	 			obj.downloadFile(url, localpath, cookiestr);
	 		}
	 }
}

/*
* 上传文档到指定位置
* @param objid
* @param url
* @param localpath
* @param cookiestr
*/
function uploadDocument(objid, url, localpath, cookiestr)
{
	 if(objid != "")
	 {
	 		var obj = document.getElementById(objid);
			if(obj.id != "" && obj.id != "undefine")
			{
				//alert("url=" + url + "\n" + "localpath=" + localpath);
				obj.uploadFile(url, localpath, cookiestr);
			}
	 }
}

function testControl(objid, txt)
{
	 if(objid != "")
	 {
	 		var obj = document.getElementById(objid);
			if(obj.id != "" && obj.id != "undefine")
			{
				obj.TestControl(txt);
			}
	 }
}