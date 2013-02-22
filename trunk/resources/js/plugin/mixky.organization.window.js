/*!
 * Ext JS Library 3.0.0
 * Copyright(c) 2006-2009 Ext JS, LLC
 * licensing@extjs.com
 * http://www.extjs.com/license
 */

Ext.namespace("Mixky.editor");

Mixky.editor.showOrganizationWindow = function(fn, initvalues, cfg){
	// 窗体对象
	var win;
	// 配置参数
	var config = Ext.apply({
	    selectMulti : true,
	    selectType : 'mix',
	    valueField : 'expression',
	    displayField : 'f_caption',
	    valueSeparator : ';'
	},cfg);

	var tree = new Ext.tree.TreePanel({
		region : 'center',
    	autoScroll:true,
    	rootVisible :false,
    	root: {
			nodeType: 'async',
            text: '人员选择',
            id : 'root-organization'
        },
        // Ext TreeLoader的Direct有bug，没有最新版本，临时使用Json方式
        loader: new Ext.tree.TreeLoader({
            directFn: OrganizationDirect.getOrganizationTree,
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
			directFn : OrganizationDirect.getUserList,
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
	
	var selectedbox = new Ext.DataView({
		region : 'south',
        split :true,
        height : 120,
        minSize : 50,
        maxSize : 250,
        style : 'background-color:white',
        tpl:new Ext.XTemplate(
        	'<tpl for=".">',
                '<div class="user-expression-item icon-designtool-{type}" id="{expression}">{f_caption}</div>',
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
        }),
        // 选中表达式
        selectExpression:function(expression){
			// 判断多选
			if(!config.selectMulti && this.getStore().getCount() > 0){
				return;
			}
			// 服务器端解析表达式
			OrganizationDirect.getExpressionData(expression, config.selectType, function(result,e){
				// 添加
				for(var i=0;i<result.results.length;i++){
					var exp = result.results[i];
					var record = selectedbox.getStore().getById(exp.expression);
					if(!record){
						selectedbox.getStore().loadData([result.results[i]], true);
					}
				}
			});
		},
		// 初始化已经选中的值
		loadSelectedUsers:function(usersexpression){
			this.clearSelected();
			if(Ext.isDefined(usersexpression) && usersexpression != '' && usersexpression != null){
				var values = '';
				if(typeof usersexpression == 'string'){
					usersexpression = usersexpression.split(config.valueSeparator);
				}
				for(var i=0;i<usersexpression.length;i++){
					if(i>0){
						values = values + ';';
					}
					values = values + usersexpression[i];
				}
				OrganizationDirect.loadSelectedUsers(config.valueField, values, function(result, e){
					selectedbox.getStore().loadData(result.results, true);
				});
			}
		},
		// 清空选中的用户
		clearSelected:function(){
			selectedbox.getStore().removeAll();
		},
		// 删除选中的用户
		removeSelected:function(){
			var records = selectedbox.getSelectedRecords();
			for(var i=0;i<records.length;i++){
				selectedbox.getStore().remove(records[i]);
			}
		}
	});
	selectedbox.contextMenu = new Ext.menu.Menu({items:[{
		text:'删除',
		iconCls:'icon-designtool-delete',
		handler:function(){
			selectedbox.removeSelected();
		}
	}]});

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
		if(!config.selectMulti && config.selectType == 'user'){
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
	// 按钮


	var buttons = [{
		text : '刷新',
		iconCls:'icon-designtool-refresh',
		handler : function(){
			tree.refresh();
		}
	},'->',{
		text : '确定',
		iconCls:'icon-designtool-confirm',
		handler : function(){
			var records = selectedbox.getStore().getRange();
			var values = '', display = '';
			if(config.selectMulti && config.valueSeparator == ''){
				values = [];
			}
			var display = '';
			for(var i=0;i<records.length;i++){
				if(i>0){
					display = display + ';';
					if(config.selectMulti && config.valueSeparator != ''){
						values = values + config.valueSeparator;
					}
				}
				display = display + records[i].get(config.displayField);
				if(config.selectMulti && config.valueSeparator == ''){
					values.push(records[i].get(config.valueField));
				}else{
					values = values + records[i].get(config.valueField);
				}
			}
			fn(display, values, records);
			win.close();
		}
	},'-',{
		text : '取消',
		iconCls:'icon-designtool-cancel',
		handler : function(){
			win.close();
		}
	}];
	// 界面
	var ui = new Ext.Panel({
		layout:'border',
		border : false,
		defaults : {border:false},
		items:[tree, grid, selectedbox],
		bbar : buttons
	});
	// 装载树结构
	tree.getLoader().baseParams.type = config.selectType;
	tree.refresh();
	// 设置显示模式
	switch(config.selectType){
	case 'user':
	case 'mix':
		grid.setVisible(true);
		break;
	case 'deptment':
	case 'role':
		grid.setVisible(false);
		break;
	}
	// 装载初始值
	selectedbox.loadSelectedUsers(initvalues);
	
    win = new Ext.Window({
        modal: true,
        layout:'fit',
        width: 500,
        height:500,
        maximizable : false,
        minimizable : false,
        resizable: false,
        items : ui,
        title : '人员选择窗口'
    });
    win.show();
}
