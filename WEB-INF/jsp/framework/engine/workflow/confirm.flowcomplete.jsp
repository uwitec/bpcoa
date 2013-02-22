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
	panel.setpWindow.step = Mixky.workflow.STEP_CONFIRM;
	// 设置按钮
	panel.setpWindow.showButtons(true, false);
	// 设置窗口标题
	panel.setpWindow.setFlowTitle('流程结束确认窗口');
	// 提交确认
	panel.beforeSubmit = function(params){
		return true;
	}

	var infopanel = new Ext.form.FormPanel({
		bodyStyle: 'padding:20px;',
		layout:"form",
		border:false,
		frame:false,
		border:false,
		labelWidth:80,

		items:[{
			fieldLabel:'执行操作',
			xtype: 'displayfield',
			value:'结束流程办理'
		},{
			fieldLabel:'当前节点',
			xtype: 'displayfield',
			value:'<%=clientdata.sourceNode.getF_caption()%>'
		},{
			fieldLabel:'操作提示',
			xtype: 'displayfield',
			value:'点击完成后结束流程办理'
		}]
	});	
	panel.add(infopanel);
	panel.doLayout();
});
</script>
