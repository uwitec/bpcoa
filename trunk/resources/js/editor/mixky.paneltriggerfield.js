/*!
 * Ext JS Library 3.0.0
 * Copyright(c) 2006-2009 Ext JS, LLC
 * licensing@extjs.com
 * http://www.extjs.com/license
 */

Ext.namespace("Mixky.editor");

Ext.isDefined = function(v){
	return typeof v !== 'undefined';
}

Mixky.editor.PanelTriggerField = Ext.extend(Ext.form.TriggerField, {

    // private
    defaultAutoCreate : {tag: "input", type: "text", size: "24", autocomplete: "off"},

    listClass : '',
    
    listEmptyText: '',
    
    triggerClass : 'x-form-arrow-trigger',
    
    shadow : 'sides',
    
    listAlign : 'tl-bl?',
    
    maxHeight : 400,
    
    minHeight : 120,
    
    resizable : false,
    
    handleHeight : 8,
    
    minListWidth : 120,
    
    lazyInit : true,
    
    confirm : true,
        
    valueFieldName : undefined,

    // private
    initComponent : function(){
        Mixky.editor.PanelTriggerField.superclass.initComponent.call(this);
        this.addEvents(
            'expand',
            'collapse',
            'beforeselect',
            'select',
            'aftersetvalue'
        );
        if(this.transform){
            var s = Ext.getDom(this.transform);
            if(!this.hiddenName){
                this.hiddenName = s.name;
            }
            s.name = Ext.id(); // wipe out the name in case somewhere else they have a reference
            if(!this.lazyRender){
                this.target = true;
                this.el = Ext.DomHelper.insertBefore(s, this.autoCreate || this.defaultAutoCreate);
                this.render(this.el.parentNode, s);
                Ext.removeNode(s); // remove it
            }else{
                Ext.removeNode(s); // remove it
            }
        }
    },

    // private
    onRender : function(ct, position){
        Mixky.editor.PanelTriggerField.superclass.onRender.call(this, ct, position);
        if(this.hiddenName){
            this.hiddenField = this.el.insertSibling({tag:'input', type:'hidden', name: this.hiddenName,
                    id: (this.hiddenId||this.hiddenName)}, 'before', true);

            // prevent input submission
            this.el.dom.removeAttribute('name');
        }
        if(Ext.isGecko){
            this.el.dom.setAttribute('autocomplete', 'off');
        }

        if(!this.lazyInit){
            this.initList();
        }else{
            this.on('focus', this.initList, this, {single: true});
        }
    },

    // private
    initList : function(){
        if(!this.list){
            var cls = 'x-panel';

            this.list = new Ext.Layer({
                parentEl: this.getListParent(),
                shadow: this.shadow,
                cls: [cls, this.listClass].join(' '),
                constrain:false
            });

            var lw = this.listWidth || Math.max(this.wrap.getWidth(), this.minListWidth);
            this.list.setSize(lw, 0);
            this.list.swallowEvent('mousewheel');
            this.assetHeight = 0;
            if(this.syncFont !== false){
                this.list.setStyle('font-size', this.el.getStyle('font-size'));
            }
            if(this.title){
                this.header = this.list.createChild({cls:cls+'-hd', html: this.title});
                this.assetHeight += this.header.getHeight();
            }

            this.innerList = this.list.createChild({cls:cls+'-inner'});
            this.innerList.setWidth(lw - this.list.getFrameWidth('lr'));

            this.panel = this.renderPanel(this.innerList);
            
            if(this.resizable){
                this.resizer = new Ext.Resizable(this.list,  {
                   pinned:true, handles:'se'
                });
                this.mon(this.resizer, 'resize', function(r, w, h){
                    this.maxHeight = h-this.handleHeight-this.list.getFrameWidth('tb')-this.assetHeight;
                    this.listWidth = w;
                    this.innerList.setWidth(w - this.list.getFrameWidth('lr'));
                    this.restrictHeight();
                }, this);

                this['innerList'].setStyle('margin-bottom', this.handleHeight+'px');
            }
        }
    },
    
    getListParent : function() {
        return document.body;
    },

    // private
    initEvents : function(){
        Mixky.editor.PanelTriggerField.superclass.initEvents.call(this);

        this.keyNav = new Ext.KeyNav(this.el, {

            "down" : function(e){
        		this.onTriggerClick();
                this.delayedCheck = true;
                this.unsetDelayCheck.defer(10, this);
            },

            "esc" : function(e){
                this.collapse();
            },

            scope : this,

            doRelay : function(foo, bar, hname){
                if(hname == 'down' || this.scope.isExpanded()){
                   return Ext.KeyNav.prototype.doRelay.apply(this, arguments);
                }
                return true;
            },

            forceKeyDown : true
        });
    },

    // private
    onDestroy : function(){
        Ext.destroy(
            this.resizer,
            this.panel,
            this.list
        );
        Mixky.editor.PanelTriggerField.superclass.onDestroy.call(this);
    },

    // private
    unsetDelayCheck : function(){
        delete this.delayedCheck;
    },

    // private
    fireKey : function(e){
        var fn = function(ev){
            if (ev.isNavKeyPress() && !this.isExpanded() && !this.delayedCheck) {
                this.fireEvent("specialkey", this, ev);
            }
        };
        //For some reason I can't track down, the events fire in a different order in webkit.
        //Need a slight delay here
        if(this.inEditor && Ext.isWebKit && e.getKey() == e.TAB){
            fn.defer(10, this, [new Ext.EventObjectImpl(e)]);
        }else{
            fn.call(this, e);
        }
    },
    
    // private
    onResize : function(w, h){
        Mixky.editor.PanelTriggerField.superclass.onResize.apply(this, arguments);
        if(this.list && !Ext.isDefined(this.listWidth)){
            var lw = Math.max(w, this.minListWidth);
            this.list.setWidth(lw);
            this.innerList.setWidth(lw - this.list.getFrameWidth('lr'));
        }
    },

    // private
    onEnable : function(){
        Mixky.editor.PanelTriggerField.superclass.onEnable.apply(this, arguments);
        if(this.hiddenField){
            this.hiddenField.disabled = false;
        }
    },

    // private
    onDisable : function(){
        Mixky.editor.PanelTriggerField.superclass.onDisable.apply(this, arguments);
        if(this.hiddenField){
            this.hiddenField.disabled = true;
        }
    },

    // inherit docs
    getName: function(){
        var hf = this.hiddenField;
        return hf && hf.name ? hf.name : this.hiddenName || Mixky.editor.PanelTriggerField.superclass.getName.call(this);
    },

    // private
    initValue : function(){
        Mixky.editor.PanelTriggerField.superclass.initValue.call(this);
        if(this.hiddenField){
            this.hiddenField.value =
                Ext.isDefined(this.hiddenValue) ? this.hiddenValue :
                Ext.isDefined(this.value) ? this.value : '';
        }
    },

    /**
     * Returns the currently selected field value or empty string if no value is set.
     * @return {String} value The selected value
     */
    getValue : function(){
        if(this.hiddenField){
        	return this.hiddenField.value;
        }else{
            return Mixky.editor.PanelTriggerField.superclass.getValue.call(this);
        }
    },

    setValue : function(v){
        if(this.hiddenField){
            this.hiddenField.value = v;
        }
        var t = Mixky.editor.PanelTriggerField.superclass.setValue.call(this, v);
        this.fireEvent('aftersetvalue', this);
        return t;
    },

    // private
    restrictHeight : function(){
        this.innerList.dom.style.height = '';
        var inner = this.innerList.dom;
        var pad = this.list.getFrameWidth('tb')+(this.resizable?this.handleHeight:0)+this.assetHeight;
        var h = Math.max(inner.clientHeight, inner.offsetHeight, inner.scrollHeight);
        var ha = this.getPosition()[1]-Ext.getBody().getScroll().top;
        var hb = Ext.lib.Dom.getViewHeight()-ha-this.getSize().height;
        var space = Math.max(ha, hb, this.minHeight || 0)-this.list.shadowOffset-pad-5;
        h = Math.min(h, space, this.maxHeight);

        this.innerList.setHeight(h);
        this.list.beginUpdate();
        this.list.setHeight(h+pad);
        this.list.alignTo(this.wrap, this.listAlign);
        this.list.endUpdate();
    },

    // private
    onEmptyResults : function(){
        this.collapse();
    },

    /**
     * Returns true if the dropdown list is expanded, else false.
     */
    isExpanded : function(){
        return this.list && this.list.isVisible();
    },

    // private
    validateBlur : function(){
        return !this.list || !this.list.isVisible();
    },
    /**
     * Hides the dropdown list if it is currently expanded. Fires the {@link #collapse} event on completion.
     */
    collapse : function(){
        if(!this.isExpanded()){
            return;
        }
        this.list.hide();
        Ext.getDoc().un('mousewheel', this.collapseIf, this);
        Ext.getDoc().un('mousedown', this.collapseIf, this);
        this.fireEvent('collapse', this);
    },

    // private
    collapseIf : function(e){
        if(!e.within(this.wrap) && !e.within(this.list) && this.panelCollapseIf(e)){
            this.collapse();
        }
    },
    
    panelCollapseIf : function(e){
    	if(this.panel.collapseIf){
    		return this.panel.collapseIf(e);
    	}
    	return true;
    },

    /**
     * Expands the dropdown list if it is currently hidden. Fires the {@link #expand} event on completion.
     */
    expand : function(){
        if(this.isExpanded() || !this.hasFocus){
            return;
        }
        this.restrictHeight();
        this.list.alignTo(this.wrap, this.listAlign);
        if(Ext.isDefined(this.panel.beforeexpend)){
        	var valueField = this.findValueFieldCmp();
        	this.panel.beforeexpend(this, valueField);
        }
        this.list.show();
        if(Ext.isGecko2){
            this.innerList.setOverflow('auto'); // necessary for FF 2.0/Mac
        }
        Ext.getDoc().on({
            scope: this,
            mousewheel: this.collapseIf,
            mousedown: this.collapseIf
        });
        this.panel.doLayout();
        this.fireEvent('expand', this);
    },

    /**
     * @method onTriggerClick
     * @hide
     */
    // private
    // Implements the default empty TriggerField.onTriggerClick function
    onTriggerClick : function(){
        if(this.disabled){
            return;
        }
        if(this.isExpanded()){
            this.collapse();
            this.el.focus();
        }else {
            this.onFocus({});
            this.expand();
            this.el.focus();
        }
    },


    // private
    onSelect : function(value, realValue, records){
        if(this.fireEvent('beforeselect', this, value, realValue, records) !== false){
        	if(Ext.isDefined(realValue) && this.hiddenField){
        		this.setValue(realValue, true);
        		this.setRawValue(value);
        	}else{
        		this.setValue(value);
        	}
            
            this.realValue = realValue;
        	var valueField = this.findValueFieldCmp();
        	if(Ext.isDefined(valueField)){
        		valueField.setValue(realValue);
        	}
        	/*
        	else{
	            if(this.hiddenField){
	            	if(realValue == undefined){
	                    this.hiddenField.value = value;
	            	}else{
	                    this.hiddenField.value = realValue;
	            	}
	            }
        	}
        	*/
            if(Ext.isDefined(records)){
            	this.recordsValue = records;
            }
            this.collapse();
            this.fireEvent('select', this, value, realValue, records);
        }
    },  
    
    findValueFieldCmp : function(){
		if(Ext.isDefined(this.valueFieldName)){
			var fp = this.findParentByType('form');
			if(fp){
				return fp.getForm().findField(this.valueFieldName);
			}
		}
    },

    // private
    renderPanel : function(el){
    	var buttons = [];
		// 编辑界面
		var testCombo = new Ext.form.ComboBox({
	    	name:'testcombo',
	    	width:150,
	    	triggerAction: 'all',
	    	mode: 'local',
	    	editable:false,
	    	store:['test1', 'test2']
	    });
    	if(this.confirm){
    		buttons = ['测试选中事件：',testCombo, '->',{
    			text : '确定',
    			iconCls:'icon-designtool-confirm',
    			handler : function(){
					this.onSelect('选中', 'selected');
				},
    			scope:this
    		},'-',{
    			text : '取消',
    			iconCls:'icon-designtool-cancel',
    			handler : function(){
    				this.collapse();
    			},
    			scope:this
    		}];
    	}
        var panel = new Ext.Panel({
            renderTo : el,
            layout:'fit',
            items:[new Ext.Panel({
    			autoScroll : true,
	            bbar : buttons,
	        	html : 'Mixky.editor.PanelTriggerField：下拉输入域<br><br>重载renderPanel(el)方法自定义输入界面。<br><br>范例：<br><br>renderPanel : function(el){<br>　　var panel = new Ext.Panel({<br>　　　　applyTo: el,<br>　　　　html:\'测试录入编辑窗口\'<br>　　});<br>　　return panel;<br>)'
        	})],
        	beforeexpend : function(field, valueField){
        		testCombo.setValue('test2');
        	},
	        collapseIf:function(e){
	    		if(testCombo.wrap && e.within(testCombo.wrap)){
	    			return false;
	    		}
	    		if(testCombo.list && e.within(testCombo.list)){
	    			return false;
	    		}
	    		return true;
		    }
        });
        
        return panel;
    }

});
Ext.reg('paneltriggerfield', Mixky.editor.PanelTriggerField);