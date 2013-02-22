<%@ page contentType="text/html; charset=utf-8"%>

<%
	String panelid = request.getParameter("panelid");
%>
<script language='javascript'>
Ext.onReady(function(){

	var panel = Ext.getCmp('<%=panelid%>');

	// 保存按钮
	var btnSave = new Ext.Action({
		text : '保存',
		iconCls : 'icon-sys-save',
		handler : function(){
			form.getForm().submit({
				success : function(f,a){
					MixkyApp.showInfoMessage('短信参数设置成功！', '信息提示');
				},
				failure : function(f, a){
					MixkyApp.showErrorMessage('短信参数设置失败！', '错误提示');
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
	
	var buttons = ['->', btnSave, '-', btnRefresh];

	var store = new Ext.data.ArrayStore({
	    fields: ['value', 'display'],
	    data: [
	   		[0, '不接收系统待办短信'],
			[2, '总是接收系统短信']
		]
	});
	

	var form = new Ext.form.FormPanel({
		autoScroll : true,
		layout:'form',
		border : false,
		tbar : buttons,
		trackResetOnLoad : true,
		labelWidth: 100,
		bodyStyle : "padding:10px;padding-left:30px;padding-right:30px;",
		api : {
			load : AppMsDirect.loadUserConfig,
			submit: AppMsDirect.saveUserConfig
		},
		items : {
            xtype:'fieldset',
            autoHeight:true,
    		width : 450,
            items : [{
				xtype: 'textfield',
				anchor: '100%',
				name: 'F_PHONE',
				fieldLabel: '手机号码'
			},{
				xtype: 'mixkyradiogroup',
				name: 'F_RECEIVE_TYPE',
				fieldLabel: '系统短信接收',
				columns: 1,
				store: store
			}],
			buttons : [btnSave, btnRefresh]
		}
	});

	// 视图刷新
	panel.refresh = function(){
		form.getForm().load();
	};
	
	// 输出附加脚本 end
	panel.add(form);
	panel.doLayout();
	// 初始化视图数据
	panel.refresh();
});
</script>