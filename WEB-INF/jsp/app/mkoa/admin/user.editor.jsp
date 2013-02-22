<%@ page contentType="text/html; charset=utf-8"%>
<%
	String panelid = request.getParameter("panelid");
%>
<script language='javascript'>
Ext.onReady(function(){
	var panelid = '<%=panelid%>';
	var panel = Ext.getCmp(panelid);

	var textField = new Ext.grid.GridEditor(new Ext.form.TextField({maxLength:100}));
	var textareaField = new Ext.grid.GridEditor(new Ext.form.TextArea({selectOnFocus:true, maxLength:200}));
	var displayField = new Ext.grid.GridEditor(new Ext.form.TextField({readOnly:true,selectOnFocus:true}));
	var stateField = new Ext.grid.GridEditor(new Ext.form.ComboBox({
	    typeAhead: true,
	    triggerAction: 'all',
	    mode: 'local',
	    store: new Ext.data.ArrayStore({
	        fields: ['value', 'name'],
	        data: [[0, '正常'], [1, '已离职']]
	    }),
	    valueField: 'value',
	    displayField: 'name'
		
	}));
	var deptField = new Ext.form.ComboBox({
	    typeAhead: true,
	    triggerAction: 'all',
	    mode: 'local',
	    store: new Ext.data.JsonStore({
	    	idProperty : 'id',
	        fields: ['id', 'caption']
	    }),
	    valueField: 'caption',
	    displayField: 'caption',
	    listeners : {
			'selected' : function(combo, record, index){
				panel.editRecord.set('f_dept_id', record.get('id'));
			}
	    }
	});
	var gDeptField = new Ext.grid.GridEditor(deptField);

	// ['f00id', 'f01rowstate', 'f02f_order', 'f03f_type', 'f04f_state', 'f05f_name', 'f06f_caption', 'f07f_dept_name', 'f08f_dept_id', 'f09f_email', 'f10f_cellphone', 'f11f_note', 'f12f_sign', 'f13f_depts','f14f_roles']
	var grid = new Ext.grid.PropertyGrid({
		border : false,
		customEditors : {
			"f00id" : displayField,
			"f04f_state" : stateField,
	        "f05f_name": new Ext.grid.GridEditor(new Ext.form.TextField({maxLength:20})),
	        "f06f_caption": new Ext.grid.GridEditor(new Ext.form.TextField({maxLength:20})),
			"f07f_dept_name" : gDeptField,
			"f09f_email" : new Ext.grid.GridEditor(new Ext.form.TextField({maxLength:100})),
			"f10f_cellphone" : new Ext.grid.GridEditor(new Ext.form.TextField({maxLength:15})),
			"f11f_note" : textareaField,
	        "f12f_sign" : displayField,
	        "f13f_depts" : displayField,
	        "f14f_roles" : displayField
		},
		customRenderers : {
			"f04f_state" : function(v){
				switch(v){
				case 0: return '正常';
				case 1: return '已离职';
				default : return v;
				}
			},
			"f12f_sign" : function(v){
				if(v && v != ''){
					return String.format('<IMG src="{0}" height=30 width=70>', v);
				}
			}
		},
		propertyNames : {
	        "f00id": '<B>ID</B>（<FONT color=red>只读</FONT>）',
        	"f04f_state" : '状态',
	        "f05f_name": '登录名',
	        "f06f_caption": '姓名',
			"f07f_dept_name" : '默认部门',
			"f09f_email" : '邮件地址',
			"f10f_cellphone" : '手机号',
	        "f11f_note": '说明',
	        "f12f_sign" : '<B>签名</B>（<FONT color=red>只读</FONT>）',
	        "f13f_depts" : '<B>所属部门</B>（<FONT color=red>只读</FONT>）',
	        "f14f_roles" : '<B>用户角色</B>（<FONT color=red>只读</FONT>）'
		}
	});
	grid.on('propertychange', function(source, id, v, oldValue){
		var index = grid.getStore().find('name', id);
		if(index >=0){
			var name = id.substring(3);
			panel.editRecord.set(name, v);
		}
	});
	grid.getColumnModel().setColumnWidth(0, 30);
	
	panel.startEditRecord = function(record){
		panel.editRecord = record;
		var data = {};
		var fields = record.fields;
		deptField.getStore().loadData(record.get('f_depts'));
		for(var i=0;i<fields.getCount();i++){
			var field = fields.get(i);
			var key = 'f';
			if(i>9){
				key = key + i + field.name;
			}else{
				key = key + '0' + i + field.name;
			}
			if(Ext.isDefined(grid.propertyNames[key])){
				if(typeof(record.get(field.name)) == 'object'){
					var value = '';
					if(record.get(field.name) != null){
						for(var j=0;j<record.get(field.name).length;j++){
							value = value + record.get(field.name)[j].caption + ';';
						}
					}
					data[key] = value;
				}else{
					data[key] = record.get(field.name);
				}
			}
		}
		grid.setSource(data);
		panel.enable();
		panel.editing = true;
	}

	panel.stopEditRecord = function(record, disable){
		if(!panel.editing){
			return;
		}
		grid.stopEditing();
		if(disable){
			panel.editRecord = undefined;
			panel.disable();
			panel.editing = false;
		}
	}
	
	panel.add(grid);
	panel.doLayout();
});
</script>