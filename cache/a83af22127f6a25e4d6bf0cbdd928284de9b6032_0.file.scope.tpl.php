<?php
/* Smarty version 3.1.30-dev/18, created on 2016-07-14 10:39:41
  from "/home/istwt/domains/istanbulwebtasarim.com/public_html/demo/yenipanel/theme/default/pages/scope.tpl" */

if ($_smarty_tpl->_decodeProperties($_smarty_tpl, array (
  'has_nocache_code' => false,
  'version' => '3.1.30-dev/18',
  'unifunc' => 'content_578741bd48da76_88064957',
  'file_dependency' => 
  array (
    'a83af22127f6a25e4d6bf0cbdd928284de9b6032' => 
    array (
      0 => '/home/istwt/domains/istanbulwebtasarim.com/public_html/demo/yenipanel/theme/default/pages/scope.tpl',
      1 => 1468481976,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
    'file:header.tpl' => 1,
    'file:footer.tpl' => 1,
  ),
),false)) {
function content_578741bd48da76_88064957 ($_smarty_tpl) {
$_smarty_tpl->_subTemplateRender("file:header.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array('title'=>$_smarty_tpl->tpl_vars['scope']->value['seo_title'],'desc'=>$_smarty_tpl->tpl_vars['scope']->value['seo_description'],'keyw'=>$_smarty_tpl->tpl_vars['scope']->value['seo_keyword']), 0, false);
?>


<div class="container mt140">
	<div class="row">  
		
		<?php if (!empty($_smarty_tpl->tpl_vars['scope']->value['photo'])) {?>			
		<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12"> 
			<img class="img-responsive" src="<?php echo $_smarty_tpl->tpl_vars['settings']->value['site_url'];?>
/upload/photo/<?php echo $_smarty_tpl->tpl_vars['scope']->value['photo'];?>
" alt=""> 
		</div> 
		<?php }?>
		
		<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12"> 
			<ol class="breadcrumb">
			<li><a href="<?php echo $_smarty_tpl->tpl_vars['settings']->value['site_url'];?>
">Anasayfa</a></li> 
			<li class="active"><?php echo $_smarty_tpl->tpl_vars['scope']->value['seo_title'];?>
</li>
			</ol> 
		</div>  
		
		<div class="col-lg-12">
		
		<div class="page_title"> <?php echo $_smarty_tpl->tpl_vars['scope']->value['seo_title'];?>
</div>
		<div class="page_desc">
			<?php echo $_smarty_tpl->tpl_vars['scope']->value['content'];?>

		</div>
		
		
		<?php
$_from = $_smarty_tpl->smarty->ext->_foreach->init($_smarty_tpl, $_smarty_tpl->tpl_vars['scopeList']->value, 'scopeler', false, 'k');
foreach ($_from as $_smarty_tpl->tpl_vars['k']->value => $_smarty_tpl->tpl_vars['scopeler']->value) {
$_smarty_tpl->tpl_vars['scopeler']->_loop = true;
$__foreach_scopeler_0_saved = $_smarty_tpl->tpl_vars['scopeler'];
?>
			<div class="row social_row">
				<?php if ($_smarty_tpl->tpl_vars['k']->value % 2 == 0) {?>
					<div class="col-lg-3 col-md-3 col-sm-3 col-xs-12"> 
						<img style="width: 100%; object-fit: cover; height: 150px;" class="img-responsive" src="<?php if (empty($_smarty_tpl->tpl_vars['scopeler']->value['photo'])) {?>https://placeholdit.imgix.net/~text?txtsize=28&bg=f06905&txtclr=ffffff&txt=300%C3%97250&w=300&h=250<?php } else { ?>upload/photo/<?php echo $_smarty_tpl->tpl_vars['scopeler']->value['photo'];
}?>" alt="" />
					</div>
					
					<div class="col-lg-9 col-md-9 col-sm-9 col-xs-12">
						<div class="social_p_title"> <?php echo $_smarty_tpl->tpl_vars['scopeler']->value['seo_title'];?>
</div>
						<div class="social_p_desc"> <?php echo $_smarty_tpl->tpl_vars['scopeler']->value['content'];?>
</div>
					</div> 
				<?php }?>
				
				<?php if ($_smarty_tpl->tpl_vars['k']->value % 2 == 1) {?>
					
					<div class="col-lg-9 col-md-9 col-sm-9 col-xs-12">
						<div class="social_p_title"> <?php echo $_smarty_tpl->tpl_vars['scopeler']->value['seo_title'];?>
</div>
						<div class="social_p_desc"> <?php echo $_smarty_tpl->tpl_vars['scopeler']->value['content'];?>
</div>
					</div> 
					
					<div class="col-lg-3 col-md-3 col-sm-3 col-xs-12"> 
						<img style="width: 100%; object-fit: cover; height: 150px;" class="img-responsive" src="<?php if (empty($_smarty_tpl->tpl_vars['scopeler']->value['photo'])) {?>https://placeholdit.imgix.net/~text?txtsize=28&bg=f06905&txtclr=ffffff&txt=300%C3%97250&w=300&h=250<?php } else { ?>upload/photo/<?php echo $_smarty_tpl->tpl_vars['scopeler']->value['photo'];
}?>" alt="" />  
					</div>
				<?php }?>
			</div>
		<?php
$_smarty_tpl->tpl_vars['scopeler'] = $__foreach_scopeler_0_saved;
}
$_smarty_tpl->smarty->ext->_foreach->restore($_smarty_tpl);
?>
		
		
		
		</div>
		
	</div>
</div>





<?php $_smarty_tpl->_subTemplateRender("file:footer.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array(), 0, false);
}
}
