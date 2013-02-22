
Ext.namespace("Mixky.help");

Mixky.help.HelpEditorWindow = function(){
	var displayField = new Ext.grid.GridEditor(new Ext.form.TextField({readOnly:true, selectOnFocus:true}));
	var textareaField = new Ext.grid.GridEditor(new Ext.form.TextArea({selectOnFocus:true}));
	var emptySource = {
		'key' : '',
		'text' : '',
		'qtip' : '',
		'icon' : '',
		'keypath' : '',
		'docfile' : ''
	}
	var grid = new Ext.grid.PropertyGrid({
		border : false,
		source : emptySource,
		customEditors : {
			"key" : displayField,
			"keypath" : displayField,
			"qtip" : textareaField,
			"docfile" : displayField
		},
		propertyNames : {
	        "key": 'KEY（<FONT color=red>只读</FONT>）',
        	"text" : '帮助主题',
        	"icon" : '图标路径',
	        "qtip": '说明',
	        "keypath": '路径（<FONT color=red>只读</FONT>）',
			"docfile" : 'WORD文件（<FONT color=red>只读</FONT>）'
		}
	});
	grid.getColumnModel().setColumnWidth(0, 30);
	grid.on('propertychange', function(source, id, v, oldValue){
		var index = grid.getStore().find('name', id);
		if(index >=0){
			grid.getStore().getAt(index).markDirty();
		}
	});
	var win = new Ext.Window({
		width : 450,
		height : 400,
		closeAction : 'hide',
		title : '目录属性编辑窗口',
		layout : 'fit',
		iconCls : 'icon-attributewin',
		resizable : false,
		items : grid,
		tbar : [{
			text : '上一主题',
			icon : 'images/previous.gif',
			handler : function(){
				win.startEditPrevious();
			}
		}, {
			text : '下一主题',
			icon : 'images/next.gif',
			handler : function(){
				win.startEditNext();
			}
		}, '->', new Mixky.plugins.UploadButton({
			id : 'uploadButton',
			text:'上传Word文件',
			icon : 'images/upload.gif',
			uploadConfig : {
				flash_url : '../../../dependences/swfupload/swfupload.swf',
				upload_url : 'editor.upload.jsp',
				file_types : '*.doc;',
				file_types_description : 'Word文件',
				file_upload_limit : '0',
				post_params : {
					action : '6'
				},
				listeners : {
					'allUploadsComplete' : function(){
						win.refresh();
					},
					'startUpload' : function(){
						this.addPostParam('keypath', win.node.getPath('key'));
					}
				}
			}
		}), {
			text : '保存',
			icon : 'images/save.gif',
			handler : function(){
				var isDirty = false
				var json = {};
				var action = 5;
				var keypath = win.node.getPath('key');
				if(win.node.attributes.isnew){
					if(Ext.isDefined(win.node.attributes.index)){
						action = 3;
					}else{
						action = 2;
					}
					keypath = win.node.parentNode.getPath('key');
				}
				for(var i=0;i<grid.getStore().getCount();i++){
					var record = grid.getStore().getAt(i);
					if(record.get('name') == 'key' || record.get('name') == 'text'){
						json[record.get('name')] = record.get('value');
					}
					if(record.dirty){
						json[record.get('name')] = record.get('value');
						isDirty = true;
					}
				}
				if(json.key == '' || json.text == ''){
					return;
				}
				win.node.attributes.key = json.key;
				if(isDirty){
					Ext.Ajax.request({
						url: 'editor.exe.jsp',
						params : {
							action : action,
							keypath : keypath,
							index : win.node.attributes.index,
							json : Ext.encode(json)
						},
						success : function(response){
							var o = Ext.decode(response.responseText);
							if(o && o.success){
								win.refresh();
							}else{
								alert('保存失败');
							}
						}
					});
				}
			}
		}]
	});
	win.startEditPanertNext = function(node){
		if(node.nextSibling){
			node.nextSibling.select();
		}else if(node.parentNode){
			win.startEditPanertNext(node.parentNode);
		}
	}
	win.startEditNext = function(){
		if(win.node.firstChild){
			win.node.firstChild.select();
		}else if(win.node.nextSibling){
			win.node.nextSibling.select();
		}else{
			win.startEditPanertNext(win.node.parentNode);
		}
	}
	win.startEditPrevious = function(){
		if(win.node.previousSibling){
			win.node.previousSibling.select();
		}else{
			win.node.parentNode.select();
		}
	}
	win.startEdit = function(node){
		win.node = node;
		var source;
		if(win.node.attributes.isnew){
			grid.propertyNames["key"] = 'KEY';
			grid.customEditors["key"] = undefined;
			Ext.getCmp('uploadButton').disable();
			source = {
				'key' : '',
				'keypath' : node.getPath('key').substring(6),
				'text' : '',
				'icon' : '',
				'qtip' : '',
				'docfile' : ''
			};
		}else{
			grid.propertyNames["key"] = 'KEY（<FONT color=red>只读</FONT>）';
			grid.customEditors["key"] = displayField;
			Ext.getCmp('uploadButton').enable();
			source = {
				'key' : node.attributes.key,
				'keypath' : node.getPath('key').substring(6),
				'text' : node.attributes.text,
				'icon' : node.attributes.icon ? node.attributes.icon : '',
				'qtip' : node.attributes.qtip ? node.attributes.qtip : '',
				'docfile' : node.getPath('key').substring(6) + '.doc'
			};
		}
		grid.setSource(source);
		win.enable();
	}
	win.stopEdit = function(){
		if(win.node && win.node.attributes.isnew){
			win.node.remove();
		}
		win.node = undefined;
		win.disable();
	}
	return win;
}