
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