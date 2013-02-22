<%@ page contentType="text/html; charset=utf-8"%>
<%@ page import="com.mixky.app.bpcoa.project.BpcProjectManager"%>
<%
String panelid = request.getParameter("panelid");
String projectid = request.getParameter("projectid");
String projecttitle = request.getParameter("projecttitle");
String comboDataString = BpcProjectManager.instance().getComboDataString(projectid);
%>
<script language='javascript'>
Ext.onReady(function(){

	var panel = Ext.getCmp('pnl-project-list');
	var winSelf = panel.findParentByType('window');
	var panelParent = Ext.getCmp('<%=panelid%>');
		
	var form = new Ext.form.FormPanel({
		frame : true, 
		autoScroll : true,
		layout:'form',
		border : false,
		labelWidth : 80,
		bodyStyle : "padding:10px;padding-left:0px;padding-right:23px",
		items : [{
		    anchor: '100%',
			fieldLabel : '要合并项目',
			xtype: 'textfield',
			value: '<%=projecttitle%>',
			disabled: true,
			editable: false
		    },{
			anchor: '100%',
			fieldLabel : '合并到项目',
			id: 'cmb',
			xtype: 'combo',
			store: <%=comboDataString%>,
			valueField : "id",
			displayField : 'f_title',
			triggerAction : 'all',
			selectOnFocus : true,
     		emptyText : '选择要合并的项目...',
			editable: false
		}]
	});
	
    panel.submit = function(){
    	var mainid = Ext.getCmp("cmb").getValue();
		var title = Ext.getCmp("cmb").getRawValue();
		if(title == ""){
			Ext.MessageBox.alert("提示","请选择要合并的项目！");
			return;
		} 
		//
		var confirmMsg = "请确认，是否把【<%=projecttitle%>】合并到【" + title + "】中？";
		Ext.MessageBox.confirm("操作提示", confirmMsg, function(btn){
			if(btn == 'yes'){
				BpcProjectAppDirect.combineProjects(mainid,<%=projectid%>,function(result){
					if(result && result.success){
					 	Ext.MessageBox.alert("提示","项目合并成功!");
					}else{
						Ext.MessageBox.alert("提示","项目合并失败!");
					}
					winSelf.close();
					panelParent.refresh();
				});	
			}
		});		
    }

	// 视图刷新
	panel.refresh = function(){
		form.getForm().load();
	};
	
	// 输出附加脚本 end
	panel.add(form);
	panel.doLayout();

	// 初始化视图数据
	panel.refresh();
});
</script>