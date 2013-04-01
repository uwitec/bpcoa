/*
 * Generated by the Jasper component of Apache Tomcat
 * Version: Apache Tomcat/7.0.34
 * Generated at: 2013-01-29 06:19:49 UTC
 * Note: The last modified time of this file was set to
 *       the last modified time of the source file after
 *       generation to assist with modification tracking.
 */
package org.apache.jsp.WEB_002dINF.jsp.app.mkoa.notify;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;
import com.mixky.app.mkoa.notify.NotifyObject;
import com.garage.xtoolkit.Tools;
import java.util.List;
import com.mixky.engine.mkfiles.MkFile;
import com.mixky.engine.mkfiles.MkFileManager;

public final class notify_issued_display_jsp extends org.apache.jasper.runtime.HttpJspBase
    implements org.apache.jasper.runtime.JspSourceDependent {

  private static final javax.servlet.jsp.JspFactory _jspxFactory =
          javax.servlet.jsp.JspFactory.getDefaultFactory();

  private static java.util.Map<java.lang.String,java.lang.Long> _jspx_dependants;

  private javax.el.ExpressionFactory _el_expressionfactory;
  private org.apache.tomcat.InstanceManager _jsp_instancemanager;

  public java.util.Map<java.lang.String,java.lang.Long> getDependants() {
    return _jspx_dependants;
  }

  public void _jspInit() {
    _el_expressionfactory = _jspxFactory.getJspApplicationContext(getServletConfig().getServletContext()).getExpressionFactory();
    _jsp_instancemanager = org.apache.jasper.runtime.InstanceManagerFactory.getInstanceManager(getServletConfig());
  }

  public void _jspDestroy() {
  }

  public void _jspService(final javax.servlet.http.HttpServletRequest request, final javax.servlet.http.HttpServletResponse response)
        throws java.io.IOException, javax.servlet.ServletException {

    final javax.servlet.jsp.PageContext pageContext;
    javax.servlet.http.HttpSession session = null;
    final javax.servlet.ServletContext application;
    final javax.servlet.ServletConfig config;
    javax.servlet.jsp.JspWriter out = null;
    final java.lang.Object page = this;
    javax.servlet.jsp.JspWriter _jspx_out = null;
    javax.servlet.jsp.PageContext _jspx_page_context = null;


    try {
      response.setContentType("text/html; charset=UTF-8");
      pageContext = _jspxFactory.getPageContext(this, request, response,
      			null, true, 8192, true);
      _jspx_page_context = pageContext;
      application = pageContext.getServletContext();
      config = pageContext.getServletConfig();
      session = pageContext.getSession();
      out = pageContext.getOut();
      _jspx_out = out;

      out.write("\r\n");
      out.write("\r\n");
      out.write("\r\n");
      out.write("\r\n");
      out.write("\r\n");
      out.write("\r\n");
      out.write("\r\n");

	long documentid = Long.parseLong(request.getParameter("documentid"));
	NotifyObject notify = new NotifyObject();
	notify.setId(documentid);
	notify.load();
	
	List<MkFile> files = MkFileManager.instance().getDocumentFiles(documentid, "mkNotify.docNotify", "F_FILE");

      out.write("\r\n");
      out.write("\r\n");
      out.write("<TABLE style=\"background-color:darkgray;height:100%;width:100%\">\r\n");
      out.write("\t<TR>\r\n");
      out.write("\t\t<TD vAlign=top style=\"padding:15px;\">\r\n");
      out.write("\r\n");
      out.write("<TABLE cellSpacing=0 cellPadding=0 align=center bgColor=white height='100%' width=\"100%\">\r\n");
      out.write("\t<TR style=\"HEIGHT: 2px\">\r\n");
      out.write("\t\t<TD vAlign=top background='resources/images/report/t_l.gif'></TD>\r\n");
      out.write("\t\t<TD vAlign=top background='resources/images/report/t_z.gif'></TD>\r\n");
      out.write("\t\t<TD vAlign=top background='resources/images/report/t_y.gif'></TD>\r\n");
      out.write("\t<TR>\r\n");
      out.write("\t\t<TD vAlign=top style='width:2px' background='resources/images/report/b_l.gif'></TD>\r\n");
      out.write("\t\t<TD vAlign=top>\r\n");
      out.write("\r\n");
      out.write("\t<table width=\"100%\">\r\n");
      out.write("\t\t<tbody width=\"100%\">\r\n");
      out.write("\t\t\t<tr width=\"100%\">\r\n");
      out.write("\t\t\t\t<td align=center width=\"100%\">\r\n");
      out.write("\t\t\t\t\t<div class=\"x-knowledge-thread-title\"><b>");
      out.print(notify.getF_title());
      out.write("</b></div>\r\n");
      out.write("\t\t\t\t\t<div class=\"x-knowledge-thread-tag\"><br><b>");
      out.print(notify.getF_issue_dept());
      out.write('　');
      out.write('　');
      out.print(notify.getF_issue_user());
      out.write('　');
      out.write('　');
      out.print(Tools.getDateFull(notify.getF_issue_date(), "yyyy-MM-dd"));
      out.write("</b></div>\r\n");
      out.write("\t\t\t\t</td>\r\n");
      out.write("\t\t\t</tr>\r\n");
      out.write("\t\t\t<tr>\r\n");
      out.write("\t\t\t\t<td vAlign=top>\r\n");
      out.write("\t\t\t\t\t<div>");
      out.print(notify.getF_content());
      out.write("</div>\r\n");
      out.write("\t\t\t\t</td>\r\n");
      out.write("\t\t\t</tr>\r\n");
      out.write("\t\t\t<tr>\r\n");
      out.write("\t\t\t\t<td>\r\n");

	for (int i = 0; i < files.size(); i++) {
		MkFile file = files.get(i);

      out.write("\r\n");
      out.write("\r\n");
      out.write("\t\t\t\t\t<div class=\"x-forum-thread-attach\">\r\n");
 
	if (file.isImage()) {

      out.write("\r\n");
      out.write("\t\t\t\t<image title=\"");
      out.print(file.getF_filename());
      out.write("\" src=\"engine/file/sysdownload.do?tablename=T_MK_SYS_FILES&fieldname=F_CONTENT&id=");
      out.print(file.getId());
      out.write("&filename=");
      out.print(file.getF_filename());
      out.write("\" class=\"mixky-detail-image\"/><br/>\r\n");
      out.write("\t\t\r\n");

	}

      out.write("\r\n");
      out.write("\t\t\t\t\t\t<img class=\"function-file-download\" src=\"resources/images/app/forum/attach.png\" style=\"cursor:pointer\"></img>\r\n");
      out.write("\t\t\t\t\t\t<a class=\"x-forum-thread-attach-link\" href='engine/file/sysdownload.do?id=");
      out.print(file.getId());
      out.write("&documentdbtype=none&fieldname=F_FILE&&documentkey=mkNotify.docNotify'>");
      out.print(file.getF_filename());
      out.write("</a>\r\n");
      out.write("\t\t\t\t\t</div>\r\n");

	}

      out.write("\r\n");
      out.write("\t\t\t\t\t<div class=\"x-forum-thread-attach\"></div>\r\n");
      out.write("\t\t\t\t</td>\r\n");
      out.write("\t\t\t</tr>\r\n");
      out.write("\t\t</tbody>\r\n");
      out.write("\t</table>\r\n");
      out.write("\r\n");
      out.write("\t\t</TD>\r\n");
      out.write("\t\t<TD vAlign=top style='width:3px' background='resources/images/report/b_y.gif'></TD>\r\n");
      out.write("\t</TR>\r\n");
      out.write("\t<TR style=\"HEIGHT: 7px\">\r\n");
      out.write("\t\t<TD vAlign=top background='resources/images/report/d_l.gif'></TD>\r\n");
      out.write("\t\t<TD vAlign=top background='resources/images/report/d_z.gif'></TD>\r\n");
      out.write("\t\t<TD vAlign=top background='resources/images/report/d_y.gif'></TD>\r\n");
      out.write("\t</TR>\r\n");
      out.write("</TABLE>\r\n");
      out.write("\r\n");
      out.write("\t\t</TD>\r\n");
      out.write("\t</TR>\r\n");
      out.write("</TABLE>");
    } catch (java.lang.Throwable t) {
      if (!(t instanceof javax.servlet.jsp.SkipPageException)){
        out = _jspx_out;
        if (out != null && out.getBufferSize() != 0)
          try { out.clearBuffer(); } catch (java.io.IOException e) {}
        if (_jspx_page_context != null) _jspx_page_context.handlePageException(t);
        else throw new ServletException(t);
      }
    } finally {
      _jspxFactory.releasePageContext(_jspx_page_context);
    }
  }
}