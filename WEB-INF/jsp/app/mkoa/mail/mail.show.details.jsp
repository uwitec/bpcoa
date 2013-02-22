<%@ page contentType="text/html; charset=utf-8"%>
<%@page import="com.mixky.app.mkoa.mail.Mail"%>
<%@page import="com.mixky.app.mkoa.mail.MailManager"%>
<%@page import="javax.mail.internet.MimeMessage"%>
<%@page import="com.mixky.app.mkoa.mail.util.MessageUtil"%>
<%@page import="java.util.List"%>
<%@page import="java.util.ArrayList"%>
<%@page import="com.mixky.app.mkoa.mail.MailPart"%>
<%@page import="com.mixky.system.ContextHolder"%>
<%@page import="com.garage.xtoolkit.HTMLHelper"%>
<%@page import="com.mixky.toolkit.DateUtil"%>
<%@page import="com.mixky.app.mkoa.mail.util.MailUtility"%>

<%
	String id = request.getParameter("id");
	String panelid = request.getParameter("panelid");
	
	Mail mail = MailManager.instance().getMailById(Long.parseLong(id));
	MimeMessage msg = MessageUtil.getMsgByMailObj(mail);
	
	if (msg != null) {	
		
		List<MailPart> emailList = new ArrayList<MailPart>();
		List<MailPart> attList = new ArrayList<MailPart>();
		List<MailPart> imgList = new ArrayList<MailPart>();
		
		String mailFilePath = ContextHolder.instance().getRealPath("WEB-INF/mailtmp");
		String mailFileURL = "mailtmp";
		MessageUtil.fetchParts(msg, mailFilePath, emailList, attList, imgList);
		//MessageUtil.parseImgPath(emailList, imgList, mailFileURL);
	
%>

<DIV id='<%=panelid%>-table'>
<input type=hidden id='<%=panelid%>-maildetail' value='<%=MessageUtil.getMailHead(msg)%>'>
<input type=hidden id='<%=panelid%>-emllocation' value='<%=mail.getF_location()%>'>
<input type=hidden id='<%=panelid%>-emlname' value='<%=mail.getF_subject() + ".eml"%>'>
<TABLE cellSpacing=0 cellPadding=0 align=center bgColor=white width=100% height=100% >
	<TR style="HEIGHT: 6px" height=6>
		<TD vAlign=top background='resources/images/report/t_l.gif'></TD>
		<TD vAlign=top background='resources/images/report/t_z.gif'></TD>
		<TD vAlign=top background='resources/images/report/t_y.gif'></TD>
	<TR>
		<TD vAlign=top width=2 background='resources/images/report/b_l.gif'></TD>
		<TD style="padding:20px;padding-top:0px">
		
			<TABLE  cellSpacing=0 cellPadding=0 width=100% height=100% style='font-size:13px;'>
				<tr><td colspan=2 height="10"></td></tr>
				<TR>
					<TD width=60 style='font-size:12px;'>
						发件人：
					</TD>
					<TD style='font-size:12px;'>
						<%=HTMLHelper.encode(MessageUtil.decodeString(MessageUtil.addressArrToString(msg.getFrom())))%>　<a href="#" onclick="AddressBookAppDirect.isMailFromExist('<%=HTMLHelper.encode(MessageUtil.decodeString(MessageUtil.addressArrToString(msg.getFrom())))%>', function(result, event) {if (result.success) { MixkyApp.desktop.openDocument('mkAddressBook.docNameCard', 0, {F_NAME:result.name, F_EMAIL: result.email}); } else {MixkyApp.showInfoMessage('发件人已个人通讯录中', '信息提示');}})">添加到个人通讯录</a>
					</TD>
				</TR>
				<TR>
					<TD width=60 style='font-size:12px;'>
						发送至：
					</TD>
					<TD style='font-size:12px;'><textarea readonly=true style='width:100%;text-align:left'>
						<%=HTMLHelper.encode(MessageUtil.getValueByHeader(msg, "TO"))%></textarea>
					</TD>
				</TR>
				
<%
	if (MessageUtil.getValueByHeader(msg, "CC").length() > 0) {
%>  
				<TR>
					<TD width=60 style='font-size:12px;'>
						抄送：
					</TD>
					<TD style='font-size:12px;'>
						<%=HTMLHelper.encode(MessageUtil.getValueByHeader(msg, "CC"))%>
					</TD>
				</TR>
<%
	}
%>

				<TR>
					<TD width=60 style='font-size:12px;'>
						日　期：
					</TD>
					<TD style='font-size:12px;'>
						<%=DateUtil.format(mail.getF_date_received(), DateUtil.FORMAT_DATETIME)%>
					</TD>
				</TR>
				<TR>
					<TD width=60 style='font-size:12px;'>
						主　题：
					</TD>
					<TD style='font-size:12px;'>
						<%=msg.getSubject() == null ? "" : MessageUtil.decodeString(msg.getSubject())%> 
					</TD>
				</TR>
				<TR>
					<TD width=60 style='font-size:12px;'>
						附　件：
					</TD>
					<TD style='font-size:12px;'>
<%
		for (int i = 0; i < attList.size(); i++) {
			MailPart attPart = (MailPart) attList.get(i);
			String fileUrl = "mkoa/mail/mailfile.download.do?filename=" + attPart.getFileName() + "&filelocation=" + attPart.getFilePath();
%>

						<%="<a href=\"" + fileUrl + "\">" + attPart.getFileName() + "</a>&nbsp;&nbsp;&nbsp;&nbsp;"%>		
<%			
		}
%>					
					</TD>
				</TR>
				<tr><td colspan=2 height="10"></td></tr>
				<tr><td colspan=2 height="1" bgcolor="#d6d6d6"></td></tr>
				<tr><td colspan=2 height="10"></td></tr>
				<tr><td colspan=2 height=100% valign=top>
<%
		if (emailList.size() > 0) {
			String strangeContent = null;
			if (emailList.size() > 2) {
				MailPart strangePart = (MailPart) emailList.get(0);
				strangeContent = strangePart.getContent();
			}
			MailPart contentPart = (MailPart) emailList.get(emailList.size() - 1);
			if (contentPart.getContentType().startsWith("text/html")) {
%>
				<%=contentPart.getContent()%>	
<% 
			} else {
%>
					<%=strangeContent == null ? MailUtility.getHtmlString(contentPart.getContent()) : MailUtility.getHtmlString(strangeContent)%>	
<%
			}
		}
%>			

				<br/><br/>
				
<%
		for (int i = 0; i < attList.size(); i++) {
			MailPart attPart = (MailPart) attList.get(i);
			if (attPart.getContentType().toLowerCase().startsWith("image")) {
				String fileUrl = "mkoa/mail/mailfile.download.do?filetype=image&filename=" + attPart.getFileName() + "&filelocation=" + attPart.getFilePath();
%>
				<image title="<%=attPart.getFileName()%>" src="<%=fileUrl%>" class="mixky-detail-image"/><br/>
				<%="<a href=\"" + fileUrl + "\">" + attPart.getFileName() + "</a><br/><br/>"%>
<%		
			}
		}
%>				
				
				</td></tr>
			</TABLE>
			
		</TD>
		<TD vAlign=top width=3 background='resources/images/report/b_y.gif'></TD>
	</TR>
	<TR style="HEIGHT: 7px" height=7>
		<TD vAlign=top background='resources/images/report/d_l.gif'></TD>
		<TD vAlign=top background='resources/images/report/d_z.gif'></TD>
		<TD vAlign=top background='resources/images/report/d_y.gif'></TD>
	</TR>
</TABLE>
</DIV>

<% 
	} else {
%>
<DIV id='<%=panelid%>-table'>
<TABLE cellSpacing=0 cellPadding=0 align=center bgColor=white width=100% height=100% >
	<TR style="HEIGHT: 6px" height=6>
		<TD vAlign=top background='resources/images/report/t_l.gif'></TD>
		<TD vAlign=top background='resources/images/report/t_z.gif'></TD>
		<TD vAlign=top background='resources/images/report/t_y.gif'></TD>
	<TR>
		<TD vAlign=top width=2 background='resources/images/report/b_l.gif'></TD>
		<TD style="padding:20px;padding-top:0px">
			<TABLE  cellSpacing=0 cellPadding=0 width=100% height=100% style='font-size:13px;'>
				<tr><td  height=100% valign=top>
					邮件解析失败！
				</td></tr>
			</TABLE>
		</TD>
		<TD vAlign=top width=3 background='resources/images/report/b_y.gif'></TD>
	</TR>
	<TR style="HEIGHT: 7px" height=7>
		<TD vAlign=top background='resources/images/report/d_l.gif'></TD>
		<TD vAlign=top background='resources/images/report/d_z.gif'></TD>
		<TD vAlign=top background='resources/images/report/d_y.gif'></TD>
	</TR>
</TABLE>
</DIV>
<%		
	}
%>