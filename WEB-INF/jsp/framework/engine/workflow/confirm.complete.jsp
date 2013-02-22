<%@ page contentType="text/html; charset=utf-8"%>
<%@ page import="com.mixky.engine.workflow.transaction.ClientData"%>
<%
	// 读取参数
	String panelid = request.getParameter("panelid");
	ClientData clientdata = (ClientData)request.getAttribute("clientdata");
	String processers = "";
	if(clientdata.processors!=null){
		for(int i=0;i<clientdata.processors.size();i++){
			processers = processers + clientdata.processors.get(i).getF_caption() + ";";
		}
	}
	String assistants = "";
	if(clientdata.assistants!=null){
		for(int i=0;i<clientdata.assistants.size();i++){
			assistants = assistants + clientdata.assistants.get(i).getF_caption() + ";";
		}
	}
	String readers = "";
	if(clientdata.readers!=null){
		for(int i=0;i<clientdata.readers.size();i++){
			readers = readers + clientdata.readers.get(i).getF_caption() + ";";
		}
	}
%>
<script language='javascript'>
Ext.onReady(function(){
	var panel = Ext.getCmp('<%=panelid%>');
	// 设置状态
	panel.setpWindow.step = Mixky.workflow.STEP_CONFIRM;
	// 设置按钮
	panel.setpWindow.showButtons(true, false);
	// 设置窗口标题
	panel.setpWindow.setFlowTitle('办理确认窗口');
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
			value:'办理完毕'
		},{
			fieldLabel:'当前节点',
			xtype: 'displayfield',
			value:'<%=clientdata.sourceNode.getF_caption()%>'
		},{
			fieldLabel:'目标节点',
			xtype: 'displayfield',
			value:'<%=clientdata.destNode.getF_caption()%>'
<%
	if(!"".equals(processers)){
%>
		},{
			fieldLabel:'主办人员',
			xtype: 'displayfield',
			value:'<%=processers%>'
<%
	}
	if(!"".equals(assistants)){
%>
		},{
			fieldLabel:'协办人员',
			xtype: 'displayfield',
			value:'<%=assistants%>'
<%
	}
	if(!"".equals(readers)){
%>
		},{
			fieldLabel:'阅读人员',
			xtype: 'displayfield',
			value:'<%=readers%>'
<%
	}
%>
		},{
			fieldLabel:'操作提示',
			xtype: 'displayfield',
			value:'点击完成后确认执行操作'
		}]
	});	
	panel.add(infopanel);
	panel.doLayout();

});
</script>
