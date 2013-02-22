<%@ page contentType="text/html; charset=utf-8"%>
<%@ page import="com.mixky.engine.store.TableForm"%>
<%
	String id = "form-pos-editor";
	String key = request.getParameter("key");
	String bgFilePath = (String)request.getAttribute("bgFilePath");
	TableForm tableform = (TableForm)request.getAttribute("tableform");
	int width = 794;
	int height = 1123;
	if(tableform.getF_width()>0){
		width = tableform.getF_width();
	}
	if(tableform.getF_height()>0){
		height = tableform.getF_height();
	}
%>
<script language='javascript'>
Ext.onReady(function(){
	var id = '<%=id%>';
	var panel = Ext.getCmp(id);

	var resizemap = {};

	var editorEl = Ext.get('form-bg-editor-panel');
	var mainpanel = Ext.getCmp('form-bg-editor');

	panel.setFieldSize = function(key, w, h){
		var record = mainpanel.getEditorRecord(key);
		record.set("f_width", w);
		record.set("f_height", h);
	}

	panel.setFieldPosition = function(key, l, t){
		var record = mainpanel.getEditorRecord(key);
		record.set("f_top", t);
		record.set("f_left", l);
	}

	
	panel.clearFieldDisplay = function(){
		for(item in resizemap){
			resizemap[item].destroy(true);
		}
		resizemap = {};
	}
	panel.selectFieldDisplay = function(key){
		return;
	}
	panel.addFieldDisplay = function(record){
		var fieldResizer = panel.getFieldDisplay(record.get('key'));
		if(!Ext.isDefined(fieldResizer)){
			var top = record.get("f_top");
			var left = record.get("f_left");
			var width = record.get("f_width");
			var height = record.get("f_height");
			if(width == 0){
				width = 80;
				record.set('f_width', 80);
			}
			if(height == 0){
				height = 50;
				record.set('f_height', 50);
			}
			var resizerEl = editorEl.createChild({
				id: 'resize-' + record.get('key'), 
				tag : 'div', 
				style:'color:blue;font-size:12px;border:1px solid blue;;background-color:lightyellow;position:absolute;',
				html : record.get('f_caption')
			});
			resizerEl.setSize(width, height);
			resizerEl.setLeftTop(left, top);
			fieldResizer = new Ext.Resizable('resize-' + record.get('key'),{
			    minWidth: 30,
			    minHeight: 20,
			    maxWidth: editorEl.getWidth() - 20,
			    maxHeight: editorEl.getHeight() - 20,
				draggable: true,
				dynamic : true,
				pinned : false,
				resizeRegion : editorEl.getRegion(),
				listeners:{
					'resize' : function(s, w, h){
						panel.setFieldSize(s.key, w, h);
					}
				}
			});
			fieldResizer.key = record.get('key');
			fieldResizer.dd.endDrag=function(ev) {
				var l = resizerEl.getLeft(true);
				var t = resizerEl.getTop(true);
				var w = resizerEl.getWidth();
				var h = resizerEl.getHeight();
				if(l + w > editorEl.getWidth()){
					l = editorEl.getWidth() - w;
					resizerEl.setLeft(l);
				}
				if(l < 0){
					l = 0;
					resizerEl.setLeft(0);
				}
				if(t + h > editorEl.getHeight()){
					t = editorEl.getHeight() - h;
					resizerEl.setTop(t);
				}
				if(t < 0){
					t = 0;
					resizerEl.setTop(0);
				}
				panel.setFieldPosition(fieldResizer.key, l, t);
			}
			resizemap[record.get('key')] = fieldResizer;
		}
	}
	panel.removeFieldDisplay = function(key){
		var fieldResizer = panel.getFieldDisplay(key);
		if(Ext.isDefined(fieldResizer)){
			fieldResizer.destroy(true);
			delete resizemap[key];
		}
	}
	panel.updateFieldDisplay = function(record){
		var fieldResizer = panel.getFieldDisplay(record.get('key'));
		if(Ext.isDefined(fieldResizer)){
			fieldResizer.getEl().setLeftTop(record.get('f_left'), record.get('f_top'));
			fieldResizer.resizeTo(record.get('f_width'), record.get('f_height'));
		}
	}
	panel.getFieldDisplay = function(key){
		return resizemap[key];
	}
	mainpanel.refresh();
});
</script>
<DIV id='form-pos-editor-table' style="padding:15px;background-color:darkgray;">
<TABLE cellSpacing=0 cellPadding=0 align=center bgColor=white>
	<TR style="HEIGHT: 2px">
		<TD vAlign=top background='../resources/images/report/t_l.gif'></TD>
		<TD vAlign=top background='../resources/images/report/t_z.gif'></TD>
		<TD vAlign=top background='../resources/images/report/t_y.gif'></TD>
	<TR>
		<TD vAlign=top style='width:2px' background='../resources/images/report/b_l.gif'></TD>
		<TD>
			<div id='form-bg-editor-panel' style='position:relative;width:<%=width%>px;height:<%=height%>px;background-repeat:no-repeat;background-image:url("<%=bgFilePath%>");'></div>
		</TD>
		<TD vAlign=top style='width:3px' background='../resources/images/report/b_y.gif'></TD>
	</TR>
	<TR style="HEIGHT: 7px">
		<TD vAlign=top background='../resources/images/report/d_l.gif'></TD>
		<TD vAlign=top background='../resources/images/report/d_z.gif'></TD>
		<TD vAlign=top background='../resources/images/report/d_y.gif'></TD>
	</TR>
</TABLE>
</DIV>