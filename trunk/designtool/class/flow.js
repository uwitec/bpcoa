// 标签界面配置项定义
Mixky.designtool.Class.registeModule({
	name : 'flow',
	text : '流程',
	note : '',
	iconCls : 'icon-designtool-flow',
	jsonable : true,
	copyable : true,
	deletable : true,
	subModules : ['node'],
	properties : [{
    	name:'f_type', 
    	text:'类型', 
    	xeditor:'selectkeymap', 
    	xconfig:{
    		datas:[[0,'普通流程'],[1,'子流程']],
    		readOnly:true
    	},
    	note:'流程类型。'
    },{
    	name:'f_administrator', 
    	text:'管理员', 
    	xeditor:'organization', 
    	xconfig:{
			remoteRenderType:'renderUserExpression',
			valueSeparator:'',
    		selectType:'mix'
    	},
    	note:'设定流程管理员，可以管理流程的状态和数据。'
    },{
    	name:'f_reader', 
    	text:'流程读者', 
    	xeditor:'organization', 
    	xconfig:{
			remoteRenderType:'renderUserExpression',
			valueSeparator:'',
    		selectType:'mix'
    	},
    	note:'设定流程读者，可以浏览流程数据。'
    }],
	editors : [
       'ui/properties.do',
       'ui/workflow.do'
    ]
});
