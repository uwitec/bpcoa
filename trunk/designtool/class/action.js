// 模块数据表配置项定义
Mixky.designtool.Class.registeModule({
	name : 'action',
	text : '操作按钮',
	note : '定义操作按钮',
	iconCls : 'icon-designtool-action',
	orderable : true,
	properties : [{
    	name:'f_icon', 
    	text:'图标', 
    	xeditor:'string', 
    	note:'按钮的图标类名。'
    },{
    	name:'f_handler', 
    	text:'操作函数', 
    	xeditor:'textbox', 
    	note:'操作的客户端执行函数脚本。'
    },{
    	name:'f_default', 
    	text:'默认操作', 
    	xeditor:'boolean', 
    	note:'是否默认操作，在视图双击时指定执行的操作。'
    }],
	propertyColumns : {
		'f_key':{width:120},
		'f_name':{width:70, header:'按钮名'},
		'f_caption':{width:70, header:'中文名'},
		'f_icon':{width:70},
		'f_default':{width:50},
		'f_handler':{width:200},
		'f_config':{width:150},
		'f_note':{width:150}
	}
});
