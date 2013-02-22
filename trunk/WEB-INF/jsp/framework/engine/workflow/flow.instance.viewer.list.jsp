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
<%
	Object obj = request.getAttribute("document");
	Document document = null;
	JsonObjectDao jdata = null;
	User user = (User)request.getAttribute("user");
	if (obj != null) {
		document = (Document)obj;
	}
	obj = request.getAttribute("data");
	if (obj != null) {
		jdata = (JsonObjectDao)obj;
	}
	long flowlogId = 0;
	if(jdata.getJsonObject().has("F_FLOWLOGID") && !jdata.getJsonObject().get("F_FLOWLOGID").isJsonNull()){
		flowlogId = jdata.getJsonObject().get("F_FLOWLOGID").getAsLong();
	}
	if(flowlogId > 0){
		FlowLog flog = WorkFlowDataService.instance().getFlowLog(flowlogId);
		List<NodeLog> nlogs = WorkFlowDataService.instance().getNodeLogs(flowlogId, null, -1);
%>


<html>
<head>
<title>流程实例查看</title>
</head>
<style>
</style>
<body>
<div style="padding:5px;">
	<table class="" cellpadding="6" cellspacing="1" border="0" width="100%" align="center">
	<tbody class="x-forum-home-smallfont" >
	 <tr>
	 	<td style="padding-top:5px;">
	       <font style="color:#175c9e;">流程标题：</font><%=flog.getF_flow_caption()%>
	 	</td>
	 </tr>
	 <tr>
	 	<td style="padding-top:5px;">
	 	<font style="color:#175c9e;">启 动 者： </font><%=flog.getF_start_user_name()%>
	 	</td>
	 </tr>
	 <tr>
	 	<td style="padding-top:5px;">
	 	<font style="color:#175c9e;">启动时间：</font><%=DateUtil.formatDate(flog.getF_start_time(), DateUtil.FORMAT_SDATETIME)%>
	 	</td>
	 </tr>
	 <tr>
	 	<td style="padding-top:5px;">
	 <font style="color:#175c9e;">办理状态：</font><%=flog.getF_process_describe()%>
		</td>
	</tr>
	<tr>
	 	<td style="padding-top:5px;">
	 <font style="color:#175c9e;">办 理 人： </font><%=flog.getF_processor()%>
		</td>
	</tr>
	</tbody>
	</table>
	<br/>
	<table class="x-forum-home-tborder" cellpadding="6" cellspacing="1" border="0"  align="center" width="100%">
<!--	 <tr><td colspan=6 class="flowviewer">-->
<!--	 </td></tr>-->
	<tbody>
	 <tr>
	  <td class="x-forum-home-thead" width="50">节点名称</td>
	  <td class="x-forum-home-thead" width="50">开始时间</td>
	  <td class="x-forum-home-thead" width="50">完成时间</td>
	  <td class="x-forum-home-thead" width="50">办理人</td>
	  <td class="x-forum-home-thead" width="50">操作</td>
	  <td class="x-forum-home-thead" width="50">办理状态</td>
	  <td class="x-forum-home-thead" >办理意见</td>
	 </tr>
	 </tbody>
	 <tbody class="x-forum-home-smallfont">
<%
	if (nlogs != null && nlogs.size() > 0) {
		// 按节点实例顺序输出
		for (int i = 0; i < nlogs.size(); i++) {
			NodeLog nlog = nlogs.get(i);
			List<ProcessLog> plogs = nlog.getProcessLogs();
			if (plogs != null && plogs.size() > 0) {
				for (int j = 0; j < plogs.size(); j++) {
					%>
	<tr>
				<%
					ProcessLog plog = plogs.get(j);
					
					List<OpinionLog> ologs = WorkFlowDataService.instance().getOpinionLogs(flowlogId, nlog.getId(), plog.getId(), user.getId(), null, OpinionLog.F_WF_OPININO);
					StringBuffer opinion = new StringBuffer();
					opinion.append("&nbsp;");
					for (int k = 0; k < ologs.size(); k++) {
						//OpinionLog olog = WorkFlowDataService.instance().getOpinionLog(flowlogId, nlog.getId(), plog.getId(), user.getId(), null);
						OpinionLog olog = ologs.get(k);
						if (olog != null) {
							opinion.append(olog.getDisplayOpinion());
						}
					}
					
					String startTime = DateUtil.format(plog.getF_start_time(), DateUtil.FORMAT_SDATETIME);
					String endTime = DateUtil.format(plog.getF_end_time(), DateUtil.FORMAT_SDATETIME);
					if (startTime == null || startTime.equals("")) {
						startTime = "&nbsp;";
					}
					if (endTime == null || endTime.equals("")) {
						endTime = "&nbsp;";
					}
					
					
					if (plogs.size() > 1 && j == 0) {
				%>
	 <td rowspan=<%=plogs.size()%> class="x-forum-home-alt2" nowrap><%=nlog.getF_node_caption()%></td>
				<%
					} else if (plogs.size() == 1){
				%>
	 <td class="x-forum-home-alt2" nowrap><%=nlog.getF_node_caption()%></td>
				<%
					}
				%>
	 <td class="x-forum-home-alt2" nowrap><%=startTime%></td>
	 <td class="x-forum-home-alt2" nowrap><%=endTime%></td>
	 <td class="x-forum-home-alt2"><%=plog.getF_user_name()%></td>
	 <td class="x-forum-home-alt2" nowrap><%=plog.getActionStr()%></td>
	 <td class="x-forum-home-alt2" nowrap><%=plog.getStateStr()%></td>
	 <td class="x-forum-home-alt2"><%=opinion.toString()%></td>
				<%
				}
			} else {
				// 无节点办理实例
			}
%>
	</tr>
<%
		}
	} else {
		// 无节点实例
	}
%>
	</tbody>
	</table>
</div>
</body>
</html>
<%
	}
%>