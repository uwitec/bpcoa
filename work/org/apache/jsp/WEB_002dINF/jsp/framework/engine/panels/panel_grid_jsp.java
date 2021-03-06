/*
 * Generated by the Jasper component of Apache Tomcat
 * Version: Apache Tomcat/7.0.34
 * Generated at: 2013-01-27 02:46:43 UTC
 * Note: The last modified time of this file was set to
 *       the last modified time of the source file after
 *       generation to assist with modification tracking.
 */
package org.apache.jsp.WEB_002dINF.jsp.framework.engine.panels;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;
import java.util.List;
import java.util.Map;
import com.google.gson.JsonObject;
import com.mixky.engine.organization.User;
import com.mixky.engine.common.Action;
import com.mixky.engine.common.DesignObjectLoader;
import com.mixky.engine.document.DocumentManager;
import com.mixky.engine.document.Document;
import com.mixky.engine.document.Panel;
import com.mixky.engine.store.StoreManager;
import com.mixky.engine.view.View;
import com.mixky.engine.view.ViewManager;
import com.mixky.engine.document.ObjectAuthority;

public final class panel_grid_jsp extends org.apache.jasper.runtime.HttpJspBase
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
      out.write("\r\n");
      out.write("\r\n");
      out.write("\r\n");
      out.write("\r\n");
      out.write("\r\n");
      out.write("\r\n");
      out.write("\r\n");

	// 读取参数
	String panelid = request.getParameter("panelid");
	String documentid = request.getParameter("documentid");
	// 获取属性
	User user = (User)request.getAttribute("user");
	Panel panel = (Panel)request.getAttribute("panel");
	Document document = (Document)request.getAttribute("document");
	Map<String, ObjectAuthority> map = (Map<String, ObjectAuthority>)request.getAttribute("authmap");
	// 获得视图对象
	View view = DesignObjectLoader.instance().loadDesignObject(panel.getF_i_view().get("data").getAsString());
	// 获得权限
	List<ObjectAuthority> panelbuttonauths = DocumentManager.instance().getFilterObjectAuthority(map, panel.getF_buttons(), user);
	List<ObjectAuthority> viewbuttonauths = DocumentManager.instance().getFilterObjectAuthority(map, view.getF_buttons(), user);
	// 合并视图及表单按钮
	for(int i=0;i<viewbuttonauths.size();i++){
		panelbuttonauths.add(viewbuttonauths.get(i));
	}
	List<ObjectAuthority> columnauths = DocumentManager.instance().getFilterObjectAuthority(map, view.getF_columns(), user);
	// 视图默认参数
	JsonObject params = new JsonObject();
	if(panel.getF_config() != null && panel.getF_config().has("documentidParamName")){
		params.addProperty(panel.getF_config().get("documentidParamName").getAsString(), documentid);
	}
	
	JsonObject configParams = new JsonObject();
	if (panel.getF_config().has("params")) {
		configParams = panel.getF_config().get("params").getAsJsonObject();
	}

      out.write("\r\n");
      out.write("<script language='javascript'>\r\n");
      out.write("Ext.onReady(function(){\r\n");
      out.write("\r\n");
      out.write("\tvar panel = Ext.getCmp('");
      out.print(panelid);
      out.write("');\r\n");
      out.write("\r\n");
      out.write("\t// 数据访问\r\n");
      out.write("\tvar store = new Ext.data.DirectStore({\r\n");
      out.write("\t\tdirectFn : ViewAppDirect.getViewList,\r\n");
      out.write("\t\tparamOrder : ['viewkey','querytype','limit','start','sort','dir','params'],\r\n");
      out.write("\t\tbaseParams : {viewkey:'");
      out.print(view.getKey());
      out.write("', querytype:");
      out.print(ViewManager.QT_NORMAL);
      out.write(",limit:0, start:1, sort:'',dir:'',params:Ext.apply(");
      out.print(params);
      out.write(',');
      out.write(' ');
      out.print(configParams);
      out.write(")},\r\n");
      out.write("\t\tremoteSort : true,\r\n");
      out.write("\t\troot : 'results',\r\n");
      out.write("\t\ttotalProperty : 'totals',\r\n");
      out.write("\t\tidProperty : '");
      out.print(view.getF_keycolumn());
      out.write("',\r\n");
      out.write("\t\tfields : ");
      out.print(ViewManager.instance().getViewStoreFields(view.getF_columns()));
      out.write("\r\n");
      out.write("\t});\r\n");


	// 选择器
	if(view.getF_single_select()){

      out.write("\r\n");
      out.write("\tvar sm = new Ext.grid.RowSelectionModel({singleSelect : true});\r\n");

	}else{

      out.write("\r\n");
      out.write("\tvar sm = new Ext.grid.CheckboxSelectionModel();\r\n");

	}

      out.write("\r\n");
      out.write("\t// 显示列\r\n");
      out.write("\tvar columns = ");
      out.print(ViewManager.instance().getViewColumnsByAuths(columnauths));
      out.write(";\r\n");
      out.write("\r\n");
      out.write("\t// 刷新按钮\r\n");
      out.write("\tvar ");
      out.print(ViewManager.VN_REFRESH_BUTTON_NAME);
      out.write(" = new Ext.Action({\r\n");
      out.write("\t\ttext : '刷新',\r\n");
      out.write("\t\ticonCls : 'icon-sys-refresh',\r\n");
      out.write("\t\thandler : function(){\r\n");
      out.write("\t\t\tstore.baseParams.querytype = ");
      out.print(ViewManager.QT_NORMAL);
      out.write(";\r\n");
      out.write("\t\t\tpanel.refresh();\r\n");
      out.write("\t\t}\r\n");
      out.write("\t});\r\n");
      out.write("\t// 视图操作\r\n");
      out.write("\tvar buttons = [");
      out.print(ViewManager.VN_REFRESH_BUTTON_NAME);
      out.write(", '->'];\r\n");
      out.write("\tvar contextmenus = [");
      out.print(ViewManager.VN_REFRESH_BUTTON_NAME);
      out.write(", '-'];\r\n");

	String defaultAction = "";
	for(int i=0;i<panelbuttonauths.size();i++){
		ObjectAuthority auth = panelbuttonauths.get(i);
		// 判断权限
		if(auth.hasAuth(ObjectAuthority.A_READ) || auth.hasAuth(ObjectAuthority.A_EDIT)){
			Action action = (Action)auth.getObject();
			// 输出按钮

      out.write('\r');
      out.write('\n');
      out.write('	');
      out.print(action.output());
      out.write('\r');
      out.write('\n');

			if(!action.isHideInToolbar()){

      out.write("\r\n");
      out.write("\tbuttons.push(");
      out.print(action.getF_key());
      out.write(");\r\n");

			}
			if(!action.isHideInContextMenu()){

      out.write("\r\n");
      out.write("\tcontextmenus.push(");
      out.print(action.getF_key());
      out.write(");\r\n");

			}
			// 双击默认操作
			if(action.getF_default()){
				defaultAction = action.getF_key() + ".execute()";
			}
		}
	}

      out.write("\r\n");
      out.write("\t// 表格对象\r\n");
      out.write("\tvar grid = new Ext.grid.GridPanel({\r\n");
      out.write("\t\tborder : false,\r\n");
      out.write("\t\tstripeRows: true,\r\n");
      out.write("\t\tenableHdMenu : true,\r\n");
      out.write("\t\tautoExpandColumn : '");
      out.print(view.getF_autoexpandcolumn());
      out.write("',\r\n");
      out.write("\t\tsm : sm,\r\n");
      out.write("\t\tcolumns : columns,\r\n");
      out.write("\t\tstore : store,\r\n");
      out.write("\t\ttbar : buttons,\r\n");
      out.write("\t\tcontextMenu : new Ext.menu.Menu({items:contextmenus}),\r\n");
      out.write("\t\tlisteners : {\r\n");
      out.write("\t\t\t'rowcontextmenu' : function(g, rowIndex, e){\r\n");
      out.write("\t\t\t\tg.getSelectionModel().selectRow(rowIndex);\r\n");
      out.write("\t\t\t\tg.contextMenu.showAt(e.getXY());\r\n");
      out.write("\t\t\t},\r\n");
      out.write("\t\t\t'rowdblclick' : function(g, rowIndex, e){\r\n");
      out.write("\t\t\t\t");
      out.print(defaultAction);
      out.write("\r\n");
      out.write("\t\t\t}\r\n");
      out.write("\t\t},\r\n");
      out.write("\t\tgetSelectedRecords : function(){\r\n");
      out.write("\t\t\treturn this.getSelectionModel().getSelections();\r\n");
      out.write("\t\t}\r\n");
      out.write("\t});\r\n");
      out.write("\r\n");
      out.write("\tfunction getSelectedRecords(){\r\n");
      out.write("\t\treturn grid.getSelectedRecords();\r\n");
      out.write("\t}\r\n");
      out.write("\t\r\n");
      out.write("\tpanel.refresh = function(){\r\n");
      out.write("\t\tgrid.getStore().reload();\r\n");
      out.write("\t}\r\n");
      out.write("\r\n");
      out.write("\tpanel.exportToExcel = function() {\r\n");
      out.write("\t\tvar ids = [];\r\n");
      out.write("\t\tvar cols = grid.getColumnModel();\r\n");
      out.write("\t\tvar colsStr = '';\r\n");
      out.write("\t\tvar colsNames = '';\r\n");
      out.write("\t\tfor (var i = 0; i < cols.getColumnCount(); i++) {\r\n");
      out.write("\t\t\tvar col = cols.getColumnById(cols.getColumnId(i));\r\n");
      out.write("\t\t\tif (!col.hidden && col.id != 'numberer' && col.id != 'checker') {\r\n");
      out.write("\t\t\t\tcolsStr += col.id + ',';\r\n");
      out.write("\t\t\t\tcolsNames += col.header + ',';\r\n");
      out.write("\t\t\t}\r\n");
      out.write("\t\t}\r\n");
      out.write("\t\tvar excelParams = Ext.apply({},grid.getStore().baseParams);\r\n");
      out.write("\t\tExt.apply(excelParams,{ids: ids, colsStr:colsStr, colsNames:colsNames, panelTitle: panel.title});\r\n");
      out.write("\t\texcelParams.params = Ext.util.JSON.encode(excelParams.params);\r\n");
      out.write("\t\tlocation.href = 'framework/engine/view/export.to.excel.do?' + Ext.urlEncode(excelParams);\r\n");
      out.write("\t}\r\n");
      out.write("\r\n");
      out.write("\t// 输出附加脚本 begin\r\n");

	if(panel.getF_custom_script() != null){
		out.print(panel.getF_custom_script());
	}

      out.write("\r\n");
      out.write("\r\n");
      out.write("\t// 输出附加脚本 end\r\n");
      out.write("\tpanel.add(grid);\r\n");
      out.write("\tpanel.doLayout();\r\n");
      out.write("\t// 初始化视图数据\r\n");
      out.write("\tpanel.refresh();\r\n");
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
