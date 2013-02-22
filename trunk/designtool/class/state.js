// 模块数据表配置项定义
Mixky.designtool.Class.registeModule({
	name : 'state',
	text : '文档状态',
	note : '定义文档状态',
	iconCls : 'icon-designtool-state',
	extendsMenu : [{
		text : '引入流程节点',
		iconCls : 'icon-designtool-importnodes',
		handler : function(){
			var grid = this.items.get(0);
			var key = grid.getParentKey();
			DesignToolDirect.importFlowStates(key, function(result, e){
				grid.getStore().reload();	
			});
		}
	}],
	propertyColumns : {
		'f_key':{width:120},
		'f_name':{width:110, header:'状态名'},
		'f_caption':{width:110, header:'中文名'},
		'f_note':{width:150}
	}
});
