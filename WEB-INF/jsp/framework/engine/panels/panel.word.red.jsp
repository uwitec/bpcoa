<%@ page contentType="text/html; charset=utf-8"%>
<%@ page import="java.util.List"%>
<%@ page import="java.util.Map"%>
<%@ page import="com.mixky.common.database.JsonObjectDao"%>
<%@ page import="com.mixky.engine.organization.User"%>
<%@ page import="com.mixky.engine.common.Action"%>
<%@ page import="com.mixky.engine.common.DesignObjectLoader"%>
<%@ page import="com.google.gson.JsonObject"%>
<%@ page import="com.mixky.engine.document.DocumentManager"%>
<%@ page import="com.mixky.engine.document.Document"%>
<%@ page import="com.mixky.engine.document.Panel"%>
<%@ page import="com.mixky.engine.store.StoreManager"%>
<%@ page import="com.mixky.engine.store.Table"%>
<%@ page import="com.mixky.engine.store.Field"%>
<%@ page import="com.mixky.engine.store.TableForm"%>
<%@ page import="com.mixky.engine.document.ObjectAuthority"%>
<%@page import="java.util.ArrayList"%>
<%
	// 读取参数
	String panelid = request.getParameter("panelid");
	String documentid = request.getParameter("documentid");
	String panelKey = request.getParameter("panelkey");
	Panel panel = (Panel)request.getAttribute("panel");
	User user = (User)request.getAttribute("user");
	// 获得标签权限
	Map<String, ObjectAuthority> map = (Map<String, ObjectAuthority>)request.getAttribute("authmap");
	List<Panel> panels = new ArrayList<Panel>();
	panels.add(panel);
	List<ObjectAuthority> panelauths = DocumentManager.instance().getFilterObjectAuthority(map, panels, user);
	boolean canEdit = false;
	for (int i = 0; i < panelauths.size(); i++) {
		ObjectAuthority auth = panelauths.get(i);
		if (auth.hasAuth(ObjectAuthority.A_EDIT)) {
			canEdit = true;
		}
	}
	
	String wordAttachmentId = "2";
%>

<script language='javascript'>
Ext.onReady(function(){

	function loadWordDocumentFromServer() {
		unLoadWordDocument("mixkymsreddoc", false);
		var url = getDocumentDownloadURI() + "?id=<%=wordAttachmentId%>";
		var documentpath = mixap_doc_root + "myredword.doc";
		downloadDocument("mixapredwebaccess", url, documentpath, "cookievalue");
		Sleep(this, 500);
		this.NextStep=function()
		{
			loadWordDocument("mixkymsreddoc", documentpath, true, true, true);
			Sleep(this, 500);
			this.NextStep=function()
			{
				lockWordDocument("mixkymsreddoc", "123");
			}
		}
	}

	var panel = Ext.getCmp('<%=panelid%>');
	var win = panel.findParentByType('window');
	
	var refreshAction = new Ext.Action({
		text : '刷新',
		iconCls : 'icon-sys-refresh',
		handler : function(){
			panel.refresh();
		}
	});

	var redWordAction = new Ext.Action({
		text : '生成红头',
		iconCls : 'icon-sys-new',
		handler : function(){
			panel.createRedWord();
		}
	});

	var downloadRedWord = new Ext.Action({
		text : '下载红头',
		iconCls : 'icon-sys-download',
		handler : function(){
			location.href = "engine/file/sysdownload.do?id=<%=wordAttachmentId%>&documentdbtype=none";
		}
	});


	var buttons = [refreshAction, '->'];
<%
	if (canEdit) {
%>
	//buttons.push(redWordAction);
<%
	}
%>
	buttons.push(downloadRedWord);

	var wordPanel = new Ext.Panel({
		autoScroll : true,
		border : false,
		//tbar : buttons,
		trackResetOnLoad : true,
		bodyStyle : "padding:10px;padding-left:0px;padding-right:23px",
		html:'<object classid="clsid:00460182-9E5E-11d5-B7C8-B8269041DD57" codebase="resources/ocx/mixky.doc.ocx#version=1.2" id="mixkymsreddoc" width="100%" height="100%"><param name="BorderStyle" value="0"><param name="TitlebarColor" value="52479"><param name="TitlebarTextColor" value="0"><param name="Titlebar" value="0"><param name="Menubar" value="1"></object><object classid="clsid:7F949355-7E91-4877-8646-CA30C3BA98CB" codebase="resources/ocx/mixky.webaccess.ocx#version=1.0" id="mixapredwebaccess" width="16" height="16"></object><object classid="clsid:7F949355-7E91-4877-8646-CA30C3BA98CB" codebase="mixap.webaccess.ocx#version=1.0" id="mixkywebaccess" width="16" height="16"></object>',
		tbar: buttons
	});

	panel.createRedWord = function(){
		//alert('生成红头');
	}
	
	
	panel.submit = function(fn){
		//alert('保存');
		panel.document.submitPanelOver(panel, fn);
	}

	panel.refresh = function(){
		loadWordDocumentFromServer();
	}

	// 输出附加脚本 end
	panel.add(wordPanel);
	panel.doLayout();
	// 初始化视图数据
	panel.refresh();
});
</script>