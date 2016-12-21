<?php
/* Smarty version 3.1.30-dev/18, created on 2016-07-14 10:43:57
  from "/home/istwt/domains/istanbulwebtasarim.com/public_html/demo/yenipanel/theme/default/pages/sirketseviyor.tpl" */

if ($_smarty_tpl->_decodeProperties($_smarty_tpl, array (
  'has_nocache_code' => false,
  'version' => '3.1.30-dev/18',
  'unifunc' => 'content_578742bd687c33_56530385',
  'file_dependency' => 
  array (
    '0bc2dc116955e4ee0d7c64b513929214818fe2c4' => 
    array (
      0 => '/home/istwt/domains/istanbulwebtasarim.com/public_html/demo/yenipanel/theme/default/pages/sirketseviyor.tpl',
      1 => 1468482221,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
    'file:header.tpl' => 1,
    'file:footer.tpl' => 1,
  ),
),false)) {
function content_578742bd687c33_56530385 ($_smarty_tpl) {
$_smarty_tpl->_subTemplateRender("file:header.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array('title'=>$_smarty_tpl->tpl_vars['about']->value['seo_title'],'desc'=>$_smarty_tpl->tpl_vars['about']->value['seo_description'],'keyw'=>$_smarty_tpl->tpl_vars['about']->value['seo_keyword']), 0, false);
?>


<div class="container mt140">
	<div class="row">  
		<?php if (!empty($_smarty_tpl->tpl_vars['about']->value['photo'])) {?>			
		<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12"> 
			<img class="img-responsive" src="<?php echo $_smarty_tpl->tpl_vars['settings']->value['site_url'];?>
/upload/photo/<?php echo $_smarty_tpl->tpl_vars['about']->value['photo'];?>
" alt=""> 
		</div> 
		<?php }?> 
		
		<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12"> 
			<ol class="breadcrumb">
			<li><a href="<?php echo $_smarty_tpl->tpl_vars['settings']->value['site_url'];?>
">Anasayfa</a></li> 
			<li class="active"><?php echo $_smarty_tpl->tpl_vars['about']->value['seo_title'];?>
</li>
			</ol> 
		</div>  
		
		<div class="col-lg-12">
		
		<div class="page_title"> <?php echo $_smarty_tpl->tpl_vars['about']->value['seo_title'];?>
</div>
		<div class="page_desc">
			<?php echo $_smarty_tpl->tpl_vars['about']->value['content'];?>

		</div>
		</div>
		
	</div>
</div>





<?php $_smarty_tpl->_subTemplateRender("file:footer.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array(), 0, false);
}
}
