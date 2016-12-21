<?php
/* Smarty version 3.1.30-dev/18, created on 2016-07-12 10:39:07
  from "/home/istwt/domains/istanbulwebtasarim.com/public_html/demo/yenipanel/theme/default/pages/servicesAlt.tpl" */

if ($_smarty_tpl->_decodeProperties($_smarty_tpl, array (
  'has_nocache_code' => false,
  'version' => '3.1.30-dev/18',
  'unifunc' => 'content_57849e9b4248d4_15820973',
  'file_dependency' => 
  array (
    '6e0520e1584bd98d05a8de9b86c011c77795aec2' => 
    array (
      0 => '/home/istwt/domains/istanbulwebtasarim.com/public_html/demo/yenipanel/theme/default/pages/servicesAlt.tpl',
      1 => 1468309142,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
    'file:header.tpl' => 1,
    'file:footer.tpl' => 1,
  ),
),false)) {
function content_57849e9b4248d4_15820973 ($_smarty_tpl) {
$_smarty_tpl->_subTemplateRender("file:header.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array('title'=>$_smarty_tpl->tpl_vars['kategori']->value['seo_title'],'desc'=>$_smarty_tpl->tpl_vars['kategori']->value['seo_description'],'keyw'=>$_smarty_tpl->tpl_vars['kategori']->value['seo_keyword']), 0, false);
?>



		
		<div class="container mt140">
			<div class="row">  
				<?php if (!empty($_smarty_tpl->tpl_vars['services']->value['photo'])) {?>			
				<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12"> 
					<img class="img-responsive" src="<?php echo $_smarty_tpl->tpl_vars['settings']->value['site_url'];?>
/upload/photo/<?php echo $_smarty_tpl->tpl_vars['services']->value['photo'];?>
" alt=""> 
				</div> 
				<?php }?>

				<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12"> 
					<ol class="breadcrumb">
					<li><a href="<?php echo $_smarty_tpl->tpl_vars['settings']->value['site_url'];?>
">Anasayfa</a></li>
					<li><a href="<?php echo $_smarty_tpl->tpl_vars['services']->value['seo_title'];?>
/hizmetlerimiz">Hizmetlerimiz</a></li>
					<li><a href="#">Bireysel Danışmanlık</a></li> 
					<li class="active"><?php echo $_smarty_tpl->tpl_vars['services']->value['seo_title'];?>
</li>
					</ol> 
				</div> 
			</div>
		</div>
		<!---
		<div class="container ser_st_tab">
			<div class="row">  
			<div class="col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-10 col-sm-offset-1 col-xs-12">  
			<div class="row"> 
			<?php
$_from = $_smarty_tpl->smarty->ext->_foreach->init($_smarty_tpl, $_smarty_tpl->tpl_vars['kategoriler']->value, 'kategori');
foreach ($_from as $_smarty_tpl->tpl_vars['kategori']->value) {
$_smarty_tpl->tpl_vars['kategori']->_loop = true;
$__foreach_kategori_0_saved = $_smarty_tpl->tpl_vars['kategori'];
?>
				<div class="col-lg-3 col-md-3 col-sm-3 col-xs-6"><a href="<?php echo $_smarty_tpl->tpl_vars['kategori']->value['sef'];?>
"> <?php echo $_smarty_tpl->tpl_vars['kategori']->value['title'];?>
</a> </div>  
			<?php
$_smarty_tpl->tpl_vars['kategori'] = $__foreach_kategori_0_saved;
}
$_smarty_tpl->smarty->ext->_foreach->restore($_smarty_tpl);
?>
			</div>
			</div>
			</div>
		</div>
		--->
		
		<div class="container">
			<div class="row">   
				<div class="col-lg-12">
				
				<div class="page_title"><?php echo $_smarty_tpl->tpl_vars['services']->value['seo_title'];?>
</div>
				<div class="page_desc"> 
				
					<?php echo $_smarty_tpl->tpl_vars['services']->value['content'];?>

				
				</div>
				</div>
				
			</div>
		</div>

<?php $_smarty_tpl->_subTemplateRender("file:footer.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array(), 0, false);
}
}
