<%@ page contentType="text/html; charset=utf-8"%>
<%
	String id = request.getParameter("id");
%>
<script language='javascript'>
Ext.onReady(function(){
	var id = '<%=id%>';

	var panel = Ext.getCmp(id);
	panel.setTitle('菜单权限');

	// 存储字段
	var fields = [
		{name:'id', mapping:'id'},
	  	{name:'f_no', mapping:'f_no'},
		{name:'f_name', mapping:'f_name'},
		{name:'f_caption', mapping:'f_caption'},
		{name:'f_auth_caption', mapping:'f_auth_caption'},
		{name:'f_auth', mapping:'f_auth'}
	];
	// 列表字段
	var columns = [new Ext.grid.RowNumberer(),{
		id : 'f_no',
		dataIndex : 'f_no',
		width:70,
		header : '编号'
	},{
		id : 'f_name',
		dataIndex : 'f_name',
		header : '标识',
		width:120,
	},{
		id : 'f_caption',
		dataIndex : 'f_caption',
		width:120,
		header : '名称'
	},{
		id : 'f_auth_caption',
		dataIndex : 'f_auth_caption',
		header : '权限定义'
	}];
	// 数据访问
	var store = new Ext.data.DirectStore({
		directFn : DesktopDirect.getAllMenuList,
		paramOrder:[],
		root : 'results',
		totalProperty : 'totals',
		idProperty : 'id',
		sortInfo: {field:'f_no', direction: 'ASC'},
		fields:fields
	});
	function updateAuth(display, values, records){
		var record = grid.getSelectionModel().getSelected();
		record.set('f_auth', values);
		record.set('f_auth_caption', display);
	}
    // 功能条
    var editAction = new Ext.Action({
		text:'设置权限',
		iconCls:'icon-designtool-edit',
		handler:function(){
			var record = grid.getSelectionModel().getSelected();
			if(!record){
				return;
			}
    		Mixky.editor.showOrganizationWindow(updateAuth, record.get('f_auth'), {});
		}
	});
	
    var tools = [editAction];

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
				editAction.execute();
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
			var id = record.get('id');
			var auth = record.get('f_auth');
			var authCaption = record.get('f_auth_caption');
			DesktopDirect.saveMenuAuth(id, auth, authCaption, function(result, e){
				if(result && result.success){
					record.commit();
					panel.save(needSaveNext);
				}
			});
		}else{
			Mixky.designtool.Framework.contentPanel.savePanelOver(panel, needSaveNext);
		}
	};
	panel.add(grid);
	panel.doLayout();
	panel.refresh();
});
</script>