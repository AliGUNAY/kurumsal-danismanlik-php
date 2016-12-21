<?php
/* Smarty version 3.1.30-dev/18, created on 2016-07-18 10:05:38
  from "/home/istwt/domains/istanbulwebtasarim.com/public_html/demo/yenipanel/theme/default/footer.tpl" */

if ($_smarty_tpl->_decodeProperties($_smarty_tpl, array (
  'has_nocache_code' => false,
  'version' => '3.1.30-dev/18',
  'unifunc' => 'content_578c7fc2b0b818_09624027',
  'file_dependency' => 
  array (
    '042c7af437db54304178d5be68e98b4eee491db1' => 
    array (
      0 => '/home/istwt/domains/istanbulwebtasarim.com/public_html/demo/yenipanel/theme/default/footer.tpl',
      1 => 1468825489,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
  ),
),false)) {
function content_578c7fc2b0b818_09624027 ($_smarty_tpl) {
?>
  <footer class="footer"> 
	<div class="container">
		<div class="row">
			<div class="col-lg-5 col-md-5 col-sm-5 col-xs-12">
			<div class="footer_title"><strong>S KONSEPT</strong> DANIŞMANLIK</div>
			
			<ul class="footer_menu">
			
			<li><a href="hakkimizda">Hakkımızda</a></li>
			<li><a href="galeri">Galeri</a></li>
			<li><a href="ik">İnsan Kaynakları</a></li>
			<li><a href="referanslar">Referanslar</a></li>
			<li><a href="sosyalprojeler">Sosyal Projeler</a></li>
			<li><a href="iletisim">İletişim</a></li>
			
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
			<?php ob_start();
echo $_smarty_tpl->tpl_vars['settings']->value['facebook'];
$_tmp1=ob_get_clean();
if (!empty($_tmp1)) {?><a target="_blank" href="<?php echo $_smarty_tpl->tpl_vars['settings']->value['facebook'];?>
"><img src="<?php echo $_smarty_tpl->tpl_vars['themelink']->value;?>
/img/social/fb.png" alt=""/></a><?php }?>
			<?php ob_start();
echo $_smarty_tpl->tpl_vars['settings']->value['twitter'];
$_tmp2=ob_get_clean();
if (!empty($_tmp2)) {?><a target="_blank" href="<?php echo $_smarty_tpl->tpl_vars['settings']->value['twitter'];?>
"><img src="<?php echo $_smarty_tpl->tpl_vars['themelink']->value;?>
/img/social/tw.png" alt=""/></a><?php }?>
			<?php ob_start();
echo $_smarty_tpl->tpl_vars['settings']->value['instagram'];
$_tmp3=ob_get_clean();
if (!empty($_tmp3)) {?><a target="_blank" href="<?php echo $_smarty_tpl->tpl_vars['settings']->value['instagram'];?>
"><img src="<?php echo $_smarty_tpl->tpl_vars['themelink']->value;?>
/img/social/in.png" alt=""/></a> <?php }?>
			</div>


			</div>
		</div>
	</div>
</footer> 
 
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
				newsPerPage: 10,
				autoplay: true,
				direction: 'up',
				navigation: false,
				newsTickerInterval: 2500,
				onToDo: function () {
					//console.log(this);
				}
			});
		});
		//Popup
		$('.img-lightbox').magnificPopup({
			type:'image',
			titleSrc: 'title',
			tLoading: 'Loading image #%curr%...',
			gallery: {
				enabled: true,
				navigateByImgClick: true,
				preload: [0,1] // Will preload 0 - before current, and 1 after the current image
			}
		});
		$('.popup-iframe').magnificPopup({
			disableOn: 700,
			type: 'iframe',
			mainClass: 'mfp-fade',
			removalDelay: 160,
			preloader: false
        });
		
		$('.popup-modal').magnificPopup({
			disableOn: 700,
			type: 'inline',
			mainClass: 'mfp-fade',
			removalDelay: 160,
			preloader: false
        });
		
	<?php echo '</script'; ?>
>
</body>
</html><?php }
}
