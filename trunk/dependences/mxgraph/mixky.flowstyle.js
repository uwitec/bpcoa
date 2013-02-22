Ext.namespace("Mixky.lib");

Mixky.lib.initFlowStylesheet = function(stylesheet){
	stylesheet.putCellStyle('node', Mixky.lib.getNodeStyle('node'));
	stylesheet.putCellStyle('nodeStart', Mixky.lib.getNodeStyle('nodeStart'));
	stylesheet.putCellStyle('nodeEnd', Mixky.lib.getNodeStyle('nodeEnd'));
	stylesheet.putCellStyle('nodeDone', Mixky.lib.getNodeStyle('nodeDone'));
	stylesheet.putCellStyle('nodeUndo', Mixky.lib.getNodeStyle('nodeUndo'));
	stylesheet.putCellStyle('nodeDoing', Mixky.lib.getNodeStyle('nodeDoing'));

	stylesheet.putCellStyle('route', Mixky.lib.getRouteStyle('route'));
	stylesheet.putCellStyle('routeUp', Mixky.lib.getRouteStyle('routeUp'));
	stylesheet.putCellStyle('routeDown', Mixky.lib.getRouteStyle('routeDown'));
}

Mixky.lib.getNodeStyle = function(key){
	var style = new Object();
	style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_LABEL;
    style[mxConstants.STYLE_FONTSIZE] = '12';
    style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_CENTER;
    style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_MIDDLE;
    style[mxConstants.STYLE_STROKECOLOR] = '#666666';
    style[mxConstants.STYLE_FILLCOLOR] = '#C3D9FF';
    style[mxConstants.STYLE_GRADIENTCOLOR] = '#FFFFFF';
	switch(key){
	case 'node':
		break;
	case 'nodeStart':
		style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_ELLIPSE;
		style[mxConstants.STYLE_PERIMETER] = mxConstants.PERIMETER_ELLIPSE;
	    style[mxConstants.STYLE_FILLCOLOR] = '#90EE90';
		break;
	case 'nodeEnd':
		style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_ELLIPSE;
		style[mxConstants.STYLE_PERIMETER] = mxConstants.PERIMETER_ELLIPSE;
	    style[mxConstants.STYLE_FILLCOLOR] = '#FFFFFF';
	    style[mxConstants.STYLE_GRADIENTCOLOR] = '#808080';
		break;
	case 'nodeDone':
	    style[mxConstants.STYLE_FILLCOLOR] = '#D3D3D3';
	    style[mxConstants.STYLE_GRADIENTCOLOR] = '#D3D3D3';
		break;
	case 'nodeUndo':
	    style[mxConstants.STYLE_FILLCOLOR] = '#FFFFFF';
	    style[mxConstants.STYLE_GRADIENTCOLOR] = '#FFFFFF';
		break;
	case 'nodeDoing':
	    style[mxConstants.STYLE_FILLCOLOR] = '#90EE90';
	    style[mxConstants.STYLE_GRADIENTCOLOR] = '#90EE90';
		break;
	}
	return style;
}

Mixky.lib.getRouteStyle = function(key){
	var style = new Object();
	style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_CONNECTOR;
	style[mxConstants.STYLE_LABEL_BACKGROUNDCOLOR] = '#FFFFFF';
	style[mxConstants.STYLE_ENDARROW] = mxConstants.ARROW_CLASSIC;
    style[mxConstants.STYLE_FONTSIZE] = '11';
    style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_CENTER;
    style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_MIDDLE;
    style[mxConstants.STYLE_STROKECOLOR] = '#000000';
    style[mxConstants.STYLE_EDGE] = mxConstants.EDGESTYLE_ELBOW;
    style[mxConstants.STYLE_ROUNDED] = '1';
	switch(key){
	case 'route':
		break;
	case 'routeUp':
		break;
	case 'routeDown':
		style[mxConstants.STYLE_ELBOW] = mxConstants.ELBOW_VERTICAL;
		break;
	}
	return style;
}