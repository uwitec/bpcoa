Ext.namespace("Mixky.app.common");

Mixky.app.common.dictionaryRenderer = function(val, dictionaryname){
	var dictionary = Mixky.app.Dictionarys[dictionaryname];
	var display = val;
	if(Ext.isDefined(dictionary)){
		dictionary.each(function(record){
			if(record.get('display') == val || record.get('value') == val){
				display = record.get('display');
				return false;
			}
		});
	}
	return display;
}

Mixky.app.common.getDictionaryUrlRender = function(url, value, fn){
	Ext.Ajax.request({
		url: url,
		success: function(response, opts){
			var obj = Ext.decode(response.responseText);
			if(obj && Ext.isDefined(obj.key)){
				fn(obj.key, value);
			}
		},
		params: { value: value }
	});
}

Mixky.app.common.getDictionaryDourlRender = function(url, value, fn, params){
	Ext.Ajax.request({
		url: "page.do",
		success: function(response, opts){
			var obj = Ext.decode(response.responseText);
			if(obj && Ext.isDefined(obj.key)){
				fn(obj.key, value);
			}
		},
		params: Ext.apply({url:url, value: value}, params)
	});	
}

Mixky.app.common.getDictionaryUrlStore = function(url){
	return new Ext.data.Store({
		proxy		: new Ext.data.HttpProxy({
			url			: url
		}),
		reader		: new Ext.data.JsonReader({
			root		: 'results',
			id			:'display',
			fields		:["display","value"]
		})
	});
}

Mixky.app.common.getDictionaryDoUrlStore = function(url, params){
	return new Ext.data.Store({
		proxy		: new Ext.data.HttpProxy({
			url			: "page.do"
		}),
		baseParams : Ext.apply({url:url}, params),
		reader		: new Ext.data.JsonReader({
			root		: 'results',
			id			:'display',
			fields		:["display","value"]
		})
	});
}

Mixky.app.common.getDictionaryDirectStore = function(fn){
	return new Ext.data.DirectStore({
	    paramsAsHash: false,
	    idProperty: 'display',
	    root: 'results',
	    directFn: fn,
	    fields: ['display', 'value']
	});
}