
Ext.namespace("Mixky.editor");

Mixky.editor.FileField = Ext.extend(Ext.form.DisplayField, {
	
	readOnly : false,			// 只读属性
	
	isMulti : false,			// 允许多选
	
	isImage : false,			// 是否图片域
	
	imageWidth : 70,			// 图片宽度
	
	imageHeight : 30,			// 图片高度
	
	downloadUrl : '#',			// 图片下载链接

    // private
    onRender : function(ct, position){
		Mixky.editor.FileField.superclass.onRender.call(this, ct, position);

		this.fileCount = 0;
		this.fileInputs = [];
		if(!this.readOnly){
			this.btnInsertFileWrap = this.el.createChild({tag:"div",style:"position: absolute;"});
			this.btnInsertFile = new Ext.Button({
	            renderTo: this.btnInsertFileWrap,
	            text : '添 加 附 件',
	            iconCls : 'icon-sys-attachment'
	        });
			this.addFileInput();
		}
    },
    
	// private
    bindFileField : function(fileInput){
		fileInput.on({
	        scope: this,
	        mouseenter: function() {
	            this.btnInsertFile.addClass(['x-btn-over','x-btn-focus'])
	        },
	        mouseleave: function(){
	            this.btnInsertFile.removeClass(['x-btn-over','x-btn-focus','x-btn-click'])
	        },
	        mousedown: function(){
	            this.btnInsertFile.addClass('x-btn-click')
	        },
	        mouseup: function(){
	            this.btnInsertFile.removeClass(['x-btn-over','x-btn-focus','x-btn-click'])
	        },
	        change: function(){
	            var v = this.curFileInput.dom.value;
				this.addFileDisplay(0, v, 0, this.curFileInput);
	        }
	    }); 
	},
	// private
	getFileRowHeight : function(){
		return this.isImage ? this.imageHeight + 2 : 22;
	},
	// private
	adjustFileInputTop : function(){
		var fieldHeight = this.fileCount * this.getFileRowHeight() + 2;
		if(!this.readOnly && (this.isMulti || this.fileCount == 1)){
			var top = (this.fileCount - 1) * this.getFileRowHeight();
		    this.btnInsertFileWrap.setTop(top);
		    this.curFileInput.setTop(top);
		}
		if(!this.readOnly && !this.isMulti){
			if(this.fileCount >1){
				this.btnInsertFileWrap.hide();
				this.curFileInput.setDisplayed('none');
				this.curFileInput.hide();
				fieldHeight = this.getFileRowHeight() + 2;
			}else{
				this.btnInsertFileWrap.show();
				this.curFileInput.setDisplayed('');;
				this.curFileInput.show();
			}
		}
		if(this.readOnly){
			this.curFileInput.setDisplayed('none');
			this.curFileInput.hide();
		}
		this.setHeight(fieldHeight);
	},
	// private
	addFileInput : function(){
		this.curFileInput = this.el.createChild({
            name: this.name + '-0-' + this.fileCount,
            style: 'position: absolute;-moz-opacity: 0;filter:alpha(opacity: 0);opacity: 0;z-index: 2; height: 22px;',
            tag: 'input',
            type: 'file',
            size: 1
        });
		var form = this.findParentByType('form');
		if(Ext.isDefined(form)){
			form.doLayout();
		}
        this.bindFileField(this.curFileInput);
		this.fileCount++;
		this.adjustFileInputTop();
		this.fileInputs.push(this.curFileInput);
	},
	// private
    addFileDisplay : function(fileId, filename, fileSize, fileInput){
		var html = filename + (fileSize > 0 ? ' (' + fileSize + 'Bytes)' : '');
		var wrap = this.el.createChild({tag:'div', style:'height: ' + this.getFileRowHeight() + 'px;'});
	    if(fileId > 0){
			// 从数据库中装入
			var url = this.downloadUrl != '#' ? this.downloadUrl + '&id=' + fileId + '&filename=' + filename : '#';
			if(this.isImage){
				html = '<img align=middle border=0 height=' + this.imageHeight + ' width=' + this.imageWidth + ' src="'+ url +'" title=\''+ html +'\'>';
			}
			var downloadLink = wrap.createChild({tag:"a", href:url, html:html});
			if(!this.readOnly){
				wrap.insertHtml('beforeEnd','　');
				var deleteLink = wrap.createChild({tag:"a", href:'#', html:'删除'});
				deleteLink.on('click', function(){
					wrap.remove();
					this.fileCount--;
					this.adjustFileInputTop();
					// 增加一个空隐藏文件框
					var delInput = this.el.createChild({
			            name: this.name + '-' + fileId,
			            style: 'display:none',
			            tag: 'input',
			            type: 'file'
			        });
					this.fileInputs.push(delInput);
				}, this);
			}
			this.fileCount++;
			this.fileInputs.push(wrap);
			this.adjustFileInputTop();
		}else{
			var downloadLink = wrap.createChild({tag:"a", href:'#', html:filename});
			if(!this.readOnly){
				wrap.insertHtml('beforeEnd','　');
				var deleteLink = wrap.createChild({tag:"a", href:'#', html:'删除'});
				deleteLink.on('click', function(){
					fileInput.remove();
					wrap.remove();
					this.fileCount--;
					this.adjustFileInputTop();
				}, this);
			}
			this.fileInputs.push(wrap);
			fileInput.setDisplayed('none');
			this.addFileInput();
			if(!this.isMulti){
				this.curFileInput.setDisplayed('none');
			}
		}
	},
	setValue : function(v){
		for(var i=0;i<this.fileInputs.length;i++){
			this.fileInputs[i].remove();
		}
		this.fileInputs = [];
		this.fileCount = 0;
		this.addFileInput();
		if(v instanceof Array){
			for(var i=0;i<v.length;i++){
				this.addFileDisplay(v[i].id, v[i].filename, v[i].filesize);
			}
		}
	}
});

Ext.reg('mixkyfilefield', Mixky.editor.FileField);