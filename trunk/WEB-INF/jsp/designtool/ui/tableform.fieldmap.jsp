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
	var type = '<%=type%>';

	// 获得对象的属性列表
	var module = Mixky.designtool.Class.getModule(type);
	var panel = Ext.getCmp(id);

	// 数据访问
	var store = new Ext.data.DirectStore({
		directFn : DesignToolDirect.getSubObjectList,
		paramOrder:['key', 'mclass'],
		baseParams : {
			key : key,
			mclass : 'field'
		},
		root : 'results',
		totalProperty : 'totals',
		idProperty : 'f_key',
		sortInfo: {field:'f_order', direction: 'ASC'},
		fields:[
			{name:'f_order', mapping:'f_order'},
			{name:'key', mapping:'key'},
			{name:'f_key', mapping:'f_key'},
			{name:'f_name', mapping:'f_name'},
			{name:'f_colspan', mapping:'f_colspan'},
			{name:'f_rowspan', mapping:'f_rowspan'},
			{name:'f_caption', mapping:'f_caption'},
			{name:'f_hidden', mapping:'f_hidden'},
			{name:'f_display', mapping:'f_display'},
			{name:'f_edit', mapping:'f_edit'},
			{name:'f_expand', mapping:'f_expand'}
		]
	});
	store.on('load', function(){
		if(panel.editing){
			panel.loadEditRecord();
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
		id : 'f_name',
		dataIndex : 'f_name',
		editable:false,
		header : '字段名'
	},{
		id : 'f_colspan',
		dataIndex : 'f_colspan',
		header : '列数',
		width : 40,
		editor : new Ext.form.NumberField()
	},{
		id : 'f_rowspan',
		dataIndex : 'f_rowspan',
		header : '行数',
		width : 40,
		editor : new Ext.form.NumberField()
	},columnHidden,columnDisplay,columnEdit,columnExpand]

    var refreshAction = new Ext.Action({
    	disabled : false,
    	text : '刷新',
    	iconCls : 'icon-designtool-refresh',
    	handler : function(){
			store.reload();
    	}
    });
    
    var applyAction = new Ext.Action({
    	disabled : true,
    	text : '更新',
    	iconCls : 'icon-designtool-apply',
    	handler : function(){
			var modifieds = store.getModifiedRecords();
			if(panel.editing && modifieds.length > 0){
				var fieldmap = {};
				for(var i=0;i<store.getCount();i++){
					var record = store.getAt(i);
					var mode = '';
					var value = {};
					mode = mode + (record.get("f_hidden") ? '1' :'0');
					mode = mode + (record.get("f_display") ? '1' :'0');
					mode = mode + (record.get("f_edit") ? '1' : '0');
					mode = mode + (record.get("f_expand") ? '1' : '0');
					value.mode = mode
					if(record.get("f_rowspan") != ''){
						value.rowspan = record.get("f_rowspan");
					}
					if(record.get("f_colspan") != ''){
						value.colspan = record.get("f_colspan");
					}
					fieldmap[record.get('f_key')] = value;
				}
				panel.editRecord.set('f_fieldmap', fieldmap);
				store.commitChanges();
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
		autoExpandColumn : 'f_name',
		enableHdMenu : false,
		enableColumnMove : false,
	    clicksToEdit : 1,
	    disabled : true,
	    plugins : [columnHidden,columnDisplay,columnEdit,columnExpand],
		bbar : [refreshAction,'->',autoApply,applyAction],
		store : store
	});

	panel.loadEditRecord = function(){
		var fieldmap = panel.editRecord.get('f_fieldmap');
		if(Ext.isDefined(fieldmap) && typeof fieldmap == 'object'){
			for(n in fieldmap){
        		if(fieldmap.hasOwnProperty(n)){
            		var v = fieldmap[n];
            		if(typeof v == 'object'){
	            		var r = grid.getStore().getById(n);
	            		if(Ext.isDefined(r)){
	            			r.data['f_rowspan'] = v.rowspan;
	            			r.data['f_colspan'] = v.colspan;
		            		r.data['f_hidden'] = v.mode.substr(0,1) == '1';
		            		r.data['f_display'] = v.mode.substr(1,1) == '1';
		            		r.data['f_edit'] = v.mode.substr(2,1) == '1';
		            		r.data['f_expand'] = v.mode.substr(3,1) == '1';
		            		r.afterEdit();
	            		}
            		}
            	}
			}
		}
		grid.getStore().commitChanges();
	}

	panel.startEditRecord = function(record){
		panel.editRecord = record;
		grid.setTitle('表单字段映射' + '[' + record.get('f_key') + ']');
		grid.getStore().each(function(r){
			r.data['f_rowspan'] = '';
			r.data['f_colspan'] = '';
    		r.data['f_hidden'] = false;
    		r.data['f_display'] = false;
    		r.data['f_edit'] = false;
    		r.data['f_expand'] = false;
    		r.afterEdit();
		});
		panel.loadEditRecord();
		grid.enable();
		panel.editing = true;
	}

	panel.stopEditRecord = function(record){
		if(!panel.editing){
			return;
		}
		if(autoApply.getValue()){
			applyAction.execute();
		}
		panel.editRecord = undefined;
		grid.disable();
		panel.editing = false;
	}
	
	panel.refresh = function(){
		grid.getStore().reload();
	}
	panel.add(grid);
	panel.setWidth(280);
	panel.ownerCt.doLayout();
	panel.refresh();
});
</script>