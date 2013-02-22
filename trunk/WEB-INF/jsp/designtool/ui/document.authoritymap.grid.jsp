<%@ page contentType="text/html; charset=utf-8"%>
<%
	String id = request.getParameter("id");
	String key = request.getParameter("key");
	String type = request.getParameter("type");
%>
<script language='javascript'>
Ext.onReady(function(){
	var id = '<%=id%>';
	var key = '<%=key%>';

	// 获得对象的属性列表
	var panel = Ext.getCmp(id);
	
	// 数据访问
	var store = new Ext.data.DirectStore({
		directFn : DesignToolDirect.getDocumentAuthorityTarget,
		paramOrder:['key'],
		baseParams : {
			key : key
		},
		root : 'results',
		totalProperty : 'totals',
		idProperty : 'key',
		sortInfo: {field:'f_order', direction: 'ASC'},
		fields:[
			{name:'f_order', mapping:'f_order'},
			{name:'key', mapping:'key'},
			{name:'parent', mapping:'parent'},
			{name:'f_class', mapping:'f_class'},
			{name:'f_name', mapping:'f_name'},
			{name:'f_caption', mapping:'f_caption'},
			{name:'f_hidden', mapping:'f_hidden'},
			{name:'f_display', mapping:'f_display'},
			{name:'f_edit', mapping:'f_edit'},
			{name:'f_expand', mapping:'f_expand'}
		]
	});
	store.on('load', function(){
		if(panel.editing){
			panel.loadEditObject(true);
		}
	});
	var filterCombo = new Ext.form.ComboBox({
		name : 'f_state',
    	width : 120,
		triggerAction : 'all',
    	editable : false,
    	forceSelection : true,
    	hideLabel : true,
	    valueField : 'key',
	    displayField : 'f_caption',
	    value : 'all',
	    store : new Ext.data.DirectStore({
    		directFn : DesignToolDirect.getDocumentAuthorityPanel,
    		paramOrder:['key'],
    		baseParams : {
    			key : key
    		},
    		root : 'results',
    		totalProperty : 'totals',
    		idProperty : 'key',
    		fields:['key', 'f_caption']
    	})
	});
	filterCombo.on('select', function(c, record, index){
		if(record.get('key') == 'all'){
			store.clearFilter();
		}else{
			//store.filter('parent', record.get('key'));
			
			store.filterBy(function(r, id){
				return r.get('parent') == record.get('key');
			});
		}
	});
	var columnHidden = new Ext.grid.CheckColumn({
		id : 'f_hidden',
		dataIndex : 'f_hidden',
		fixed:true,
		header : '输出',
		width : 35
	});
	var columnDisplay = new Ext.grid.CheckColumn({
		id : 'f_display',
		dataIndex : 'f_display',
		fixed:true,
		header : '显示',
		width : 35
	});
	var columnEdit = new Ext.grid.CheckColumn({
		id : 'f_edit',
		dataIndex : 'f_edit',
		fixed:true,
		header : '编辑',
		width : 35
	});
	var columnExpand = new Ext.grid.CheckColumn({
		id : 'f_expand',
		dataIndex : 'f_expand',
		fixed:true,
		header : '扩展',
		width : 35
	});
	var columns = [new Ext.grid.RowNumberer(),{
		id : 'f_class',
		dataIndex : 'f_class',
		editable:false,
		width:70,
		header : '类型',
		renderer : function(value, p, record){
			var type = record.get("f_class");
			return String.format("<div style='height:16px;padding-left:23px;background:transparent url(icon/{0}.gif) no-repeat'> {1}</div>", type, value);
		}
	},{
		id : 'f_caption',
		dataIndex : 'f_caption',
		editable:false,
		width:100,
		header : '名称'
	},columnHidden,columnDisplay,columnEdit,columnExpand,{
		id : 'key',
		dataIndex : 'key',
		editable:false,
		header : 'Key'
	}]

    var refreshAction = new Ext.Action({
    	disabled : false,
    	text : '刷新',
    	iconCls : 'icon-designtool-refresh',
    	handler : function(){
			store.reload();
			filterCombo.getStore().reload();
    	}
    });
    
    var applyAction = new Ext.Action({
    	disabled : true,
    	text : '更新',
    	iconCls : 'icon-designtool-apply',
    	handler : function(){
    		store.clearFilter(true);
			var modifieds = store.getModifiedRecords();
			if(panel.editing && modifieds.length > 0){
				var fieldmap = {};
				for(var i=0;i<store.getCount();i++){
					var record = store.getAt(i);
					var value = '';
					value = value + (record.get("f_hidden") ? '1' :'0');
					value = value + (record.get("f_display") ? '1' :'0');
					value = value + (record.get("f_edit") ? '1' : '0');
					value = value + (record.get("f_expand") ? '1' : '0');
					if(value != '0000'){
						fieldmap[record.get('key')] = value;
					}
				}
				panel.editNode.attributes.f_authorities = fieldmap;
				store.commitChanges();
			}
			if(filterCombo.getValue() != 'all'){
				store.filter('parent', filterCombo.getValue());
			}
    	}
    });
    var autoApply = new Ext.form.Checkbox({
    	checked : true,
    	hideLabel : true
    });
    autoApply.on('check', function(f, checked){
    	if(checked){
    		applyAction.disable();
    	}else{
    		applyAction.enable();
    	}
    });

	var grid = new Ext.grid.EditorGridPanel({
		title : '表单字段映射',
		border : false,
		columns : columns,
		autoExpandColumn : 'key',
		enableHdMenu : false,
		enableColumnMove : false,
	    clicksToEdit : 1,
	    disabled : true,
	    plugins : [columnHidden,columnDisplay,columnEdit,columnExpand],
		bbar : [refreshAction,'-','筛选：',filterCombo,'->',autoApply,applyAction],
		store : store
	});

	panel.loadObject = function(object){
		if(Ext.isDefined(object) && typeof object == 'object'){
			for(n in object){
        		if(object.hasOwnProperty(n)){
            		var v = object[n];
            		if(v.length >= 4){
	            		var r = grid.getStore().getById(n);
	            		if(Ext.isDefined(r)){
		            		r.data['f_hidden'] = v.substr(0,1) == '1';
		            		r.data['f_display'] = v.substr(1,1) == '1';
		            		r.data['f_edit'] = v.substr(2,1) == '1';
		            		r.data['f_expand'] = v.substr(3,1) == '1';
		            		r.afterEdit();
	            		}
            		}
            	}
			}
		}
		grid.getStore().commitChanges();
	}

	panel.loadEditObject = function(localLoad){
		if(Ext.isDefined(panel.editObject)){
			panel.loadObject(panel.editObject);
		}else{
			if(!localLoad){
				DesignToolDirect.loadObject(panel.editKey, function(result, e){
					if(result.success){
						panel.editObject = result.object.f_authorities;
						panel.loadObject(panel.editObject);
						return;
					}
				});
			}
		}
	}

	panel.startEditObject = function(key, node){
		if(panel.editing && autoApply.getValue()){
			panel.stopEditObject();
		}
		panel.editNode = node;
		panel.editObject = node.attributes.f_authorities;
		panel.editKey = key;
		grid.setTitle('目标权限映射 ' + '[' + key + ']');
		grid.getStore().each(function(r){
			r.data['f_hidden'] = false;
			r.data['f_display'] = false;
			r.data['f_edit'] = false;
			r.data['f_expand'] = false;
    		r.afterEdit();
		});
		panel.loadEditObject();
		grid.enable();
		panel.editing = true;
	}

	panel.stopEditObject = function(){
		if(!panel.editing){
			return;
		}
		if(autoApply.getValue()){
			applyAction.execute();
		}
		panel.editNode = undefined;
		panel.editObject = undefined;
		panel.editKey = undefined;
		grid.disable();
		panel.editing = false;
	}
	
	panel.refresh = function(){
		grid.getStore().reload();
	}
	panel.add(grid);
	panel.doLayout();
	panel.refresh();
});
</script>