<%@ page contentType="text/html; charset=utf-8"%>
<%@page import="com.mixky.engine.organization.User"%>
<%@page import="com.mixky.app.certification.MixkyUserCertification"%>
<%@page import="com.mixky.app.mkoa.netfolder.FolderItem"%>
<%
	String panelid = request.getParameter("panelid");
	User user = MixkyUserCertification.instance().getUserInfo(request);
%>

<script language='javascript'>

Ext.onReady(function(){

	var panel = Ext.getCmp('<%=panelid%>');

	// 数据访问
	var store = new Ext.data.DirectStore({
		directFn : AppFolderDirect.searchShareFolderItems,
		paramOrder:['folderId', 'userId', 'queryvalue'],
		baseParams:{folderId:0, userId:<%=user.getId()%>, queryvalue:''},
		root : 'results',
		totalProperty : 'totals',
		idProperty : 'ID',
		fields:["F_NAME","F_NOTE","F_USERNAME","F_CREATTIME","F_SIZE","F_ACTION","ID", "F_TYPE", "F_PARENTID", 'F_SHARETYPE', "F_FILENAME"]
	});

	
	// 显示列
	var columns = [
      	{id:"F_NAME",header:"名称",dataIndex:"F_NAME",width:300, renderer : function(value, p, record){
			var type = 'icon-app-mkoa-folderup';
			var title = value;
			switch(record.get("F_TYPE")){
			case 0:
				if(record.get('F_SHARETYPE') == 0){
					type = 'icon-app-mkoa-folder';
				}else{
					type = 'icon-app-mkoa-foldershare';
				}
				break;
			case 1:
				type = 'icon-app-mkoa-file';
				title = '<a href="engine/file/sysdownload.do?documentdbtype=blob&fieldname=F_FILE&documentkey=mkNetFolder.docNetFile'
					 + '&id=' + record.get("ID") + '&filename=' + record.get("F_FILENAME") + '">'
					 + title + '</a>';
				break;
			}
			return String.format("<div style='padding-left:23px;background-repeat:no-repeat' class='{1}'> {0}</div>", title, type);
		}},
      	{id:"F_USERNAME",header:"创建人",dataIndex:"F_USERNAME",width:80},
      	{id:"F_CREATTIME",header:"创建日期",dataIndex:"F_CREATTIME",width:120},
      	{id:"F_SIZE",header:"文件大小",dataIndex:"F_SIZE",width:80},
      	{id:"F_NOTE",header:"说明",dataIndex:"F_NOTE"}
      ];

    // 视图操作
	// 刷新按钮
	var btnRefresh = new Ext.Action({
		text : '刷新',
		iconCls : 'icon-sys-refresh',
		handler : function(){
			panel.refresh();
		}
	});

	var btnEdit = new Ext.Action({
		text: '编辑',
		iconCls : 'icon-sys-edit',
		handler: function() {
			var record = grid.getSelectionModel().getSelected();
			var windName;
			if (record.get('F_TYPE') == 0) {
				MixkyApp.desktop.openDocument('mkNetFolder.docNetFolder', record.get('ID'), {'F_GRIDPANEL_ID':'<%=panelid%>'});
			} else {
				MixkyApp.desktop.openDocument('mkNetFolder.docNetFile', record.get('ID'), {'F_GRIDPANEL_ID':'<%=panelid%>'});
			}
		}
	})

	var btnDelete = new Ext.Action({
		text: '删除',
		iconCls : 'icon-sys-delete',
		handler: function() {
			var record = grid.getSelectionModel().getSelected();
			if(!record){
				return;
			}
			var message = '';
			if (record.get('F_TYPE') == <%=FolderItem.TYPE_FOLDER%>) {
				message = "删除文件夹【" + record.get('F_NAME') + "】，包括该文件夹下的所有子文件夹及文件，您确定吗？";
			} else {
				message = "删除文件【" + record.get('F_NAME') + "】，您确定吗？";
			}
			//添加confirm
			Ext.Msg.confirm('危险操作提示', message, function(btn) {
				if (btn == 'yes') {
					AppFolderDirect.deleteFolderItem(record.get('ID'), record.get('F_TYPE'));
					panel.refresh();
				}
			});
		}
	});

	var buttons = [{xtype: 'tbtext', text: '搜索结果'},'->', "-", btnEdit, btnDelete, '-', btnRefresh];

	//右键
	var contextmenus = [btnEdit, btnDelete, '-', btnRefresh];

	var sm = new Ext.grid.RowSelectionModel({singleSelect:true});

	// 表格对象
	var grid = new Ext.grid.GridPanel({
		border : false,
		stripeRows: true,
		enableHdMenu : true,
		lineBreak : true,
		cellSelect : false,
        loadMask: {msg:'正在装载...'},
		autoExpandColumn : 'F_NOTE',
		sm : sm,
		columns : columns,
		store : store,
		tbar : buttons,
		contextMenu : new Ext.menu.Menu({items:contextmenus}),
		listeners:{
			rowcontextmenu:function(grid, rowIndex, e){
        	    grid.getSelectionModel().selectRow(rowIndex);
				if(this.contextMenu.items.length > 0){
					e.preventDefault();
					this.contextMenu.showAt(e.getXY());
				}
			},
			rowdblclick:function(grid, index, e){
				var record = grid.store.getAt(index);
				if (record.get('F_TYPE') == 0) {
					var modulePanel = MixkyApp.desktop.openModule('mkNetFolder');
    				var urlPanel  = modulePanel.openView('mkNetFolder.qFolder.vFolder');
    				if(urlPanel){
    					if(urlPanel.refresh){
    						urlPanel.refresh({folderId: record.get('ID')});
    					}else{
    						urlPanel.initParams = {folderId: record.get('ID')};
    					}
    				}
				} else {
					location.href = 'engine/file/sysdownload.do?documentdbtype=blob&fieldname=F_FILE&documentkey=mkNetFolder.docNetFile'
							 + '&id=' + record.get("ID") + '&filename=' + record.get("F_FILENAME");
				}
			}
		},
		getSelectedRecords : function(){
			return this.getSelectionModel().getSelections();
		}
	});
	
	function getSelectedRecords(){
		return grid.getSelectedRecords();
	}
	
	// 视图刷新
	panel.refresh = function(params){
		if(Ext.isDefined(params) && Ext.isDefined(params.queryvalue)){
			store.baseParams.folderId = params.folderId;
			store.baseParams.queryvalue = params.queryvalue;
		}
		// 初始化参数
		store.reload();
	}

	panel.add(grid);
	panel.doLayout();
	// 初始化视图数据
	panel.refresh(panel.initParams);
	
});


</script>