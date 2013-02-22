<%@page contentType="text/html; charset=utf-8"%>
<%@ page import="java.util.Map"%>
<%@page import="com.mixky.engine.document.Panel"%>
<%@page import="com.mixky.engine.document.Document"%>
<%@page import="com.mixky.engine.common.DesignObjectLoader"%>
<%@page import="com.mixky.engine.common.DesignObject"%>
<%@ page import="com.mixky.app.mkoa.regulations.RegulationManager"%>
<%
	String documentid = request.getParameter("documentid");
	String panelid = request.getParameter("panelid");
%>


<script lang='javascript'>
	Ext.onReady(function(){
		var panel = Ext.getCmp('<%=panelid%>');		

		var fp = new FlexPaperViewer(	
			 'dependences/flexpage/1.4.2/FlexPaperViewer',
			 panel.body.id, 
			 { 
				config : {
					SwfFile : 'app/mkoa/regulations/<%=documentid%>.swf',
					Scale : 1.5, 
					ZoomTransition : 'easeOut',
					ZoomTime : 0.5,
					ZoomInterval : 0.2,
					FitPageOnLoad : false,
					FitWidthOnLoad : false,
					PrintEnabled : false,
					FullScreenAsMaxWindow : false,
					ProgressiveLoading : false,
					MinZoomSize : 0.2,
					MaxZoomSize : 5,
					SearchMatchAll : false,
					InitViewMode : 'Portrait',
					
					ViewModeToolsVisible : false,
					ZoomToolsVisible : true,
					NavToolsVisible : true,
					CursorToolsVisible : false,
					SearchToolsVisible : false,
					localeChain: 'en_US'
			 	}
			}
		);

		// 输出附加脚本 end
		//panel.add(fckPanel);
		panel.doLayout();
		//form.doLayout();
		// 初始化视图数据
		panel.refresh();
		
	});
</script>