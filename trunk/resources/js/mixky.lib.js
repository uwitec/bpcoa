Ext.namespace("Mixky.lib");
Ext.namespace("Mixky.app");

// 获得编辑器属性
Mixky.lib.getEditorConfig = function(xeditor, params){
	var editor = {};
	switch(xeditor){
	case 'none':
		editor = null;
		break;
	case 'boolean':
    	editor = {
    		xtype:'combo',
    		triggerAction:'all',
    		forceSelection: false,
    		editable:false,
    		store:[false, true]
    	};
		break;
	case 'number':
		editor = {
			xtype:'numberfield', 
			style:'text-align:left;',
			selectOnFocus:true
		}
		break;
	case 'textarea':
		editor = {
			xtype:'textarea',
			selectOnFocus:true
		}
		break;
	case 'date':
		editor = {
			xtype:'datefield',
			format:'Y-m-d'
		}
		break;
	case 'datetime':
		editor = {
			xtype:'datefield',
			format:'Y-m-d'
		}
		break;
    case 'select':
    	editor = {
        	xtype:'combo',
        	triggerAction:'all',
        	mode:'local',
        	forceSelection: false,
        	store:params.datas
        };
    	break;
	case 'selectkeymap':
    	editor = {
        	xtype:'combo',
        	triggerAction:'all',
        	mode:'local',
        	forceSelection: false,
        	store:new Ext.data.SimpleStore({
        		fields:['value', 'name'],
        		data:params.datas
        	}),
        	valueField:'value',
        	displayField:'name'
        };
		break;
	case 'check':
		editor = {
            xtype: 'checkboxgroup',
            items: params.datas
		}
		break;
	case 'radio':
		editor = {
            xtype: 'radiogroup',
            items: params.datas
		}
		break;
	case 'jsonobject':
    	editor = {
    		xtype : 'mixkyjsonobjectfield'
    	};
    	break;
    case 'textbox':
    	editor = {
    		xtype : 'mixkytextboxfield'
    	};
    	break;
    case 'organization':
    	editor = {
    		xtype : 'mixkyorganizationfield'
    	};
    	break;
    case 'designobject':
    	editor = {
        	xtype : 'mixkydesignobjectfield'
        };
    	break;
    case 'userselector':
    	editor = {
    		xtype : 'trigger',
    		editable : false,
			onTriggerClick : function(e){
    			var field = this;
    			var win = Mixky.lib.editor.getUserSelector(this.value, function(values){
    				var value = '';
    				for(var i=0;i<values.length;i++){
    					value = value + values[i].get("expression") + ';';
    				}
    				field.setValue(value);
    			},params);
    			win.show();
    		}
    	}
    	break;
	case 'readonly':
		editor = {
			xtype:'textfield',
			selectOnFocus:true,
			readOnly:true
		}
    	break;
	case 'string':
	default:
		editor = {
			xtype:'textfield',
			selectOnFocus:true,
			maxLength:200
		}
	}
	if(params){
		if(params.config){
			Ext.apply(editor, params.config);
		}
	}
	
	return editor;
}
// 获得编辑器对象
Mixky.lib.getEditorComponent = function(name, params){
	return Ext.ComponentMgr.create(Mixky.lib.getEditorConfig(name, params));
}
// 处理字段属性初始化
Mixky.lib.setFieldInitConfig = function(editortype, field, cfg){
	if(!Ext.isDefined(field) || !Ext.isDefined(cfg)){return;}
	switch(editortype){
	case 'select':
	case 'selectkeymap':
		field.getStore().removeAll();
		field.getStore().loadData(cfg.datas);
		if(field.el){
			field.setEditable(cfg.readOnly === false);
		}else{
			field.editable = (cfg.readOnly === false);
		}
		break;
	case 'textarea':
		if(Ext.isDefined(cfg.height)){
			field.setHeight(cfg.height);
		}else{
			field.setHeight(60);
		}
	case 'organization':
		if(Ext.isDefined(cfg.selectMulti)){
			field.selectMulti = cfg.selectMulti;
		}else{
			field.selectMulti = true;
		}
		if(Ext.isDefined(cfg.selectType)){
			field.selectType = cfg.selectType;
		}else{
			field.selectType = 'mix';
		}
		if(Ext.isDefined(cfg.valueField)){
			field.valueField = cfg.valueField;
		}else{
			field.valueField = 'expression';
		}
		if(cfg.displayField){
			field.displayField = cfg.displayField;
		}else{
			field.displayField = 'f_caption';
		}
		if(Ext.isDefined(cfg.valueSeparator)){
			field.valueSeparator = cfg.valueSeparator;
		}else{
			field.valueSeparator = '';
		}
		break;
	case 'designobject':
		if(Ext.isDefined(cfg.selectInParent)){
			field.selectInParent = cfg.selectInParent;
		}else{
			field.selectInParent = false;
		}
		if(Ext.isDefined(cfg.mclass)){
			field.mclass = cfg.mclass;
		}else{
			field.mclass = '';
		}
		if(Ext.isDefined(cfg.parentKey)){
			field.parentKey = cfg.parentKey;
		}else{
			field.parentKey = '';
		}
		break;
	default:
		break;
	}
}
// 服务器端渲染值
Mixky.lib.remoteRenderValue = function(type, value, fn, cfg){
	if(!value || value == ''){
		fn('', cfg);
	}
	switch(type){
	case 'renderUserExpression':
		if(Ext.isDefined(cfg) && cfg.valueSeparator && cfg.valueSeparator != ''){
			value = value.split(cfg.valueSeparator);
		}
		OrganizationDirect.getExpressionDisplay(value, function(result, e){
			fn(result.display, cfg);
		});
		break;
	case 'renderDesignObject':
		DesignToolDirect.loadObject(value.data, function(result, e){
			fn(result.object.f_caption + ' [' + result.object.key + ']', cfg);
		});
		break;
	}
}
// 服务器端渲染列表字段
Mixky.lib.remoteRenderStore = function(store){
	store.fields.each(function(field, index){
		if(Ext.isDefined(field.remoteRenderType)){
			for(var i=0;i<store.getCount();i++){
				var record = store.getAt(i);
				var v = record.get(field.name);
				if(Ext.isDefined(v) && v != ''){
					var cfg = {record : record};
		        	if(field.remoteRenderType == 'renderUserExpression'){
		        		cfg.valueSeparator = field.valueSeparator;
		        	}
					Mixky.lib.remoteRenderValue(field.remoteRenderType, v, function(result, cfg){
						cfg.record.set(field.name + '_display', result);
						cfg.record.commit();
					}, cfg)
				}
			}
		}
	})
}

// 获得域选择编辑窗口
Mixky.lib.getFieldSelectorWindow = function(winCfg, selApi){
	Ext.applyIf(selApi,{
		getInitValue : Ext.emptyFn,
		setValue : Ext.emptyFn,
		getValue : Ext.emptyFn,
		onSelectedFn : Ext.emptyFn
	});
	Ext.applyIf(winCfg, {
        modal: true,
        width: 500,
        height:300,
        minWidth: 300,
        minHeight: 200,
        layout: 'fit',
        plain:true,
        buttonAlign:'center',
        buttons: [{
            text: '确定',
            handler: function() {
        		var win = this.findParentByType('window');
        		if(selApi.onSelectedFn(selApi.getValue()) !== false){
	        		if(win.closeAction == 'hide'){
	        			win.hide();
	        		}else{
	        			win.close();
	        		}
        		}
        	}
        },{
            text: '取消',
            handler: function() {
        		var win = this.findParentByType('window');
        		if(win.closeAction == 'hide'){
        			win.hide();
        		}else{
        			win.close();
        		}
        	}
        }],
        listeners: {
    		'beforeshow' : function(win) {
				selApi.setValue(selApi.getInitValue());
    		}
    	}
    });
    var win = new Ext.Window(winCfg);
    return win;
}

Mixky.lib.getObjectFormatString = function(name, value, level){
	var result = '';
	var type = typeof value;
	if(value instanceof Array){
		type = 'array';
	}
	var preTab = '';
	for(var i=0;i<level;i++){
		preTab = preTab + '\t';
	}
	result = preTab;
	if(name){
		result = result + name + ' : ';
	}
	switch(type){
	case 'boolean':
	case 'number':
		result = result + value + ',\n';
		break;
	case 'string':
		result = result + Ext.encode(value) + ',\n';
		break;
	case 'object':
		result = result + '{\n';
		var hasNode = false;
		for(n in value){
    		if(value.hasOwnProperty(n)){
    			hasNode = true;
    			result = result + Mixky.lib.getObjectFormatString(n, value[n], level + 1);
    		}
		}
		if(level > 0 && hasNode){
			result = result.substring(0,result.length -2) + '\n';
		}
		result = result + preTab + '},\n';
		break;
	case 'array':
		result = result + '[\n';
		var hasNode = false;
		for(n in value){
    		if(value.hasOwnProperty(n)){
    			hasNode = true;
    			result = result + Mixky.lib.getObjectFormatString(false, value[n], level + 1);
    		}
		}
		if(level > 0 && hasNode){
			result = result.substring(0,result.length -2) + '\n';
		}
		result = result + preTab + '],\n';
		break;
	case 'function':
		result = result + '(' + value.toString().replace(new RegExp("\n","gm"), preTab + '\n') + '),\n';
		break;
	case 'undefined':
		result = result + value + ',\n';
		break;
	}
	if(level == 0){
		return result.substring(0,result.length -2);
	}else{
		return result;
	}
}

Mixky.lib.getNewTableRecordId = function(tablename, fn, params){
	MixkyLibDirect.getNewTableRecordId(tablename, function(result, e){
		if(result && result.success){
			fn(result.id, params);
		}
	});
}

Mixky.lib.showOrganizationWindow = function(config, fn){
	var selApi = {onSelectedFn : fn};
}

Ext.layout.TableLayout.prototype.getNextCell = function(c){
    var cell = this.getNextNonSpan(this.currentColumn, this.currentRow);
    var curCol = this.currentColumn = cell[0], curRow = this.currentRow = cell[1];
    for(var rowIndex = curRow; rowIndex < curRow + (c.rowspan || 1); rowIndex++){
        if(!this.cells[rowIndex]){
            this.cells[rowIndex] = [];
        }
        for(var colIndex = curCol; colIndex < curCol + (c.colspan || 1); colIndex++){
            this.cells[rowIndex][colIndex] = true;
        }
    }
    var td = document.createElement('td');
    if(c.cellId){
        td.id = c.cellId;
    }
    var cls = 'x-table-layout-cell';
    if(c.cellCls){
        cls += ' ' + c.cellCls;
    }
    td.className = cls;
    if(c.colspan){
        td.colSpan = c.colspan;
    }
    if(c.rowspan){
        td.rowSpan = c.rowspan;
    }
    // extend by zhangchang begin
    if(c.cellWidth){
        td.width = c.cellWidth;
    }
    // extend by zhangchang end
    this.getRow(curRow).appendChild(td);
    return td;
}

String.prototype.replaceAll  = function(s1,s2){   
	return this.replace(new RegExp(s1,"gm"),s2);   
}

// 删除数组元素
Array.prototype.removeAt = function (index) {
	if(isNaN(index)||index>=this.length){return false;}
    for(var i=index;i<this.length-1;i++){
        this[i]=this[i+1];
    }
    this.length -= 1;
};