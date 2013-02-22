<%@ page contentType="text/html; charset=utf-8"%>
<%@ page import="com.mixky.engine.view.View"%>
<%@ page import="com.mixky.engine.organization.User"%>
<%@ page import="com.mixky.engine.organization.OrganizationUIMenu"%>
<%@ page import="com.mixky.engine.authority.AuthorityManager"%>
<%@ page import="com.mixky.app.certification.MixkyUserCertification"%>
<%
	User user = MixkyUserCertification.instance().getUserInfo(request);
	// 读取参数
	String panelid = request.getParameter("panelid");
	View view = (View)request.getAttribute("view");
	boolean isSysManager = AuthorityManager.instance().isUserHasModuleRole(user, "mkTask.mrManager");
	OrganizationUIMenu orgMenu = new OrganizationUIMenu();
	orgMenu.setFnScope("taskMenuPlugin");
	orgMenu.setFnSelected("fnUserSelected");
%>
<script language='javascript'>
Ext.onReady(function(){
	
	var panel = Ext.getCmp('<%=panelid%>');
	// 设置视图当前记录时间
	panel.currentDate = new Date();
	var sDate = panel.currentDate.getFirstDateOfMonth();
	sDate = sDate.add(Date.DAY, -sDate.getDay()+1);
	var eDate = panel.currentDate.getLastDateOfMonth();
	eDate = eDate.add(Date.DAY, eDate.getDay()+1);
	// 用户选择菜单
	var fnUserSelected = function(a, e){
		switch(taskMenuPlugin.userFieldId){
		case "Manager":
			taskMenuPlugin.rec.set("ManagerId", a.recid);
			taskMenuPlugin.rec.set("Manager", a.text);
			break;
		case "Responsible":
			taskMenuPlugin.rec.set("ResponsibleId", a.recid);
			taskMenuPlugin.rec.set("Responsible", a.text);
			break;
		}
	}
	var menuOrganization = <%=orgMenu.getRootJson().toString()%>
	// 根据任务记录校验身份 系统管理员
	var isTaskAdministrator = function(rec){
		return <%=isSysManager%>;
	}
	// 根据任务记录校验身份 任务管理者
	var isTaskManager = function(rec){
		return rec && rec.get("ManagerId") == Mixky.app.UserInfo.id;
	}
	// 根据任务记录校验身份 任务负责人
	var isTaskResponsible = function(rec){
		return rec && rec.get("ResponsibleId") == Mixky.app.UserInfo.id;
	}
	// 是否允许记录编辑
	var isTaskEditable = function(rec){
		return isTaskManager(rec) || isTaskResponsible(rec) || isTaskAdministrator(rec);
	}
	
	var store = new Ext.ux.maximgb.tg.AdjacencyListStore({
		defaultExpanded : true,
		autoLoad : false,
		batch : true,
		proxy : new Ext.data.DirectProxy({
			directFn : TaskAppDirect.loadTasks,
			paramsAsHash : true,
			paramOrder : ['startDate','endDate','states'],
			baseParams : {
				startDate : '',
				endDate : '',
				states : ''
			},
			api : {
				create : TaskAppDirect.createTask,
				update : TaskAppDirect.updateTask,
				destroy : TaskAppDirect.destroyTask
			}
        }),
        writer : new Ext.data.JsonWriter({
    		encode : false,
    		writeAllFields: false
    	}),
	    reader: new Ext.data.JsonReader({
		    idProperty : 'Id', 
		    root: 'results',
			totalProperty: 'totals',
			successProperty:'success'
		},[
			// Mandatory fields
			{name:'Id'},
			{name:'Name', type:'string'},
			{name:'StartDate', type : 'date', dateFormat:'Y-m-d h:i:s'},
			{name:'EndDate', type : 'date', dateFormat:'Y-m-d h:i:s'},
			{name:'PercentDone'},
			{name:'ParentId', type: 'auto'},
			{name:'IsLeaf', type: 'bool'},

			// Your task meta data goes here
			{name:'Note'},
			{name:'Result'},
			{name:'Duration'},
			{name:'Manager'},
			{name:'ManagerId'},
			{name:'Responsible'},
			{name:'ResponsibleId'},
			{name:'WorkloadPlan'},
			{name:'State'}
		])
    });
    
	var dependencyStore = new Ext.data.Store({
		autoLoad : false,
		batch : true,
		proxy : new Ext.data.DirectProxy({
			directFn : TaskAppDirect.loadTaskDependences,
			paramsAsHash : true,
			paramOrder : ['startDate','endDate','states'],
			baseParams : {
				startDate : '',
				endDate : '',
				states : ''
			},
			api : {
				create : TaskAppDirect.createTaskDependence,
				update : TaskAppDirect.updateTaskDependence,
				destroy : TaskAppDirect.destroyTaskDependence
			}
		}),
        writer : new Ext.data.JsonWriter({
    		encode : false,
    		writeAllFields: true
    	}),
	    reader: new Ext.data.JsonReader({
		    idProperty : 'Id', 
		    root: 'results',
			totalProperty: 'totals',
			successProperty:'success'
		},[
			// 3 mandatory fields
			{name:'Id'},
			{name:'From'},
			{name:'To'},
			{name:'Type'}
		])
	});

	var cboInterval = new Ext.form.ComboBox({
		editable : false,
		lazyRender:true,
		triggerAction: 'all',
	    mode: 'local',
	    width : 60,
	    store: new Ext.data.ArrayStore({
	        id: 0,
	        fields: [
	            'value',
	            'display'
	        ],
	        data: [[Date.WEEK, '按周'], [Date.MONTH, '按月'], [Date.QUARTER, '按季度'], [Date.YEAR, '按年']]
	    }),
	    valueField: 'value',
	    displayField: 'display',
	    value : Date.MONTH,
	    listeners : {
			select : function(){
				panel.updateViewColumn();
				panel.refresh();
			}
	    }
	});

	var cboState = new Ext.form.ComboBox({
		editable : false,
		lazyRender:true,
		triggerAction: 'all',
		mode: 'local',
		width : 90,
		store: new Ext.data.ArrayStore({
			id: 0,
			fields: [
				'value',
				'display'
			],
			data: [[0, '自动'], [1, '显示已关闭任务'], [99, '显示所有任务']]
		}),
		valueField: 'value',
		displayField: 'display',
		value : 0,
	    listeners : {
			select : function(){
				panel.refresh();
			}
	    }
	})

	var cboHighlight = new Ext.form.ComboBox({
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
			data: [['none', '无'], ['ResponsibleId', '我负责的任务'], ['ManagerId', '我管理的任务']]
		}),
		valueField: 'value',
		displayField: 'display',
		value : 'none'
	})


	

	
	panel.calStoreParams = function(){
		var interval = cboInterval.getValue();
		var state = cboState.getValue();
		var d = panel.currentDate;
		var startDate, endDate, states;
		switch (interval){
		case Date.WEEK : 
			startDate = d.add(Date.DAY, -d.getDay());
			endDate = startDate.add(Date.DAY, 7);
			break;
		case Date.MONTH : 
			startDate = d.getFirstDateOfMonth();
			endDate = d.getLastDateOfMonth();
			break;
		case Date.QUARTER :
			startDate = d.getFirstDateOfMonth();
			startDate = startDate.add(Date.MONTH, -(startDate.getMonth() % 3));
			endDate = startDate.add(Date.MONTH, 3);
			endDate = endDate.add(Date.DAY, -1);
			break;
		case Date.YEAR : 
			startDate = new Date(d.getFullYear(), 0, 1);
			endDate = new Date(d.getFullYear() + 1, 0, 1);
			endDate = endDate.add(Date.DAY, -1);
			break;
		}
		switch (state){
		case 0:
			states = "计划,执行,完成";
			break;
		case 1:
			states = "计划,执行,完成,关闭";
			break;
		case 99:
			states = "计划,执行,完成,关闭,挂起";
			break;
		}
		return {
			startDate : startDate.format('Y-m-d'),
			endDate : endDate.format('Y-m-d'),
			states : states
		}
	}
		
	// 任务条右键菜单
	var taskMenuPlugin = new Sch.gantt.plugins.TaskContextMenu();
	taskMenuPlugin.itemPlus = ['-', {
		id : 'Managr',
		text : '变更管理者',
		menu : menuOrganization,
		listeners : {
			'activate' : function(a, e){
				taskMenuPlugin.userFieldId = 'Manager';
			}
		}
	}, {
		id : 'Responsible',
		text : '变更负责人',
		menu : menuOrganization,
		listeners : {
			'activate' : function(a, e){
				taskMenuPlugin.userFieldId = 'Responsible';
			}
		}
	}, {
		id : 'State',
		text : '变更状态',
		menu : new Ext.menu.Menu({
			plain: true,
			defaults : {
                checked : false,
                group : 'state',
                scope : taskMenuPlugin,
                handler : function(a, e){
					this.rec.set('State', a.text);
				}
			},
			items : [{
				text : '计划'
			}, {
				text : '执行'
			}, {
				text : '完成'
			}, {
				text : '关闭'
			}, {
				text : '挂起'
			}],
			setState : function(state){
				var s = this.find('text', state);
				if(s.length > 0){
					s[0].setChecked(true);
				}
			}
		})
	}]
	var gantt = new Sch.TreeGanttPanel({
		border : false,
		leftLabelField : 'Name',
		highlightWeekends : true,
		showTodayLine : true,
		loadMask : true,
		trackMouseOver : false,
		stripeRows : true,
		cascadeChanges : false,
		timeColumnDefaults : { width : 150 },
		tbar : [{
			text : '创建新任务',
			iconCls : 'icon-sys-add',
			handler : function(){
				var newTask = new store.recordType({
	                PercentDone: 0,
	                Name: '新任务',
	                StartDate: panel.currentDate,
	                EndDate: panel.currentDate.add(Date.DAY, 1),
	                IsLeaf: true
	            });
	            store.add([newTask]);
			}
		}, '-','区间设置：', {
			iconCls : 'icon-sys-previous',
			handler : function(){
				panel.currentDate = panel.currentDate.add(cboInterval.getValue(), -1);
				panel.refresh();
				panel.updateViewColumn();
			}
		}, cboInterval,{
			iconCls : 'icon-sys-next',
			handler : function(){
				panel.currentDate = panel.currentDate.add(cboInterval.getValue(), 1);
				panel.refresh();
				panel.updateViewColumn();
			}
		}, '-', '筛选：', cboState, '-', '->', {
			text : '全部收起',
			iconCls : 'icon-sys-up',
			handler : function() {
				gantt.store.collapseAll();
			}
		}, {
			text : '全部展开',
			iconCls : 'icon-sys-down',
			handler : function() {
				gantt.store.expandAll();
			}
		}, '-','突出显示：', cboHighlight, '-', {
			text : '刷新',
			iconCls : 'icon-sys-refresh',
			handler : function(){
				panel.refresh();
			}
			
		}],
		fnEventEditable : function(a, b){
			return isTaskEditable(b);
		},
		plugins : [taskMenuPlugin, new ConnectorLinePlugin(),
			this.editor = new Sch.plugins.EventEditor({
				height : 260,
				width : 350,
				buttonAlign : 'right',
				fieldsPanelConfig : {
					layout : 'form',
					style:'background:#fff',
					border : false,
					cls : 'editorpanel',
					defaults : {
						anchor : '100%'
					},
					labelWidth : 40,
					buttonAlign : 'right',
					items : [
						titleField = new Ext.form.TextField({
							name : 'Name',
							fieldLabel : '标题',
							allowBlank : false
						}), new Ext.form.TextArea({
							name : 'Note',
							fieldLabel : '描述'
						}), {
							layout : 'column',
							border : false,
							items : [{
								columnWidth : .45,
								layout : 'form',
								labelWidth : 70,
								border : false,
								items : new Ext.ux.form.SpinnerField({
									name : 'PercentDone',
									fieldLabel : '进度（%）',
									anchor : '100%',
									incrementValue : 10,
									maxValue : 100,
									minValue : 0,
									allowBlank: false
								})
							},{
								columnWidth : .55,
								layout : 'form',
								labelWidth : 90,
								border : false,
								items : new Ext.form.NumberField({
									name : 'WorkloadPlan',
									anchor : '100%',
									fieldLabel : '工作量（小时）'
								})
							}]
						}, new Ext.form.TextArea({
							name : 'Result',
							fieldLabel : '结果'
						})
					]
				},
				saveHandlerScope : gantt,
				saveHandler : function(editor, start, end, record){
					var form = editor.getForm();
					if(!form.isDirty()){
						editor.collapse(false);
					}else if(form.isValid()){
						var values = form.getValues();
						record.beginEdit();
						record.set('StartDate', start);
						record.set('EndDate', end);
						for(n in values){
							if(n != 'StartDate' && n != 'EndDate'){
								record.set(n, values[n]);
							}
						}
						record.endEdit();
						editor.collapse(false);
					}
				},
				listeners : {
					expand : function() {
						titleField.focus(true);
					}
				}
			})
        ],
		tooltipTpl : new Ext.XTemplate(
			'<h4 class="tipHeader">{Name}（{State}）</h4>',
			'<table class="taskTip" width=100%>', 
				'<tr><td>开始:</td> <td align="right">{[values.StartDate.format("Y-m-d")]}</td></tr>',
				'<tr><td>结束:</td> <td align="right">{[values.EndDate.format("Y-m-d")]}</td></tr>',
				'<tr><td>工作量:</td> <td align="right">{WorkloadPlan}小时</td></tr>',
				'<tr><td>进度:</td><td align="right">{PercentDone}%</td></tr>',
				'<tr><td>管理者:</td><td align="right">{Manager}</td></tr>',
				'<tr><td>负责人:</td><td align="right">{Responsible}</td></tr>',
				'<tr><td colspan=2><B>描述：</B>{Note}</td></tr>',
				'<tr><td colspan=2><B>结果：</B>{Result}</td></tr>',
			'</table>'
		).compile(),
        viewModel : {
            start : sDate, 
            end : eDate, 
            columnType : 'weekAndDays',
            viewBehaviour : Sch.ViewBehaviour.WeekView
        },
        store : store,
        dependencyStore : dependencyStore,
		colModel : new Ext.ux.grid.LockingColumnModel({
			columns : [{
				header : '标题', 
				sortable:true, 
				dataIndex : 'Name', 
				locked : true,
				width:180, 
				editor : new Ext.form.TextField(),
				renderer : function (v, m, r) {
					if (r.get('IsLeaf')) {
						m.css = 'task';
					} else {
						m.css = 'parent';
					}
					return v;
				}
			},{
				header : '状态', 
				width:50, 
				dataIndex : 'State', 
				locked : true
			},{
				header : '管理者', 
				width:50, 
				dataIndex : 'Manager', 
				locked : true
			},{
				header : '负责人',
				width:50, 
				dataIndex : 'Responsible', 
				locked : true,
			},{
				header : '开始日期', 
				sortable:true, 
				width:80, 
				dataIndex : 'StartDate', 
				locked : true,
				renderer: Ext.util.Format.dateRenderer('Y-m-d'),
				editor : new Ext.form.DateField({format: 'Y-m-d'})
			},{
				header : '持续', 
				sortable:true, 
				width:40, 
				dataIndex : 'Duration', 
				renderer: function(v, m, r) {
					var d = Math.round(Date.getDurationInHours(r.get('StartDate'), r.get('EndDate'))/12) / 2;
					if (d > 0) {
						return d + '天';
					}
				}, 
				locked : true, 
				editor: new Ext.ux.form.SpinnerField({
				allowBlank:false,
					minValue : 0,
					decimalPrecision: 1,
					incrementValue : 1
				})
			},{
				header : '进度％', 
				sortable:true, 
				width:50, 
				dataIndex : 'PercentDone', 
				renderer: function(v, m, r) {
					return typeof v === 'number' ? (v + '%') : '';
				}, 
				locked : true, 
				editor: new Ext.ux.form.SpinnerField({
					allowBlank:false,
					minValue : 0,
					maxValue : 100,
					incrementValue : 10
				})
			}]
		})
	});
	// 更新显示区间
	panel.updateViewColumn = function(){
		var interval = cboInterval.getValue();
		var d = panel.currentDate;
		var startDate, endDate, type;
		switch (interval){
		case Date.WEEK : 
			startDate = d.add(Date.DAY, -d.getDay()+1);
			endDate = startDate.add(Date.DAY, 7);
			type = 'weekAndDays';
			break;
		case Date.MONTH : 
			startDate = d.getFirstDateOfMonth();
			startDate = startDate.add(Date.DAY, -startDate.getDay()+1);
			endDate = d.getLastDateOfMonth();
			endDate = endDate.add(Date.DAY, endDate.getDay()+1);
			type = 'weekAndDays';
			break;
		case Date.QUARTER :
			startDate = d.getFirstDateOfMonth();
			startDate = startDate.add(Date.MONTH, -(startDate.getMonth() % 3));
			endDate = startDate.add(Date.MONTH, 3);
			endDate = endDate.add(Date.DAY, -1);
			type = 'monthAndQuarters';
			break;
		case Date.YEAR : 
			startDate = new Date(d.getFullYear(), 0, 1);
			endDate = new Date(d.getFullYear() + 1, 0, 1);
			endDate = endDate.add(Date.DAY, -1);
			type = 'monthAndQuarters';
			break;
		}
		gantt.setView(startDate, endDate, type);
	}
	// 处理图突出显示
	cboHighlight.on('select', function(c, r, i){
		var v = r.get('value');
		gantt.clearSelectedTasksAndDependencies();
		gantt.getView().mainBody.select(gantt.eventSelector + ':not(.' + gantt.getSelectionModel().selectedClass + ')').setOpacity(1);
		if(v != 'none'){
			store.each(function(rec){
				var hl;
				switch(v){
				case 'ManagerId':
					hl = isTaskManager(rec);
					break;
				case 'ResponsibleId':
					hl = isTaskResponsible(rec);
					break;
				}
				if(hl){
					gantt.highlightTask(rec);
				}
			})
			gantt.getView().mainBody.select(gantt.eventSelector + ':not(.' + gantt.getSelectionModel().selectedClass + ')').setOpacity(0.1);
		}
	})
	// 处理菜单权限
	taskMenuPlugin.on('beforecontextmenu', function(p, m, r){
		m.findById('State').menu.setState(r.get('State'));
	})
    
	var beforeEdit = function(o) {
		// Set the duration field to help the editor get the value
		o.cancel = (o.field === 'Duration' || o.field === 'StartDate') && !o.record.store.isLeafNode(o.record);
		// 判断是否管理员或负责人
		o.cancel = o.cancel || !isTaskEditable(o.record)
        
		if (!o.cancel && o.field === 'Duration') {
			var r = o.record,
				durationDays = Math.round(Date.getDurationInHours(r.get('StartDate'), r.get('EndDate'))/12) / 2;
            
			r.set('Duration', durationDays);
		}
	}
	var afterEdit = function(o) {
		if (o.field === 'Duration') {
			var start = o.record.get('StartDate');
			o.record.set('EndDate', start.add(Date.HOUR, o.value * 24));
		} else if (o.field === 'StartDate') {
			var dur = o.record.get('EndDate') - o.originalValue;
			o.record.set('EndDate', o.value.add(Date.MILLI, dur));
		}
	}
	
	panel.refresh = function(){
		store.removeAll(true);
		store.commitChanges();
		dependencyStore.removeAll(true);
		dependencyStore.commitChanges();
		var params = panel.calStoreParams();
		dependencyStore.load({params : params});
		store.load({params : params});
	}
	
	panel.add(gantt);
	panel.doLayout();
	
	gantt.on({
		'beforeedit': beforeEdit, 
		'afteredit': afterEdit,
		scope : gantt
	});

	panel.refresh();
});
</script>