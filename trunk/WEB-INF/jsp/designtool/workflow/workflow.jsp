<%@ page contentType="text/html; charset=utf-8"%>
<%@ page import="com.mixky.engine.module.Module"%>
<%@ page import="com.mixky.engine.common.DesignObjectLoader"%>
<%@ page import="com.mixky.engine.workflow.template.Flow"%>
<%
	String id = request.getParameter("id");
	String key = request.getParameter("key");
	String mclass = request.getParameter("mclass");
	
	Flow workflow = DesignObjectLoader.instance().loadDesignObject(key);
%>
<script language='javascript'>
Ext.onReady(function(){
	var id = '<%=id%>';
	var key = '<%=key%>';
	var mclass = '<%=mclass%>';
	
	var panel = Ext.getCmp(id);
	if(panel.title){
		panel.setTitle('流程编辑 [<%=workflow.getF_caption()%>]');
	}

	// Creates the graph and loads the default stylesheet
    var graph = new mxGraph();
    
    var btnDelete = new Ext.Action({
		text : '删除',
		iconCls : 'icon-designtool-delete',
		handler : function(){
			if(!graph.isSelectionEmpty()){
				var cell = graph.getSelectionCell();
				Ext.MessageBox.confirm('操作提示', '删除当前选中的对象及关联对象，您确定吗？', function(btn){
					if(btn == 'yes'){
						panel.removeCell(cell);
					}
				});
			}
		}
	});

    var btnSave = new Ext.Action({
		text : '保存位置',
		iconCls : 'icon-designtool-save',
		handler : function(){
    		panel.savePosition();
		}
	});

    var btnRefreshAuto = new Ext.Action({
		text : '自动排列',
		iconCls : 'icon-designtool-refresh',
		handler : function(){
			Ext.MessageBox.confirm('操作提示', '该操作将自动计算并更新当前的节点位置，您确定吗？', function(btn){
				if(btn == 'yes'){
					panel.refresh(true);
				}
			});
		}
	});

    var btnRefresh = new Ext.Action({
		text : '刷新显示',
		iconCls : 'icon-designtool-refresh',
		handler : function(){
    		panel.refresh(false);
		}
	});
	// 锁定流程
    var chkLockFlag = new Ext.form.Checkbox({
    	checked : <%=workflow.getF_locked()%>,
    	hideLabel : true
    });
    chkLockFlag.on('check', function(f, checked){
    	FlowDesignerDirect.setFlowLocked('<%=key%>', checked, function(result, e){
        	if(result && result.success){
            	if(checked){
            	    graph.setCellsLocked(true);
            	    graph.setConnectable(false);
            	}else{
            	    graph.setCellsLocked(false);
            	    graph.setConnectable(true);
            	}
            }
        });
    });

	var workflowPanel = new Ext.Panel({
		region : 'center',
		tbar : [btnDelete, '-', btnSave, '-','锁定：', chkLockFlag, '->', btnRefreshAuto, '-', btnRefresh],
		border:false
	});

	var nodePanel = new Ext.Panel({
		id : 'node-<%=key%>',
		disabled : true,
		title : '节点属性',
		border:false,
		layout:'fit',
		deferredRender:false,
		autoLoad : {
			url : 'ui/node.do',
			scripts:true,
			border:false,
			params:{
				id : 'node-<%=key%>'
			}
		}
	});

	var routePanel = new Ext.Panel({
		id : 'route-<%=key%>',
		disabled : true,
		title : '路由属性',
		border:false,
		layout:'fit',
		deferredRender:false,
		autoLoad : {
			url : 'ui/route.do',
			scripts:true,
			border:false,
			params:{
				id : 'route-<%=key%>'
			}
		}
	});

	var relationPanel = new Ext.Panel({
		id : 'relation-<%=key%>',
		disabled : true,
		title : '路由关系',
		border:false,
		layout:'fit',
		deferredRender:false,
		autoLoad : {
			url : 'ui/relation.do',
			scripts:true,
			border:false,
			params:{
				id : 'relation-<%=key%>'
			}
		}
	});
	
	var attributePanel = new Ext.TabPanel({
		region : 'west',
		width : 250,
		minWidth : 200,
		maxWidth : 450,
		border:false,
		split : true,
		collapsible : false,
        collapseMode:'mini',
		tabPosition : 'bottom',
	    activeTab: 0,
	    items: [nodePanel, routePanel, relationPanel]
	});

	var ui = {
		layout : 'border',
		border : false,
		items : [workflowPanel, attributePanel]
	};
	
	panel.add(ui);
	panel.doLayout();

	// 计算节点的位置信息（锁定每个节点占180 × 100的宽高，PADDING为20）
	panel.getCellPoint = function(x, y){
		var nx = Math.floor(x / 180) * 180 + 90 + 20;
		var ny = Math.floor(y / 100) * 100 + 50 + 20;
		return {x: nx, y:ny};
	}
	// 计算路由样式及位置
	panel.resetEdgePoint = function(edge){
		if(edge.source != null && edge.target != null){
			var geo = edge.getGeometry();
			var sgeo = edge.source.getGeometry();
			var tgeo = edge.target.getGeometry();
			var sx = sgeo.x + sgeo.width / 2;
			var sy = sgeo.y + sgeo.height / 2;
			var tx = tgeo.x + tgeo.width / 2;
			var ty = tgeo.y + tgeo.height / 2;
			//var style = edge.style;
			//if(!style){
			//	style = {};
			//}
			graph.setCellStyles(mxConstants.STYLE_ELBOW, mxConstants.ELBOW_HORIZONTAL, [edge]);
			//style[mxConstants.STYLE_ELBOW] = mxConstants.ELBOW_HORIZONTAL;
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
				//graph.setCellStyles(mxConstants.STYLE_ELBOW, mxConstants.ELBOW_VERTICAL, [edge]);
				//style[mxConstants.STYLE_ELBOW] = mxConstants.ELBOW_VERTICAL;
				geo.points = [new mxPoint(pointx, pointy), new mxPoint(point1x, point1y)];
			}
			edge.setGeometry(geo);
			//edge.setStyle(style);
		}
	}

	panel.savePosition = function(){
	    var parent = graph.getDefaultParent();
		var cells = graph.getModel().getChildCells(parent);
		var cellsPos = {};
		for(var i=0;i<cells.length;i++){
			var cell = cells[i];
			if(!cell.isEdge()){
				var geo = cell.getGeometry();
				var x = Math.floor((geo.x - 20) / 180);
				var y = Math.floor((geo.y - 20) / 100);
				cellsPos[cell.id] = x + ":" + y;
			}
		}
		FlowDesignerDirect.saveFlowPosition('<%=key%>', cellsPos, function(result, e){
			if(result && result.success){
				Ext.MessageBox.alert('操作提示！', '流程图型位置保存完毕！');
			}
		});
	}
	// 插入路由及节点
	panel.insertRoute = function(cell){
		var x = Math.floor((cell.target.getGeometry().x - 20) / 180);
		var y = Math.floor((cell.target.getGeometry().y - 20) / 100);
		if(cell.target.isNew){
			FlowDesignerDirect.insertNode('<%=key%>', cell.source.id, x, y, function(result, e){
				if(result && result.success){
					cell.isNew = undefined;
					cell.setId(result.routekey);
					cell.target.isNew = undefined;
					cell.target.setId(result.nodekey);
				}else{
					graph.removeCells([cell.target]);
				}
			});
		}else{
			FlowDesignerDirect.insertRoute('<%=key%>', cell.source.id, cell.target.id, function(result, e){
				if(result && result.success){
					cell.isNew = undefined;
					cell.setId(result.routekey);
				}else{
					graph.removeCells([cell]);
				}
			});
		}
	}
	// 删除对象
	panel.removeCell = function(cell){
		FlowDesignerDirect.removeCell('<%=key%>', cell.id, function(result, e){
			if(result && result.success){
				graph.removeCells([cell], true);
			}
		});
	}
	// 改变文本
	panel.changeLabel = function(cell){
		FlowDesignerDirect.updateCaption(cell.id, cell.value, function(result, e){
			if(!result || !result.success){
				if(result.caption){
					cell.setValue(result.caption);
				}
			}
		});
	}
	// 改变目标节点
	panel.updateRouteTarget = function(edge){
		if(edge.target == null){
			return;
		}
		FlowDesignerDirect.updateRouteTarget('<%=key%>', edge.id, edge.target.id, function(result, e){
			if(result || result.success){
				if(result.key){
					edge.setId(result.key);
				}
			}
		});
	}
	// 选中对象
	panel.activateCell = function(cell){
		nodePanel.setDisabled(true);
		routePanel.setDisabled(true);
		relationPanel.setDisabled(true);
		if(cell != null && !cell.isNew){
			if(cell.isEdge()){
				routePanel.setDisabled(false);
				relationPanel.setDisabled(false);
				attributePanel.activate(routePanel);
				if(Ext.isDefined(routePanel.loadPropertiesData)){
					routePanel.loadPropertiesData(cell.id);
				}else{
					routePanel.key = cell.id;
				}
				if(Ext.isDefined(relationPanel.refresh)){
					relationPanel.refresh(cell.id);
				}else{
					relationPanel.key = cell.id;
				}
			}else{
				nodePanel.setDisabled(false);
				attributePanel.activate(nodePanel);
				if(Ext.isDefined(nodePanel.loadPropertiesData)){
					nodePanel.loadPropertiesData(cell.id);
				}else{
					nodePanel.key = cell.id;
				}
			}
		}
	}
	// 刷新
	panel.refresh = function(layout){
		if(!layout){
			layout = false;
		}
		graph.getModel().clear();
		FlowDesignerDirect.getFlowCells('<%=key%>', layout, function(result, e){
			if(result && result.success){
				panel.isGraphLoading = true;
				graph.getModel().beginUpdate();
				try
				{
				    var parent = graph.getDefaultParent();
					for(var i=0;i<result.nodes.length;i++){
						var node = result.nodes[i];
	
					    var w = 50;
					    var h = 50;
					    if(node.type == 'node'){
						    w = 120;
						    h = 35;
						}
					    var x =  node.x * 180 + 90 + 20 - w/2;
					    var y =  node.y * 100 + 50 + 20 - h/2;
					    
						graph.insertVertex(parent, node.id, node.caption, x, y, w, h, node.type);
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
					panel.isGraphLoading = false;
				}
			}
		});
	}
	panel.save = function(needSaveNext){
		if(!nodePanel.disabled){
			nodePanel.save();
		}
		if(!routePanel.disabled){
			routePanel.save();
			if(Ext.isDefined(relationPanel.save)){
				relationPanel.save();
			}
		}
		Mixky.designtool.Framework.contentPanel.savePanelOver(panel, needSaveNext);
	}
	// 初始化
	panel.on('activate', function(){
		if(panel.isGraphInit){
			return;
		}
		panel.isGraphInit = true;
		
		// Makes the connection are smaller
		mxConstants.DEFAULT_HOTSPOT = 0.3;
	    // Loads the default stylesheet into the graph
	    var style = mxUtils.load('../dependences/mxgraph/mixky.flowstyle.xml').getDocumentElement();
		var dec = new mxCodec(style.ownerDocument);
		dec.decode(style, graph.getStylesheet());
		//Mixky.lib.initFlowStylesheet(graph.getStylesheet());
		
		// Initializes the graph as the DOM for the panel has now been created	
		workflowPanel.body.dom.style.overflow = 'auto';
	    graph.init(workflowPanel.body.dom);
	    graph.setConnectable(true);
		graph.setDropEnabled(true);
	    graph.setPanning(true);
	    graph.setTooltips(true);
<%
	if(workflow.getF_locked()){
%>
		graph.setCellsLocked(true);
		graph.setConnectable(false);
<%
	}
%>
	    // 不允许编辑对象大小
	    graph.setCellsResizable(false);
	    // 设置当目标为空时默认创建对象
	    graph.connectionHandler.setCreateTarget(true);
	    //graph.setAllowDanglingEdges(false);
	    // 设置移动对象是不取消关联
	    graph.setDisconnectOnMove(false);
	    // 设置路由名称位置不可编辑
	    graph.edgeLabelsMovable = false;
	    // 设置图标样式
	    graph.container.style.cursor = 'default';
	    // 设置单选模式
	    graph.getSelectionModel().setSingleSelection(true);
	    // 创建路由
	    graph.connectionHandler.factoryMethod = function(value, source, target)
	    {
	    	var cell = new mxCell('新建路由', new mxGeometry(0, 0, 0, 0), 'routeDown');
	    	cell.isNew = true;
			cell.edge = true;
			return cell; 
	    };
	    // 创建节点（当路由指向为空时）
	    graph.connectionHandler.createTargetVertex = function(evt, source){
	    	var point = graph.getPointForEvent(evt);
	    	var np = panel.getCellPoint(point.x, point.y);
			var cell = new mxCell('新建节点', new mxGeometry(np.x - 120/2, np.y - 35/2, 120, 35), 'node');
			cell.isNew = true;
			cell.vertex = true;
	    	return cell;
		}
		// 判断是否可以作为路由目标对象
	    graph.getEdgeValidationError = function(edge, source, target)
	    {
			if (target != null)
			{
				if(source == target){
		 			return '不能创建自循环连接';
				}
				if(target.isEdge()){
		 			return '不能连接到路由';
				}else if(target.id == 'nodeStart'){
		 			return '不能连接到开始节点';
				}
				if(edge != null && edge.source != source){
		 			return '不能改变起始节点';
				}
			}
			return mxGraph.prototype.getEdgeValidationError.apply(this, arguments);
	    }
		// 节点移动
	    var moveListener = function(sender, evt)
	    {
			var cells = evt.getProperty('cells');
			var event = evt.getProperty('event');
			var cell = cells[0];
			if(!cell.isEdge()){
		    	var point = graph.getPointForEvent(event);
				var np = panel.getCellPoint(point.x, point.y);
				var geo = cell.getGeometry();
				cell.setGeometry(new mxGeometry(np.x - geo.width/2, np.y - geo.height/2, geo.width, geo.height));
				for(var i=0;i<cell.getEdgeCount();i++){
					panel.resetEdgePoint(cell.getEdgeAt(i));
				}
			}
	    };
	    graph.addListener(mxEvent.MOVE_CELLS, moveListener);
	    // 连接到节点事件
	    var connectedListener = function(sender, evt)
	    {
			var edge = evt.getProperty('edge');
			panel.resetEdgePoint(edge);
			if(!panel.isGraphLoading && !edge.isNew){
				panel.updateRouteTarget(edge);
			}
	    };
	    graph.addListener(mxEvent.CELL_CONNECTED, connectedListener);
	    // 添加路由
	    var cellAddedListener = function(sender, evt)
	    {
			var cells = evt.getProperty('cells');
			var cell = cells[0];
			if(cell.isNew && cell.isEdge()){
				panel.insertRoute(cell);
			}
	    };
	    graph.addListener(mxEvent.CELLS_ADDED, cellAddedListener);
	    // 文本名称被改变
	    var labelChangedListener = function(sender, evt)
	    {
		    if(evt){
				var cell = evt.getProperty('cell');
				panel.changeLabel(cell);
			}
		}
	    graph.addListener(mxEvent.LABEL_CHANGED, labelChangedListener);
	    // 选择对象
	    var selectionListener = function()
	    {
			var cell = graph.getSelectionCell();
			panel.activateCell(cell);
	    };
	    graph.getSelectionModel().addListener(mxEvent.CHANGE, selectionListener);
		panel.refresh();
	});

});
</script>