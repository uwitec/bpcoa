// 模块数据表配置项定义
Mixky.designtool.Class.registeModule({
	name : 'modulemenu',
	text : '模块菜单',
	note : '模块菜单定义',
	iconCls : 'icon-designtool-modulemenu',
	orderable : true,
	properties : [{
    	name:'f_icon', 
    	text:'图标', 
    	xeditor:'string', 
    	note:'模块菜单图标。'
    },{
    	name:'f_i_view', 
    	text:'相关视图', 
    	xeditor:'designobject', 
    	xconfig:{
    		remoteRenderType:'renderDesignObject',
    		parentKey:'',
    		mclass:'view',
    		selectInParent:true
    	},
    	note:'定义模块菜单的相关视图。'
    },{
    	name:'f_i_group', 
    	text:'分组', 
    	xeditor:'designobject', 
    	xconfig:{
    		remoteRenderType:'renderDesignObject',
    		parentKey:'',
    		mclass:'group',
    		selectInParent:true
    	},
    	note:'定义模块菜单的视图分组。'
    },{
    	name:'f_subject_url', 
    	text:'桌面栏目路径', 
    	xeditor:'string', 
    	note:'作为桌面栏目的打开路径。'
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
    },{
    	name:'f_formenu', 
    	text:'作为菜单', 
    	xeditor:'boolean', 
    	note:'是否作为界面或分组菜单显示。'
    },{
    	name:'f_forshortcut', 
    	text:'作为快捷键', 
    	xeditor:'boolean', 
    	note:'是否作为快捷键显示。'
    }],
	propertyColumns : {
		'f_key':{width:120},
		'f_name':{width:110},
		'f_caption':{width:110},
		'f_icon':{width:80},
		'f_i_view':{width:80},
		'f_i_group':{width:80},
		'f_subject_url':{width:100},
		'f_handler':{width:150},
		'f_default':{width:50},
		'f_formenu':{width:50},
		'f_forshortcut':{width:50},
		'f_config':{width:110},
		'f_note':{width:150}
	},
	editors : [
	    'ui/objectgrideditor.do?type=modulemenu',
	]
});
