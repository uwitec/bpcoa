var mixap_doc_username = "未知";
var mixap_doc_deptname = "未知";
var mixap_doc_filepath = "c:\\mixky\\mixap.doc";
var mixap_doc_root = "c:\\mixky\\";
var mixap_doc_original_username = "未知";

function Sleep(obj, iMinSecond) {
	if (window.eventList == null)
		window.eventList = new Array();
	var ind = -1;
	for ( var i = 0; i < window.eventList.length; i++) {
		if (window.eventList[i] == null) {
			window.eventList[i] = obj;
			ind = i;
			break;
		}
	}
	if (ind == -1) {
		ind = window.eventList.length;
		window.eventList[ind] = obj;
	}
	setTimeout("GoOn(" + ind + ")", iMinSecond);
}

function GoOn(ind) {
	var obj = window.eventList[ind];
	window.eventList[ind] = null;
	if (obj.NextStep)
		obj.NextStep();
	else
		obj();
}

/**
 * path showtrace 是否显示痕迹 allowmodify 是否允许修改 tracemodify 是否记录修改
 */
function loadWordDocument(objid, path, showrevisions, trackrevisions, allowmodify, username) {
	if (objid != "") {
		var obj = document.getElementById(objid);
		if (obj) {
			try {
				mixap_doc_filepath = path;
				obj.Open(mixap_doc_filepath);
				obj.TrackDocumentRevision(trackrevisions);
				obj.ShowDocumentRevision(showrevisions);
				setCurrentEditUserName(objid, username);
			} catch (e) {
				//alert(e.message);
			}
		}
	}
}

/**
 * 保存文档到指定路径，如未指定路径则保存到当前打开文件
 * ocxname
 * path
 */
function saveWordDocument(objid, path) {
	if (objid != "") {
		var obj = document.getElementById(objid);
		if (obj) {
			try {
				if (path != "" && path != mixap_doc_filepath) {
					obj.ActiveDocument.SaveAs(path);
				} else {
					obj.ActiveDocument.Save();
				}
			} catch (e) {
				//alert(e.message);
			}
		}
	}
}

/**
 * savefirst 关闭之前是否保存文档
 */
function unLoadWordDocument(objid, savefirst) {
	if (objid != "") {
		var obj = document.getElementById(objid);
		if (obj) {
			try {
				obj.SetDocumentCurrentEditingUser(mixap_doc_original_username);
				obj.close();
			} catch (e) {
				//alert(e.message);
			}
		}
	}
}

/**
 * 初始化用户信息
 * username
 * deptname
 */
function initUserInfo(username, deptname) {
	mixap_doc_username = username;
	mixap_doc_deptname = deptname;
}

/**
 * 保护文档（不允许拷贝、编辑）
 * protectpass 密码保护口令
 */
function lockWordDocument(objid, protectpass) {
	if (objid != "") {
		var obj = document.getElementById(objid);
		if (obj) {
			obj.ProtectDocument(2, protectpass);
		}
	}
}

/**
 * 解除文档保护
 * protectpass 密码保护口令
 */
function unLockWordDocument(objid, protectpass) {
	if (objid != "") {
		var obj = document.getElementById(objid);
		if (obj) {
			obj.ProtectDocument(-1, protectpass);
		}
	}
}

/**
 * 显示/隐藏文档修订
 * show
 */
function showWordDocumentRevision(objid, show) {
	if (objid != "") {
		var obj = document.getElementById(objid);
		if (obj) {
			obj.ShowDocumentRevision(show);
		}
	}
}

/**
 * 检查文档是否已被修改
 */
function checkWordDocumentDirty(objid) {
	var isdirty = false;
	if (objid != "") {
		var obj = document.getElementById(objid);
		if (obj) {
			isdirty = obj.IsDirty;
		}
	}
	return isdirty;
}

/**
 * 设置用户信息
 */
function setCurrentEditUserName(objid, username) {
	if (objid != "") {
		var obj = document.getElementById(objid);
		if (obj) {
			//mixap_doc_original_username = obj.GetDocumentCurrentEditingUser();
//			alert(mixap_doc_original_username);
//			if (username == "undefined" || username == "") {
//				username = mixap_doc_username + "/" + mixap_doc_deptname;
//			}
//			obj.SetDocumentCurrentEditingUser(username);
		}
		//mixap_doc_original_username = obj.GetDocumentCurrentEditingUser();
		//alert(mixap_doc_original_username);
		if (username == undefined || username == "") {
			username = mixap_doc_username + "/" + mixap_doc_deptname;
		}
		obj.SetDocumentCurrentEditingUser(username);
	}
}

/**
 * 设置文档书签文本
 */
function setWordDocumentFieldValue(objid, bookmark, value) {
	if (bookmark == "") {
		return;
	}
	if (objid != "") {
		var obj = document.getElementById(objid);
		if (obj) {
			obj.SetDocumentField(bookmark, value);
		}
	}
}

/**
 * 在当前文档书签位置插入文件
 */
function insertFileToCurrentDocument(objid, bookmark, filepath) {
	if (bookmark == "") {
		return;
	}
	if (objid != "") {
		var obj = document.getElementById(objid);
		if (obj) {
			obj.InsertDocument(bookmark, filepath);
		}
	}
}

/**
 * 接受文档修订
 */
function clearDocumentRevision(objid) {
	if (objid != "") {
		var obj = document.getElementById(objid);
		if (obj) {
			obj.ClearDocumentRevisions();
		}
	}
}