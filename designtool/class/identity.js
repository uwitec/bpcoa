// 模块数据表配置项定义
Mixky.designtool.Class.registeModule({
	name : 'identity',
	text : '文档身份',
	note : '定义操作者的文档身份，用于控制文档权限。',
	iconCls : 'icon-designtool-identity',
	extendsMenu : [{
		text : '引入流程身份',
		iconCls : 'icon-designtool-importflowidentitys',
		handler : function(){
			var grid = this.items.get(0);
			var key = grid.getParentKey();
			DesignToolDirect.importFlowIdentities(key, function(result, e){
				grid.getStore().reload();	
			});
		}
	}],
	properties : [{
    	name:'f_judge_source', 
    	text:'判定源', 
    	xeditor:'select', 
    	xconfig:{
			datas:['|fieldname|', 'userexpressions'],
    		readOnly:false
    	},
    	note:'指定身份的判定源。'
    },{
    	name:'f_judge_source_type', 
    	text:'类型', 
    	xeditor:'selectkeymap',  
    	xconfig:{
    		datas:[[0,'当前用户'],[1,'用户ID'],[2,'用户名'],[3,'登录名'],[4,'部门ID'],[5,'部门名'],[6,'角色名'],[7,'用户表达式'],[8,'模块角色'],[99, '自定义']],
    		readOnly:true
    	},
    	note:'指定身份判定条件的源类型。'
    },{
    	name:'f_operator', 
    	text:'判定操作', 
    	xeditor:'selectkeymap',  
    	xconfig:{
    		datas:[[0,'MemberOf'],[1,'IncludeMember'],[2,'LeaderOf'],[3,'DirectLeaderOf'],[4,'UnderlingOf'],[5,'DirectUnderlingOf'], [6, 'SameDeptmentOf'],[99, 'Custom']],
    		readOnly:true
    	},
    	note:'字段对应JAVA数据类型。'
    },{
    	name:'f_judge_target', 
    	text:'判定目标', 
    	xeditor:'select', 
    	xconfig:{
    		datas:['|fieldname|', 'userexpressions'],
    		readOnly:false
    	},
    	note:'指定身份的判定目标。'
    },{
    	name:'f_judge_target_type', 
    	text:'类型', 
    	xeditor:'selectkeymap',  
    	xconfig:{
			datas:[[0,'当前用户'],[1,'用户ID'],[2,'用户名'],[3,'登录名'],[4,'部门ID'],[5,'部门名'],[6,'角色名'],[7,'用户表达式'],[8,'模块角色'],[99, '自定义']],
    		readOnly:true
    	},
    	note:'指定身份判定条件的目标类型。'
    }],
	propertyColumns : {
		'f_key':{width:120},
		'f_name':{width:70, header:'身份名'},
		'f_caption':{width:70, header:'中文名'},
		'f_judge_source':{width:120},
		'f_judge_source_type':{width:70},
		'f_operator':{width:100},
		'f_judge_target':{width:120},
		'f_judge_target_type':{width:70},
		'f_config':{width:150},
		'f_note':{width:150}
	}
});
