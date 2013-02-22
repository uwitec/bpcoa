<%@page contentType="text/html; charset=utf-8"%>
<%@ page import="java.util.Map"%>
<%@page import="com.mixky.engine.document.Panel"%>
<%@page import="com.mixky.engine.document.Document"%>
<%@page import="com.mixky.engine.common.DesignObjectLoader"%>
<%@page import="com.mixky.engine.common.DesignObject"%>
<%@ page import="com.mixky.engine.document.ObjectAuthority"%>
<%
	String documentid = request.getParameter("documentid");
	String panelid = request.getParameter("panelid");

	Map<String, ObjectAuthority> map = (Map<String, ObjectAuthority>)request.getAttribute("authmap");

	Panel panel = (Panel)request.getAttribute("panel");
	
	ObjectAuthority panelauth = map.get(panel.getKey());
	
	String tablename = panel.getF_config().get("tablename").getAsString();
	String fieldname = panel.getF_config().get("fieldname").getAsString();
	
	boolean editable = panelauth.hasAuth(ObjectAuthority.A_EDIT);
%>


<script lang='javascript'>
	Ext.onReady(function(){
		var editable = <%=editable%>;
		var panel = Ext.getCmp('<%=panelid%>');		

		var fckPanel = new Ext.form.FormPanel({
			autoScroll : true,
			layout:'form',
			border : false,
			items : [{
				xtype:'<%=editable ? "htmleditor" : "displayfield"%>',
				anchor:"99% 99%",
				name:"F_CONTENT",
				hideLabel:true
			}]
		});	

		
		panel.submit = function(fn){
			if(editable){
				DocumentAppDirect.setClobContext("<%=tablename%>", "<%=fieldname%>", <%=documentid%>, fckPanel.getForm().findField("F_CONTENT").getValue(), function(result, e){
					if(result && result.success){
						panel.document.submitPanelOver(panel, fn);
					}else{
						MixkyApp.showDirectActionFail("保存文本内容", result, e);
					}
				});
			}else{
				panel.document.submitPanelOver(panel, fn);
			}
		}

		panel.refresh = function(){
			// 此处获得内容
			DocumentAppDirect.getClobContext("<%=tablename%>", "<%=fieldname%>", <%=documentid%>, function(result, e){
				if(result && result.success){
					var content = fckPanel.getForm().findField("F_CONTENT").setValue(result.context);
				}else{
					MixkyApp.showDirectActionFail("获得文本内容", result, e);
				}
			});
		}

		// 输出附加脚本 end
		panel.add(fckPanel);
		panel.doLayout();
		//form.doLayout();
		// 初始化视图数据
		panel.refresh();
		
	});
</script>