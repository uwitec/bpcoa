// 文档配置项定义
Mixky.designtool.Class.registeModule({
	name : 'document',
	text : '文档',
	note : '',
	iconCls : 'icon-designtool-document',
	jsonable : true,
	copyable : true,
	deletable : true,
	subModules : ['panel', 'action', 'state', 'substate', 'identity', 'authoritymap'],
    properties : [{
    	name:'f_icon', 
    	text:'图标', 
    	xeditor:'string', 
    	note:'文档图标，指定文档的图标名称。'
    },{
    	name:'f_i_table', 
    	text:'数据表', 
    	xeditor:'designobject',
    	xconfig:{
    		remoteRenderType:'renderDesignObject',
    		parentKey:'',
    		mclass:'table',
    		selectInParent:true
    	},
    	note:'选择文档对应的数据表定义。'
    },{
    	name:'f_i_flow', 
    	text:'应用流程', 
    	xeditor:'designobject', 
    	xconfig:{
    		remoteRenderType:'renderDesignObject',
    		parentKey:'',
    		mclass:'flow',
    		selectInParent:true
    	},
    	note:'选择文档的使用流程。'
    }],
	editors : [
       'ui/properties.do',
       'ui/objectgrideditor.do?type=action',
       'ui/objectgrideditor.do?type=state',
       'ui/objectgrideditor.do?type=substate',
       'ui/objectgrideditor.do?type=identity',
       'ui/objectgrideditor.do?type=panel',
       'ui/document.authoritymap.do'
    ]
});
