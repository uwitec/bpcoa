/*
 * Generated by the Jasper component of Apache Tomcat
 * Version: Apache Tomcat/7.0.34
 * Generated at: 2013-02-21 03:11:31 UTC
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

public final class score_month_jsp extends org.apache.jasper.runtime.HttpJspBase
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
	String directFn = "ScoreAppDirect.getScoreMonthList";
	if(cfg.has("directFn")){
		directFn = cfg.get("directFn").getAsString();
	}
	
	boolean orderable = false;
	if(cfg != null && cfg.has("orderable")){
		orderable = cfg.get("orderable").getAsBoolean();
	}
	String defaultAction = "";

	String month = DateUtil.format(new Date(System.currentTimeMillis()), "yyyy-MM");

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
      out.write("\t\r\n");
      out.write("\t// 显示字段\r\n");
      out.write("\tvar fields = [{\r\n");
      out.write("\t\t\t\"name\":\"ID\",\"mapping\":\"ID\"\r\n");
      out.write("\t\t},{\r\n");
      out.write("\t\t\t\"name\":\"F_CAPTION\",\"mapping\":\"F_CAPTION\"\r\n");
      out.write("\t\t},{\r\n");
      out.write("\t\t\t\"name\":\"F_DEPT_NAME\",\"mapping\":\"F_DEPT_NAME\"\r\n");
      out.write("\t\t},{\r\n");
      out.write("\t\t\t\"name\":\"F_SCORE\",\"mapping\":\"F_SCORE\"\r\n");
      out.write("\t\t},{\r\n");
      out.write("\t\t\t\"name\":\"F_ADJUST_SCORE\",\"mapping\":\"F_ADJUST_SCORE\"\r\n");
      out.write("\t\t},{\r\n");
      out.write("\t\t\t\"name\":\"F_ADJUST_SCORE_TOTAL\",\"mapping\":\"F_ADJUST_SCORE_TOTAL\"\r\n");
      out.write("\t\t},{\r\n");
      out.write("\t\t\t\"name\":\"F_WEIGHT\",\"mapping\":\"F_WEIGHT\"\r\n");
      out.write("\t\t},{\r\n");
      out.write("\t\t\t\"name\":\"F_DEPT_WEIGHT\",\"mapping\":\"F_DEPT_WEIGHT\"\r\n");
      out.write("\t\t},{\r\n");
      out.write("\t\t\t\"name\":\"ADJUST_SCORE\",\"mapping\":\"ADJUST_SCORE\"\r\n");
      out.write("\t\t},{\r\n");
      out.write("\t\t\t\"name\":\"ADJUST_BONUS\",\"mapping\":\"ADJUST_BONUS\"\r\n");
      out.write("\t\t},{\r\n");
      out.write("\t\t\t\"name\":\"DEPT_TOTAL\",\"mapping\":\"DEPT_TOTAL\"\r\n");
      out.write("\t\t},{\r\n");
      out.write("\t\t\t\"name\":\"DEPT_PERCENT\",\"mapping\":\"DEPT_PERCENT\"\r\n");
      out.write("\t\t}];\r\n");
      out.write("\tfields.push({name:'rowstate', mapping:'rowstate'});\r\n");
      out.write("\r\n");
      out.write("\t// 数据访问\r\n");
      out.write("\tvar store = new Ext.data.DirectStore({\r\n");
      out.write("\t\tpruneModifiedRecords : true,\r\n");
      out.write("\t\tdirectFn : ");
      out.print(directFn);
      out.write(",\r\n");
      out.write("\t\tparamOrder : ['month'],\r\n");
      out.write("\t\tbaseParams : {month:'");
      out.print(month);
      out.write("'},\r\n");
      out.write("\t\tremoteSort : true,\r\n");
      out.write("\t\troot : 'results',\r\n");
      out.write("\t\ttotalProperty : 'totals',\r\n");
      out.write("\t\tidProperty : '");
      out.print(view.getF_keycolumn());
      out.write("',\r\n");
      out.write("\t\tfields : fields\r\n");
      out.write("\t});\r\n");
      out.write("\t\r\n");
      out.write("\tvar sm = new Ext.grid.RowSelectionModel({singleSelect : true});\r\n");
      out.write("\t\r\n");
      out.write("\t// 显示列\r\n");
      out.write("\tvar columns = [new Ext.grid.RowNumberer(),\r\n");
      out.write("\t\t{\"id\":\"F_CAPTION\",\"dataIndex\":\"F_CAPTION\",\"header\":\"姓名\",\"sortable\":false},\t\r\n");
      out.write("\t\t{\"id\":\"F_DEPT_NAME\",\"dataIndex\":\"F_DEPT_NAME\",\"header\":\"部门\",\"sortable\":false},\r\n");
      out.write("\t\t{\"id\":\"F_SCORE\",\"dataIndex\":\"F_SCORE\",\"header\":\"每日评分累计\",\"sortable\":false,\"width\":100},\r\n");
      out.write("\t\t{\"id\":\"F_ADJUST_SCORE\",\"dataIndex\":\"F_ADJUST_SCORE\",\"header\":\"考勤减扣\",\"sortable\":false,\"width\":80,\"editor\":{\"xtype\":\"numberfield\",\"selectOnFocus\":false,\"allowBlank\":false,\"maxLength\":10,\"allowDecimals\":true}},\r\n");
      out.write("\t\t{\"id\":\"F_ADJUST_SCORE_TOTAL\",\"dataIndex\":\"F_ADJUST_SCORE_TOTAL\",\"header\":\"得分\",\"sortable\":false,\"width\":100},\r\n");
      out.write("\t\t{\"id\":\"F_WEIGHT\",\"dataIndex\":\"F_WEIGHT\",\"header\":\"权重\",\"sortable\":false,\"width\":60,\"editor\":{\"xtype\":\"numberfield\",\"selectOnFocus\":false,\"allowBlank\":false,\"maxLength\":4,\"allowDecimals\":true}},\r\n");
      out.write("\t\t{\"id\":\"F_DEPT_WEIGHT\",\"dataIndex\":\"F_DEPT_WEIGHT\",\"header\":\"部门修正\",\"sortable\":false,\"width\":60,\"editor\":{\"xtype\":\"numberfield\",\"selectOnFocus\":true,\"allowBlank\":false,\"maxLength\":4,\"allowDecimals\":true}},\r\n");
      out.write("\t\t{\"id\":\"ADJUST_SCORE\",\"dataIndex\":\"ADJUST_SCORE\",\"header\":\"修正得分\",\"sortable\":false,\"width\":100,\"editor\":{\"xtype\":\"hidden\"}},\r\n");
      out.write("\t\t{\"id\":\"ADJUST_BONUS\",\"dataIndex\":\"ADJUST_BONUS\",\"header\":\"浮动分配\",\"sortable\":false,\"editor\":{\"xtype\":\"hidden\"}},\r\n");
      out.write("\t\t{\"id\":\"DEPT_TOTAL\",\"dataIndex\":\"DEPT_TOTAL\",\"header\":\"部门小计\",\"sortable\":false,\"editor\":{\"xtype\":\"hidden\"}},\r\n");
      out.write("\t\t{\"id\":\"DEPT_PERCENT\",\"dataIndex\":\"DEPT_PERCENT\",\"header\":\"部门比例\",\"sortable\":false,\"editor\":{\"xtype\":\"hidden\"}}];\r\n");
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
      out.write("\t// 保存按钮\r\n");
      out.write("\tvar btnSave = new Ext.Action({\r\n");
      out.write("\t\ttext : '保存',\r\n");
      out.write("\t\ticonCls : 'icon-sys-save',\r\n");
      out.write("\t\thandler : function(){\r\n");
      out.write("\t\t\tvar modifieds = store.getModifiedRecords();\r\n");
      out.write("\t\t\tif(modifieds.length > 0){\r\n");
      out.write("\t\t\t\tfor(var i =0;i<modifieds.length;i++){\r\n");
      out.write("\t\t\t\t\tvar record = modifieds[i];\r\n");
      out.write("\t\t\t\t\tvar item = record.getChanges();\r\n");
      out.write("\t\t\t\t\titem.ID = record.get('ID');\r\n");
      out.write("\t\t\t\t\titem.rowstate = record.get('rowstate');\r\n");
      out.write("\t\t\t\t\tScoreAppDirect.updateWeight(store.baseParams.month, item, function(result, e){\r\n");
      out.write("\t\t\t\t\t\tif(result && result.success){\r\n");
      out.write("\t\t\t\t\t\t\tpanel.hasSaved = true;\r\n");
      out.write("\t\t\t\t\t\t\tif(record.get('rowstate') == 'del'){\r\n");
      out.write("\t\t\t\t\t\t\t\tstore.remove(record);\r\n");
      out.write("\t\t\t\t\t\t\t}else{\r\n");
      out.write("\t\t\t\t\t\t\t\trecord.set('rowstate', '');\r\n");
      out.write("\t\t\t\t\t\t\t\trecord.commit();\r\n");
      out.write("\t\t\t\t\t\t\t}\r\n");
      out.write("\t\t\t\t\t\t\tpanel.submit();\r\n");
      out.write("\t\t\t\t\t\t}else{\r\n");
      out.write("\t\t\t\t\t\t\tMixkyApp.showDirectActionFail(\"保存失败\", result, e);\r\n");
      out.write("\t\t\t\t\t\t}\r\n");
      out.write("\t\t\t\t\t});\r\n");
      out.write("\t\t\t\t\tpanel.refresh();\r\n");
      out.write("\t\t\t\t}\r\n");
      out.write("\t\t\t}\r\n");
      out.write("\t\t}\r\n");
      out.write("\t});\r\n");
      out.write("\r\n");
      out.write("\t// 视图操作\r\n");
      out.write("\r\n");
      out.write("\tvar btnIniFromOrg =  new Ext.Action({\r\n");
      out.write("\t\t\"text\":\"初始化月积分\",\"iconCls\":\"icon-sys-run\",\"handler\":function(){\r\n");
      out.write("\t\tExt.MessageBox.confirm('操作提示', '该操作将从员工积分档案当中导入用户，所有数据将被初始化。您确定吗？', \r\n");
      out.write("\t\t\tfunction(btn){\r\n");
      out.write("\t\t\t\tif(btn == 'yes'){\r\n");
      out.write("\t\t\t\t\t// 初始化参数\r\n");
      out.write("\t\t\t\t\tvar month = dateSelect.getRawValue();\r\n");
      out.write("\t\t\t\t\t\r\n");
      out.write("\t\t\t\t\tScoreAppDirect.initScoreMonth(month, function(result, e){\r\n");
      out.write("\t\t\t\t\t\tif(result && result.success){\r\n");
      out.write("\t\t\t\t\t\t\tMixkyApp.showInfoMessage(\"初始化月积分表成功!\", \"操作提示\");\r\n");
      out.write("\t\t\t\t\t\t\tpanel.refresh();\r\n");
      out.write("\t\t\t\t\t\t}else{\r\n");
      out.write("\t\t\t\t\t\t\tMixkyApp.showDirectActionFail(\"初始化月积分表失败\", result, e);\r\n");
      out.write("\t\t\t\t\t\t}\r\n");
      out.write("\t\t\t\t\t});\r\n");
      out.write("\t\t\t\t}\r\n");
      out.write("\t\t\t});\r\n");
      out.write("\t\t}\r\n");
      out.write("\t});\r\n");
      out.write("\t\r\n");
      out.write("\t// 输入框\r\n");
      out.write("\tvar lblBonus =  new Ext.form.Label({\r\n");
      out.write("\t\ttext: '浮动总额:'\r\n");
      out.write("\t});\r\n");
      out.write("\tvar numberField = new Ext.form.NumberField();\r\n");
      out.write("\t\r\n");
      out.write("\tvar btnModify = new Ext.Button({\r\n");
      out.write("\t\ttext : ' 计算浮动分配 ',\r\n");
      out.write("\t\thandler : function(){\r\n");
      out.write("\t\t\tvar value = numberField.getValue();\r\n");
      out.write("\t\t\t\r\n");
      out.write("\t\t\tif(value == \"\"){\r\n");
      out.write("\t\t\t\tvalue = 0;\r\n");
      out.write("\t\t\t} else if (value < 0){\r\n");
      out.write("\t\t\t\tMixkyApp.showAlertMessage(\"浮动总额不能为负数\");\r\n");
      out.write("\t\t\t\treturn;\r\n");
      out.write("\t\t\t}\r\n");
      out.write("\t\t\tScoreAppDirect.updateBonus(value, store.baseParams.month, function(result, e){\r\n");
      out.write("\t\t\t\tif(result && result.success){\r\n");
      out.write("\t\t\t\t\tMixkyApp.showInfoMessage(\"浮动总额更新成功\", \"操作提示\");\r\n");
      out.write("\t\t\t\t\tpanel.refresh();\r\n");
      out.write("\t\t\t\t}else{\r\n");
      out.write("\t\t\t\t\tMixkyApp.showDirectActionFail(\"浮动总额更新失败\", result, e);\r\n");
      out.write("\t\t\t\t}\r\n");
      out.write("\t\t\t});\r\n");
      out.write("\t\t}\r\n");
      out.write("\t});\r\n");
      out.write("\t\r\n");
      out.write("\t// 选择当前月\r\n");
      out.write("\tvar dateSelect = new Ext.form.DateField({\r\n");
      out.write("\t\tvalue:'");
      out.print(month);
      out.write("', \r\n");
      out.write("\t\teditable : false, \r\n");
      out.write("\t\twidth : 70,\r\n");
      out.write("\t\tformat : 'Y-m',\r\n");
      out.write("\t\tlisteners : {\r\n");
      out.write("\t\t\t'select' : function(){\r\n");
      out.write("\t\t\t\tpanel.refresh();\r\n");
      out.write("\t\t\t}\r\n");
      out.write("\t\t}\r\n");
      out.write("\t});\r\n");
      out.write("\t// 上月\r\n");
      out.write("\tvar btnNextMonth = new Ext.Action({\r\n");
      out.write("\t\ticonCls : 'icon-sys-btnnext',\r\n");
      out.write("\t\thandler : function(){\r\n");
      out.write("\t\tvar date = Date.parseDate(store.baseParams.month + '-01', 'Y-m-d');\r\n");
      out.write("\t\t\tdateSelect.setValue(date.add(Date.MONTH, 1).format('Y-m-d'));\r\n");
      out.write("\t\t\tpanel.refresh();\r\n");
      out.write("\t\t}\r\n");
      out.write("\t});\r\n");
      out.write("\t// 下月\r\n");
      out.write("\tvar btnPreMonth = new Ext.Action({\r\n");
      out.write("\t\ticonCls : 'icon-sys-btnback',\r\n");
      out.write("\t\thandler : function(){\r\n");
      out.write("\t\tvar date = Date.parseDate(store.baseParams.month + '-01', 'Y-m-d');\r\n");
      out.write("\t\t\tdateSelect.setValue(date.add(Date.MONTH, -1).format('Y-m-d'));\r\n");
      out.write("\t\t\tpanel.refresh();\r\n");
      out.write("\t\t}\r\n");
      out.write("\t});\r\n");
      out.write("\r\n");
      out.write("\t// 导出表格\r\n");
      out.write("\tvar btnExport =  new Ext.Action({\"text\":\"导出到Excel\",\"iconCls\":\"icon-sys-btnexport\",\"handler\":function() {\r\n");
      out.write("\t     document.location=\"servlet/app/scoreMonth.export?date=\" + store.baseParams.month; \r\n");
      out.write("\t}});\r\n");
      out.write("\t\r\n");
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
      out.write("\t\tstripeRows: true,\r\n");
      out.write("\t\tenableHdMenu : true,\r\n");
      out.write("\t\tlineBreak : false,\r\n");
      out.write("\t\tcellSelect : true,\r\n");
      out.write("        loadMask: {msg:'正在装载...'},\r\n");
      out.write("\t\tautoExpandColumn : 'DEPT_PERCENT',\r\n");
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
      out.write("\t\ttbar : [btnPreMonth, dateSelect, btnNextMonth, '-',lblBonus,numberField, btnModify, '->', btnIniFromOrg, '-', btnExport, '-', btnSave, '-', btnRefresh],\r\n");
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
      out.write("\t// 获得被选中记录\r\n");
      out.write("\tfunction getSelectedRecords(){\r\n");
      out.write("\t\treturn grid.getSelectedRecords();\r\n");
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
      out.write("\r\n");
      out.write("\tpanel.refresh = function(params){\r\n");
      out.write("\t\tif(Ext.isDefined(params)){\r\n");
      out.write("\t\t\tpanel.params = params;\r\n");
      out.write("\t\t}\r\n");
      out.write("\t\t// 初始化参数\r\n");
      out.write("\t\tstore.baseParams.month = dateSelect.getRawValue();\r\n");
      out.write("\t\t\r\n");
      out.write("\t\tstore.baseParams.params = {};\r\n");
      out.write("\t\tExt.apply(store.baseParams.params, panel.viewparams);\r\n");
      out.write("\t\tExt.apply(store.baseParams.params, panel.params);\r\n");
      out.write("\t\tstore.reload();\r\n");
      out.write("\t}\r\n");
      out.write("\r\n");
      out.write("\t// 输出附加脚本 begin\r\n");
      out.write("\tpanel.viewparams = {};\r\n");
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
      out.write("\t\tvar excelParams = Ext.apply({viewkey:'mkScore.qScoreMonth.vScoreMonth', querytype:0,limit:0, start:0, sort:'',dir:'',params:{}},grid.getStore().baseParams);\r\n");
      out.write("\t\tExt.apply(excelParams,{ids: ids, colsStr:colsStr, colsNames:colsNames, panelTitle: panel.title});\r\n");
      out.write("\t\texcelParams.params = Ext.util.JSON.encode(excelParams.params);\r\n");
      out.write("\t\tlocation.href = 'framework/engine/view/export.to.excel.do?' + Ext.urlEncode(excelParams);\r\n");
      out.write("\t}\r\n");
      out.write("\t\r\n");
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