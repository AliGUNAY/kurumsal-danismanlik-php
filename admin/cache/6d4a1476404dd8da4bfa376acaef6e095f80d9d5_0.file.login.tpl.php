<?php
/* Smarty version 3.1.30-dev/18, created on 2016-07-03 16:28:49
  from "/home/istwt/domains/istanbulwebtasarim.com/public_html/demo/yenipanel/theme/admin/login.tpl" */

if ($_smarty_tpl->_decodeProperties($_smarty_tpl, array (
  'has_nocache_code' => false,
  'version' => '3.1.30-dev/18',
  'unifunc' => 'content_577913114620a0_47775891',
  'file_dependency' => 
  array (
    '6d4a1476404dd8da4bfa376acaef6e095f80d9d5' => 
    array (
      0 => '/home/istwt/domains/istanbulwebtasarim.com/public_html/demo/yenipanel/theme/admin/login.tpl',
      1 => 1465461956,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
    'file:header.tpl' => 1,
    'file:footer.tpl' => 1,
  ),
),false)) {
function content_577913114620a0_47775891 ($_smarty_tpl) {
$_smarty_tpl->_subTemplateRender("file:header.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array(), 0, false);
?>

  <div id="content">
        <section id="forms">
            <div class="row">
				<div class="col-sm-4 docs-offset-notitle">
				
				</div>
                <div class="col-sm-5 docs-offset-notitle">
                    <div class="panel panel-default">
                        <div class="panel-heading">
                            <h3 class="panel-title">Giriş Yap</h3>
                        </div>
                        <div class="panel-body">
							<div id="bilgikutusu"></div>
						
                            <form class="form-horizontal forumum" action="index.php?page=login">
								<input type="hidden" name="<?php echo $_smarty_tpl->tpl_vars['tokenID']->value;?>
" value="<?php echo $_smarty_tpl->tpl_vars['token']->value;?>
" />
							
                                <div class="form-group">
                                    <label for="inputEmail3" class="col-sm-2 control-label">Kullanıcı Adı</label>
                                    <div class="col-sm-10">
                                        <input type="text" class="form-control" id="inputEmail3" name="user" placeholder="Kullanıcı Adı">
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="inputPassword3" class="col-sm-2 control-label">Şifre</label>
                                    <div class="col-sm-10">
                                        <input type="password" class="form-control" id="inputPassword3" name="pass" placeholder="Şifre">
                                    </div>
                                </div>
                                <div class="form-group">
                                    <div class="col-sm-offset-2 col-sm-10">
                                        <div class="custom-checkbox">
                                            <label>
                                                <input type="checkbox">
                                                <span> Beni Hatırla</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <div class="col-sm-offset-2 col-sm-10">
                                        <button type="submit" class="btn btn-primary">Oturum Aç</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
	<?php $_smarty_tpl->_subTemplateRender("file:footer.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array(), 0, false);
}
}
