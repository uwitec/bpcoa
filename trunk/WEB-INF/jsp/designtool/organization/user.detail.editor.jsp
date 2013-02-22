<%@ page contentType="text/html; charset=utf-8"%>
<%
	String id = request.getParameter("id");
%>
<script language='javascript'>
Ext.onReady(function(){
	var id = '<%=id%>';
	
	var panel = Ext.getCmp(id);
	// 获得对象的属性列表
	var module = Mixky.designtool.Class.getModule('user');
	var mstore = [];
	if(module.properties){
		for(var i=0;i<module.properties.length;i++){
			var p = module.properties[i];
			if(Ext.isDefined(p.xeditor)){
				mstore.push([p.name, '', p.text, '', p.xeditor, p.xconfig, p.note]);
			}
		}
	}
	// 属性编辑窗口
	var pgrid = new Ext.mixky.PropertyGrid({
		region : 'center',
		xtype : 'mixkypropertygrid',
		captionWidth : 100,
		properties : mstore,
		showPropertyNote : function(record){
			var readonly = '';
			if(record.get("editor") == 'readonly' || record.get("editor") == 'none' ){
				readonly = '，<font color=red>只读</font>';
			}
			npanel.body.update('<B>'+record.get("caption")+' ('+record.get("name")+')</B>' + readonly + '<BR><BR>'+record.get("note"));
		}
	});
	// 信息提示窗口
	var npanel = new Ext.Panel({
		region : 'south',
		split : true,
		collapsible : true,
        collapseMode:'mini',
        collapsed:true,
		height : 80,
		bodyStyle:'background-color:lightyellow;padding:8px;font-size:12px'
	});

	var deptgrid = new Ext.grid.GridPanel({
		title : '用户所属部门',
		region : 'center',
		border : true,
		autoExpandColumn:'f_name',
		hideHeaders : true,
		enableColumnMove:false,
		columns : [{
			id:'f_name',
			dataIndex:'f_name',
			header : '部门名称'
		},{
			id:'isdefault',
			dataIndex:'isdefault',
			header : '默认部门'
		}],
		store : new Ext.data.DirectStore({
			directFn : OrganizationDirect.getUserDeptManageList,
			paramOrder:['userId'],
			baseParams:{userId:''},
			root : 'results',
			totalProperty : 'totals',
			idProperty : 'id',
			fields : ['id', 'f_name', 'f_caption', 'isdefault'],
			listeners:{'beforeload': function(){
				this.baseParams.userId = panel.editRecord.get('id').toString();
			},'load':function(){
				deptgrid.setDefaultDept();
				panel.enable();
				panel.editing = true;
			}}
		}),
		contextMenu : new Ext.menu.Menu({
			items:[new Ext.Action({
				text : '设置为默认部门',
				iconCls : 'icon-designtool-setting',
				handler : function(){
					var record = deptgrid.getSelectionModel().getSelected();
					if(!record){
						return;
					}
					if(record.get('isdefault')){
						return;
					}
					for(var i=0;i<deptgrid.getStore().getCount();i++){
						var r = deptgrid.getStore().getAt(i);
						r.set('isdefault', false);
					}
					record.set('isdefault', true);
				}
			})]
		}),
		getDefaultDept : function(){
			for(var i=0;i<deptgrid.getStore().getCount();i++){
				var r = deptgrid.getStore().getAt(i);
				if(r.get('isdefault')){
					if(panel.editRecord.get('f_dept_id') != r.get('id')){
						panel.editRecord.set('f_dept_id', r.get('id'));
						panel.editRecord.set('f_dept_name', r.get('f_caption'));
					}
					break;
				}
			}
			deptgrid.getStore().commitChanges();
		},
		setDefaultDept : function(){
			for(var i=0;i<deptgrid.getStore().getCount();i++){
				var r = deptgrid.getStore().getAt(i);
				if(panel.editRecord.get('f_dept_id') == r.get('id')){
					r.set('isdefault', true);
				}else{
					r.set('isdefault', false);
				}
				r.commit();
				return;
			}
		},
		listeners : {
			'rowcontextmenu' : function(g, rowIndex, e){
				g.getSelectionModel().selectRow(rowIndex);
				g.contextMenu.showAt(e.getXY());
			}
		}
	});

	var rolegrid = new Ext.grid.GridPanel({
		title : '用户角色',
		region : 'south',
		border : true,
		autoExpandColumn:'f_caption',
		hideHeaders : true,
		split : true,
		enableColumnMove:false,
		height:150,
		columns : [{
			id:'f_name',
			dataIndex:'f_name',
			header : '角色名称',
			width:150
		},{
			id:'f_caption',
			dataIndex:'f_caption',
			header : '中文名'
		}],
		store : new Ext.data.DirectStore({
			directFn : OrganizationDirect.getUserRoleManageList,
			paramOrder:['userId'],
			baseParams:{userId:''},
			root : 'results',
			totalProperty : 'totals',
			idProperty : 'id',
			fields : ['id', 'f_name', 'f_caption'],
			listeners:{'beforeload': function(){
				this.baseParams.userId = panel.editRecord.get('id').toString();
			}}
		})
	});
	
	panel.loadEditRecord = function(){
		pgrid.propStore.loadRecordData(panel.editRecord);
		deptgrid.getStore().reload();
		rolegrid.getStore().reload();
	}

	panel.startEditRecord = function(record){
		panel.editRecord = record;
		panel.loadEditRecord();
	}

	panel.stopEditRecord = function(record, disable){
		if(!panel.editing){
			return;
		}
		if(autoApply.getValue()){
			applyAction.execute();
		}
		if(disable){
			panel.editRecord = undefined;
			panel.disable();
			panel.editing = false;
		}
	}

    var applyAction = new Ext.Action({
    	disabled : true,
    	text : '更新',
    	iconCls : 'icon-designtool-apply',
    	handler : function(){
			var store = pgrid.getStore();
			var modifieds = store.getModifiedRecords();
			if(modifieds.length > 0){
				for(var i=0;i<modifieds.length;i++){
					panel.editRecord.set(modifieds[i].get('name'), modifieds[i].get('value'));
				}
				store.commitChanges();
			}
			deptgrid.getDefaultDept();
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
	var ui = {
		layout : 'border',
		border : false,
		defaults : {border:false},
		tbar:['->',autoApply, applyAction],
		items : [{
			layout : 'border',
			region : 'center',
			border : false,
			items : [pgrid, npanel]
		}, {
			layout : 'border',
			region : 'south',
			border : false,
			height : 250,
			split : true,
	        collapseMode:'mini',
			items : [deptgrid, rolegrid]
		}]
	};
	panel.add(ui);
	panel.doLayout();
});
</script>