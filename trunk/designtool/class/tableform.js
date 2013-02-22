// 模块数据表配置项定义
Mixky.designtool.Class.registeModule({
	name : 'tableform',
	text : '表单',
	note : '数据表字段表单定义',
	iconCls : 'icon-designtool-tableform',
	detailurl : 'ui/tableform.fieldmap.do',
	properties : [{
    	name:'f_fieldmap', 
    	text:'表单字段', 
    	xeditor:'textbox', 
    	note:'表单的字段列表定义。'
    },{
    	name:'f_columns', 
    	text:'列数', 
    	xeditor:'number', 
    	note:'表单显示的总列数。'
    },{
    	name:'f_width', 
    	text:'宽度', 
    	xeditor:'number', 
    	note:'背景表单宽度，单位：毫米。'
    },{
    	name:'f_height', 
    	text:'高度', 
    	xeditor:'number', 
    	note:'背景表单高度，单位：毫米。'
    }],
	propertyColumns : {
		'f_key':{width:120},
		'f_name':{width:110, header:'表单名'},
		'f_caption':{width:110, header:'中文名'},
		'f_columns':{width:50},
		'f_width':{width:50},
		'f_height':{width:50},
		'f_config':{width:100},
		'f_note':{width:150}
	},
	extendsMenu : [{
		text : '编辑背景窗口',
		iconCls : 'icon-designtool-edit',
		handler : function(){
			var grid = this.items.get(0).items.get(0);
			var sm = grid.getSelectionModel();
			var record = sm.getSelected();
			if(Ext.isDefined(record)){
				var key = record.get('key');
				var caption = record.get('f_caption');
				var win = new Ext.Window({
					iconCls : 'icon-designtool-edit',
					title : '编辑 ' + caption + ' 表单域显示',
					modal : true,
					maximizable : true,
					minimizable : false,
					minimizable : false,
					resizable : true,
					width : 700,
					height : 500,
					layout : 'fit',
					items : {
						id : 'form-bg-editor',
						autoScroll : true,
						layout:'fit',
						autoLoad : {
							scripts:true,
							url : 'ui/tableform.bgeditor.do',
							params : {
								key : key
							}
						}
					}
				});
				win.show();
			}
		}
	}]
});
