// 标签界面配置项定义
Mixky.designtool.Class.registeModule({
	name : 'route',
	text : '路由',
	note : '',
	iconCls : 'icon-designtool-route',
	jsonable : true,
	copyable : true,
	deletable : true,
	subModules : ['relation'],
	properties : [{
    	name:'f_type', 
    	text:'路由类型', 
    	xeditor:'selectkeymap',  
    	xconfig:{
    		datas:[[0,'普通路由'],[1,'条件路由']],
    		readOnly:true
    	},
    	note:'路由类型，0：普通路由；1：条件路由。'
    },{
    	name:'f_route_expression', 
    	text:'路由条件', 
    	xeditor:'string', 
    	note:'定义路由的判断条件'
    },{
    	name:'f_access_user', 
    	text:'访问者', 
    	xeditor:'string', 
    	note:'定义路由的访问用户。'
    },{
    	name:'f_allow_return', 
    	text:'允许退回', 
    	xeditor:'boolean', 
    	note:'允许该条路由的退回办理操作。'
    },{
    	name:'f_allow_takeback', 
    	text:'允许拿回', 
    	xeditor:'boolean', 
    	note:'允许该条路的上一办理人进行拿回操作。'
    },{
    	name:'f_merge_type', 
    	text:'关系计算', 
    	xeditor:'selectkeymap', 
    	xconfig:{
    		datas:[[0,'交集'],[1,'并集']],
    		readOnly:true
    	},
    	note:'指定路由关系之间的计算方式，intersection：交集；outersection：并集。'
    }],
	editors : [
       'ui/properties.do',
       'ui/objectgrideditor.do?type=relation'
    ]
});
