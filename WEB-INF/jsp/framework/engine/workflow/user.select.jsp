<%@ page contentType="text/html; charset=utf-8"%>
<%@ page import="com.google.gson.JsonObject"%>
<%@ page import="com.google.gson.JsonArray"%>
<%@ page import="com.google.gson.JsonPrimitive"%>
<%@ page import="com.mixky.engine.workflow.transaction.ClientData"%>
<%@ page import="com.mixky.engine.workflow.template.Node"%>
<%
	// 读取参数
	String panelid = request.getParameter("panelid");
	ClientData clientdata = (ClientData) request
			.getAttribute("clientdata");
	boolean selectMulti = false;
	Node node = clientdata.destNode;
	if (node != null) {
		if (node.getF_process_type() != Node.NODE_PTYPE_SINGLE_PROCESSOR) {
			selectMulti = true;
		} else {
			// 判断申请办理
		}
	}
	JsonArray deptusers = (JsonArray) request.getAttribute("deptusers");
	JsonArray autousers = new JsonArray();
	if (clientdata.users != null) {
		for (int i = 0; i < clientdata.users.size(); i++) {
			if (clientdata.users.get(i) == null) {
				continue;
			}
			JsonObject userjson = new JsonObject();
			userjson.addProperty("text", clientdata.users.get(i).getF_caption());
			userjson.addProperty("iconCls", "icon-sys-user");
			userjson.addProperty("type", "user");
			userjson.addProperty("leaf", true);
			userjson.addProperty("expression", clientdata.users.get(i).getUserExpression().getExpressionString());
			autousers.add(userjson);
		}
	}
	JsonArray processors = new JsonArray();
	if (clientdata.processors != null) {
		for (int i = 0; i < clientdata.processors.size(); i++) {
			JsonArray userjson = new JsonArray();
			userjson.add(new JsonPrimitive(clientdata.processors.get(i).getUserExpression().getExpressionString()));
			userjson.add(new JsonPrimitive(clientdata.processors.get(i).getF_caption()));
			processors.add(userjson);
		}
	}
	JsonArray assistants = new JsonArray();
	if (clientdata.assistants != null) {
		for (int i = 0; i < clientdata.assistants.size(); i++) {
			JsonArray userjson = new JsonArray();
			userjson.add(new JsonPrimitive(clientdata.assistants.get(i).getUserExpression().getExpressionString()));
			userjson.add(new JsonPrimitive(clientdata.assistants.get(i).getF_caption()));
			assistants.add(userjson);
		}
	}
	JsonArray readers = new JsonArray();
	if (clientdata.readers != null) {
		for (int i = 0; i < clientdata.readers.size(); i++) {
			JsonArray userjson = new JsonArray();
			userjson.add(new JsonPrimitive(clientdata.readers.get(i).getUserExpression().getExpressionString()));
			userjson.add(new JsonPrimitive(clientdata.readers.get(i).getF_caption()));
			readers.add(userjson);
		}
	}
%>
<script language='javascript'>
Ext.onReady(function(){
	var panel = Ext.getCmp('<%=panelid%>');
	// 数据访问
	var storeprocessors = new Ext.data.SimpleStore({
		idIndex: 0,
		fields : ['expression', 'f_caption'],
		data : <%=processors%>
	});
	var storeassistants = new Ext.data.SimpleStore({
		idIndex: 0,
		fields : ['expression', 'f_caption'],
		data : <%=assistants%>
	});
	var storereaders = new Ext.data.SimpleStore({
		idIndex: 0,
		fields : ['expression', 'f_caption'],
		data : <%=readers%>
	});
	// 用户选择列表
	var tree = new Ext.tree.TreePanel({
		region:'center',
		title : '可选用户列表',
		rootVisible: false,
		autoScroll: true,
		loader: new Ext.tree.TreeLoader({
			preloadChildren: true
		}),
		root: {
			children : [{
				text : '智能流转',
				children : <%=autousers%>
			}, {
				text : '自由流转',
				children : <%=deptusers%>
			}]
		}
	});
	// 主办人员
	var gridprocessors = new Ext.grid.GridPanel({
		title : '主办',
		hideHeaders : true,
		autoExpandColumn : 'f_caption',
		sm: new Ext.grid.RowSelectionModel({singleSelect:true}),
		store : storeprocessors,
		columns : [new Ext.grid.RowNumberer(), {
			id : 'f_caption',
			dataIndex : 'f_caption',
			header : '用户名'
		}]
	});
	// 协办人员
	var gridassistants = new Ext.grid.GridPanel({
		title : '协办',
		hideHeaders : true,
		autoExpandColumn : 'f_caption',
		sm: new Ext.grid.RowSelectionModel({singleSelect:true}),
		store : storeassistants,
		columns : [new Ext.grid.RowNumberer(), {
			id : 'f_caption',
			dataIndex : 'f_caption',
			header : '用户名'
		}]
	});
	// 阅读人员
	var gridreaders = new Ext.grid.GridPanel({
		title : '读者',
		hideHeaders : true,
		autoExpandColumn : 'f_caption',
		sm: new Ext.grid.RowSelectionModel({singleSelect:true}),
		store : storereaders,
		columns : [new Ext.grid.RowNumberer(), {
			id : 'f_caption',
			dataIndex : 'f_caption',
			header : '用户名'
		}]
	});
	var tabs = new Ext.TabPanel({
		tabPosition:'bottom',
		xtype:'tabpanel',
		activeTab:0,
		items:[gridprocessors, gridassistants, gridreaders]
	});
	// 处理选中节点
	function addNodeToStore(node, store){
		if(node.attributes.type == 'user'){
			var caption = node.attributes.text;
			var expression = node.attributes.expression;
			var record = store.getById(expression);
			if(!record){
				record = new store.recordType({'f_caption' : caption, 'expression' : expression}, expression);
				store.insert(store.getCount(), record);
			}
		}else{
			node.eachChild(function(n){
				addNodeToStore(n, store);
			});
		}
	}
	// 选择用户
	tree.on('dblclick', function(node, e){
		if(!Ext.isDefined(node.attributes.expression)){
			return;
		}
		var tab = tabs.getActiveTab();
		var store = tab.getStore();
		if(tab == gridprocessors && !<%=selectMulti%>){
			if(node.attributes.type != 'user'){
				MixkyApp.showAlertMessage('单人办理节点，只允许选择用户！');
				return;
			}else if(store.getCount() > 0){
				storeprocessors.removeAll();
			}
		}
		addNodeToStore(node, store);
		store.commitChanges();
	});
	// 取消选择用户
	gridprocessors.on('rowdblclick', function(g, index, e){
		storeprocessors.removeAt(index);
	});
	gridassistants.on('rowdblclick', function(g, index, e){
		storeassistants.removeAt(index);
	});
	gridreaders.on('rowdblclick', function(g, index, e){
		storereaders.removeAt(index);
	});
	// 提交表单数据
	panel.beforeSubmit = function(params){
		if(storeprocessors.getCount() == 0){
			MixkyApp.showAlertMessage('没有选择主办理人员，无法提交！');
			return false;
		}
		var processors = [];
		var assistants = [];
		var readers = [];
		for(var i=0;i<storeprocessors.getCount();i++){
			var record = storeprocessors.getAt(i);
			processors.push(record.get('expression'));
		}
		for(var i=0;i<storeassistants.getCount();i++){
			var record = storeassistants.getAt(i);
			assistants.push(record.get('expression'));
		}
		for(var i=0;i<storereaders.getCount();i++){
			var record = storereaders.getAt(i);
			readers.push(record.get('expression'));
		}
		params.processors = processors;
		params.assistants = assistants;
		params.readers = readers;
		return true;
	}
	panel.add({
		layout : 'border',
		border : false,
		items : [tree, {
			region :'east',
			title :'已选办理人员列表',
			width : 150,
			layout :'fit',
			items : tabs
		}]
	});
	panel.doLayout();
	// 设置状态
	panel.setpWindow.step = Mixky.workflow.STEP_USERSELECT;
	// 设置按钮
	panel.setpWindow.showButtons(true, true);
	// 设置窗口标题
	panel.setpWindow.setFlowTitle('选择办理人员');
	tree.getRootNode().expand();
	tree.getRootNode().firstChild.expand();
});
</script>