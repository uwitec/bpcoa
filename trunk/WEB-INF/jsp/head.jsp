<%@page contentType="text/html; charset=utf-8"%>
<%
	String applicationName = String.valueOf(request.getAttribute("applicationName"));
	String loginUserName = String.valueOf(request.getAttribute("f_name"));
	String loginUserDeptName = String.valueOf(request.getAttribute("f_dept"));
%>
<table width=100% style="color:white;font-size:18px;">
	<tr>
		<td width=100% valign="middle">
			<img src="resources/images/logo/32.gif" height=24 border=0 align="absmiddle"> <b><%=applicationName%></b>
		</td>
		<td width=200 align='right' valign="middle" nowrap style="color:yellow;font-size:12px">
			<img src='resources/images/user.gif' border=0 align="absmiddle"> <%=loginUserName%>(<%=loginUserDeptName%>)
		</td>
	</tr>
</table>