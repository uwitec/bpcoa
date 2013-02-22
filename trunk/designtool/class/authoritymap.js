// 模块数据表配置项定义
Mixky.designtool.Class.registeModule({
	name : 'authorithmap',
	text : '文档权限映射',
	note : '',
	iconCls : 'icon-designtool-authorithmap',
	properties : [{
    	name:'f_state', 
    	text:'状态名', 
    	xeditor:'string', 
    	note:'权限列表的状态。'
    },{
    	name:'f_identity', 
    	text:'身份名', 
    	xeditor:'string', 
    	note:'权限列表的身份。'
    },{
    	name:'f_substate', 
    	text:'子状态', 
    	xeditor:'string', 
    	note:'权限列表的子状态，用于对状态进行细分。'
    },{
    	name:'f_authorities', 
    	text:'权限列表', 
    	xeditor:'jsonobject', 
    	note:'记录文档中所有Key的权限列表。'
    }]
});
