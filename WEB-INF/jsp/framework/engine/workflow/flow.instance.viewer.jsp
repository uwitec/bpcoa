<%@ page language="java" contentType="text/html; charset=UTF-8"%>
<%@page import="java.util.List"%>
<%@ page import="com.google.gson.JsonObject"%>
<%@ page import="com.google.gson.JsonArray"%>
<%@page import="com.mixky.engine.organization.User"%>
<%@page import="com.mixky.engine.document.Document"%>
<%@ page import="com.mixky.engine.common.DesignObjectLoader"%>
<%@ page import="com.mixky.engine.workflow.template.Flow"%>
<%@page import="com.mixky.common.database.JsonObjectDao"%>
<%@page import="com.mixky.engine.workflow.WorkFlowDataService"%>
<%@page import="com.mixky.engine.workflow.instance.FlowLog"%>
<%@page import="com.mixky.engine.workflow.instance.NodeLog"%>
<%@page import="com.garage.xtoolkit.Tools"%>
<%
	String panelid = request.getParameter("panelid");
	Object obj = request.getAttribute("document");
	Document document = null;
	Flow workflow = null;
	JsonObjectDao jdata = null;
	User user = (User)request.getAttribute("user");
	if (obj != null) {
		document = (Document)obj;
		workflow = DesignObjectLoader.instance().loadDesignObject(document.getF_i_flow().get("data").getAsString());
	}
	obj = request.getAttribute("data");
	if (obj != null) {
		jdata = (JsonObjectDao)obj;
	}
	long flowlogId = 0;
	if(jdata.getJsonObject().has("F_FLOWLOGID") && !jdata.getJsonObject().get("F_FLOWLOGID").isJsonNull()){
		flowlogId = jdata.getJsonObject().get("F_FLOWLOGID").getAsLong();
	}
	JsonArray nlogArrays = new JsonArray();
	if(flowlogId > 0){
		List<NodeLog> nlogs = WorkFlowDataService.instance().getNodeLogs(flowlogId, null, -1);
		for(int i=0;i<nlogs.size();i++){
			NodeLog log = nlogs.get(i);
			JsonObject nlogJson = new JsonObject();
			nlogJson.addProperty("id", log.getId());
			nlogJson.addProperty("f_node_key", log.getF_node_key());
			nlogJson.addProperty("f_state", log.getF_state());
			nlogJson.addProperty("f_node_caption", log.getF_node_caption());
			nlogArrays.add(nlogJson);
		}
		
	}
%>

<script language='javascript'>
Ext.onReady(function(){

	var panel = Ext.getCmp('<%=panelid%>');
	var win = panel.findParentByType('window');

	var nodelogs = <%=nlogArrays%>;

	function getNodeType(id){
		for(var i=0;i<nodelogs.length;i++){
			var nodelog = nodelogs[nodelogs.length - i - 1];
			if(nodelog.f_node_key == id){
				if(nodelog.f_state == 3){
					return "nodeDone";
				}else{
					return "nodeDoing";
				}
			}
		}
		return "nodeUndo";
	}

	function getNodeCaption(key){
		for(var i=0;i<nodelogs.length;i++){
			var nodelog = nodelogs[nodelogs.length - i - 1];
			if(nodelog.f_node_key == key){
				return nodelog.f_node_caption;
			}
		}
		return "<I>无匹配节点</I>";
	}

	// Creates the graph and loads the default stylesheet
    var graph = new mxGraph();

	var workflowPanel = new Ext.Panel({
		region : 'center',
		border:false
	});

	// 数据访问
	var store = new Ext.data.DirectStore({
		directFn : FlowDesignerDirect.getUserOpinionLog,
		paramOrder:['flowlogid', 'key'],
		baseParams:{flowlogid:<%=flowlogId%>, key:''},
		root : 'results',
		totalProperty : 'totals',
		idProperty : 'ID',
		fields:["ID","F_NODE_KEY","F_USER_NAME","F_START_TIME","F_END_TIME","F_STATE","F_PROCESS_TYPE","F_OPINION"]
	});
	
	var attributePanel = new Ext.grid.GridPanel({
		title : '节点办理记录',
		region : 'east',
		width : 250,
		minWidth : 200,
		maxWidth : 450,
		border:false,
		split : true,
		hidden : <%=flowlogId==0%>,
		collapsible : false,
        collapseMode:'mini',
        lineBreak : true,
    	enableHdMenu : false,
    	hideHeaders : true,
		store : store,
		columns : [{
			id : 'F_USER_NAME',
			dataIndex : 'F_USER_NAME',
			header : '用户名',
			renderer : function(value, metaData, record, rowIndex, colIndex, store){
				var output = "<B>" + getNodeCaption(record.get("F_NODE_KEY")) + "</B>";
				output = output + "<BR>" + record.get("F_USER_NAME");
				switch(record.get("F_PROCESS_TYPE")){
				case 0:
					output = output + " <B>主办</B>";
					break;
				case 1:
					output = output + " 协办";
					break;
				case 2:
					output = output + " 读者";
					break;
				}
				output = output + "<BR>" + record.get("F_START_TIME") + " 开始";
				switch(record.get("F_STATE")){
				case 0:
					output = output + "<BR>正在办理...";
					metaData.attr = "style='background-color:lightgreen;'";
					break;
				case 1:
					output = output + "<BR>" + record.get("F_END_TIME") + " 结束";
					break;
				case 2:
					output = output + "<BR>可申请办理";
					break;
				}
				output = output + "<BR><BR>" + record.get("F_OPINION");
				return output;
			}
		}],
		autoExpandColumn: 'F_USER_NAME'
	});

	attributePanel.loadProcessLogs = function(key){
		if(Ext.isDefined(key)){
			store.baseParams.key = key;
		}
		if(<%=flowlogId>0%>){
			store.load();
		}
	}

	var ui = {
		layout : 'border',
		border : false,
		items : [workflowPanel, attributePanel]
	};


	// 计算路由样式及位置
	panel.resetEdgePoint = function(stylesheet, edge){
		if(edge.source != null && edge.target != null){
			var geo = edge.getGeometry();
			var sgeo = edge.source.getGeometry();
			var tgeo = edge.target.getGeometry();
			var sx = sgeo.x + sgeo.width / 2;
			var sy = sgeo.y + sgeo.height / 2;
			var tx = tgeo.x + tgeo.width / 2;
			var ty = tgeo.y + tgeo.height / 2;
			var style = edge.style;
			if(!style){
				style = {};
			}
			style[mxConstants.STYLE_ELBOW] = mxConstants.ELBOW_HORIZONTAL;
			var pointx = 0;
			var pointy = 0;
			if(sy == ty){
				// 水平
				if(sx < tx){
					// 从左往右
					pointx = sx + sgeo.width / 2 - 30;
					pointy = sy - sgeo.height / 2 - 20;
				}else{
					// 从右往左
					pointx = tx + 30;
					pointy = sy + sgeo.height / 2 + 20;
				}
				geo.points = [new mxPoint(pointx, pointy)];
			}else if(sy > ty){
				// 上方
				pointy = ty + tgeo.height / 2 + 20;
				if(sx <= tx){
					// 从左往右
					pointx = sx + sgeo.width / 2 + 30;
				}else{
					// 从右往左
					pointx = sx - 30;
				}
				geo.points = [new mxPoint(pointx, pointy)];
			}else{
				// 下方
				pointx = sx;
				pointy = ty - tgeo.height / 2 - 20;
				var point1x = tx;
				var point1y = pointy;
				//style[mxConstants.STYLE_ELBOW] = mxConstants.ELBOW_VERTICAL;
				geo.points = [new mxPoint(pointx, pointy), new mxPoint(point1x, point1y)];
			}
			edge.setGeometry(geo);
			edge.setStyle(style);
		}
	};

	// 选中对象
	panel.activateCell = function(cell){
		if(!cell){
			attributePanel.loadProcessLogs('');
		}else if(!cell.isEdge()){
			attributePanel.loadProcessLogs(cell.id);
		}
	};

	// 刷新
	panel.refresh = function(){
		graph.getModel().clear();
		FlowDesignerDirect.getFlowCells('<%=workflow.getKey()%>', false, function(result, e){
			if(result && result.success){
				graph.getModel().beginUpdate();
				try
				{
				    var parent = graph.getDefaultParent();
					for(var i=0;i<result.nodes.length;i++){
						var node = result.nodes[i];
	
					    var w = 40;
					    var h = 40;
					    var type = node.type;
					    if(type == 'node'){
						    w = 80;
						    h = 30;
						    type = getNodeType(node.id);
						}
					    var x =  node.x * 140 + 70 + 20 - w/2;
					    var y =  node.y * 80 + 40 + 20 - h/2;
						var cell = graph.insertVertex(parent, node.id, node.caption, x, y, w, h, type);
					}
					for(var i=0;i<result.routes.length;i++){
						var route = result.routes[i];
						var source = graph.getModel().getCell(route.from);
						var target = graph.getModel().getCell(route.to);
						graph.insertEdge(parent, route.id, route.caption, source, target, 'route');
					}
				}
				finally
				{
					// Updates the display
					graph.getModel().endUpdate();
				}
				panel.activateCell();
			}
		});
	};

	// 初始化
	panel.initWorkflowPanel = function(){
		if(panel.isGraphInit){
			return;
		}
		panel.isGraphInit = true;

		// Makes the connection are smaller
		mxConstants.DEFAULT_HOTSPOT = 0.3;
	    // Loads the default stylesheet into the graph
	    var style = mxUtils.load('dependences/mxgraph/mixky.flowstyle.xml').getDocumentElement();
		var dec = new mxCodec(style.ownerDocument);
		dec.decode(style, graph.getStylesheet());
		
		// Initializes the graph as the DOM for the panel has now been created	
		workflowPanel.body.dom.style.overflow = 'auto';
	    graph.init(workflowPanel.body.dom);
		graph.autoExtend = false;
		graph.setCellsLocked(true);
		graph.setConnectable(false);
	    // 不允许编辑对象大小
	    graph.setCellsResizable(false);
	    graph.setAllowDanglingEdges(false);
	    // 设置路由名称位置不可编辑
	    graph.edgeLabelsMovable = false;
	    // 设置图标样式
	    graph.container.style.cursor = 'default';
	    // 设置单选模式
	    graph.getSelectionModel().setSingleSelection(true);
	    // 移动对象
	    graph.graphHandler.setMoveEnabled(false);
	    // 编辑对象文本
	    graph.setCellsEditable(false);
	    // 连接到节点事件
	    var connectedListener = function(sender, evt)
	    {
			var edge = evt.getProperty('edge');
			panel.resetEdgePoint(graph.getStylesheet(), edge);
	    };
	    graph.addListener(mxEvent.CELL_CONNECTED, connectedListener);
	    // 选择对象
	    var selectionListener = function()
	    {
			var cell = graph.getSelectionCell();
			panel.activateCell(cell);
	    };
	    graph.getSelectionModel().addListener(mxEvent.CHANGE, selectionListener);
		panel.refresh();
	};

	workflowPanel.on('afterrender', function(){
		panel.initWorkflowPanel();
	});


	panel.add(ui);
	panel.doLayout();
});
</script>