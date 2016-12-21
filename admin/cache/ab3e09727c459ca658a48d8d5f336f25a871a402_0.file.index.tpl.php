<?php
/* Smarty version 3.1.30-dev/18, created on 2016-07-18 13:40:32
  from "/home/goxskons/public_html/theme/admin/pages/contact/index.tpl" */

if ($_smarty_tpl->_decodeProperties($_smarty_tpl, array (
  'has_nocache_code' => false,
  'version' => '3.1.30-dev/18',
  'unifunc' => 'content_578cb2209b1ef7_36232769',
  'file_dependency' => 
  array (
    'ab3e09727c459ca658a48d8d5f336f25a871a402' => 
    array (
      0 => '/home/goxskons/public_html/theme/admin/pages/contact/index.tpl',
      1 => 1468827794,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
    'file:header.tpl' => 1,
    'file:menu.tpl' => 1,
    'file:footer.tpl' => 1,
  ),
),false)) {
function content_578cb2209b1ef7_36232769 ($_smarty_tpl) {
$_smarty_tpl->_subTemplateRender("file:header.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array(), 0, false);
?>

 <div id="main-wrapper">
	<aside>
		<?php $_smarty_tpl->_subTemplateRender("file:menu.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array(), 0, false);
?>

		<section id="main-container">
		<header>
			<div class="row">		
				<div class="col-sm-12">
					<h4 class="pull-left"><i class="fa fa-pencil antagon-color-main"></i> İletişim</h4>
					
				</div>	
			</div>	
		</header>
		<br/>
		<div id="content">
			
			
			
			<div class="panel panel-default">
                <div class="panel-heading">
                    <h3 class="panel-title">İletişim Mesajlar</h3>
                </div>
                <div class="panel-body">
                    <table class="table table-bordered">
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>İsim Soyisim</th>
                            <th>Telefon</th>
                            <th>Mail Adresi</th>
							<th>Mesaj</th>
                        </tr>
                        </thead>
                        <tbody>
						<?php if ($_smarty_tpl->tpl_vars['contact']->value == TRUE) {?>
							<?php
$_from = $_smarty_tpl->smarty->ext->_foreach->init($_smarty_tpl, $_smarty_tpl->tpl_vars['contact']->value, 'don');
foreach ($_from as $_smarty_tpl->tpl_vars['don']->value) {
$_smarty_tpl->tpl_vars['don']->_loop = true;
$__foreach_don_0_saved = $_smarty_tpl->tpl_vars['don'];
?>
							<tr>
								<td>#<?php echo $_smarty_tpl->tpl_vars['don']->value['id'];?>
</td>
								<td><?php echo $_smarty_tpl->tpl_vars['don']->value['adsoyad'];?>
</td>
								<td><?php echo $_smarty_tpl->tpl_vars['don']->value['telefon'];?>
</td>
								<td><?php echo $_smarty_tpl->tpl_vars['don']->value['mailadresi'];?>
</td>
								<td>
									<div class="btn-group">
										<button data-toggle="modal" href="#static<?php echo $_smarty_tpl->tpl_vars['don']->value['id'];?>
" type="button" class="btn btn-info btn-xs"><i class="fa fa-info-circle"></i> Mesajı Oku</button>
									</div>
								</td>
							</tr>
							<?php
$_smarty_tpl->tpl_vars['don'] = $__foreach_don_0_saved;
}
$_smarty_tpl->smarty->ext->_foreach->restore($_smarty_tpl);
?>
						<?php } else { ?>
							<tr>
								<td><center>-</center></td>
								<td><center>Hiç Kayıt Bulunamadı!</center></td>
								<td><center>-</center></td>
								<td><center>-</center></td>
								<td><center>-</center></td>
							</tr>
						<?php }?>
                       
					   
					   <?php if ($_smarty_tpl->tpl_vars['contact']->value == TRUE) {?>
							<?php
$_from = $_smarty_tpl->smarty->ext->_foreach->init($_smarty_tpl, $_smarty_tpl->tpl_vars['contact']->value, 'don');
foreach ($_from as $_smarty_tpl->tpl_vars['don']->value) {
$_smarty_tpl->tpl_vars['don']->_loop = true;
$__foreach_don_1_saved = $_smarty_tpl->tpl_vars['don'];
?>
								<div id="static<?php echo $_smarty_tpl->tpl_vars['don']->value['id'];?>
" class="modal fade" tabindex="-1" data-backdrop="static" data-keyboard="false" style="display: none;">
									<div class="modal-body">
										<div class="well well-primary-light-text">
											<p><?php echo $_smarty_tpl->tpl_vars['don']->value['mesaj'];?>
</p>
										</div>
									</div>
									<div class="modal-footer">
										<button type="button" data-dismiss="modal" class="btn btn-default">Kapat</button>
									</div>
								</div>
							<?php
$_smarty_tpl->tpl_vars['don'] = $__foreach_don_1_saved;
}
$_smarty_tpl->smarty->ext->_foreach->restore($_smarty_tpl);
?>
						<?php }?>
					   
                        </tbody>
                    </table>
                </div>
            </div>
			
			
			
			
		</div>
		</section>
	</aside>
 </div>
<?php $_smarty_tpl->_subTemplateRender("file:footer.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array(), 0, false);
}
}
