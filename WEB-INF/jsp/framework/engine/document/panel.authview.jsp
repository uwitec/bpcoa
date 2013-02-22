<%@ page contentType="text/html; charset=utf-8"%>
<%@ page import="java.util.List"%>
<%@ page import="java.util.ArrayList"%>
<%@ page import="java.util.Map"%>
<%@ page import="com.google.gson.JsonObject"%>
<%@ page import="com.mixky.common.database.JsonObjectDao"%>
<%@ page import="com.mixky.engine.organization.User"%>
<%@ page import="com.mixky.engine.document.DocumentManager"%>
<%@ page import="com.mixky.engine.document.Document"%>
<%@ page import="com.mixky.engine.document.Panel"%>
<%@ page import="com.mixky.engine.document.ObjectAuthority"%>
<%@ page import="com.mixky.engine.document.AuthorityMap"%>
<%@ page import="com.mixky.engine.workflow.FlowInstance"%>
<%@ page import="com.mixky.engine.workflow.WorkFlowManager"%>
<%
	// 读取参数
	String panelid = request.getParameter("panelid");
	String documentid = request.getParameter("documentid");
	Panel panel = (Panel)request.getAttribute("panel");
	User user = (User)request.getAttribute("user");
	Document document = (Document)request.getAttribute("document");
	JsonObjectDao data = (JsonObjectDao)request.getAttribute("data");
	Map<String, ObjectAuthority> map = (Map<String, ObjectAuthority>)request.getAttribute("authmap");

	String statekey = null;
	JsonObject dataJson = data.getJsonObject();
	if(dataJson.has("F_STATE") && !dataJson.get("F_STATE").isJsonNull()){
		statekey = DocumentManager.instance().getDocumentState(document, dataJson.get("F_STATE").getAsString());
	}
	// 获得用户身份
	List<String> identitykeys = null;
	if(document.getF_i_flow() == null) {
		// 获得用户身份
		identitykeys = DocumentManager.instance().getDocumentIdentity(document, data.getJsonObject(), user);
	}else{
		long lngdocumentid = Long.parseLong(documentid);
		long flowlogid = DocumentManager.instance().getFlowlogId(document, lngdocumentid);
		if (flowlogid == 0){
			// 读取模板定义数据
			JsonObject jFlow = document.getF_i_flow();
			if (jFlow != null && !jFlow.isJsonNull()){
				String flowKey = jFlow.get("data").getAsString();
				// 查询用户身份
				List<Integer> flowIdentities = new ArrayList<Integer>();
				FlowInstance.getAuthorIdentity(flowKey, user).getDocumentIdentitiesList(flowIdentities);
				identitykeys = DocumentManager.instance().getFlowIdentitiesKey(flowIdentities);
			}
		} else {
			FlowInstance flowInstance = WorkFlowManager.instance().getFlowInstance(flowlogid, user);
			if(flowInstance == null) {
				// TODO: throw exception
			}
			// 查询用户身份
			List<Integer> flowIdentities = new ArrayList<Integer>();
			flowInstance.getUserIdentity(user).getDocumentIdentitiesList(flowIdentities);
			identitykeys = DocumentManager.instance().getFlowIdentitiesKey(flowIdentities);
		}
	}
	// 获得文档子状态
	List<String> substatekeys = DocumentManager.instance().getDocumentSubState(document, dataJson, user);
	// 获得所有满足条件的映射表
	List<AuthorityMap> maps = DocumentManager.instance().getDocumentAuthorityMaps(document, statekey, identitykeys, substatekeys);
	// 处理对象权限
%>

<B>Panel Key</B> : <%=panel.getKey()%><br>
<B>Document ID</B> : <%=documentid%><br>
<B>Document Data</B> : <%=dataJson%><br>
<B>State Key</B> : <%=statekey%><br>
<B>Identity Keys</B> : <%for(int i=0;i<identitykeys.size();i++){out.print(identitykeys.get(i) + "; ");}%><br>
<B>SubState Keys</B> : <%for(int i=0;i<substatekeys.size();i++){out.print(substatekeys.get(i) + "; ");}%><br>
<B>Authority Maps</B> : <%for(int i=0;i<maps.size();i++){out.print(maps.get(i).getKey() + "; ");}%><br>
<hr>
<table border=0 width=100% class=x-window-mc>
<tr align=center>
	<td><B>Type</B>
	<td><B>Key</B>
	<td><B>Caption</B>
	<td><B>Mode</B>
<%
	for (String o : map.keySet()){
		out.print("<TR>");
		out.print("<TD><image border=0 src='designtool/icon/" + map.get(o).getObject().getF_class() + ".gif'> &nbsp;&nbsp;" + map.get(o).getObject().getF_class());
		out.print("<TD>" + map.get(o).getObject().getF_key());
		out.print("<TD>" + map.get(o).getObject().getF_caption());
		out.print("<TD>" + map.get(o).getMode());
	}
%>
</table>

<br>
<br>
<center><B><A id='authviewrefresh-<%=document.getF_key()%>-<%=documentid%>' href=#>刷新</A></B></center>
<br>

<script language='javascript'>
Ext.onReady(function(){
	// 获得标签
	var panel = Ext.getCmp('<%=panelid%>');
	// 处理标签保存
	panel.submit = function(fn){
		panel.document.submitPanelOver(panel, fn);
	}
	// 刷新页面
	panel.refresh = function(){
		panel.getUpdater().update(panel.initialConfig.autoLoad);
	}
	// 处理链接
	Ext.fly('authviewrefresh-<%=document.getF_key()%>-<%=documentid%>').on('click', function(){
		panel.refresh();
	});
});
</script>