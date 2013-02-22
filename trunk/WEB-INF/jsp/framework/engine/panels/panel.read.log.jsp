<%@ page language="java" contentType="text/html; charset=UTF-8"%>
<%@page import="java.util.List"%>
<%@page import="com.mixky.engine.organization.User"%>
<%@page import="com.mixky.engine.document.Document"%>
<%@page import="com.mixky.common.database.JsonObjectDao"%>
<%@page import="com.mixky.toolkit.DateUtil"%>
<%@page import="com.mixky.engine.workflow.WorkFlowDataService"%>
<%@page import="com.mixky.engine.workflow.instance.FlowLog"%>
<%@page import="com.mixky.engine.workflow.instance.NodeLog"%>
<%@page import="com.mixky.engine.workflow.instance.RouteLog"%>
<%@page import="com.mixky.engine.workflow.instance.ProcessLog"%>
<%@page import="com.mixky.engine.workflow.instance.OpinionLog"%>
<%@page import="com.garage.xtoolkit.Tools"%>
<%@page import="com.mixky.engine.todo.Messengar"%>
<%

	long documentid = Long.parseLong((String) request.getParameter("documentid"));
	String panelkey = request.getParameter("panelkey");
	
	List<User> users = Messengar.instance().getFinishedMessageUsers(documentid, panelkey.substring(0, panelkey.lastIndexOf(".")));
	StringBuffer bf = new StringBuffer();
	for (int i = 0; i < users.size(); i++) {
		User user = users.get(i);
		bf.append(user.getF_caption()).append(";");
	}
%>



<div style="padding:5px;">
	<table class="" cellpadding="6" cellspacing="1" border="0" width="100%" align="center">
	<tbody class="x-forum-home-smallfont" >
	 <tr>
	 	<td style="padding-top:5px;">
	       <font style="color:#175c9e;">已阅人员：</font><%=bf.toString()%>
	 	</td>
	 </tr>
	</tbody>
	</table>
</div>
