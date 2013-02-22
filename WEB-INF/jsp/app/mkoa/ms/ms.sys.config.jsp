<%@ page contentType="text/html; charset=utf-8"%>
<%@page import="com.mixky.mkoa.system.*"%>
<%
	String panelid = request.getParameter("panelid");
	String sn = ProductionKey.instant().getApplicationSN();;
%>
<script language='javascript'>
Ext.onReady(function(){
	var panel = Ext.getCmp('<%=panelid%>');

	// 保存按钮
	var btnSave = new Ext.Action({
		text : '保存',
		iconCls : 'icon-sys-save',
		handler : function(){
			msForm.getForm().submit({
				success : function(f,a){
					MixkyApp.showInfoMessage('系统短信参数设置成功！', '信息提示');
				},
				failure : function(f, a){
					MixkyApp.showErrorMessage('系统短信参数设置失败！', '错误提示');
				}
			});
		}
	});

	var btnRefresh = new Ext.Action({
		text : '重置',
		iconCls : 'icon-sys-refresh',
		handler : function(){
			panel.refresh();
		}
	});
	
	var msForm = new Ext.form.FormPanel({
		border : false,
		bodyStyle : 'padding:15px;padding-right:25px;',
		autoScroll : true,
		labelWidth : 100,
		api : {
			load : AppMsDirect.getSysConfig,
			submit : AppMsDirect.saveSysConfig
		},
		tbar:['->', btnSave, btnRefresh],
		items : {
            xtype:'fieldset',
            autoHeight:true,
    		width : 450,
			items : [{
				xtype: 'textfield',
				anchor: '100%',
				allowBlank : false,
				maxLength : 15,
				name: 'F_PASSWORD',
				fieldLabel: '短信发送密码'
			},{
				fieldLabel : '剩余短信条数',
				name : 'F_MSGS',
				xtype : 'mixkydisplayfield',
				anchor : '100%'
			},{
				border : false,
				html: '<a href="http://oa.mixky.cn/service/sms/buycard.do?sn=<%=sn%>" target="_blank">点击短信充值</a>'
			}],
			buttons : [btnSave, btnRefresh]
		}
	});

	panel.refresh = function(){
		msForm.getForm().load();
	}

	panel.add(msForm);
	panel.doLayout();
	panel.refresh();
	
});
</script>