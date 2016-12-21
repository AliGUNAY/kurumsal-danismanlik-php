<?php
/* Smarty version 3.1.30-dev/18, created on 2016-07-19 16:27:03
  from "/home/goxskons/public_html/theme/admin/pages/gallery/Add.tpl" */

if ($_smarty_tpl->_decodeProperties($_smarty_tpl, array (
  'has_nocache_code' => false,
  'version' => '3.1.30-dev/18',
  'unifunc' => 'content_578e2aa7616342_31172038',
  'file_dependency' => 
  array (
    'b42614bc1bfa2858a1b41a2f1970be3a973c43d7' => 
    array (
      0 => '/home/goxskons/public_html/theme/admin/pages/gallery/Add.tpl',
      1 => 1468827790,
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
function content_578e2aa7616342_31172038 ($_smarty_tpl) {
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
					<h4 class="pull-left"><i class="fa fa-pencil antagon-color-main"></i> Gallery Ekle</h4>
					
				</div>	
			</div>	
		</header>
		<br/>

		
		<div id="content">
			<div class="row">
				<form class="veriyikaydet" action="index.php?page=page/gallery/add" method="post" enctype="multipart/form-data">
				<input type="hidden" name="<?php echo $_smarty_tpl->tpl_vars['tokenID']->value;?>
" value="<?php echo $_smarty_tpl->tpl_vars['token']->value;?>
" />

				<div class="col-sm-12">
					<section id="headings" class="menu-anchor">
						<div class="panel panel-default">
							<div class="panel-heading">
								<h3 class="panel-title">SEO Ayarları</h3>
							</div>
							<div class="panel-body">
								<div class="page-header">
									<div class="form-horizontal">
										
										<div class="form-group">
											<label for="title" class="col-sm-2 control-label">Başlık</label>
											<div class="col-sm-10">
												<div class="input-group" style="margin-bottom: 3px;">
													<input type="text" name="seo_title" class="form-control" id="title" placeholder="Google arama sıralamasında gozuken başlık" value="">
													<span class="input-group-btn">
														  <a class="btn btn-midnight" data-container="body" data-toggle="popover" data-placement="left" data-content="Google Arama sayfalarında kelime arandıkdan sonra listelenen sitelerde başlık altındakı siyah renkde olan kısa açıklamaları bu bölümden ayarlayabilirsiniz" data-original-title="" title="" aria-describedby="popover464119"><i class="fa fa-question"></i></a>
													</span>
												</div>
											</div>
										</div>
										<div class="form-group">
											<label for="keyword" class="col-sm-2 control-label">Keyword</label>
											<div class="col-sm-10">
												<div class="input-group" style="margin-bottom: 3px;">
													<input type="text" name="seo_keyword" class="form-control" id="keyword" placeholder="Etiket kelimelere göre google aramasında gözükmesi" value="">
													<span class="input-group-btn">
													  <a class="btn btn-midnight" data-container="body" data-toggle="popover" data-placement="left" data-content="Google Arama sayfalarında kelime arandıkdan sonra listelenen sitelerde başlık altındakı siyah renkde olan kısa açıklamaları bu bölümden ayarlayabilirsiniz" data-original-title="" title="" aria-describedby="popover464119"><i class="fa fa-question"></i></a>
													</span>
												</div>
											</div>
										</div>
										<div class="form-group">
											<label for="desc" class="col-sm-2 control-label">Description </label>
											<div class="col-sm-10">
												<div class="input-group" style="margin-bottom: 3px;">
													<input type="text" name="seo_description" class="form-control search" id="desc" placeholder="Google arama sıralamasında gözüken açıklama" value="">
													<span class="input-group-btn">
													  <a class="btn btn-midnight" data-container="body" data-toggle="popover" data-placement="left" data-content="Google Arama sayfalarında kelime arandıkdan sonra listelenen sitelerde başlık altındakı siyah renkde olan kısa açıklamaları bu bölümden ayarlayabilirsiniz" data-original-title="" title="" aria-describedby="popover464119"><i class="fa fa-question"></i></a>
													</span>
												</div>
											</div>
										</div>
										
										<div class="form-group">
											<label for="title" class="col-sm-2 control-label">Kapak Resmi</label>
											<div class="col-sm-10">
												<div class="input-group" style="margin-bottom: 3px;">
													<div class="col-sm-12 col-md-12">
														<div class="fileinput fileinput-new" style="width:100%" data-provides="fileinput">
															<div class="fileinput-new thumbnail" style="width:100%">
																<img style="width:100%" src="../upload/photo/no-banner.jpg">
															</div>
															<div class="fileinput-preview fileinput-exists thumbnail" style="width:100%"></div>
															<div>
																<span class="col-md-6 btn btn-info btn-file center-block">
																	<span class="fileinput-new"><i class="fa fa-plus"></i> Sayfa Resmi Seç</span>
																	<span class="fileinput-exists"><i class="fa fa-refresh"></i> Resmi Degiştir</span>
																	<input type="file" id="photo" name="photo">
																</span>
																<span class="col-md-6 btn btn-danger center-block kaldirresmi fileinput-new">
																	<span class="fileinput-new"><i class="fa fa-minus"></i> Resmi Sil</span>
																	<input type="checkbox" id="photoReset" name="photoReset"/>
																</span>
																<a href="#" class="col-md-6 btn btn-default fileinput-exists" data-dismiss="fileinput"><i class="fa fa-minus"></i> İşlemi Iptal Et</a>
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
										
										
									</div>
								</div>
							</div>
						</div>
					</section>
				</div>
				
				
				
				
				
				<div class="col-sm-12">
					<section id="headings" class="menu-anchor">
						<div class="panel panel-default">
							<div class="panel-heading">
								<h3 class="panel-title">Galeri Ayarları</h3>
							</div>
							<div class="panel-body">
								<div class="page-header">
									<div class="form-horizontal">
										<div class="row download-tooltip galleryDiv" id="files" class="files">
									
									
										</div>
										<textarea id="json" name="gallery" style="display:none" ><?php echo $_smarty_tpl->tpl_vars['gallery']->value;?>
</textarea>
										<br />
										<div class="clearfix"></div>
										<div id="progress" class="progress progress-striped">
											<div class="progress-bar progress-bar-cello"></div>
										</div>
										
										<span class="btn btn-info btn-file center-block fileinput-button">
											<i class="glyphicon glyphicon-plus"></i>
											<span>Select files...</span>
											<input id="fileupload" type="file" name="files" multiple="">
										</span>
										<div id="sonuc"></div>
									</div>
								</div>
							</div>
						</div>
					</section>
				</div>
				
			
				
				
				<div class="col-sm-12 alert alert-info">
					<div class="pull-right btn-group">
						<button type="submit" id="fat-btn" data-loading-text="Lütfen Bekleyiniz..." class="btn btn-labeled btn-berry">Tüm Ayarları Kaydet<span class="btn-label btn-label-right"><i class="fa fa-save"></i></span></button>
					</div>
				</div>
			</form>
			</div>
		</div>
		</section>
		
		
		
		
		
		
	</aside>
 </div>
<?php $_smarty_tpl->_subTemplateRender("file:footer.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array(), 0, false);
}
}
