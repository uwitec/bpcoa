<%@ page contentType="text/html; charset=utf-8"%>
<%
	String id = request.getParameter("id");
%>
<script language='javascript'>
Ext.onReady(function(){
	var id = '<%=id%>';
	
	var panel = Ext.getCmp(id);
	// 数据访问
	var store = new Ext.data.DirectStore({
		directFn : DesignObjectTemplateDirect.getTemplateList,
		root : 'results',
		totalProperty : 'totals',
		idProperty : 'filename',
		paramOrder:['mclass'],
		baseParams : {
			mclass : ''
		},
		fields:[
		    {name:'filename', mapping:'filename'},
		    {name:'f_class', mapping:'f_class'},
		    {name:'f_key', mapping:'f_key'},
		    {name:'f_name', mapping:'f_name'},
		    {name:'f_caption', mapping:'f_caption'},
		    {name:'f_note', mapping:'f_note'}
		]
	});
	// 列表
	var grid = new Ext.grid.GridPanel({
		region : 'center',
		border : false,
		enableHdMenu:false,
		enableColumnMove:false,
		autoExpandColumn:'f_note',
		store : store,
		columns : [
			{id:'filename',header: "文件名", width: 120, dataIndex: 'filename'},
			{id:'f_name',header: "命名", width: 100, dataIndex: 'f_name'},
			{id:'f_caption',header: "名称", width: 100, dataIndex: 'f_caption'},
			{id:'f_note',header: "说明", width: 120, dataIndex: 'f_note'}
		],
		listeners:{
			'rowdblclick' : function(g, index, e){
				var record = g.getStore().getAt(index);
				var fieldname = record.get("filename");
				form.loadFile(fieldname);
			}
		},
		tbar:[{
			text : '创建',
			iconCls : 'icon-designtool-add',
			handler : function(){
				var cform = new Ext.form.FormPanel({
					frame:true,
					api:{
						submit:DesignObjectTemplateDirect.createTemplate
					},
					items:[{
			    		xtype:'combo',
						fieldLabel:'模板对象类',
						name:'mclass',
			    		triggerAction:'all',
			    		forceSelection: false,
			    		store:['field', 'action', 'panel', 'table'],
			    		editable:false,
						anchor : '100%',
						allowBlank:false
			    	},{
						xtype:'textfield',
						fieldLabel:'模板对象名',
						name:'key',
						anchor : '100%',
						allowBlank:false
					}]
				});
				var cwin = new Ext.Window({
	                layout:'fit',
	                modal:true,
	                width:300,
	                height:150,
	                items: cform,
	                title:'创建对象模板窗口',
	                buttons: [{
	                    text:'创建',
						handler : function(){
	                		cform.getForm().submit({
		                		success:function(){
									cwin.close();
									panel.refresh()
		                		}
		                	});
						}
	                },{
	                    text: '取消',
	                    handler: function(){
	                		cwin.close();
	                    }
	                }]
	            });
	            cwin.show();
			}
		},{
			text : '删除',
			iconCls : 'icon-designtool-delete',
			handler : function(){
				var s = grid.getSelectionModel().getSelections();
				if(s.length == 0){
					return;
				}
				Ext.MessageBox.confirm('危险操作提示', '删除当前选中的模板，该操作不可恢复，您确定吗？', function(btn){
					if(btn == 'yes'){
						var delKeys = [];
		                for(var i = 0, r; r = s[i]; i++){
		                    delKeys.push(r.get('filename'));
		                }
		                DesignObjectTemplateDirect.deleteTemplateFiles(delKeys, function(result, e){
							if(result.success){
								panel.refresh();
							}
						});
					}
				});
			}
		},'-',{
			text : '复制',
			iconCls : 'icon-designtool-copy',
			handler:function(){
				var record = grid.getSelectionModel().getSelected();
				if(!record){
					return;
				}
	    		Mixky.designtool.Context.clipboardObject = {key:record.get('filename'), mclass:'template'};
			}
		},{
			text : '粘贴',
			iconCls : 'icon-designtool-paste',
			handler : function(){
				var srcoid = Mixky.designtool.Context.clipboardObject;
				if(!srcoid){
					alert('剪贴板为空');
					return;
				}
	            DesignObjectTemplateDirect.pasteAsTemplate(srcoid.mclass, srcoid.key, function(result, e){
					if(result.success){
						panel.refresh();
					}
				});
			}
		}]
	});
	// 表单
	var form = new Ext.form.FormPanel({
		region : 'east',
		frame:true,
		split: true,
		width:300,
		labelWidth:70,
		api: {
			load : DesignObjectTemplateDirect.loadTemplateFile,
			submit : DesignObjectTemplateDirect.saveTemplateFile
		},
		paramOrder: ['filename'],
		items: [{
			xtype : 'textfield',
			name : 'filename',
			fieldLabel : "文件名",
			readOnly : true,
			anchor : '100%'
		},{
			xtype : 'textarea',
			hideLabel : true,
			name : 'filecontent',
			anchor:'100% -30'
		}],
		buttons:[{
			text : '保存',
			handler:function(){
				form.getForm().submit({
					success:function(f, a){
						f.setValues(a.result.data);
					}
				});
			}
		},{
			text : '重新装载',
			handler:function(){
				var val = form.getForm().findField('filename').getValue();
				if(val && val != ''){
					form.getForm().load({params:{filename:val}});
				}
			}
		}],
		loadFile:function(filename){
			form.getForm().load({params:{filename:filename}});
		}
	});
	// 刷新
	panel.refresh = function(){
		grid.getStore().reload();
	}
	var ui = {
		layout : 'border',
		border : false,
		defaults : {border:false},
		items : [grid, form]
	};
	panel.add(ui);
	panel.doLayout();
	panel.refresh();
});
</script>