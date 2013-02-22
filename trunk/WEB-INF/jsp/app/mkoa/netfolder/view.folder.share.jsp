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
		directFn : AppFolderDirect.getShareFolderList,
		paramOrder:['folderId', 'userId', 'sharetype'],
		baseParams:{folderId:0, userId:<%=user.getId()%>, sharetype:0},
		root : 'results',
		totalProperty : 'folderId',
		idProperty : 'ID',
		fields:["F_IMG","F_NAME","F_NOTE","F_USERNAME","F_CREATTIME","F_SIZE","F_ACTION","ID", "F_TYPE", "F_PARENTID", "F_BELONGUSERID", "F_SHARETYPE", "F_USERID", "F_FILENAME"]
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

	
	var fieldSearch = new Ext.form.TextField({
		width : 100,
		emptyText : '输入快速检索字符',
        listeners: {
	        specialkey: function(field, e){
	            // e.HOME, e.END, e.PAGE_UP, e.PAGE_DOWN,
	            // e.TAB, e.ESC, arrow keys: e.LEFT, e.RIGHT, e.UP, e.DOWN
	            if (e.getKey() == e.ENTER) {
	            	var value = field.getValue();
	    			if(Ext.isDefined(value) && value != ''){
	    				var modulePanel = MixkyApp.desktop.openModule('mkNetFolder');
	    				var urlPanel  = modulePanel.openView('mkNetFolder.qFolder.vShareSearch');
	    				if(urlPanel){
	    					if(urlPanel.refresh){
	    						urlPanel.refresh({folderId: store.baseParams.folderId,queryvalue: value});
	    					}else{
	    						urlPanel.initParams = {folderId: store.baseParams.folderId,queryvalue: value};
	    					}
	    				}
	    			}
	            }
	        }
	    }
	});
	var btnSearch = new Ext.Action({
		text : '快速检索',
		iconCls : 'icon-sys-query',
		handler : function(){
			var value = fieldSearch.getValue();
			if(Ext.isDefined(value) && value != ''){
				var modulePanel = MixkyApp.desktop.openModule('mkNetFolder');
				var urlPanel  = modulePanel.openView('mkNetFolder.qFolder.vShareSearch');
				if(urlPanel){
					if(urlPanel.refresh){
						urlPanel.refresh({folderId: store.baseParams.folderId,queryvalue: value});
					}else{
						urlPanel.initParams = {folderId: store.baseParams.folderId,queryvalue: value};
					}
				}
			}
		}
	});
	
	
    // 视图操作
    var AddFolderAction = new Ext.Action({
		text:'新建文件夹',
		iconCls:'icon-sys-btnadd',
		handler:function(){
    		AppFolderDirect.getNewItemInfo(store.baseParams.folderId, store.baseParams.userId, function(result, e){
				if(result) {
					MixkyApp.desktop.openDocument('mkNetFolder.docNetFolder', 0, {'F_GRIDPANEL_ID':'<%=panelid%>', 'F_PARENTID':result.f_parentid, 'F_LEVEL':result.f_level, 'F_BELONGUSERID':result.f_belonguserid, 'F_TYPE': <%=FolderItem.TYPE_FOLDER%>});
				}
	        });
		}
	});

    var UploadFileButton = new Mixky.plugins.UploadButton({
		text:'上传文件',
		iconCls:'icon-sys-upload',
		uploadConfig : {
			upload_url : 'servlet/mkoa/netfolder/folderfile.upload',
			post_params : {
				userId: '<%=user.getId()%>'
			},
			listeners : {
				'allUploadsComplete' : function(){
					panel.refreshView();
				},
				'startUpload' : function(){
					this.addPostParam('folderId', store.baseParams.folderId);
				}
			}
		}
	});
	
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
	})
	
	var buttons = [{xtype: 'tbtext', text: ''}, '->',fieldSearch, btnSearch, '-', AddFolderAction, '-', UploadFileButton, "-", btnEdit, btnDelete, '-', btnRefresh];

	//右键
	var contextmenus = [AddFolderAction, "-", btnEdit, btnDelete, btnRefresh];

	store.on('load', function(store, records, option){
		if (records.length > 0 && store.baseParams.folderId > 0) {
			if (records[0].get('F_SHARETYPE') == <%=FolderItem.TYPE_SHARE_WRITE%>) {
				AddFolderAction.enable();
				UploadFileButton.enable();
				btnDelete.enable();
				btnEdit.enable();
				store.baseParams.sharetype = <%=FolderItem.TYPE_SHARE_WRITE%>;
			}
		}
	});

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
		enableDragDrop : false,
		ddGroup : 'grid2tree',
		listeners:{
			rowcontextmenu:function(grid, rowIndex, e){
        	    grid.getSelectionModel().selectRow(rowIndex);
				if(this.contextMenu.items.length > 0 && grid.store.baseParams.sharetype == <%=FolderItem.TYPE_SHARE_WRITE%>){
					e.preventDefault();
					if (rowIndex == 0 && store.baseParams.folderId > 0) {
						
					} else {
						this.contextMenu.showAt(e.getXY());
					}
				}
			},
			rowdblclick:function(grid, index, e){
				var record = grid.store.getAt(index);
				if (record.get('F_TYPE') == 0) {
					var sharetype = 0
					if (record.get('ID') > 0) {
						sharetype = record.get('F_SHARETYPE');
					}
					panel.refresh({folderId:record.get('ID'),sharetype:sharetype});
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
		if(Ext.isDefined(params) && Ext.isDefined(params.folderId)){
			store.baseParams.folderId = params.folderId;
			store.baseParams.sharetype = params.sharetype;

			AppFolderDirect.getFolderName(params.folderId, function(result, e){
				if(result && result.success) {
					grid.getTopToolbar().get(0).setText(result.folderName);
				}
	        });
		}
		AddFolderAction.disable();
		UploadFileButton.disable();
		btnDelete.disable();
		btnEdit.disable();
		// 初始化参数
		store.reload();
	}

	// 输出附加脚本 begin

	// 输出附加脚本 end
	panel.add(grid);
	panel.doLayout();
	// 初始化视图数据
	panel.refresh(panel.initParams);


	
    //为左边菜单添加文件夹移动事件
	Ext.getCmp('m-mkNetFolder').items.items[0].moduleTree.addListener('beforenodedrop', function(e) {
		if(Ext.isArray(e.data.selections)) {
			var r;
            for(var i = 0; i < e.data.selections.length; i++) {
	            r = e.data.selections[i];
	            var targetId;
				
				if (e.target.attributes.folderId != null) {
					targetId = e.target.attributes.folderId;
				} else {
					//拖入到个人文件柜的目录下
					if (e.target.id  == Ext.getCmp('m-mkNetFolder').items.items[0].moduleTree.getRootNode().firstChild.id) {
						if (r.get('F_TYPE') == <%=FolderItem.TYPE_FILE%>) {
							Ext.Msg.alert('信息提示', '文件移动，只能移动到自定义的文件夹下！');
							return false;
						}
						targetId = 0;
					//拖入到其它根目录，直接返回
					} else {
						Ext.Msg.alert('信息提示', '文件和文件夹的移动，只能移动到个人文件柜下！');
						return false;
					}
				}

				if (targetId == r.get('F_PARENTID')) {
					Ext.Msg.alert('信息提示', r.get('F_NAME') + '已经在' + e.target.text + '文件夹下！');
					return false; 
				}

				if (targetId == r.get('ID')) {
					Ext.Msg.alert('信息提示', r.get('F_NAME') + '不允许移动到' + e.target.text + '文件夹下！');
					return false; 
				}
				
				AppFolderDirect.moveFolderItem(r.get('ID'), targetId, function(result, event) {
					if (result) {
						if (result.success) {
							e.target.reload();
						} else {
							//不允许移动到指定目录
							Ext.Msg.alert('信息提示', r.get('F_NAME') + '不允许移动到' + e.target.text + '文件夹下！');
						}
					}
				}, this);
            }
 
            return true;
        }
	});

	//表单保存后刷新视图列表和菜单
	panel.refreshViewAndTree = function() {
		panel.refresh();
	};

	panel.refreshView = function() {
		panel.refresh();
	};

});
</script>