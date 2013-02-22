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
			var useflag = 0;
			if (form.getForm().findField("F_USE_FLAG").getValue() == true) {
				useflag = 1;
			}

			AppMailDirect.saveSignature(useflag, form.getForm().findField("F_SIGNATURE").getValue(), function(result, event) {
				if (result.success) {
					Ext.Msg.alert('信息提示', '签名设置完毕！');
				} else {
					Ext.Msg.alert('信息提示', '签名设置失败！');
				}
			});
		}
	});
	
	var buttons = ['->',btnSave];
	

	var form = new Ext.form.FormPanel({
		autoScroll : true,
		layout:'form',
		border : false,
		tbar : buttons,
		trackResetOnLoad : true,
		labelWidth: 40,
		fileUpload : true,
		bodyStyle : "padding:10px;padding-left:30px;padding-right:30px;",
		api : {
			load : AppMailDirect.loadSignature
		},
		items : [{
			xtype: 'checkbox',
			name: 'F_USE_FLAG',
			fieldLabel: '启用',
			inputValue: 1,
			uncheckedValue: 0
		}, {
			xtype: 'htmleditor',
			anchor: '100%',
			name: 'F_SIGNATURE',
			fieldLabel: '签名',
			fontFamilies : [
                'Sans-Serif',
                'Serif',
                'Arial Black',
                'Arial Narrow',
                'Comic Sans MS',
                'Courier New',
                'Garamond',
                'Georgia',
                'Tahoma',
                'Times New Roman',
                'Trebuchet MS',
                'Verdana'
            ],
			height:200
		}]
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