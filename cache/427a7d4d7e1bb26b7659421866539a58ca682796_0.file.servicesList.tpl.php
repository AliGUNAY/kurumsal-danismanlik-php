<?php
/* Smarty version 3.1.30-dev/18, created on 2016-07-18 15:33:38
  from "/home/goxskons/public_html/theme/default/pages/servicesList.tpl" */

if ($_smarty_tpl->_decodeProperties($_smarty_tpl, array (
  'has_nocache_code' => false,
  'version' => '3.1.30-dev/18',
  'unifunc' => 'content_578ccca2a7e3a8_23461103',
  'file_dependency' => 
  array (
    '427a7d4d7e1bb26b7659421866539a58ca682796' => 
    array (
      0 => '/home/goxskons/public_html/theme/default/pages/servicesList.tpl',
      1 => 1468844084,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
    'file:header.tpl' => 1,
    'file:footer.tpl' => 1,
  ),
),false)) {
function content_578ccca2a7e3a8_23461103 ($_smarty_tpl) {
if (!is_callable('smarty_modifier_replace')) require_once '/home/goxskons/public_html/system/smarty/plugins/modifier.replace.php';
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
/hizmetlerimiz">Hizmetlerimiz</a></li>
					<li class="active"><?php echo $_smarty_tpl->tpl_vars['kategori']->value['seo_title'];?>
</li>
					</ol> 
				</div> 
			</div>
		</div>
		<!--
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
				<?php if ($_smarty_tpl->tpl_vars['kategori']->value['ustkategori'] == 0) {?>
				<div class="col-lg-3 col-md-3 col-sm-3 col-xs-6"><a href="<?php echo $_smarty_tpl->tpl_vars['kategori']->value['sef'];?>
-<?php echo $_smarty_tpl->tpl_vars['kategori']->value['id'];?>
"> <?php echo $_smarty_tpl->tpl_vars['kategori']->value['title'];?>
</a> </div>  
				<?php }?>
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
		
		<div class="container ser_st_tab">
			<div class="row">  
			<div class="col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-10 col-sm-offset-1 col-xs-12">  
			<div class="row">  
				<div class="col-lg-3 col-md-3 col-sm-3 col-xs-6"><a href="../hizmetlerimiz/bireysel-danismanlik-11"<?php if ($_GET['id'] == 11) {?> class="ser_tab_active"<?php }?>> BİREYSEL<br>DANIŞMANLIK</a> </div>  
				<div class="col-lg-3 col-md-3 col-sm-3 col-xs-6"><a href="../hizmetlerimiz/kurumsal-danismanlik-12"<?php if ($_GET['id'] == 12) {?> class="ser_tab_active"<?php }?>> KURUMSAL<br>DANIŞMANLIK</a></div>  
				<div class="col-lg-3 col-md-3 col-sm-3 col-xs-6"><a href="../hizmetlerimiz/ogrenci-ogretmen-okul-danismanligi-13" <?php if ($_GET['id'] == 13) {?> class="ser_tab_active"<?php }?>> ÖĞRENCİ-ÖĞRETMEN<br>OKUL DANIŞMANLIĞI</a></div>  
				<div class="col-lg-3 col-md-3 col-sm-3 col-xs-6"><a href="../hizmetlerimiz/kisisel-gelisim-egitimleri-sertifikali-projeler-14" <?php if ($_GET['id'] == 14) {?> class="ser_tab_active"<?php }?>> KİŞİSEL GELİŞİM EĞİTİMLERİ<br>SERTİFİKALI PROJELER</a></div>  
			</div>
			</div>
			</div>
		</div>
		
		<br /><br />
		
		<div class="container">
			<div class="row">   
				<div class="col-lg-12">
				
				<div class="page_title"><?php echo $_smarty_tpl->tpl_vars['kategori']->value['seo_title'];?>
</div>
				<div class="page_desc ser_col_b"> 
				
					<?php echo $_smarty_tpl->tpl_vars['kategori']->value['content'];?>

					
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
"><img class="img-responsive" style="height: 150px; object-fit: cover;" src="<?php if (empty($_smarty_tpl->tpl_vars['service']->value['photo'])) {?>http://www.placehold.it/800x550/f06905/ffffff&amp;text=+<?php } else {
echo $_smarty_tpl->tpl_vars['settings']->value['site_url'];?>
/upload/photo/<?php echo $_smarty_tpl->tpl_vars['service']->value['photo'];
}?>" alt=""></a>
								<div class="page_sub_title"><a href="detay/<?php echo $_smarty_tpl->tpl_vars['service']->value['sef'];?>
-<?php echo $_smarty_tpl->tpl_vars['service']->value['id'];?>
"><?php echo $_smarty_tpl->tpl_vars['service']->value['seo_title'];?>
</a></div>
								<div class="page_sub_desc"><?php if (empty($_smarty_tpl->tpl_vars['service']->value['content'])) {?>  <?php } else { ?> <?php echo smarty_modifier_replace(mb_substr(preg_replace('!<[^>]*?>!', ' ', $_smarty_tpl->tpl_vars['service']->value['content']),0,129),'&nbsp;','');?>
. <?php }?></div> 
								<div style="clearfix"></div>
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
					
				
				</div>
				</div>
				
			</div>
		</div>

<?php $_smarty_tpl->_subTemplateRender("file:footer.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array(), 0, false);
}
}
