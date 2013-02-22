<%@ page contentType="text/html; charset=utf-8"%>
<%@ page import="java.util.List"%>
<%@ page import="java.util.Map"%>
<%@ page import="com.google.gson.JsonArray"%>
<%@ page import="com.mixky.engine.common.gson.JsonFunction"%>
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
<%@ page import="com.mixky.toolkit.json.JsonTools"%>
<%
	// 读取参数
	String panelid = request.getParameter("panelid");
	String documentid = request.getParameter("documentid");
	Panel panel = (Panel)request.getAttribute("panel");
	User user = (User)request.getAttribute("user");
	Document document = (Document)request.getAttribute("document");
	JsonObjectDao data = (JsonObjectDao)request.getAttribute("data");
	Map<String, ObjectAuthority> map = (Map<String, ObjectAuthority>)request.getAttribute("authmap");
	// 获得按钮权限
	List<ObjectAuthority> buttonauths = DocumentManager.instance().getFilterObjectAuthority(map, panel.getF_buttons(), user);
	// 获得字段权限
	TableForm tableform = DesignObjectLoader.instance().loadDesignObject(panel.getF_i_tableform().get("data").getAsString());
	List<ObjectAuthority> fieldauths = null;
	if(map == null){
		fieldauths = tableform.getFieldAuths();
	}else{
		fieldauths = DocumentManager.instance().getFilterObjectAuthority(map, tableform.getFields(), user);
	}
	JsonArray formLayout = tableform.getFormColumnLayout();
%>
<script language='javascript'>
Ext.onReady(function(){

	var panel = Ext.getCmp('<%=panelid%>');
	var win = panel.findParentByType('window');
	
	var refreshAction = new Ext.Action({
		text : '刷新',
		iconCls : 'icon-sys-refresh',
		handler : function(){
			panel.refresh();
		}
	});
<%
	for(int i=0;i<fieldauths.size();i++){
		ObjectAuthority auth = fieldauths.get(i);
		Field field = (Field)auth.getObject();
%>
		var <%=field.getF_name()%> = <%=StoreManager.instance().getFieldEditor(auth) %>;
		<%=field.getF_name()%>.document = panel;
<%
		if(field.getF_inputtype() == Field.INPUTT_NONE){
			formLayout.add(new JsonFunction(field.getF_key()));
		}
	}
%>

	var buttons = [refreshAction, '->'];
<%
	for(int i=0;i<buttonauths.size();i++){
		ObjectAuthority auth = buttonauths.get(i);
		if(auth.hasAuth(ObjectAuthority.A_EDIT) || auth.hasAuth(ObjectAuthority.A_READ)){
			Action button = (Action)auth.getObject();;
%>
	<%=button.output()%>
	buttons.push(<%=button.getF_name()%>);
<%
		}
	}
%>

	var form = new Ext.form.FormPanel({
		layout:'form',
		border : false,
		tbar : buttons,
		fileUpload : true,
		trackResetOnLoad : true,
		labelWidth : 80,
		autoScroll : true,
		waitMsgTarget : win.getEl(),
		bodyStyle : "padding:10px;padding-left:0px;overflow-x:visible;overflow-y:scroll;",
		paramOrder : ['panelkey', 'documentid', 'params'],
		baseParams : {
			panelkey : '<%=panel.getKey()%>',
			documentid : <%=documentid%>,
			params : panel.document.params
		},
		api : {
			load : DocumentAppDirect.load,
			submit : DocumentAppDirect.submit
		},
		items : <%=formLayout.toString()%>
	});

	panel.submit = function(fn){
		if(!form.getForm().isValid()){
			MixkyApp.showErrorMessage("表单数据填写非法，保存失败");
			return;
		}
		if(form.getForm().isDirty()){
			form.getForm().submit({
				waitMsg : '正在保存表单数据，请稍候...', 
				success : function(f,a){
					form.getForm().load();
					panel.document.submitPanelOver(panel, fn);
				},
				failure : function(f, a){
					MixkyApp.showFormActionFail(f, a);
				}
			});
		}else{
			panel.document.submitPanelOver(panel, fn);
		}
	}

	panel.refresh = function(){
		form.getForm().load({waitMsg : '正在装载表单数据，请稍候...'});
	}

	// 输出附加脚本 begin
<%
	if(panel.getF_custom_script() != null){
		out.print(panel.getF_custom_script());
	}
%>

	// 输出附加脚本 end
	panel.add(form);
	panel.doLayout();
	//form.doLayout();
	// 初始化视图数据
	panel.refresh();

});
</script>