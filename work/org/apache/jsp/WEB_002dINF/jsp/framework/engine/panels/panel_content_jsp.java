/*
 * Generated by the Jasper component of Apache Tomcat
 * Version: Apache Tomcat/7.0.34
 * Generated at: 2013-01-30 02:30:40 UTC
 * Note: The last modified time of this file was set to
 *       the last modified time of the source file after
 *       generation to assist with modification tracking.
 */
package org.apache.jsp.WEB_002dINF.jsp.framework.engine.panels;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;
import java.util.Map;
import com.mixky.engine.document.Panel;
import com.mixky.engine.document.Document;
import com.mixky.engine.common.DesignObjectLoader;
import com.mixky.engine.common.DesignObject;
import com.mixky.engine.document.ObjectAuthority;

public final class panel_content_jsp extends org.apache.jasper.runtime.HttpJspBase
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
      response.setContentType("text/html; charset=utf-8");
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

	String documentid = request.getParameter("documentid");
	String panelid = request.getParameter("panelid");

	Map<String, ObjectAuthority> map = (Map<String, ObjectAuthority>)request.getAttribute("authmap");

	Panel panel = (Panel)request.getAttribute("panel");
	
	ObjectAuthority panelauth = map.get(panel.getKey());
	
	String tablename = panel.getF_config().get("tablename").getAsString();
	String fieldname = panel.getF_config().get("fieldname").getAsString();
	
	boolean editable = panelauth.hasAuth(ObjectAuthority.A_EDIT);

      out.write("\r\n");
      out.write("\r\n");
      out.write("\r\n");
      out.write("<script lang='javascript'>\r\n");
      out.write("\tExt.onReady(function(){\r\n");
      out.write("\t\tvar editable = ");
      out.print(editable);
      out.write(";\r\n");
      out.write("\t\tvar panel = Ext.getCmp('");
      out.print(panelid);
      out.write("');\t\t\r\n");
      out.write("\r\n");
      out.write("\t\tvar fckPanel = new Ext.form.FormPanel({\r\n");
      out.write("\t\t\tautoScroll : true,\r\n");
      out.write("\t\t\tlayout:'form',\r\n");
      out.write("\t\t\tborder : false,\r\n");
      out.write("\t\t\titems : [{\r\n");
      out.write("\t\t\t\txtype:'");
      out.print(editable ? "htmleditor" : "displayfield");
      out.write("',\r\n");
      out.write("\t\t\t\tanchor:\"99% 99%\",\r\n");
      out.write("\t\t\t\tname:\"F_CONTENT\",\r\n");
      out.write("\t\t\t\thideLabel:true\r\n");
      out.write("\t\t\t}]\r\n");
      out.write("\t\t});\t\r\n");
      out.write("\r\n");
      out.write("\t\t\r\n");
      out.write("\t\tpanel.submit = function(fn){\r\n");
      out.write("\t\t\tif(editable){\r\n");
      out.write("\t\t\t\tDocumentAppDirect.setClobContext(\"");
      out.print(tablename);
      out.write("\", \"");
      out.print(fieldname);
      out.write('"');
      out.write(',');
      out.write(' ');
      out.print(documentid);
      out.write(", fckPanel.getForm().findField(\"F_CONTENT\").getValue(), function(result, e){\r\n");
      out.write("\t\t\t\t\tif(result && result.success){\r\n");
      out.write("\t\t\t\t\t\tpanel.document.submitPanelOver(panel, fn);\r\n");
      out.write("\t\t\t\t\t}else{\r\n");
      out.write("\t\t\t\t\t\tMixkyApp.showDirectActionFail(\"保存文本内容\", result, e);\r\n");
      out.write("\t\t\t\t\t}\r\n");
      out.write("\t\t\t\t});\r\n");
      out.write("\t\t\t}else{\r\n");
      out.write("\t\t\t\tpanel.document.submitPanelOver(panel, fn);\r\n");
      out.write("\t\t\t}\r\n");
      out.write("\t\t}\r\n");
      out.write("\r\n");
      out.write("\t\tpanel.refresh = function(){\r\n");
      out.write("\t\t\t// 此处获得内容\r\n");
      out.write("\t\t\tDocumentAppDirect.getClobContext(\"");
      out.print(tablename);
      out.write("\", \"");
      out.print(fieldname);
      out.write('"');
      out.write(',');
      out.write(' ');
      out.print(documentid);
      out.write(", function(result, e){\r\n");
      out.write("\t\t\t\tif(result && result.success){\r\n");
      out.write("\t\t\t\t\tvar content = fckPanel.getForm().findField(\"F_CONTENT\").setValue(result.context);\r\n");
      out.write("\t\t\t\t}else{\r\n");
      out.write("\t\t\t\t\tMixkyApp.showDirectActionFail(\"获得文本内容\", result, e);\r\n");
      out.write("\t\t\t\t}\r\n");
      out.write("\t\t\t});\r\n");
      out.write("\t\t}\r\n");
      out.write("\r\n");
      out.write("\t\t// 输出附加脚本 end\r\n");
      out.write("\t\tpanel.add(fckPanel);\r\n");
      out.write("\t\tpanel.doLayout();\r\n");
      out.write("\t\t//form.doLayout();\r\n");
      out.write("\t\t// 初始化视图数据\r\n");
      out.write("\t\tpanel.refresh();\r\n");
      out.write("\t\t\r\n");
      out.write("\t});\r\n");
      out.write("</script>");
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
