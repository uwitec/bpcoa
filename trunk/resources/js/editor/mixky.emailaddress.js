
Ext.namespace("Mixky.editor");

Mixky.editor.EmailAddress = Ext.extend(Ext.form.TextArea,  {

    queryDelay : 500,
    
    queryParam : 'query',
    
    minChars : 1,
    
    minListWidth : 200,
    
    lazyInit : true,

    listClass : '',
    
    displayField : 'display',
    
    valueField : 'value',
    
    selectedClass : 'x-combo-selected',
    
    shadow : 'sides',

    listAlign : 'tl-bl?',

    maxHeight : 300,

    minHeight : 90,
    
    itemSeparator : ',',
    
    url : 'emailaddress.jsp',
    
    directFn : undefined,

    // private
    initComponent : function(){
		Mixky.editor.EmailAddress.superclass.initComponent.call(this);
        this.addEvents(
            'expand',

            'collapse',

            'beforeselect',

            'select',

            'beforequery'
        );
        var reader = new Ext.data.JsonReader({
			root		: 'results',
			totalProperty: 'rows',
			fields		:[this.displayField,this.valueField]
		});
        if(Ext.isDefined(this.directFn)){
            this.store = new Ext.data.Store({
    			proxy : new Ext.data.DirectProxy({
    				directFn : this.directFn,
    				paramsAsHash : true,
    				paramOrder : [this.queryParam]
    			}),
    			reader : reader
    		});
        }else{
            this.store = new Ext.data.Store({
    			proxy : new Ext.data.HttpProxy({
    				url : this.url
    			}),
    			reader : reader
    		});
        }
        if(!Ext.isDefined(this.initialConfig.minChars)){
            this.minChars = 0;
        }
        this.selectedIndex = -1;
	},
    // private
    initEvents : function(){
		Mixky.editor.EmailAddress.superclass.initEvents.call(this);

        this.keyNav = new Ext.KeyNav(this.el, {
            "up" : function(e){
                this.inKeyMode = true;
                this.selectPrev();
            },

            "down" : function(e){
                this.inKeyMode = true;
                this.selectNext();
            },

            "enter" : function(e){
                this.onViewClick();
                this.delayedCheck = true;
                this.unsetDelayCheck.defer(10, this);
            },

            "esc" : function(e){
                this.collapse();
            },

            "tab" : function(e){
                this.onViewClick(false);
                return true;
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
        this.queryDelay = Math.max(this.queryDelay || 250);
        this.dqTask = new Ext.util.DelayedTask(this.initQuery, this);
        if(this.editable !== false && !this.enableKeyEvents){
            this.mon(this.el, 'keyup', this.onKeyUp, this);
        }
    },

    // private
    onRender : function(ct, position){
    	Mixky.editor.EmailAddress.superclass.onRender.call(this, ct, position);

        this.wrap = this.el.wrap({cls: 'x-form-field-wrap x-form-field-trigger-wrap'});
        if(!this.width){
            this.wrap.setWidth(this.el.getWidth());
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
            var cls = 'x-combo-list';

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
                this.list.setStyle('font-size', this.wrap.getStyle('font-size'));
            }
            if(this.title){
                this.header = this.list.createChild({cls:cls+'-hd', html: this.title});
                this.assetHeight += this.header.getHeight();
            }

            this.innerList = this.list.createChild({cls:cls+'-inner'});
            this.mon(this.innerList, 'mouseover', this.onViewOver, this);
            this.mon(this.innerList, 'mousemove', this.onViewMove, this);
            this.innerList.setWidth(lw - this.list.getFrameWidth('lr'));

            if(!this.tpl){
                this.tpl = '<tpl for="."><div class="'+cls+'-item">{' + this.displayField + '}</div></tpl>';
            }

            this.view = new Ext.DataView({
                applyTo: this.innerList,
                tpl: this.tpl,
                singleSelect: true,
                selectedClass: this.selectedClass,
                itemSelector: this.itemSelector || '.' + cls + '-item',
                emptyText: this.listEmptyText
            });

            this.mon(this.view, 'click', this.onViewClick, this);

            this.bindStore(this.store, true);
        }
    },
    
    getStore : function(){
        return this.store;
    },

    getListParent : function() {
        return document.body;
    },
    
    // private
    onKeyUp : function(e){
        var k = e.getKey();
        if(this.editable !== false && (k == e.BACKSPACE || !e.isSpecialKey())){
            this.lastKey = k;
            this.dqTask.delay(this.queryDelay);
        }
        Mixky.editor.EmailAddress.superclass.onKeyUp.call(this, e);
    },

    // private
    bindStore : function(store, initial){
        if(this.store && !initial){
            this.store.un('beforeload', this.onBeforeLoad, this);
            this.store.un('load', this.onLoad, this);
            this.store.un('exception', this.collapse, this);
            if(this.store !== store && this.store.autoDestroy){
                this.store.destroy();
            }
            if(!store){
                this.store = null;
                if(this.view){
                    this.view.bindStore(null);
                }
            }
        }
        if(store){
            this.store = Ext.StoreMgr.lookup(store);
            this.store.on({
                scope: this,
                beforeload: this.onBeforeLoad,
                load: this.onLoad,
                exception: this.collapse
            });

            if(this.view){
                this.view.bindStore(store);
            }
        }
    },
    
    // private
    onBeforeLoad : function(){
        if(!this.hasFocus){
            return;
        }
        this.innerList.update(this.loadingText ?
               '<div class="loading-indicator">'+this.loadingText+'</div>' : '');
        this.restrictHeight();
        this.selectedIndex = -1;
    },

    // private
    onLoad : function(){
        if(!this.hasFocus){
            return;
        }
        if(this.store.getCount() > 0){
            this.expand();
            this.restrictHeight();
            this.select(0, true);
        }else{
            this.onEmptyResults();
        }
        //this.el.focus();
    },

    // private
    onEmptyResults : function(){
        this.collapse();
    },
    
    // private
    validateBlur : function(){
        return !this.list || !this.list.isVisible();
    },
    
    // private
    initQuery : function(){
    	var q = this.getItemText();
    	if(q == '' || Ext.isEmpty(q)){
            this.collapse();
    		return;
    	}
        this.doQuery(this.getItemText());
    },
    
    doQuery : function(q){
        q = Ext.isEmpty(q) ? '' : q;
        var qe = {
            query: q,
            field: this,
            cancel:false
        };
        if(this.fireEvent('beforequery', qe)===false || qe.cancel){
            return false;
        }
        q = qe.query;
        this.store.baseParams[this.queryParam] = q;
        this.store.load();
        this.expand();
    },

    // private
    unsetDelayCheck : function(){
        delete this.delayedCheck;
    },

    isExpanded : function(){
        return this.list && this.list.isVisible();
    },

    select : function(index, scrollIntoView){
        this.selectedIndex = index;
        this.view.select(index);
        if(scrollIntoView !== false){
            var el = this.view.getNode(index);
            if(el){
                this.innerList.scrollChildIntoView(el, false);
            }
        }
    },

    // private
    selectPrev : function(){
        var ct = this.store.getCount();
        if(ct > 0){
            if(this.selectedIndex == -1){
                this.select(0);
            }else if(this.selectedIndex !== 0){
                this.select(this.selectedIndex-1);
            }
        }
    },

    // private
    selectNext : function(){
        var ct = this.store.getCount();
        if(ct > 0){
            if(this.selectedIndex == -1){
                this.select(0);
            }else if(this.selectedIndex < ct-1){
                this.select(this.selectedIndex+1);
            }
        }
    },
    
    // private
    onViewMove : function(e, t){
        this.inKeyMode = false;
    },

    // private
    onViewOver : function(e, t){
        if(this.inKeyMode){ // prevent key nav and mouse over conflicts
            return;
        }
        var item = this.view.findItemFromChild(t);
        if(item){
            var index = this.view.indexOf(item);
            this.select(index, false);
        }
    },
    
    onViewClick : function(doFocus){
        var index = this.view.getSelectedIndexes()[0];
        var r = this.store.getAt(index);
        if(r){
            this.onSelect(r, index);
        }
        if(doFocus !== false){
            this.el.focus();
        }
    },
    
    // private
    onSelect : function(record, index){
        if(this.fireEvent('beforeselect', this, record, index) !== false){
            this.replaceItemText(record.data[this.valueField]);
            this.collapse();
            this.fireEvent('select', this, record, index);
        }
    },
    
    getItemText : function(){
    	var q = this.getRawValue();
    	var pos = this.el.dom.selectionStart;
    	var qb = q.substr(0, pos);
    	var indexb = qb.lastIndexOf(this.itemSeparator) + 1;
    	var qa = q.substr(pos);
    	var indexa = qa.indexOf(this.itemSeparator);
    	if(indexa < 0){
    		indexa = q.length;
    	}else{
    		indexa = pos + indexa;
    	}

    	return q.substr(indexb, indexa - indexb);
    },
    
    replaceItemText : function(v){
    	var q = this.getRawValue();
    	var pos = this.el.dom.selectionStart;
    	var qb = q.substr(0, pos);
    	var indexb = qb.lastIndexOf(this.itemSeparator) + 1;
    	var qa = q.substr(pos);
    	var indexa = qa.indexOf(this.itemSeparator);
    	if(indexa < 0){
    		indexa = q.length;
    	}else{
    		indexa = indexa + pos + 1;
    	}
    	
    	var t = q.substr(0, indexb) + v + this.itemSeparator + q.substr(indexa);
    	
    	this.el.dom.selectionStart = indexb + v.length + 1;
    	
    	this.setValue(t);
    },

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
        if(!e.within(this.list)){
            this.collapse();
        }
    },

    expand : function(){
        if(this.isExpanded() || !this.hasFocus){
            return;
        }
        this.list.alignTo(this.wrap, this.listAlign);
        this.list.show();
        if(Ext.isGecko2){
            this.innerList.setOverflow('auto'); // necessary for FF 2.0/Mac
        }
        Ext.getDoc().on({
            scope: this,
            mousewheel: this.collapseIf,
            mousedown: this.collapseIf
        });
        this.fireEvent('expand', this);
    },
    
    // private
    restrictHeight : function(){
        this.innerList.dom.style.height = '';
        var inner = this.innerList.dom;
        var pad = this.list.getFrameWidth('tb')+this.assetHeight;
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
    onResize : function(w, h){
    	Mixky.editor.EmailAddress.superclass.onResize.apply(this, arguments);
        if(this.list && !Ext.isDefined(this.listWidth)){
            var lw = Math.max(w, this.minListWidth);
            this.list.setWidth(lw);
            this.innerList.setWidth(lw - this.list.getFrameWidth('lr'));
        }
    }
});

Ext.reg('mixkyemailaddress', Mixky.editor.EmailAddress);