/*
 * Generated by the Jasper component of Apache Tomcat
 * Version: Apache Tomcat/7.0.34
 * Generated at: 2013-01-24 06:03:42 UTC
 * Note: The last modified time of this file was set to
 *       the last modified time of the source file after
 *       generation to assist with modification tracking.
 */
package org.apache.jsp.WEB_002dINF.jsp.app.bpc.score;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;
import java.util.List;
import java.util.Map;
import java.util.Date;
import com.mixky.toolkit.DateUtil;
import com.google.gson.JsonObject;
import com.mixky.engine.organization.User;
import com.mixky.engine.common.Action;
import com.mixky.engine.common.DesignObjectLoader;
import com.mixky.engine.view.Column;
import com.mixky.engine.store.TableForm;
import com.mixky.engine.store.Field;
import com.mixky.engine.store.StoreManager;
import com.mixky.engine.view.View;
import com.mixky.engine.view.ViewManager;
import com.mixky.engine.document.ObjectAuthority;
import com.mixky.engine.authority.AuthorityManager;

public final class score_user_jsp extends org.apache.jasper.runtime.HttpJspBase
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
      out.write("\r\n");
      out.write("\r\n");
      out.write("\r\n");
      out.write("\r\n");
      out.write("<script language='javascript'>\r\n");
      out.write("Ext.onReady(function(){\r\n");
      out.write("\r\n");
      out.write("\tvar panel = Ext.getCmp('ext-comp-1119');\r\n");
      out.write("\tvar win = panel.findParentByType('window');\r\n");
      out.write("\r\n");
      out.write("\t// 数据访问\r\n");
      out.write("\tvar store = new Ext.data.DirectStore({\r\n");
      out.write("\t\tdirectFn : ViewAppDirect.getViewList,\r\n");
      out.write("\t\tparamOrder : ['viewkey','querytype','limit','start','sort','dir','params'],\r\n");
      out.write("\t\tbaseParams : {viewkey:'mkScore.qScoreUser.vScoreUser', querytype:0,limit:0, start:0, sort:'',dir:'',params:{}},\r\n");
      out.write("\t\tremoteSort : true,\r\n");
      out.write("\t\troot : 'results',\r\n");
      out.write("\t\ttotalProperty : 'totals',\r\n");
      out.write("\t\tidProperty : 'ID',\r\n");
      out.write("\t\tfields : [{\"name\":\"ID\",\"mapping\":\"ID\"},{\"name\":\"F_USER_NAME\",\"mapping\":\"F_USER_NAME\"},{\"name\":\"F_DEPT_NAME\",\"mapping\":\"F_DEPT_NAME\"},{\"name\":\"F_MANAGER_NAME\",\"mapping\":\"F_MANAGER_NAME\"},{\"name\":\"F_SCORE\",\"mapping\":\"F_SCORE\",\"type\":\"float\"},{\"name\":\"F_SCORE_YEAR\",\"mapping\":\"F_SCORE_YEAR\",\"type\":\"float\"},{\"name\":\"TOTAL\",\"mapping\":\"TOTAL\",\"type\":\"float\"}]\r\n");
      out.write("\t});\r\n");
      out.write("\r\n");
      out.write("\tvar sm = new Ext.grid.RowSelectionModel({singleSelect : true});\r\n");
      out.write("\r\n");
      out.write("\t// 显示列\r\n");
      out.write("\tvar columns = [new Ext.grid.RowNumberer(),{\"id\":\"F_USER_NAME\",\"dataIndex\":\"F_USER_NAME\",\"header\":\"姓名\",\"sortable\":true,\"width\":200},{\"id\":\"F_DEPT_NAME\",\"dataIndex\":\"F_DEPT_NAME\",\"header\":\"部门\",\"sortable\":true,\"width\":200},{\"id\":\"F_MANAGER_NAME\",\"dataIndex\":\"F_MANAGER_NAME\",\"header\":\"打分者\",\"sortable\":true,\"width\":200},{\"id\":\"F_SCORE\",\"dataIndex\":\"F_SCORE\",\"header\":\"基础分\",\"sortable\":true,\"width\":200},{\"id\":\"F_SCORE_YEAR\",\"dataIndex\":\"F_SCORE_YEAR\",\"header\":\"各年累计分\",\"sortable\":true,\"width\":200},{\"id\":\"TOTAL\",\"dataIndex\":\"TOTAL\",\"header\":\"总分\",\"sortable\":true,\"width\":200}];\r\n");
      out.write("\t// 视图操作\r\n");
      out.write("\r\n");
      out.write("\tvar btnOpen =  new Ext.Action({\"text\":\"打开\",\"iconCls\":\"icon-sys-btnopen\",\"handler\":function(){\r\n");
      out.write("\tvar records = grid.getSelectedRecords();\r\n");
      out.write("\tif(records.length > 0){\r\n");
      out.write("\t\tvar id = records[0].get('ID');\r\n");
      out.write("\t\tMixkyApp.desktop.openDocument('mkScore.docScoreUser', id);\r\n");
      out.write("\t}\r\n");
      out.write("}});\r\n");
      out.write("\r\n");
      out.write("\tvar btnAdd =  new Ext.Action({\"text\":\"新建\",\"iconCls\":\"icon-sys-btnadd\",\"handler\":function(){\r\n");
      out.write("MixkyApp.desktop.openDocument('mkScore.docScoreUser');\r\n");
      out.write("}});\r\n");
      out.write("\r\n");
      out.write("\tvar btnExport =  new Ext.Action({\"text\":\"导出到Excel\",\"iconCls\":\"icon-sys-btnexport\",\"handler\":function() {\r\n");
      out.write("     panel.exportToExcel();\r\n");
      out.write("}});\r\n");
      out.write("\r\n");
      out.write("\tvar quickQueryField = new Ext.form.TextField({\r\n");
      out.write("\t\twidth : 100,\r\n");
      out.write("\t\temptyText : '输入快速检索字符',\r\n");
      out.write("        listeners: {\r\n");
      out.write("\t        specialkey: function(field, e){\r\n");
      out.write("\t            // e.HOME, e.END, e.PAGE_UP, e.PAGE_DOWN,\r\n");
      out.write("\t            // e.TAB, e.ESC, arrow keys: e.LEFT, e.RIGHT, e.UP, e.DOWN\r\n");
      out.write("\t            if (e.getKey() == e.ENTER) {\r\n");
      out.write("\t            \tvar value = field.getValue();\r\n");
      out.write("\t    \t\t\tif(Ext.isDefined(value) && value != ''){\r\n");
      out.write("\t    \t\t\t\tstore.baseParams.querytype = 1;\r\n");
      out.write("\t    \t\t\t\tpanel.queryParams = {quickquerystr: value};\r\n");
      out.write("\t    \t\t\t\tpanel.refresh();\r\n");
      out.write("\t    \t\t\t}\r\n");
      out.write("\t            }\r\n");
      out.write("\t        }\r\n");
      out.write("\t    }\r\n");
      out.write("\t});\r\n");
      out.write("\tvar btnQuickQuery = new Ext.Action({\r\n");
      out.write("\t\ttext : '快速检索',\r\n");
      out.write("\t\ticonCls : 'icon-sys-query',\r\n");
      out.write("\t\thandler : function(){\r\n");
      out.write("\t\t\tvar value = quickQueryField.getValue();\r\n");
      out.write("\t\t\tif(Ext.isDefined(value) && value != ''){\r\n");
      out.write("\t\t\t\tstore.baseParams.querytype = 1;\r\n");
      out.write("\t\t\t\tpanel.queryParams = {quickquerystr: value};\r\n");
      out.write("\t\t\t\tpanel.refresh();\r\n");
      out.write("\t\t\t}\r\n");
      out.write("\t\t}\r\n");
      out.write("\t});\r\n");
      out.write("\tvar advanceForm = new Ext.form.FormPanel({\r\n");
      out.write("\t\tpadding : 5,\r\n");
      out.write("\t\tlabelWidth : 80,\r\n");
      out.write("\t\tautoScroll : true,\r\n");
      out.write("\t\titems : [{\"name\":\"F_USER_NAME\",\"xtype\":\"textfield\",\"anchor\":\"100%\",\"fieldLabel\":\"姓名\"},{\"name\":\"F_MANAGER_NAME\",\"xtype\":\"textfield\",\"anchor\":\"100%\",\"fieldLabel\":\"打分者\"},{\"layout\":\"column\",\"border\":false,\"items\":[{\"width\":80,\"labelWidth\":80,\"layout\":\"form\",\"border\":false,\"items\":{\"xtype\":\"textfield\",\"autoCreate\":{\"tag\":\"input\",\"type\":\"hidden\"},\"fieldLabel\":\"基础分\"}},{\"labelWidth\":20,\"columnWidth\":0.5,\"layout\":\"form\",\"border\":false,\"items\":{\"name\":\"F_SCORE_begin\",\"xtype\":\"numberfield\",\"fieldLabel\":\">=\",\"anchor\":\"100%\"}},{\"labelWidth\":20,\"columnWidth\":0.5,\"layout\":\"form\",\"border\":false,\"bodyStyle\":\"padding-left:3px;\",\"items\":{\"name\":\"F_SCORE_end\",\"xtype\":\"numberfield\",\"fieldLabel\":\" <=\",\"anchor\":\"100%\"}}]},{\"name\":\"F_DEPT_NAME\",\"xtype\":\"textfield\",\"anchor\":\"100%\",\"fieldLabel\":\"部门\"},{\"layout\":\"column\",\"border\":false,\"items\":[{\"width\":80,\"labelWidth\":80,\"layout\":\"form\",\"border\":false,\"items\":{\"xtype\":\"textfield\",\"autoCreate\":{\"tag\":\"input\",\"type\":\"hidden\"},\"fieldLabel\":\"各年累计分\"}},{\"labelWidth\":20,\"columnWidth\":0.5,\"layout\":\"form\",\"border\":false,\"items\":{\"name\":\"F_SCORE_YEAR_begin\",\"xtype\":\"numberfield\",\"fieldLabel\":\">=\",\"anchor\":\"100%\"}},{\"labelWidth\":20,\"columnWidth\":0.5,\"layout\":\"form\",\"border\":false,\"bodyStyle\":\"padding-left:3px;\",\"items\":{\"name\":\"F_SCORE_YEAR_end\",\"xtype\":\"numberfield\",\"fieldLabel\":\" <=\",\"anchor\":\"100%\"}}]},{\"layout\":\"column\",\"border\":false,\"items\":[{\"width\":80,\"labelWidth\":80,\"layout\":\"form\",\"border\":false,\"items\":{\"xtype\":\"textfield\",\"autoCreate\":{\"tag\":\"input\",\"type\":\"hidden\"},\"fieldLabel\":\"总分\"}},{\"labelWidth\":20,\"columnWidth\":0.5,\"layout\":\"form\",\"border\":false,\"items\":{\"name\":\"TOTAL_begin\",\"xtype\":\"numberfield\",\"fieldLabel\":\">=\",\"anchor\":\"100%\"}},{\"labelWidth\":20,\"columnWidth\":0.5,\"layout\":\"form\",\"border\":false,\"bodyStyle\":\"padding-left:3px;\",\"items\":{\"name\":\"TOTAL_end\",\"xtype\":\"numberfield\",\"fieldLabel\":\" <=\",\"anchor\":\"100%\"}}]}],\r\n");
      out.write("\t\tbbar : ['->',{\r\n");
      out.write("\t\t\ttext : '执行检索',\r\n");
      out.write("\t\t\ticonCls : 'icon-sys-confirm',\r\n");
      out.write("\t\t\thandler : function(){\r\n");
      out.write("\t\t\t\tvar btn = btnAdvanceQueryButton;\r\n");
      out.write("\t\t\t\tstore.baseParams.querytype = 2;\r\n");
      out.write("\t\t\t\tvar params = advanceForm.getForm().getValues();\r\n");
      out.write("\t\t\t\tvar mparams = {};\r\n");
      out.write("\t\t\t\tfor(i in params){\r\n");
      out.write("\t\t\t\t\tif(params[i] != ''){\r\n");
      out.write("\t\t\t\t\t\tmparams[i] = params[i];\r\n");
      out.write("\t\t\t\t\t}\r\n");
      out.write("\t\t\t\t}\r\n");
      out.write("\t\t\t\tpanel.queryParams = mparams;\r\n");
      out.write("\t\t\t\tadvanceWindow.hide();\r\n");
      out.write("\t\t\t\tpanel.refresh();\r\n");
      out.write("\t\t\t}\r\n");
      out.write("\t\t}, {\r\n");
      out.write("\t\t\ttext : '关闭',\r\n");
      out.write("\t\t\ticonCls : 'icon-sys-cancel',\r\n");
      out.write("\t\t\thandler : function(){\r\n");
      out.write("\t\t\t\tvar btn = btnAdvanceQueryButton;\r\n");
      out.write("\t\t\t\tadvanceWindow.hide();\r\n");
      out.write("\t\t\t}\r\n");
      out.write("\t\t}]\r\n");
      out.write("\t});\r\n");
      out.write("\tvar advanceWindow = new Ext.Window({\r\n");
      out.write("\t\twidth : 400,\r\n");
      out.write("\t\theight : 400,\r\n");
      out.write("\t\tresizable : true,\r\n");
      out.write("\t\ttitle : '员工积分档案视图高级查询',\r\n");
      out.write("\t\tmodal : true,\r\n");
      out.write("\t\tcloseAction : 'hide',\r\n");
      out.write("\t\tlayout : 'fit',\r\n");
      out.write("\t\titems:[advanceForm]\r\n");
      out.write("\t});\r\n");
      out.write("\tvar btnAdvanceQueryButton = new Ext.Action({\r\n");
      out.write("\t\ttext : '高级检索',\r\n");
      out.write("\t\ticonCls : 'icon-sys-aquery',\r\n");
      out.write("\t\thandler : function(){\r\n");
      out.write("\t\t\tadvanceForm.getForm().reset();\r\n");
      out.write("\t\t\tadvanceWindow.show();\r\n");
      out.write("\t\t}\r\n");
      out.write("\t});\r\n");
      out.write("\r\n");
      out.write("\t// 刷新按钮\r\n");
      out.write("\tvar btnRefresh = new Ext.Action({\r\n");
      out.write("\t\ttext : '刷新',\r\n");
      out.write("\t\ticonCls : 'icon-sys-refresh',\r\n");
      out.write("\t\thandler : function(){\r\n");
      out.write("\t\t\tstore.baseParams.querytype = 0;\r\n");
      out.write("\t\t\tpanel.refresh();\r\n");
      out.write("\t\t}\r\n");
      out.write("\t});\r\n");
      out.write("\t\r\n");
      out.write("\tvar buttons = [\"->\",btnOpen,btnAdd,btnExport,\"-\",quickQueryField,btnQuickQuery,\"-\",btnAdvanceQueryButton,\"-\",btnRefresh];\r\n");
      out.write("\tvar contextmenus = [btnOpen,btnAdd,btnExport];\r\n");
      out.write("\t// 表格对象\r\n");
      out.write("\tvar grid = new Ext.grid.GridPanel({\r\n");
      out.write("\t\tborder : false,\r\n");
      out.write("\t\tstripeRows: true,\r\n");
      out.write("\t\tenableHdMenu : true,\r\n");
      out.write("\t\tlineBreak : false,\r\n");
      out.write("\t\tcellSelect : true,\r\n");
      out.write("        loadMask: {msg:'正在装载...'},\r\n");
      out.write("\t\tautoExpandColumn : 'TOTAL',\r\n");
      out.write("\t\tsm : sm,\r\n");
      out.write("\t\tcolumns : columns,\r\n");
      out.write("\t\tstore : store,\r\n");
      out.write("\t\ttbar : buttons,\r\n");
      out.write("\t\tcontextMenu : new Ext.menu.Menu({items:contextmenus}),\r\n");
      out.write("\t\t//enableDragDrop : true,\r\n");
      out.write("\t\t// 输出附加脚本 begin\r\n");
      out.write("\t\t\t\t\r\n");
      out.write("\t\tddGroup : 'grid2tree',\r\n");
      out.write("\r\n");
      out.write("\t\tlisteners : {\r\n");
      out.write("\t\t\t'rowcontextmenu' : function(g, rowIndex, e){\r\n");
      out.write("\t\t\t\tg.getSelectionModel().selectRow(rowIndex);\r\n");
      out.write("\t\t\t\tg.contextMenu.showAt(e.getXY());\r\n");
      out.write("\t\t\t},\r\n");
      out.write("\t\t\t'rowdblclick' : function(g, rowIndex, e){\r\n");
      out.write("\t\t\t\tbtnOpen.execute();\r\n");
      out.write("\t\t\t}\r\n");
      out.write("\t\t},\r\n");
      out.write("\t\tgetSelectedRecords : function(){\r\n");
      out.write("\t\t\treturn this.getSelectionModel().getSelections();\r\n");
      out.write("\t\t}\r\n");
      out.write("\t});\r\n");
      out.write("\t\r\n");
      out.write("\tfunction getSelectedRecords(){\r\n");
      out.write("\t\treturn grid.getSelectedRecords();\r\n");
      out.write("\t}\r\n");
      out.write("\t\r\n");
      out.write("\t// 视图刷新\r\n");
      out.write("\tpanel.refresh = function(params){\r\n");
      out.write("\t\tif(Ext.isDefined(params)){\r\n");
      out.write("\t\t\t// 恢复查询方式\r\n");
      out.write("\t\t\tif(!Ext.isDefined(params.querytype)){\r\n");
      out.write("\t\t\t\tparams.querytype = 0;\r\n");
      out.write("\t\t\t\tstore.baseParams.querytype = 0;\r\n");
      out.write("\t\t\t}\r\n");
      out.write("\t\t\tpanel.params = params;\r\n");
      out.write("\t\t\tstore.baseParams.start = 0;\r\n");
      out.write("\t\t}\r\n");
      out.write("\t\t// 初始化参数\r\n");
      out.write("\t\tstore.baseParams.params = {};\r\n");
      out.write("\t\tExt.apply(store.baseParams.params, panel.viewparams);\r\n");
      out.write("\t\tExt.apply(store.baseParams.params, panel.params);\r\n");
      out.write("\t\t// 处理查询参数\r\n");
      out.write("\t\tif(store.baseParams.querytype != 0){\r\n");
      out.write("\t\t\tExt.apply(store.baseParams.params, panel.queryParams);\r\n");
      out.write("\t\t}\r\n");
      out.write("\r\n");
      out.write("\t\tstore.reload();\r\n");
      out.write("\r\n");
      out.write("\t}\r\n");
      out.write("\r\n");
      out.write("\t// 输出附加脚本 begin\r\n");
      out.write("panel.viewparams = {};\r\n");
      out.write("\r\n");
      out.write("\tpanel.exportToExcel = function() {\r\n");
      out.write("\t\tvar selects = grid.getSelectionModel().getSelections();\r\n");
      out.write("\t\tvar ids = [];\r\n");
      out.write("\t\tif (selects != null && selects.length > 0) {\r\n");
      out.write("\t\t\tfor (var i = 0; i < selects.length; i++) {\r\n");
      out.write("\t\t\t\tids[i] = selects[i].get(\"ID\");\r\n");
      out.write("\t\t\t}\r\n");
      out.write("\t\t}\r\n");
      out.write("\t\t\r\n");
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
      out.write("\t\talert(excelParams.params);\r\n");
      out.write("\t\texcelParams.params = Ext.util.JSON.encode(excelParams.params);\r\n");
      out.write("\t\tlocation.href = 'framework/engine/view/export.to.excel.do?' + Ext.urlEncode(excelParams);\r\n");
      out.write("\t}\r\n");
      out.write("\t\r\n");
      out.write("\t// 输出附加脚本 end\r\n");
      out.write("\tpanel.add(grid);\r\n");
      out.write("\tpanel.doLayout();\r\n");
      out.write("\t// 初始化视图数据\r\n");
      out.write("\tpanel.refresh(panel.initParams);\r\n");
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
