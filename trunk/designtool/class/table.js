// 模块数据表配置项定义
Mixky.designtool.Class.registeModule({
	name : 'table',
	text : '数据表',
	note : '模块数据表节点',
	iconCls : 'icon-designtool-table',
	jsonable : true,
	copyable : true,
	deletable : true,
	subModules : ['field'],
    properties : [{
    	name:'f_keyfield', 
    	text:'主键字段', 
    	xeditor:'string', 
    	note:'数据表的关键字名，默认为[id]。'
    }, {
    	name:'f_titlefield', 
    	text:'标题字段', 
    	xeditor:'string', 
    	note:'数据表的标题字段，默认为。'
    }],
	editors : [
       'ui/properties.do', 
       'ui/objectgrideditor.do?type=field', 
       'ui/objectgriddetaileditor.do?type=tableform'
    ]
});
