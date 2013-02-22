// 标签界面配置项定义
Mixky.designtool.Class.registeModule({
	name : 'node',
	text : '节点',
	note : '',
	iconCls : 'icon-designtool-node',
	jsonable : true,
	copyable : true,
	deletable : true,
	subModules : ['route'],
	properties : [{
    	name:'f_type', 
    	text:'节点类型', 
    	xeditor:'selectkeymap',  
    	xconfig:{
    		datas:[[0,'开始节点'],[1,'普通节点'],[2,'归档节点'],[3,'子流程节点'],[4,'结束节点'],[5,'计算节点']],
    		readOnly:true
    	},
    	note:'节点类型，0：开始节点；1：普通节点；2：归档节点；3：子流程节点；4：结束节点；5：计算节点' 
    },{
    	name:'f_merge_route', 
    	text:'路由计算', 
    	xeditor:'selectkeymap', 
    	xconfig:{
    		datas:[[0,'交集'],[1,'并集']],
    		readOnly:true
    	},
    	note:'节点办理人与路由办理人计算关系，intersection：交集；outersection：并集。'
    },{
    	name:'f_process_type', 
    	text:'办理类型',  
    	xeditor:'selectkeymap',  
    	xconfig:{
    		datas:[[0,'单人办理'],[1,'多人顺序'],[2,'多人并行'],[3,'申请办理']],
    		readOnly:true
    	},
    	note:'节点办理类型，0：单人办理；1：多人顺序；2：多人并行；3：申请办理'
    },{
    	name:'f_process_user', 
    	text:'办理人', 
    	xeditor:'organization', 
    	xconfig:{
    		selectType:'mix',
    		remoteRenderType:'renderUserExpression'
    	},
    	note:'节点办理人。'
    },{
    	name:'f_allow_forward', 
    	text:'允许转办', 
    	xeditor:'boolean', 
    	note:'允许节点办理时的转办操作。'
    },{
    	name:'f_script', 
    	text:'计算脚本', 
    	xeditor:'textbox',
    	note:'节点自动计算处理脚本。'
    }],
	editors : [
       'ui/properties.do'
    ]
});
