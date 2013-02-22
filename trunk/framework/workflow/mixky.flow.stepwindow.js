
Ext.namespace("Mixky.workflow");

Mixky.workflow.STEP_ERROR = -1;
Mixky.workflow.STEP_PREPARE = 0;
Mixky.workflow.STEP_NODESELECT = 1;
Mixky.workflow.STEP_USERSELECT = 2;
Mixky.workflow.STEP_CONFIRM = 3;
Mixky.workflow.STEP_NOTICE = 4;
Mixky.workflow.STEP_SUCCESS = 5;

Mixky.workflow.OPERATION_NONE = 0;
Mixky.workflow.OPERATION_PRE = 1;
Mixky.workflow.OPERATION_NEXT = 2;
Mixky.workflow.OPERATION_COMPLETE = 3;
Mixky.workflow.OPERATION_CANCEL = 4;

Mixky.workflow.StepWindow = function(documentkey, documentid, actiontype, config){
	
	this.actiontype = actiontype;
	
	this.documentkey = documentkey;
	
	this.documentid = documentid;
	
	this.operation = Mixky.workflow.OPERATION_NONE;
	
	this.step = 0;
	
	var stepWin = this;
	
	this.onSuccess = function(){
		this.window.close();
		MixkyApp.desktop.closeDocument(documentkey, documentid);
	}
	
	// 按钮
	var previousAction = new Ext.Action({
		text : '上一步',
		iconCls : 'icon-sys-previous',
		handler : function(){
			stepWin.operation = Mixky.workflow.OPERATION_PRE;
			stepWin.submit();
		}
	});
	var nextAction = new Ext.Action({
		text : '下一步',
		iconCls : 'icon-sys-next',
		handler : function(){
			stepWin.operation = Mixky.workflow.OPERATION_NEXT;
			stepWin.submit();
		}
	});
	var completeAction = new Ext.Action({
		text : '完成',
		iconCls : 'icon-sys-confirm',
		handler : function(){
			stepWin.operation = Mixky.workflow.OPERATION_COMPLETE;
			stepWin.submit();
		}
	});
	var cancelAction = new Ext.Action({
		text : '取消',
		iconCls : 'icon-sys-cancel',
		handler : function(){
			stepWin.operation = Mixky.workflow.OPERATION_CANCEL;
			stepWin.submit();
			stepWin.window.close();
		}
	});
	// 操作区
	this.panel = new Ext.Panel({
        layout: 'fit',
		padding : 10,
		beforeSubmit : Ext.emptyFn
	});
	this.panel.setpWindow = this;
	// 操作窗口
	this.window = new Ext.Window({
		title : '流程办理向导',
		manager : MixkyApp.desktop.getManager(),
		width : 400,
		height : 350,
        layout: 'fit',
        iconCls : 'icon-sys-flow-guide',
		modal : true,
		border : false,
        closeable : false,
        maximizable : false,
        minimizable : false,
        animCollapse :false,
        resizable :false,
		items : this.panel,
		bbar : [previousAction, '-', nextAction, '->', completeAction, '-', cancelAction]
	});
	this.setFlowTitle = function(title){
		this.window.setTitle('流程办理向导 —— ' + title);
	}
	// 隐藏按钮
	this.hideButtons = function(){
		nextAction.disable();
		previousAction.disable();
		completeAction.disable();
		cancelAction.disable();
	}
	// 显示按钮
	this.showButtons = function(showPrevious, showNext){
		cancelAction.enable();
		if(this.step != Mixky.workflow.STEP_ERROR){
			if(this.step == Mixky.workflow.STEP_CONFIRM){
				completeAction.enable();
			}
			if(this.step > 1 && showPrevious){
				previousAction.enable();
			}
			if(this.step < Mixky.workflow.STEP_CONFIRM && showNext){
				nextAction.enable();
			}
		}
	}
	// 提交表单
	this.submit = function(){
		var params = {
			panelid : this.panel.id,
			documentkey : this.documentkey,
			documentid : this.documentid,
			actiontype : this.actiontype,
			operation : this.operation,
			step : this.step
		}
		if(this.step == Mixky.workflow.STEP_ABORT || this.panel.beforeSubmit(params) !== false){
			this.hideButtons();
			this.panel.removeAll();
			this.panel.load({
				url : 'framework/engine/workflow/flow.do',
				params : params,
				timeout: 60,
				text: "正在与服务器交互，请稍候...",
				scripts: true
			});
		}
	}
	
	this.window.show();
	this.window.toFront();
	this.submit();
};