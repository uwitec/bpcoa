<%@ page contentType="text/html; charset=utf-8"%>
<%
	String panelid = request.getParameter("panelid");
%>
<script language='javascript'>
Ext.onReady(function(){
	var panelid = '<%=panelid%>';
	var panel = Ext.getCmp(panelid);

	// 存储字段
	var fields = [
		{name:'f_key', mapping:'f_key'},
		{name:'f_module', mapping:'f_module'},
		{name:'f_modulerole', mapping:'f_modulerole'},
		{name:'f_auth_caption', mapping:'f_auth_caption'},
		{name:'f_auth', mapping:'f_auth'}
	];
	// 列表字段
	var columns = [new Ext.grid.RowNumberer(),{
		id : 'f_module',
		dataIndex : 'f_module',
		width:150,
		header : '模块'
	},{
		id : 'f_modulerole',
		dataIndex : 'f_modulerole',
		header : '模块角色',
		width:150
	},{
		id : 'f_auth_caption',
		dataIndex : 'f_auth_caption',
		header : '权限定义'
	}];
	// 数据访问
	var store = new Ext.data.DirectStore({
		directFn : AdminAppDirect.getModuleRoleAuths,
		paramOrder:[],
		root : 'results',
		totalProperty : 'totals',
		idProperty : 'f_key',
		sortInfo: {field:'f_key', direction: 'ASC'},
		fields:fields
	});
	function updateAuth(display, values, records){
		var record = grid.getSelectionModel().getSelected();
		record.set('f_auth', values);
		record.set('f_auth_caption', display);
	}
    // 功能条
    var btnEdit = new Ext.Action({
		text:'设置权限',
		iconCls:'icon-sys-edit',
		handler:function(){
			var record = grid.getSelectionModel().getSelected();
			if(!record){
				return;
			}
			Mixky.app.common.getOrganizationWindow({}, record.get('f_auth'), updateAuth).show();
		}
	});

	var btnRefresh = new Ext.Action({
		text : '刷新',
		iconCls : 'icon-sys-refresh',
		handler : function(){
			panel.refresh();
		}
	});

	var btnSave = new Ext.Action({
		text : '保存',
		iconCls : 'icon-sys-save',
		handler : function(){
			panel.save();
		}
	});
	
    var tools = [btnEdit, '-', btnSave, '->', btnRefresh];

	// 表格对象
	var grid = new Ext.grid.GridPanel({
    	region : 'center',
		border : false,
		columns : columns,
		autoExpandColumn:'f_auth_caption',
		enableHdMenu:false,
		enableColumnMove:false,
		store : store,
		tbar : tools,
		contextMenu : new Ext.menu.Menu({items:tools}),
		listeners : {
			'rowcontextmenu' : function(g, rowIndex, e){
				g.getSelectionModel().selectRow(rowIndex);
				g.contextMenu.showAt(e.getXY());
			},
			'rowdblclick' : function(g, rowIndex, e){
				btnEdit.execute();
			}
		}
	});

	// 刷新
	panel.refresh = function(){
		store.reload();
	}
	// 保存属性修改
	panel.save = function(needSaveNext){
		var modifieds = store.getModifiedRecords();
		if(modifieds.length > 0){
			var record = modifieds[0];
			var key = record.get('f_key');
			var auth = record.get('f_auth');
			var authCaption = record.get('f_auth_caption');
			AdminAppDirect.saveModuleRoleAuth(key, auth, authCaption, function(result, e){
				if(result && result.success){
					record.commit();
					panel.save();
				}else{
					MixkyApp.showErrorMessage('保存数据出现错误！', '错误提示');
				}
			});
		}
	};
	panel.add(grid);
	panel.doLayout();
	panel.refresh();
});
</script>