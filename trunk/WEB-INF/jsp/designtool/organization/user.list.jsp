<%@ page contentType="text/html; charset=utf-8"%>
<%@page import="com.mixky.app.ApplicationParameters"%>
<%
	String id = request.getParameter("id");
%>

<script language='javascript'>
Ext.onReady(function(){
	var id = '<%=id%>';

	// 获得对象的属性列表
	var module = Mixky.designtool.Class.getModule("user");
	
	var panel = Ext.getCmp(id);
	panel.setTitle('用户管理');

	// 合并属性
	var properties = {};
	for(var i=0;i<module.properties.length;i++){
		var p = module.properties[i];
		properties[p.name] = p;
	}
	// 存储字段
	var fields = [{name:'rowstate', mapping:'rowstate'}];
	for(var n in properties){
		var f = {name:n, mapping:n};
		fields.push(f);
	}
	// 列表字段
	var columns = [new Mixky.editor.RowNumberer()];
	for(n in module.propertyColumns){
		var col = {
			id : properties[n].name,
			dataIndex : properties[n].name,
			header : properties[n].text
		};
		if(properties[n].xeditor == 'selectkeymap'){
			col.renderer = function(bVal){
	        	var n = this.id;
	        	for(var i=0;i<properties[n].xconfig.datas.length;i++){
	        		if(bVal == properties[n].xconfig.datas[i][0]){
	        			return properties[n].xconfig.datas[i][1];
	        		}
	        	}
	        	return bVal;
	        }
		}
		Ext.apply(col, module.propertyColumns[n]);
		columns.push(col);
	}
	
	// 数据访问
	var store = new Ext.data.DirectStore({
		pruneModifiedRecords : true,
		directFn : OrganizationDirect.getAllUserList,
		paramOrder:[],
		root : 'results',
		totalProperty : 'totals',
		idProperty : 'id',
		sortInfo: {field:'f_order', direction: 'ASC'},
		fields:fields
	});
    // 功能条
    var AddAction = new Ext.Action({
		text:'添加',
		iconCls:'icon-designtool-add',
		handler:function(){
			Mixky.lib.getNewTableRecordId('t_mk_sys_user', function(newId){
				var record = new store.recordType({id : newId, rowstate : 'add'}, newId);
				store.insert(store.getCount(), record);
				record.set('f_order', store.getCount());
				record.set('f_name', 'user' + newId);
				record.set('f_caption', '新建用户');
				record.set('f_type', 0);
				record.set('f_state', 0);
				grid.getSelectionModel().selectLastRow();
			});
		}
	});
    var DelAction = new Ext.Action({
		text:'删除',
		iconCls:'icon-designtool-delete',
		handler:function(){
			var sm = grid.getSelectionModel()
			var record = sm.getSelected();
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
		iconCls : 'icon-designtool-up',
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
		iconCls:'icon-designtool-down',
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
		iconCls:'icon-designtool-resetpassword',
		handler : function(){
			var record = grid.getSelectionModel().getSelected();
			if(!record){
				return;
			}
			OrganizationDirect.resetUserPassword(record.get('id') , function(result, e){
				if(result.success){
					Ext.Msg.alert('操作提示', '用户【' + record.get('f_name') + '】重置密码成功。');
				}else{
					Ext.Msg.alert('错误提示', '用户【' + record.get('f_name') + '】重置密码失败。');
				}
			});
		}
	});

    var uploadSignAction = new Ext.Action({
		text:'上传签名',
		iconCls:'icon-designtool-resetpassword',
		handler : function(){
	    	var dialog = new Ext.ux.SwfUploadDialog({
				url: '../servlet/file.upload.to.folder',
				flash_url: '../dependences/swfupload/swfupload.swf',
				file_types: '*.png',
				modal : true,
				//manager : MixkyApp.desktop.getManager(),
				reset_on_hide : false,
				base_params : {
	    			targetFolder: '<%=ApplicationParameters.instance().getHandSignFolder()%>'
				},
				allow_close_on_upload : true,
				post_var_name : 'upload'
			});
			dialog.show();		
		}
	});
	
    var tools = [AddAction, '-', DelAction, '-', MoveUpAction, MoveDownAction,'-', ResetPasswordAction, uploadSignAction];

	var detail = new Ext.Panel({
    	region : 'east' ,
    	disabled : true,
		autoLoad : {
			url : 'organization/user.detail.editor.do',
			scripts:true,
			params:{},
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
	Ext.apply(detail.autoLoad.params, {id:detail.getId()});
    
	// 表格对象
	var grid = new Ext.grid.GridPanel({
    	region : 'center',
		border : false,
		columns : columns,
		autoExpandColumn:'f_note',
		enableHdMenu:false,
		enableColumnMove:false,
		store : store,
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
		contextMenu : new Ext.menu.Menu({items:tools}),
		listeners : {
			'rowcontextmenu' : function(g, rowIndex, e){
				g.getSelectionModel().selectRow(rowIndex);
				g.contextMenu.showAt(e.getXY());
			}
		}
	});

	grid.getSelectionModel().on("rowselect", function(sm, index, record){
		detail.startEditRecord(record);
	});

	grid.getSelectionModel().on("rowdeselect", function(sm, index, record){
		detail.stopEditRecord(record, true);
	});

	var ui = new Ext.Panel({
		layout:'border',
		border : false,
		defaults : {border:false},
		tbar : tools,
		items:[grid, detail]
	});
	// 刷新
	panel.refresh = function(){
		grid.getStore().reload();
	}
	// 保存属性修改
	panel.save = function(needSaveNext){
		detail.stopEditRecord();
		var modifieds = store.getModifiedRecords();
		if(modifieds.length > 0){
			var record = modifieds[0];
			var user = record.getChanges();
			user.id = record.get('id');
			user.rowstate = record.get('rowstate');
			OrganizationDirect.saveUser(user, function(result, e){
				if(result && result.success){
					if(record.get('rowstate') == 'del'){
						store.remove(record);
					}else{
						record.set('rowstate', '');
						record.commit();
					}
					panel.save(needSaveNext);
				}
			});
		}else{
			//Mixky.designtool.Framework.contentPanel.savePanelOver(panel, needSaveNext);
		}
	};
	panel.add(ui);
	panel.doLayout();
	panel.refresh();
});
</script>