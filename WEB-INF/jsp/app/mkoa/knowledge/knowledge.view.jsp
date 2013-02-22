<%@ page contentType="text/html; charset=utf-8"%>
<%
	String panelid = request.getParameter("panelid");
%>
<script language='javascript'>
Ext.onReady(function(){

	var panel = Ext.getCmp('<%=panelid%>');
	var win = panel.findParentByType('window');

	var p = new Ext.Panel({
	    layout:'column',
	    border : false,
		autoScroll : true,
	    items: [{
	    	border : false,
	    	bodyStyle : 'padding: 10px',
	        columnWidth: .5
	    },{
	    	border : false,
	    	bodyStyle : 'padding: 10px',
	    	columnWidth: .5 
	    }]
	});

	var topKPanel = addKpanel(p, {
		key: 'mkKnowledge.dpTopKnowledge',
		text: '推荐知识',
		iconCls: '',
		webheight: 300
	}, 0);

	var newKPanel = addKpanel(p, {
		key: 'mkKnowledge.dpHotKnowledge',
		text: '热点知识',
		iconCls: '',
		webheight: 300
	}, 0);

	var newKPanel = addKpanel(p, {
		key: 'mkKnowledge.dpCommentKnowledge',
		text: '评论最多的知识',
		iconCls: '',
		webheight: 300
	}, 1);
	
	var newKPanel = addKpanel(p, {
		key: 'mkKnowledge.dpHighKnowledge',
		text: '评价最高的知识',
		iconCls: '',
		webheight: 300
	}, 1);

	// extend method
	function addKpanel(kPanel, o, col){
		var panel = Ext.getCmp('k-portlet-' + o.key);
		if (panel) {
			panel.destroy();
		}
		//if(!panel){
			//var col = Ext.isDefined(o.col) ? o.col : this.getMinHeightCol();
			panel = new Ext.Panel({
				id : 'k-portlet-' + o.key,
	    		title : o.text,
	    		layout : 'fit',
	    		iconCls : o.iconCls,
	    		height : o.webheight,
	    		cls : 'x-portlet',
				tools : [{
					id : 'refresh',
					handler : function(){
						panel.refresh();
					},
					qtip : "刷新栏目内容"
				}],
				autoLoad : {
					url : "portlet.do",
					params : {key : o.key, customPanelId : 'k-portlet-' + o.key},
					scripts : true
				},
				refresh : function(){
					panel.doAutoLoad();
				}
	    	});
			kPanel.items.get(col).add(panel);
			kPanel.doLayout();
			panel.key = o.key;
		//}
		return panel;
	}

	// 视图刷新
	panel.refresh = function(params){
	};
	
	// 输出附加脚本 end
	panel.add(p);
	panel.doLayout();
	// 初始化视图数据
	//panel.refresh(panel.initParams);
});
</script>