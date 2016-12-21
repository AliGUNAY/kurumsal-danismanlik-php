<?php
/* Smarty version 3.1.30-dev/18, created on 2016-07-20 13:19:00
  from "/home/goxskons/public_html/theme/default/pages/404.tpl" */

if ($_smarty_tpl->_decodeProperties($_smarty_tpl, array (
  'has_nocache_code' => false,
  'version' => '3.1.30-dev/18',
  'unifunc' => 'content_578f5014aa3a50_20931563',
  'file_dependency' => 
  array (
    'd16264ef261df9480f04bd00ccde8293e132ee39' => 
    array (
      0 => '/home/goxskons/public_html/theme/default/pages/404.tpl',
      1 => 1469009935,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
  ),
),false)) {
function content_578f5014aa3a50_20931563 ($_smarty_tpl) {
?>
<html lang="tr">
<head>
    <meta charset="utf-8">
    <meta content="IE=edge" http-equiv="X-UA-Compatible">
    <meta content="width=device-width, initial-scale=1, user-scalable=no" name="viewport">
    <title>404 - Sayfa Bulunamadı</title>
		
    <!--[if lt IE 9]>
      <?php echo '<script'; ?>
 src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"><?php echo '</script'; ?>
>
      <?php echo '<script'; ?>
 src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"><?php echo '</script'; ?>
>
    <![endif]-->
	<link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css" rel="stylesheet"> 
	<?php echo '<script'; ?>
 src="https://code.jquery.com/jquery-1.12.4.min.js"><?php echo '</script'; ?>
> 
</head>
<body>


			<a href="/" class="fa fa-arrow-left" title="Anasayfaya Dön"></a>
			<div class="error">
			  <h1>404</h1>
			  <p>Maalesef Aradığınız Sayfa Veritabanında Bulunamadı.</p> 
			</div>
			
			<!--404-->
			<style type="text/css">
			body,
			html {
			  padding: 0;
			  margin: 0;
			  width: 100%;
			  height: 100%;
			  overflow: hidden;
			  background-color: rgba(240, 105, 5, 0.85);
			  font-family: 'Montserrat', sans-serif;
			  color: #fff
			}

			html {
			  background: url('<?php echo $_smarty_tpl->tpl_vars['themelink']->value;?>
/img/test-slider.jpg');
			  background-size: cover;
			  background-position: center
			}

			.error {
			  text-align: center;
			  padding: 16px;
			  position: relative;
			  top: 50%;
			  transform: translateY(-50%);
			  -webkit-transform: translateY(-50%)
			}

			.error h1 {
			  margin: -10px 0 -30px;
			  font-size: calc(17vw + 40px);
			  opacity: .8;
			  letter-spacing: -17px;
			}

			.error p {
			  opacity: .8;
			  font-size: 20px;
			  margin: 8px 0 38px 0;
			  font-weight: bold
			}
			 

			.fa-arrow-left {
			  position: fixed;
			  top: 30px;
			  left: 30px;
			  font-size: 2em;
			  color:white;
			  text-decoration:none
			}
			</style><?php }
}
