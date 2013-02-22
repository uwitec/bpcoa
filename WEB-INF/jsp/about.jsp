<%@ page contentType="text/html; charset=utf-8"%>
<%@page import="com.mixky.app.mkoa.admin.ConfigrationManager"%>
<%@page import="com.google.gson.JsonObject"%>
<%
	String panelid = request.getParameter("panelid");
	JsonObject json = ConfigrationManager.instance().getLocalConfiguration();
%>

<script language='javascript'>
Ext.onReady(function(){
	var panel = Ext.getCmp('<%=panelid%>');

	var aboutForm = new Ext.form.FormPanel({
		frame: true,
		border : false,
		defaults : {border: false, style:'text-align: center;'},
		bodyStyle : 'padding:5px;',
		items : [{
			html: '<a href="http://oa.mixky.cn" target="_blank"><image src="resources/images/logo/64.png"/></a>'
		}, {
			html: '<span style="line-height:32px"><a href="http://oa.mixky.cn" target="_blank"><%=json.get("ProductName").getAsString()%></a></span>'
		}, {
			html: '<span><b>版本</b>：<%=json.get("ProductVersion").getAsString()%>　许可<%=json.get("ProductLicenses").getAsString()%>用户</span>'
		}, {
			html: '<span><b>产品号</b>：<%=json.get("ProductSN").getAsString()%></span><br><br><hr>'
		}, {
			html: '<span><a href="http://www.mixky.cn" target="_blank">北京创想天空科技有限公司</a></span>'
		}, {
			html: '<span>All Rights Reserved.</span>'
		}]
	});


	panel.add(aboutForm);
	
	panel.doLayout();
	
});
</script>