<%@ page contentType="text/html; charset=utf-8"%>
<%@ page import="java.util.List"%>
<%@ page import="com.google.gson.JsonArray"%>
<%@ page import="com.mixky.engine.store.TableForm"%>
<%@ page import="com.mixky.engine.common.DesignObjectLoader"%>
<%@ page import="com.mixky.engine.document.ObjectAuthority"%>
<%@ page import="com.mixky.engine.store.StoreManager"%>
<%@ page import="com.mixky.engine.store.Field"%>
<%@ page import="com.mixky.engine.common.gson.JsonFunction"%>
<%
	// 读取参数
	String panelid = request.getParameter("panelid");
	String formkey = request.getParameter("formkey");
	// 获得表单对象
	TableForm tableform = DesignObjectLoader.instance().loadDesignObject(formkey);
	// 获得表单布局
	JsonArray formLayout = tableform.getFormColumnLayout();
	List<ObjectAuthority> fieldauths = tableform.getFieldAuths();
%>
<script language='javascript'>
Ext.onReady(function(){
	var panel = Ext.getCmp('<%=panelid%>');

<%
	for(int i=0;i<fieldauths.size();i++){
		ObjectAuthority auth = fieldauths.get(i);
		Field field = (Field)auth.getObject();
%>
		var <%=field.getF_name()%> = <%=StoreManager.instance().getFieldEditor(auth) %>;
		<%=field.getF_name()%>.document = panel;
<%
		if(field.getF_inputtype() == Field.INPUTT_NONE){
			formLayout.add(new JsonFunction(field.getF_key()));
		}
	}
%>	
	var form = new Ext.form.FormPanel({
		labelWidth : 70,
		border : false,
		fileUpload : true,
		waitMsgTarget : panel.getEl(),
		bodyStyle : "padding:10px;padding-left:0px;",
		paramOrder : ['formkey', 'dataid', 'params'],
		baseParams : {
			formkey : '<%=formkey%>',
			dataid : 0,
			params : panel.initValues || {}
		},
		api : {
			load : DocumentAppDirect.loadFormData,
			submit : DocumentAppDirect.submitSimpleForm
		},
		items : <%=formLayout.toString()%>,
		setDataId : function(id){
			id = parseInt(id);
			this.disable();
			this.getForm().reset();
			this.getForm().baseParams.dataid  = id;
			this.getForm().setValues({
				ID : id
			});
		}
	});
	form.getForm().on('actioncomplete', function(f, a){
		if(a.type == 'directload'){
			form.enable();
		}
	});
	// 赋值
	panel.setValues = function(values){
		form.getForm().setValues(values);
	}
	// 清空表单
	panel.clearForm = function(){
		form.setDataId(0);
	}
	// 装载记录
	panel.loadRecord = function(id, fn){
		form.setDataId(id);
		form.load({
			waitMsg : '正在装载表单数据，请稍候...',
			success : function(f, a){
				form.getForm().baseParams.dataid  = a.result.data.ID;
				if(Ext.isDefined(a.result.renderer)){
					for(n in a.result.renderer){
						var field = f.findField(n);
						if(field){
							if(Ext.isDefined(field.setRawValue)){
								field.setRawValue(a.result.renderer[n]);
							}else{
								field.setValue(a.result.renderer[n]);
							}
						}
					}
				}
				if(Ext.isDefined(fn)){
					fn(a.result.data);
				}
			}
		});
	}
	// 添加记录
	panel.insertRecord = function(){
		panel.loadRecord(0);
	}
	// 保存记录
	panel.saveRecord = function(fn){
		if(form.getForm().isDirty()){
			if(!form.getForm().isValid()){
				MixkyApp.showErrorMessage("表单数据填写非法，保存失败");
				return;
			}
			form.getForm().submit({
				waitMsg : '正在保存表单数据，请稍候...', 
				success : function(f,a){
					form.setDataId(0);
					MixkyApp.showInfoMessage('保存完毕！', '操作提示');
					if(Ext.isDefined(fn)){
						fn();
					}
				},
				failure : function(f, a){
					MixkyApp.showFormActionFail(f, a);
				}
			});
		}else{
			if(Ext.isDefined(fn)){
				fn();
			}
		}
	}
	// 删除记录
	panel.deleteRecord = function(fn){
		if(form.getForm().baseParams.dataid == 0){
			return;
		}
		Ext.MessageBox.confirm('危险操作提示', '删除文档，该操作不可恢复，您确定吗？', function(btn){
			if(btn == 'yes'){
				DocumentAppDirect.deleteFormRecord('<%=formkey%>', form.getForm().baseParams.dataid, function(result, e){
					if(result && result.success){
						form.setDataId(0);
						MixkyApp.showInfoMessage('删除完毕！', '操作提示');
						if(Ext.isDefined(fn)){
							fn();
						}
					}else{
						MixkyApp.showErrorMessage("删除失败，请重试！");
					}
				});
			}
		});
	}
	// 输出附加脚本 begin
	<%
		if(tableform.getF_config() != null && tableform.getF_config().has("customscript")){
			out.print(tableform.getF_config().get("customscript").getAsString());
		}
	%>
	// 输出附加脚本 end

	// 显示页面
	panel.add(form);
	panel.doLayout();
	panel.clearForm();
	if(Ext.isDefined(panel.onFormLoaded)){
		panel.onFormLoaded();
	}
});
</script>