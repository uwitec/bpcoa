/*
 * Generated by the Jasper component of Apache Tomcat
 * Version: Apache Tomcat/7.0.34
 * Generated at: 2013-02-19 07:41:54 UTC
 * Note: The last modified time of this file was set to
 *       the last modified time of the source file after
 *       generation to assist with modification tracking.
 */
package org.apache.jsp.WEB_002dINF.jsp.app.mkoa.knowledge;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;

public final class knowledge_view_jsp extends org.apache.jasper.runtime.HttpJspBase
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

      out.write('\r');
      out.write('\n');

	String panelid = request.getParameter("panelid");

      out.write("\r\n");
      out.write("<script language='javascript'>\r\n");
      out.write("Ext.onReady(function(){\r\n");
      out.write("\r\n");
      out.write("\tvar panel = Ext.getCmp('");
      out.print(panelid);
      out.write("');\r\n");
      out.write("\tvar win = panel.findParentByType('window');\r\n");
      out.write("\r\n");
      out.write("\tvar p = new Ext.Panel({\r\n");
      out.write("\t    layout:'column',\r\n");
      out.write("\t    border : false,\r\n");
      out.write("\t\tautoScroll : true,\r\n");
      out.write("\t    items: [{\r\n");
      out.write("\t    \tborder : false,\r\n");
      out.write("\t    \tbodyStyle : 'padding: 10px',\r\n");
      out.write("\t        columnWidth: .5\r\n");
      out.write("\t    },{\r\n");
      out.write("\t    \tborder : false,\r\n");
      out.write("\t    \tbodyStyle : 'padding: 10px',\r\n");
      out.write("\t    \tcolumnWidth: .5 \r\n");
      out.write("\t    }]\r\n");
      out.write("\t});\r\n");
      out.write("\r\n");
      out.write("\tvar topKPanel = addKpanel(p, {\r\n");
      out.write("\t\tkey: 'mkKnowledge.dpTopKnowledge',\r\n");
      out.write("\t\ttext: '推荐知识',\r\n");
      out.write("\t\ticonCls: '',\r\n");
      out.write("\t\twebheight: 300\r\n");
      out.write("\t}, 0);\r\n");
      out.write("\r\n");
      out.write("\tvar newKPanel = addKpanel(p, {\r\n");
      out.write("\t\tkey: 'mkKnowledge.dpHotKnowledge',\r\n");
      out.write("\t\ttext: '热点知识',\r\n");
      out.write("\t\ticonCls: '',\r\n");
      out.write("\t\twebheight: 300\r\n");
      out.write("\t}, 0);\r\n");
      out.write("\r\n");
      out.write("\tvar newKPanel = addKpanel(p, {\r\n");
      out.write("\t\tkey: 'mkKnowledge.dpCommentKnowledge',\r\n");
      out.write("\t\ttext: '评论最多的知识',\r\n");
      out.write("\t\ticonCls: '',\r\n");
      out.write("\t\twebheight: 300\r\n");
      out.write("\t}, 1);\r\n");
      out.write("\t\r\n");
      out.write("\tvar newKPanel = addKpanel(p, {\r\n");
      out.write("\t\tkey: 'mkKnowledge.dpHighKnowledge',\r\n");
      out.write("\t\ttext: '评价最高的知识',\r\n");
      out.write("\t\ticonCls: '',\r\n");
      out.write("\t\twebheight: 300\r\n");
      out.write("\t}, 1);\r\n");
      out.write("\r\n");
      out.write("\t// extend method\r\n");
      out.write("\tfunction addKpanel(kPanel, o, col){\r\n");
      out.write("\t\tvar panel = Ext.getCmp('k-portlet-' + o.key);\r\n");
      out.write("\t\tif (panel) {\r\n");
      out.write("\t\t\tpanel.destroy();\r\n");
      out.write("\t\t}\r\n");
      out.write("\t\t//if(!panel){\r\n");
      out.write("\t\t\t//var col = Ext.isDefined(o.col) ? o.col : this.getMinHeightCol();\r\n");
      out.write("\t\t\tpanel = new Ext.Panel({\r\n");
      out.write("\t\t\t\tid : 'k-portlet-' + o.key,\r\n");
      out.write("\t    \t\ttitle : o.text,\r\n");
      out.write("\t    \t\tlayout : 'fit',\r\n");
      out.write("\t    \t\ticonCls : o.iconCls,\r\n");
      out.write("\t    \t\theight : o.webheight,\r\n");
      out.write("\t    \t\tcls : 'x-portlet',\r\n");
      out.write("\t\t\t\ttools : [{\r\n");
      out.write("\t\t\t\t\tid : 'refresh',\r\n");
      out.write("\t\t\t\t\thandler : function(){\r\n");
      out.write("\t\t\t\t\t\tpanel.refresh();\r\n");
      out.write("\t\t\t\t\t},\r\n");
      out.write("\t\t\t\t\tqtip : \"刷新栏目内容\"\r\n");
      out.write("\t\t\t\t}],\r\n");
      out.write("\t\t\t\tautoLoad : {\r\n");
      out.write("\t\t\t\t\turl : \"portlet.do\",\r\n");
      out.write("\t\t\t\t\tparams : {key : o.key, customPanelId : 'k-portlet-' + o.key},\r\n");
      out.write("\t\t\t\t\tscripts : true\r\n");
      out.write("\t\t\t\t},\r\n");
      out.write("\t\t\t\trefresh : function(){\r\n");
      out.write("\t\t\t\t\tpanel.doAutoLoad();\r\n");
      out.write("\t\t\t\t}\r\n");
      out.write("\t    \t});\r\n");
      out.write("\t\t\tkPanel.items.get(col).add(panel);\r\n");
      out.write("\t\t\tkPanel.doLayout();\r\n");
      out.write("\t\t\tpanel.key = o.key;\r\n");
      out.write("\t\t//}\r\n");
      out.write("\t\treturn panel;\r\n");
      out.write("\t}\r\n");
      out.write("\r\n");
      out.write("\t// 视图刷新\r\n");
      out.write("\tpanel.refresh = function(params){\r\n");
      out.write("\t};\r\n");
      out.write("\t\r\n");
      out.write("\t// 输出附加脚本 end\r\n");
      out.write("\tpanel.add(p);\r\n");
      out.write("\tpanel.doLayout();\r\n");
      out.write("\t// 初始化视图数据\r\n");
      out.write("\t//panel.refresh(panel.initParams);\r\n");
      out.write("});\r\n");
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
