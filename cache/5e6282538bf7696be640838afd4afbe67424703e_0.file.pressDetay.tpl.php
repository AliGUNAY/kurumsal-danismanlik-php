<?php
/* Smarty version 3.1.30-dev/18, created on 2016-07-18 16:07:49
  from "/home/goxskons/public_html/theme/default/pages/pressDetay.tpl" */

if ($_smarty_tpl->_decodeProperties($_smarty_tpl, array (
  'has_nocache_code' => false,
  'version' => '3.1.30-dev/18',
  'unifunc' => 'content_578cd4a5267327_37752120',
  'file_dependency' => 
  array (
    '5e6282538bf7696be640838afd4afbe67424703e' => 
    array (
      0 => '/home/goxskons/public_html/theme/default/pages/pressDetay.tpl',
      1 => 1468844077,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
    'file:header.tpl' => 1,
    'file:footer.tpl' => 1,
  ),
),false)) {
function content_578cd4a5267327_37752120 ($_smarty_tpl) {
$_smarty_tpl->_subTemplateRender("file:header.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array('title'=>$_smarty_tpl->tpl_vars['kategori']->value['seo_title'],'desc'=>$_smarty_tpl->tpl_vars['kategori']->value['seo_description'],'keyw'=>$_smarty_tpl->tpl_vars['kategori']->value['seo_keyword']), 0, false);
?>



		
		<div class="container top_space">
			<div class="row">  

				<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12"> 
					<ol class="breadcrumb">
					<li><a href="<?php echo $_smarty_tpl->tpl_vars['settings']->value['site_url'];?>
">Anasayfa</a></li>
					<li><a href="<?php echo $_smarty_tpl->tpl_vars['settings']->value['site_url'];?>
/basindabiz">Basında Biz</a></li>
					<li class="active"><?php echo $_smarty_tpl->tpl_vars['kategori']->value['seo_title'];?>
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
				
				
				
				<div class="page_title"><?php echo $_smarty_tpl->tpl_vars['kategori']->value['seo_title'];?>
</div>
				<div class="page_desc">

						<?php if ($_smarty_tpl->tpl_vars['categorys']->value[0] == "21") {?>
							<?php if (!empty($_smarty_tpl->tpl_vars['galeri']->value)) {?>
								<?php
$_from = $_smarty_tpl->smarty->ext->_foreach->init($_smarty_tpl, $_smarty_tpl->tpl_vars['galeri']->value, 'resimler', false, 'k');
foreach ($_from as $_smarty_tpl->tpl_vars['k']->value => $_smarty_tpl->tpl_vars['resimler']->value) {
$_smarty_tpl->tpl_vars['resimler']->_loop = true;
$__foreach_resimler_1_saved = $_smarty_tpl->tpl_vars['resimler'];
?> 
									
									<div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">  
									  <a href="../<?php echo $_smarty_tpl->tpl_vars['resimler']->value['url'];?>
" class="img-lightbox">
										  <img src="../<?php echo $_smarty_tpl->tpl_vars['resimler']->value['url'];?>
" style="width: 100%;object-fit: cover;" class="img-responsive">
									  </a> 
									</div>
									<?php if ($_smarty_tpl->tpl_vars['k']->value % 3 == 2) {?>
									<div class="space"></div> 
									<?php }?>
								<?php
$_smarty_tpl->tpl_vars['resimler'] = $__foreach_resimler_1_saved;
}
$_smarty_tpl->smarty->ext->_foreach->restore($_smarty_tpl);
?>
							<?php } elseif (!empty($_smarty_tpl->tpl_vars['videogaleri']->value)) {?>
								<?php
$_from = $_smarty_tpl->smarty->ext->_foreach->init($_smarty_tpl, $_smarty_tpl->tpl_vars['videogaleri']->value, 'videolar', false, 'k');
foreach ($_from as $_smarty_tpl->tpl_vars['k']->value => $_smarty_tpl->tpl_vars['videolar']->value) {
$_smarty_tpl->tpl_vars['videolar']->_loop = true;
$__foreach_videolar_2_saved = $_smarty_tpl->tpl_vars['videolar'];
?> 
									<div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">  
									  <a class="popup-iframe" href="http://www.youtube.com/watch?v=<?php echo $_smarty_tpl->tpl_vars['videolar']->value['url'];?>
" class="img-lightbox">
										  <img src="http://i1.ytimg.com/vi/<?php echo $_smarty_tpl->tpl_vars['videolar']->value['url'];?>
/sddefault.jpg" style="width: 100%;object-fit: cover;" class="img-responsive">
									  </a> 
									</div>
									
									<?php if ($_smarty_tpl->tpl_vars['k']->value % 3 == 2) {?>
									<div class="space"></div> 
									<?php }?>
								<?php
$_smarty_tpl->tpl_vars['videolar'] = $__foreach_videolar_2_saved;
}
$_smarty_tpl->smarty->ext->_foreach->restore($_smarty_tpl);
?>
							<?php } else { ?><br /><br /><br /><br />
							<center>Hiç Resim Eklenmemiş</center><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
							<?php }?>
							
						<?php } elseif ($_smarty_tpl->tpl_vars['categorys']->value[0] == "20") {?>
							
							<?php echo $_smarty_tpl->tpl_vars['kategori']->value['content'];?>

							
						<?php } else { ?>	
								
							<?php echo $_smarty_tpl->tpl_vars['kategori']->value['content'];?>

							
						<?php }?>
				</div>
				</div>
				
			</div>
		</div>

<?php $_smarty_tpl->_subTemplateRender("file:footer.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array(), 0, false);
}
}
