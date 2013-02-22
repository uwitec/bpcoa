// 查询配置项定义
Mixky.designtool.Class.registeModule({
	name : 'query',
	text : '查询',
	note : '',
	iconCls : 'icon-designtool-query',
	jsonable : true,
	copyable : true,
	deletable : true,
	subModules : ['view', 'group'],
	properties : [{
    	name:'f_from', 
    	text:'From语句', 
    	xeditor:'string', 
    	note:'定义查询检索依据中的From子句。'
    },{
    	name:'f_where', 
    	text:'Where语句', 
    	xeditor:'string', 
    	note:'定义查询检索依据中的Where子句。'
    },{
    	name:'f_groupby', 
    	text:'GroupBy语句', 
    	xeditor:'string', 
    	note:'定义查询检索依据中的Group By子句。'
    },{
    	name:'f_orderby', 
    	text:'OrderBy语句', 
    	xeditor:'string', 
    	note:'定义查询检索依据中的Order By子句。'
    }],
	extendsMenu : [{
		text : '查看SQL',
		iconCls : 'icon-designtool-viewsql'
	}],
	editors : [
       'ui/properties.do'
    ]
});
