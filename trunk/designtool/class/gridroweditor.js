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
