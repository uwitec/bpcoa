/*
 * Generated by the Jasper component of Apache Tomcat
 * Version: Apache Tomcat/7.0.34
 * Generated at: 2013-02-19 02:04:05 UTC
 * Note: The last modified time of this file was set to
 *       the last modified time of the source file after
 *       generation to assist with modification tracking.
 */
package org.apache.jsp.WEB_002dINF.jsp;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;
import com.google.gson.JsonObject;
import com.google.gson.JsonArray;
import com.mixky.engine.organization.User;

public final class home_jsp extends org.apache.jasper.runtime.HttpJspBase
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

	String applicationName = "";
	String username = "";
	String userlogin = "";
	JsonObject userconfig = null;
	JsonArray usermenus = null;

	JsonObject userJson = new JsonObject() ;
	
	User user = (User)request.getAttribute("user");
	userJson.addProperty("id", user.getId());
	userJson.addProperty("name", user.getF_caption());
	userJson.addProperty("login", user.getF_name());
	userJson.addProperty("deptid", user.getF_dept_id());
	userJson.addProperty("deptname", user.getF_dept_name());
	userJson.addProperty("type", user.getF_type());
	
	Object obj = request.getAttribute("f_name");
	if(obj != null){
		username = String.valueOf(obj);
	}
	obj = request.getAttribute("f_login");
	if(obj != null){
		userlogin = String.valueOf(obj);
	}
	obj = request.getAttribute("userconfig");
	if(obj != null){
		userconfig = (JsonObject)(obj);
	}
	obj = request.getAttribute("usermenus");
	if(obj != null){
		usermenus = (JsonArray)(obj);
	}
	obj = request.getAttribute("applicationName");
	if(obj != null){
		applicationName = String.valueOf(obj);
	}
	String uimode = userconfig.get("uimode").getAsString();
	
	// 处理初始打开模块、视图或文档（与IM整合）
	JsonObject openParams = null;
	obj = request.getAttribute("openParams");
	if(obj == null){
		openParams = new JsonObject();
	}else{
		openParams = (JsonObject)obj;
	}

      out.write("\r\n");
      out.write("<html>\r\n");
      out.write("\t<head>\r\n");
      out.write("\t\t<link rel=\"shortcut icon\" href=\"resources/images/logo/16.gif\"/>\r\n");
      out.write("\t\t<meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\" />\r\n");
      out.write("\t\t<title>");
      out.print(applicationName);
      out.write(' ');
      out.write('(');
      out.print(username);
      out.write(")</title>\r\n");
      out.write("\t\t<!-- Ext Css -->\r\n");
      out.write("\t\t<link rel=\"stylesheet\" type=\"text/css\" href=\"dependences/ext-3.1.1/resources/css/ext-all.css\"/>\r\n");
      out.write("\t\t<!-- Ext Include -->\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"dependences/ext-3.1.1/adapter/ext/ext-base-debug.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"dependences/ext-3.1.1/ext-all-debug.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"dependences/ext-3.1.1/src/locale/ext-lang-zh_CN.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"resources/js/api-debug.js\"></script>\r\n");
      out.write("\t\t<!-- FckEditor Include -->\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"dependences/fckeditor/fckeditor.js\"></script>\r\n");
      out.write("\t\t\r\n");
      out.write("\t\t<script type=\"text/javascript\" charset=\"utf-8\" src=\"dependences/kindeditor/kindeditor.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" charset=\"utf-8\" src=\"dependences/kindeditor/lang/zh_CN.js\"></script>\r\n");
      out.write("\t\t\t\t\r\n");
      out.write("\t\t\r\n");
      out.write("\t\t<!-- SWFUpload Include -->\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"dependences/swfupload/swfupload.js\"></script>\t\t\r\n");
      out.write("\t\t<!--Flex Page Include -->\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"dependences/flexpage/1.4.2/js/flexpaper_flash_debug.js\"></script>\r\n");
      out.write("\r\n");
      out.write("\t\t<!-- Ext ux Include -->\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"resources/ux/portal/portlet.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"resources/ux/portal/portalcolumn.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"resources/ux/portal/portal.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"resources/ux/roweditor.3.1.1/roweditor.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"resources/ux/hexfield/hexfield.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"resources/ux/colorpicker/colorpicker.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"resources/ux/tabclosemenu/tabclosemenu.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"resources/ux/pagerbar/progressbarpager.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"resources/ux/pagerbar/panelresizer.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"resources/ux/pagerbar/pagingrownumberer.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"resources/ux/dataviewmore/dataviewmore.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"resources/ux/fckeditor/ext.ux.fckeditor.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"resources/ux/datetimefield/datetimefield.js\"></script>\r\n");
      out.write("\t\t\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"dependences/googlechart/jsapi\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"dependences/googlechart/default,orgchart.I.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"resources/ux/chart/GVisualizationPanel.js\"></script>\r\n");
      out.write("\t\t<link rel=\"stylesheet\" type=\"text/css\" href=\"dependences/googlechart/orgchart.css\"/>\r\n");
      out.write("\t\t\r\n");
      out.write("\t\t<!-- Ext ux Css -->\r\n");
      out.write("\t\t<link rel=\"stylesheet\" type=\"text/css\" href=\"resources/ux/portal/portal.css\"/>\r\n");
      out.write("\t\t<link rel=\"stylesheet\" type=\"text/css\" href=\"resources/ux/roweditor.3.1.1/roweditor.css\"/>\r\n");
      out.write("\t\t<link rel=\"stylesheet\" type=\"text/css\" href=\"resources/ux/colorpicker/colorpicker.css\"/>\r\n");
      out.write("\t\t<link rel=\"stylesheet\" type=\"text/css\" href=\"resources/ux/pagerbar/panelresizer.css\"/>\r\n");
      out.write("\t\t<link rel=\"stylesheet\" type=\"text/css\" href=\"resources/ux/datetimefield/css/datetimefield.css\"/>\r\n");
      out.write("\t\t<!-- Mixky Css -->\r\n");
      out.write("\t\t<link rel=\"stylesheet\" type=\"text/css\" href=\"resources/css/mixky.app.css\"/>\r\n");
      out.write("\t\t<link rel=\"stylesheet\" type=\"text/css\" href=\"resources/css/mixky.icon.css\"/>\r\n");
      out.write("\t\t<link rel=\"stylesheet\" type=\"text/css\" href=\"resources/css/mixky.report.css\"/>\r\n");
      out.write("\t\t<link rel=\"stylesheet\" type=\"text/css\" href=\"framework/desktop/desktop.");
      out.print(uimode);
      out.write(".css\"/>\r\n");
      out.write("\t\t<!-- Mixky Editor -->\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"resources/js/editor/mixky.display.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"resources/js/editor/mixky.paneltriggerfield.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"resources/js/editor/mixky.depttreefield.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"resources/js/editor/mixky.combo.treefield.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"resources/js/editor/mixky.deptusermultiselectfield.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"resources/js/editor/mixky.textbox.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"resources/js/editor/mixky.checkboxgroup.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"resources/js/editor/mixky.radiogroup.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"resources/js/editor/mixky.filefield.js\"></script>\r\n");
      out.write("\t\t<link rel=\"stylesheet\" type=\"text/css\" href=\"resources/js/editor/mixky.user.selector.css\"/>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"resources/js/editor/mixky.organization.window.field.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"resources/js/editor/mixky.opinion.field.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"resources/js/editor/mixky.handsign.field.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"resources/js/plugin/mixky.favorite.column.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"resources/js/editor/mixky.combo.view.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"resources/js/editor/mixky.emailaddress.js\"></script>\r\n");
      out.write("\t\t<!-- Mixky Plugin -->\r\n");
      out.write("\r\n");
      out.write("\t\t<!-- Calender Plugin -->\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"resources/js/plugin/mixky.editor.rownumberer.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"resources/js/plugin/mixky.upload.button.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"resources/js/plugin/calendar/common/RepeatType.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"resources/js/plugin/calendar/common/Mask.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"resources/js/plugin/calendar/mixky.calendar.ds.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"resources/js/plugin/calendar/mixky.calendar.js\"></script>\r\n");
      out.write("\t\t<link rel=\"stylesheet\" type=\"text/css\" href=\"resources/js/plugin/calendar/css/calendar_core.css\"/>\r\n");
      out.write("\t\t<!-- Calender Plugin -->\r\n");
      out.write("\r\n");
      out.write("\t\t<!-- Gantt Plugin-->\r\n");
      out.write("\t\t<link rel=\"stylesheet\" type=\"text/css\" href=\"resources/ux/lockinggridview/LockingGridView.css\"/>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"resources/ux/lockinggridview/LockingGridView.js\"></script>\r\n");
      out.write("\r\n");
      out.write("\t\t<link rel=\"stylesheet\" type=\"text/css\" href=\"resources/ux/spinner/Spinner.css\"/>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"resources/ux/spinner/Spinner.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"resources/ux/spinner/SpinnerField.js\"></script>\r\n");
      out.write("\r\n");
      out.write("\t\t<link rel=\"stylesheet\" type=\"text/css\" href=\"dependences/gantt/css/mixky.gantt.all.css\"/>\r\n");
      out.write("\t\t<link rel=\"stylesheet\" type=\"text/css\" href=\"dependences/gantt/css/gantt.css\"/>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"dependences/gantt/mixky.gantt.base.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"dependences/gantt/mixky.gantt.eval.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"dependences/gantt/mixky.overrides.js\"></script>\r\n");
      out.write("\t\t<!-- 审阅意见 -->\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"resources/js/editor/mixky.reader.signlog.field.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"resources/js/editor/mixky.kindeditor.js\"></script>\r\n");
      out.write("\t\t<!-- Gantt Plugin-->\r\n");
      out.write("\t\t\r\n");
      out.write("\t\t<!-- TreeGrid Plugin-->\r\n");
      out.write("        <link rel=\"stylesheet\" type=\"text/css\" href=\"resources/ux/treegrid.3.1.1/treegrid.css\" rel=\"stylesheet\" />\r\n");
      out.write("        \r\n");
      out.write("        <script type=\"text/javascript\" src=\"resources/ux/treegrid.3.1.1/TreeGridSorter.js\"></script>\r\n");
      out.write("        <script type=\"text/javascript\" src=\"resources/ux/treegrid.3.1.1/TreeGridColumnResizer.js\"></script>\r\n");
      out.write("        <script type=\"text/javascript\" src=\"resources/ux/treegrid.3.1.1/TreeGridNodeUI.js\"></script>\r\n");
      out.write("        <script type=\"text/javascript\" src=\"resources/ux/treegrid.3.1.1/TreeGridLoader.js\"></script>\r\n");
      out.write("        <script type=\"text/javascript\" src=\"resources/ux/treegrid.3.1.1/TreeGridColumns.js\"></script>\r\n");
      out.write("        <script type=\"text/javascript\" src=\"resources/ux/treegrid.3.1.1/TreeGrid.js\"></script>\r\n");
      out.write("\t\t<!-- TreeGrid Plugin-->\r\n");
      out.write("\t\t<link rel=\"stylesheet\" type=\"text/css\" href=\"resources/css/mixky.bpcoa.css\"/>\r\n");
      out.write("\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"resources/js/flex/mixky.flex.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"resources/js/flex/FABridge.js\"></script>\r\n");
      out.write("\r\n");
      out.write("\t\t<!-- Mixky Include -->\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"resources/js/mixky.lib.js\"></script>\r\n");
      out.write("\r\n");
      out.write("\t\t<!-- Sets the basepath for the library if not in same directory -->\r\n");
      out.write("\t\t<script type=\"text/javascript\">\r\n");
      out.write("\t\t\tmxLanguage = 'none';\r\n");
      out.write("\t\t\tmxBasePath = 'dependences/mxgraph/src';\r\n");
      out.write("\t\t</script>\r\n");
      out.write("\r\n");
      out.write("\t\t<!-- Loads and initiaizes the library -->\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"dependences/mxgraph/mxclient.1.4.0.9.js\"></script>\r\n");
      out.write("\r\n");
      out.write("\t\t<script language=javascript>\r\n");
      out.write("\t\t\tExt.namespace(\"Mixky.app\");\r\n");
      out.write("\t\t\tMixky.app.UserInfo = ");
      out.print(userJson);
      out.write(";\r\n");
      out.write("\t\t</script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"resources/docs/helps/help.plugin.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"framework/mixky.app.dictionarys.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"framework/mixky.app.common.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"framework/mixky.app.actions.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"framework/mixky.app.modules.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"framework/mixky.app.documents.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"framework/mixky.app.views.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"framework/mixky.app.menus.js\"></script>\r\n");
      out.write("\t\t\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"framework/desktop/mixky.desktop.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"framework/desktop/mixky.desktop.");
      out.print(uimode);
      out.write(".js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"framework/engine/mixky.app.module.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"framework/engine/mixky.app.document.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"framework/mixky.app.workflow.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"framework/mixky.app.js\"></script>\r\n");
      out.write("\r\n");
      out.write("\t</head>\r\n");
      out.write("\t<body scroll=\"no\">\r\n");
      out.write("\t<div id=\"loading-mask\"></div>\r\n");
      out.write("\t<div id=\"loading\">\r\n");
      out.write("\t\t<div class=\"loading-indicator\">正在装载应用...</div>\r\n");
      out.write("\t</div>\r\n");
      out.write("\t</body>\r\n");
      out.write("</html>\r\n");
      out.write("<script language=javascript>\r\n");
      out.write("// 初始化资源路径\r\n");
      out.write("Ext.BLANK_IMAGE_URL = 'dependences/ext-3.1.1/resources/images/default/s.gif';\r\n");
      out.write("Ext.chart.Chart.CHART_URL = 'dependences/ext-3.1.1/resources/charts.swf';\r\n");
      out.write("\r\n");
      out.write("// 创建应用\r\n");
      out.write("MixkyApp = new Mixky.app.App({\r\n");
      out.write("\tuserMenus:");
      out.print(usermenus);
      out.write(", \r\n");
      out.write("\tuserConfig : ");
      out.print(userconfig.toString());
      out.write(",\r\n");
      out.write("\topenParams : ");
      out.print(openParams.toString());
      out.write("\r\n");
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
