
Ext.namespace('Mixky.editor.SysFiles');

Mixky.editor.MutiFileUploadField = Ext.extend(Ext.form.TextField, {
	
	defaultAutoCreate:{tag:"input", type:"hidden", name:this.name},
	
	onRender:function (B, A) {
		Mixky.editor.MutiFileUploadField.superclass.onRender.call(this, B, A);
		this.valueEl = this.el;
		this.wrap = this.el.wrap();
		this.filesEl = this.wrap.createChild({tag:"div",style:'background-color:lightyellow;'});
		if(!this.readOnly){
			this.filesButtonEl = this.wrap.createChild({tag:"div"});
			this.filesButton = new Ext.Button({
				text:'上传附件',
				handler:this.uploadFiles, 
				iconCls:'icon-app-upload',
				scope:this
			});
			this.filesButton.render(this.filesButtonEl);
		}
		this.loadFiles();
	},
	
	loadFiles:function(){
		var fileEl = this;
		CrcaAppDirect.getDocFileList(this.document.document.documentkey, this.document.document.documentid, this.name, function(result, e){
			if(result && result.success) {
				fileEl.filesEl.dom.innerHTML = '';
				if(result.files.length == 0){
					//fileEl.filesEl.dom.innerHTML = '无上传文件';
				}else{
					var ids;
					for(var i=0;i<result.files.length;i++){
						if(i > 0){
							fileEl.filesEl.appendChild(document.createElement("<BR>"));
						}
						fileEl.appendFile(result.files[i]);
						ids = ids + result.files[i].id;
					}
					fileEl.setValue(ids);
				}
			} else {
				MixkyApp.showAlertMessage('装载文件失败！');
			}
        });
	},
	
	appendFile : function(f){
		var field = this;
		
		var a = document.createElement("A");
		a.innerHTML = f.filename;
		a.href = "#";
		
		var aEl = Ext.get(a);
		aEl.on('click', function() {field.downloadFile(f.filename);});
		this.filesEl.appendChild(aEl);

		if(!this.readOnly){
			var del = document.createElement("A");
			del.innerHTML = '删除';
			del.href = "#";
			
			var delEl = Ext.get(del);
			delEl.on('click', function() {
				field.deleteFile(f.filename);
				field.loadFiles();
			});
			this.filesEl.appendChild(delEl);
		}
	},
	
	downloadFile : function(filename){
		location.href = "download.do?type=multifile&filename=" + filename + "&documentid="+this.document.document.documentid+"&documentkey=" + this.document.document.documentkey;
	},
	
	deleteFile : function(filename){
		var fileEl = this;
		CrcaAppDirect.deleteDocFile(this.document.document.documentkey, this.document.document.documentid, filename, function(result, e){
			if(result && result.success) {
				fileEl.loadFiles();
			} else {
				MixkyApp.showAlertMessage('删除文件失败！');
			}
		});
	},
	
	uploadFiles:function(){
		var dialog = new Ext.ux.UploadDialog.Dialog({
			url: 'fileupload.do',
			modal : true,
			manager : MixkyApp.desktop.getManager(),
			reset_on_hide : false,
			base_params : {
				documentkey : this.document.document.documentkey,
				documentid : this.document.document.documentid,
				fieldname : this.name
			},
			allow_close_on_upload : true,
			upload_autostart : true,
			post_var_name : 'upload'
		});
		dialog.on('uploadsuccess', this.loadFiles, this);
		dialog.show(this.filesButtonEl);
	},

	validate:function () {
		return true;
	}
});
Ext.reg("mutifileuploadfield", Mixky.editor.MutiFileUploadField);