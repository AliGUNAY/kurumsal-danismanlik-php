<?php
/* Smarty version 3.1.30-dev/18, created on 2016-06-29 09:58:55
  from "/home/istwt/domains/istanbulwebtasarim.com/public_html/demo/yenipanel/theme/admin/menu.tpl" */

if ($_smarty_tpl->_decodeProperties($_smarty_tpl, array (
  'has_nocache_code' => false,
  'version' => '3.1.30-dev/18',
  'unifunc' => 'content_577371afc3a310_46206872',
  'file_dependency' => 
  array (
    'f06fc95fba3c5d3e7f6eb3b33124f01a84a98641' => 
    array (
      0 => '/home/istwt/domains/istanbulwebtasarim.com/public_html/demo/yenipanel/theme/admin/menu.tpl',
      1 => 1467183535,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
  ),
),false)) {
function content_577371afc3a310_46206872 ($_smarty_tpl) {
?>
<nav id="sidenav-left">
        <div class="scrollable">
            <h3 class="sidenav-title antagon-font-oswald-bold"><a href="index.php?page=panel">IWT v1</a></h3>
            <div class="title-star"></div>
            <p class="sidenav-subtitle hidden-xs">Profesyonel Web Panel</p>
			
            <ul class="list-unstyled" id="accordion">
               
				<li>
                    <a href="index.php?page=settings">
                        <i class="fa fa-list antagon-color-main"></i>
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
							<i class="fa fa-list antagon-color-main"></i>
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
				 
				 
				 
            </ul>

        </div>
    </nav><?php }
}
