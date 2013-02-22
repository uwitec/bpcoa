Ext.namespace('Ext.fancy');
Ext.fancy.UploadDialog = Ext.extend( Ext.Window, {
	constructor: function(config){
		config = config || {};
		Ext.applyIf(config, {
			title: '文件上传',
			layout: 'fit',
			items: {
				xtype: 'panel',
				html: '<div id ="fancy-upload-panel"><ul id="fancy-file-list"></ul></div>'
			},
			buttons: [{
					//handler: this.onOk,
					id: this.getId() + '_upload',
					scope: this,
					text: '浏览'
				},{
					handler: function(){
						this.close();
					},
					scope: this,
					text: '关闭'
			}],
			listeners:{
				'show': this.initFancyUpload
			}
		});
		Ext.fancy.UploadDialog.superclass.constructor.apply(this, [config]);
	},
	initComponent: function() {
		this.width = ( !this.width || this.width < 453 ) ? 453 : this.width;
		this.height = ( !this.height || this.height < 300 ) ? 300 : this.height;
		Ext.fancy.UploadDialog.superclass.initComponent.apply( this, arguments );
	},
	onRender: function() {
		Ext.fancy.UploadDialog.superclass.onRender.apply( this, arguments );
		this.renderComponent();
	},
	onOk: function(){
	},
	renderComponent: function() {
	},
	initFancyUpload: function(win) {
		/**
		 * Uploader instance
		 */
		var btnEl = Ext.getCmp(win.getId() + '_upload');
		var up = new FancyUpload3.Attach('fancy-file-list', btnEl.getEl().id, {
			path: 'dependences/fancyupload/source/Swiff.Uploader.swf',
			url: win.url,
			data: win.base_params,
			fileSizeMax: 2 * 1024 * 1024,
			container: win.getId(),
			
			verbose: true,
			
			onSelectFail: function(files) {
				files.each(function(file) {
					new Element('li', {
						'class': 'file-invalid',
						events: {
							click: function() {
								this.destroy();
							}
						}
					}).adopt(
						new Element('span', {html: file.validationErrorMessage || file.validationError})
					).inject(this.list, 'bottom');
				}, this);	
			},
			
			onFileSuccess: function(file) {
				new Element('input', {type: 'checkbox', 'checked': true}).inject(file.ui.element, 'top');
				//var removeEl = new Element('a', {'class': 'file-cancel', text: 'Remove', href: '#'});
				//removeEl.addEvent('click', function() {
					//file.remove();
					//return false;
				//});
				//removeEl.inject(file.ui.size, 'after');
				file.ui.element.highlight('#e6efc2');
			},
			
			onFileError: function(file) {
				file.ui.cancel.set('html', 'Retry').removeEvents().addEvent('click', function() {
					file.requeue();
					return false;
				});
				
				new Element('span', {
					html: file.errorMessage,
					'class': 'file-error'
				}).inject(file.ui.cancel, 'after');
			},
			
			onFileRequeue: function(file) {
				file.ui.element.getElement('.file-error').destroy();
				
				file.ui.cancel.set('html', 'Cancel').removeEvents().addEvent('click', function() {
					file.remove();
					return false;
				});
				
				this.start();
			}
			
		});		
	}
});