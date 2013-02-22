<%@ page contentType="text/html; charset=utf-8"%>
<%@ page import="java.util.List"%>
<%@ page import="java.util.Map"%>
<%@ page import="com.mixky.common.database.JsonObjectDao"%>
<%@ page import="com.mixky.engine.organization.User"%>
<%@ page import="com.mixky.engine.common.Action"%>
<%@ page import="com.mixky.engine.common.DesignObjectLoader"%>
<%@ page import="com.google.gson.JsonObject"%>
<%@ page import="com.mixky.engine.common.DesignObject"%>
<%@ page import="com.mixky.engine.document.DocumentManager"%>
<%@ page import="com.mixky.engine.document.Document"%>
<%@ page import="com.mixky.engine.document.Panel"%>
<%@ page import="com.mixky.engine.store.StoreManager"%>
<%@ page import="com.mixky.engine.store.Table"%>
<%@ page import="com.mixky.engine.store.Field"%>
<%@ page import="com.mixky.engine.store.TableForm"%>
<%@ page import="com.mixky.engine.document.ObjectAuthority"%>
<%@ page import="com.mixky.common.serialize.JsonFileSerializer"%>
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
	DesignObject table = tableform.getParent();
	DesignObject module = table.getParent();
	String bgFilePath = JsonFileSerializer.instance().getFileRootRelate() + module.getF_key() + "/" + tableform.getKey() + ".jpg";
	int width = 794;
	int height = 1123;
	if(tableform.getF_width()>0){
		width = tableform.getF_width();
	}
	if(tableform.getF_height()>0){
		height = tableform.getF_height();
	}
	
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
	var <%=field.getF_name()%> = <%=StoreManager.instance().getBgFormFieldEditor(auth) %>;
	<%=field.getF_name()%>.document = panel;
<%
	}
%>
	var items = <%=tableform.getBgFormItems()%>;

	var buttons = [refreshAction, '->'];
<%
	for(int i=0;i<buttonauths.size();i++){
		ObjectAuthority auth = buttonauths.get(i);
		if(auth.hasAuth(ObjectAuthority.A_EDIT) || auth.hasAuth(ObjectAuthority.A_READ)){
			Action button = (Action)auth.getObject();;
%>
	var <%=button.getF_name()%> = new Ext.Action({
		text : '<%=button.getF_caption()%>',
		iconCls : '<%=button.getIcon()%>',
		handler : (<%=button.getRunHandler()%>)
	});
	buttons.push(<%=button.getF_name()%>);
<%
		}
	}
%>

	var form = new Ext.form.FormPanel({
		renderTo : '<%=tableform.getKey()%>-<%=documentid%>',
		autoScroll : true,
		border : false,
		layout : 'absolute',
		width : <%=width%>,
		height : <%=height%>,
		bodyStyle : 'background:transparent;',
		fileUpload : true,
		trackResetOnLoad : true,
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
		items:items
	});

	panel.submit = function(fn){
		if(!form.getForm().isValid()){
			MixkyApp.showErrorMessage("表单数据填写非法，保存失败");
			return;
		}
		if(form.getForm().isDirty()){
			form.getForm().submit({
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
		form.getForm().load();
	}

	// 输出附加脚本 begin
<%
	if(panel.getF_custom_script() != null){
		out.print(panel.getF_custom_script());
	}
%>

	var tb = new Ext.Toolbar({
		renderTo : '<%=tableform.getKey()%>-<%=documentid%>-toolbar',
		items:buttons
	})

	// 输出附加脚本 end
	//panel.add(new Ext.Toolbar({items:buttons}));
	tb.render();
	form.render();
	panel.doLayout();
	// 初始化视图数据
	panel.refresh();

	win.maximize();
	win.doLayout();
});
</script>
<div id='<%=tableform.getKey()%>-<%=documentid%>-toolbar'></div>
<DIV id='form-pos-editor-table' style="padding:15px;background-color:darkgray;">
<TABLE cellSpacing=0 cellPadding=0 align=center bgColor=white>
	<TR style="HEIGHT: 2px">
		<TD vAlign=top background='resources/images/report/t_l.gif'></TD>
		<TD vAlign=top background='resources/images/report/t_z.gif'></TD>
		<TD vAlign=top background='resources/images/report/t_y.gif'></TD>
	<TR>
		<TD vAlign=top style='width:2px' background='resources/images/report/b_l.gif'></TD>
		<TD>
			<div id='<%=tableform.getKey()%>-<%=documentid%>' style='position:relative;width:<%=width%>px;height:<%=height%>px;background-repeat:no-repeat;background-image:url("<%=bgFilePath%>");'></div>
		</TD>
		<TD vAlign=top style='width:3px' background='resources/images/report/b_y.gif'></TD>
	</TR>
	<TR style="HEIGHT: 7px">
		<TD vAlign=top background='resources/images/report/d_l.gif'></TD>
		<TD vAlign=top background='resources/images/report/d_z.gif'></TD>
		<TD vAlign=top background='resources/images/report/d_y.gif'></TD>
	</TR>
</TABLE>
</DIV>