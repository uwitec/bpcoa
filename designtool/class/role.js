// 模块数据表配置项定义
Mixky.designtool.Class.registeModule({
	name : 'role',
	text : '角色',
	note : '系统定义决心额',
	iconCls : 'icon-designtool-role',
	properties : [{
    	name:'id', 
    	text:'ID', 
    	xeditor:'none', 
    	note:'角色ID，数据库中的唯一标识。'
    },{
    	name:'f_name', 
    	text:'英文名称', 
    	xeditor:'string',
    	xconfig : {
    		config : {
    			maxLength:50,
    			allowBlank:false
    		}
    	},
    	note:'角色英文名称。'
    },{
    	name:'f_caption', 
    	text:'角色名称', 
    	xeditor:'string',
    	xconfig : {
    		config : {
    			maxLength:50,
    			allowBlank:false
    		}
    	},
    	note:'角色中文名称。'
    },{
    	name:'f_note', 
    	text:'备注', 
    	xeditor:'textbox',
    	note:'说明信息。'
    },{
    	name:'f_order', 
    	note:'角色排序、自动维护。'
    },{
    	name:'type', 
    	note:'类型、角色或用户。'
    },{
    	name:'f_user_id', 
    	note:'用户ID，角色成员用。'
    }],
	propertyColumns : {
		'id':{width:50, renderer:function(value, p, record) {
			var type = record.get("type");
			return String.format("<div style='height:16px;padding-left:23px;background:transparent url(icon/{0}.gif) no-repeat'> {1}</div>", type, value);
		}},
		'f_name':{width:100},
		'f_caption':{width:120},
		'f_note':{width:150}
	}
});
