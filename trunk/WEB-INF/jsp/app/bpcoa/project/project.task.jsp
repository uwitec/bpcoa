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
	        	iconCls : 'icon-app-bpcoa-project-taskroot',
	        	handler : function() {
	        		panel.addProjectTask({
	        			F_PARENT_ID : 0
	        		});
	        	}
	        }, '-', {
	        	text : '子任务',
	        	iconCls : 'icon-app-bpcoa-project-tasksub',
	        	handler : function() {
					var node = tree.getSelectionModel().getSelectedNode();
					if(node && node != null){
						var state = node.attributes.F_STATE;
						BpcProjectAppDirect.getTaskAuthority(node.attributes.key, function(result, e){
							if((result.isParentTaskManager || result.isTaskManager) && (state == '计划' || state == '执行' || !node.isLeaf())){

								//if(node.attributes.F_MANAGER_ID == Mixky.app.UserInfo.id && (state == '计划' || state == '执行' || !node.isLeaf())){
					        		panel.addProjectTask({
					        			F_PARENT_ID : node.attributes.key
					        			
					        		});
								}else{
									MixkyApp.showErrorMessage('状态不合法，不允许创建下级任务！');
								}
								
							//}
						});
					}else{
						MixkyApp.showInfoMessage('请选择父任务节点！');
					}
	        	}
	        }, '-', {
	        	text : '临时任务',
	        	iconCls : 'icon-app-bpcoa-project-tasktemp',
	        	handler : function() {
	        		panel.addProjectTask({
	        			F_TITLE : '新建临时任务',
	        			F_CREATE_TYPE : '临时'
	        		});
	        	}
	        }, '-', {
	        	text : '导入任务',
	        	iconCls : 'icon-sys-btnimport',
	        	handler : ImportTask
	        }]
		})
    });
	// 导入任务
	function ImportTask(){
		var panelImport = new Ext.Panel({
			id : 'pnl-import-task',
			layout : 'fit',
			autoLoad : {
				url : 'page.do',
				params : {
					url:'app/bpcoa/project/import.task',
					projectid: parseInt(panel.F_PROJECT_ID),
					parent_panelid: '<%=panelid%>'
				},
				loadScripts : true,
				scripts	: true
			}
		});
		var winImport = new Ext.Window({
			modal: true,
			title : '导入任务',
			manager : MixkyApp.desktop.getManager(),
			layout:'fit',
			width: 320,
			height:160,
			resizable: false,
			items: panelImport,
			buttons : ['->', 
			{
				text : '关闭',
				iconCls : 'icon-sys-cancel',
				handler : function(){
					winImport.close();
					panel.refresh();
				}
			}]
		});
		winImport.show();
	}
	//
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
        enableDD: true,
        dropConfig : {
        	allowParentInsert : true
        },
        tbar : ['负责人：', cboUser, '-', '状态：', cboState, '->', btnAddTask, '-', btnEditTask,'-', btnRefresh],
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
		refresh : function(node){
			if(!node){
				node = this.getSelectionModel().getSelectedNode();
			}
			if(!node || node.isLeaf()){
				return;
			}
			node.reload();
		},
        loader: new Ext.tree.TreeLoader({
            directFn : BpcProjectAppDirect.loadProjectTaskTree,
        	paramOrder : ['F_PROJECT_ID', 'taskId', 'userId', 'stateFlag'],
        	baseParams : {F_PROJECT_ID : 0, userId : 0, stateFlag : 0, taskId:0},
        	listeners : {
        		'beforeload' : function(loader, node){
        			var taskId = 0;
        			if(node.attributes.key){
        				taskId = node.attributes.key;
        			}
        			var params = {
        				userId : cboUser.getValue(), 
        				stateFlag: cboState.getValue(), 
        				F_PROJECT_ID : parseInt(panel.F_PROJECT_ID), 
        				taskId : taskId
        			};
        			Ext.apply(loader.baseParams, params);
        		},
        		'load' : function(loader, node, response){
        			if(panel.F_PROJECT_ID > 0){
        				panel.setViewEnable();
        			}
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
			},
			'beforenodedrop' : function(e){
				// TODO 判断是否允许拖拽
				
			},
			'dragdrop' : function(t, n, dd, e){
				var taskId = n.attributes.key;
				var parentId = 0;
				if(n.parentNode.getDepth() > 0){
					parentId = n.parentNode.attributes.key;
				}
				BpcProjectAppDirect.moveTask(taskId, parentId, function(result, event) {
					if (result && result.success) {
						// 刷新被更新过的父节点
					}else{
						MixkyApp.showErrorMessage('移动任务节点操作失败，请重试！');
						panel.refresh();
					}
				});
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
				panelid : detailId
			},
			scripts : true
		},
		panel : panel
	});
	
	var view = new Ext.Panel({
		disabled : true,
		layout : 'border',
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
			F_PROJECT_ID:panel.F_PROJECT_ID,
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
	
	panel.refreshNode = function(){
		
		var node = tree.getSelectionModel().getSelectedNode();
		if(!node){
			tree.getRootNode().reload();
		}
		
		node.parentNode.select();
		node.select();
		node.parentNode.reload();
	
	}
	
	panel.refresh = function(params,node){
		// 设置查询参数
		var projectId = 0;
		if(params && params.F_PROJECT_ID && params.F_PROJECT_ID != null){
			panel.F_PROJECT_ID = params.F_PROJECT_ID;
		}
		// 装载数据
		var node = tree.getSelectionModel().getSelectedNode();
		if(!node){
			tree.getRootNode().reload();
		}else{
			tree.getRootNode().reload();
			//tree.getNodeById(node.attributes.id).select();
		}
		detail.loadTask(node.attributes.key);
		if(node){
			
			tree.getNodeById(node.attributes.id).select();
		}
	}

	panel.F_PROJECT_ID = 0;
	if(panel.initParams && panel.initParams.F_PROJECT_ID){
		panel.F_PROJECT_ID = panel.initParams.F_PROJECT_ID;
	}
	
	panel.add(view);
	panel.doLayout();
});
</script>