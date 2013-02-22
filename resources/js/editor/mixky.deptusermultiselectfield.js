/*!
 * Ext JS Library 3.0.0
 * Copyright(c) 2006-2009 Ext JS, LLC
 * licensing@extjs.com
 * http://www.extjs.com/license
 */

Ext.namespace("Mixky.editor");

Mixky.editor.DeptUserMultiSelectField = Ext.extend(Mixky.editor.PanelTriggerField, {

    confirm : true,

    editable : false,
    
    minListWidth : 300,
    
    maxHeight : 500,
    
    minHeight : 200,
    
    resizable : true,
    
    selectMulti : true,
    
    selectType : 'user',
    
    valueField : 'id',
    
    displayField : 'f_caption',
    
    valueSeparator : ',',
    	
    // private
    renderPanel : function(el){
		var field = this;
		var tree = new Ext.tree.TreePanel({
			region : 'center',
	    	autoScroll:true,
	    	rootVisible :true,
	        style : 'background-color:white',
	    	root: {
				nodeType: 'async',
	            text: '人员选择'
	        },
	        loader: new Ext.tree.TreeLoader({
	            directFn: OrganizationAppDirect.getUserTree,
	            paramOrder : ['type'],
	        	baseParams : {type:''},
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
		
		var selectedbox = new Ext.DataView({
			region : 'south',
			autoScroll : true,
	        split :true,
	        height : 80,
	        minSize : 50,
	        maxSize : 250,
	        style : 'background-color:white',
	        tpl:new Ext.XTemplate(
	        	'<tpl for=".">',
	                '<div class="user-expression-item icon-app-{type}" id="{expression}">{f_caption}</div>',
	            '</tpl>',
	            '<div class="x-clear"></div>'
	        ),
	        selectedClass:'x-user-expression-view-selected',
	        overClass:'x-user-expression-view-over',
	        itemSelector:'div.user-expression-item',
	        multiSelect: false,
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
				if(!field.selectMulti && this.getStore().getCount() > 0){
					return;
				}
				// 服务器端解析表达式
				OrganizationAppDirect.getExpressionData(expression, field.selectType, function(result,e){
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
				if(Ext.isDefined(usersexpression) && usersexpression != ''){
					var values = '';
					if(typeof usersexpression == 'string'){
						usersexpression = usersexpression.split(field.valueSeparator);
					}
					for(var i=0;i<usersexpression.length;i++){
						if(i>0){
							values = values + ';';
						}
						values = values + usersexpression[i];
					}
					OrganizationAppDirect.loadSelectedUsers(field.selectType, field.valueField, values, function(result, e){
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
		// 双击已选择对象列表
		selectedbox.on('dblclick', function(dv, index, e){
			selectedbox.removeSelected();
		});
		// 已选择对象列表右键
		selectedbox.on('contextmenu', function(dv, index, node, e){
			dv.contextMenu.showAt(e.getXY());
		});
		var ui = new Ext.Panel({
			renderTo:el,
			layout:'border',
			border : false,
			//defaults : {border:false},
			items:[tree, selectedbox]
		});
	
		var buttons = [];
		if(this.confirm){
			buttons = [{
				text : '刷新',
				iconCls:'icon-app-refresh',
				handler : function(){
					tree.refresh();
				}
				
			},'->',{
				text : '确定',
				iconCls:'icon-app-confirm',
				handler : function(){
					var records = selectedbox.getStore().getRange();
					var values = '', display = '';
					if(this.selectMulti && this.valueSeparator == ''){
						values = [];
					}
					var display = '';
					for(var i=0;i<records.length;i++){
						if(i>0){
							display = display + ';';
							if(this.selectMulti && this.valueSeparator != ''){
								values = values + this.valueSeparator;
							}
						}
						display = display + records[i].get(this.displayField);
						if(this.selectMulti && this.valueSeparator == ''){
							values.push(records[i].get(this.valueField));
						}else{
							values = values + records[i].get(this.valueField);
						}
					}
					this.onSelect(display, values, records);
					this.collapse();
				},
				scope:this
			},'-',{
				text : '取消',
				iconCls:'icon-app-cancel',
				handler : function(){
					this.collapse();
				},
				scope:this
			}];
		}
	    var panel = new Ext.Panel({
	        renderTo : el,
	        layout:'fit',
	        items:[new Ext.Panel({
		        layout:'fit',
	        	height:300,
	        	items:[ui],
		        bbar:buttons
	        })],
        	beforeexpend : function(){
				// 装载树结构
	    		if(field.selectType != tree.getLoader().baseParams.type){
					tree.getLoader().baseParams.type = field.selectType;
					tree.refresh();
	    		}
				// 装载初始值
				selectedbox.loadSelectedUsers(field.realValue);
	    	}
	    });
	    return panel;
    }

});
Ext.reg('crcadeptusermultiselectfield', Mixky.editor.DeptUserMultiSelectField);