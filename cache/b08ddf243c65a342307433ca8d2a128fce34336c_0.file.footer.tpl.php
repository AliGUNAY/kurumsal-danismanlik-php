<?php
/* Smarty version 3.1.30-dev/18, created on 2016-07-01 14:33:16
  from "/home/istwt/domains/istanbulwebtasarim.com/public_html/demo/yenipanel/theme/default/footer.tpl" */

if ($_smarty_tpl->_decodeProperties($_smarty_tpl, array (
  'has_nocache_code' => false,
  'version' => '3.1.30-dev/18',
  'unifunc' => 'content_577654fccfcef6_48648748',
  'file_dependency' => 
  array (
    'b08ddf243c65a342307433ca8d2a128fce34336c' => 
    array (
      0 => '/home/istwt/domains/istanbulwebtasarim.com/public_html/demo/yenipanel/theme/default/footer.tpl',
      1 => 1467372791,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
  ),
),false)) {
function content_577654fccfcef6_48648748 ($_smarty_tpl) {
?>
  <footer class="footer"> 
	<div class="container">
		<div class="row">
			<div class="col-lg-5 col-md-5 col-sm-5 col-xs-12">
			<div class="footer_title"><strong>S KONSEPT</strong> DANIŞMANLIK</div>
			
			<ul class="footer_menu">
			
			<li><a href="hakkimizda.php">Hakkımızda</a></li>
			<li><a href="galeri.php">Galeri</a></li>
			<li><a href="ik.php">İnsan Kaynakları</a></li>
			<li><a href="referanslar.php">Referanslar</a></li>
			<li><a href="sosyal-projeler.php">Sosyal Projeler</a></li>
			<li><a href="iletisim.php">İletişim</a></li>
			
			</ul>

			
			</div>
			<div class="col-lg-4 col-md-4 col-sm-4 col-xs-12"> 
			<address>
			<p>Adres: <?php echo $_smarty_tpl->tpl_vars['settings']->value['sirketadres'];?>
</p>
			<br/>
			<p>Tel: <?php echo $_smarty_tpl->tpl_vars['settings']->value['sirkettelefon'];?>
</p>
			<p>Gsm:	<?php echo $_smarty_tpl->tpl_vars['settings']->value['sirketgsm'];?>
</p>
			<p>E-posta:	<?php echo $_smarty_tpl->tpl_vars['settings']->value['sirketmail'];?>
</p> 
			</address>
 

			</div>
			<div class="col-lg-3 col-md-3 col-sm-3 col-xs-12">
			
			<div class="social">
			<a href="#"><img src="<?php echo $_smarty_tpl->tpl_vars['themelink']->value;?>
/img/social/fb.png" alt=""/></a>
			<a href="#"><img src="<?php echo $_smarty_tpl->tpl_vars['themelink']->value;?>
/img/social/tw.png" alt=""/></a>
			<a href="#"><img src="<?php echo $_smarty_tpl->tpl_vars['themelink']->value;?>
/img/social/in.png" alt=""/></a> 
			</div>


			</div>
		</div>
	</div>
</footer> 
 
	<?php echo '<script'; ?>
 src="https://code.jquery.com/jquery-1.12.4.min.js"><?php echo '</script'; ?>
> 
	<?php echo '<script'; ?>
 src="<?php echo $_smarty_tpl->tpl_vars['themelink']->value;?>
/js/bootstrap.min.js"><?php echo '</script'; ?>
> 
	<?php echo '<script'; ?>
 src="<?php echo $_smarty_tpl->tpl_vars['themelink']->value;?>
/js/extended.js"><?php echo '</script'; ?>
> 
	<?php echo '<script'; ?>
 src="<?php echo $_smarty_tpl->tpl_vars['themelink']->value;?>
/js/jquery.bootstrap.newsbox.min.js"><?php echo '</script'; ?>
> 
	<?php echo '<script'; ?>
> 
		 // testimonial
		$('#testimonial').owlCarousel({
		autoPlay: 5000,
		items : 1, 
		itemsDesktop      : [1199,1],
		itemsDesktopSmall     : [979,1],
		itemsTablet       : [768,1],
		itemsMobile       : [479,1],
		});   
		//vertical-text-slider
		$(function () { 
			$("#v_t_slider").bootstrapNews({
				newsPerPage: 7,
				autoplay: true,
				direction: 'up',
				navigation: false,
				newsTickerInterval: 5000,
				onToDo: function () {
					//console.log(this);
				}
			});
		});
		//Popup
		$('.img-lightbox').magnificPopup({
			type:'image',
			titleSrc: 'title'
		});
	<?php echo '</script'; ?>
>
</body>
</html><?php }
}
