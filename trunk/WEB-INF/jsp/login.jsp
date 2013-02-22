<%@ page contentType="text/html; charset=utf-8"%>
<%
	String applicationName = "";
	String applicationPath = "app/mkoa";
	Object obj = request.getAttribute("applicationName");
	if(obj != null){
		applicationName = String.valueOf(obj);
	}
	// 错误提示
	String errtxt = "";
	if(request.getAttribute("errtxt") != null){
		errtxt = String.valueOf(request.getAttribute("errtxt"));
	}
	// 使用验证码
	obj = request.getAttribute("useICode");
	boolean useICode = true;
	if(obj != null){
		useICode = (Boolean)obj;
	}
	String loginName = "";
	obj = request.getAttribute("loginName");
	if (obj != null) {
		loginName = String.valueOf(obj);
	}
%>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; utf-8">
		<title><%=applicationName%></title>
		<style>
			a.browser-site {
				text-decoration: none;
				font-size: 12px;
				color: #000000;
			}
			a.browser-site:hover {
				text-decoration: none;
				color: #2222ff;
			}
			a.browser-download {
				text-decoration: none;
				font-size: 12px;
				color: #0D9CB9;
			}
			a.browser-download:hover {
				text-decoration: none;
				color: #ff0000;
			}
		</style>
	</head>
	<body onresize="onWindowResize()" onload="onWindowResize();document.loginForm.u.focus();" style="margin:0px;OVERFLOW:hidden;color:#333333;font-size:11px">
		<div id='logindiv' style="width:1024;height:768;position:relative;display:none">
			<div style="left:0;top:0;width:1024;height:171;background-image:url(resources/images/login/top.jpg);position:relative;">
				<!--标题背景图片-->
				<!-- div style="color:darkblue;font-size:24px;font-weight:bold;left:60;top:80;width:500;height:50;background-image:url(<%=applicationPath%>/images/login/title.png);background-repeat:no-repeat;position:absolute;"--><!--/div-->
				<div style="left:60;top:80;width:500;height:50;position:absolute;color:1A6D98;font-size:30px;font-weight:900;"><img src="resources/images/logo/48.gif" align=absmiddle> <%=applicationName%></div>
			</div>
			<div style="left:0;top:172;width:1024;height:303;background-image:url(resources/images/login/middle.jpg);"></div>
			<div style="left:0;top:475;width:1024;height:294;background-image:url(resources/images/login/bottom.jpg);">
				<!--提示和辅助工具-->
				<div style="position:relative;left:60;top:80;height:120;width:1024;">
					<table style="color:#333333;font-size:12px">
						<tr>
							<td nowrap>计算机和处理器&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
							<td>P4 2G处理器或更高配置</td>
						</tr>
						<tr>
							<td>物理内存</td>
							<td>512M以上，推荐1G</td>
						</tr>
						<tr>
							<td valign=top>浏览器</td>
							<td style="line-height:1.5">支持所有主流浏览器<br>
								推荐使用<a href="http://www.google.com/chrome" target=_blank class="browser-site">Google Chrome</a><br>
								本地下载<a href="resources/tools/chrome23.exe" target=_blank class="browser-download">[Chrome 23]</a>
							</td>
						</tr>
						<tr>
							<td>即时通信客户端</td>
							<td>
								本地下载<a href="resources/tools/Mixky-IM2.1.49.1.exe"  target=_blank class="browser-download">Mixky-IM</a>
							</td>
						</tr>
					</table>
				</div>
				<!--底部分隔条文字区-->
				<div style="position:relative;left:0;top:94;width:1024;">
					<hr style="border:1px solid #23648C">
					<center><img src='resources/images/login/logo-blue.gif' border=0 height=20 align="absmiddle">&nbsp;&nbsp;Copyright;2009-2013&nbsp;&nbsp;北京创想天空科技有限公司</center>
				</div>
			</div>
			<div style="left:512;top:155;width:399;height:386;background-image:url(resources/images/login/login-bg.gif);position:absolute;">
				<form name=loginForm method="POST">
					<table width=320 style="margin-top:40;font-size:14px" align=center>
						<tr valign=top height=60>
							<td colspan=3><img src="resources/images/login/login-title.jpg" border=0></td>
						</tr>
						<tr valign=top height=50>
							<td width=58 style="padding-top:3px">用户名：</td>
							<td colspan=2><input name="u" type="text" onKeyPress="return onKeyPress('u', event)" maxlength=20 style="width:240;color:#7F9DB9;font-size:14px;border:1px solid #7F9DB9" value="<%=loginName%>"></td>
						</tr>
						<tr valign=top height=50>
							<td width=58 style="padding-top:3px">密　码：</td>
							<td colspan=2><input name="p" type="password" onKeyPress="return onKeyPress('p', event)" maxlength=15 style="width:240;color:#7F9DB9;font-size:14px;border:1px solid #7F9DB9"></td>
						</tr>
<%
	if(useICode){
%>
						<tr valign=top height=40>
							<td width=58 style="padding-top:3px">验证码：</td>
							<td width=125><input name="i" type="text" onKeyPress="return onKeyPress('i', event)" maxlength=10 style="width:120;color:#7F9DB9;font-size:14px;border:1px solid #7F9DB9"></td>
							<td><img align=middle src="servlet/icode.img"></td>
						</tr>
<%
	}
%>
						<tr valign=top height=50>
							<td></td>
							<td colspan=2 style="font-size:12px">
								<!-- input name="ki" type="checkbox" value=1>在此计算机上保留我的信息<br -->
								<input name="ks" type="checkbox" value=1>下一次自动登录
							</td>
						</tr>
						<tr valign=top>
							<td></td>
							<td colspan=2 style="font-size:12px;color:red;"><%=errtxt%></td>
						</tr>
						<tr valign=top>
							<td></td>
							<td colspan=2>
								<input type="image" name="b" src="resources/images/login/login-button.jpg" value="登录" onClick="return doLogin()">
							</td>
						</tr>
						<tr valign=bottom height=30>
							<td></td>
						</tr>
					</table>
				</form>
			</div>
		</div>
	</BODY>
<SCRIPT LANG="JAVASCRIPT">
	function getWindowSize() {
	  var myWidth = 0, myHeight = 0;
	  if( typeof( window.innerWidth ) == 'number' ) {
		//Non-IE
		myWidth = window.innerWidth;
		myHeight = window.innerHeight;
	  } else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
		//IE 6+ in 'standards compliant mode'
		myWidth = document.documentElement.clientWidth;
		myHeight = document.documentElement.clientHeight;
	  } else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
		//IE 4 compatible
		myWidth = document.body.clientWidth;
		myHeight = document.body.clientHeight;
	  }
	  return {width:myWidth, height:myHeight};
	}

	function onWindowResize(){
		var size = getWindowSize();
		var login = document.getElementById('logindiv');
		login.style.top = (size.height - 768) / 2;
		login.style.left = (size.width - 1024) / 2;
		login.style.display = '';
	}

	function showAlert(msg){
		alert(msg);
	}

	function validate(){
		if(document.loginForm.u.value == ''){
			showAlert("用户名非法：不允许为空")
			document.loginForm.u.focus();
			return false;
		}
		if(document.loginForm.p.value == ''){
			showAlert("密码非法：不允许为空")
			document.loginForm.p.focus();
			return false;
		}
<%
	if(useICode){
%>
		if(document.loginForm.i.value == ''){
			showAlert("验证码非法：不允许为空")
			document.loginForm.i.focus();
			return false;
		}
<%
	}
%>
		return true;
	}

	function doLogin(){
		if(!validate()){
			return false;
		}
		document.loginForm.submit();
	}
	
	function onKeyPress(name, event){
		if(event.keyCode != 13){
			return true;
		}
		if(name == "u"){
			document.loginForm.p.focus();
		}else if(name == "p"){
<%
			if(useICode){
%>
				document.loginForm.i.focus();
<%
			}else{
%>
				return doLogin();
<%
			}
%>
		}else if(name == "i"){
			return doLogin();
		}
		return false;
	}
</SCRIPT>
</HTML>