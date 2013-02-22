<%@ page contentType="text/html; charset=utf-8"%>
<%
	String panelid = request.getParameter("panelid");
%>
<script language='javascript'>
Ext.onReady(function(){
	var panel = Ext.getCmp('<%=panelid%>');

	var msForm = new Ext.form.FormPanel({
		border : false,
		bodyStyle : 'padding:15px;padding-right:25px;',
		autoScroll : true,
		labelWidth : 50,
		api : {
			submit : AppMsDirect.sendMsg
		},
		bbar:['->', {
			text : '发送',
			iconCls : 'icon-app-mkoa-sent',
			handler: function() {
				msForm.getForm().submit({
					success : function(f,a){
						MixkyApp.showInfoMessage('消息已发送成功！', '信息提示');
						Ext.getCmp('docMs-Send').close();
					},
					failure : function(f, a){
						MixkyApp.showFormActionFail(f, a);
					}
				});
			}
		}, {
			text : '取消',
			iconCls : 'icon-sys-delete',
			handler: function() {
				Ext.getCmp('docMs-Send').close();
			}
		}],
		items : [{
			fieldLabel : '<A href=#>收件人</A>',
			name : 'F_TO',
			xtype : 'mixkyemailaddress',
			anchor : '100%',
			height: 80,
			listWidth : 300,
			allowBlank: false,
			directFn : AppMsDirect.queryPhone,
			listeners : {
				'afterrender' : function(f){
					f.label.on('click', function(){
						panel.showAddressBook('F_TO');
						return false;
					})
				}
			}
		},{
			fieldLabel : '内　容',
			anchor : '100% 50%',
			name : 'F_CONTENT',
			allowBlank: false,
			maxLength: 70,
			xtype : 'textarea'
		}]
	});

	// 显示地址簿
	panel.showAddressBook = function(fieldName){
		var field = msForm.getForm().findField(fieldName);
		if(!Ext.isDefined(field)){return;}
		var addressPanel = new Ext.Panel({
			id : 'msaddressbook',
			layout : 'fit',
			autoLoad : {
				url : 'page.do',
				params : {url:'app/mkoa/ms/ms.addressbook', panelid : 'msaddressbook'},
				loadScripts : true,
				scripts	: true
			}
		});
		addressPanel.addressField = field;
		var addressBookWin = new Ext.Window({
	        modal: true,
	        title : '选择手机号码',
	        iconCls : 'icon-app-mkoa-addressbook',
	        manager : MixkyApp.desktop.getManager(),
	        closeAction : 'hide',
	        layout:'fit',
	        width: 500,
	        height:500,
	        maximizable : false,
	        minimizable : false,
	        resizable: true,
	        items : addressPanel,
			buttons : [{
				text : '确定',
				iconCls : 'icon-sys-confirm',
				handler : function(){
					if(Ext.isDefined(addressPanel.confirmSelected)){
						addressPanel.confirmSelected();
					}
					addressBookWin.close();
				}
			}, {
				text : '取消',
				iconCls : 'icon-sys-cancel',
				handler : function(){
					addressBookWin.close();
				}
			}]
		});
		addressBookWin.show();
	}

	panel.add(msForm);

	msForm.getForm().load();
	
	panel.doLayout();
	
});
</script>