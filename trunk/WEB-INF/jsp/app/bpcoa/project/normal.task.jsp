<%@ page contentType="text/html; charset=utf-8"%>
<%@ page import="java.util.Date"%>
<%@ page import="com.mixky.toolkit.DateUtil"%>
<%@page import="com.mixky.engine.organization.User"%>
<%@page import="com.mixky.app.certification.MixkyUserCertification"%>
<%@page import="com.mixky.app.mkoa.netfolder.FolderItem"%>
<%@page import="com.mixky.app.bpcoa.project.BpcProjectDao"%>
<%@page import="com.mixky.app.bpcoa.project.BpcProjectManager"%>
<%
	User user = MixkyUserCertification.instance().getUserInfo(request);
	String panelid = request.getParameter("panelid");
	String month = DateUtil.format(new Date(System.currentTimeMillis()), "yyyy-MM");
%>

<script language='javascript'>
Ext.onReady(function(){
	var panel = Ext.getCmp('<%=panelid%>');

	// 选择当前月
	var dateSelect = new Ext.form.DateField({
		value:'<%=month%>', 
		editable : false, 
		width : 70,
		format : 'Y-m',
		listeners : {
			'select' : function(){
				panel.refresh();
			}
		}
	});
	// 上月
	var btnPreMonth = new Ext.Action({
		iconCls : 'icon-sys-btnback',
		handler : function(){
			var date = dateSelect.getValue();
			dateSelect.setValue(date.add(Date.MONTH, -1).format('Y-m-d'));
			panel.refresh();
		}
	});
	// 下月
	var btnNextMonth = new Ext.Action({
		iconCls : 'icon-sys-btnnext',
		handler : function(){
			var date = dateSelect.getValue();
			dateSelect.setValue(date.add(Date.MONTH, 1).format('Y-m-d'));
			panel.refresh();
		}
	});

	var cboUser = new Ext.form.ComboBox({
		editable : false,
		lazyRender:true,
		triggerAction: 'all',
		mode: 'local',
		width : 80,
		store: new Ext.data.ArrayStore({
			id: 0,
			fields: [
				'value',
				'display'
			],
			data: [[0, '所有任务'], [1, '我的任务']]
		}),
		valueField: 'value',
		displayField: 'display',
		value : 0,
	    listeners : {
			select : function(){
				panel.refresh();
			}
	    }
	});
	
	var cboState = new Ext.form.ComboBox({
		editable : false,
		lazyRender:true,
		triggerAction: 'all',
		mode: 'local',
		width : 110,
		store: new Ext.data.ArrayStore({
			id: 0,
			fields: [
				'value',
				'display'
			],
			data: [[0, '所有任务'], [1, '仅显示未完成任务']]
		}),
		valueField: 'value',
		displayField: 'display',
		value : 0,
	    listeners : {
			select : function(){
				panel.refresh();
			}
	    }
	});
	
	var btnAddTask = new Ext.Action({
    	text : '添加任务',
    	iconCls : 'icon-sys-btnadd',
		menu : new Ext.menu.Menu({
			items : [{
	        	text : '根任务',
	        	iconCls : 'icon-app-bpcoa-project-roottask',
	        	handler : function() {
	        		panel.addProjectTask({
	        			F_PARENT_ID : 0
	        		});
	        	}
	        }, '-', {
	        	text : '子任务',
	        	iconCls : 'icon-app-bpcoa-project-subtask',
	        	handler : function() {
					var node = tree.getSelectionModel().getSelectedNode();
					if(node && node != null){
						var state = node.attributes.F_STATE;
						if(node.attributes.F_MANAGER_ID == Mixky.app.UserInfo.id && (state == '计划' || state == '执行')){
			        		panel.addProjectTask({
			        			F_PARENT_ID : node.attributes.key
			        		});
						}else{
							MixkyApp.showErrorMessage('状态不合法，不允许创建下级任务！');
						}
					}else{
						MixkyApp.showInfoMessage('请选择父任务节点！');
					}
	        	}
	        }]
		})
    });
	
	var btnEditTask = new Ext.Action({
    	text : '修改任务',
    	iconCls : 'icon-sys-edit',
    	handler : function(){
			var node = tree.getSelectionModel().getSelectedNode();
			if(node && node != null){
				MixkyApp.desktop.openDocument('bpcProject.docProjectTaskEditor', node.attributes.key);
			}else{
				MixkyApp.showInfoMessage('请选择需要编辑的任务！');
			}
    	}
    });
	
	var btnRefresh = new Ext.Action({
    	text : '刷新',
    	iconCls : 'icon-sys-refresh',
    	handler : function(){
    		panel.refresh();
    	}
    });

	var tree = new Ext.ux.tree.TreeGrid({
		region : 'center',
		border : false,
        rootVisible : false,
        autoExpandColumn : 'F_DESCRIBE',
        tbar : [btnPreMonth, dateSelect, btnNextMonth, '-', '负责人：', cboUser, '-', '状态：', cboState, '->', btnAddTask, '-', btnEditTask,'-', btnRefresh],
        contextMenu : new Ext.menu.Menu({items : [btnAddTask, '-', btnEditTask,'-', btnRefresh]}),
		columns:[{
			header: '标题',
			dataIndex: 'F_TITLE',
			width: 230,
			tpl : new Ext.XTemplate(
					'<tpl if="F_ITEMS!=0"><b></tpl>',
					'{F_TITLE}',
					'<tpl if="F_ITEMS!=0"></b></tpl>'
				)
		}, {
			dataIndex: 'F_PROGRESS',
			hidden : true
		}, {
			dataIndex: 'F_MANAGER_ID',
			hidden : true
		}, {
			dataIndex: 'F_CREATE_TYPE',
			hidden : true
		}, {
			header: '负责人',
			dataIndex: 'F_MANAGER_NAME',
			width: 65,
			tpl : new Ext.XTemplate(
				'<tpl if="F_MANAGER_ID == <%=user.getId()%>"><font color=blue></tpl>',
				'{F_MANAGER_NAME}',
				'<tpl if="F_MANAGER_ID == <%=user.getId()%>"></font></tpl>'
			)
		}, {
			header: '类型',
			dataIndex: 'F_TYPE',
			width: 60
		}, {
			header: '状态',
			dataIndex: 'F_STATE',
			width: 50,
			tpl : new Ext.XTemplate(
				'<tpl if="F_STATE == \'执行\'">{F_PROGRESS}%</tpl>',
				'<tpl if="F_STATE != \'执行\'">{F_STATE}</tpl>'
			)
		}, {
			header: '开始日期',
			dataIndex: 'F_START_DATE',
			width: 70
		}, {
			header: '结束日期',
			dataIndex: 'F_END_DATE',
			width: 70
		}],
        loader: new Ext.tree.TreeLoader({
            directFn : BpcProjectAppDirect.loadNormalTaskTree,
        	paramOrder : ['month', 'taskId', 'userId', 'stateFlag'],
        	baseParams : {userId : 0, stateFlag : 0, taskId:0},
        	listeners : {
        		'beforeload' : function(loader, node){
        			var taskId = 0;
        			if(node.attributes.key){
        				taskId = node.attributes.key;
        			}
        			var params = {
        				month : dateSelect.getRawValue(), 
        				userId : cboUser.getValue(), 
        				stateFlag: cboState.getValue(), 
        				taskId : taskId
        			};
        			Ext.apply(loader.baseParams, params);
        		},
        		'load' : function(loader, node, response){
    				panel.setViewEnable();
        		}
        	}
		}),
		listeners : {
	        'contextmenu' : function(node, e){
	        	node.select();
	            this.contextMenu.showAt(e.getXY());
			},
			'destroy' : function(){
				Ext.destroy(this.contextMenu);
				this.contextMenu = null;
			}
		}
	});
	
	var detailId = Ext.id();
	var detail = new Ext.Panel({
		id : detailId,
		region : 'east',
        width: 450,
        minSize: 200,
        maxSize: 600,
		split : true,
        collapseMode:'mini',
        collapsible: false,
        layout : 'fit',
        border : false,
        title : '任务进度',
		autoLoad : {
			url : 'page.do',
			params : {
				url : 'app/bpcoa/project/project.task.detail',
				panelid : detailId,
			},
			scripts : true
		},
		panel : panel
	});
	
	var view = new Ext.Panel({
		disabled : true,
		layout : 'border',
		title : '任务进度管理',
		border : false,
		items : [tree, detail]
	});
	
	panel.setViewEnable = function(){
		view.enable();
	}
	
	panel.addProjectTask = function(values){
		if(!values){
			values = {};
		}
		var v = Ext.applyIf(values, {
			F_TITLE:'新建任务'
		});
		MixkyApp.desktop.openDocument('bpcProject.docProjectTaskAdd', false, v);
	}
	
	tree.getSelectionModel().on('selectionchange', function(sm, node){
		var ns = sm.getSelectedNode();
		if(ns && ns != null){
			detail.loadTask(node.attributes.key);
		}
	})
	
	panel.refresh = function(params){
		tree.getRootNode().reload();
		detail.loadTask(0);
		view.disable();
	}
	
	panel.add(view);
	panel.doLayout();
});
</script>