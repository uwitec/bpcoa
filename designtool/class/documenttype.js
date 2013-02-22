// 查询配置项定义
Mixky.designtool.Class.registeModule({
	name : 'documenttype',
	text : '文档类型',
	note : '',
	iconCls : 'icon-designtool-documenttype',
	jsonable : true,
	copyable : true,
	deletable : true,
	subModules : ['action'],
	properties : [{
    	name:'f_type', 
    	text:'注册类型', 
    	xeditor:'selectkeymap',  
    	xconfig:{
    		datas:[[1,'文档对象'],[2,'URL'],[0,'自定义']],
    		readOnly:true
    	},
    	note:'文档注册类型，1：文档对象；2：URL；0：自定义'
    },{
    	name:'f_param', 
    	text:'注册参数', 
    	xeditor:'string', 
    	note:'定义注册类型的相关参数（如：文档Key）。'
    },{
    	name:'f_title_column', 
    	text:'视图标题列名', 
    	xeditor:'string', 
    	note:'定义文档类型对应的视图标题列名称，用于维护文档类型的收藏夹。'
    },{
    	name:'f_icon', 
    	text:'图标', 
    	xeditor:'string', 
    	note:'定义文档类型的图标。'
    },{
    	name:'f_handler', 
    	text:'操作函数', 
    	xeditor:'textbox', 
    	note:'JS函数function(id)类型为自定义时使用该函数。'
    }],
	editors : [
       'ui/properties.do',
       'ui/objectgrideditor.do?type=action'
    ]
});
