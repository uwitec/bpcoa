/*
 * Generated by the Jasper component of Apache Tomcat
 * Version: Apache Tomcat/7.0.34
 * Generated at: 2013-01-28 06:10:22 UTC
 * Note: The last modified time of this file was set to
 *       the last modified time of the source file after
 *       generation to assist with modification tracking.
 */
package org.apache.jsp.WEB_002dINF.jsp.framework.engine.view;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;
import java.util.List;
import java.util.Map;
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

public final class view_editor_jsp extends org.apache.jasper.runtime.HttpJspBase
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

	// 读取参数
	String panelid = request.getParameter("panelid");
	User user = (User)request.getAttribute("user");

	View view = (View)request.getAttribute("view");
	List<Action> buttons = AuthorityManager.instance().getDesignObjectsByUser(view.getF_buttons(), user);
	List<Column> columns = AuthorityManager.instance().getDesignObjectsByUser(view.getF_columns(), user);
	//List<Column> columns = view.getF_columns();
	//List<Action>  = view.getF_buttons();
	JsonObject cfg = view.getF_config();
	TableForm tableform = DesignObjectLoader.instance().loadDesignObject(cfg.get("editorform").getAsString());

	// 支持自定义数据
	String directFn = "ViewAppDirect.getViewList";
	if(cfg.has("directFn")){
		directFn = cfg.get("directFn").getAsString();
	}
	
	boolean orderable = false;
	if(cfg != null && cfg.has("orderable")){
		orderable = cfg.get("orderable").getAsBoolean();
	}
	String defaultAction = "";

      out.write("\r\n");
      out.write("<script language='javascript'>\r\n");
      out.write("Ext.onReady(function(){\r\n");
      out.write("\r\n");
      out.write("\tvar panel = Ext.getCmp('");
      out.print(panelid);
      out.write("');\r\n");
      out.write("\t// 是否支持排序\r\n");
      out.write("\tvar orderable = ");
      out.print(orderable);
      out.write(";\r\n");
      out.write("\t// 显示字段\r\n");
      out.write("\tvar fields = ");
      out.print(ViewManager.instance().getViewStoreFields(view.getF_columns()));
      out.write(";\r\n");
      out.write("\tfields.push({name:'rowstate', mapping:'rowstate'});\r\n");
      out.write("\t// 数据访问\r\n");
      out.write("\tvar store = new Ext.data.DirectStore({\r\n");
      out.write("\t\tpruneModifiedRecords : true,\r\n");
      out.write("\t\tdirectFn : ");
      out.print(directFn);
      out.write(",\r\n");
      out.write("\t\tparamOrder : ['viewkey','querytype','limit','start','sort','dir','params'],\r\n");
      out.write("\t\tbaseParams : {viewkey:'");
      out.print(view.getKey());
      out.write("', querytype:");
      out.print(ViewManager.QT_NORMAL);
      out.write(",limit:0, start:1, sort:'',dir:'',params:{}},\r\n");
      out.write("\t\tsortInfo: orderable ? {field:'F_ORDER', direction: 'ASC'} : undefined,\r\n");
      out.write("\t\troot : 'results',\r\n");
      out.write("\t\ttotalProperty : 'totals',\r\n");
      out.write("\t\tidProperty : '");
      out.print(view.getF_keycolumn());
      out.write("',\r\n");
      out.write("\t\tfields : fields\r\n");
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
      out.print(ViewManager.instance().getViewColumnsByTableForm(view.getF_columns(), tableform));
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

	for(int i=0;i<buttons.size();i++){
		Action button = buttons.get(i);
			// 输出按钮

      out.write('\r');
      out.write('\n');
      out.write('	');
      out.print(button.output());
      out.write("\r\n");
      out.write("\tbuttons.push(");
      out.print(button.getF_key());
      out.write(");\r\n");

		// 双击默认操作
		if(button.getF_default()){
			defaultAction = button.getF_key() + ".execute()";
		}
	}

      out.write("\r\n");
      out.write("\t// 行编辑插件\r\n");
      out.write("\tvar roweditor = new Ext.ux.grid.RowEditor({\r\n");
      out.write("\t    saveText: '确定',\r\n");
      out.write("\t    cancelText: '取消'\r\n");
      out.write("\t});\r\n");
      out.write("    // 处理编辑结果\r\n");
      out.write("    roweditor.on('validateedit', function(rd, changes){\r\n");
      out.write("        var cm = rd.grid.colModel;\r\n");
      out.write("        var valuefields = {};\r\n");
      out.write("        for(var k in changes){\r\n");
      out.write("\t\t\tif(changes[k] instanceof Date){\r\n");
      out.write("\t\t\t\tvar ed = cm.getColumnById(k).getEditor().field;\r\n");
      out.write("\t\t\t\tchanges[k] = ed.getRawValue();\r\n");
      out.write("\t\t\t}\r\n");
      out.write("\t\t\tif(Ext.isDefined(cm.getColumnById(k).valueField)){\r\n");
      out.write("\t\t\t\tvar ed = cm.getColumnById(k).getEditor().field;\r\n");
      out.write("\t\t\t\tchanges[k] = ed.getRawValue();\r\n");
      out.write("\t\t\t\tvaluefields[cm.getColumnById(k).valueField] = ed.getValue();\r\n");
      out.write("\t\t\t}\r\n");
      out.write("        }\r\n");
      out.write("        Ext.apply(changes, valuefields);\r\n");
      out.write("        return true;\r\n");
      out.write("    });\r\n");
      out.write("\t// 表格对象\r\n");
      out.write("\tvar grid = new Ext.grid.GridPanel({\r\n");
      out.write("\t\tborder : false,\r\n");
      out.write("\t\tstripeRows: false,\r\n");
      out.write("\t\tenableHdMenu : true,\r\n");
      out.write("\t\tautoExpandColumn : '");
      out.print(view.getF_autoexpandcolumn());
      out.write("',\r\n");
      out.write("\t\tplugins : [roweditor],\r\n");
      out.write("\t\tviewConfig:{\r\n");
      out.write("\t\t\tgetRowClass: function(record, index) {\r\n");
      out.write("\t\t\t\tif(record.dirty){\r\n");
      out.write("\t\t\t\t\treturn 'mixky-grid-row-changed';\r\n");
      out.write("\t\t\t\t}\r\n");
      out.write("\t\t    }\r\n");
      out.write("\t\t},\r\n");
      out.write("\t\tsm : sm,\r\n");
      out.write("\t\tcolumns : columns,\r\n");
      out.write("\t\tstore : store,\r\n");
      out.write("\t\ttbar : buttons,\r\n");
      out.write("\t\tlisteners : {\r\n");
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
      out.write("\t// 获得被选中记录\r\n");
      out.write("\tfunction getSelectedRecords(){\r\n");
      out.write("\t\treturn grid.getSelectedRecords();\r\n");
      out.write("\t}\r\n");
      out.write("\t// 上移\r\n");
      out.write("\tpanel.moveUp = function(){\r\n");
      out.write("\t\tif(roweditor.editing){\r\n");
      out.write("\t\t\tMixkyApp.showAlertMessage(\"无法移动，请关闭编辑界面\");\r\n");
      out.write("\t\t\treturn;\r\n");
      out.write("\t\t}\r\n");
      out.write("\t\tvar record = grid.getSelectionModel().getSelected();\r\n");
      out.write("\t\tif(!record){\r\n");
      out.write("\t\t\treturn;\r\n");
      out.write("\t\t}\r\n");
      out.write("\t\tvar index = grid.getStore().indexOf(record);\r\n");
      out.write("\t\tif(index == 0){\r\n");
      out.write("\t\t\treturn;\r\n");
      out.write("\t\t}\r\n");
      out.write("\t\tvar recordPre = store.getAt(index - 1);\r\n");
      out.write("\t\trecord.set('F_ORDER', index);\r\n");
      out.write("\t\trecordPre.set('F_ORDER', index + 1);\r\n");
      out.write("\t\tgrid.getStore().sort('F_ORDER', 'ASC');\r\n");
      out.write("\t}\r\n");
      out.write("\t// 下移\r\n");
      out.write("\tpanel.moveDown = function(){\r\n");
      out.write("\t\tif(roweditor.editing){\r\n");
      out.write("\t\t\tMixkyApp.showAlertMessage(\"无法移动，请关闭编辑界面\");\r\n");
      out.write("\t\t\treturn;\r\n");
      out.write("\t\t}\r\n");
      out.write("\t\tvar record = grid.getSelectionModel().getSelected();\r\n");
      out.write("\t\tif(!record){\r\n");
      out.write("\t\t\treturn;\r\n");
      out.write("\t\t}\r\n");
      out.write("\t\tvar index = grid.getStore().indexOf(record);\r\n");
      out.write("\t\tvar recordNext = store.getAt(index + 1);\r\n");
      out.write("\t\trecord.set('F_ORDER', index + 2);\r\n");
      out.write("\t\trecordNext.set('F_ORDER', index + 1);\r\n");
      out.write("\t\tgrid.getStore().sort('F_ORDER', 'ASC');\r\n");
      out.write("\t}\r\n");
      out.write("\t// 添加\r\n");
      out.write("\tpanel.addRecord = function(config){\r\n");
      out.write("\t\tif(roweditor.editing){\r\n");
      out.write("\t\t\tMixkyApp.showAlertMessage(\"无法添加，请关闭编辑界面\");\r\n");
      out.write("\t\t\treturn;\r\n");
      out.write("\t\t}\r\n");
      out.write("\t\tMixky.lib.getNewTableRecordId('");
      out.print(tableform.getParent().getF_key());
      out.write("', function(newId){\r\n");
      out.write("\t\t\tvar record = new store.recordType(Ext.apply({ID : newId, rowstate : 'add'}, config), newId);\r\n");
      out.write("\t\t\tvar index = store.getCount();\r\n");
      out.write("\t\t\tstore.insert(index, record);\r\n");
      out.write("\t\t\tif(orderable){\r\n");
      out.write("\t\t\t\trecord.set('F_ORDER', index + 1);\r\n");
      out.write("\t\t\t}\r\n");
      out.write("\t\t\tgrid.getSelectionModel().selectRow(index);\r\n");
      out.write("\t\t});\r\n");
      out.write("\t}\r\n");
      out.write("\t// 删除\r\n");
      out.write("\tpanel.removeRecord = function(){\r\n");
      out.write("\t\tif(roweditor.editing){\r\n");
      out.write("\t\t\tMixkyApp.showAlertMessage(\"无法删除，请关闭编辑界面\");\r\n");
      out.write("\t\t\treturn;\r\n");
      out.write("\t\t}\r\n");
      out.write("\t\tvar cm = grid.getSelectionModel();\r\n");
      out.write("\t\tvar record = cm.getSelected();\r\n");
      out.write("\t\tif(record){\r\n");
      out.write("\t\t\tvar index = store.indexOf(record);\r\n");
      out.write("\t\t\tif(record.get('rowstate') == 'add'){\r\n");
      out.write("\t\t\t\tstore.remove(record);\r\n");
      out.write("\t\t\t}else{\r\n");
      out.write("\t\t\t\trecord.set('rowstate', 'del');\r\n");
      out.write("\t\t\t\tstore.filterBy(function(record, id){\r\n");
      out.write("\t\t\t\t\tif(record.get('rowstate') == 'del'){\r\n");
      out.write("\t\t\t\t\t\treturn false;\r\n");
      out.write("\t\t\t\t\t}else{\r\n");
      out.write("\t\t\t\t\t\treturn true;\r\n");
      out.write("\t\t\t\t\t}\r\n");
      out.write("\t\t\t\t});\r\n");
      out.write("\t\t\t}\r\n");
      out.write("\t\t\tif(orderable){\r\n");
      out.write("\t\t\t\tfor(var i=index;i<store.getCount();i++){\r\n");
      out.write("\t\t\t\t\tvar record = store.getAt(i);\r\n");
      out.write("\t\t\t\t\trecord.set('F_ORDER', i + 1);\r\n");
      out.write("\t\t\t\t}\r\n");
      out.write("\t\t\t}\r\n");
      out.write("\t\t\tif(store.getCount() > 0){\r\n");
      out.write("\t\t\t\tif(index >= store.getCount() - 1){\r\n");
      out.write("\t\t\t\t\tcm.selectLastRow()\r\n");
      out.write("\t\t\t\t}else{\r\n");
      out.write("\t\t\t\t\tcm.selectRow(index)\r\n");
      out.write("\t\t\t\t}\r\n");
      out.write("\t\t\t}\r\n");
      out.write("\t\t}\r\n");
      out.write("\t}\r\n");
      out.write("\t// 保存列表\r\n");
      out.write("\tpanel.submit = function(){\r\n");
      out.write("\t\tif(roweditor.editing){\r\n");
      out.write("\t\t\tMixkyApp.showAlertMessage(\"无法保存，请关闭【");
      out.print(tableform.getF_caption());
      out.write("】编辑界面\");\r\n");
      out.write("\t\t\treturn;\r\n");
      out.write("\t\t}\r\n");
      out.write("\t\tvar modifieds = store.getModifiedRecords();\r\n");
      out.write("\t\tif(modifieds.length > 0){\r\n");
      out.write("\t\t\tvar record = modifieds[0];\r\n");
      out.write("\t\t\tvar item = record.getChanges();\r\n");
      out.write("\t\t\titem.ID = record.get('ID');\r\n");
      out.write("\t\t\titem.rowstate = record.get('rowstate');\r\n");
      out.write("\t\t\tDocumentAppDirect.submitRowForm('");
      out.print(tableform.getKey());
      out.write("', item, function(result, e){\r\n");
      out.write("\t\t\t\tif(result && result.success){\r\n");
      out.write("\t\t\t\t\tpanel.hasSaved = true;\r\n");
      out.write("\t\t\t\t\tif(record.get('rowstate') == 'del'){\r\n");
      out.write("\t\t\t\t\t\tstore.remove(record);\r\n");
      out.write("\t\t\t\t\t}else{\r\n");
      out.write("\t\t\t\t\t\trecord.set('rowstate', '');\r\n");
      out.write("\t\t\t\t\t\trecord.commit();\r\n");
      out.write("\t\t\t\t\t}\r\n");
      out.write("\t\t\t\t\tpanel.submit();\r\n");
      out.write("\t\t\t\t}else{\r\n");
      out.write("\t\t\t\t\tMixkyApp.showDirectActionFail(\"保存【");
      out.print(tableform.getF_caption());
      out.write("】数据\", result, e);\r\n");
      out.write("\t\t\t\t}\r\n");
      out.write("\t\t\t});\r\n");
      out.write("\t\t}else{\r\n");
      out.write("\t\t\tif(panel.hasSaved){\r\n");
      out.write("\t\t\t\tpanel.hasSaved = undefined;\r\n");
      out.write("\t\t\t\tgrid.getStore().reload();\r\n");
      out.write("\t\t\t}\r\n");
      out.write("\t\t\tMixkyApp.showInfoMessage(\"保存完毕\");\r\n");
      out.write("\t\t}\r\n");
      out.write("\t}\r\n");
      out.write("\t\r\n");
      out.write("\tpanel.refresh = function(params){\r\n");
      out.write("\t\tif(Ext.isDefined(params)){\r\n");
      out.write("\t\t\tpanel.params = params;\r\n");
      out.write("\t\t}\r\n");
      out.write("\t\t// 初始化参数\r\n");
      out.write("\t\tstore.baseParams.params = {};\r\n");
      out.write("\t\tExt.apply(store.baseParams.params, panel.viewparams);\r\n");
      out.write("\t\tExt.apply(store.baseParams.params, panel.params);\r\n");
      out.write("\t\tstore.reload();\r\n");
      out.write("\t}\r\n");
      out.write("\r\n");
      out.write("\t// 输出附加脚本 begin\r\n");

	if(cfg!=null && cfg.has("customscript")){
		out.print(cfg.get("customscript").getAsString() + '\n');
	}
	
	if(cfg!=null && cfg.has("params")){
		out.print("panel.viewparams = " + cfg.get("params") + ";");
	}else{
		out.print("panel.viewparams = {};");
	}

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
