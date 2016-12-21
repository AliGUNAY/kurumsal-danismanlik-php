<?php
/* Smarty version 3.1.30-dev/18, created on 2016-07-01 17:24:17
  from "/home/istwt/domains/istanbulwebtasarim.com/public_html/demo/yenipanel/theme/admin/json.tpl" */

if ($_smarty_tpl->_decodeProperties($_smarty_tpl, array (
  'has_nocache_code' => false,
  'version' => '3.1.30-dev/18',
  'unifunc' => 'content_57767d1163d333_04999141',
  'file_dependency' => 
  array (
    'b8fb78684c3ec69be3050eb972970574b271e184' => 
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
function content_57767d1163d333_04999141 ($_smarty_tpl) {
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
