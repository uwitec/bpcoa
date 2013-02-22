// 模块数据表配置项定义
Mixky.designtool.Class.registeModule({
	name : 'menu',
	text : '菜单',
	note : '系统定义菜单',
	iconCls : 'icon-designtool-menu',
	properties : [{
    	name:'id', 
    	text:'ID', 
    	xeditor:'none', 
    	note:'菜单ID，数据库中的唯一标识。'
    },{
    	name:'f_name', 
    	text:'菜单标识', 
    	xeditor:'string',
    	xconfig : {
    		config : {
    			maxLength:50,
    			allowBlank:false
    		}
    	},
    	note:'标识菜单的英文名称。'
    },{
    	name:'f_caption', 
    	text:'菜单名称', 
    	xeditor:'string',
    	xconfig : {
    		config : {
    			maxLength:50,
    			allowBlank:false
    		}
    	},
    	note:'菜单名称。'
    },{
    	name:'f_icon', 
    	text:'图标', 
    	xeditor:'string',
    	xconfig : {
    		config : {
    			maxLength:50
    		}
    	},
    	note:'菜单图标。'
    },{
    	name:'f_modulekey', 
    	text:'模块标识', 
    	xeditor:'string',
    	note:'菜单对应的模块标识。'
    },{
    	name:'f_handler', 
    	text:'菜单操作', 
    	xeditor:'textbox',
    	note:'菜单操作函数。'
    },{
    	name:'f_note', 
    	text:'备注', 
    	xeditor:'textbox',
    	note:'说明信息。'
    },{
    	name:'f_order', 
    	note:'菜单排序、自动维护。'
    }],
	propertyColumns : {
		'f_name':{width:100},
		'f_caption':{width:100},
		'f_modulekey':{width:100},
		'f_icon':{width:100},
		'f_handler':{width:150},
		'f_note':{width:150}
	}
});
