<%@ page contentType="text/html; charset=utf-8"%>
<%
%>
<script language='javascript'>
Ext.onReady(function(){

	var panel = Ext.getCmp('pnl-attendance-time-config');

	var form = new Ext.form.FormPanel({
		autoScroll : true,
		layout:'form',
		border : false,
		labelWidth : 80,
		bodyStyle : "padding:10px;padding-left:0px;padding-right:23px",
		api : {
			load : AttendanceAppDirect.getWorkTime
			//submit : AttendanceAppDirect.saveWorkTime
		},
		items : [{
			anchor: '100%',
			fieldLabel : '上班时间',
			name: 'F_TIME_START',
			xtype: 'timefield',
			minValue: '06:00',
		    maxValue: '12:00',
		    format: 'H:i'
		}, {
			anchor: '100%',
			fieldLabel : '下班时间',
			name: 'F_TIME_END',
			xtype: 'timefield',
			minValue: '12:00',
		    maxValue: '20:00',
		    format: 'H:i'
		}]
	});

	panel.submit = function() {
		AttendanceAppDirect.saveWorkTime(form.getForm().findField("F_TIME_START").getValue(), form.getForm().findField("F_TIME_END").getValue());
	};

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