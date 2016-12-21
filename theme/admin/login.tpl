{include file="header.tpl"}
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
								<input type="hidden" name="{$tokenID}" value="{$token}" />
							
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
	{include file="footer.tpl"}