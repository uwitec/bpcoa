
//=================================================================
//	�ļ�����mixky.flow.action.js
//=================================================================

Ext.namespace("Mixky.workflow");

Mixky.workflow.ACTION_REQUEST = 0;
Mixky.workflow.ACTION_COMPLETE = 1;
Mixky.workflow.ACTION_READCOMPLETE = 2;
Mixky.workflow.ACTION_ASSISTCOMPLETE = 3;
Mixky.workflow.ACTION_RETURN = 4;
Mixky.workflow.ACTION_TAKEBACK = 5;
Mixky.workflow.ACTION_ABORT = 6;
Mixky.workflow.ACTION_ARCHIVE = 7;
Mixky.workflow.ACTION_OPINION = 8;
Mixky.workflow.ACTION_RESUME = 9;
Mixky.workflow.ACTION_FORWARD = 10;

Mixky.workflow.FlowAction = function(doc, actiontype, config){
	
	var doHandler = function(){
		if(actiontype == Mixky.workflow.ACTION_OPINION){
			Mixky.workflow.OpinionWindow(doc.documentkey, doc.documentid, {objectkey:null});
		}else{
			Mixky.workflow.StepWindow(doc.documentkey, doc.documentid, actiontype);
		}
	}
	var handler = function(){
		// 判断是否需要提交表单
		switch(actiontype){
		case Mixky.workflow.ACTION_COMPLETE:
		case Mixky.workflow.ACTION_READCOMPLETE:
		case Mixky.workflow.ACTION_ASSISTCOMPLETE:
			doc.submitDocument(doHandler);
			break;
		default:
			doHandler();
			break;
		}
	}
	
	var defaultConfig = {
		minWidth : 50, 
		iconAlign : 'top', 
		handler : handler
	};
	
	// 设置按钮文字及图标
	switch(actiontype){
	case Mixky.workflow.ACTION_COMPLETE:
		defaultConfig.text = '办理完毕';
		defaultConfig.iconCls = 'icon-sys-flow-processover';
		break;
	case Mixky.workflow.ACTION_READCOMPLETE:
		defaultConfig.text = '阅读完毕';
		defaultConfig.iconCls = 'icon-sys-flow-readover';
		break;
	case Mixky.workflow.ACTION_ASSISTCOMPLETE:
		defaultConfig.text = '协办完毕';
		defaultConfig.iconCls = 'icon-sys-flow-assistover';
		break;
	case Mixky.workflow.ACTION_RETURN:
		defaultConfig.text = '退回';
		defaultConfig.iconCls = 'icon-sys-flow-turnback';
		break;
	case Mixky.workflow.ACTION_TAKEBACK:
		defaultConfig.text = '拿回';
		defaultConfig.iconCls = 'icon-sys-flow-takeback';
		break;
	case Mixky.workflow.ACTION_REQUEST:
		defaultConfig.text = '申请办理';
		defaultConfig.iconCls = 'icon-sys-flow-request';
		break;
	case Mixky.workflow.ACTION_ABORT:
		defaultConfig.text = '撤销办理';
		defaultConfig.iconCls = 'icon-sys-flow-stop';
		break;
	case Mixky.workflow.ACTION_ARCHIVE:
		defaultConfig.text = '归档';
		defaultConfig.iconCls = 'icon-sys-flow-archive';
		break;
	case Mixky.workflow.ACTION_OPINION:
		defaultConfig.text = '填写意见';
		defaultConfig.iconCls = 'icon-sys-flow-opinion';
		break;
	case Mixky.workflow.ACTION_RESUME:
		defaultConfig.text = '恢复办理';
		defaultConfig.iconCls = 'icon-sys-flow-resume';
		break;
	case Mixky.workflow.ACTION_FORWARD:
		defaultConfig.text = '转移办理';
		defaultConfig.iconCls = 'icon-sys-flow-forward';
		break;
	}
	
	return new Ext.Action(Ext.apply(defaultConfig, config));
}
//=================================================================
//	�ļ�����mixky.flow.opinionwindow.js
//=================================================================

Ext.namespace("Mixky.workflow");

Mixky.workflow.OpinionWindow = function(documentkey, documentid, config){
		
	this.documentkey = documentkey;
	
	this.documentid = documentid;
	
	var opinionWin = this;
	
	// 按钮
	var confirmAction = new Ext.Action({
		text : '填写完毕',
		iconCls : 'icon-app-confirm',
		handler : function(){
			if(!textarea.isValid()){
				MixkyApp.showErrorMessage("表单数据填写非法，保存失败");
				return;
			}
			opinionWin.submit();
		}
	});
	var cancelAction = new Ext.Action({
		text : '取消',
		iconCls : 'icon-app-cancel',
		handler : function(){
			opinionWin.window.close();
		}
	});
	var textarea = new Ext.form.TextArea({
		maxLength: 240,
        hideLabel: true
    });
	// 操作窗口
	this.window = new Ext.Window({
		title : '流程意见填写',
		manager : MixkyApp.desktop.getManager(),
		width : 350,
		height : 300,
        layout: 'fit',
        iconCls : 'icon-app-flow-opinion',
		modal : true,
		border : false,
        maximizable : false,
        minimizable : false,
        animCollapse :false,
        resizable :false,
		items : textarea,
		bbar : ['->', confirmAction, '-', cancelAction]
	});
	// 提交表单
	this.submit = function(){
		// 获得已输入意见
		FlowAppDirect.setOpinion(documentkey, documentid, textarea.getValue(), config.objectkey, function(result, e){
			if(result && result.success){
				opinionWin.window.close();
				MixkyApp.showInfoMessage('意见保存成功!', result, e);
				if (config.objectid) {
					Ext.getCmp(config.objectid).loadValue();
				}
			}else{
				MixkyApp.showDirectActionFail('提交意见', result, e);
			}
		});
	}
	// 获得已输入意见
	FlowAppDirect.getOpinion(documentkey, documentid, config.objectkey, function(result, e){
		if(result && result.success){
			textarea.setValue(result.opinion);
		}else{
			MixkyApp.showDirectActionFail('获取意见', result, e);
		}
	});

	this.window.show();
	this.window.toFront();
};
//=================================================================
//	�ļ�����mixky.flow.stepwindow.js
//=================================================================

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