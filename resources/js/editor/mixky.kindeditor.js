/**
 * 将KindEditor4.1.2 功能封装到命名空间“KE“。
 * @author shuyuan
 */
Ext.namespace("KE");
KE.app = (function() {
	return {
		/**
		 * 初始化editor
		 * @param initParam 初始参数。
		 * @returns
		 */
		init : function (initParam){	
			setTimeout(function(){
				KindEditor.create('#' + initParam.renderTo, initParam);
				KE.app.setValue(initParam.renderTo, initParam.value)
			}, ((!initParam.delayTime || initParam.delayTime) <= 0 ? 5 : initParam.delayTime));
		},
		/**
		 * 获取创建后的editor对象。
		 * @param renderTO textarea的ID，根据此参数查找已创建的editor对象
		 * @returns
		 */
		getEditor : function(renderTO) {
			var editors = KindEditor.instances;
			var editor;
			for(var i = 0; i < editors.length; i++){
				if(editors[i].renderTo && editors[i].renderTo === renderTO){
					editor =  editors[i];
				}else{
					//editor.remove();
				}		
			}
			return editor;
		},
		setValue : function(renderTO,value){
			//alert(renderTO);
			var editor = this.getEditor(renderTO);
			editor.html(value);
		}
	};
})();