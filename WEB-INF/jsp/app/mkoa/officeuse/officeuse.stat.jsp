<%@ page contentType="text/html; charset=utf-8"%>
<%
	String panelid = request.getParameter("panelid");
%>
<script language='javascript'>
Ext.onReady(function(){

	var panel = Ext.getCmp('<%=panelid%>');
	var win = panel.findParentByType('window');

	var statPanel = new Ext.Panel({
	    layout:'fit',
	    border : false,
		bodyCssClass : 'mixky-report-div',
		autoScroll : true
	});

	// 视图刷新
	panel.refresh = function(params){
		if(Ext.isDefined(params) || !Ext.isDefined(panel.mParams)){
			var mParams = Ext.apply({}, params);
			mParams.parentPanelId = statPanel.getId();
			mParams.panelid = '<%=panelid%>';
			if(mParams.isOut){
				mParams.url = 'app/mkoa/officeuse/officeuse.stat.out';
			}else{
				mParams.url = 'app/mkoa/officeuse/officeuse.stat.in';
			}
			panel.mParams = mParams;
		}
		statPanel.load({
			url : 'page.do',
			params : panel.mParams,
			scripts: true
		});
	};
	
	// 输出附加脚本 end
	panel.add(statPanel);
	panel.doLayout();
	// 初始化视图数据
	panel.refresh(panel.initParams);
});
</script>