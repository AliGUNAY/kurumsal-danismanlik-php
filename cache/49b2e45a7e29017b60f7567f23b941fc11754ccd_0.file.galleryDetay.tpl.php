<?php
/* Smarty version 3.1.30-dev/18, created on 2016-07-14 10:38:21
  from "/home/istwt/domains/istanbulwebtasarim.com/public_html/demo/yenipanel/theme/default/pages/galleryDetay.tpl" */

if ($_smarty_tpl->_decodeProperties($_smarty_tpl, array (
  'has_nocache_code' => false,
  'version' => '3.1.30-dev/18',
  'unifunc' => 'content_5787416d39cca3_44772513',
  'file_dependency' => 
  array (
    '49b2e45a7e29017b60f7567f23b941fc11754ccd' => 
    array (
      0 => '/home/istwt/domains/istanbulwebtasarim.com/public_html/demo/yenipanel/theme/default/pages/galleryDetay.tpl',
      1 => 1468481900,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
    'file:header.tpl' => 1,
    'file:footer.tpl' => 1,
  ),
),false)) {
function content_5787416d39cca3_44772513 ($_smarty_tpl) {
$_smarty_tpl->_subTemplateRender("file:header.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array('title'=>$_smarty_tpl->tpl_vars['ik']->value['seo_title'],'desc'=>$_smarty_tpl->tpl_vars['ik']->value['seo_description'],'keyw'=>$_smarty_tpl->tpl_vars['ik']->value['seo_keyword']), 0, false);
?>


<div class="container mt140">
	<div class="row">  
		<?php if (!empty($_smarty_tpl->tpl_vars['ik']->value['photo'])) {?>			
		<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="display:none"> 
			<img class="img-responsive" src="<?php echo $_smarty_tpl->tpl_vars['settings']->value['site_url'];?>
/upload/photo/<?php echo $_smarty_tpl->tpl_vars['ik']->value['photo'];?>
" alt=""> 
		</div> 
		<?php }?>
		
		<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12"> 
			<ol class="breadcrumb">
			<li><a href="<?php echo $_smarty_tpl->tpl_vars['settings']->value['site_url'];?>
">Anasayfa</a></li> 
			<li><a href="<?php echo $_smarty_tpl->tpl_vars['settings']->value['site_url'];?>
/galeri">Galeri</a></li> 
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
			<?php if (!empty($_smarty_tpl->tpl_vars['galeri']->value)) {?>
				<?php
$_from = $_smarty_tpl->smarty->ext->_foreach->init($_smarty_tpl, $_smarty_tpl->tpl_vars['galeri']->value, 'resimler');
foreach ($_from as $_smarty_tpl->tpl_vars['resimler']->value) {
$_smarty_tpl->tpl_vars['resimler']->_loop = true;
$__foreach_resimler_0_saved = $_smarty_tpl->tpl_vars['resimler'];
?> 
				
				<div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">  
				  <a href="../<?php echo $_smarty_tpl->tpl_vars['resimler']->value['url'];?>
" class="img-lightbox">
                      <img src="../<?php echo $_smarty_tpl->tpl_vars['resimler']->value['url'];?>
" style="    width: 100%;object-fit: cover;" class="img-responsive">
                  </a> 
				</div>
				
				<?php
$_smarty_tpl->tpl_vars['resimler'] = $__foreach_resimler_0_saved;
}
$_smarty_tpl->smarty->ext->_foreach->restore($_smarty_tpl);
?>
			<?php } else { ?><br /><br /><br /><br />
			<center>Hiç Resim Eklenmemiş</center><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
			<?php }?>
	</div>  
			</div>  
		</div>
		
		
		
		</div>
		
	</div>
</div>





<?php $_smarty_tpl->_subTemplateRender("file:footer.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array(), 0, false);
}
}
