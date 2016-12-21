<?php
/* Smarty version 3.1.30-dev/18, created on 2016-07-01 17:16:41
  from "/home/istwt/domains/istanbulwebtasarim.com/public_html/demo/yenipanel/theme/default/header.tpl" */

if ($_smarty_tpl->_decodeProperties($_smarty_tpl, array (
  'has_nocache_code' => false,
  'version' => '3.1.30-dev/18',
  'unifunc' => 'content_57767b49c9e6a6_90652207',
  'file_dependency' => 
  array (
    '8856c995e74dd833a34130830b1dd09a70b2cd25' => 
    array (
      0 => '/home/istwt/domains/istanbulwebtasarim.com/public_html/demo/yenipanel/theme/default/header.tpl',
      1 => 1467382600,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
  ),
),false)) {
function content_57767b49c9e6a6_90652207 ($_smarty_tpl) {
?>
<html lang="tr">
<head>
    <meta charset="utf-8">
    <meta content="IE=edge" http-equiv="X-UA-Compatible">
    <meta content="width=device-width, initial-scale=1, user-scalable=no" name="viewport">
    <title><?php echo $_smarty_tpl->tpl_vars['settings']->value['seo_title'];?>
</title>
	<link href='https://fonts.googleapis.com/css?family=Ubuntu:400,300,300italic,400italic,500,500italic,700,700italic&subset=latin,latin-ext' rel='stylesheet' type='text/css'>
	<link href="<?php echo $_smarty_tpl->tpl_vars['themelink']->value;?>
/css/bootstrap.css" rel="stylesheet"> 
	<link href="<?php echo $_smarty_tpl->tpl_vars['themelink']->value;?>
/css/extended.css" rel="stylesheet"> 
	<link href="<?php echo $_smarty_tpl->tpl_vars['themelink']->value;?>
/css/style.css" rel="stylesheet"> 
		
    <!--[if lt IE 9]>
      <?php echo '<script'; ?>
 src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"><?php echo '</script'; ?>
>
      <?php echo '<script'; ?>
 src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"><?php echo '</script'; ?>
>
    <![endif]-->
	
	<link rel="shortcut icon" href="upload/favicon/<?php echo $_smarty_tpl->tpl_vars['settings']->value['favicon'];?>
">
	
	<meta name="description" content="<?php echo $_smarty_tpl->tpl_vars['settings']->value['seo_description'];?>
">
	<meta name="keywords" content="<?php echo $_smarty_tpl->tpl_vars['settings']->value['seo_keyword'];?>
">
	<meta name="author" content="<?php echo $_smarty_tpl->tpl_vars['settings']->value['sirket'];?>
">
	
	
	<?php echo $_smarty_tpl->tpl_vars['settings']->value['google_analytics'];?>

	
</head>
<body>
	<header class="header"> 
	  <div class="container">
	  <div class="top_right hidden-xs">
	  <div class="row pull-right">
	  <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
	  
	  <div class="phone_div">
	  <img src="<?php echo $_smarty_tpl->tpl_vars['themelink']->value;?>
/img/tel_icon.png" alt=""><span class="p_d_text"> <?php echo $_smarty_tpl->tpl_vars['settings']->value['sirkettelefon'];?>
 </span>
	  </div>
	  
	  <div class="phone_div">
	  <img src="<?php echo $_smarty_tpl->tpl_vars['themelink']->value;?>
/img/ctel_icon.png" alt=""><span class="p_d_text"> <?php echo $_smarty_tpl->tpl_vars['settings']->value['sirketgsm'];?>
</span>
	  </div>
	  
	  </div>
	  </div>
	  </div>
	  <div class="row"> 
	  <div class="col-lg-2 col-md-2 col-sm-2 col-xs-6">
		  <a href="<?php echo $_smarty_tpl->tpl_vars['settings']->value['site_url'];?>
"><img class="img-responsive logo_img" alt="" src="<?php echo $_smarty_tpl->tpl_vars['settings']->value['site_url'];?>
/upload/logo/<?php echo $_smarty_tpl->tpl_vars['settings']->value['logo'];?>
"></a>
	  </div>
	  <div class="col-lg-10 col-md-10 col-sm-12 col-xs-6 pl0 pr0">
		 <nav role="navigation" class="navbar navbar-transparent cl-effect-5">
			  <div class="container-fluid pl0 pr0">
				<div class="navbar-header">
				  <button data-target="#transparent-example1" data-toggle="collapse" class="navbar-toggle" type="button"> 
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
				  </button>
				</div>
				<div id="transparent-example1" class="collapse navbar-collapse">
				  <ul class="nav navbar-nav">
					<li <?php if (!isset($_GET['do'])) {?> class="active" <?php }?>><a href="<?php echo $_smarty_tpl->tpl_vars['settings']->value['site_url'];?>
"><span data-hover="ANASAYFA">ANASAYFA</span></a></li>
					<li <?php if (isset($_GET['do'])) {
if ($_GET['do'] == "hakkimizda") {?>class="active"<?php }
}?>><a href="<?php echo $_smarty_tpl->tpl_vars['settings']->value['site_url'];?>
/hakkimizda"><span data-hover="HAKKIMIZDA">HAKKIMIZDA</span></a></li>
					<li <?php if (isset($_GET['do'])) {
if ($_GET['do'] == "hizmetlerimiz") {?>class="active"<?php }
}?>><a href="<?php echo $_smarty_tpl->tpl_vars['settings']->value['site_url'];?>
/hizmetlerimiz"><span data-hover="HİZMETLERİMİZ">HİZMETLERİMİZ</span></a></li>
					<li <?php if (isset($_GET['do'])) {
if ($_GET['do'] == "referanslar") {?>class="active"<?php }
}?>><a href="<?php echo $_smarty_tpl->tpl_vars['settings']->value['site_url'];?>
/referanslar"><span data-hover="REFERANSLAR">REFERANSLAR</span></a></li>
					<li <?php if (isset($_GET['do'])) {
if ($_GET['do'] == "galeri") {?>class="active"<?php }
}?>><a href="<?php echo $_smarty_tpl->tpl_vars['settings']->value['site_url'];?>
/galeri"><span data-hover="GALERİ">GALERİ</span></a></li>
					<li <?php if (isset($_GET['do'])) {
if ($_GET['do'] == "sosyalprojeler") {?>class="active"<?php }
}?>><a href="<?php echo $_smarty_tpl->tpl_vars['settings']->value['site_url'];?>
/sosyalprojeler"><span data-hover="SOSYAL PROJELER">SOSYAL PROJELER</span></a></li>
					<li <?php if (isset($_GET['do'])) {
if ($_GET['do'] == "ik") {?>class="active"<?php }
}?>><a href="<?php echo $_smarty_tpl->tpl_vars['settings']->value['site_url'];?>
/ik"><span data-hover="İNSAN KAYNAKLARI">İNSAN KAYNAKLARI</span></a></li>
					<li <?php if (isset($_GET['do'])) {
if ($_GET['do'] == "iletisim") {?>class="active"<?php }
}?>><a href="<?php echo $_smarty_tpl->tpl_vars['settings']->value['site_url'];?>
/iletisim"><span data-hover="İLETİŞİM">İLETİŞİM</span></a></li>
				  </ul> 
				</div>
			  </div>
			</nav>
	  </div> 
	  </div>
	  </div>
	</header><?php }
}
