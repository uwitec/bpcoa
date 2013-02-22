
//=================================================================
//	�ļ�����action.js
//=================================================================
// 模块数据表配置项定义
Mixky.designtool.Class.registeModule({
	name : 'action',
	text : '操作按钮',
	note : '定义操作按钮',
	iconCls : 'icon-designtool-action',
	orderable : true,
	properties : [{
    	name:'f_icon', 
    	text:'图标', 
    	xeditor:'string', 
    	note:'按钮的图标类名。'
    },{
    	name:'f_handler', 
    	text:'操作函数', 
    	xeditor:'textbox', 
    	note:'操作的客户端执行函数脚本。'
    },{
    	name:'f_default', 
    	text:'默认操作', 
    	xeditor:'boolean', 
    	note:'是否默认操作，在视图双击时指定执行的操作。'
    }],
	propertyColumns : {
		'f_key':{width:120},
		'f_name':{width:70, header:'按钮名'},
		'f_caption':{width:70, header:'中文名'},
		'f_icon':{width:70},
		'f_default':{width:50},
		'f_handler':{width:200},
		'f_config':{width:150},
		'f_note':{width:150}
	}
});

//=================================================================
//	�ļ�����authoritymap.js
//=================================================================
// 模块数据表配置项定义
Mixky.designtool.Class.registeModule({
	name : 'authorithmap',
	text : '文档权限映射',
	note : '',
	iconCls : 'icon-designtool-authorithmap',
	properties : [{
    	name:'f_state', 
    	text:'状态名', 
    	xeditor:'string', 
    	note:'权限列表的状态。'
    },{
    	name:'f_identity', 
    	text:'身份名', 
    	xeditor:'string', 
    	note:'权限列表的身份。'
    },{
    	name:'f_substate', 
    	text:'子状态', 
    	xeditor:'string', 
    	note:'权限列表的子状态，用于对状态进行细分。'
    },{
    	name:'f_authorities', 
    	text:'权限列表', 
    	xeditor:'jsonobject', 
    	note:'记录文档中所有Key的权限列表。'
    }]
});

//=================================================================
//	�ļ�����column.js
//=================================================================
// 模块数据表配置项定义
Mixky.designtool.Class.registeModule({
	name : 'column',
	text : '视图列',
	note : '定义视图显示列',
	iconCls : 'icon-designtool-column',
	orderable : true,
	properties : [{
    	name:'f_type', 
    	text:'列类型', 
    	xeditor:'selectkeymap', 
    	xconfig:{
    		datas:[[0, 'none'], [1, 'string'], [2, 'dictionary'], [3, 'integer'], [4, 'float'], [5, 'date'], [6, 'datetime'], [7, 'jsonobject'], [8, 'icon'], [9, 'file'], [99, 'custom']],
    		readOnly:true
    	},
    	note:'显示字段对应的显示类型。'
    },{
    	name:'f_asname', 
    	text:'列别名', 
    	xeditor:'string', 
    	note:'显示字段对应的显示类型。'
    },{
    	name:'f_query_type', 
    	text:'查询类型', 
    	xeditor:'selectkeymap', 
    	xconfig:{
    		datas:[[0, 'none'], [1, 'string'], [2, 'number'], [3, 'date'], [4, 'dictionary']],
    		readOnly:true
    	},
    	note:'定义字段的查询类型。'
    },{
    	name:'f_summary_type', 
    	text:'汇总类型', 
    	xeditor:'select', 
    	xconfig:{
			datas:['none', 'sum', 'count', 'max', 'min', 'average'],
    		readOnly:true
    	},
    	note:'定义字段的汇总类型。'
    },{
    	name:'f_orderable', 
    	text:'排序', 
    	xeditor:'boolean', 
    	note:'定义字段是否支持排序。'
    },{
    	name:'f_width', 
    	text:'列宽', 
    	xeditor:'string', 
    	note:'定义字段的列宽度。'
    }],
	propertyColumns : {
		'f_key':{width:120},
		'f_name':{width:100, header:'列名'},
		'f_asname':{width:100, header:'别名'},
		'f_caption':{width:100, header:'标题'},
		'f_type':{width:80},
		'f_query_type':{width:70},
		'f_summary_type':{width:70},
		'f_orderable':{width:50},
		'f_width':{width:50},
		'f_config':{width:150},
		'f_note':{width:150}
	}
});

//=================================================================
//	�ļ�����configuration.js
//=================================================================
// 模块数据表容器配置项定义
Mixky.designtool.Class.registeModule({
	isSingle : true,
	name : 'configuration',
	text : '运行参数设置',
	note : '设置系统运行参数',
	iconCls : 'icon-designtool-configuration',
    properties : [{
    	name:'webRootPath', 
    	text:'应用目录', 
    	xeditor:'none', 
    	note:'服务器端应用程序发布目录。'
    },{
    	name:'applicationName', 
    	text:'应用名称', 
    	xeditor:'string', 
    	note:'设置应用程序名，例如：[ 创想天空应用平台 ]。'
    },{
    	name:'fileUploadPath',
        text:'文件上传路径', 
    	xeditor:'string', 
    	note:'设置文件上传服务器端临时目录，填写相对路径 例：[/upload]'
    },{
    	name:'resourcePath',
        text:'资源路径', 
        xeditor:'string', 
        note:'设置存储应用程序资源目录，填写相对路径 例：[/resources]'
    },{
    	name:'useIdentifyCode',
    	text:'启用验证码', 
        xeditor:'boolean', 
        note:'设置登录时是否启用验证码。'
    }],
	editors : [
	           'ui/configuration.do'
	]
});

//=================================================================
//	�ļ�����dept.js
//=================================================================
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

//=================================================================
//	�ļ�����deptfolder.js
//=================================================================
// 模块数据表容器配置项定义
Mixky.designtool.Class.registeModule({
	isSingle : true,
	name : 'deptfolder',
	text : '部门管理',
	note : '管理系统机构定义',
	iconCls : 'icon-designtool-deptfolder',
	editors : [
	           'organization/dept.list.do'
	]
});

//=================================================================
//	�ļ�����dictionary.js
//=================================================================
// 模块数据表配置项定义
Mixky.designtool.Class.registeModule({
	name : 'dictionary',
	text : '字典数据',
	note : '系统定义字典数据',
	iconCls : 'icon-designtool-dictionary',
	properties : [{
    	name:'id', 
    	text:'ID', 
    	xeditor:'none', 
    	note:'字典ID，数据库中的唯一标识。'
    },{
    	name:'f_type', 
    	text:'类型', 
    	xeditor:'selectkeymap', 
    	xconfig:{
    		datas:[[0,'用户字典'],[1,'系统字典']],
    		readOnly:true
    	},
    	note:'流程类型。'
    },{
    	name:'f_name', 
    	text:'数据标识', 
    	xeditor:'string',
    	xconfig : {
    		config : {
    			maxLength:50,
    			allowBlank:false
    		}
    	},
    	note:'数据标识。'
    },{
    	name:'f_caption', 
    	text:'数据名称', 
    	xeditor:'string',
    	xconfig : {
    		config : {
    			maxLength:50,
    			allowBlank:false
    		}
    	},
    	note:'字典数据中文名称。'
    },{
    	name:'f_note', 
    	text:'备注', 
    	xeditor:'textbox',
    	note:'说明信息。'
    },{
    	name:'type', 
    	note:'类型、角色或用户。'
    },{
    	name:'f_order', 
    	note:'排序、自动维护。'
    }],
	propertyColumns : {
		'f_name':{width:100, renderer:function(value, p, record) {
			var type = record.get("type");
			return String.format("<div style='height:16px;padding-left:23px;background:transparent url(icon/{0}.gif) no-repeat'> {1}</div>", type, value);
		}},
		'f_type':{width:80},
		'f_caption':{width:120},
		'f_note':{width:150}
	}
});

//=================================================================
//	�ļ�����dictionaryfolder.js
//=================================================================
// 模块数据表容器配置项定义
Mixky.designtool.Class.registeModule({
	isSingle : true,
	name : 'dictionaryfolder',
	text : '字典管理',
	note : '管理系统字典数据定义',
	iconCls : 'icon-designtool-dictionaryfolder',
	editors : [
	    'dictionary/dictionary.list.do'
	]
});

//=================================================================
//	�ļ�����document.js
//=================================================================
// 文档配置项定义
Mixky.designtool.Class.registeModule({
	name : 'document',
	text : '文档',
	note : '',
	iconCls : 'icon-designtool-document',
	jsonable : true,
	copyable : true,
	deletable : true,
	subModules : ['panel', 'action', 'state', 'substate', 'identity', 'authoritymap'],
    properties : [{
    	name:'f_icon', 
    	text:'图标', 
    	xeditor:'string', 
    	note:'文档图标，指定文档的图标名称。'
    },{
    	name:'f_i_table', 
    	text:'数据表', 
    	xeditor:'designobject',
    	xconfig:{
    		remoteRenderType:'renderDesignObject',
    		parentKey:'',
    		mclass:'table',
    		selectInParent:true
    	},
    	note:'选择文档对应的数据表定义。'
    },{
    	name:'f_i_flow', 
    	text:'应用流程', 
    	xeditor:'designobject', 
    	xconfig:{
    		remoteRenderType:'renderDesignObject',
    		parentKey:'',
    		mclass:'flow',
    		selectInParent:true
    	},
    	note:'选择文档的使用流程。'
    }],
	editors : [
       'ui/properties.do',
       'ui/objectgrideditor.do?type=action',
       'ui/objectgrideditor.do?type=state',
       'ui/objectgrideditor.do?type=substate',
       'ui/objectgrideditor.do?type=identity',
       'ui/objectgrideditor.do?type=panel',
       'ui/document.authoritymap.do'
    ]
});

//=================================================================
//	�ļ�����documentfolder.js
//=================================================================
// 模块文档配置项定义
Mixky.designtool.Class.registeModule({
	name : 'documentfolder',
	text : '文档容器',
	note : '模块文档容器节点',
	iconCls : 'icon-designtool-documentfolder',
	subModules : ['document']
});

//=================================================================
//	�ļ�����documenttype.js
//=================================================================
// 查询配置项定义
Mixky.designtool.Class.registeModule({
	name : 'documenttype',
	text : '文档类型',
	note : '',
	iconCls : 'icon-designtool-documenttype',
	jsonable : true,
	copyable : true,
	deletable : true,
	subModules : ['action'],
	properties : [{
    	name:'f_type', 
    	text:'注册类型', 
    	xeditor:'selectkeymap',  
    	xconfig:{
    		datas:[[1,'文档对象'],[2,'URL'],[0,'自定义']],
    		readOnly:true
    	},
    	note:'文档注册类型，1：文档对象；2：URL；0：自定义'
    },{
    	name:'f_param', 
    	text:'注册参数', 
    	xeditor:'string', 
    	note:'定义注册类型的相关参数（如：文档Key）。'
    },{
    	name:'f_title_column', 
    	text:'视图标题列名', 
    	xeditor:'string', 
    	note:'定义文档类型对应的视图标题列名称，用于维护文档类型的收藏夹。'
    },{
    	name:'f_icon', 
    	text:'图标', 
    	xeditor:'string', 
    	note:'定义文档类型的图标。'
    },{
    	name:'f_handler', 
    	text:'操作函数', 
    	xeditor:'textbox', 
    	note:'JS函数function(id)类型为自定义时使用该函数。'
    }],
	editors : [
       'ui/properties.do',
       'ui/objectgrideditor.do?type=action'
    ]
});

//=================================================================
//	�ļ�����documenttypefolder.js
//=================================================================
// 模块查询定义容器配置项定义
Mixky.designtool.Class.registeModule({
	name : 'documenttypefolder',
	text : '文档类型注册容器',
	note : '模块文档类型注册容器节点',
	iconCls : 'icon-designtool-documenttypefolder',
	subModules : ['documenttype']
});

//=================================================================
//	�ļ�����field.js
//=================================================================
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

//=================================================================
//	�ļ�����flow.js
//=================================================================
// 标签界面配置项定义
Mixky.designtool.Class.registeModule({
	name : 'flow',
	text : '流程',
	note : '',
	iconCls : 'icon-designtool-flow',
	jsonable : true,
	copyable : true,
	deletable : true,
	subModules : ['node'],
	properties : [{
    	name:'f_type', 
    	text:'类型', 
    	xeditor:'selectkeymap', 
    	xconfig:{
    		datas:[[0,'普通流程'],[1,'子流程']],
    		readOnly:true
    	},
    	note:'流程类型。'
    },{
    	name:'f_administrator', 
    	text:'管理员', 
    	xeditor:'organization', 
    	xconfig:{
			remoteRenderType:'renderUserExpression',
			valueSeparator:'',
    		selectType:'mix'
    	},
    	note:'设定流程管理员，可以管理流程的状态和数据。'
    },{
    	name:'f_reader', 
    	text:'流程读者', 
    	xeditor:'organization', 
    	xconfig:{
			remoteRenderType:'renderUserExpression',
			valueSeparator:'',
    		selectType:'mix'
    	},
    	note:'设定流程读者，可以浏览流程数据。'
    }],
	editors : [
       'ui/properties.do',
       'ui/workflow.do'
    ]
});

//=================================================================
//	�ļ�����flowfolder.js
//=================================================================
// 模块流程容器配置项定义
Mixky.designtool.Class.registeModule({
	name : 'flowfolder',
	text : '流程容器',
	note : '模块流程容器节点',
	iconCls : 'icon-designtool-flowfolder',
	subModules : ['flow']
});

//=================================================================
//	�ļ�����gridroweditor.js
//=================================================================
// 模块配置项定义
Mixky.designtool.Class.registeModule({
	name : 'gridroweditor',
	text : '属性编辑范例',
	note : '',
	iconCls : 'icon-designtool-gridroweditor',
	editors : [
       'ui/gridroweditor.do'
    ],
	propertyColumns : {
		'none':{width:80},
		'readonly':{width:50},
		'string':{width:70},
		'number':{width:50},
		'textarea':{width:60},
		'textbox':{width:120},
		'boolean':{width:60},
		'date':{width:60},
		'datetime':{width:60},
		'select':{width:60},
		'selectkeymap':{width:60},
		'jsonobject':{width:120},
		'designobject':{width:120},
		'organization':{width:120},
		'extend':{width:60},
		'custom':{width:60},
		'paneltriggerfield':{width:120}
	},
    properties : [{
    	name:'none', 
    	value:'none',
    	text:'显示框', 
    	xeditor:'none', 
    	note:'显示属性，不支持参数。'
    },{
    	name:'readonly', 
    	value:'readonly',
    	text:'只读属性', 
    	xeditor:'readonly', 
    	note:'只读显示属性，不支持参数。'
    },{
    	name:'string', 
    	value:'string',
    	text:'普通字符', 
    	xeditor:'string', 
    	note:'普通字符编辑，不支持参数。'
    },{
    	name:'number', 
    	value:'123',
    	text:'数字框', 
    	xeditor:'number', 
    	note:'数字编辑框，支持renderer参数'
    },{
    	name:'textarea', 
    	value:'textarea1\ntextarea2',
    	text:'多行文本', 
    	xeditor:'textarea', 
    	note:'普通字符编辑，height:高度。'
    },{
    	name:'textbox', 
    	value:'textbox1\ntextbox2',
    	text:'文本窗口', 
    	xeditor:'textbox', 
    	note:'普通字符编辑，不支持参数。'
    },{
    	name:'boolean', 
    	value:true,
    	text:'布尔型', 
    	xeditor:'boolean', 
    	note:'布尔型编辑，不支持参数'
    },{
    	name:'date', 
    	value:'2009-09-19',
    	text:'日期', 
    	xeditor:'date', 
    	note:'日期编辑，format:日期格式'
    },{
    	name:'datetime', 
    	value:'2009-09-19 10:10',
    	text:'日期时间', 
    	xeditor:'datetime', 
    	xconfig:{
    		format:'Y-m-d h:m'
    	},
    	note:'日期时间编辑，format:时间'
    },{
    	name:'select', 
    	value:'选项2',
    	text:'选择框', 
    	xeditor:'select', 
    	xconfig:{
    		datas:['选项1','选项2'],
    		readOnly:true
    	},
    	note:'下拉选择框编辑。data:选项数组; editable:是否可编辑'
    },{
    	name:'selectkeymap', 
    	value:3,
    	text:'选择框', 
    	xeditor:'selectkeymap', 
    	xconfig:{
    		datas:[[1,'选项1'],[2,'选项2'],[3,'选项3']],
    		readOnly:true
    	},
    	note:'下拉选择框编辑。data:选项数组; editable:是否可编辑'
    },{
    	name:'jsonobject',
    	value:{string:'string',boolean:true, object:{test1:'test1', test2:'test2'}, array:['array1','array2']},
    	text:'JSON对象',
    	xeditor:'jsonobject', 
    	note:'单选钮编辑。type：[simple,keymap]; data:选项数组'
    },{
    	name:'designobject',
    	value:{"classpath":"table","data":"a.table-1"},
    	text:'设计对象',
    	xeditor:'designobject', 
    	xconfig:{
    		remoteRenderType:'renderDesignObject',
    		parentKey:'',
    		mclass:'table',
    		selectInParent:true
    	},
    	note:'选择设计对象。parent:指定父节点;type:指定对象类型'
    },{
    	name:'organization',
    	value:['user'],
    	text:'选择人员',
    	xeditor:'organization', 
    	xconfig:{
			remoteRenderType:'renderUserExpression',
    		selectType:'user'
    	},
    	note:'人员选择框。selectType, selectMulti, valueField, displayField'
    },{
    	name:'extend',
    	text:'扩展',
    	xeditor:'extend', 
    	xconfig:{
    		xeditortype:'string',
    		config:{
    			readOnly:true
    		}
    	},
    	note:'扩展编辑框，支持xeditortype,xconfig,config属性'
    },{
    	name:'custom',
    	text:'自定义',
    	xeditor:'custom', 
    	xconfig:{
    		editor : {
    			xtype:'textfield'
    		}
    	},
    	note:'自定义编辑框，支持editor属性。'
    },{
    	name:'paneltriggerfield',
    	text:'空白下拉框',
    	xeditor:'custom', 
    	xconfig:{
    		editor : {xtype:'paneltriggerfield'}
    	},
    	note:'空白下拉框，支持editor属性。'
    }]
});

//=================================================================
//	�ļ�����group.js
//=================================================================
// 查询配置项定义
Mixky.designtool.Class.registeModule({
	name : 'group',
	text : '分组',
	note : '',
	iconCls : 'icon-designtool-group',
	jsonable : true,
	copyable : true,
	deletable : true,
	subModules : ['group'],
	properties : [{
    	name:'f_type', 
    	text:'类型', 
    	xeditor:'selectkeymap', 
    	xconfig:{
    		datas:[[0,'none'], [1,'静态分组'], [2,'字段分组'],[3,'下级单位'],[4,'下级用户'],[5,'组织结构'],[6,'组织结构用户'],[7,'数据字典'],[99, '自定义']],
    		readOnly:true
    	},
    	note:'指定查询分组类型。'
    },{
    	name:'f_field', 
    	text:'分组显示字段', 
    	xeditor:'string', 
    	note:'定义分组显示字段。'
    },{
    	name:'f_valuefield', 
    	text:'分组值字段', 
    	xeditor:'string', 
    	note:'定义分组值字段，如果值字段为空，则以显示字段作为参数值。'
    },{
    	name:'f_icon', 
    	text:'图标', 
    	xeditor:'string', 
    	note:'指定分组项显示图标。'
    },{
    	name:'f_url', 
    	text:'解析类路径', 
    	xeditor:'string', 
    	note:'指定分组的服务器端解析路径，类型为【自定义】时起作用。'
    }],
	editors : [
       'ui/properties.do',
       'ui/objectgrideditor.do?type=action'
    ]
});

//=================================================================
//	�ļ�����identity.js
//=================================================================
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

//=================================================================
//	�ļ�����menu.js
//=================================================================
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

//=================================================================
//	�ļ�����menuauthfolder.js
//=================================================================
// 模块数据表容器配置项定义
Mixky.designtool.Class.registeModule({
	isSingle : true,
	name : 'menuauthfolder',
	text : '菜单权限',
	note : '管理系统菜单权限设置',
	iconCls : 'icon-designtool-menuauthfolder',
	editors : [
	    'authority/menuauth.list.do'
	]
});

//=================================================================
//	�ļ�����menufolder.js
//=================================================================
// 模块容器配置项定义
Mixky.designtool.Class.registeModule({
	isSingle : true,
	name : 'menufolder',
	text : '菜单管理',
	note : '管理应用菜单',
	iconCls : 'icon-designtool-menufolder',
	editors : [
	           'desktop/menu.list.do'
	]
});

//=================================================================
//	�ļ�����module.js
//=================================================================
// 模块配置项定义
Mixky.designtool.Class.registeModule({
	name : 'module',
	text : '应用模块',
	note : '',
	iconCls : 'icon-designtool-module',
	jsonable : true,
	copyable : true,
	deletable : true,
	subModules : ['table', 'query', 'panel', 'document','flow'],
	editors : [
       'ui/properties.do'
    ],
    properties : [{
    	name:'f_type', 
    	text:'类型', 
    	xeditor:'selectkeymap', 
    	xconfig:{
    		datas:[[0,'基础模块'],[1,'标准模块'],[2,'定制模块']],
    		readOnly:true
    	},
    	note:'模块类型，分为基础模块、标准模块和定制模块。'
    },{
    	name:'f_url', 
    	text:'模块路径', 
    	xeditor:'string', 
    	note:'模块路径，自定义模块的解析文件。'
    },{
    	name:'f_version', 
    	text:'版本', 
    	xeditor:'string', 
    	note:'模块版本，标记模块的版本号。'
    },{
    	name:'f_icon', 
    	text:'图标', 
    	xeditor:'string', 
    	note:'模块图标，指定模块的图标名称。'
    },{
    	name:'f_useflow', 
    	text:'使用流程', 
    	xeditor:'boolean', 
    	note:'表明模块是否使用流程。'
    }]
});

//=================================================================
//	�ļ�����moduleauthorityfolder.js
//=================================================================
// 模块数据表配置项定义
Mixky.designtool.Class.registeModule({
	name : 'moduleauthorityfolder',
	text : '权限配置',
	note : '模块设计对象权限配置定义',
	iconCls : 'icon-designtool-moduleauthorityfolder',
	editors : [
	    'ui/moduleauthority.do',
	]
});

//=================================================================
//	�ļ�����modulefolder.js
//=================================================================
// 模块容器配置项定义
Mixky.designtool.Class.registeModule({
	name : 'modulefolder',
	text : '模块容器',
	note : '模块容器节点',
	iconCls : 'icon-designtool-modulefolder',
	subModules : ['module']
});

//=================================================================
//	�ļ�����modulemenu.js
//=================================================================
// 模块数据表配置项定义
Mixky.designtool.Class.registeModule({
	name : 'modulemenu',
	text : '模块菜单',
	note : '模块菜单定义',
	iconCls : 'icon-designtool-modulemenu',
	orderable : true,
	properties : [{
    	name:'f_icon', 
    	text:'图标', 
    	xeditor:'string', 
    	note:'模块菜单图标。'
    },{
    	name:'f_i_view', 
    	text:'相关视图', 
    	xeditor:'designobject', 
    	xconfig:{
    		remoteRenderType:'renderDesignObject',
    		parentKey:'',
    		mclass:'view',
    		selectInParent:true
    	},
    	note:'定义模块菜单的相关视图。'
    },{
    	name:'f_i_group', 
    	text:'分组', 
    	xeditor:'designobject', 
    	xconfig:{
    		remoteRenderType:'renderDesignObject',
    		parentKey:'',
    		mclass:'group',
    		selectInParent:true
    	},
    	note:'定义模块菜单的视图分组。'
    },{
    	name:'f_subject_url', 
    	text:'桌面栏目路径', 
    	xeditor:'string', 
    	note:'作为桌面栏目的打开路径。'
    },{
    	name:'f_handler', 
    	text:'操作函数', 
    	xeditor:'textbox', 
    	note:'操作的客户端执行函数脚本。'
    },{
    	name:'f_default', 
    	text:'默认操作', 
    	xeditor:'boolean', 
    	note:'是否默认操作，在视图双击时指定执行的操作。'
    },{
    	name:'f_formenu', 
    	text:'作为菜单', 
    	xeditor:'boolean', 
    	note:'是否作为界面或分组菜单显示。'
    },{
    	name:'f_forshortcut', 
    	text:'作为快捷键', 
    	xeditor:'boolean', 
    	note:'是否作为快捷键显示。'
    }],
	propertyColumns : {
		'f_key':{width:120},
		'f_name':{width:110},
		'f_caption':{width:110},
		'f_icon':{width:80},
		'f_i_view':{width:80},
		'f_i_group':{width:80},
		'f_subject_url':{width:100},
		'f_handler':{width:150},
		'f_default':{width:50},
		'f_formenu':{width:50},
		'f_forshortcut':{width:50},
		'f_config':{width:110},
		'f_note':{width:150}
	},
	editors : [
	    'ui/objectgrideditor.do?type=modulemenu',
	]
});

//=================================================================
//	�ļ�����modulemenufolder.js
//=================================================================
// 模块文档配置项定义
Mixky.designtool.Class.registeModule({
	name : 'modulemenufolder',
	text : '模块菜单',
	note : '模块菜单容器节点',
	iconCls : 'icon-designtool-modulemenufolder',
	subModules : ['modulemenu'],
	editors : [
	    'ui/objectgrideditor.do?type=modulemenu',
	]
});

//=================================================================
//	�ļ�����modulerole.js
//=================================================================
// 标签界面配置项定义
Mixky.designtool.Class.registeModule({
	name : 'modulerole',
	text : '模块角色',
	note : '',
	iconCls : 'icon-designtool-modulerole',
	jsonable : true,
	copyable : true,
	deletable : true,
	properties : [],
	editors : [
       'ui/properties.do'
    ]
});

//=================================================================
//	�ļ�����moduleroleauthfolder.js
//=================================================================
// 模块数据表容器配置项定义
Mixky.designtool.Class.registeModule({
	isSingle : true,
	name : 'moduleroleauthfolder',
	text : '应用权限',
	note : '管理应用模块角色权限定义',
	iconCls : 'icon-designtool-moduleroleauthfolder',
	editors : [
	    'authority/moduleroleauth.list.do'
	]
});

//=================================================================
//	�ļ�����modulerolefolder.js
//=================================================================
// 模块文档配置项定义
Mixky.designtool.Class.registeModule({
	name : 'modulerolefolder',
	text : '角色定义',
	note : '模块角色定义',
	iconCls : 'icon-designtool-modulerolefolder',
	subModules : ['modulerole']
});

//=================================================================
//	�ļ�����node.js
//=================================================================
// 标签界面配置项定义
Mixky.designtool.Class.registeModule({
	name : 'node',
	text : '节点',
	note : '',
	iconCls : 'icon-designtool-node',
	jsonable : true,
	copyable : true,
	deletable : true,
	subModules : ['route'],
	properties : [{
    	name:'f_type', 
    	text:'节点类型', 
    	xeditor:'selectkeymap',  
    	xconfig:{
    		datas:[[0,'开始节点'],[1,'普通节点'],[2,'归档节点'],[3,'子流程节点'],[4,'结束节点'],[5,'计算节点']],
    		readOnly:true
    	},
    	note:'节点类型，0：开始节点；1：普通节点；2：归档节点；3：子流程节点；4：结束节点；5：计算节点' 
    },{
    	name:'f_merge_route', 
    	text:'路由计算', 
    	xeditor:'selectkeymap', 
    	xconfig:{
    		datas:[[0,'交集'],[1,'并集']],
    		readOnly:true
    	},
    	note:'节点办理人与路由办理人计算关系，intersection：交集；outersection：并集。'
    },{
    	name:'f_process_type', 
    	text:'办理类型',  
    	xeditor:'selectkeymap',  
    	xconfig:{
    		datas:[[0,'单人办理'],[1,'多人顺序'],[2,'多人并行'],[3,'申请办理']],
    		readOnly:true
    	},
    	note:'节点办理类型，0：单人办理；1：多人顺序；2：多人并行；3：申请办理'
    },{
    	name:'f_process_user', 
    	text:'办理人', 
    	xeditor:'organization', 
    	xconfig:{
    		selectType:'mix',
    		remoteRenderType:'renderUserExpression'
    	},
    	note:'节点办理人。'
    },{
    	name:'f_allow_forward', 
    	text:'允许转办', 
    	xeditor:'boolean', 
    	note:'允许节点办理时的转办操作。'
    },{
    	name:'f_script', 
    	text:'计算脚本', 
    	xeditor:'textbox',
    	note:'节点自动计算处理脚本。'
    }],
	editors : [
       'ui/properties.do'
    ]
});

//=================================================================
//	�ļ�����orgchart.js
//=================================================================
// 模块数据表容器配置项定义
Mixky.designtool.Class.registeModule({
	isSingle : true,
	name : 'orgchart',
	text : '组织结构图',
	note : '组织结构图',
	iconCls : 'icon-designtool-deptfolder',
	editors : [
	           'organization/org.chart.do'
	]
});

//=================================================================
//	�ļ�����panel.js
//=================================================================
// 标签界面配置项定义
Mixky.designtool.Class.registeModule({
	name : 'panel',
	text : '标签界面',
	note : '',
	iconCls : 'icon-designtool-panel',
	jsonable : true,
	copyable : true,
	deletable : false,
	orderable : true,
	properties : [{
    	name:'f_icon', 
    	text:'图标', 
    	xeditor:'string', 
    	note:'标签窗口的图标。'
    },{
    	name:'f_type', 
    	text:'类型', 
    	xeditor:'selectkeymap', 
    	xconfig:{
    		datas:[[0,'普通表单'],[1, '属性表单'],[2,'只读表格'],[3,'行编辑表格'],[4,'明细属性编辑表格'],[5,'背景图表单'],[6,'公文正文表单'],[7,'红头文件表单'],[8,'流程跟踪'],[9,'RTF文本编辑表单'],[99,'自定义表单']],
    		readOnly:true
    	},
    	note:'标签界面的类型。'
    },{
    	name:'f_url', 
    	text:'标签路径', 
    	xeditor:'string', 
    	note:'标签的服务器端解析路径。'
    },{
    	name:'f_i_tableform', 
    	text:'相关表单', 
    	xeditor:'designobject', 
    	xconfig:{
    		remoteRenderType:'renderDesignObject',
    		parentKey:'',
    		mclass:'tableform',
    		selectInParent:true
    	},
    	note:'定义路由的目标节点。'
    },{
    	name:'f_i_view', 
    	text:'相关视图', 
    	xeditor:'designobject', 
    	xconfig:{
    		remoteRenderType:'renderDesignObject',
    		parentKey:'',
    		mclass:'view',
    		selectInParent:true
    	},
    	note:'定义路由的目标节点。'
    },{
    	name:'f_custom_script', 
    	text:'附加JS脚本', 
    	xeditor:'textbox', 
    	note:'编辑页面生成后附加输出的自定义JS脚本。'
    }],
	propertyColumns : {
		'f_key':{width:120},
		'f_name':{width:110},
		'f_caption':{width:110},
		'f_icon':{width:70},
		'f_type':{width:80},
		'f_url':{width:120},
		'f_i_tableform':{width:80},
		'f_i_view':{width:80},
		'f_custom_script':{width:120},
		'f_config':{width:120},
		'f_note':{width:150}
	},
	editors : [
       'ui/properties.do',
       'ui/objectgrideditor.do?type=action'
    ]
});

//=================================================================
//	�ļ�����panelfolder.js
//=================================================================
// 模块标签界面容器配置项定义
Mixky.designtool.Class.registeModule({
	name : 'panelfolder',
	text : '标签界面容器',
	note : '模块标签界面容器节点',
	iconCls : 'icon-designtool-panelfolder',
	subModules : ['formpanel', 'gridpanel', 'grideditorpanel', 'panel']
});

//=================================================================
//	�ļ�����portlet.js
//=================================================================
// 查询配置项定义
Mixky.designtool.Class.registeModule({
	name : 'portlet',
	text : '桌面栏目',
	note : '',
	iconCls : 'icon-designtool-portlet',
	jsonable : true,
	copyable : true,
	deletable : true,
	subModules : ['action'],
	properties : [{
    	name:'f_url', 
    	text:'URL', 
    	xeditor:'string', 
    	note:'桌面栏目URL，如不填写则默认为视图栏目。'
    },{
    	name:'f_viewkey', 
    	text:'视图KEY', 
    	xeditor:'string', 
    	note:'定义视图桌面栏目对应的视图KEY。'
    },{
    	name:'f_icon', 
    	text:'图标', 
    	xeditor:'string', 
    	note:'定义文档类型的图标。'
    },{
    	name:'f_refresh_interval', 
    	text:'刷新间隔', 
    	xeditor:'number', 
    	note:'桌面栏目的自动刷新间隔秒数，0为不自动刷新。'
    }],
	editors : [
       'ui/properties.do'
    ]
});

//=================================================================
//	�ļ�����portletfolder.js
//=================================================================
// 模块文档配置项定义
Mixky.designtool.Class.registeModule({
	name : 'portletfolder',
	text : '桌面栏目',
	note : '桌面栏目容器节点',
	iconCls : 'icon-designtool-portletfolder',
	subModules : ['portlet']
});

//=================================================================
//	�ļ�����propertygrid.js
//=================================================================
// 模块配置项定义
Mixky.designtool.Class.registeModule({
	name : 'propertygrid',
	text : '属性编辑范例',
	note : '',
	iconCls : 'icon-designtool-propertygrid',
	editors : [
       'ui/propertygrid.do'
    ],
    properties : [{
    	name:'none', 
    	value:'none',
    	text:'显示框', 
    	xeditor:'none', 
    	note:'显示属性，不支持参数。'
    },{
    	name:'readonly', 
    	value:'readonly',
    	text:'只读属性', 
    	xeditor:'readonly', 
    	note:'只读显示属性，不支持参数。'
    },{
    	name:'string', 
    	value:'string',
    	text:'普通字符', 
    	xeditor:'string', 
    	note:'普通字符编辑，不支持参数。'
    },{
    	name:'number', 
    	value:'number',
    	text:'数字框', 
    	xeditor:'number', 
    	note:'数字编辑框，支持renderer参数'
    },{
    	name:'textarea', 
    	value:'textarea1\ntextarea2',
    	text:'多行文本', 
    	xeditor:'textarea', 
    	note:'普通字符编辑，height:高度。'
    },{
    	name:'textbox', 
    	value:'textbox1\ntextbox2',
    	text:'文本窗口', 
    	xeditor:'textbox', 
    	note:'普通字符编辑，不支持参数。'
    },{
    	name:'boolean', 
    	value:true,
    	text:'布尔型', 
    	xeditor:'boolean', 
    	note:'布尔型编辑，不支持参数'
    },{
    	name:'date', 
    	value:'2009-09-19',
    	text:'日期', 
    	xeditor:'date', 
    	note:'日期编辑，format:日期格式'
    },{
    	name:'datetime', 
    	value:'2009-09-19 10:10',
    	text:'日期时间', 
    	xeditor:'datetime', 
    	xconfig:{
    		format:'Y-m-d h:m'
    	},
    	note:'日期时间编辑，format:时间'
    },{
    	name:'select', 
    	value:'选项2',
    	text:'选择框', 
    	xeditor:'select', 
    	xconfig:{
    		datas:['选项1','选项2'],
    		readOnly:true
    	},
    	note:'下拉选择框编辑。data:选项数组; editable:是否可编辑'
    },{
    	name:'selectkeymap', 
    	value:3,
    	text:'选择框', 
    	xeditor:'selectkeymap', 
    	xconfig:{
    		datas:[[1,'选项1'],[2,'选项2'],[3,'选项3']],
    		readOnly:true
    	},
    	note:'下拉选择框编辑。data:选项数组; editable:是否可编辑'
    },{
    	name:'check', 
    	text:'勾选框', 
    	xeditor:'check', 
    	xconfig:{
    		type:'keymap',
    		datas:[
                {boxLabel: 'Item 1', name: 'cb-auto-1', inputValue:'1'},
                {boxLabel: 'Item 2', name: 'cb-auto-3', inputValue:'2'},
                {boxLabel: 'Item 3', name: 'cb-auto-4', inputValue:'3'},
                {boxLabel: 'Item 4', name: 'cb-auto-5', inputValue:'4'}
            ],
    		split:';'
    	},
    	note:'勾选框编辑。type：[simple,keymap]; data:选项数组，split:分隔符。'
    },{
    	name:'radio', 
    	text:'单选钮', 
    	xeditor:'radio', 
    	xconfig:{
    		type:'keymap',
    		datas:[
                {boxLabel: 'Item 1', name: 'cb-auto-1', inputValue:'1'},
                {boxLabel: 'Item 2', name: 'cb-auto-1', inputValue:'2'},
                {boxLabel: 'Item 3', name: 'cb-auto-1', inputValue:'3'},
                {boxLabel: 'Item 4', name: 'cb-auto-1', inputValue:'4'}
            ]
    	},
    	note:'单选钮编辑。type：[simple,keymap]; data:选项数组'
    },{
    	name:'jsonobject',
    	value:{string:'string',boolean:true, object:{test1:'test1', test2:'test2'}, array:['array1','array2'], fn:(function(test){
    		return test;
    	})},
    	text:'JSON对象',
    	xeditor:'jsonobject', 
    	note:'单选钮编辑。type：[simple,keymap]; data:选项数组'
    },{
    	name:'designobject',
    	value:{"classpath":"table","data":"a.table-1"},
    	text:'设计对象',
    	xeditor:'designobject', 
    	xconfig:{
    		remoteRenderType:'renderDesignObject',
    		parentKey:'',
    		mclass:'table',
    		selectInParent:true
    	},
    	note:'选择设计对象。parent:指定父节点;type:指定对象类型'
    },{
    	name:'userselector1',
    	value:"user1;user2",
    	text:'选择人员',
    	xeditor:'organization', 
    	xconfig:{
			remoteRenderType:'renderUserExpression',
			valueSeparator:';',
    		selectType:'user'
    	},
    	note:'人员选择框。selectType, selectMulti, valueField, displayField'
    },{
    	name:'userselector2',
    	value:['dept'],
    	text:'选择部门',
    	xeditor:'organization', 
    	xconfig:{
    		selectType:'deptment',
    		remoteRenderType:'renderUserExpression',
    		valueField:'f_key'
    	},
    	note:'人员选择框。selectType, selectMulti, valueField, displayField'
    },{
    	name:'userselector3',
    	value:['mix'],
    	text:'混合人员选择',
    	xeditor:'organization', 
    	xconfig:{
    		selectType:'mix',
    		remoteRenderType:'renderUserExpression'
    	},
    	note:'人员选择框。selectType, selectMulti, valueField, displayField'
    },{
    	name:'extend',
    	text:'扩展',
    	xeditor:'extend', 
    	xconfig:{
    		xeditortype:'string',
    		config:{
    			readOnly:true
    		}
    	},
    	note:'扩展编辑框，支持xeditortype,xconfig,config属性'
    },{
    	name:'custom',
    	text:'自定义',
    	xeditor:'custom', 
    	xconfig:{
    		editor : {
    			xtype:'textfield'
    		}
    	},
    	note:'自定义编辑框，支持editor属性。'
    },{
    	name:'paneltriggerfield',
    	text:'空白下拉框',
    	xeditor:'custom', 
    	xconfig:{
    		editor : {xtype:'paneltriggerfield'}
    	},
    	note:'空白下拉框，支持editor属性。'
    }]
});

//=================================================================
//	�ļ�����query.js
//=================================================================
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

//=================================================================
//	�ļ�����queryfolder.js
//=================================================================
// 模块查询定义容器配置项定义
Mixky.designtool.Class.registeModule({
	name : 'queryfolder',
	text : '查询定义容器',
	note : '模块查询定义容器节点',
	iconCls : 'icon-designtool-queryfolder',
	subModules : ['query']
});

//=================================================================
//	�ļ�����relation.js
//=================================================================
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

//=================================================================
//	�ļ�����role.js
//=================================================================
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

//=================================================================
//	�ļ�����rolefolder.js
//=================================================================
// 模块数据表容器配置项定义
Mixky.designtool.Class.registeModule({
	isSingle : true,
	name : 'rolefolder',
	text : '角色管理',
	note : '管理系统角色定义',
	iconCls : 'icon-designtool-rolefolder',
	editors : [
	    'organization/role.list.do'
	]
});

//=================================================================
//	�ļ�����route.js
//=================================================================
// 标签界面配置项定义
Mixky.designtool.Class.registeModule({
	name : 'route',
	text : '路由',
	note : '',
	iconCls : 'icon-designtool-route',
	jsonable : true,
	copyable : true,
	deletable : true,
	subModules : ['relation'],
	properties : [{
    	name:'f_type', 
    	text:'路由类型', 
    	xeditor:'selectkeymap',  
    	xconfig:{
    		datas:[[0,'普通路由'],[1,'条件路由']],
    		readOnly:true
    	},
    	note:'路由类型，0：普通路由；1：条件路由。'
    },{
    	name:'f_route_expression', 
    	text:'路由条件', 
    	xeditor:'string', 
    	note:'定义路由的判断条件'
    },{
    	name:'f_access_user', 
    	text:'访问者', 
    	xeditor:'string', 
    	note:'定义路由的访问用户。'
    },{
    	name:'f_allow_return', 
    	text:'允许退回', 
    	xeditor:'boolean', 
    	note:'允许该条路由的退回办理操作。'
    },{
    	name:'f_allow_takeback', 
    	text:'允许拿回', 
    	xeditor:'boolean', 
    	note:'允许该条路的上一办理人进行拿回操作。'
    },{
    	name:'f_merge_type', 
    	text:'关系计算', 
    	xeditor:'selectkeymap', 
    	xconfig:{
    		datas:[[0,'交集'],[1,'并集']],
    		readOnly:true
    	},
    	note:'指定路由关系之间的计算方式，intersection：交集；outersection：并集。'
    }],
	editors : [
       'ui/properties.do',
       'ui/objectgrideditor.do?type=relation'
    ]
});

//=================================================================
//	�ļ�����state.js
//=================================================================
// 模块数据表配置项定义
Mixky.designtool.Class.registeModule({
	name : 'state',
	text : '文档状态',
	note : '定义文档状态',
	iconCls : 'icon-designtool-state',
	extendsMenu : [{
		text : '引入流程节点',
		iconCls : 'icon-designtool-importnodes',
		handler : function(){
			var grid = this.items.get(0);
			var key = grid.getParentKey();
			DesignToolDirect.importFlowStates(key, function(result, e){
				grid.getStore().reload();	
			});
		}
	}],
	propertyColumns : {
		'f_key':{width:120},
		'f_name':{width:110, header:'状态名'},
		'f_caption':{width:110, header:'中文名'},
		'f_note':{width:150}
	}
});

//=================================================================
//	�ļ�����substate.js
//=================================================================
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

//=================================================================
//	�ļ�����table.js
//=================================================================
// 模块数据表配置项定义
Mixky.designtool.Class.registeModule({
	name : 'table',
	text : '数据表',
	note : '模块数据表节点',
	iconCls : 'icon-designtool-table',
	jsonable : true,
	copyable : true,
	deletable : true,
	subModules : ['field'],
    properties : [{
    	name:'f_keyfield', 
    	text:'主键字段', 
    	xeditor:'string', 
    	note:'数据表的关键字名，默认为[id]。'
    }, {
    	name:'f_titlefield', 
    	text:'标题字段', 
    	xeditor:'string', 
    	note:'数据表的标题字段，默认为。'
    }],
	editors : [
       'ui/properties.do', 
       'ui/objectgrideditor.do?type=field', 
       'ui/objectgriddetaileditor.do?type=tableform'
    ]
});

//=================================================================
//	�ļ�����tablefolder.js
//=================================================================
// 模块数据表容器配置项定义
Mixky.designtool.Class.registeModule({
	name : 'tablefolder',
	text : '数据表容器',
	note : '模块数据表容器节点',
	iconCls : 'icon-designtool-tablefolder',
	subModules : ['table']
});

//=================================================================
//	�ļ�����tableform.js
//=================================================================
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

//=================================================================
//	�ļ�����templatefolder.js
//=================================================================
// 模块数据表容器配置项定义
Mixky.designtool.Class.registeModule({
	isSingle : true,
	name : 'templatefolder',
	text : '模板容器',
	note : '模板数据管理节点',
	iconCls : 'icon-designtool-templatefolder',
	subModules : ['all'],
	withoutSave : true,
	editors : [
	           'ui/templatefolder.do'
	]
});

//=================================================================
//	�ļ�����user.js
//=================================================================
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

//=================================================================
//	�ļ�����userfolder.js
//=================================================================
// 模块数据表容器配置项定义
Mixky.designtool.Class.registeModule({
	isSingle : true,
	name : 'userfolder',
	text : '用户管理',
	note : '管理系统用户',
	iconCls : 'icon-designtool-userfolder',
	editors : [
	           'organization/user.list.do'
	]
});

//=================================================================
//	�ļ�����view.js
//=================================================================
// 查询配置项定义
Mixky.designtool.Class.registeModule({
	name : 'view',
	text : '视图',
	note : '',
	iconCls : 'icon-designtool-view',
	jsonable : true,
	copyable : true,
	deletable : true,
	subModules : ['column', 'action','viewparameter'],
	properties : [{
    	name:'f_icon', 
    	text:'图标', 
    	xeditor:'string', 
    	note:'视图图标。'
    },{
    	name:'f_url', 
    	text:'视图路径', 
    	xeditor:'string', 
    	note:'视图的打开路径。'
    },{
    	name:'f_keycolumn', 
    	text:'关键列', 
    	xeditor:'string', 
    	note:'指定视图的唯一关键列名。'
    },{
    	name:'f_autoexpandcolumn', 
    	text:'自动扩展列', 
    	xeditor:'string', 
    	note:'指定视图的自动扩展列名。'
    },{
    	name:'f_single_select', 
    	text:'选择单行', 
    	xeditor:'boolean', 
    	note:'定义视图的列表选择模式。'
    },{
    	name:'f_page_size', 
    	text:'页记录数', 
    	xeditor:'number', 
    	note:'定义视图列表的每页显示记录数。'
    },{
    	name:'f_isquery', 
    	text:'支持查询', 
    	xeditor:'boolean', 
    	note:'视图是否支持查询。'
    },{
    	name:'f_issummary', 
    	text:'支持汇总', 
    	xeditor:'boolean', 
    	note:'视图是否支持列汇总。'
    },{
    	name:'f_i_documenttype', 
    	text:'文档类型', 
    	xeditor:'designobject', 
    	xconfig:{
    		remoteRenderType:'renderDesignObject',
    		parentKey:'',
    		mclass:'documenttype',
    		selectInParent:false
    	},
    	note:'选择视图列表对应的文档类型。'
    },{
    	name:'f_enable_favorite', 
    	text:'支持收藏', 
    	xeditor:'boolean', 
    	note:'对于支持收藏的视图，需要定义文档类型。'
    },{
    	name:'f_title_field', 
    	text:'标题列名', 
    	xeditor:'string', 
    	note:'指定视图的标题字段名，在收藏时将用该字段作为收藏项标题。'
    }],
	extendsMenu : [{
		text : '预览数据',
		iconCls : 'icon-designtool-viewdata'
	}],
	editors : [
       'ui/properties.do',
       'ui/objectgrideditor.do?type=column', 
       'ui/objectgrideditor.do?type=viewparameter', 
       'ui/objectgrideditor.do?type=action'
    ]
});

//=================================================================
//	�ļ�����viewparameter.js
//=================================================================
// 模块数据表配置项定义
Mixky.designtool.Class.registeModule({
	name : 'viewparameter',
	text : '视图参数',
	note : '定义视图所接受的参数。',
	iconCls : 'icon-designtool-viewparameter',
	properties : [{
    	name:'f_sql', 
    	text:'条件语句', 
    	xeditor:'string', 
    	note:'定义参数的查询条件语句。'
    },{
    	name:'f_nullsql', 
    	text:'空条件语句', 
    	xeditor:'string', 
    	note:'定义参数为空时的条件语句。'
    }],
	propertyColumns : {
		'f_key':{width:120},
		'f_name':{width:100, header:'参数名'},
		'f_caption':{width:100, header:'中文名'},
		'f_sql':{width:150},
		'f_nullsql':{width:150},
		'f_config':{width:120},
		'f_note':{width:150}
	}
});
