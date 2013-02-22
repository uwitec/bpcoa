<%@page contentType="text/html; charset=utf-8"%>
<%
	String panelid = request.getParameter("panelid");
%>
<script language='javascript'>
Ext.onReady(function(){
	var panel = Ext.getCmp('<%=panelid%>');

	var snField = new Ext.form.TextField({
		xtype : 'textfield',
		fieldLabel : '输入产品序列号',
		maxLength : 35,
		minLength : 35,
		value: '',
		anchor : '100%'
	});

	var keyField = new Ext.form.TextArea({
		xtype : 'textarea',
		fieldLabel : '输入产品注册码',
		anchor : '100%',
		height : 80
    });

	var btnGetKey = new Ext.Button({
        text : '在线获得注册码',
		iconCls : 'icon-sys-getkey',
		handler : function(){
			var sn = snField.getValue();
			var sn = snField.getValue().replaceAll('-','');
			if (sn.length != 32) {
				snField.markInvalid();
				panel.showTip('<font color=red>产品序列号不正确，请重新输入</font>');
			} else {
				if (sn != '') {
					AdminAppDirect.getRegisterCode(sn, function(result, e){
						if(result && result.success){
							var registercode = result.registercode;
							// 访问产品网站获得注册码
							window.open('http://oa.mixky.cn/service/register.do?sn=' + registercode);
						}else{
							MixkyApp.showErrorMessage('系统注册码验证失败，请检查注册码是否正确', '错误提示');
						}
					});
				} else {
					MixkyApp.showErrorMessage('请输入产品序列号', '错误提示');
				}
			}
		}
    });

	var btnCancel = new Ext.Action({
		text : '取消',
		iconCls : 'icon-sys-cancel',
		handler : function(){
			var win = panel.findParentByType('window');
			win.close();
		}
	});

	var btnConfirm = new Ext.Action({
		text : '激活产品',
		iconCls : 'icon-sys-active',
		handler : function(){
			var key = keyField.getValue();
			if (key != '') {
				AdminAppDirect.registerProduct(key, function(result, e) {
					if(result && result.success){
						MixkyApp.showErrorMessage('注册码验证成功，系统已激活', '信息提示');
						btnCancel.execute();
						panel.refresh();
					}else{
						MixkyApp.showErrorMessage('系统注册码验证失败，请检查注册码是否正确', '错误提示');
					}
				});
			} else {
				MixkyApp.showErrorMessage('请输入产品注册码', '错误提示');
			}
		}
	});
    
	var form = new Ext.form.FormPanel({
		border : false,
		labelWidth : 80,
		width : 200,
		items : {
			xtype : 'fieldset',
			defaults : {border : false},
			bodyStyle : 'padding-top:' + (Ext.isIE ? 10 : 0) + 'px;',
			height : 200,
			labelAlign : 'top',
			items : [snField ,{
				bodyStyle : 'padding-left:' + (Ext.isIE ? 172 : 200) + 'px;',
				items : [btnGetKey]
			}, keyField]
		},
		buttons : [btnConfirm, btnCancel]
	});

	panel.add(form);
	panel.doLayout();

});
</script>