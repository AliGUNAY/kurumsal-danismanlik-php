<?php
/* Smarty version 3.1.30-dev/18, created on 2016-07-18 14:35:37
  from "/home/goxskons/public_html/theme/default/slider.tpl" */

if ($_smarty_tpl->_decodeProperties($_smarty_tpl, array (
  'has_nocache_code' => false,
  'version' => '3.1.30-dev/18',
  'unifunc' => 'content_578cbf098e4e61_20606474',
  'file_dependency' => 
  array (
    'e5b39396490fd0b0212fc1522c46f2279fc0cc15' => 
    array (
      0 => '/home/goxskons/public_html/theme/default/slider.tpl',
      1 => 1468841735,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
  ),
),false)) {
function content_578cbf098e4e61_20606474 ($_smarty_tpl) {
?>
<section class="slider home_top">
	<div class="container-fluid pl0 pr0">
		<div class="row">
			<div class="col-lg-12">
				<div data-ride="carousel" class="carousel slide" id="carousel-example-captions">
					<ol class="carousel-indicators">
						<li class="active" data-slide-to="0" data-target="#carousel-example-captions"></li>
						<li class="" data-slide-to="1" data-target="#carousel-example-captions"></li>
						<li class="" data-slide-to="2" data-target="#carousel-example-captions"></li>
						<li class="" data-slide-to="3" data-target="#carousel-example-captions"></li>
						<li class="" data-slide-to="4" data-target="#carousel-example-captions"></li>
						<li class="" data-slide-to="5" data-target="#carousel-example-captions"></li>
						<li class="" data-slide-to="6" data-target="#carousel-example-captions"></li>
					</ol>
		
					<div class="carousel-inner"> 
						<div class="item active">
							<img src="<?php echo $_smarty_tpl->tpl_vars['themelink']->value;?>
/img/slider/slider1.jpg" style="width: 100%;">
							<div class="carousel-caption" style="display:none">
								<h3>Uzman Kadromuzla</h3>
								<p>Aile Danışmanlığı</p>
							</div>
						</div>

						<div class="item">
							<img src="<?php echo $_smarty_tpl->tpl_vars['themelink']->value;?>
/img/slider/slider2.jpg" style="width: 100%;">
							<div class="carousel-caption" style="display:none">
								<h3>Uzman Kadromuzla</h3>
								<p>Aile Danışmanlığı</p>
							</div>
						</div>

						<div class="item">
							<img src="<?php echo $_smarty_tpl->tpl_vars['themelink']->value;?>
/img/slider/slider3.jpg" style="width: 100%;">
							<div class="carousel-caption" style="display:none">
								<h3>Uzman Kadromuzla</h3>
								<p>Aile Danışmanlığı</p>
							</div>
						</div>
						
						<div class="item">
								<img src="<?php echo $_smarty_tpl->tpl_vars['themelink']->value;?>
/img/slider/slider4.jpg" style="width: 100%;">
							<div class="carousel-caption" style="display:none">
								<h3>Uzman Kadromuzla</h3>
								<p>Aile Danışmanlığı</p>
							</div>
						</div>
		
						<div class="item">
							<img src="<?php echo $_smarty_tpl->tpl_vars['themelink']->value;?>
/img/slider/slider5.jpg" style="width: 100%;">
							<div class="carousel-caption" style="display:none">
								<h3>Uzman Kadromuzla</h3>
								<p>Aile Danışmanlığı</p>
							</div>
						</div>

					<div class="item">
							<img src="<?php echo $_smarty_tpl->tpl_vars['themelink']->value;?>
/img/slider/slider6.jpg" style="width: 100%;">
							<div class="carousel-caption" style="display:none">
								<h3>Uzman Kadromuzla</h3>
								<p>Aile Danışmanlığı</p>
							</div>
						</div>

						<div class="s_b_stick">
							<a data-toggle="modal" data-target=".flip-effect"><img class="img-responsive" alt="" src="<?php echo $_smarty_tpl->tpl_vars['themelink']->value;?>
/img/slider-stick1.png"></a>
							
							<a class="popup-modal" href="#test-modal"><img class="img-responsive" alt="" src="<?php echo $_smarty_tpl->tpl_vars['themelink']->value;?>
/img/slider-stick2.png"></a>
							
							<style>
							.white-popup-block {
								background: #FFF;
								padding: 20px 30px;
								text-align: left;
									max-width:60%;
								margin: 40px auto;
								position: relative;
							}
							</style>
							<div id="test-modal" class="mfp-hide white-popup-block">
								
								<?php echo $_smarty_tpl->tpl_vars['anasayfa']->value['content'];?>

								
							</div>
							
							
						</div>
						
						
						
					</div>
					<!-- / inner -->
					<a data-slide="prev" href="#carousel-example-captions" class="left carousel-control"> 
						<img alt="" src="<?php echo $_smarty_tpl->tpl_vars['themelink']->value;?>
/img/s_left.png"> 
					</a>
					<a data-slide="next" href="#carousel-example-captions" class="right carousel-control"> 
						<img alt="" src="<?php echo $_smarty_tpl->tpl_vars['themelink']->value;?>
/img/s_right.png"> 
					</a>
				</div>
			</div>
		</div>
	</div>
</section><?php }
}
