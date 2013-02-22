<%@ page contentType="text/html; charset=utf-8"%>
<%@ page import="java.util.List"%>
<%@ page import="com.google.gson.JsonObject"%>
<%@ page import="com.mixky.engine.common.Action"%>
<%@ page import="com.mixky.engine.view.ViewManager"%>
<%@ page import="com.mixky.engine.view.View"%>
<%@ page import="com.mixky.engine.view.Column"%>
<%@ page import="com.mixky.engine.common.DesignObjectLoader"%>
<%
	String panelid = request.getParameter("panelid");
	View view = (View)request.getAttribute("view");
	List<Column> columns = view.getF_columns();
	List<Action> actions = view.getF_buttons();
	JsonObject cfg = view.getF_config();
%>
<script language='javascript'>
Ext.onReady(function(){

	var panel = Ext.getCmp('<%=panelid%>');
	
	var store = new Ext.data.DirectStore({
		directFn : ViewAppDirect.getViewList,
		paramOrder : ['viewkey','querytype','limit','start','sort','dir','params'],
		baseParams : {viewkey:'<%=view.getKey()%>', querytype:<%=ViewManager.QT_NORMAL%>,limit:<%=view.getF_page_size()%>, start:1, sort:'',dir:'',params:{}},
		remoteSort : true,
		root : 'results',
		totalProperty : 'totals',
		idProperty : 'ID',
		fields : <%=ViewManager.instance().getViewStoreFields(view.getF_columns())%>
	});

	// 显示列
	var columns = <%=ViewManager.instance().getViewColumns(view.getF_columns())%>;

	// 选择器
	var sm = new Ext.grid.RowSelectionModel({singleSelect : true});

	// 视图按钮
	var buttons = [];
	
	// 输出视图操作
<%
	for(int i=0;i<view.getF_buttons().size();i++){
		Action action = view.getF_buttons().get(i);
%>
	var <%=action.getF_key()%> = new Ext.Action({
		text : '<%=action.getF_caption()%>',
		iconCls : '<%=action.getF_icon()%>',
		isDefault : <%=action.getF_default()%>,
<%
		if(action.getF_handler() == null || "".equals(action.getF_handler())){
%>
		handler : Ext.emptyFn
<%
		}else{
%>
		handler : <%=action.getF_handler()%>
<%
		}
%>
	});
	buttons.push(<%=action.getF_key()%>);
<%
	}
%>
	buttons.push('->');
	// 主题检索
	var <%=ViewManager.VN_QUICK_QUERY_FIELD_NAME%> = new Ext.form.TextField({
		width : 100,
		emptyText : '输入检索条件'
	});
	var <%=ViewManager.VN_QUICK_QUERY_BUTTON_NAME%> = new Ext.Action({
		text : '主题检索',
		iconCls : 'icon-app-quickquery',
		handler : function(){
			var value = <%=ViewManager.VN_QUICK_QUERY_FIELD_NAME%>.getValue();
			if(Ext.isDefined(value) && value != ''){
				store.baseParams.querytype = <%=ViewManager.QT_QUICK%>;
				panel.queryParams = {<%=ViewManager.VN_QUICK_QUERY_PARAM_NAME%>: value};
				panel.refresh();
			}
		}
	});
	buttons.push('-');
	buttons.push(<%=ViewManager.VN_QUICK_QUERY_FIELD_NAME%>);
	buttons.push(<%=ViewManager.VN_QUICK_QUERY_BUTTON_NAME%>);
	// 刷新按钮
	var <%=ViewManager.VN_REFRESH_BUTTON_NAME%> = new Ext.Action({
		text : '刷新',
		iconCls : 'icon-app-refresh',
		handler : function(){
			store.baseParams.querytype = <%=ViewManager.QT_NORMAL%>;
			panel.refresh();
		}
	});
	buttons.push('-');
	buttons.push(<%=ViewManager.VN_REFRESH_BUTTON_NAME%>);

	// 渲染主题
	var renderTopic = function(value, p, r){
        return String.format(
                '<div style="padding-left:20px;background:transparent url({1}) no-repeat 0 2px;"><b style="display:block;color:#333;">{0}</b><span style="color:#333;">{2}</span></div>',
                value,
                r.data['F_SUBJECT_TYPE'],
				r.data['F_AUTHOR_TITLE']);
    };
	// 渲染辅助信息
	var renderPost = function(value, p, r){
        return String.format('<span style="font-weight:bold;color:#333;">{0}</span><br/>by {1}', 
                value, 
                r.data['F_AUTHOR_TITLE']);
    };

	// 表格对象
	var grid = new Ext.grid.GridPanel({
		border : false,
		enableHdMenu : true,
        loadMask: {msg:'正在装载...'},
        trackMouseOver:false,
		autoExpandColumn : '<%=view.getF_autoexpandcolumn()%>',
		sm : sm,
		cm : new Ext.grid.ColumnModel([{
           id: 'topic',
           header: "主题",
           dataIndex: 'F_TITLE',
           width: 420,
           renderer: renderTopic
        },{
           header: "回复",
           dataIndex: 'F_VIEW_COUNT',
           width: 40,
           align: 'right'
        },{
           id: 'last',
           header: "最后回复",
           dataIndex: 'F_UPDATED',
           width: 150,
           renderer: renderPost
        }]),
		store : store,
		tbar : buttons,
        bbar: new Ext.PagingToolbar({
        	firstText : '首页',
        	lastText : '尾页',
        	nextText : '下一页',
        	prevText : '上一页',
        	refreshText : '刷新',
        	beforePageText : '第',
        	afterPageText : '页，共 {0} 页',
        	displayMsg : '共 {2} 条，当前显示 {0} 到 {1} 条',
        	emptyMsg : '没有符合条件的主题',
            pageSize: <%=view.getF_page_size()%>,
            store: store,
            displayInfo: true,
            items : [
                '-',
                '每页显示:',
                new Ext.form.ComboBox({
                    editable : false,
                    triggerAction: 'all',
                    width : 50,
               		store : [10, 20, 30, 50, 100, 200],
               		value : <%=view.getF_page_size()%>,
               		listeners : {
               			'select' : function(c, record, index){
               				grid.getBottomToolbar().pageSize = c.getValue();
               				grid.getBottomToolbar().changePage(1);
               			}
                   	}
           		})
            ],
            plugins: new Ext.ux.ProgressBarPager({defaultText:'正在装载数据...'})
        }),
		listeners : {
			'rowdblclick' : function(g, rowIndex, e){
				<%=ViewManager.instance().getDefaultButtonRun(view)%>
			}
		},
        viewConfig: {
            forceFit:true,
            enableRowBody:true,
            showPreview:true,
            getRowClass : function(record, rowIndex, p, ds){
                if(this.showPreview){
                    p.body = '<p style="margin:5px 20px 10px 25px !important;color:#555;">'+record.data['F_CONTENT']+'</p>';
                    return 'x-grid3-row-expanded';
                }
                return 'x-grid3-row-collapsed';
            }
        },
		getSelectedRecords : function(){
			return this.getSelectionModel().getSelections();
		}
	});
	
	function getSelectedRecords(){
		return grid.getSelectedRecords();
	}
	
	// 视图刷新
	panel.refresh = function(params){
		if(Ext.isDefined(params)){
			panel.params = params;
		}
		// 初始化参数
		store.baseParams.params = Ext.apply({F_STATE:0},panel.params);
		// 处理查询参数
		if(store.baseParams.querytype != <%=ViewManager.QT_NORMAL%>){
			Ext.apply(store.baseParams.params, panel.queryParams);
		}
		grid.getBottomToolbar().moveFirst();
	}
	
	panel.add(grid);
	panel.doLayout();
	// 初始化视图数据
	panel.refresh(panel.initParams);
});
</script>