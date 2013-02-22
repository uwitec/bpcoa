Ext.namespace('Ext.mixky');

Ext.mixky.PropertyRecord = Ext.data.Record.create([
    'name', 'value', 'display', 'caption', 'group', 'editor', 'editorParams', 'note', 'order'
]);

Ext.mixky.PropertyStore = function(grid){
    this.grid = grid;
    this.store = new Ext.data.GroupingStore({
        recordType : Ext.mixky.PropertyRecord,
        sortInfo:{field: 'order', direction: "ASC"},
        groupField:'group'
    });
    this.store.on('update', this.onUpdate,  this);
    Ext.mixky.PropertyStore.superclass.constructor.call(this);
};
Ext.extend(Ext.mixky.PropertyStore, Ext.util.Observable, {
    // protected - should only be called by the grid.  Use grid.setSource instead.
    setPropertyConfig : function(o){
        this.store.removeAll();
        if(!o || o.length == 0){
        	return;
        }
        var data = [];
        for(var i=0;i<o.length;i++){
            data.push(new Ext.mixky.PropertyRecord({name: o[i][0], value: o[i][1], display:o[i][1], caption: o[i][2], group:o[i][3], editor: o[i][4], editorParams: o[i][5], note: o[i][6], order:i}, o[i][0]));
        }
        this.store.loadRecords({records: data}, {}, true);
    },

    // private
    onUpdate : function(ds, record, type){
        if(type == Ext.data.Record.EDIT){
            var v = record.data['value'];
            var oldValue = record.modified['value'];
            if(this.grid.fireEvent('beforepropertychange', this.store, record.id, v, oldValue) !== false){
                this.grid.fireEvent('propertychange', this.store, record.id, v, oldValue);
            }else{
                record.reject();
            }
        }
    },

    // private
    getProperty : function(row){
       return this.store.getAt(row);
    },

    // private
    isEditableValue: function(val){
        if(Ext.isDate(val)){
            return true;
        }else if(typeof val == 'object' || typeof val == 'function'){
            return false;
        }
        return true;
    },

    // private
    setValue : function(prop, value){
    	var record = this.store.getById(prop);
    	if(!record){
    		return;
    	}
    	var display;
    	if(typeof value == 'object' && value != null){
    		display = Ext.encode(value);
    	}else{
    		display = (value == null ? '' : value);
    	}
        record.set('value', value);
    	record.set('display', display);
        if(value != '' && Ext.isDefined(record.get("editorParams")) && Ext.isDefined(record.get("editorParams").remoteRenderType)){
        	var cfg;
        	if(record.get("editorParams").remoteRenderType == 'renderUserExpression'){
        		cfg = {valueSeparator:record.get("editorParams").valueSeparator};
        	}
    		Mixky.lib.remoteRenderValue(record.get("editorParams").remoteRenderType, value, function(result){
    			record.set('display', result);
    			record.commit();
    		}, cfg);
        }
		record.commit();
    },
    
    clearValues : function(){
    	for(var i = 0;i<this.store.getTotalCount();i++){
    		this.store.getAt(i).set('value', '');
    		this.store.getAt(i).set('display', '');
    	}
    },
    
    loadObjectData : function(object){
		if(!object){
			return;
		}
    	this.clearValues();
		for(n in object){
			this.setValue(n, object[n]);
		}
		this.store.commitChanges();
    },
    
    loadRecordData : function(record){
		if(!record){
			return;
		}
    	this.clearValues();
    	for(var i=0;i<this.store.getCount();i++){
    		var propRecord = this.store.getAt(i);
    		this.setValue(propRecord.get('name'), record.get(propRecord.get('name')));
    	}
		this.store.commitChanges();
    }
});

Ext.mixky.PropertyColumnModel = function(grid, store){
    this.grid = grid;
    var g = Ext.grid;
    g.PropertyColumnModel.superclass.constructor.call(this, [
        {header: this.nameText, width:grid.captionWidth, dataIndex:'caption', id: 'caption', menuDisabled:true},
        {header: this.valueText, dataIndex: 'display', id: 'display', menuDisabled:true},
	    {header: this.groupText, hidden:true, width:0, dataIndex:'group', id: 'group', menuDisabled:true}
    ]);
    this.store = store;
    this.renderCellDelegate = this.renderCell.createDelegate(this);
    this.renderPropDelegate = this.renderProp.createDelegate(this);
    this.editors = {};
};

Ext.extend(Ext.mixky.PropertyColumnModel, Ext.grid.ColumnModel, {
    // private - strings used for locale support
    nameText : '名称',
    valueText : '值',
    groupText : '分组',
    dateFormat : 'Y-m-d',

    // private
    isCellEditable : function(colIndex, rowIndex){
        var p = this.store.getProperty(rowIndex);
    	if(p.data['editor'] == 'none'){
    		return false;
    	}
        return colIndex == 1;
    },

    // private
    renderDate : function(dateVal){
        return dateVal.dateFormat(this.dateFormat);
    },

    // private
    renderBool : function(bVal){
        return bVal ? 'true' : 'false';
    },

    // private
    renderObject : function(bVal){
        return Ext.encode(bVal);
    },

    // private
    renderSelectkeymap : function(bVal, datas){
    	for(var i=0;i<datas.length;i++){
    		if(bVal == datas[i][0]){
    			return datas[i][1];
    		}
    	}
    	return bVal;
    },

    // private
    getRenderer : function(col){
    	if(col == 2){
    		return Ext.emptyFn;
    	}
        return col == 1 ?
            this.renderCellDelegate : this.renderPropDelegate;
    },
    // private
    renderProp : function(v){
        return this.getPropertyName(v);
    },
    // private
    renderCell : function(val, p, r, rowIndex, i, ds){
        var rv = val;
    	switch(r.get('editor')){
    	case 'selectkeymap':
    		rv = this.renderSelectkeymap(val, r.get('editorParams').datas);
    		break;
    	default:
	        if(Ext.isDate(val)){
	            rv = this.renderDate(val);
	        }else if(typeof val == 'boolean'){
	            rv = this.renderBool(val);
	        }else if(Ext.isObject(val)){
	        	rv = this.renderObject(val);
	        }
	        break;
    	}
        return Ext.util.Format.htmlEncode(rv);
    },

    // private
    getPropertyName : function(name){
        var pn = this.grid.propertyNames;
        return pn && pn[name] ? pn[name] : name;
    },
    createCellEditor : function(editorName){
    	var editor;
    	switch(editorName){
    	case 'readonly' : 
    	case 'string' : 
    	case 'boolean' : 
    	case 'number' : 
    	case 'date' : 
    	case 'datetime' : 
    	case 'textarea' : 
    	case 'textbox' : 
    	case 'designobject' : 
    	case 'jsonobject' : 
    		editor = new Ext.grid.GridEditor(Mixky.lib.getEditorComponent(editorName));
    		break;
    	case 'organization' :
    		editor = new Ext.grid.GridEditor(Mixky.lib.getEditorComponent('organization'));
    		break;
    	case 'select' :
    		editor = new Ext.grid.GridEditor(Mixky.lib.getEditorComponent('select',{datas:['key']}));
    		break;
    	case 'selectkeymap' :
    		editor = new Ext.grid.GridEditor(Mixky.lib.getEditorComponent('selectkeymap',{datas:['key','value']}));
    		break;
    	}
    	this.editors[editorName] = editor;
    	return editor;
    },
    // private
    getCellEditor : function(colIndex, rowIndex){
        var p = this.store.getProperty(rowIndex);
        var n = p.data['name'], val = p.data['value'];
        var editor;
        // 获得编辑器
        if(this.grid.customEditors[n]){
        	editor = this.grid.customEditors[n];
        }else{
	        switch(p.data['editor']){
	    	case 'check':
	    	case 'radio':
	    		var field = Mixky.lib.getEditorComponent(p.data['editor'], p.data['editorParams']);
	    		editor = new Ext.grid.GridEditor(field);
	    		this.grid.customEditors[n] = editor;
	    		break;
	        case 'extend':
	        	var field = Mixky.lib.getEditorComponent(p.data['editorParams'].xeditortype, p.data['editorParams']);
	    		editor = new Ext.grid.GridEditor(field);
	    		this.grid.customEditors[n] = editor;
	        	break;
	        case 'custom':
	        	var field = Ext.ComponentMgr.create(p.data['editorParams'].editor);
	    		editor = new Ext.grid.GridEditor(field);
	    		this.grid.customEditors[n] = editor;
	        	break;
	        default:
	        	if(Ext.isDefined(this.editors[p.data['editor']])){
	        		editor = this.editors[p.data['editor']];
	        	}else{
	        		editor = this.createCellEditor(p.data['editor']);
	        	}
	        	break;
	        }
        }
        // 处理初始参数
        Mixky.lib.setFieldInitConfig(p.data['editor'], editor.field, p.data['editorParams']);
        return editor;
    },
    destroy : function(){
    	this.grid.stopEditing(true);
        Ext.mixky.PropertyColumnModel.superclass.destroy.call(this);
    }
});

Ext.mixky.PropertyGrid = Ext.extend(Ext.grid.EditorGridPanel, {

    // private config overrides
    enableColumnMove : false,
    enableColumnResize : false,
    stripeRows : false,
    trackMouseOver : false,
    clicksToEdit : 1,
    enableHdMenu : false,
    autoExpandColumn : 'display',
	lineBreak : true,
    captionWidth : 150,
    /**
     * 增加分组显示后有问题
    view: new Ext.grid.GroupingView({
        groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? "Items" : "Item"]})'
    }),
    */
    columnLines: false,
    showPropertyNote:Ext.emptyFn,
    // private
    initComponent : function(){
		this.customEditors = this.customEditors || {};
        this.lastEditRow = null;
        var store = new Ext.mixky.PropertyStore(this);
        this.propStore = store;
        var cm = new Ext.mixky.PropertyColumnModel(this, store);
        this.addEvents(
            'beforepropertychange',
            'propertychange',
            'showpropertynote'
        );
        this.cm = cm;
        this.ds = store.store;
        Ext.mixky.PropertyGrid.superclass.initComponent.call(this);

        this.selModel.on('beforecellselect', function(sm, rowIndex, colIndex){
            var record = this.store.getAt(rowIndex);
            this.showPropertyNote(record);
            if(colIndex === 0){
                this.startEditing.defer(200, this, [rowIndex, 1]);
                return false;
            }
        }, this);
        this.on('beforeedit', function(e){
        	this.onBeforeEdit(e);
        });
        this.on('validateedit', function(e){
        	this.onValidateEdit(e);
        });
        this.on('afteredit', function(e){
        	this.onAfterEdit(e);
        });
    },

    // private
    onRender : function(){
        Ext.mixky.PropertyGrid.superclass.onRender.apply(this, arguments);
        
        this.getGridEl().addClass('x-props-grid');
    },
    // private
    setPropertyConfig : function(o){
        this.propStore.setPropertyConfig(o);
    },
    // private
    afterRender: function(){
        Ext.mixky.PropertyGrid.superclass.afterRender.apply(this, arguments);
        if(this.properties){
            this.setPropertyConfig(this.properties);
        }
    },
    onBeforeEdit : function(e){
		var field = this.getColumnModel().getCellEditor(e.column,e.row).field;
    	switch(e.record.get('editor')){
    	case 'jsonobject':
    		field.realValue = e.record.get('value');
			break;
    	default:
			break;
    	}
    	return true;
    },
    onValidateEdit : function(e){
		var field = this.getColumnModel().getCellEditor(e.column,e.row).field;
		var display = '';
		var value = '';
    	switch(e.record.data['editor']){
    	case 'date':
    	case 'datetime':
    		display = field.getRawValue();
    		value = field.getRawValue();
    		break;
    	case 'textbox':
    		value = field.realValue;
    		display = field.realValue;
    		break;
    	case 'jsonobject':
    		value = field.realValue;
    		display = field.value;
    		break;
    	case 'organization':
    	case 'designobject':
    		value = field.realValue;
    		display = e.value;
    		break;
    	case 'check':
    		if(e.value){
	    		for(var i=0;i<e.value.length;i++){
	    			display = display + e.value[i].boxLabel + ';';
	    			value = value + e.value[i].inputValue + ';';
	    		}
    		}
    		break;
    	case 'radio':
    		if(e.value){
	    		for(var i=0;i<e.value.length;i++){
    				display = e.value[i].boxLabel;
    				value = e.value[i].inputValue;
    				break;
	    		}
    		}
        	break;
    	default:
    		display = e.value;
    		value = e.value;
			break;
    	}
    	e.value = display;
    	e.realValue = value;
    	return true;
    },
    // 处理值设置
    onAfterEdit : function(e){
		e.record.set('value', e.realValue);
    },
    getView : function(){
        if(!this.view){
            this.view = new Ext.grid.GridView(this.viewConfig);
        }
        this.view.getRowStyle = function(rowIndex, record){
        	if(Ext.isDefined(record.get("editorParams")) && Ext.isDefined(record.get("editorParams").xstyle)){
        		return record.get("editorParams").xstyle;
        	}
        }
        return this.view;
    }
});
Ext.reg("mixkypropertygrid", Ext.mixky.PropertyGrid);
