// 标签界面配置项定义
Mixky.designtool.Class.registeModule({
	name : 'panel',
	text : '标签界面',
	note : '',
	iconCls : 'icon-designtool-panel',
	jsonable : true,
	copyable : true,
	deletable : false,
	orderable : true,
	properties : [{
    	name:'f_icon', 
    	text:'图标', 
    	xeditor:'string', 
    	note:'标签窗口的图标。'
    },{
    	name:'f_type', 
    	text:'类型', 
    	xeditor:'selectkeymap', 
    	xconfig:{
    		datas:[[0,'普通表单'],[1, '属性表单'],[2,'只读表格'],[3,'行编辑表格'],[4,'明细属性编辑表格'],[5,'背景图表单'],[6,'公文正文表单'],[7,'红头文件表单'],[8,'流程跟踪'],[9,'RTF文本编辑表单'],[99,'自定义表单']],
    		readOnly:true
    	},
    	note:'标签界面的类型。'
    },{
    	name:'f_url', 
    	text:'标签路径', 
    	xeditor:'string', 
    	note:'标签的服务器端解析路径。'
    },{
    	name:'f_i_tableform', 
    	text:'相关表单', 
    	xeditor:'designobject', 
    	xconfig:{
    		remoteRenderType:'renderDesignObject',
    		parentKey:'',
    		mclass:'tableform',
    		selectInParent:true
    	},
    	note:'定义路由的目标节点。'
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
    	note:'定义路由的目标节点。'
    },{
    	name:'f_custom_script', 
    	text:'附加JS脚本', 
    	xeditor:'textbox', 
    	note:'编辑页面生成后附加输出的自定义JS脚本。'
    }],
	propertyColumns : {
		'f_key':{width:120},
		'f_name':{width:110},
		'f_caption':{width:110},
		'f_icon':{width:70},
		'f_type':{width:80},
		'f_url':{width:120},
		'f_i_tableform':{width:80},
		'f_i_view':{width:80},
		'f_custom_script':{width:120},
		'f_config':{width:120},
		'f_note':{width:150}
	},
	editors : [
       'ui/properties.do',
       'ui/objectgrideditor.do?type=action'
    ]
});
