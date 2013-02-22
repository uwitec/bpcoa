<%@ page contentType="text/html; charset=utf-8"%>
<%@ page import="java.util.List"%>
<%@ page import="com.mixky.engine.common.DesignObjectLoader"%>
<%@ page import="com.mixky.engine.module.Module"%>
<%@ page import="com.mixky.engine.module.ModuleRole"%>

<%
	String id = request.getParameter("id");
	String key = request.getParameter("key");
	
	Module module = DesignObjectLoader.instance().loadDesignObject(key);
	List<ModuleRole> moduleroles = module.getF_roles();
%>
<script language='javascript'>
Ext.onReady(function(){
	var id = '<%=id%>';
	var key = '<%=key%>';

	var panel = Ext.getCmp(id);
	panel.setTitle('设计对象权限列表');

	var colplugins = [];
	var fields = [
		{name:'f_class', mapping:'f_class'},
	  	{name:'key', mapping:'key'},
		{name:'f_name', mapping:'f_name'},
		{name:'f_caption', mapping:'f_caption'}
	];
	var columns = [new Ext.grid.RowNumberer(),{
		id : 'f_class',
		dataIndex : 'f_class',
		editable:false,
		width:70,
		header : '类型',
		renderer : function(value, p, record){
			var type = record.get("f_class");
			return String.format("<div style='height:16px;padding-left:23px;background:transparent url(icon/{0}.gif) no-repeat'> {1}</div>", type, value);
		}
	},{
		id : 'key',
		dataIndex : 'key',
		editable:false,
		header : 'Key',
		width:300,
	},{
		id : 'f_caption',
		dataIndex : 'f_caption',
		editable:false,
		width:100,
		header : '名称'
	}];
	var rolekeys = [];
<%
	for(int i=0;i<moduleroles.size();i++){
		ModuleRole modulerole = moduleroles.get(i);
%>
	var col<%=modulerole.getF_key()%> = new Ext.grid.CheckColumn({
		id : '<%=modulerole.getF_key()%>',
		dataIndex : '<%=modulerole.getF_key()%>',
		fixed:true,
		header : '<%=modulerole.getF_caption()%>',
		width : 100
	});
	colplugins.push(col<%=modulerole.getF_key()%>);
	fields.push({name:'<%=modulerole.getF_key()%>',mapping:'<%=modulerole.getF_key()%>'});
	columns.push(col<%=modulerole.getF_key()%>);
	rolekeys.push('<%=modulerole.getF_key()%>');
<%
	}
%>

	// 数据访问
	var store = new Ext.data.DirectStore({
		directFn : DesignToolDirect.getModuleAuthority,
		paramOrder:['key'],
		baseParams : {
			key : key
		},
		root : 'results',
		totalProperty : 'totals',
		idProperty : 'key',
		sortInfo: {field:'key', direction: 'ASC'},
		fields : fields
	});
	
	var grid = new Ext.grid.GridPanel({
		border : true,
		columns : columns,
		enableHdMenu : false,
		enableColumnMove : false,
	    clicksToEdit : 1,
	    plugins : colplugins,
		store : store
	});


	// 保存属性修改
	panel.save = function(needSaveNext){
		var auths = {};
		for(var i=0;i<store.getCount();i++){
			var record = store.getAt(i);
			var auth = [];
			for(var j=0;j<rolekeys.length;j++){
				if(record.get(rolekeys[j])){
					auth.push(rolekeys[j]);
				}
			}
			if(auth.length > 0){
				auths[record.get('key')] = auth;
			}
		}
		DesignToolDirect.saveModuleAuthorities(key, auths, function(result, e){
			if(result && result.success){
				store.commitChanges();
				Mixky.designtool.Framework.contentPanel.savePanelOver(panel, needSaveNext);
			}
		});
	};
	
	// 刷新
	panel.refresh = function(){
		store.reload();
	}
	
	panel.add(grid);
	panel.doLayout();
	store.reload();
});
</script>