<?php
/* Smarty version 3.1.30-dev/18, created on 2016-07-18 16:02:18
  from "/home/goxskons/public_html/theme/default/pages/pressList.tpl" */

if ($_smarty_tpl->_decodeProperties($_smarty_tpl, array (
  'has_nocache_code' => false,
  'version' => '3.1.30-dev/18',
  'unifunc' => 'content_578cd35a49c942_84394647',
  'file_dependency' => 
  array (
    '72e6c896dfee858c04bfe678e1a48e815ab3347b' => 
    array (
      0 => '/home/goxskons/public_html/theme/default/pages/pressList.tpl',
      1 => 1468844078,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
    'file:header.tpl' => 1,
    'file:footer.tpl' => 1,
  ),
),false)) {
function content_578cd35a49c942_84394647 ($_smarty_tpl) {
$_smarty_tpl->_subTemplateRender("file:header.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array('title'=>$_smarty_tpl->tpl_vars['kategori']->value['seo_title'],'desc'=>$_smarty_tpl->tpl_vars['kategori']->value['seo_description'],'keyw'=>$_smarty_tpl->tpl_vars['kategori']->value['seo_keyword']), 0, false);
?>



		
		<div class="container top_space">
			<div class="row">  
				<?php if (!empty($_smarty_tpl->tpl_vars['kategori']->value['photo'])) {?>			
				<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12"> 
					<img class="img-responsive" src="<?php echo $_smarty_tpl->tpl_vars['settings']->value['site_url'];?>
/upload/photo/<?php echo $_smarty_tpl->tpl_vars['kategori']->value['photo'];?>
" alt=""> 
				</div> 
				<?php }?>

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
		
		<div class="container ">
		
		<div class="text-center col-lg-12 col-md-12 col-sm-12 col-xs-12"> 
		
			<div class="row">   
				<div class="col-lg-12">
				
				<div class="page_title"><?php echo $_smarty_tpl->tpl_vars['kategori']->value['seo_title'];?>
</div>
				<div class="page_desc"> 
				
					<?php echo $_smarty_tpl->tpl_vars['kategori']->value['content'];?>

					
					<?php if ($_smarty_tpl->tpl_vars['kategori']->value['id'] == "21") {?>
					
						<?php if ($_smarty_tpl->tpl_vars['services']->value != 0) {?>
						<?php
$_from = $_smarty_tpl->smarty->ext->_foreach->init($_smarty_tpl, $_smarty_tpl->tpl_vars['services']->value, 'service', false, 'k');
foreach ($_from as $_smarty_tpl->tpl_vars['k']->value => $_smarty_tpl->tpl_vars['service']->value) {
$_smarty_tpl->tpl_vars['service']->_loop = true;
$__foreach_service_1_saved = $_smarty_tpl->tpl_vars['service'];
?>
							<div class="col-lg-4 col-md-4 col-sm-4 col-xs-12"> 
								<a href="detay/<?php echo $_smarty_tpl->tpl_vars['service']->value['sef'];?>
-<?php echo $_smarty_tpl->tpl_vars['service']->value['id'];?>
"><img style="object-fit: contain; height: 80px; width: 100%;" class="img-responsive" src="<?php if (empty($_smarty_tpl->tpl_vars['service']->value['photo'])) {?>http://www.placehold.it/800x550/f06905/ffffff&amp;text=+<?php } else {
echo $_smarty_tpl->tpl_vars['settings']->value['site_url'];?>
/upload/photo/<?php echo $_smarty_tpl->tpl_vars['service']->value['photo'];
}?>" alt=""></a>
								<div class="page_sub_title"><a href="detay/<?php echo $_smarty_tpl->tpl_vars['service']->value['sef'];?>
-<?php echo $_smarty_tpl->tpl_vars['service']->value['id'];?>
"><?php echo $_smarty_tpl->tpl_vars['service']->value['seo_title'];?>
</a></div>
							</div>
							
							<?php if ($_smarty_tpl->tpl_vars['k']->value % 3 == 2) {?>
							<div class="space"></div> 
							<?php }?>
						<?php
$_smarty_tpl->tpl_vars['service'] = $__foreach_service_1_saved;
}
$_smarty_tpl->smarty->ext->_foreach->restore($_smarty_tpl);
?>
						<?php } else { ?>	
								<center> İçerik Bulunamadı! </center>
						<?php }?>
						
					<?php } else { ?>	
					
						<?php if ($_smarty_tpl->tpl_vars['services']->value != 0) {?>
							<?php
$_from = $_smarty_tpl->smarty->ext->_foreach->init($_smarty_tpl, $_smarty_tpl->tpl_vars['services']->value, 'service', false, 'k');
foreach ($_from as $_smarty_tpl->tpl_vars['k']->value => $_smarty_tpl->tpl_vars['service']->value) {
$_smarty_tpl->tpl_vars['service']->_loop = true;
$__foreach_service_2_saved = $_smarty_tpl->tpl_vars['service'];
?>
		
								<div class="row social_row text-left">
									<div class="col-lg-3 col-md-3 col-sm-3 col-xs-12"> 
										<a href="detay/<?php echo $_smarty_tpl->tpl_vars['service']->value['sef'];?>
-<?php echo $_smarty_tpl->tpl_vars['service']->value['id'];?>
"><img style="height: 170px; object-fit: cover; width: 100%;" alt="<?php echo $_smarty_tpl->tpl_vars['service']->value['title'];?>
" src="<?php if (empty($_smarty_tpl->tpl_vars['service']->value['photo'])) {?>http://www.placehold.it/800x550/f06905/ffffff&amp;text=+<?php } else {
echo $_smarty_tpl->tpl_vars['settings']->value['site_url'];?>
/upload/photo/<?php echo $_smarty_tpl->tpl_vars['service']->value['photo'];
}?>" class="img-responsive"></a>  
									</div>
									
									<div class="col-lg-9 col-md-9 col-sm-9 col-xs-12">
									<div class="social_p_title"><a href="detay/<?php echo $_smarty_tpl->tpl_vars['service']->value['sef'];?>
-<?php echo $_smarty_tpl->tpl_vars['service']->value['id'];?>
"> <?php echo $_smarty_tpl->tpl_vars['service']->value['title'];?>
</a></div>
									<div class="social_p_desc"><?php echo mb_substr(preg_replace('!<[^>]*?>!', ' ', $_smarty_tpl->tpl_vars['service']->value['content']),0,550);?>
... <a href="makaleler/detay/<?php echo $_smarty_tpl->tpl_vars['service']->value['sef'];?>
-<?php echo $_smarty_tpl->tpl_vars['service']->value['id'];?>
">> Devamını oku</a></div>
									</div> 
								</div>
								
								
							<?php
$_smarty_tpl->tpl_vars['service'] = $__foreach_service_2_saved;
}
$_smarty_tpl->smarty->ext->_foreach->restore($_smarty_tpl);
?>
						<?php } else { ?>	
							<center> İçerik Bulunamadı! </center>
						<?php }?>
						
					<?php }?>
					</div>
				
				</div>
				</div>
				
			</div>
		</div>

<?php $_smarty_tpl->_subTemplateRender("file:footer.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array(), 0, false);
}
}
