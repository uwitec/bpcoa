/*!
 * Ext JS Library 3.0.0
 * Copyright(c) 2006-2009 Ext JS, LLC
 * licensing@extjs.com
 * http://www.extjs.com/license
 */

Ext.namespace("Mixky.app.common");

Mixky.app.common.getOrganizationWindow = function(config, value, fn){
	
	config = Ext.apply({
	    selectMulti : true,
	    selectType : 'mix',
	    valueField : 'expression',
	    displayField : 'f_caption',
	    valueSeparator : ';'
	}, config);
	
	if(!Mixky.app.common.OrganizationWindow){
		var tree = new Ext.tree.TreePanel({
			region : 'center',
	    	autoScroll:true,
	    	rootVisible :false,
	    	root: {
				nodeType: 'async',
	            text: '人员选择',
	            id : 'root-organization'
	        },
	        loader: new Ext.tree.TreeLoader({
	            directFn: OrganizationAppDirect.getOrganizationTree,
	            paramOrder : ['type'],
	        	baseParams : {type:'mix'},
	        	preloadChildren : true
	        }),
	        tools:[{
	        	id:'refresh',
	        	handler:function(){
		        	tree.refresh();
		        }
	        }],
			refresh:function(){
	        	this.getRootNode().reload();
	        }
		});
		// 用户列表框
		var grid = new Ext.grid.GridPanel({
			region : 'east',
	        width: 300,
	        minSize: 200,
	        maxSize: 400,
	        split:true,
			autoExpandColumn:'f_note',
			enableHdMenu:false,
			enableColumnMove:false,
			store : new Ext.data.DirectStore({
				directFn : OrganizationAppDirect.getUserList,
				paramOrder:['expression'],
				baseParams : {
					key : 'expression'
				},
				root : 'results',
				totalProperty : 'totals',
				idProperty : 'id',
				fields:[
				    {name:'id',mapping:'id'},
				    {name:'f_name',mapping:'f_name'},
				    {name:'f_caption',mapping:'f_caption'},
				    {name:'f_note',mapping:'f_note'},
				    {name:'expression',mapping:'expression'}
				]
			}),
			columns : [new Ext.grid.RowNumberer(),{
				id:'f_caption',
				dataIndex:'f_caption',
				width:80,
				sortable: true,
				header:'用户名'
			},{
				id:'f_name',
				dataIndex:'f_name',
				width:100,
				sortable: true,
				header:'登录名'
			},{
				id:'f_note',
				dataIndex:'f_note',
				header:'备注'
			}],
			// 装载用户列表
			loadExpression:function(expression){
				this.getStore().baseParams.expression = expression;
				this.getStore().reload();
			}
		});
		// 已选择组织结构对象框
		var selectedbox = new Ext.DataView({
			region : 'south',
	        split :true,
	        height : 60,
	        minSize : 50,
	        maxSize : 250,
	        style : 'background-color:white',
	        tpl:new Ext.XTemplate(
	        	'<tpl for=".">',
	                '<div class="user-expression-item icon-sys-{type}" id="{expression}">{f_caption}</div>',
	            '</tpl>',
	            '<div class="x-clear"></div>'
	        ),
	        selectedClass:'x-user-expression-view-selected',
	        overClass:'x-user-expression-view-over',
	        itemSelector:'div.user-expression-item',
	        multiSelect: true,
	        plugins: [
	            new Ext.DataView.DragSelector()
	        ],
	        store : new Ext.data.JsonStore({
	        	idProperty: 'expression', 
	        	fields: ['expression', 'type', 'id', 'f_name', 'f_caption', 'f_note']
	        })
		});
		// 定义窗口
		var win = new Ext.Window({
			manager : MixkyApp.desktop.getManager(),
			title : '人员选择',
			iconCls : 'icon-sys-organization',
	        modal: true,
			layout:'border',
			border : false,
	        buttonAlign:'center',
			height : 400,
			width : 450,
			maximizable : false,
			minimizable : false,
			closeAction : 'hide',
			defaults : {border:false},
			items:[tree, grid, selectedbox],
	        buttons: [{
	            text: '确定',
	            iconCls:'icon-sys-confirm',
	            handler: function() {
					var records = selectedbox.getStore().getRange();
					var values = '', display = '';
					if(win.selectMulti && win.valueSeparator == ''){
						values = [];
					}
					var display = '';
					for(var i=0;i<records.length;i++){
						display = display + records[i].get(win.displayField) + ';';
						if(win.selectMulti && win.valueSeparator == ''){
							values.push(records[i].get(win.valueField));
						}else{
							values = values + records[i].get(win.valueField) + win.valueSeparator;
						}
					}
					win.onSelectedFn(display, values, records);
		    		win.hide();
	        	}
	        },{
	            text: '取消',
	            iconCls:'icon-sys-cancel',
	            handler: function() {
	        		win.hide();
	        	}
	        }]
		});
		// 已选择框右键菜单
		selectedbox.contextMenu = new Ext.menu.Menu({items:[{
			text:'移除选择',
			iconCls:'icon-sys-delete',
			handler:function(){
				selectedbox.removeSelected();
			}
		}]});
        // 选中表达式
		selectedbox.selectExpression = function(expression){
			// 判断多选
			if(!win.selectMulti && selectedbox.getStore().getCount() > 0){
				return;
			}
			// 服务器端解析表达式
			OrganizationAppDirect.getExpressionData(expression, win.selectType, function(result,e){
				// 添加
				for(var i=0;i<result.results.length;i++){
					var exp = result.results[i];
					var record = selectedbox.getStore().getById(exp.expression);
					if(!record){
						selectedbox.getStore().loadData([result.results[i]], true);
					}
				}
			});
		}
		// 初始化已经选中的值
		selectedbox.loadSelectedExpressions = function(usersexpression){
			selectedbox.clearSelected();
			if(Ext.isDefined(usersexpression) && usersexpression != ''){
				var values = '';
				if(typeof usersexpression == 'string'){
					usersexpression = usersexpression.split(win.valueSeparator);
				}
				for(var i=0;i<usersexpression.length;i++){
					if(!usersexpression[i]){
						continue;
					}
					values = values + usersexpression[i] + ';';
				}
				if(values && values != ''){
					OrganizationAppDirect.loadSelectedExpressions(win.valueField, values, function(result, e){
						if(result){
							selectedbox.getStore().loadData(result.results, true);
						}
					});
				}
			}
		},
		// 清空选中的用户
		selectedbox.clearSelected = function(){
			selectedbox.getStore().removeAll();
		}
		// 删除选中的用户
		selectedbox.removeSelected = function(){
			var records = selectedbox.getSelectedRecords();
			for(var i=0;i<records.length;i++){
				selectedbox.getStore().remove(records[i]);
			}
		}
		// 选中组织结构树
		tree.getSelectionModel().on('selectionchange', function(sm, node){
			if(!node){
				return;
			}
			var expression = node.attributes['expression'];
			if(!expression || expression == ''){
				return;
			}
			grid.loadExpression(expression);
		});
		// 双击组织结构树
		tree.on('dblclick', function(node, e){
			var expression = node.attributes['expression'];
			if(!expression || expression == ''){
				return;
			}
			if(!this.selectMulti && this.selectType == 'user'){
				return;
			}else{
				selectedbox.selectExpression(expression);
			}
		});
		// 双击用户列表
		grid.on('rowdblclick', function(g, index, e){
			var u = g.getSelectionModel().getSelected();
			selectedbox.selectExpression(u.get('expression'));
		});
		// 双击用户列表
		selectedbox.on('dblclick', function(dv, index, e){
			selectedbox.removeSelected();
		});
		// 双击用户列表
		selectedbox.on('contextmenu', function(dv, index, node, e){
			dv.contextMenu.showAt(e.getXY());
		});
		win.initConfigration = function(config, value, fn){
			// 装载树结构
    		if(config.selectType != tree.getLoader().baseParams.type){
				tree.getLoader().baseParams.type = config.selectType;
				tree.refresh();
    		}
    		// 应用参数
		    Ext.apply(this, config);
			// 设置显示模式
			switch(this.selectType){
			case 'user':
			case 'mix':
				grid.setVisible(true);
				break;
			case 'department':
			case 'role':
				grid.setVisible(false);
				break;
			}
			win.onSelectedFn = fn;
			// 装载初始值
			selectedbox.loadSelectedExpressions(value);
			
		}
		Mixky.app.common.OrganizationWindow = win;
	}
	Mixky.app.common.OrganizationWindow.initConfigration(config, value, fn);
	return Mixky.app.common.OrganizationWindow;
};