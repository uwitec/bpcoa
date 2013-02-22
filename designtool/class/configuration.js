// 模块数据表容器配置项定义
Mixky.designtool.Class.registeModule({
	isSingle : true,
	name : 'configuration',
	text : '运行参数设置',
	note : '设置系统运行参数',
	iconCls : 'icon-designtool-configuration',
    properties : [{
    	name:'webRootPath', 
    	text:'应用目录', 
    	xeditor:'none', 
    	note:'服务器端应用程序发布目录。'
    },{
    	name:'applicationName', 
    	text:'应用名称', 
    	xeditor:'string', 
    	note:'设置应用程序名，例如：[ 创想天空应用平台 ]。'
    },{
    	name:'fileUploadPath',
        text:'文件上传路径', 
    	xeditor:'string', 
    	note:'设置文件上传服务器端临时目录，填写相对路径 例：[/upload]'
    },{
    	name:'resourcePath',
        text:'资源路径', 
        xeditor:'string', 
        note:'设置存储应用程序资源目录，填写相对路径 例：[/resources]'
    },{
    	name:'useIdentifyCode',
    	text:'启用验证码', 
        xeditor:'boolean', 
        note:'设置登录时是否启用验证码。'
    }],
	editors : [
	           'ui/configuration.do'
	]
});
