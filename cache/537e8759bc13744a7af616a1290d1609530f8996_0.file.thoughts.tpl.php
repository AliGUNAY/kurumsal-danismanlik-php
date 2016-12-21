<?php
/* Smarty version 3.1.30-dev/18, created on 2016-07-17 23:30:31
  from "/home/istwt/domains/istanbulwebtasarim.com/public_html/demo/yenipanel/theme/default/pages/thoughts.tpl" */

if ($_smarty_tpl->_decodeProperties($_smarty_tpl, array (
  'has_nocache_code' => false,
  'version' => '3.1.30-dev/18',
  'unifunc' => 'content_578beae7bd5867_69539943',
  'file_dependency' => 
  array (
    '537e8759bc13744a7af616a1290d1609530f8996' => 
    array (
      0 => '/home/istwt/domains/istanbulwebtasarim.com/public_html/demo/yenipanel/theme/default/pages/thoughts.tpl',
      1 => 1468787430,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
    'file:header.tpl' => 1,
    'file:footer.tpl' => 1,
  ),
),false)) {
function content_578beae7bd5867_69539943 ($_smarty_tpl) {
$_smarty_tpl->_subTemplateRender("file:header.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array('title'=>$_smarty_tpl->tpl_vars['ik']->value['seo_title'],'desc'=>$_smarty_tpl->tpl_vars['ik']->value['seo_description'],'keyw'=>$_smarty_tpl->tpl_vars['ik']->value['seo_keyword']), 0, false);
?>


<div class="container mt140">
	<div class="row">  
		<?php if (!empty($_smarty_tpl->tpl_vars['ik']->value['photo'])) {?>			
		<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12"> 
			<img style="height: 215px; object-fit: cover; width: 100%;" class="img-responsive" src="<?php echo $_smarty_tpl->tpl_vars['settings']->value['site_url'];?>
/upload/photo/<?php echo $_smarty_tpl->tpl_vars['scope']->value['photo'];?>
" alt=""> 
		</div> 
		<?php }?>
		
		<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12"> 
			<ol class="breadcrumb">
			<li><a href="<?php echo $_smarty_tpl->tpl_vars['settings']->value['site_url'];?>
">Anasayfa</a></li> 
			<li class="active"><?php echo $_smarty_tpl->tpl_vars['ik']->value['seo_title'];?>
</li>
			</ol> 
		</div>  
		
		<div class="col-lg-12">
		
		<div class="page_title"> <?php echo $_smarty_tpl->tpl_vars['ik']->value['seo_title'];?>
</div>
		
		<ul id="myTab" class="nav nav-tabs nav-justified dusunce_tabs">
		  <li class="active"><a href="#bireysel" data-toggle="tab" aria-expanded="true">Bireysel</a></li>
		  <li class=""><a href="#kurumsal" data-toggle="tab" aria-expanded="false">Kurumsal</a></li> 
		</ul>
		
		
		<div id="myTabContent" class="tab-content">
			<div class="tab-pane fade active in" id="bireysel">
				<div class="page_desc">
	
					<?php
$_from = $_smarty_tpl->smarty->ext->_foreach->init($_smarty_tpl, $_smarty_tpl->tpl_vars['thoughts']->value, 'news');
foreach ($_from as $_smarty_tpl->tpl_vars['news']->value) {
$_smarty_tpl->tpl_vars['news']->_loop = true;
$__foreach_news_0_saved = $_smarty_tpl->tpl_vars['news'];
?>	
						<?php if ($_smarty_tpl->tpl_vars['news']->value['tip'] == 1) {?>
						<blockquote class="blockquote-icon">
								  <p><?php echo $_smarty_tpl->tpl_vars['news']->value['title'];?>
</p>
								  <p class="text-right m15"><strong><?php echo $_smarty_tpl->tpl_vars['news']->value['name'];?>
</strong>  - <?php echo $_smarty_tpl->tpl_vars['news']->value['date'];?>
</p>
						</blockquote>
						<?php }?>
					<?php
$_smarty_tpl->tpl_vars['news'] = $__foreach_news_0_saved;
}
$_smarty_tpl->smarty->ext->_foreach->restore($_smarty_tpl);
?>


				</div>  
			</div>
			
			
			<div class="tab-pane fade" id="kurumsal">
				<div class="page_desc">
			
				<?php
$_from = $_smarty_tpl->smarty->ext->_foreach->init($_smarty_tpl, $_smarty_tpl->tpl_vars['thoughts']->value, 'news');
foreach ($_from as $_smarty_tpl->tpl_vars['news']->value) {
$_smarty_tpl->tpl_vars['news']->_loop = true;
$__foreach_news_1_saved = $_smarty_tpl->tpl_vars['news'];
?>
					<?php if ($_smarty_tpl->tpl_vars['news']->value['tip'] == 2) {?>
					<blockquote class="blockquote-icon">
							  <p><?php echo $_smarty_tpl->tpl_vars['news']->value['title'];?>
</p>
							  <p class="text-right m15"><strong><?php echo $_smarty_tpl->tpl_vars['news']->value['name'];?>
</strong>  - <?php echo $_smarty_tpl->tpl_vars['news']->value['date'];?>
</p>
					</blockquote>
					<?php }?>
				<?php
$_smarty_tpl->tpl_vars['news'] = $__foreach_news_1_saved;
}
$_smarty_tpl->smarty->ext->_foreach->restore($_smarty_tpl);
?>
				</div>  
			</div>
		</div>
		
		
		</div>
		
	</div>
</div>





<?php $_smarty_tpl->_subTemplateRender("file:footer.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array(), 0, false);
}
}
