// 模块数据表配置项定义
Mixky.designtool.Class.registeModule({
	name : 'substate',
	text : '文档子状态',
	note : '定义文档子状态',
	iconCls : 'icon-designtool-substate',
	properties : [{
    	name:'f_source', 
    	text:'左操作值', 
    	xeditor:'string', 
    	note:'子状态的左操作值，|field|或普通string值。'
    },{
    	name:'f_operator', 
    	text:'操作符', 
    	xeditor:'selectkeymap',  
    	xconfig:{
    		datas:[[0,'='],[1,'>'],[2,'<'],[3,'>='],[4,'<='],[5,'include'],[99,'custom']],
    		readOnly:true
    	},
    	note:'字段对应JAVA数据类型。'
    },{
    	name:'f_target', 
    	text:'右操作值', 
    	xeditor:'string', 
    	note:'子状态的右操作值，|field|或普通string值。'
    }],
	propertyColumns : {
		'f_key':{width:80},
		'f_name':{width:100, header:'状态名'},
		'f_caption':{width:100, header:'中文名'},
		'f_source':{width:120},
		'f_operator':{width:60},
		'f_target':{width:120},
		'f_note':{width:150}
	}
});
