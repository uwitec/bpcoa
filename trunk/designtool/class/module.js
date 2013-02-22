// 模块配置项定义
Mixky.designtool.Class.registeModule({
	name : 'module',
	text : '应用模块',
	note : '',
	iconCls : 'icon-designtool-module',
	jsonable : true,
	copyable : true,
	deletable : true,
	subModules : ['table', 'query', 'panel', 'document','flow'],
	editors : [
       'ui/properties.do'
    ],
    properties : [{
    	name:'f_type', 
    	text:'类型', 
    	xeditor:'selectkeymap', 
    	xconfig:{
    		datas:[[0,'基础模块'],[1,'标准模块'],[2,'定制模块']],
    		readOnly:true
    	},
    	note:'模块类型，分为基础模块、标准模块和定制模块。'
    },{
    	name:'f_url', 
    	text:'模块路径', 
    	xeditor:'string', 
    	note:'模块路径，自定义模块的解析文件。'
    },{
    	name:'f_version', 
    	text:'版本', 
    	xeditor:'string', 
    	note:'模块版本，标记模块的版本号。'
    },{
    	name:'f_icon', 
    	text:'图标', 
    	xeditor:'string', 
    	note:'模块图标，指定模块的图标名称。'
    },{
    	name:'f_useflow', 
    	text:'使用流程', 
    	xeditor:'boolean', 
    	note:'表明模块是否使用流程。'
    }]
});
