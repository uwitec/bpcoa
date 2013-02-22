<%@ page language="java" contentType="text/html; charset=UTF-8"%>
<%@page import="com.mixky.app.mkoa.notify.NotifyObject"%>
<%@page import="com.garage.xtoolkit.Tools"%>
<%@page import="com.mixky.engine.attachment.AttachmentManager"%>
<%@page import="java.util.List"%>
<%@page import="com.mixky.engine.attachment.Attachment"%>
<%@page import="com.mixky.app.mkoa.workreport.WorkReport"%>
<%@page import="com.mixky.app.mkoa.workreport.WorkReportComment"%>
<%@page import="com.mixky.engine.organization.User"%>
<%@page import="com.mixky.system.ContextHolder"%>
<%@page import="com.mixky.engine.todo.Messengar"%>
<%@page import="com.mixky.engine.todo.Message"%>
<%@page import="com.mixky.toolkit.DateUtil"%>
<%
	long documentid = Long.parseLong(request.getParameter("id"));
	WorkReport report = new WorkReport();
	report.setId(documentid);
	report.load();
	
	User user = ContextHolder.instance().getUserCertification().getUserInfo(request);
	Messengar.instance().doneMessage("工作简报", report.getId(), Message.MESSAGE_READ, user.getId());
	
	List<Attachment> files = AttachmentManager.instance().getDocumentFiles(documentid, "mkWorkReport.docWorkReport", "F_FILE");
	List<WorkReportComment> comments = report.getReportComments();
%>



<script language="javascript">
	function refreshWindow() {
		var winEl = Ext.getCmp('docWorkReport<%=documentid%>');
		winEl.load({
			url: 'page.do',
			params : {
				url: 'app/mkoa/workreport/workreport.display',
				id: <%=documentid%>
			}
		});
	}

	function submitPf() {
		var pf = Ext.get('pf_msg_<%=documentid%>');
		Ext.Ajax.request({
			url: 'page.do',
			success: function(response, options) {
				refreshWindow();
			},
			params: {
				url: 'app/mkoa/workreport/workreport.comment',
				pf_msg: pf.getValue(),
				reportid: '<%=documentid%>'
			}
		});
	}
</script>
<div style="height:100%;width:100%;">
<div style="background-color:darkgray; height:80%;width:100%; overflow: scroll;">
<TABLE style="background-color:darkgray;width:100%" height="100%">
	<TR>
		<TD vAlign=top style="padding:15px;">

	<TABLE cellSpacing=0 cellPadding=0 align=center bgColor=white width="100%" height="90%">
	<TR style="HEIGHT: 2px">
		<TD vAlign=top background='resources/images/report/t_l.gif'></TD>
		<TD vAlign=top background='resources/images/report/t_z.gif'></TD>
		<TD vAlign=top background='resources/images/report/t_y.gif'></TD>
	<TR>
		<TD vAlign=top style='width:2px' background='resources/images/report/b_l.gif'></TD>
		<TD vAlign=top>

	<table width="100%">
		<tbody width="100%">
			<tr width="100%">
				<td align=center width="100%">
					<div class="x-knowledge-thread-title"><b><%=report.getF_title()%></b></div>
					<div class="x-knowledge-thread-tag"><br><b><%=report.getF_creator_dept()%>　　<%=report.getF_creator_name()%>　　<%=DateUtil.format(report.getF_create_time(), DateUtil.FORMAT_DATETIME)%></b></div>
				</td>
			</tr>
			<tr>
				<td vAlign=top>
					<div><%=report.getF_content()%></div>
				</td>
			</tr>
			
<%
	if (report.getF_scops().length() > 0) {
%>
			<tr>
				<td>
					<div  class="x-forum-thread-attach">发布范围：<%=report.getF_scops()%></div>
				</td>
			</tr>
<%
	}
%>
			<tr>
				<td>
<%
	for (int i = 0; i < files.size(); i++) {
		Attachment file = files.get(i);
%>

					<div class="x-forum-thread-attach">
						<img class="function-file-download" src="resources/images/app/forum/attach.png" style="cursor:pointer"></img>
						<a class="x-forum-thread-attach-link" href='engine/file/sysdownload.do?id=<%=file.getId()%>&documentdbtype=none&fieldname=F_FILE&&documentkey=mkWorkReport.docWorkReport'><%=file.getF_filename()%></a>
					</div>
<%
	}
%>
					<div class="x-forum-thread-attach"></div>
				</td>
			</tr>
		</tbody>
	</table>
		</TD>
		<TD vAlign=top style='width:3px' background='resources/images/report/b_y.gif'></TD>
	</TR>
	
	
	
	
	
	
	
	<TR style="HEIGHT: 7px">
		<TD vAlign=top background='resources/images/report/d_l.gif'></TD>
		<TD vAlign=top background='resources/images/report/d_z.gif'></TD>
		<TD vAlign=top background='resources/images/report/d_y.gif'></TD>
	</TR>
</TABLE>

<%
	for (int i = 0; i < comments.size(); i++) {
		WorkReportComment comment = comments.get(i);
%>
<br/>
	<TABLE cellSpacing=0 cellPadding=0 align=center bgColor=white width="100%">
	<TR style="HEIGHT: 2px">
		<TD vAlign=top background='resources/images/report/t_l.gif'></TD>
		<TD vAlign=top background='resources/images/report/t_z.gif'></TD>
		<TD vAlign=top background='resources/images/report/t_y.gif'></TD>
	<TR>
		<TD vAlign=top style='width:2px' background='resources/images/report/b_l.gif'></TD>
		<TD vAlign=top>

	<table width="100%">
		<tbody width="100%">
			<tr width="100%">
				<td align=left width="100%">
					<div class="x-knowledge-thread-tag"><br><b><%=comment.getF_creator_name()%>　　<%=DateUtil.format(comment.getF_create_time(), DateUtil.FORMAT_DATETIME)%></b></div>
				</td>
			</tr>
			<tr>
				<td vAlign=top>
					<div><%=comment.getF_content()%></div>
				</td>
			</tr>
		</tbody>
	</table>
		</TD>
		<TD vAlign=top style='width:3px' background='resources/images/report/b_y.gif'></TD>
	</TR>
	<TR style="HEIGHT: 7px">
		<TD vAlign=top background='resources/images/report/d_l.gif'></TD>
		<TD vAlign=top background='resources/images/report/d_z.gif'></TD>
		<TD vAlign=top background='resources/images/report/d_y.gif'></TD>
	</TR>
</TABLE>

<%
	}
%>
		</TD>
	</TR>
</TABLE>
</div>
<div style="position:relative; bottom:100px; width:100%;height:20%;">
	<TABLE vAlign=bottom cellSpacing=0 cellPadding=0 align=center bgColor=white height=100%  width="100%">
	<TR style="HEIGHT: 2px">
		<TD vAlign=top background='resources/images/report/t_l.gif'></TD>
		<TD vAlign=top background='resources/images/report/t_z.gif'></TD>
		<TD vAlign=top background='resources/images/report/t_y.gif'></TD>
	<TR>
		<TD vAlign=top style='width:2px' background='resources/images/report/b_l.gif'></TD>
		<TD vAlign=top>

	<table width="100%">
		<tbody width="100%">
			<tr width="100%">
				<td align=left width="100%">
					<div class="x-knowledge-thread-tag"><br><b>批复简报：</b></div>
				</td>
			</tr>
			<tr>
				<td vAlign=top>
					<div>
						<TEXTAREA id="pf_msg_<%=documentid%>" style="width:100%;height:80%"></TEXTAREA>
					</div>
					<div align=right>
						<INPUT TYPE="button" NAME="title" style="width:60;background-color:#ffffff;" value="确定" onclick='submitPf();'>&nbsp;
						<INPUT TYPE="button" NAME="title" style="width:60;background-color:#ffffff;" value="刷新" onclick='refreshWindow();'>
					</div>
				</td>
			</tr>
		</tbody>
	</table>
		</TD>
		<TD vAlign=top style='width:3px' background='resources/images/report/b_y.gif'></TD>
	</TR>
	<TR style="HEIGHT: 7px">
		<TD vAlign=top background='resources/images/report/d_l.gif'></TD>
		<TD vAlign=top background='resources/images/report/d_z.gif'></TD>
		<TD vAlign=top background='resources/images/report/d_y.gif'></TD>
	</TR>
</TABLE>
</div>
</div>

