// 查询配置项定义
Mixky.designtool.Class.registeModule({
	name : 'view',
	text : '视图',
	note : '',
	iconCls : 'icon-designtool-view',
	jsonable : true,
	copyable : true,
	deletable : true,
	subModules : ['column', 'action','viewparameter'],
	properties : [{
    	name:'f_icon', 
    	text:'图标', 
    	xeditor:'string', 
    	note:'视图图标。'
    },{
    	name:'f_url', 
    	text:'视图路径', 
    	xeditor:'string', 
    	note:'视图的打开路径。'
    },{
    	name:'f_keycolumn', 
    	text:'关键列', 
    	xeditor:'string', 
    	note:'指定视图的唯一关键列名。'
    },{
    	name:'f_autoexpandcolumn', 
    	text:'自动扩展列', 
    	xeditor:'string', 
    	note:'指定视图的自动扩展列名。'
    },{
    	name:'f_single_select', 
    	text:'选择单行', 
    	xeditor:'boolean', 
    	note:'定义视图的列表选择模式。'
    },{
    	name:'f_page_size', 
    	text:'页记录数', 
    	xeditor:'number', 
    	note:'定义视图列表的每页显示记录数。'
    },{
    	name:'f_isquery', 
    	text:'支持查询', 
    	xeditor:'boolean', 
    	note:'视图是否支持查询。'
    },{
    	name:'f_issummary', 
    	text:'支持汇总', 
    	xeditor:'boolean', 
    	note:'视图是否支持列汇总。'
    },{
    	name:'f_i_documenttype', 
    	text:'文档类型', 
    	xeditor:'designobject', 
    	xconfig:{
    		remoteRenderType:'renderDesignObject',
    		parentKey:'',
    		mclass:'documenttype',
    		selectInParent:false
    	},
    	note:'选择视图列表对应的文档类型。'
    },{
    	name:'f_enable_favorite', 
    	text:'支持收藏', 
    	xeditor:'boolean', 
    	note:'对于支持收藏的视图，需要定义文档类型。'
    },{
    	name:'f_title_field', 
    	text:'标题列名', 
    	xeditor:'string', 
    	note:'指定视图的标题字段名，在收藏时将用该字段作为收藏项标题。'
    }],
	extendsMenu : [{
		text : '预览数据',
		iconCls : 'icon-designtool-viewdata'
	}],
	editors : [
       'ui/properties.do',
       'ui/objectgrideditor.do?type=column', 
       'ui/objectgrideditor.do?type=viewparameter', 
       'ui/objectgrideditor.do?type=action'
    ]
});
