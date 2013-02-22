
Ext.namespace('Mixky.editor.SysFiles');

Mixky.editor.SysFiles = Ext.extend(Ext.form.TextField, {
	
	uploadUrl: 'engine/file/sysupload.do',
	uploadParams : {},
	
	defaultAutoCreate:{tag:"input", type:"hidden", name:this.name},
	
	onRender:function (B, A) {
		Mixky.editor.SysFiles.superclass.onRender.call(this, B, A);
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
		MixkyFileDirect.getDocFileList(this.document.document.documentkey, this.document.document.documentid, this.name, function(result, e){
			if(result && result.success) {
				fileEl.filesEl.dom.innerHTML = '';
				if(result.files.length == 0){
					fileEl.filesEl.dom.innerHTML = '未上传文件';
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
		aEl.on('click', function() {field.downloadFile(f.id);});
		this.filesEl.appendChild(aEl);

		if(!this.readOnly){
			var del = document.createElement("A");
			del.innerHTML = '删除';
			del.href = "#";
			
			var delEl = Ext.get(del);
			delEl.on('click', function() {
				field.deleteFile(f.id);
				field.loadFiles();
			});
			this.filesEl.appendChild(delEl);
		}
	},
	
	downloadFile : function(id){
		location.href = "engine/file/sysdownload.do?id=" + id + "&documentdbtype=none&fieldname=" + this.name + "&documentkey=" + this.document.document.documentkey;
	},
	
	deleteFile : function(id){
		var fileEl = this;
		MixkyFileDirect.deleteDocFile(id, function(result, e){
			if(result && result.success) {
				fileEl.loadFiles();
			} else {
				MixkyApp.showAlertMessage('删除文件失败！');
			}
		});
	},
	
	uploadFiles:function(){
		var baseparams = Ext.applyIf({
			documentkey : this.document.document.documentkey,
			documentid : this.document.document.documentid,
			fieldname : this.name
		}, this.uploadParams);
		var dialog = new Ext.ux.UploadDialog.Dialog({
			url: this.uploadUrl,
			modal : true,
			manager : MixkyApp.desktop.getManager(),
			reset_on_hide : false,
			base_params : baseparams,
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
Ext.reg("mixkysysfiles", Mixky.editor.SysFiles);