// 模块数据表容器配置项定义
Mixky.designtool.Class.registeModule({
	isSingle : true,
	name : 'templatefolder',
	text : '模板容器',
	note : '模板数据管理节点',
	iconCls : 'icon-designtool-templatefolder',
	subModules : ['all'],
	withoutSave : true,
	editors : [
	           'ui/templatefolder.do'
	]
});
