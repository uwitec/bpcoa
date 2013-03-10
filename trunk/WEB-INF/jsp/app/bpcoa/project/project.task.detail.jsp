<%@ page contentType="text/html; charset=utf-8"%>
<%@page import="com.mixky.engine.organization.User"%>
<%@page import="com.mixky.app.certification.MixkyUserCertification"%>
<%@page import="com.mixky.app.mkoa.netfolder.FolderItem"%>
<%@page import="com.mixky.app.bpcoa.project.BpcProjectDao"%>
<%@page import="com.mixky.app.bpcoa.project.BpcProjectManager"%>
<%
	User user = MixkyUserCertification.instance().getUserInfo(request);
	String panelid = request.getParameter("panelid");
%>

<script language='javascript'>
Ext.onReady(function(){
	var panel = Ext.getCmp('<%=panelid%>');
	
	var formId = Ext.id();
	var form = new Ext.Panel({
		region : 'north',
		height : 150,
		id : formId,
		border : true,
		autoLoad : {
			url : 'page.do',
			params : {
				url : 'framework/engine/panels/common.form.simple', 
				panelid : formId, 
				formkey : 'bpcProject.T_BPCOA_PROJECT_TASK.frmSample'
			},
			scripts	: true
		},
		buttonAlign : 'center',
		tbar : [{
			text : '保存',
			iconCls : 'icon-sys-save',
			id:'12345',
			handler : function(){
				form. (panel.panel.refresh);
			}
		}, {
			text : '启动任务',
			iconCls : 'icon-sys-run',
			handler : function(){
				form.setValues({
					F_STATE : '执行'
				});
				form.saveRecord(panel.panel.refresh);
			}
		}, {
			text : '完成任务',
			iconCls : 'icon-sys-confirm',
			handler : function(){
				form.setValues({
					F_PROGRESS : 100,
					F_STATE : '完成'
				});
				form.saveRecord(panel.panel.refresh);
			}
		}, {
			text : '重新执行',
			iconCls : 'icon-sys-confirm',
			handler : function(){
				form.setValues({
					F_PROGRESS : 0,
					F_STATE : '执行'
				});
				form.saveRecord(panel.panel.refresh);
			}
		}, {
			text : '关闭任务',
			iconCls : 'icon-sys-close',
			handler : function(){
				//增加提示按钮
				Ext.Msg.confirm('关闭警告','关闭该任务将无法重新执行，您确定吗？',function(btn){
				if(btn == 'yes')
					{

						form.setValues({
							F_PROGRESS : 100,
							F_STATE : '关闭'
						});
						form.saveRecord(panel.panel.refresh);
					}
				});
			}
		}]
	});

	var worklogId = Ext.id();
	var worklog = new Ext.Panel({
		region : 'center',
		id : worklogId,
		border : true,
		layout : 'fit',
		title : '任务日志',
		autoLoad : {
			url : 'page.do',
			params : {
				url : 'app/bpcoa/project/project.task.worklog', 
				panelid : worklogId
			},
			scripts	: true
		}
	});
	
	var view = new Ext.Panel({
		layout : 'border',
		border : false,
		disabled : true,
		items : [form, worklog]
	});
	
	panel.onTaskLoaded = function(data){
		if(data.F_ITEMS == 0){
			BpcProjectAppDirect.getTaskAuthority(data.ID, function(result, e){
				if(result){
					switch(data.F_STATE){
					case '计划': 
						if(result.isTaskManager || result.isParentTaskManager){
							//alert(form.getTopToolbar().size());
							form.getTopToolbar().get(1).show();
							//form.buttons[1].show();
						}
						break;
					case '执行': 
						if(result.isTaskManager || result.isParentTaskManager){
							//form.buttons[0].show();
							//form.buttons[2].show();
							form.getTopToolbar().get(0).show();
							form.getTopToolbar().get(2).show();
						}
						break;
					case '完成': 
						if(result.isParentTaskManager){
							form.getTopToolbar().get(3).show();
							form.getTopToolbar().get(4).show();
							//form.buttons[3].show();
							//form.buttons[4].show();
						}
						break;
					case '撤销': 
						if(result.isTaskManager || result.isParentTaskManager){
							form.getTopToolbar().get(2).show();
							//form.buttons[2].show();
						}
						break;
					case '关闭': 
						break;
					}
				}
				form.doLayout();
			});
		}
	}
	
	panel.loadTask = function(taskId){
		// 屏蔽操作
		//form.getTopToolbar().hide();
		for(var i = 0;i<5;i++){
			form.getTopToolbar().get(i).hide();
		}
		// 装载数据
		panel.F_TASK_ID = taskId;
		if(taskId == 0){
			form.clearForm();
			worklog.refresh({F_TASK_ID : -1});
			view.disable();
		}else{
			form.loadRecord(taskId, panel.onTaskLoaded);
			worklog.refresh({F_TASK_ID : taskId});
			view.enable();
		}
	}
	
	panel.add(view);
	panel.doLayout();
});
</script>