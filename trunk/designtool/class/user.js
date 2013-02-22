// 模块数据表配置项定义
Mixky.designtool.Class.registeModule({
	name : 'user',
	text : '用户',
	note : '管理系统用户',
	iconCls : 'icon-designtool-user',
	orderable : true,
	extendsMenu : [{
		text : '清空密码',
		iconCls : 'icon-designtool-clear',
		handler : function(){
			var panel = this.items.get(0);
			alert(panel.title);
		}
	}],
	properties : [{
    	name:'id', 
    	text:'ID', 
    	xeditor:'none', 
    	note:'用户ID，数据库中的唯一标识。'
    },{
    	name:'f_name', 
    	text:'登录名', 
    	xeditor:'string', 
    	xconfig : {
    		config : {
    			maxLength:50
    		}
    	},
    	note:'用于用户登录的登录名。'
    },{
    	name:'f_caption', 
    	text:'姓名', 
    	xeditor:'string',
    	xconfig : {
    		config : {
    			maxLength:50
    		}
    	},
    	note:'用户姓名。'
    },{
    	name:'f_dept_name', 
    	text:'所属部门', 
    	xeditor:'none',
    	note:'默认部门名称。'
    },{
    	name:'f_type', 
    	text:'类型', 
    	xeditor:'selectkeymap',
    	xconfig:{
			datas:[[0, '开发人员'],[1,'普通用户'],[2,'系统管理员']],
    		readOnly:true
    	},
    	note:'指定用户类型。'
    },{
    	name:'f_default_desktop', 
    	text:'默认桌面样式', 
    	xeditor:'string',
    	note:'指定用户默认桌面样式，缺省为default。'
    },{
    	name:'f_state', 
    	text:'状态', 
    	xeditor:'selectkeymap', 
    	xconfig:{
			datas:[[0, '正常'],[1,'已离职']],
    		readOnly:true
    	},
    	note:'设置用户状态。'
    },{
    	name:'f_email', 
    	text:'E-mail', 
    	xeditor:'string',
    	xconfig : {
    		config : {
    			maxLength:200
    		}
    	},
    	note:'用户电子邮箱地址。'
    },{
    	name:'f_cellphone', 
    	text:'手机号码', 
    	xeditor:'string',
    	xconfig : {
    		config : {
    			maxLength:50
    		}
    	},
    	note:'用户手机号码，用于短信模块。'
    },{
    	name:'f_note', 
    	text:'备注', 
    	xeditor:'textbox',
    	note:'说明信息。'
    },{
    	name:'f_order', 
    	note:'排序。'
    },{
    	name:'f_dept_id', 
    	note:'用户默认部门ID。'
    },{
    	name:'depts', 
    	note:'用户所在部门。'
    },{
    	name:'roles',
    	note:'用户角色。'
    }],
	propertyColumns : {
		'id':{width:50, renderer:function(value, p, record) {
			return String.format("<div style='height:16px;padding-left:23px;background:transparent url(icon/user.gif) no-repeat'> {0}</div>", value);
		}},
		'f_name':{width:80},
		'f_caption':{width:80},
		'f_dept_name':{width:100},
		'f_type':{width:60},
		'f_default_desktop':{width:50},
		'f_state':{width:50},
		'f_email':{width:100},
		'f_cellphone':{width:100},
		'f_note':{width:150}
	}
});
