// 模块数据表配置项定义
Mixky.designtool.Class.registeModule({
	name : 'column',
	text : '视图列',
	note : '定义视图显示列',
	iconCls : 'icon-designtool-column',
	orderable : true,
	properties : [{
    	name:'f_type', 
    	text:'列类型', 
    	xeditor:'selectkeymap', 
    	xconfig:{
    		datas:[[0, 'none'], [1, 'string'], [2, 'dictionary'], [3, 'integer'], [4, 'float'], [5, 'date'], [6, 'datetime'], [7, 'jsonobject'], [8, 'icon'], [9, 'file'], [99, 'custom']],
    		readOnly:true
    	},
    	note:'显示字段对应的显示类型。'
    },{
    	name:'f_asname', 
    	text:'列别名', 
    	xeditor:'string', 
    	note:'显示字段对应的显示类型。'
    },{
    	name:'f_query_type', 
    	text:'查询类型', 
    	xeditor:'selectkeymap', 
    	xconfig:{
    		datas:[[0, 'none'], [1, 'string'], [2, 'number'], [3, 'date'], [4, 'dictionary']],
    		readOnly:true
    	},
    	note:'定义字段的查询类型。'
    },{
    	name:'f_summary_type', 
    	text:'汇总类型', 
    	xeditor:'select', 
    	xconfig:{
			datas:['none', 'sum', 'count', 'max', 'min', 'average'],
    		readOnly:true
    	},
    	note:'定义字段的汇总类型。'
    },{
    	name:'f_orderable', 
    	text:'排序', 
    	xeditor:'boolean', 
    	note:'定义字段是否支持排序。'
    },{
    	name:'f_width', 
    	text:'列宽', 
    	xeditor:'string', 
    	note:'定义字段的列宽度。'
    }],
	propertyColumns : {
		'f_key':{width:120},
		'f_name':{width:100, header:'列名'},
		'f_asname':{width:100, header:'别名'},
		'f_caption':{width:100, header:'标题'},
		'f_type':{width:80},
		'f_query_type':{width:70},
		'f_summary_type':{width:70},
		'f_orderable':{width:50},
		'f_width':{width:50},
		'f_config':{width:150},
		'f_note':{width:150}
	}
});
