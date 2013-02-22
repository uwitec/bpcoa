<%@ page contentType="text/html; charset=utf-8"%>
<%
	String panelid = request.getParameter("panelid");
%>
<script language='javascript'>
Ext.onReady(function(){
	var panelid = '<%=panelid%>';
	
	var panel = Ext.getCmp(panelid);

	var chart = new Ext.Panel({
         border : false,
         defaults: {border: false},
         items: [{                            
             xtype: 'gvisualization',
             visualizationCfg: {allowHtml:true},
             directFn : AdminAppDirect.getOranizationgChart,
             region: 'center',
             bodyStyle: 'padding: 30px;',
             visualizationPkg: 'orgchart',
             columns: ['name','pname']
         }]
     })

	panel.add(chart);
	panel.doLayout();
});
</script>