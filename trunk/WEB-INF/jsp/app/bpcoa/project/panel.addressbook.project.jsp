<%@ page contentType="text/html; charset=utf-8"%>
<%@page import="com.mixky.engine.organization.User"%>
<%@page import="com.mixky.app.certification.MixkyUserCertification"%>
<%@page import="com.mixky.app.mkoa.netfolder.FolderItem"%>
<%@page import="com.mixky.app.bpcoa.project.BpcProjectDao"%>
<%@page import="com.mixky.app.bpcoa.project.BpcProjectManager"%>
<%
	User user = MixkyUserCertification.instance().getUserInfo(request);
	String panelid = request.getParameter("panelid");
	String documentid = request.getParameter("documentid");
	BpcProjectDao project = BpcProjectManager.instance().getProject(Long.parseLong(documentid));
	String clientName = project.getF_client_name();
	if(clientName == null || "".equals(clientName)){
%>
	未定义客户名称！
<%
	}else{
%>

<script language='javascript'>
Ext.onReady(function(){

	var panel = Ext.getCmp('<%=panelid%>');
	
	var gridId = Ext.id();
	
	var grid = new Ext.Panel({
		id : gridId,
		layout : 'fit',
		border : false,
		autoLoad : {
			url : 'framework/engine/view/view.do',
			params : {
				panelid : gridId,
				viewkey : 'mkAddressBook.qPublicNameCard.vPublicNamecard'
			},
			scripts : true
		},
		initParams : {
			gpUnit : '<%=clientName%>'
		}
	});
	
	panel.add(grid);
	panel.doLayout();
	
	panel.refresh = function(params){
		if(grid.refresh){
			grid.refresh(params);
		}
	}

	var initGridButton = function(){
		var tb = this.items.get(0).getTopToolbar();
		tb.insert(0, {
			text : '添加联系人',
			iconCls : 'icon-sys-btnadd',
			handler : function(){
				MixkyApp.desktop.openDocument('mkAddressBook.docPublicNameCard', 0, {F_UNIT_NAME:'<%=clientName%>'});
			}
		});
		this.items.get(0).doLayout();
	}
	initGridButton.defer(1000, grid);
});
</script>
<%
	}
%>