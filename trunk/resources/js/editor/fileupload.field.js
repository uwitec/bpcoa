
Ext.namespace("Mixky.editor");


Mixky.editor.FileUploadField = Ext.extend(Ext.form.TextField, {

	defaultAutoCreate:{tag:"input", type:"hidden", name:this.name},
	
	buttonText: '上传...',

    // private
    readOnly: false,
    
    uploadFieldName: undefined,
    
    isImage: false,

    // private
    onRender : function(ct, position){
		alert(3344);
		Mixky.editor.FileUploadField.superclass.onRender.call(this, ct, position);
		
		if (this.isImage) {
			this.imgwrap = this.el.wrap({cls:'x-form-field-wrap x-form-file-wrap'});
			 this.imgDisplay = this.imgwrap.createChild({
		        	tag : 'div',
		        	cls : 'x-form-file-msg',
		        	html : '&nbsp;'
		        });
		}
		
        this.wrap = this.el.wrap({cls:'x-form-field-wrap x-form-file-wrap'});
        
        // 录入框
        this.fileInput = this.wrap.createChild({
            name: this.uploadFieldName||this.name + '_',
            cls: 'x-form-file',
            tag: 'input',
            type: 'file',
            size:0
        });

        // 文件名显示
        this.filenameDisplay = this.wrap.createChild({
        	tag : 'div',
        	cls : 'x-form-file-msg',
        	html : '&nbsp;'
        })
        
        // 上传按钮
        this.buttonWrap = this.wrap.createChild({
            tag: 'div'
        });
        var btnCfg = Ext.applyIf(this.buttonCfg || {}, {
            text: this.buttonText
        });
        this.button = new Ext.Button(Ext.apply(btnCfg, {
            renderTo: this.buttonWrap,
            cls: 'x-form-file-btn' + (btnCfg.iconCls ? ' x-btn-icon' : '')
        }));

        // 选中文件
        this.fileInput.on('change', function(){
            var v = this.fileInput.dom.value;
            this.setValue(v, true);
            this.fireEvent('fileselected', this, v);
        }, this);
    },
    
    setValue : function(v, isLocal){
    	if(isLocal){
    		// 本地选中
    		if (v == '') {
    			this.filenameDisplay.update(" ");
    		} else {
    			this.filenameDisplay.update('<b>已选文件 :</b> ' + v);
    		}
    		
        	Mixky.editor.UploadField.superclass.setValue.call(this, v);
    	}else{
    		if (v == '' || v == null || v == 'null' || v == '[object Object]') {
    			
    		} else {
	    		// 远程设置文件名
				var href_url = "download.do?documentid=" + this.document.document.documentid + "&documentkey=" + this.document.document.documentkey + "&filename=" + v;
	
	    		if(this.readOnly){
	    			if (this.isImage) {
	    				this.imgDisplay.update('<b>已选文件 :</b> ' + v);
	    			} else {
	    				this.filenameDisplay.update('<a href="' + href_url + '">' + v + '</a> ');
	    			}
	        		
	    			// 只读
	    		}else{
	    			// 可编辑（允许删除）
	    			alert(this.isImage);
	    			if (this.isImage) {
	    				alert(33);
	    				this.imgDisplay.update('<b>已选文件 :</b> ' + v);
	    			}
	
	        		this.filenameDisplay.update('<a href="' + href_url + '">' + v + '</a>  ');
	        		var del = document.createElement("A");
	    			del.innerHTML = '删除';
	    			del.href = "#";
	    			
	    			var delEl = Ext.get(del);
	    			var field = this;
	    			delEl.on('click', function() {
	    				//field.setValue("", true);
	    				field.deleteFieldFile(v);
	    			});
	        		this.filenameDisplay.appendChild(del);
	        		
	    		}
	        	Mixky.editor.UploadField.superclass.setValue.call(this, v);
    		}
    	}
    },
    
    deleteFieldFile: function(v) {
    	var fileEl = this;
		CrcaAppDirect.deleteFile(this.document.document.documentkey, this.document.document.documentid, v, function(result, e){
			if(result && result.success) {
				fileEl.setValue("", true);
			} else {
				MixkyApp.showAlertMessage('删除文件失败！');
			}
		});
    	
    },

    // private
    onDestroy: function(){
    	Mixky.editor.FileUploadField.superclass.onDestroy.call(this);
        Ext.destroy(this.fileInput, this.button, this.buttonWrap, this.wrap);
    },

    // private
    onResize : function(w, h){
    	Mixky.editor.FileUploadField.superclass.onResize.call(this, w, h);
        this.wrap.setWidth(w);
        this.filenameDisplay.setWidth(w - this.button.getEl().getWidth() - 5);
        this.fileInput.setLeft(this.button.getEl().getWidth() - this.fileInput.getWidth())
    },

    // private
    preFocus : Ext.emptyFn,

    // private
    getResizeEl : function(){
        return this.wrap;
    },

    // private
    getPositionEl : function(){
        return this.wrap;
    },

    // private
    alignErrorIcon : function(){
        this.errorIcon.alignTo(this.wrap, 'tl-tr', [2, 0]);
    }
});
Ext.reg('fileuploadfield', Mixky.editor.FileUploadField);