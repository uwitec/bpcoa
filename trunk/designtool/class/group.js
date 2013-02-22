// 查询配置项定义
Mixky.designtool.Class.registeModule({
	name : 'group',
	text : '分组',
	note : '',
	iconCls : 'icon-designtool-group',
	jsonable : true,
	copyable : true,
	deletable : true,
	subModules : ['group'],
	properties : [{
    	name:'f_type', 
    	text:'类型', 
    	xeditor:'selectkeymap', 
    	xconfig:{
    		datas:[[0,'none'], [1,'静态分组'], [2,'字段分组'],[3,'下级单位'],[4,'下级用户'],[5,'组织结构'],[6,'组织结构用户'],[7,'数据字典'],[99, '自定义']],
    		readOnly:true
    	},
    	note:'指定查询分组类型。'
    },{
    	name:'f_field', 
    	text:'分组显示字段', 
    	xeditor:'string', 
    	note:'定义分组显示字段。'
    },{
    	name:'f_valuefield', 
    	text:'分组值字段', 
    	xeditor:'string', 
    	note:'定义分组值字段，如果值字段为空，则以显示字段作为参数值。'
    },{
    	name:'f_icon', 
    	text:'图标', 
    	xeditor:'string', 
    	note:'指定分组项显示图标。'
    },{
    	name:'f_url', 
    	text:'解析类路径', 
    	xeditor:'string', 
    	note:'指定分组的服务器端解析路径，类型为【自定义】时起作用。'
    }],
	editors : [
       'ui/properties.do',
       'ui/objectgrideditor.do?type=action'
    ]
});
