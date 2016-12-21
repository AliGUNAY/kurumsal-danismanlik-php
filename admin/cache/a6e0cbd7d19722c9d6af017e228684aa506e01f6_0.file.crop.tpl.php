<?php
/* Smarty version 3.1.30-dev/18, created on 2016-07-13 13:59:23
  from "/home/istwt/domains/istanbulwebtasarim.com/public_html/demo/yenipanel/theme/admin/module/crop.tpl" */

if ($_smarty_tpl->_decodeProperties($_smarty_tpl, array (
  'has_nocache_code' => false,
  'version' => '3.1.30-dev/18',
  'unifunc' => 'content_57861f0b22e5f9_55832120',
  'file_dependency' => 
  array (
    'a6e0cbd7d19722c9d6af017e228684aa506e01f6' => 
    array (
      0 => '/home/istwt/domains/istanbulwebtasarim.com/public_html/demo/yenipanel/theme/admin/module/crop.tpl',
      1 => 1468407560,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
  ),
),false)) {
function content_57861f0b22e5f9_55832120 ($_smarty_tpl) {
?>
<div class="modal fade bs-modal-sm" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" data-width="760" aria-hidden="true" style="display: none;">
	<div class="modal-dialog modal-sm">
		<div class="modal-content">

			<div class="modal-body">
				<div class="container">
				 <img src="<?php echo $_smarty_tpl->tpl_vars['resim']->value;?>
" width="100%"/>
				 </div>

				<div class="clearfix"></div>
			</div>
			
			<div class="clearfix"></div>
			<div class="modal-footer">
			
				<div class="pull-right">
					<button data-dismiss="modal" class="btn btn-primary">İptal</button>
					<button type="button" class="btn btn-danger resimsil" data-image="<?php echo $_smarty_tpl->tpl_vars['resim']->value;?>
" data-dismiss="modal">Resmi Sil</button>
				</div>
				
			
			</div>
		</div><!-- /.modal-content -->
	</div><!-- /.modal-dialog -->
</div>



<?php echo '<script'; ?>
>
$('.bs-modal-sm').modal('show');
<?php echo '</script'; ?>
>
<?php }
}
