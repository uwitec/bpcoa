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
	
	panel.F_TASK_ID = 0;
	panel.F_WORKLOG_ID = 0;
	
	var worklogId = Ext.id();
	var worklog = new Ext.Panel({
		region : 'center',
		id : worklogId,
		border : true,
		layout : 'fit',
		autoLoad : {
			//url : 'framework/engine/view/view.do',
			url : 'app/bpcoa/project/view.do',
			params : {
				viewkey : 'bpcProject.qWorklog.vList', 
				panelid : worklogId
			},
			scripts	: true
		}
	});
	
	var form = new Ext.form.FormPanel({
		region : 'north',
		height : 130,
		border : false,
		labelWidth : 50,
		padding : 5,
		items : [{
			xtype : 'hidden',
			name : 'F_WORKLOG_ID'
		}, {
			xtype : 'hidden',
			name : 'F_TASK_ID'
		}, {
			border : false,
			layout : 'column',
			items : [{
				border : false,
				layout : 'form',
				columnWidth : .6,
				items : {
					allowBlank : false,
					fieldLabel : '从',
					name : 'F_START_TIME',
					format : 'Y-m-d H:i',
					altFormats : 'Y-m-d H:i:s|m/d/Y|n/j/Y|n/j/y|m/j/y|n/d/y|m/j/Y|n/d/Y|m-d-y|m-d-Y|m/d|m-d|md|mdy|mdY|d|Y-m-d',
					xtype : 'datetimefield',
					anchor : '-10'
				}
			}, {
				border : false,
				layout : 'form',
				columnWidth : .4,
				items : {
					allowBlank : false,
					fieldLabel : '至',
					name : 'F_END_TIME',
					format : 'H:i',
					increment : 15,
					xtype : 'timefield',
					value : '17:00',
					anchor : '-10'
				}
			}]
		}, {
			allowBlank : false,
			fieldLabel : '日志',
			xtype : 'textarea',
			name : 'F_NOTE',
			anchor : '-10',
			height : 50
		}],
		buttonAlign : 'center',
		tbar : [{
			text : '添加日志',
			iconCls : 'icon-sys-btnadd',
			handler : function(){
				if(!form.getForm().isValid()){
					MixkyApp.showErrorMessage("表单数据填写非法，保存失败");
					return;
				}
				BpcProjectAppDirect.saveProjectTaskWorklog(form.getForm().getValues(), function(result, e){
					if(result && result.success){
						MixkyApp.showInfoMessage("任务日志保存完毕！");
						form.getForm().setValues({
							ID : 0,
							F_NOTE : ''
						});
						worklog.refresh();
					}else{
						MixkyApp.showErrorMessage("服务器端保存数据失败，请重试");
					}
				});
			}
		}]
	});
	
	var view = new Ext.Panel({
		layout : 'border',
		border : false,
		items : [form, worklog]
	});
	
	form.refresh = function(params){
		form.getForm().setValues({
			F_TASK_ID : panel.F_TASK_ID,
			F_WORKLOG_ID : panel.F_WORKLOG_ID,
			F_NOTE : params && params.F_NOTE ? params.F_NOTE : '',
			F_START_TIME : new Date().format('Y-m-d') + ' 09:00'
		});
	}
	
	panel.refresh = function(params){
		if(Ext.isDefined(params)){
			if(Ext.isDefined(params.F_WORKLOG_ID)){
				panel.F_WORKLOG_ID = params.F_WORKLOG_ID;
			}
			if(Ext.isDefined(params.F_TASK_ID)){
				panel.F_TASK_ID = params.F_TASK_ID;
			}
		}
		form.refresh(params);
		worklog.refresh(params);
	}
	//worklog.getTopToolbar().hide();
	panel.add(view);
	panel.doLayout();
});
</script>