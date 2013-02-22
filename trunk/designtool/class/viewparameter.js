// 模块数据表配置项定义
Mixky.designtool.Class.registeModule({
	name : 'viewparameter',
	text : '视图参数',
	note : '定义视图所接受的参数。',
	iconCls : 'icon-designtool-viewparameter',
	properties : [{
    	name:'f_sql', 
    	text:'条件语句', 
    	xeditor:'string', 
    	note:'定义参数的查询条件语句。'
    },{
    	name:'f_nullsql', 
    	text:'空条件语句', 
    	xeditor:'string', 
    	note:'定义参数为空时的条件语句。'
    }],
	propertyColumns : {
		'f_key':{width:120},
		'f_name':{width:100, header:'参数名'},
		'f_caption':{width:100, header:'中文名'},
		'f_sql':{width:150},
		'f_nullsql':{width:150},
		'f_config':{width:120},
		'f_note':{width:150}
	}
});
