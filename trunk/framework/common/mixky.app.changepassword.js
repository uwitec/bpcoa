
Ext.namespace("Mixky.app.common");

Mixky.app.common.ChangePassword = function(){
    var formPanel = new Ext.FormPanel({
		labelWidth: 100,
		frame:true,
		defaultType: 'textfield',
		items: [{
			fieldLabel: '原密码',
			name: 'srcpassword',
			inputType: 'password',
			anchor : '100%',
			allowBlank:false
		},{
			fieldLabel: '新密码',
			name: 'newpassword',
			inputType: 'password',
			anchor : '100%',
			allowBlank:false
		},{
			fieldLabel: '新密码确认',
			name: 'newpassword2',
			inputType: 'password',
			anchor : '100%',
			allowBlank:false
		}]
	});
    win = new Ext.Window({
        title : '修改密码',
        width :280,
        height :160,
        iconCls : 'icon-sys-password',
        shim : false,
        maximizable : false,
        minimizable : false,
        animCollapse :false,
        resizable :false,
        modal : true,
		layout : 'fit',
        items : [
            formPanel
        ],
		buttons: [{
			text: '确认',
			handler: function(){
				var form = formPanel.getForm();
				if(form.isValid()){
					var srcpassword = form.findField('srcpassword').getValue();
					var newpassword = form.findField('newpassword').getValue();
					var newpassword2 = form.findField('newpassword2').getValue();
					if(newpassword == newpassword2){
						var notifyWin = MixkyApp.showWaitMessage("正在修改用户密码...");
						OrganizationAppDirect.changePassword(srcpassword, newpassword, function(result, e){
							if(result && result.success){
		        				notifyWin.setIconClass('x-icon-done');
		        				notifyWin.setTitle('完成');
		        				notifyWin.setMessage('用户密码修改完毕.');
								win.close();
							}else{
		        				notifyWin.setIconClass('x-icon-done');
		        				notifyWin.setTitle('错误');
		        				notifyWin.setMessage('用户密码修改失败.');
							}
							MixkyApp.hideNotification(notifyWin);
						});
					}else{
						MixkyApp.showErrorMessage("两次输入密码不一致");
					}
				}
        	}
		},{
			text: '取消',
			handler: function(){
				win.close();
        	}
		}]
    });
    win.show();
}