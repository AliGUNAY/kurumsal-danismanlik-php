<?php
/* Smarty version 3.1.30-dev/18, created on 2016-07-18 15:36:23
  from "/home/goxskons/public_html/theme/default/pages/news.tpl" */

if ($_smarty_tpl->_decodeProperties($_smarty_tpl, array (
  'has_nocache_code' => false,
  'version' => '3.1.30-dev/18',
  'unifunc' => 'content_578ccd47630b50_69662123',
  'file_dependency' => 
  array (
    '9165fa841596ce7487ed56248e54ed2ab7415888' => 
    array (
      0 => '/home/goxskons/public_html/theme/default/pages/news.tpl',
      1 => 1468844074,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
    'file:header.tpl' => 1,
    'file:footer.tpl' => 1,
  ),
),false)) {
function content_578ccd47630b50_69662123 ($_smarty_tpl) {
$_smarty_tpl->_subTemplateRender("file:header.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array('title'=>$_smarty_tpl->tpl_vars['ik']->value['seo_title'],'desc'=>$_smarty_tpl->tpl_vars['ik']->value['seo_description'],'keyw'=>$_smarty_tpl->tpl_vars['ik']->value['seo_keyword']), 0, false);
?>


<div class="container top_space">
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
		
		<div class="container">
			<div class="row"> 
				<?php
$_from = $_smarty_tpl->smarty->ext->_foreach->init($_smarty_tpl, $_smarty_tpl->tpl_vars['newsList']->value, 'news');
foreach ($_from as $_smarty_tpl->tpl_vars['news']->value) {
$_smarty_tpl->tpl_vars['news']->_loop = true;
$__foreach_news_0_saved = $_smarty_tpl->tpl_vars['news'];
?>
				<div class="row social_row">
					<div class="col-lg-3 col-md-3 col-sm-3 col-xs-12"> 
						<a href="makaleler/detay/<?php echo $_smarty_tpl->tpl_vars['news']->value['sef'];?>
-<?php echo $_smarty_tpl->tpl_vars['news']->value['id'];?>
"><img style="height: 170px; object-fit: cover; width: 100%;" alt="<?php echo $_smarty_tpl->tpl_vars['news']->value['title'];?>
" src="<?php if (empty($_smarty_tpl->tpl_vars['news']->value['photo'])) {?>http://www.placehold.it/800x550/f06905/ffffff&amp;text=+<?php } else { ?>upload/photo/<?php echo $_smarty_tpl->tpl_vars['news']->value['photo'];
}?>" class="img-responsive"></a>  
					</div>
					
					<div class="col-lg-9 col-md-9 col-sm-9 col-xs-12">
					<div class="social_p_title"><a href="makaleler/detay/<?php echo $_smarty_tpl->tpl_vars['news']->value['sef'];?>
-<?php echo $_smarty_tpl->tpl_vars['news']->value['id'];?>
"> <?php echo $_smarty_tpl->tpl_vars['news']->value['title'];?>
</a></div>
					<div class="social_p_desc"><?php echo mb_substr(preg_replace('!<[^>]*?>!', ' ', $_smarty_tpl->tpl_vars['news']->value['content']),0,550);?>
... <a href="makaleler/detay/<?php echo $_smarty_tpl->tpl_vars['news']->value['sef'];?>
-<?php echo $_smarty_tpl->tpl_vars['news']->value['id'];?>
">> Devamını oku</a></div>
					</div> 
				</div>
				<?php
$_smarty_tpl->tpl_vars['news'] = $__foreach_news_0_saved;
}
$_smarty_tpl->smarty->ext->_foreach->restore($_smarty_tpl);
?>
	
	
			</div>  
		</div>
		
		
		
		</div>
		
	</div>
</div>





<?php $_smarty_tpl->_subTemplateRender("file:footer.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array(), 0, false);
}
}
