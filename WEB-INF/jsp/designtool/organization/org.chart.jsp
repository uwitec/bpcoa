<%@ page contentType="text/html; charset=utf-8"%>
<%
	String id = request.getParameter("id");
%>
<script language='javascript'>
Ext.onReady(function(){
	var id = '<%=id%>';

	// 获得对象的属性列表
	var module = Mixky.designtool.Class.getModule("dept");
	
	var panel = Ext.getCmp(id);
	panel.setTitle('组织结构图');

	// 合并属性
	var properties = {};
	for(var i=0;i<module.properties.length;i++){
		var p = module.properties[i];
		properties[p.name] = p;
	}

	var orgChartCt = new Ext.Panel({
         layout: 'border',
         defaults: {border: false},
         items: [{                            
             xtype: 'gvisualization',
             visualizationCfg: {allowHtml:true},
             directFn : OrganizationDirect.getOrgChartData,
             region: 'center',
             bodyStyle: 'padding: 30px;',
             visualizationPkg: 'orgchart',
             columns: ['name','pname']
         }]
     })

	
    
	// 刷新
	panel.refresh = function(){
		//store.load();
	}

	panel.add(orgChartCt);
	panel.doLayout();
});
</script>