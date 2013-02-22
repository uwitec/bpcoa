/*!
 * Ext JS Library 3.1.1
 * Copyright(c) 2006-2010 Ext JS, LLC
 * licensing@extjs.com
 * http://www.extjs.com/license
 */
Ext.ux.Portlet = Ext.extend(Ext.Panel, {
    anchor : '100%',
    frame : true,
    collapsible : true,
    draggable : true,
    cls : 'x-portlet',
    listeners : {
		'afterrender' : function(){
			var id = this.getEl().id;
			var height = this.getEl().getHeight();
			var panel = this;
			this.resizeWrap = new Ext.Resizable(id, {
				handles : 's',
			    height : height,
			    minHeight: 50,
			    dynamic: true,
			    listeners : {
					'resize':function(r, w, h, e){
						panel.setHeight(h);
		    			var subject = MixkyApp.getSubject(panel.key);
		    			subject.webheight  = h;
			        }
				}
			});
		},
		'beforedestroy' : function(){
			delete this.resizeWrap;
		}
	}
});

Ext.reg('portlet', Ext.ux.Portlet);
