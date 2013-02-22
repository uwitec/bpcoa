// 查询配置项定义
Mixky.designtool.Class.registeModule({
	name : 'portlet',
	text : '桌面栏目',
	note : '',
	iconCls : 'icon-designtool-portlet',
	jsonable : true,
	copyable : true,
	deletable : true,
	subModules : ['action'],
	properties : [{
    	name:'f_url', 
    	text:'URL', 
    	xeditor:'string', 
    	note:'桌面栏目URL，如不填写则默认为视图栏目。'
    },{
    	name:'f_viewkey', 
    	text:'视图KEY', 
    	xeditor:'string', 
    	note:'定义视图桌面栏目对应的视图KEY。'
    },{
    	name:'f_icon', 
    	text:'图标', 
    	xeditor:'string', 
    	note:'定义文档类型的图标。'
    },{
    	name:'f_refresh_interval', 
    	text:'刷新间隔', 
    	xeditor:'number', 
    	note:'桌面栏目的自动刷新间隔秒数，0为不自动刷新。'
    }],
	editors : [
       'ui/properties.do'
    ]
});
