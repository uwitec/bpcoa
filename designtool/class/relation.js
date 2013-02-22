// 模块数据表配置项定义
Mixky.designtool.Class.registeModule({
	name : 'relation',
	text : '路由关系',
	note : '',
	iconCls : 'icon-designtool-relation',
	properties : [{
    	name:'f_type', 
    	text:'关系类型', 
    	xeditor:'selectkeymap',  
    	xconfig:{
    		datas:[[1,'流程启动者'],[2,'目标节点历史办理人'],[3,'同部门人员'],[4,'直接部门领导'],[5,'所有上级领导'],[6,'上一节点办理人'],[7,'所有已办理人员'],[8,'直接下属'],[9,'所有下属'],[10,'分管领导'],[11,'流程管理员'],[12,'流程读者'],[0,'自定义类型']],
    		readOnly:true
    	},
    	note:'路由关系类型。'
    },{
    	name:'f_source', 
    	text:'关系源', 
    	xeditor:'selectkeymap',  
    	xconfig:{
    		datas:[[0,'按当前办理人'],[1,'按流程启动者'],[2,'按上一主办人']],
    		readOnly:true
    	},
    	note:'关系计算相关类型，0：按流程启动者计算关系；1：按当前办理人计算关系；2：按上一办理人计算关系。'
    },{
    	name:'f_param', 
    	text:'解析参数', 
    	xeditor:'string', 
    	note:'定义路由关系解析参数，自定类型有效。'
    },{
    	name:'f_relate_type', 
    	text:'结果计算', 
    	xeditor:'selectkeymap', 
    	xconfig:{
    		datas:[[0,'交集'],[1,'并集']],
    		readOnly:true
    	},
    	note:'各计算关系之间的结果合并方式，intersection：交集；outersection：并集。'
    }],
	propertyColumns : {
		'f_key':{width:120},
		'f_source':{width:110, header:'关系源'},
		'f_type':{width:110, header:'关系类型'},
		'f_relate_type':{width:110, header:'结果计算'},
		'f_param':{width:120, header:'解析参数'},
		'f_note':{width:150}
	}
});
