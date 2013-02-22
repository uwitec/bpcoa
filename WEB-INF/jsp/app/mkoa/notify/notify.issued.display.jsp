<%@ page language="java" contentType="text/html; charset=UTF-8"%>
<%@page import="com.mixky.app.mkoa.notify.NotifyObject"%>
<%@page import="com.garage.xtoolkit.Tools"%>
<%@page import="java.util.List"%>
<%@page import="com.mixky.engine.mkfiles.MkFile"%>
<%@page import="com.mixky.engine.mkfiles.MkFileManager"%>

<%
	long documentid = Long.parseLong(request.getParameter("documentid"));
	NotifyObject notify = new NotifyObject();
	notify.setId(documentid);
	notify.load();
	
	List<MkFile> files = MkFileManager.instance().getDocumentFiles(documentid, "mkNotify.docNotify", "F_FILE");
%>

<TABLE style="background-color:darkgray;height:100%;width:100%">
	<TR>
		<TD vAlign=top style="padding:15px;">

<TABLE cellSpacing=0 cellPadding=0 align=center bgColor=white height='100%' width="100%">
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
					<div class="x-knowledge-thread-title"><b><%=notify.getF_title()%></b></div>
					<div class="x-knowledge-thread-tag"><br><b><%=notify.getF_issue_dept()%>　　<%=notify.getF_issue_user()%>　　<%=Tools.getDateFull(notify.getF_issue_date(), "yyyy-MM-dd")%></b></div>
				</td>
			</tr>
			<tr>
				<td vAlign=top>
					<div><%=notify.getF_content()%></div>
				</td>
			</tr>
			<tr>
				<td>
<%
	for (int i = 0; i < files.size(); i++) {
		MkFile file = files.get(i);
%>

					<div class="x-forum-thread-attach">
<% 
	if (file.isImage()) {
%>
				<image title="<%=file.getF_filename()%>" src="engine/file/sysdownload.do?tablename=T_MK_SYS_FILES&fieldname=F_CONTENT&id=<%=file.getId()%>&filename=<%=file.getF_filename()%>" class="mixky-detail-image"/><br/>
		
<%
	}
%>
						<img class="function-file-download" src="resources/images/app/forum/attach.png" style="cursor:pointer"></img>
						<a class="x-forum-thread-attach-link" href='engine/file/sysdownload.do?id=<%=file.getId()%>&documentdbtype=none&fieldname=F_FILE&&documentkey=mkNotify.docNotify'><%=file.getF_filename()%></a>
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

		</TD>
	</TR>
</TABLE>