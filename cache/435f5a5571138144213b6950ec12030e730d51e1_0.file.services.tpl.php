<?php
/* Smarty version 3.1.30-dev/18, created on 2016-07-01 16:15:09
  from "/home/istwt/domains/istanbulwebtasarim.com/public_html/demo/yenipanel/theme/default/pages/services.tpl" */

if ($_smarty_tpl->_decodeProperties($_smarty_tpl, array (
  'has_nocache_code' => false,
  'version' => '3.1.30-dev/18',
  'unifunc' => 'content_57766cdd8d9061_84080963',
  'file_dependency' => 
  array (
    '435f5a5571138144213b6950ec12030e730d51e1' => 
    array (
      0 => '/home/istwt/domains/istanbulwebtasarim.com/public_html/demo/yenipanel/theme/default/pages/services.tpl',
      1 => 1467378907,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
    'file:header.tpl' => 1,
    'file:footer.tpl' => 1,
  ),
),false)) {
function content_57766cdd8d9061_84080963 ($_smarty_tpl) {
$_smarty_tpl->_subTemplateRender("file:header.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array(), 0, false);
?>


<div class="container mt140">
	<div class="row">  
		<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12"> 
			<img class="img-responsive" src="upload/photo/<?php echo $_smarty_tpl->tpl_vars['services']->value['photo'];?>
" alt="" /> 
		</div>  
		
		<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12"> 
			<ol class="breadcrumb">
			<li><a href="<?php echo $_smarty_tpl->tpl_vars['settings']->value['site_url'];?>
">Anasayfa</a></li> 
			<li class="active"><?php echo $_smarty_tpl->tpl_vars['services']->value['seo_title'];?>
</li>
			</ol> 
		</div>  
		
		<div class="col-lg-12">
			<div class="page_title"> <?php echo $_smarty_tpl->tpl_vars['services']->value['seo_title'];?>
</div>		
		</div>
		
	</div>
</div>

<div class="container">
	<div class="row">  
		<div class="text-center col-lg-12 col-md-12 col-sm-12 col-xs-12"> 
			<div class="row"> 
				<?php
$_from = $_smarty_tpl->smarty->ext->_foreach->init($_smarty_tpl, $_smarty_tpl->tpl_vars['kategoriler']->value, 'kategori');
foreach ($_from as $_smarty_tpl->tpl_vars['kategori']->value) {
$_smarty_tpl->tpl_vars['kategori']->_loop = true;
$__foreach_kategori_0_saved = $_smarty_tpl->tpl_vars['kategori'];
?>
					<div class="col-lg-6 col-md-6 col-sm-6 col-xs-12"> 
						<a href="<?php echo $_smarty_tpl->tpl_vars['kategori']->value['sef'];?>
"><img class="img-responsive" src="<?php if (empty($_smarty_tpl->tpl_vars['kategori']->value['photo'])) {?>http://www.placehold.it/800x550/f06905/ffffff&amp;text=+<?php } else { ?>upload/photo/<?php echo $_smarty_tpl->tpl_vars['kategori']->value['photo'];
}?>" alt=""></a>
						<div class="page_sub_title"><a href="<?php echo $_smarty_tpl->tpl_vars['kategori']->value['sef'];?>
"><?php echo $_smarty_tpl->tpl_vars['kategori']->value['title'];?>
</a></div>
						<div class="page_sub_desc"><?php echo substr($_smarty_tpl->tpl_vars['kategori']->value['content'],0,250);?>
</div> 
					</div>
				<?php
$_smarty_tpl->tpl_vars['kategori'] = $__foreach_kategori_0_saved;
}
$_smarty_tpl->smarty->ext->_foreach->restore($_smarty_tpl);
?>
			</div>
			
		</div>  
	</div>
</div>





<?php $_smarty_tpl->_subTemplateRender("file:footer.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array(), 0, false);
}
}
