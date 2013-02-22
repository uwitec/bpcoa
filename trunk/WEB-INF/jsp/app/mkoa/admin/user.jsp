<%@ page contentType="text/html; charset=utf-8"%>
<%@page import="com.mixky.app.ApplicationParameters"%>
<%
	String panelid = request.getParameter("panelid");
%>
<script language='javascript'>
Ext.onReady(function(){
	var panelid = '<%=panelid%>';
	var panel = Ext.getCmp(panelid);

	// 数据访问
	var store = new Ext.data.DirectStore({
		pruneModifiedRecords : true,
		directFn : AdminAppDirect.getUsers,
		paramOrder:[],
		root : 'results',
		totalProperty : 'totals',
		idProperty : 'id',
		sortInfo: {field:'f_order', direction: 'ASC'},
		fields:['id', 'rowstate', 'f_order', 'f_type', 'f_state', 'f_name', 'f_caption', 'f_dept_name', 'f_dept_id', 'f_email', 'f_cellphone', 'f_note', 'f_sign', 'f_depts','f_roles']
	});

    // 功能条
    var AddAction = new Ext.Action({
		text:'添加',
		iconCls:'icon-sys-add',
		handler:function(){
			Mixky.lib.getNewTableRecordId('t_mk_sys_user', function(newId){
				var record = new store.recordType({id : newId, rowstate : 'add'}, newId);
				store.insert(store.getCount(), record);
				record.set('f_order', store.getCount());
				record.set('f_name', 'user' + newId);
				record.set('f_caption', '新建用户');
				record.set('f_type', 1);
				record.set('f_state', 0);
				record.set('f_email', '');
				record.set('f_cellphone', '');
				record.set('f_note', '');
				record.set('f_sign', '');
				record.set('f_depts', {});
				record.set('f_roles', {});
				grid.getSelectionModel().selectLastRow();
			});
		}
	});
    var DelAction = new Ext.Action({
		text:'删除',
		iconCls:'icon-sys-delete',
		handler:function(){
			var sm = grid.getSelectionModel()
			var record = sm.getSelected();
			if(record.get('id') == 1){
				MixkyApp.showErrorMessage('系统用户，不允许删除。', '错误提示');
				return;
			}
			if(record){
				var index = store.indexOf(record);
				if(record.get('rowstate') == 'add'){
					store.remove(record);
				}else{
					record.set('rowstate', 'del');
				}
				for(var i=index;i<store.getCount();i++){
					var record = store.getAt(i);
					if(record.dirty){
						record.set('f_roder', i + 1);
					}else{
						record.set('f_roder', i + 1);
						record.commit();
					}
				}
				sm.deselectRow(index);
			}
			
		}
	});
    var MoveUpAction = new Ext.Action({
		text : '上移',
		iconCls : 'icon-sys-up',
		handler : function(){
			var record = grid.getSelectionModel().getSelected();
			if(!record){
				return;
			}
			var index = grid.getStore().indexOf(record);
			if(index == 0){
				return;
			}
			var recordPre = store.getAt(index - 1);
			record.set('f_order', index);
			recordPre.set('f_order', index + 1);
			grid.getStore().sort('f_order', 'ASC');
		}
	});
    var MoveDownAction = new Ext.Action({
		text:'下移',
		iconCls:'icon-sys-down',
		handler : function(){
			var record = grid.getSelectionModel().getSelected();
			if(!record){
				return;
			}
			var index = grid.getStore().indexOf(record);
			if(index == grid.getStore().getCount() - 1){
				return;
			}
			var recordNext = store.getAt(index + 1);
			record.set('f_order', index + 2);
			recordNext.set('f_order', index + 1);
			grid.getStore().sort('f_order', 'ASC');
		}
	});
    var ResetPasswordAction = new Ext.Action({
		text:'重置密码',
		iconCls:'icon-sys-resetpassword',
		handler : function(){
			var record = grid.getSelectionModel().getSelected();
			if(!record){
				return;
			}
			Ext.MessageBox.confirm('操作提示', '重置【' + record.get('f_name') + '】用户登录密码为初始密码，您确定吗？', function(btn){
				if(btn == 'yes'){
					AdminAppDirect.resetUserPassword(record.get('id') , function(result, e){
						if(result && result.success){
							MixkyApp.showInfoMessage('用户【' + record.get('f_name') + '】重置密码成功。', '操作提示');
						}else{
							MixkyApp.showErrorMessage('用户【' + record.get('f_name') + '】重置密码失败。', '错误提示');
						}
					});
				}
			});
		}
	});

	var btnDelSign = new Ext.Action({
		text : '删除签名',
		iconCls : 'icon-sys-delete',
		handler : function(){
			var record = grid.getSelectionModel().getSelected();
			if(!record){
				return;
			}
			record.set('f_sign', '');
		}
	});
	
    var uploadSignButton = new Mixky.plugins.UploadButton({
		text: '批量上传签名',
		iconCls: 'icon-sys-upload',
		tooltip: '签名图片文件名称应与\'用户登录名\'或\'用户姓名\'一致',
		uploadConfig : {
			upload_url : 'servlet/file.upload.to.folder',
			file_types_description : '图形文件',
			file_types : '*.gif;*.jpg;*.png',
			post_params : {
    			targetFolder: '<%=ApplicationParameters.instance().getHandSignFolder()%>'
			}
		}
	});
	
    var synchroUserButton = new Ext.Action({
		text: '即时通信用户同步',
		iconCls:'icon-sys-synchro',
		handler : function(){
			Ext.MessageBox.confirm('操作提示', '同步用户会重新建立即时通信的组织结构，您确定吗？', function(btn){
				if(btn == 'yes'){
					MessagerAppDirect.InitMessagerUser(function(result, e){
						if(result && result.success){
							MixkyApp.showInfoMessage('用户同步完成。', '操作提示');
						}else{
							MixkyApp.showErrorMessage('用户同步失败。', '错误提示');
						}
					});
				}
			});
		}

	});
    
	var btnSave = new Ext.Action({
		text : '保存',
		iconCls : 'icon-sys-save',
		handler : function(){
			panel.save();
		}
	});

	var btnRefresh = new Ext.Action({
		text : '刷新',
		iconCls : 'icon-sys-refresh',
		handler : function(){
			panel.refresh();
		}
	});
	
    var tools = [AddAction, '-', DelAction, '-', MoveUpAction, MoveDownAction,'-', ResetPasswordAction, '-', btnDelSign, '-', btnSave, '->',synchroUserButton, uploadSignButton, '-', btnRefresh];
    var menus = [AddAction, '-', DelAction, '-', MoveUpAction, MoveDownAction,'-', ResetPasswordAction, '-', btnDelSign, '-', btnSave, '-', btnRefresh];
	// 表格对象
	var grid = new Ext.grid.GridPanel({
    	region : 'center',
		border : false,
		autoExpandColumn:'f_note',
		enableHdMenu:false,
		enableColumnMove:false,
		store : store,
		columns : [new Mixky.editor.RowNumberer(), {
			id : 'id',
			dataIndex : 'id',
			header : 'ID',
			width : 70,
			renderer:function(value, p, record) {
				return String.format("<div style='height:16px;padding-left:23px;background:transparent url(resources/images/icon/sys/user.gif) no-repeat'> {0}</div>", value);
			}
		}, {
			id : 'f_name',
			dataIndex : 'f_name',
			header : '登录名',
			width : 120
		}, {
			id : 'f_caption',
			dataIndex : 'f_caption',
			header : '姓名',
			width : 100
		}, {
			id : 'f_dept_name',
			dataIndex : 'f_dept_name',
			header : '所属部门',
			width : 120
		},{
			id : 'f_sign',
			dataIndex : 'f_sign',
			header : '签名',
	    	renderer : function(bVal){
				if(bVal && bVal != ''){
					return '有'
				}
				return '';
	        },
			width : 40
		},{
			id : 'f_state',
			dataIndex : 'f_state',
			header : '状态',
	    	renderer : function(bVal){
				switch(bVal){
				case 0: return '正常';
				case 1: return '已离职';
				defalut : return bVal;
				}
	        },
			width : 80
		}, {
			id : 'f_note',
			dataIndex : 'f_note',
			header : '说明',
			editor : Mixky.lib.getEditorComponent('textbox')
		}],
		viewConfig:{
			getRowClass: function(record, index) {
				if(record.dirty){
					return 'mixky-grid-row-changed';
				}
		    }
		},
		sm : new Ext.grid.RowSelectionModel({
			listeners : {
				'beforerowselect' : function(sm, index, ke, record){
					if(record.get('rowstate') == 'del'){
						return false;
					}
				}
			}
		}),
		contextMenu : new Ext.menu.Menu({items : menus}),
		listeners : {
			'rowcontextmenu' : function(g, rowIndex, e){
				g.getSelectionModel().selectRow(rowIndex);
				g.contextMenu.showAt(e.getXY());
			}
		}
	});


	var detail = new Ext.Panel({
    	region : 'east' ,
    	disabled : true,
		autoLoad : {
			url : 'page.do',
			scripts:true,
			params:{url:'app/mkoa/admin/user.editor'},
			border:false
		},
		width : 350,
		split : true,
		border : false,
		layout : 'fit',
		// 开始编辑记录
		startEditRecord : Ext.emptyFn,
		// 结束编辑记录
		stopEditRecord : Ext.emptyFn
	});
	Ext.apply(detail.autoLoad.params, {panelid : detail.getId()});

	grid.getSelectionModel().on("rowselect", function(sm, index, record){
		detail.startEditRecord(record);
	});

	grid.getSelectionModel().on("rowdeselect", function(sm, index, record){
		detail.stopEditRecord(record, true);
	});

	// 刷新
	panel.refresh = function(){
		store.reload();
	}
	// 保存属性修改
	panel.save = function(){
		detail.stopEditRecord();
		var modifieds = store.getModifiedRecords();
		if(modifieds.length > 0){
			var record = modifieds[0];
			var user = record.getChanges();
			user.id = record.get('id');
			user.rowstate = record.get('rowstate');
			AdminAppDirect.saveUser(user, function(result, e){
				if(result && result.success){
					if(record.get('rowstate') == 'del'){
						store.remove(record);
					}else{
						record.set('rowstate', '');
						record.commit();
					}
					panel.save();
				}else{
					MixkyApp.showErrorMessage('保存数据出现错误！', '错误提示');
				}
			});
		}
	};

	var ui = new Ext.Panel({
		layout:'border',
		border : false,
		defaults : {border:false},
		tbar : tools,
		items:[grid, detail]
	});
	panel.add(ui);
	panel.doLayout();
	panel.refresh();
});
</script>