<?php
/* Smarty version 3.1.30-dev/18, created on 2016-07-18 12:49:31
  from "/home/goxskons/public_html/theme/admin/json.tpl" */

if ($_smarty_tpl->_decodeProperties($_smarty_tpl, array (
  'has_nocache_code' => false,
  'version' => '3.1.30-dev/18',
  'unifunc' => 'content_578ca62b71b620_96167176',
  'file_dependency' => 
  array (
    '2ddbc92fbc21714a8bf651c8ea9c95899338cfbc' => 
    array (
      0 => '/home/goxskons/public_html/theme/admin/json.tpl',
      1 => 1468827786,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
  ),
),false)) {
function content_578ca62b71b620_96167176 ($_smarty_tpl) {
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
