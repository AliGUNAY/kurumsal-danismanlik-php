<?php
/* Smarty version 3.1.30-dev/18, created on 2016-07-20 12:50:08
  from "/home/goxskons/public_html/theme/admin/menu.tpl" */

if ($_smarty_tpl->_decodeProperties($_smarty_tpl, array (
  'has_nocache_code' => false,
  'version' => '3.1.30-dev/18',
  'unifunc' => 'content_578f4950a8f513_31598533',
  'file_dependency' => 
  array (
    '8a1fa4dab5fd0edb22b48eea6fad6413701d1af3' => 
    array (
      0 => '/home/goxskons/public_html/theme/admin/menu.tpl',
      1 => 1469008198,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
  ),
),false)) {
function content_578f4950a8f513_31598533 ($_smarty_tpl) {
?>
<nav id="sidenav-left">
        <div class="scrollable">
            <h3 class="sidenav-title antagon-font-oswald-bold"><a href="index.php?page=panel">IWT v1</a></h3>
            <div class="title-star"></div>
            <p class="sidenav-subtitle hidden-xs">Profesyonel Web Panel</p>
			
            <ul class="list-unstyled" id="accordion">
               
			   
			   
				<li>
                    <a href="index.php?page=settings">
                        <i class="fa fa-wrench antagon-color-main"></i>
                        <span class="hidden-xs">Site Genel Ayarları</span>
                    </a>
                </li>
			   
                <?php
$_from = $_smarty_tpl->smarty->ext->_foreach->init($_smarty_tpl, $_smarty_tpl->tpl_vars['menu']->value, 'foo');
foreach ($_from as $_smarty_tpl->tpl_vars['foo']->value) {
$_smarty_tpl->tpl_vars['foo']->_loop = true;
$__foreach_foo_0_saved = $_smarty_tpl->tpl_vars['foo'];
?>
					<?php if ($_smarty_tpl->tpl_vars['foo']->value['title'] == 0) {?>
					<li id="<?php echo $_smarty_tpl->tpl_vars['foo']->value['panel_sef'];?>
menu" style="<?php if ($_smarty_tpl->tpl_vars['foo']->value['status'] == 0) {?> display:none <?php }?>">
						<a href="index.php?page=page/<?php echo $_smarty_tpl->tpl_vars['foo']->value['panel_sef'];?>
">
							<i class="fa <?php echo $_smarty_tpl->tpl_vars['foo']->value['icon'];?>
 antagon-color-main"></i>
							<span class="hidden-xs"><?php echo $_smarty_tpl->tpl_vars['foo']->value['title'];?>
</span>
						</a>
					</li>
					<?php }?>
				<?php
$_smarty_tpl->tpl_vars['foo'] = $__foreach_foo_0_saved;
}
$_smarty_tpl->smarty->ext->_foreach->restore($_smarty_tpl);
?>
				<!---
				<li class="dcjq-parent-li">
                    <a href="javascript:" class="dcjq-parent">
                        <i class="fa fa-pencil antagon-color-main"></i>
                        <span class="hidden-xs">Örnek menu</span>
						<ul style="display: none;">
							<li><a href="typography.html#headings">Headings</a></li>
							<li><a href="typography.html#contextual-colors">Contextual colors</a></li>
							<li><a href="typography.html#leads">Leads</a></li>
							<li><a href="typography.html#blockquotes">Blockquotes</a></li>
							<li><a href="typography.html#lists">Lists</a></li>
							<li><a href="typography.html#icons">Icons</a></li>
						</ul>
					</a>
                </li>--->
				<br />
				<li>
                    <a href="index.php?page=cikisyap">
                        <i class="fa fa-sign-out antagon-color-main"></i>
                        <span class="hidden-xs"> Çıkış Yap</span>
                    </a>
                </li>
				<li>
                    <a href="../" target="_blank">
                        <i class="fa fa-chevron-left antagon-color-main"></i>
                        <span class="hidden-xs"> Siteye Git</span>
                    </a>
                </li>
				 
				 
				 
            </ul>

        </div>
    </nav><?php }
}
