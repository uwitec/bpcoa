<%@ page contentType="text/html; charset=utf-8"%>
<%
	String id = request.getParameter("id");
	String key = request.getParameter("key");
%>
<script language='javascript'>
Ext.onReady(function(){
	var id = '<%=id%>';
	var key = '<%=key%>';

	var panel = Ext.getCmp(id);
	panel.setTitle('权限定义');

	var detail = new Ext.Panel({
    	region : 'center' ,
		autoLoad : {
			url : 'ui/document.authoritymap.grid.do',
			scripts:true,
			border:false,
			params:{
				key : key
			}
		},
		split : true,
		border : false,
		layout : 'fit',
		// 开始编辑记录
		startEditObject : Ext.emptyFn,
		// 结束编辑记录
		stopEditObject : Ext.emptyFn
	});
	Ext.apply(detail.autoLoad.params, {id:detail.getId()});

	var btnAdd = new Ext.Action({
		text : '添加映射表',
		iconCls : 'icon-designtool-add',
		handler : function(){
			Mixky.designtool.lib.addDocumentAuthorityMap(key, function(newkey){
				tree.onLoadSelectKey = newkey;
				tree.refresh();
			});
		}
	});
	
	var typeCombo = new Ext.form.ComboBox({
    	triggerAction:'all',
    	mode:'local',
    	width:'70',
    	forceSelection: true,
    	value:'bystate',
    	store:['bystate', 'byidentity','bynone']
	});

	var btnRefresh = new Ext.Action({
		text : '刷新',
		iconCls : 'icon-designtool-refresh',
		handler : function(){
			Ext.apply(tree.getLoader().baseParams, {'viewtype':typeCombo.getValue()});
			tree.refresh();
		}
	});
	
	var tree = new Ext.tree.TreePanel({
    	region : 'west',
        minSize : 150,
        width : 200,
        maxSize : 400,
    	autoScroll : true,
    	split : true,
    	root : {
	        text : '权限映射表',
	        id : key,
	        nodeType : 'async',
	        key : ''
	    },
        loader: new Ext.tree.TreeLoader({
            directFn: DesignToolDirect.getDocumentAuthorityMapTree,
            paramOrder : ['viewtype'],
        	baseParams : {viewtype : typeCombo.getValue()},
        	preloadChildren : true,
        	listeners : {
        		'load':function(loader, node){
        			tree.expandAll();
        			if(Ext.isDefined(tree.onLoadSelectKey)){
            			var sn = tree.getNodeById(tree.onLoadSelectKey);
            			if(sn){
                			sn.select();
                		}
            			tree.onLoadSelectKey = undefined;
            		}
        		}
        	}
        }),
        refresh : function(){
	    	this.getRootNode().attributes.children = undefined;
	        this.getRootNode().reload();
	    }
	});
	
	var cmenu = new Ext.menu.Menu({
		items:[{
			text : '删除',
			iconCls : 'icon-designtool-delete',
			handler : function(){
				var node = tree.getSelectionModel().getSelectedNode();
				if(!node || !node.attributes.key || node.attributes.key == ''){
					return;
				}
				Ext.MessageBox.confirm('危险操作提示', '删除当前选中的权限映射表，该操作不可恢复，您确定吗？', function(btn){
					if(btn == 'yes'){
						detail.stopEditObject();
						DesignToolDirect.deleteObject(node.attributes.key, function(result, e){
							if(result && result.success){
								tree.refresh();
							}
						});
					}
				});
			}
		}]
	});
	
	tree.on('contextmenu', function(node, e){
		tree.getSelectionModel().select(node);
		cmenu.showAt(e.getXY());
	});
	
	tree.getSelectionModel().on('selectionchange', function(sm, node){
		if(!node || node.attributes.key == ''){
			detail.stopEditObject();
		}else{
			detail.startEditObject(node.attributes.key, node);
		}
	});

	var saveAuthoritMap = function(node){
		if(node.attributes.key != '' && Ext.isDefined(node.attributes.f_authorities)){
			DesignToolDirect.saveObject(node.attributes.key, {f_authorities:node.attributes.f_authorities}, function(result, e){
				if(result.success){
					node.attributes.f_authorities = undefined;
					if(node.isSelected()){
						detail.startEditObject(node.attributes.key, node);
					}
				}
			});
		}
		node.eachChild(function(child){
			saveAuthoritMap(child);
		});
	}

	var ui = new Ext.Panel({
		layout:'border',
		border : false,
		defaults : {border:false},
		tbar : [typeCombo, btnRefresh, '-', btnAdd],
		items:[tree, detail]
	});
	
	// 刷新
	panel.refresh = function(){
		tree.refresh();
	}
	// 保存属性修改
	panel.save = function(needSaveNext){
		detail.stopEditObject();
		saveAuthoritMap(tree.getRootNode());
		Mixky.designtool.Framework.contentPanel.savePanelOver(panel, needSaveNext);
	};
	
	panel.add(ui);
	panel.doLayout();
});
</script>