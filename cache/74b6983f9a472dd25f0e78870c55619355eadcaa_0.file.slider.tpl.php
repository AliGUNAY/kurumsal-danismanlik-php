<?php
/* Smarty version 3.1.30-dev/18, created on 2016-07-01 14:34:27
  from "/home/istwt/domains/istanbulwebtasarim.com/public_html/demo/yenipanel/theme/default/slider.tpl" */

if ($_smarty_tpl->_decodeProperties($_smarty_tpl, array (
  'has_nocache_code' => false,
  'version' => '3.1.30-dev/18',
  'unifunc' => 'content_57765543d6f629_81650209',
  'file_dependency' => 
  array (
    '74b6983f9a472dd25f0e78870c55619355eadcaa' => 
    array (
      0 => '/home/istwt/domains/istanbulwebtasarim.com/public_html/demo/yenipanel/theme/default/slider.tpl',
      1 => 1467372866,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
  ),
),false)) {
function content_57765543d6f629_81650209 ($_smarty_tpl) {
?>
<section class="slider home_top">
	<div class="container-fluid pl0 pr0">
		<div class="row">
			<div class="col-lg-12">
				<div data-ride="carousel" class="carousel slide" id="carousel-example-captions">
					<ol class="carousel-indicators">
						<li class="" data-slide-to="0" data-target="#carousel-example-captions"></li>
						<li class="active" data-slide-to="1" data-target="#carousel-example-captions"></li>
						<li class="" data-slide-to="2" data-target="#carousel-example-captions"></li>
					</ol>
	 
				<div class="carousel-inner"> 
					<div class="item active left">
					<img src="<?php echo $_smarty_tpl->tpl_vars['themelink']->value;?>
/img/slider/slider1.jpg">
						<div class="carousel-caption">
							<h3>Uzman Kadromuzla</h3>
							<p>Aile Danışmanlığı</p>
						</div>
					</div>

					<div class="item next left">
					<img src="<?php echo $_smarty_tpl->tpl_vars['themelink']->value;?>
/img/slider/slider1.jpg">
						<div class="carousel-caption">
							<h3>Uzman Kadromuzla</h3>
							<p>Aile Danışmanlığı</p>
						</div>
					</div>

					<div class="item">
					<img src="<?php echo $_smarty_tpl->tpl_vars['themelink']->value;?>
/img/slider/slider1.jpg">
						<div class="carousel-caption">
							<h3>Uzman Kadromuzla</h3>
							<p>Aile Danışmanlığı</p>
						</div>
					</div>
					
					<img class="img-responsive s_b_stick" alt="" src="<?php echo $_smarty_tpl->tpl_vars['themelink']->value;?>
/img/slider-stick.png">
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
