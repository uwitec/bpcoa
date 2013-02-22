// 模块数据表配置项定义
Mixky.designtool.Class.registeModule({
	name : 'dept',
	text : '部门',
	note : '系统定义部门',
	iconCls : 'icon-designtool-dept',
	properties : [{
    	name:'id', 
    	text:'ID', 
    	xeditor:'none', 
    	note:'部门ID，数据库中的唯一标识。'
    },{
    	name:'f_name', 
    	text:'部门全称', 
    	xeditor:'none', 
    	note:'系统自动维护。'
    },{
    	name:'f_caption', 
    	text:'部门名称', 
    	xeditor:'string',
    	xconfig : {
    		config : {
    			maxLength:50,
    			allowBlank:false
    		}
    	},
    	note:'部门名称。'
    },{
    	name:'f_type', 
    	text:'成员类型', 
    	xeditor:'selectkeymap',
    	xconfig:{
			datas:[[0, '普通成员'],[1,'部门主管'],[2,'分管领导']],
    		readOnly:true
    	},
    	note:'部门用户类型。'
    },{
    	name:'f_note', 
    	text:'备注', 
    	xeditor:'textbox',
    	note:'说明信息。'
    },{
    	name:'f_order', 
    	note:'部门排序、自动维护。'
    },{
    	name:'type', 
    	note:'类型、部门或用户。'
    },{
    	name:'f_user_id', 
    	note:'用户ID，部门成员用。'
    }],
	propertyColumns : {
		'id':{width:50, renderer:function(value, p, record) {
			var type = record.get("type");
			return String.format("<div style='height:16px;padding-left:23px;background:transparent url(icon/{0}.gif) no-repeat'> {1}</div>", type, value);
		}},
		'f_caption':{width:120},
		'f_type':{width:70},
		'f_note':{width:150}
	}
});
