<?php
/* Smarty version 3.1.30-dev/18, created on 2016-07-15 16:42:46
  from "/home/istwt/domains/istanbulwebtasarim.com/public_html/demo/yenipanel/theme/default/pages/newsDetay.tpl" */

if ($_smarty_tpl->_decodeProperties($_smarty_tpl, array (
  'has_nocache_code' => false,
  'version' => '3.1.30-dev/18',
  'unifunc' => 'content_5788e8566bf265_06750336',
  'file_dependency' => 
  array (
    '6618cb3837f7722ee10307bb60007eccbded9f23' => 
    array (
      0 => '/home/istwt/domains/istanbulwebtasarim.com/public_html/demo/yenipanel/theme/default/pages/newsDetay.tpl',
      1 => 1468590151,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
    'file:header.tpl' => 1,
    'file:footer.tpl' => 1,
  ),
),false)) {
function content_5788e8566bf265_06750336 ($_smarty_tpl) {
$_smarty_tpl->_subTemplateRender("file:header.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array('title'=>$_smarty_tpl->tpl_vars['ik']->value['seo_title'],'desc'=>$_smarty_tpl->tpl_vars['ik']->value['seo_description'],'keyw'=>$_smarty_tpl->tpl_vars['ik']->value['seo_keyword']), 0, false);
?>



		
		<div class="container mt140">
			<div class="row">  

				<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12"> 
					<ol class="breadcrumb">
					<li><a href="<?php echo $_smarty_tpl->tpl_vars['settings']->value['site_url'];?>
">Anasayfa</a></li>
					<li><a href="<?php echo $_smarty_tpl->tpl_vars['settings']->value['site_url'];?>
/makaleler">Makaleler</a></li>
					<li class="active"><?php echo $_smarty_tpl->tpl_vars['ik']->value['seo_title'];?>
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
$_from = $_smarty_tpl->smarty->ext->_foreach->init($_smarty_tpl, $_smarty_tpl->tpl_vars['ikler']->value, 'ik');
foreach ($_from as $_smarty_tpl->tpl_vars['ik']->value) {
$_smarty_tpl->tpl_vars['ik']->_loop = true;
$__foreach_ik_0_saved = $_smarty_tpl->tpl_vars['ik'];
?>
				<div class="col-lg-3 col-md-3 col-sm-3 col-xs-6"><a href="<?php echo $_smarty_tpl->tpl_vars['ik']->value['sef'];?>
"> <?php echo $_smarty_tpl->tpl_vars['ik']->value['title'];?>
</a> </div>  
			<?php
$_smarty_tpl->tpl_vars['ik'] = $__foreach_ik_0_saved;
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
				
				<div class="page_title"><?php echo $_smarty_tpl->tpl_vars['ik']->value['seo_title'];?>
</div>
				<div class="page_desc"> 
				
					<?php echo $_smarty_tpl->tpl_vars['ik']->value['content'];?>

				
				</div>
				</div>
				
			</div>
			<br /><br />
			
			<?php echo '<script'; ?>
 id="dsq-count-scr" src="//yenipanel.disqus.com/count.js" async><?php echo '</script'; ?>
>
			<?php echo '<script'; ?>
 type="text/javascript">var switchTo5x=true;<?php echo '</script'; ?>
>
			<?php echo '<script'; ?>
 type="text/javascript" src="http://w.sharethis.com/button/buttons.js"><?php echo '</script'; ?>
>
			<?php echo '<script'; ?>
 type="text/javascript">stLight.options({publisher: "37b39a19-2d52-426a-ace3-6a2456529cd5", doNotHash: false, doNotCopy: false, hashAddressBar: false});<?php echo '</script'; ?>
>

			
			Sosyal Medya: 
			<span class='st_fblike' displayText='Facebook Like'></span>
			<span class='st_fbsend' displayText='Facebook Send'></span>
			<span class='st_twitterfollow' displayText='Twitter Follow'></span>
			<span class='st_plusone' displayText='Google +1'></span>
			<span class='st_facebook' displayText='Facebook'></span>
			<span class='st_twitter' displayText='Tweet'></span>
			<span class='st_linkedin' displayText='LinkedIn'></span>
			<span class='st_pinterest' displayText='Pinterest'></span>
			<span class='st_email' displayText='Email'></span>
			
			<br /><br />
			<div id="disqus_thread"></div>
			<?php echo '<script'; ?>
>
			/*
				var disqus_config = function () {
					this.page.url = "//<?php echo $_SERVER['HTTP_HOST'];
echo $_SERVER['REQUEST_URI'];?>
";  // Replace PAGE_URL with your page's canonical URL variable
					this.page.identifier = ""; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
				};
			*/	
				(function() {  // DON'T EDIT BELOW THIS LINE
					var d = document, s = d.createElement('script');
					
					s.src = '//yenipanel.disqus.com/embed.js';
					
					s.setAttribute('data-timestamp', +new Date());
					(d.head || d.body).appendChild(s);
				})();
			<?php echo '</script'; ?>
>
			<noscript>Please enable JavaScript to view the <a href="https://disqus.com/?ref_noscript" rel="nofollow">comments powered by Disqus.</a></noscript>
			
			
			
		</div>

<?php $_smarty_tpl->_subTemplateRender("file:footer.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array(), 0, false);
}
}
