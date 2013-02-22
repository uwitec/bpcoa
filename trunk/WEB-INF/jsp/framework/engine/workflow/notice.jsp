<%@ page contentType="text/html; charset=utf-8"%>
<%@ page import="com.mixky.engine.workflow.transaction.ClientData"%>
<%
	// 读取参数
	String panelid = request.getParameter("panelid");
	ClientData clientdata = (ClientData)request.getAttribute("clientdata");
%>
<script language='javascript'>
Ext.onReady(function(){
	var panel = Ext.getCmp('<%=panelid%>');
	// 设置状态
	panel.setpWindow.step = Mixky.workflow.STEP_ERROR;
	// 设置按钮
	panel.setpWindow.showButtons(false, false);
	// 设置窗口标题
	panel.setpWindow.setFlowTitle('错误信息提示');

	var infopanel = new Ext.form.FormPanel({
		bodyStyle: 'padding:20px;',
		layout:"form",
		border:false,
		frame:false,
		border:false,
		labelWidth:80,

		items:[{
			fieldLabel:'当前节点',
			xtype: 'displayfield',
			value:'<%=clientdata.sourceNode.getF_caption()%>'
		},{
			fieldLabel:'消息内容',
			xtype: 'displayfield',
			value:'<%=clientdata.message%>'
		}]
	});	
	panel.add(infopanel);
	panel.doLayout();
});
</script>
