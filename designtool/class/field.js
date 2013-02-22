// 模块数据表配置项定义
Mixky.designtool.Class.registeModule({
	name : 'field',
	text : '字段',
	note : '数据表字段定义',
	iconCls : 'icon-designtool-field',
	orderable : true,
	extendsMenu : [{
		text : '引入字段',
		iconCls : 'icon-designtool-importfield',
		handler : function(){
			var grid = this.items.get(0);
			var key = grid.getParentKey();
			var type = grid.getType();
			DesignToolDirect.buildTableField(key, type, function(result, e){
				grid.getStore().reload();	
			});
			//alert(this.getXType());
		}
	},'-',{
		text : '生成类代码',
		iconCls : 'icon-designtool-class',
		handler : function(){
			var grid = this.items.get(0);
			var key = grid.getParentKey();
			Ext.Msg.prompt('生成类代码[' + key + ']', '请输入类名:', function(btn, text){
			    if (btn == 'ok'){
					var win = new Ext.Window({
						width:500,
						height:500,
						modal : true,
						layout:'fit',
						iconCls:'icon-designtool-class',
						title:'[' + key + '] 类脚本',
						items:new Ext.Panel({
							autoScroll:true,
							autoLoad : {
								url : 'ui/table.class.do?key=' + key + '&classname=' + text
							}
						})
					});
					win.show();
			    }
			});
			
		}
	},'-',{
		text : '在数据库中创建',
		iconCls : 'icon-designtool-createtable',
		handler : function(){
			var grid = this.items.get(0);
			var key = grid.getParentKey();
			DesignToolDirect.buildDBTableField(key, function(result, e){
				if(result.success){
					Ext.MessageBox.alert("提示信息","创建表成功！");
				}else{
					Ext.MessageBox.alert("提示信息","数据库中已存在该表！");
				}
			});
			//alert(this.items.get(0).getXType());
		}
	}],
	properties : [{
    	name:'f_datatype_db', 
    	text:'DB类型', 
    	xeditor:'selectkeymap', 
    	xconfig:{
			datas:[[1,'char'],[2,'long'],[3,'int'],[4,'datetime'],[5,'float'],[6,'clob'],[7,'blob'],[0, 'none']],
    		readOnly:true
    	},
    	note:'字段对应数据库类型，none为无对应字段。'
    },{
    	name:'f_length', 
    	text:'长度', 
    	xeditor:'number', 
    	note:'字段最大长度，0为不限制。'
    },{
    	name:'f_datatype_java', 
    	text:'Java类型', 
    	xeditor:'selectkeymap', 
    	xconfig:{
			datas:[[1,'String'],[2,'long'],[3,'int'],[4,'date'],[5,'float'],[6,'blob'],[0, 'none']],
    		readOnly:true
    	},
    	note:'字段对应JAVA数据类型，none为无对应字段。'
    },{
    	name:'f_inputtype', 
    	text:'录入方式', 
    	xeditor:'selectkeymap', 
    	xconfig:{
			datas:[[0, 'none'],[1,'text'],[2,'textarea'],[3,'boolean'],[4,'number'],[5,'textbox'],[6,'date'],[7,'time'],[8,'datetime'],[9,'combox'],[10,'checkbox'],[11,'radiobox'],[12,'html'],[13,'file'],[14,'deptuser'],[15,'display'],[16,'organization'],[17,'opinion'], [18,'handsign'], [19,'comboview'], [20,'image'],[99,'custom']],
    		readOnly:true
    	},
    	note:'指定数据采集时的录入控件。'
    },{
    	name:'f_allowblank', 
    	text:'允许为空', 
    	xeditor:'boolean', 
    	note:'指定数据采集是否允许为空。'
    },{
    	name:'f_default_value', 
    	text:'默认值', 
    	xeditor:'string', 
    	note:'设置字段默认值。'
    }],
	propertyColumns : {
		'f_key':{width:120},
		'f_name':{width:110, header:'字段名'},
		'f_caption':{width:110, header:'中文名'},
		'f_datatype_db':{width:70},
		'f_length':{width:50},
		'f_datatype_java':{width:70},
		'f_inputtype':{width:70},
		'f_allowblank':{width:70},
		'f_default_value':{width:80},
		'f_config':{width:150},
		'f_note':{width:150}
	}
});
