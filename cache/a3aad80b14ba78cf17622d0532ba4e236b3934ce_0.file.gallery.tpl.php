<?php
/* Smarty version 3.1.30-dev/18, created on 2016-07-13 17:04:24
  from "/home/istwt/domains/istanbulwebtasarim.com/public_html/demo/yenipanel/theme/default/pages/gallery.tpl" */

if ($_smarty_tpl->_decodeProperties($_smarty_tpl, array (
  'has_nocache_code' => false,
  'version' => '3.1.30-dev/18',
  'unifunc' => 'content_57864a68783ca7_44704673',
  'file_dependency' => 
  array (
    'a3aad80b14ba78cf17622d0532ba4e236b3934ce' => 
    array (
      0 => '/home/istwt/domains/istanbulwebtasarim.com/public_html/demo/yenipanel/theme/default/pages/gallery.tpl',
      1 => 1468418663,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
    'file:header.tpl' => 1,
    'file:footer.tpl' => 1,
  ),
),false)) {
function content_57864a68783ca7_44704673 ($_smarty_tpl) {
$_smarty_tpl->_subTemplateRender("file:header.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array('title'=>$_smarty_tpl->tpl_vars['ik']->value['seo_title'],'desc'=>$_smarty_tpl->tpl_vars['ik']->value['seo_description'],'keyw'=>$_smarty_tpl->tpl_vars['ik']->value['seo_keyword']), 0, false);
?>


<div class="container mt140">
	<div class="row">  
		<?php if (!empty($_smarty_tpl->tpl_vars['ik']->value['photo'])) {?>			
		<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12"> 
			<img class="img-responsive" src="<?php echo $_smarty_tpl->tpl_vars['settings']->value['site_url'];?>
/upload/photo/<?php echo $_smarty_tpl->tpl_vars['ik']->value['photo'];?>
" alt=""> 
		</div> 
		<?php }?>
		
		<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12"> 
			<ol class="breadcrumb">
			<li><a href="<?php echo $_smarty_tpl->tpl_vars['settings']->value['site_url'];?>
">Anasayfa</a></li> 
			<li class="active"><?php echo $_smarty_tpl->tpl_vars['ik']->value['seo_title'];?>
</li>
			</ol> 
		</div>  
		
		<div class="col-lg-12">
		
		<div class="page_title"> <?php echo $_smarty_tpl->tpl_vars['ik']->value['seo_title'];?>
</div>
		
		<div class="text-center col-lg-12 col-md-12 col-sm-12 col-xs-12"> 
			 
			<div class="row"> 
			<div class="row"> 
				<?php
$_from = $_smarty_tpl->smarty->ext->_foreach->init($_smarty_tpl, $_smarty_tpl->tpl_vars['newsList']->value, 'news');
foreach ($_from as $_smarty_tpl->tpl_vars['news']->value) {
$_smarty_tpl->tpl_vars['news']->_loop = true;
$__foreach_news_0_saved = $_smarty_tpl->tpl_vars['news'];
?>
				<div class="col-lg-4 col-md-4 col-sm-4 col-xs-12"> 
					<a href="galeri/detay/<?php echo $_smarty_tpl->tpl_vars['news']->value['sef'];?>
-<?php echo $_smarty_tpl->tpl_vars['news']->value['id'];?>
"><img style="    width: 100%;object-fit: fill;" class="img-responsive" src="<?php if (empty($_smarty_tpl->tpl_vars['news']->value['photo'])) {?>http://www.placehold.it/800x550/f06905/ffffff&amp;text=+<?php } else { ?>upload/photo/<?php echo $_smarty_tpl->tpl_vars['news']->value['photo'];
}?>" alt=""></a>
					<div class="page_sub_title"><a href="galeri/detay/<?php echo $_smarty_tpl->tpl_vars['news']->value['sef'];?>
-<?php echo $_smarty_tpl->tpl_vars['news']->value['id'];?>
"> <?php echo $_smarty_tpl->tpl_vars['news']->value['seo_title'];?>
</a></div> 
				</div>
				
				<?php
$_smarty_tpl->tpl_vars['news'] = $__foreach_news_0_saved;
}
$_smarty_tpl->smarty->ext->_foreach->restore($_smarty_tpl);
?>
	
	</div>  
			</div>  
		</div>
		
		
		
		</div>
		
	</div>
</div>





<?php $_smarty_tpl->_subTemplateRender("file:footer.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array(), 0, false);
}
}
