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
		autoScroll : false,
		labelWidth : 100,
		defaultType: 'textfield',
		bbar:['->', {
			text : '确定',
			handler: function() {
				var form = msForm.getForm();
				if(form.isValid()){
					var srcpassword = form.findField('srcpassword').getValue();
					var newpassword = form.findField('newpassword').getValue();
					var newpassword2 = form.findField('newpassword2').getValue();
					if(newpassword == newpassword2){
						AppMsDirect.modifyPwd(srcpassword, newpassword, function(result, e){
							if(result && result.success){
								MixkyApp.showInfoMessage('密码重置成功！', '信息提示');
							}else{
								MixkyApp.showDirectActionFail("密码重置", result, e);
							}
				    	});
					}else{
						MixkyApp.showErrorMessage("两次输入密码不一致");
					}
				}
				
			}
		}, {
			text : '取消',
			handler: function() {
				Ext.getCmp('docMs-Modify-PWD').close();
			}
		}],
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

	panel.add(msForm);

	panel.doLayout();
	
});
</script>