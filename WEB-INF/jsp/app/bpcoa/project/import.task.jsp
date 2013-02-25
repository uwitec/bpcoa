<%@ page contentType="text/html; charset=utf-8"%>
<%@ page import="com.mixky.app.bpcoa.project.BpcProjectManager"%>
<%
String parent_panelid = request.getParameter("parent_panelid");
String projectid = request.getParameter("projectid");
%>
<script language='javascript'>
Ext.onReady(function(){
	var panel = Ext.getCmp('pnl-import-task');
	var winSelf = panel.findParentByType('window');
	var panelParent = Ext.getCmp('<%=parent_panelid%>');

	var btnImport =  new Mixky.plugins.UploadButton({
		text : "导入任务",
		iconCls : "icon-sys-btnimport",
		uploadConfig : {
    		file_types : '*.xls;*.xlsx',
			upload_url : 'servlet/app/bpcproject.import',
			post_params : {
				project_id : <%=projectid%>,
				userkey: Mixky.app.UserInfo.login
			},
			listeners : {
				'allUploadsComplete' : function(){
					winSelf.close();
					panelParent.refresh();
				},
				'startUpload': function(){
					var tmplTypeValue = Ext.getCmp("comboTmplType").getValue();
					this.addPostParam('tmpl_type', tmplTypeValue);
				}
			}
		}
	});
	
	var btnDownTmpl =  new Ext.Action({
		text : "下载模板",
		iconCls : "icon-sys-download",
		handler: function() {
			var tmplTypeValue = Ext.getCmp("comboTmplType").getValue();
			if (0 == tmplTypeValue){// 普通任务模板
				location.href = 'resources/excelmodel/task.normal.xls';
			}else if (1 == tmplTypeValue){// 现场调试任务模板
				location.href = 'resources/excelmodel/task.site.xls';
			}
		}
	});
	var form = new Ext.form.FormPanel({
		frame : true, 
		autoScroll : true,
		layout:'form',
		border : false,
		labelWidth : 70,
		bodyStyle : "padding:10px;padding-left:0px;padding-right:23px",
		items : [{
			id: 'comboTmplType',
			xtype: 'combo',
			anchor: '100%',
			triggerAction : 'all',
			editable: false,
			selectOnFocus : true,
			fieldLabel : '模板类型',
			store: [[0, '常规任务模板'], [1, '现场调试任务模板']],
			valueField: 'value',
			displayField: 'display',
			value : 0
		}],
		bbar: [btnImport,'-',btnDownTmpl]
	});

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