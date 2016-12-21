<?php
/* Smarty version 3.1.30-dev/18, created on 2016-07-18 15:17:34
  from "/home/goxskons/public_html/theme/default/pages/referance.tpl" */

if ($_smarty_tpl->_decodeProperties($_smarty_tpl, array (
  'has_nocache_code' => false,
  'version' => '3.1.30-dev/18',
  'unifunc' => 'content_578cc8de278060_30098940',
  'file_dependency' => 
  array (
    'a6a67679fb81f222c873721a509a156ef843be69' => 
    array (
      0 => '/home/goxskons/public_html/theme/default/pages/referance.tpl',
      1 => 1468844079,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
    'file:header.tpl' => 1,
    'file:footer.tpl' => 1,
  ),
),false)) {
function content_578cc8de278060_30098940 ($_smarty_tpl) {
$_smarty_tpl->_subTemplateRender("file:header.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array('title'=>$_smarty_tpl->tpl_vars['referance']->value['seo_title'],'desc'=>$_smarty_tpl->tpl_vars['referance']->value['seo_description'],'keyw'=>$_smarty_tpl->tpl_vars['referance']->value['seo_keyword']), 0, false);
?>


	<div class="container top_space">
		<div class="row">  
			<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12"> 
				<img class="img-responsive" src="upload/photo/<?php echo $_smarty_tpl->tpl_vars['referance']->value['photo'];?>
" alt="" /> 
			</div>  
			
			<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12"> 
				<ol class="breadcrumb">
				<li><a href="<?php echo $_smarty_tpl->tpl_vars['settings']->value['site_url'];?>
">Anasayfa</a></li> 
				<li class="active"><?php echo $_smarty_tpl->tpl_vars['referance']->value['seo_title'];?>
</li>
				</ol> 
			</div>  
			
			<div class="col-lg-12">
				<div class="page_title"> <?php echo $_smarty_tpl->tpl_vars['referance']->value['seo_title'];?>
</div>
			</div>
			
		</div>
	</div>

	<div class="container text-center">

		<?php
$_from = $_smarty_tpl->smarty->ext->_foreach->init($_smarty_tpl, $_smarty_tpl->tpl_vars['kategoriler']->value, 'kategori');
foreach ($_from as $_smarty_tpl->tpl_vars['kategori']->value) {
$_smarty_tpl->tpl_vars['kategori']->_loop = true;
$__foreach_kategori_0_saved = $_smarty_tpl->tpl_vars['kategori'];
?>
		<?php if ($_smarty_tpl->tpl_vars['kategori']->value['status'] == 0) {?>
		<div class="row">  
			<div class="ref_title"><?php echo $_smarty_tpl->tpl_vars['kategori']->value['title'];?>
</div>	
			<?php
$_from = $_smarty_tpl->smarty->ext->_foreach->init($_smarty_tpl, $_smarty_tpl->tpl_vars['referanslar']->value, 'referans');
foreach ($_from as $_smarty_tpl->tpl_vars['referans']->value) {
$_smarty_tpl->tpl_vars['referans']->_loop = true;
$__foreach_referans_1_saved = $_smarty_tpl->tpl_vars['referans'];
?>
				<?php
$_from = $_smarty_tpl->smarty->ext->_foreach->init($_smarty_tpl, json_decode($_smarty_tpl->tpl_vars['referans']->value['categorys']), 'id');
foreach ($_from as $_smarty_tpl->tpl_vars['id']->value) {
$_smarty_tpl->tpl_vars['id']->_loop = true;
$__foreach_id_2_saved = $_smarty_tpl->tpl_vars['id'];
?> 
					<?php if ($_smarty_tpl->tpl_vars['kategori']->value['id'] == $_smarty_tpl->tpl_vars['id']->value) {?>
					<div class="col-lg-3 col-md-3 col-sm-3 col-xs-12">
						<img class="img-responsive ref_img" src="upload/photo/<?php echo $_smarty_tpl->tpl_vars['referans']->value['photo'];?>
" alt=""> 
						<div class="ref_sub_title"><?php echo $_smarty_tpl->tpl_vars['referans']->value['title'];?>
</div> 
					</div> 
					<?php }?>
				<?php
$_smarty_tpl->tpl_vars['id'] = $__foreach_id_2_saved;
}
$_smarty_tpl->smarty->ext->_foreach->restore($_smarty_tpl);
?>
			<?php
$_smarty_tpl->tpl_vars['referans'] = $__foreach_referans_1_saved;
}
$_smarty_tpl->smarty->ext->_foreach->restore($_smarty_tpl);
?>			
		</div>
		<div class="space"></div>
		<?php }?>
		<?php
$_smarty_tpl->tpl_vars['kategori'] = $__foreach_kategori_0_saved;
}
$_smarty_tpl->smarty->ext->_foreach->restore($_smarty_tpl);
?>

		
	</div>





<?php $_smarty_tpl->_subTemplateRender("file:footer.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array(), 0, false);
}
}
