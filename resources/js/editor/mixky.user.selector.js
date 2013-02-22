Ext.namespace("Mixky.lib.editor");

Mixky.lib.editor.getUserSelector = function(values, onSelectedFn, editorapi){
	
	if(!Mixky.lib.editor.pUserSelector){
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
				idProperty : 'expression',
				fields:[
				    {name:'f_key',mapping:'f_key'},
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
				header:'用户名'
			},{
				id:'f_name',
				dataIndex:'f_name',
				width:100,
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
			autoScroll : true,
	        split :true,
	        height : 100,
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
	        	fields: ['expression', 'type', 'f_key', 'f_name', 'f_caption', 'f_note']
	        }),
	        // 选中表达式
	        selectExpression:function(expression){
				OrganizationDirect.getExpressionData(expression, function(result,e){
					// 添加
					selectedbox.getStore().loadData(result.results, true);
				});
			},
			// 初始化已经选中的值
			loadSelectedUsers:function(){
				var type = Mixky.lib.editor.pUserSelector.editorapi.valueType;
				var values = [];
				OrganizationDirect.loadSelectedUsers(type, values, function(result, e){
					
				});
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
			selectedbox.selectExpression(expression);
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
		var ui = new Ext.Panel({
			layout:'border',
			border : false,
			defaults : {border:false},
			items:[tree, grid, selectedbox]
		});
		
		var selApi = {
		    getInitValue:function(){
    			return Mixky.lib.editor.pUserSelector.editorapi.value;
    		},
	    	onSelectedFn:function(value){
				Mixky.lib.editor.pUserSelector.editorapi.onSelectedFn(value);
			},
	    	getValue : function(){
				return selectedbox.getStore().getRange();
			},
			setValue : function(){
				var selectType = Mixky.lib.editor.pUserSelector.editorapi.selectType;
				// 装载树结构
				tree.getLoader().baseParams.type = selectType;
				tree.refresh();
				// 装载初始值
				selectedbox.loadSelectedUsers();
				// 设置显示模式
				switch(selectType){
				case 'user':
				case 'mix':
					grid.setVisible(true);
					break;
				case 'deptment':
				case 'role':
					grid.setVisible(false);
					break;
				}
			}
		}
		Mixky.lib.editor.pUserSelector = Mixky.lib.getFieldSelectorWindow({
			width:500,
			height:500,
			iconCls:'icon-designtool-organizationselector',
			title:"机构/人员 选择框",
			closeAction:'hide',
			items:ui
		}, selApi);
	}
	Mixky.lib.editor.pUserSelector.editorapi = Ext.apply({
		// 选择方式，包括 user deptment role mix
		selectType:'mix',
		// 支持多选
		selectMulti:true,
		// 初始值类型 包括 expression user.id user.name user.caption deptment.id deptment.name deptment.path 等
		valueType:'expression',
		values:values,
		onSelectedFn:onSelectedFn
	}, editorapi);
	return Mixky.lib.editor.pUserSelector;
}