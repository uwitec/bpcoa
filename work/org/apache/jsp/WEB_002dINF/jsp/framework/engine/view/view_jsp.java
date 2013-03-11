/*
 * Generated by the Jasper component of Apache Tomcat
 * Version: Apache Tomcat/7.0.34
 * Generated at: 2013-02-19 02:10:44 UTC
 * Note: The last modified time of this file was set to
 *       the last modified time of the source file after
 *       generation to assist with modification tracking.
 */
package org.apache.jsp.WEB_002dINF.jsp.framework.engine.view;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;
import java.util.List;
import com.mixky.engine.common.Action;
import com.google.gson.JsonObject;
import com.mixky.engine.view.ViewManager;
import com.mixky.engine.view.View;
import com.mixky.engine.view.Column;
import com.mixky.engine.authority.AuthorityManager;
import com.mixky.engine.organization.User;
import com.mixky.engine.module.DocumentType;
import com.mixky.engine.common.DesignObjectLoader;

public final class view_jsp extends org.apache.jasper.runtime.HttpJspBase
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

	String panelid = request.getParameter("panelid");
	View view = (View)request.getAttribute("view");
	User user = (User)request.getAttribute("user");
	List<Action> actions = AuthorityManager.instance().getDesignObjectsByUser(view.getF_buttons(), user);
	List<Column> columns = AuthorityManager.instance().getDesignObjectsByUser(view.getF_columns(), user);
	JsonObject cfg = view.getF_config();
	// 支持自定义数据
	String directFn = "ViewAppDirect.getViewList";
	if(cfg != null && cfg.has("directFn")){
		directFn = cfg.get("directFn").getAsString();
	}

      out.write("\r\n");
      out.write("<script language='javascript'>\r\n");
      out.write("Ext.onReady(function(){\r\n");
      out.write("\r\n");
      out.write("\tvar panel = Ext.getCmp('");
      out.print(panelid);
      out.write("');\r\n");
      out.write("\tvar win = panel.findParentByType('window');\r\n");
      out.write("\r\n");
      out.write("\t// 数据访问\r\n");
      out.write("\tvar store = new Ext.data.DirectStore({\r\n");
      out.write("\t\tdirectFn : ");
      out.print(directFn);
      out.write(",\r\n");
      out.write("\t\tparamOrder : ['viewkey','querytype','limit','start','sort','dir','params'],\r\n");
      out.write("\t\tbaseParams : {viewkey:'");
      out.print(view.getKey());
      out.write("', querytype:");
      out.print(ViewManager.QT_NORMAL);
      out.write(",limit:");
      out.print(view.getF_page_size());
      out.write(", start:0, sort:'',dir:'',params:{}},\r\n");
      out.write("\t\tremoteSort : true,\r\n");
      out.write("\t\troot : 'results',\r\n");
      out.write("\t\ttotalProperty : 'totals',\r\n");
      out.write("\t\tidProperty : '");
      out.print(view.getF_keycolumn());
      out.write("',\r\n");
      out.write("\t\tfields : ");
      out.print(ViewManager.instance().getViewStoreFields(columns, view.getF_enable_favorite()));
      out.write("\r\n");
      out.write("\t});\r\n");

	// 收藏夹字段定义
	if(view.getF_enable_favorite()){
		String dtkey = view.getF_i_documenttype().get("data").getAsString();
		DocumentType dt = DesignObjectLoader.instance().loadDesignObject(dtkey);

      out.write("\r\n");
      out.write("\tvar favoriteColumn = new Mixky.app.favorite.FavoriteColumn({\r\n");
      out.write("\t\t   dataIndex: 'F_FAVORITE_FLAG',\r\n");
      out.write("\t\t   id: 'F_FAVORITE_FLAG',\r\n");
      out.write("\t\t   fixed : true,\r\n");
      out.write("\t\t   menuDisabled : true,\r\n");
      out.write("\t\t   documenttypekey : '");
      out.print(dtkey);
      out.write("',\r\n");
      out.write("\t\t   titleFieldName : '");
      out.print(view.getF_title_field());
      out.write("',\r\n");
      out.write("\t\t   width: 20\r\n");
      out.write("\t});\r\n");
      out.write("\tstore.on('load', function(s){\r\n");
      out.write("\t\tMixky.app.common.showFavoriteById(s, '");
      out.print(dtkey);
      out.write("');\r\n");
      out.write("\t});\r\n");

	}
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
      out.print(ViewManager.instance().getViewColumns(columns));
      out.write(";\r\n");
      out.write("\t// 视图操作\r\n");

	for(int i=0;i<actions.size();i++){
		Action action = actions.get(i);

      out.write('\r');
      out.write('\n');
      out.write('	');
      out.print(action.output());
      out.write('\r');
      out.write('\n');

	}
	// 处理查询
	if(ViewManager.instance().isViewHasQuery(view)){

      out.write("\r\n");
      out.write("\tvar ");
      out.print(ViewManager.VN_QUICK_QUERY_FIELD_NAME);
      out.write(" = new Ext.form.TextField({\r\n");
      out.write("\t\twidth : 100,\r\n");
      out.write("\t\temptyText : '输入快速检索字符',\r\n");
      out.write("        listeners: {\r\n");
      out.write("\t        specialkey: function(field, e){\r\n");
      out.write("\t            // e.HOME, e.END, e.PAGE_UP, e.PAGE_DOWN,\r\n");
      out.write("\t            // e.TAB, e.ESC, arrow keys: e.LEFT, e.RIGHT, e.UP, e.DOWN\r\n");
      out.write("\t            if (e.getKey() == e.ENTER) {\r\n");
      out.write("\t            \tvar value = field.getValue();\r\n");
      out.write("\t    \t\t\tif(Ext.isDefined(value) && value != ''){\r\n");
      out.write("\t    \t\t\t\tstore.baseParams.querytype = ");
      out.print(ViewManager.QT_QUICK);
      out.write(";\r\n");
      out.write("\t    \t\t\t\tpanel.queryParams = {");
      out.print(ViewManager.VN_QUICK_QUERY_PARAM_NAME);
      out.write(": value};\r\n");
      out.write("\t    \t\t\t\tpanel.refresh();\r\n");
      out.write("\t    \t\t\t}\r\n");
      out.write("\t            }\r\n");
      out.write("\t        }\r\n");
      out.write("\t    }\r\n");
      out.write("\t});\r\n");
      out.write("\tvar ");
      out.print(ViewManager.VN_QUICK_QUERY_BUTTON_NAME);
      out.write(" = new Ext.Action({\r\n");
      out.write("\t\ttext : '快速检索',\r\n");
      out.write("\t\ticonCls : 'icon-sys-query',\r\n");
      out.write("\t\thandler : function(){\r\n");
      out.write("\t\t\tvar value = ");
      out.print(ViewManager.VN_QUICK_QUERY_FIELD_NAME);
      out.write(".getValue();\r\n");
      out.write("\t\t\tif(Ext.isDefined(value) && value != ''){\r\n");
      out.write("\t\t\t\tstore.baseParams.querytype = ");
      out.print(ViewManager.QT_QUICK);
      out.write(";\r\n");
      out.write("\t\t\t\tpanel.queryParams = {");
      out.print(ViewManager.VN_QUICK_QUERY_PARAM_NAME);
      out.write(": value};\r\n");
      out.write("\t\t\t\tpanel.refresh();\r\n");
      out.write("\t\t\t}\r\n");
      out.write("\t\t}\r\n");
      out.write("\t});\r\n");
      out.write("\tvar advanceForm = new Ext.form.FormPanel({\r\n");
      out.write("\t\tpadding : 5,\r\n");
      out.write("\t\tlabelWidth : 80,\r\n");
      out.write("\t\tautoScroll : true,\r\n");
      out.write("\t\titems : ");
      out.print(ViewManager.instance().getViewQueryForm(view));
      out.write(",\r\n");
      out.write("\t\tbbar : ['->',{\r\n");
      out.write("\t\t\ttext : '执行检索',\r\n");
      out.write("\t\t\ticonCls : 'icon-sys-confirm',\r\n");
      out.write("\t\t\thandler : function(){\r\n");
      out.write("\t\t\t\tvar btn = ");
      out.print(ViewManager.VN_ADVANCE_QUERY_BUTTON_NAME);
      out.write(";\r\n");
      out.write("\t\t\t\tstore.baseParams.querytype = ");
      out.print(ViewManager.QT_ADVANCE);
      out.write(";\r\n");
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
      out.write("\t\t\t\tvar btn = ");
      out.print(ViewManager.VN_ADVANCE_QUERY_BUTTON_NAME);
      out.write(";\r\n");
      out.write("\t\t\t\tadvanceWindow.hide();\r\n");
      out.write("\t\t\t}\r\n");
      out.write("\t\t}]\r\n");
      out.write("\t});\r\n");
      out.write("\tvar advanceWindow = new Ext.Window({\r\n");
      out.write("\t\twidth : 400,\r\n");
      out.write("\t\theight : 400,\r\n");
      out.write("\t\tresizable : true,\r\n");
      out.write("\t\ttitle : '");
      out.print(view.getF_caption());
      out.write("视图高级查询',\r\n");
      out.write("\t\tmodal : true,\r\n");
      out.write("\t\tcloseAction : 'hide',\r\n");
      out.write("\t\tlayout : 'fit',\r\n");
      out.write("\t\titems:[advanceForm]\r\n");
      out.write("\t});\r\n");
      out.write("\tvar ");
      out.print(ViewManager.VN_ADVANCE_QUERY_BUTTON_NAME);
      out.write(" = new Ext.Action({\r\n");
      out.write("\t\ttext : '高级检索',\r\n");
      out.write("\t\ticonCls : 'icon-sys-aquery',\r\n");
      out.write("\t\thandler : function(){\r\n");
      out.write("\t\t\tadvanceForm.getForm().reset();\r\n");
      out.write("\t\t\tadvanceWindow.show();\r\n");
      out.write("\t\t}\r\n");
      out.write("\t});\r\n");

	}

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
      out.write("\t\r\n");
      out.write("\tvar buttons = ");
      out.print(ViewManager.instance().getViewButtonNames(view, actions));
      out.write(";\r\n");
      out.write("\tvar contextmenus = ");
      out.print(ViewManager.instance().getViewContextMenuNames(actions));
      out.write(";\r\n");
      out.write("\t// 表格对象\r\n");
      out.write("\tvar grid = new Ext.grid.GridPanel({\r\n");
      out.write("\t\tborder : false,\r\n");
      out.write("\t\tstripeRows: ");
      out.print(view.getStripeRows());
      out.write(",\r\n");
      out.write("\t\tenableHdMenu : true,\r\n");
      out.write("\t\tlineBreak : false,\r\n");
      out.write("\t\tcellSelect : true,\r\n");
      out.write("        loadMask: {msg:'正在装载...'},\r\n");
      out.write("\t\tautoExpandColumn : '");
      out.print(view.getF_autoexpandcolumn());
      out.write("',\r\n");
      out.write("\t\tsm : sm,\r\n");
      out.write("\t\tcolumns : columns,\r\n");
      out.write("\t\tstore : store,\r\n");
      out.write("\t\ttbar : buttons,\r\n");
      out.write("\t\tcontextMenu : new Ext.menu.Menu({items:contextmenus}),\r\n");
      out.write("\t\t//enableDragDrop : true,\r\n");
      out.write("\t\t// 输出附加脚本 begin\r\n");
      out.write("\t\t");

			if(cfg!=null && cfg.has("enableDragDrop")){
				out.print("enableDragDrop: " + cfg.get("enableDragDrop").getAsBoolean() + ",");
			}
		
      out.write("\t\t\r\n");
      out.write("\t\tddGroup : 'grid2tree',\r\n");

	//收藏夹字段定义
	if(view.getF_enable_favorite()){

      out.write("\r\n");
      out.write("\t\tplugins: [favoriteColumn],\r\n");

	}
		
	if(view.getF_page_size() > 0){

      out.write("\r\n");
      out.write("        bbar: new Ext.PagingToolbar({\r\n");
      out.write("        \tfirstText : '首页',\r\n");
      out.write("        \tlastText : '尾页',\r\n");
      out.write("        \tnextText : '下一页',\r\n");
      out.write("        \tprevText : '上一页',\r\n");
      out.write("        \trefreshText : '刷新',\r\n");
      out.write("        \tbeforePageText : '第',\r\n");
      out.write("        \tafterPageText : '页，共 {0} 页',\r\n");
      out.write("        \tdisplayMsg : '共 {2} 条，当前显示 {0} 到 {1} 条',\r\n");
      out.write("        \temptyMsg : '没有符合条件的数据',\r\n");
      out.write("            pageSize: ");
      out.print(view.getF_page_size());
      out.write(",\r\n");
      out.write("            store: store,\r\n");
      out.write("            displayInfo: true,\r\n");
      out.write("            items : [\r\n");
      out.write("                '-',\r\n");
      out.write("                '每页显示:',\r\n");
      out.write("                new Ext.form.ComboBox({\r\n");
      out.write("                    editable : false,\r\n");
      out.write("                    triggerAction: 'all',\r\n");
      out.write("                    width : 50,\r\n");
      out.write("               \t\tstore : [10, 20, 30, 50, 100, 200],\r\n");
      out.write("               \t\tvalue : ");
      out.print(view.getF_page_size());
      out.write(",\r\n");
      out.write("               \t\tlisteners : {\r\n");
      out.write("               \t\t\t'select' : function(c, record, index){\r\n");
      out.write("               \t\t\t\tgrid.getBottomToolbar().pageSize = c.getValue();\r\n");
      out.write("               \t\t\t\tgrid.getBottomToolbar().changePage(1);\r\n");
      out.write("               \t\t\t}\r\n");
      out.write("                   \t}\r\n");
      out.write("           \t\t})\r\n");
      out.write("            ],\r\n");
      out.write("            plugins: new Ext.ux.ProgressBarPager({defaultText:'正在装载数据...'}),\r\n");
      out.write("            listeners : {\r\n");
      out.write("                'beforechange' : function(a, b){\r\n");
      out.write("            \t\tstore.baseParams.limit = b.limit;\r\n");
      out.write("            \t\tstore.baseParams.start = b.start;\r\n");
      out.write("                }\r\n");
      out.write("            }\r\n");
      out.write("        }),\r\n");

	}

      out.write("\r\n");
      out.write("\t\tlisteners : {\r\n");
      out.write("\t\t\t'rowcontextmenu' : function(g, rowIndex, e){\r\n");
      out.write("\t\t\t\tg.getSelectionModel().selectRow(rowIndex);\r\n");
      out.write("\t\t\t\tg.contextMenu.showAt(e.getXY());\r\n");
      out.write("\t\t\t},\r\n");
      out.write("\t\t\t'rowdblclick' : function(g, rowIndex, e){\r\n");
      out.write("\t\t\t\t");
      out.print(ViewManager.instance().getDefaultButtonRun(view));
      out.write("\r\n");
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
      out.write("\t\t\t\tparams.querytype = ");
      out.print(ViewManager.QT_NORMAL);
      out.write(";\r\n");
      out.write("\t\t\t\tstore.baseParams.querytype = ");
      out.print(ViewManager.QT_NORMAL);
      out.write(";\r\n");
      out.write("\t\t\t}\r\n");
      out.write("\t\t\tpanel.params = params;\r\n");
      out.write("\t\t\tstore.baseParams.start = 0;\r\n");
      out.write("\t\t}\r\n");
      out.write("\t\t// 初始化参数\r\n");
      out.write("\t\tstore.baseParams.params = {};\r\n");
      out.write("\t\tExt.apply(store.baseParams.params, panel.viewparams);\r\n");
      out.write("\t\tExt.apply(store.baseParams.params, panel.params);\r\n");
      out.write("\t\t// 处理查询参数\r\n");
      out.write("\t\tif(store.baseParams.querytype != ");
      out.print(ViewManager.QT_NORMAL);
      out.write("){\r\n");
      out.write("\t\t\tExt.apply(store.baseParams.params, panel.queryParams);\r\n");
      out.write("\t\t}\r\n");
      out.write("\t\t\r\n");

		if(cfg!=null && cfg.has("refreshscript")){
			out.print(cfg.get("refreshscript").getAsString() + '\n');
		}		

      out.write('\r');
      out.write('\n');

	if(view.getF_page_size() > 0 && ViewManager.instance().isViewHasQuery(view)){

      out.write("\r\n");
      out.write("\t\tgrid.getBottomToolbar().moveFirst();\r\n");

	}else{

      out.write("\r\n");
      out.write("\t\tstore.reload();\r\n");

	}

      out.write("\r\n");
      out.write("\t}\r\n");
      out.write("\r\n");
      out.write("\t// 输出附加脚本 begin\r\n");

	if(cfg!=null && cfg.has("customscript")){
		out.print(cfg.get("customscript").getAsString() + '\n');
	}
	// 输出视图参数
	if(cfg!=null && cfg.has("params")){
		out.print("panel.viewparams = " + cfg.get("params") + ";");
	}else{
		out.print("panel.viewparams = {};");
	}


	

      out.write("\r\n");
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