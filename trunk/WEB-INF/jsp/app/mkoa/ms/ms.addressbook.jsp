<%@ page contentType="text/html; charset=utf-8"%>
<%
	String panelid = request.getParameter("panelid");
%>
<script language='javascript'>
Ext.onReady(function(){
	var panel = Ext.getCmp('<%=panelid%>');

	var selectBox = new Ext.form.TextArea({
		anchor : '100% 100%'
	});

	var tree = new Ext.tree.TreePanel({
		region : 'west',
		width : 200,
		minSize : 120,
		maxSize : 350,
        split :true,
    	autoScroll:true,
    	rootVisible :false,
    	root: {
       		id : 'root-0',
            text: '地址簿',
            children : [{
                id : 'organization-0',
                text : '组织结构'
            },{
                id : 'private-0',
                text : '个人通讯录'
            },{
                id : 'public-0',
                text : '公共通讯录'
            },{
                id : 'share-0',
                text : '共享通讯录'
            }]
        },
	    loader: new Ext.tree.TreeLoader({
	        directFn: AppMailDirect.getAddressBookTree,
	    	preloadChildren : true
	    })
	});

	var grid = new Ext.grid.GridPanel({
		region : 'center',
        split :true,
		enableHdMenu:false,
		enableColumnMove:false,
    	autoScroll:true,
		autoExpandColumn:'phone',
		store : new Ext.data.DirectStore({
			directFn : AppMsDirect.getAddressBookList,
			paramOrder:['key'],
			baseParams : {
				key : 'root-0'
			},
			root : 'results',
			totalProperty : 'totals',
			idProperty : 'key',
			fields:[
				{name:'key',mapping:'key'},
			    {name:'name',mapping:'name'},
			    {name:'phone',mapping:'phone'}
			]
		}),
		columns : [new Ext.grid.RowNumberer(),{
			id:'name',
			dataIndex:'name',
			header:'姓名',
			width:60
		},{
			id:'phone',
			dataIndex:'phone',
			header:'手机号码'
		}]
	});

	var selectedbox = new Ext.Panel({
		region : 'south',
        split :true,
        height : 100,
		layout : 'fit',
		items : selectBox
	});

	tree.getSelectionModel().on('selectionchange', function(sm, node){
		if(!node){
			return;
		}
		grid.getStore().baseParams.key = node.id;
		grid.getStore().reload();
	});
	// 双击用户列表
	grid.on('rowdblclick', function(g, index, e){
		var record = g.getSelectionModel().getSelected();
		if (!record.get("phone") || record.get("phone") == '') {
			return;
		}
		
		var v = selectBox.getValue();
		var nv = record.get("name") + '<' + record.get("phone") + ">,";
		
		if(Ext.isDefined(v) && v != ''){
			if(v.indexOf(nv) >= 0){
				return;
			}
		}
		selectBox.setValue(v + nv);
	});

	panel.confirmSelected = function(){
		panel.addressField.setValue(selectBox.getValue());
	}
	
	// 界面
	var ui = new Ext.Panel({
		layout:'border',
		border : false,
		defaults : {border:false},
		items:[tree, grid, selectedbox]
	});

	panel.add(ui);
	panel.doLayout();
	selectBox.setValue(panel.addressField.getValue());
	
});
</script>