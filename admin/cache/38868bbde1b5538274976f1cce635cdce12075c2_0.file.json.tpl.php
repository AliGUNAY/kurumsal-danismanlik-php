<?php
/* Smarty version 3.1.30-dev/18, created on 2016-06-28 16:33:45
  from "/home/istwt/domains/istanbulwebtasarim.com/public_html/demo/yenipanel/theme/admin/json.tpl" */

if ($_smarty_tpl->_decodeProperties($_smarty_tpl, array (
  'has_nocache_code' => false,
  'version' => '3.1.30-dev/18',
  'unifunc' => 'content_57727cb9848292_43124182',
  'file_dependency' => 
  array (
    '38868bbde1b5538274976f1cce635cdce12075c2' => 
    array (
      0 => '/home/istwt/domains/istanbulwebtasarim.com/public_html/demo/yenipanel/theme/admin/json.tpl',
      1 => 1467120822,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
  ),
),false)) {
function content_57727cb9848292_43124182 ($_smarty_tpl) {
?>
{
    "status": "<?php echo $_smarty_tpl->tpl_vars['status']->value;?>
",
	"message": "<?php echo $_smarty_tpl->tpl_vars['message']->value;?>
",
	"yonlendir": "<?php if (isset($_smarty_tpl->tpl_vars['yonlendir']->value)) {
echo $_smarty_tpl->tpl_vars['yonlendir']->value;
}?>"
}<?php }
}
