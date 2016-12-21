<?php
/* Smarty version 3.1.30-dev/18, created on 2016-07-18 14:36:15
  from "/home/goxskons/public_html/theme/admin/pages/press/Edit.tpl" */

if ($_smarty_tpl->_decodeProperties($_smarty_tpl, array (
  'has_nocache_code' => false,
  'version' => '3.1.30-dev/18',
  'unifunc' => 'content_578cbf2fd0e1b0_89829256',
  'file_dependency' => 
  array (
    'cdc483161da2ef01b5762fc8caedb87a1a8c4925' => 
    array (
      0 => '/home/goxskons/public_html/theme/admin/pages/press/Edit.tpl',
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
function content_578cbf2fd0e1b0_89829256 ($_smarty_tpl) {
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
					<h4 class="pull-left"><i class="fa fa-pencil antagon-color-main"></i> Basın Ayarları</h4>
					
				</div>	
			</div>	
		</header>
		<br/>
		
		
		<?php echo '<script'; ?>
 src="../system/ckeditor/ckeditor/ckeditor.js"><?php echo '</script'; ?>
>

		
		<div id="content">
			<div class="row">
				<form class="verikaydet" action="index.php?page=page/press/update" method="post" enctype="multipart/form-data">
				<input type="hidden" name="<?php echo $_smarty_tpl->tpl_vars['tokenID']->value;?>
" value="<?php echo $_smarty_tpl->tpl_vars['token']->value;?>
" />
				<input type="hidden" name="id" value="<?php echo $_smarty_tpl->tpl_vars['lower']->value['id'];?>
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
													<input type="text" name="seo_title" class="form-control" id="title" placeholder="Google arama sıralamasında gozuken başlık" value="<?php echo $_smarty_tpl->tpl_vars['lower']->value['seo_title'];?>
">
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
													<input type="text" name="seo_keyword" class="form-control" id="keyword" placeholder="Etiket kelimelere göre google aramasında gözükmesi" value="<?php echo $_smarty_tpl->tpl_vars['lower']->value['seo_keyword'];?>
">
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
													<input type="text" name="seo_description" class="form-control search" id="desc" placeholder="Google arama sıralamasında gözüken açıklama" value="<?php echo $_smarty_tpl->tpl_vars['lower']->value['seo_description'];?>
">
													<span class="input-group-btn">
													  <a class="btn btn-midnight" data-container="body" data-toggle="popover" data-placement="left" data-content="Google Arama sayfalarında kelime arandıkdan sonra listelenen sitelerde başlık altındakı siyah renkde olan kısa açıklamaları bu bölümden ayarlayabilirsiniz" data-original-title="" title="" aria-describedby="popover464119"><i class="fa fa-question"></i></a>
													</span>
												</div>
											</div>
										</div>
										
										
									</div>
								</div>
							</div>
						</div>
					</section>
				</div>
				
				<div class="col-sm-6">
					<section id="headings" class="menu-anchor">
						<div class="panel panel-default">
							<div class="panel-heading">
								<h3 class="panel-title">Ürün Ayarları</h3>
							</div>
							<div class="panel-body">
								<div class="page-header">
									<div class="form-horizontal">
										
										<div class="form-group">
											<label for="title" class="col-sm-2 control-label">Ürün Başlık</label>
											<div class="col-sm-10">
												<div class="input-group" style="margin-bottom: 3px;">
													<input type="text" name="title" class="form-control" id="title" placeholder="Google arama sıralamasında gozuken başlık" value="<?php echo $_smarty_tpl->tpl_vars['lower']->value['title'];?>
">
													<span class="input-group-btn">
														  <a class="btn btn-midnight" data-container="body" data-toggle="popover" data-placement="left" data-content="Google Arama sayfalarında kelime arandıkdan sonra listelenen sitelerde başlık altındakı siyah renkde olan kısa açıklamaları bu bölümden ayarlayabilirsiniz" data-original-title="" title="" aria-describedby="popover464119"><i class="fa fa-question"></i></a>
													</span>
												</div>
											</div>
										</div>
										
										
										<div class="form-group">
											<label for="title" class="col-sm-2 control-label">Ürün Resmi</label>
											<div class="col-sm-10">
												<div class="input-group" style="margin-bottom: 3px;">
													<div class="col-sm-12 col-md-12">
														<div class="fileinput fileinput-new" style="width:100%" data-provides="fileinput">
															<div class="fileinput-new thumbnail" style="width:100%">
																<img style="width:100%" src="../upload/photo/<?php if ($_smarty_tpl->tpl_vars['lower']->value['photo'] == '') {?>no-banner.jpg<?php } else {
echo $_smarty_tpl->tpl_vars['lower']->value['photo'];
}?>">
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
										
									
										
										
										<div class="form-group">
											<label class="col-sm-2 control-label">Kategori</label>
											<div class="col-sm-10">
												<div class="input-group kategoritipi" style="margin-bottom: 3px;">
													<select id="multiple" name="categorys[]" placeholder="Kategori Seçiniz" class="form-control select2-multiple" multiple>
														<optgroup label="Kategoriler">
														<?php if ($_smarty_tpl->tpl_vars['category']->value == TRUE) {?>
															<?php
$_from = $_smarty_tpl->smarty->ext->_foreach->init($_smarty_tpl, $_smarty_tpl->tpl_vars['category']->value, 'categorydon');
foreach ($_from as $_smarty_tpl->tpl_vars['categorydon']->value) {
$_smarty_tpl->tpl_vars['categorydon']->_loop = true;
$__foreach_categorydon_0_saved = $_smarty_tpl->tpl_vars['categorydon'];
?>
																	<option value="<?php echo $_smarty_tpl->tpl_vars['categorydon']->value['id'];?>
" <?php
$_from = $_smarty_tpl->smarty->ext->_foreach->init($_smarty_tpl, $_smarty_tpl->tpl_vars['kategori']->value, 'kategoridon');
foreach ($_from as $_smarty_tpl->tpl_vars['kategoridon']->value) {
$_smarty_tpl->tpl_vars['kategoridon']->_loop = true;
$__foreach_kategoridon_1_saved = $_smarty_tpl->tpl_vars['kategoridon'];
if ($_smarty_tpl->tpl_vars['kategoridon']->value == $_smarty_tpl->tpl_vars['categorydon']->value['id']) {?> selected<?php }
$_smarty_tpl->tpl_vars['kategoridon'] = $__foreach_kategoridon_1_saved;
}
$_smarty_tpl->smarty->ext->_foreach->restore($_smarty_tpl);
?>><?php echo $_smarty_tpl->tpl_vars['categorydon']->value['title'];?>
</option>
															<?php
$_smarty_tpl->tpl_vars['categorydon'] = $__foreach_categorydon_0_saved;
}
$_smarty_tpl->smarty->ext->_foreach->restore($_smarty_tpl);
?>
														<?php }?>
														</optgroup>
													</select>
													<span class="input-group-btn">
														  <a class="btn btn-midnight" data-container="body" data-toggle="popover" data-placement="left" data-content="Google Arama sayfalarında kelime arandıkdan sonra listelenen sitelerde başlık altındakı siyah renkde olan kısa açıklamaları bu bölümden ayarlayabilirsiniz" data-original-title="" title="" aria-describedby="popover464119"><i class="fa fa-question"></i></a>
													</span>
												</div>
											</div>
										</div>
										
										<div class="form-group" id="tip">
											<label for="dil" class="col-sm-2 control-label">Kategori Tip </label>
											<div class="col-sm-10">
												<label class="col-md-3">
													<input type="radio" name="tip" value="1" <?php if ($_smarty_tpl->tpl_vars['lower']->value['tip'] == 1) {?>checked=""<?php }?>>
													<span> Resim Galerisi</span>
												</label>
												
												<label>
													<input type="radio" name="tip" value="2" <?php if ($_smarty_tpl->tpl_vars['lower']->value['tip'] == 2) {?>checked=""<?php }?>>
													<span> Video Galerisi</span>
												</label>
											</div>
										</div>
										
										
									</div>
								</div>
							</div>
						</div>
					</section>
				</div>
				
				<div class="col-sm-6">
					<section id="headings" class="menu-anchor">
						<div class="panel panel-default" id="resimgaleri" style="<?php if ($_smarty_tpl->tpl_vars['lower']->value['tip'] == 2) {?>display:none<?php }?>">
							<div class="panel-heading">
								<h3 class="panel-title">Resim Galeri Ayarları</h3>
							</div>
							<div class="panel-body">
								<div class="page-header">
									<div class="form-horizontal">
										<div class="row download-tooltip" id="files" class="files">
											
									
										<?php
$_from = $_smarty_tpl->smarty->ext->_foreach->init($_smarty_tpl, $_smarty_tpl->tpl_vars['gallery']->value, 'galleryDon');
foreach ($_from as $_smarty_tpl->tpl_vars['galleryDon']->value) {
$_smarty_tpl->tpl_vars['galleryDon']->_loop = true;
$__foreach_galleryDon_2_saved = $_smarty_tpl->tpl_vars['galleryDon'];
?>
											<div class="col-md-4 pic" data-image="<?php echo $_smarty_tpl->tpl_vars['galleryDon']->value['url'];?>
" style="margin-bottom:10px">
												<div class="thumbnail-hover thumbnail-fade">
													<img style="width: 100%; height: 300px; object-fit: cover;" src="<?php echo $_smarty_tpl->tpl_vars['galleryDon']->value['url'];?>
" class="img-responsive img-thumbnail">
													<div class="pic-caption rotate-in pic-icon">
														<span class="btn btn-success btn-lg resimsil" data-image="<?php echo $_smarty_tpl->tpl_vars['galleryDon']->value['url'];?>
"><i class="fa fa-trash"></i></span>
													</div>
												</div>
											</div>
										<?php
$_smarty_tpl->tpl_vars['galleryDon'] = $__foreach_galleryDon_2_saved;
}
$_smarty_tpl->smarty->ext->_foreach->restore($_smarty_tpl);
?>
										
									
										</div>
										<textarea id="json" name="gallery" style="display:none" ><?php echo $_smarty_tpl->tpl_vars['lower']->value['gallery'];?>
</textarea>
										<br />
										<div class="clearfix"></div>
										<div id="progress" class="progress progress-striped">
											<div class="progress-bar progress-bar-cello"></div>
										</div>
										
										<span class="btn btn-info btn-file center-block fileinput-button">
											<i class="glyphicon glyphicon-plus"></i>
											<span>Select image...</span>
											<input id="fileupload" type="file" name="files" multiple="">
										</span>
										<div id="sonuc"></div>
									</div>
								</div>
							</div>
						</div>
						
						
						
						<div class="panel panel-default" id="videogaleri" style="<?php if ($_smarty_tpl->tpl_vars['lower']->value['tip'] == 1) {?>display:none<?php }?>">
							<div class="panel-heading">
								<h3 class="panel-title">Video Galeri Ayarları</h3>
							</div>
							<div class="panel-body">
								<div class="page-header">
									<div class="form-horizontal">
										<div class="row download-tooltip" id="filess" class="filess">
											
										<?php
$_from = $_smarty_tpl->smarty->ext->_foreach->init($_smarty_tpl, $_smarty_tpl->tpl_vars['videogallery']->value, 'videogalleryDon');
foreach ($_from as $_smarty_tpl->tpl_vars['videogalleryDon']->value) {
$_smarty_tpl->tpl_vars['videogalleryDon']->_loop = true;
$__foreach_videogalleryDon_3_saved = $_smarty_tpl->tpl_vars['videogalleryDon'];
?>
											<div class="col-md-4 pic" data-image="<?php echo $_smarty_tpl->tpl_vars['videogalleryDon']->value['url'];?>
" style="margin-bottom:10px">
												<div class="thumbnail-hover thumbnail-fade">
													<img style="width: 100%; height: 200px; object-fit: cover;" src="http://i1.ytimg.com/vi/<?php echo $_smarty_tpl->tpl_vars['videogalleryDon']->value['url'];?>
/sddefault.jpg" class="img-responsive img-thumbnail">
													<div class="pic-caption rotate-in pic-icon">
														<span class="btn btn-success btn-lg resimsil" data-image="<?php echo $_smarty_tpl->tpl_vars['videogalleryDon']->value['url'];?>
"><i class="fa fa-trash"></i></span>
													</div>
												</div>
											</div>
										<?php
$_smarty_tpl->tpl_vars['videogalleryDon'] = $__foreach_videogalleryDon_3_saved;
}
$_smarty_tpl->smarty->ext->_foreach->restore($_smarty_tpl);
?>
										
									
										</div>
										<textarea id="jsons" name="videogallery" style="display:none"><?php echo $_smarty_tpl->tpl_vars['lower']->value['videogallery'];?>
</textarea>
										<br />
										<div class="clearfix"></div>
										<div id="progress" class="progress progress-striped">
											<div class="progress-bar progress-bar-cello"></div>
										</div>
										
										<span class="btn btn-info btn-file center-block fileinput-button">
											<i class="glyphicon glyphicon-plus"></i>
											<span>Select video...</span>
											<input id="youtubevideolink" data-toggle="modal" data-target="#myModal" type="text" multiple="">
										</span>
										<div id="sonuc"></div>
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
								<h3 class="panel-title">Ürün Açıklaması</h3>
							</div>
							<div class="panel-body">
								<div class="page-header">
									<div class="form-horizontal">
										
										<div class="form-group">
											<label for="desc" class="col-sm-2 control-label">Açıklama </label>
											<div class="col-sm-10">
												<div class="input-group" style="margin-bottom: 3px;">
													<textarea name="content" id="ckeditor" class="ckeditor"><?php echo $_smarty_tpl->tpl_vars['lower']->value['content'];?>
</textarea>
												</div>
											</div>
										</div>
										
										
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
		
		
		
		<!-- Modal -->
		<div class="modal container fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
		<form class="embedkaydet" action="index.php?page=func/gallery/embed" method="post" enctype="multipart/form-data">
		  <div class="modal-dialog" role="document">
			<div class="modal-content">
			
			  <div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
				<h4 class="modal-title" id="myModalLabel">Youtube Video</h4>
			  </div>
			  <div class="modal-body">
					<div class="form-group">
						<label for="title" class="col-sm-2 control-label">Youtube Video Link</label>
						<div class="col-sm-10">
							<div class="input-group" style="margin-bottom: 3px;">
								<input type="text" id="embedinput" name="url" class="form-control" id="title" placeholder="Youtube video embed link">
								<span class="input-group-btn">
									  <a class="btn btn-midnight" data-container="body" data-toggle="popover" data-placement="left" data-content="Google Arama sayfalarında kelime arandıkdan sonra listelenen sitelerde başlık altındakı siyah renkde olan kısa açıklamaları bu bölümden ayarlayabilirsiniz" data-original-title="" title="" aria-describedby="popover464119"><i class="fa fa-question"></i></a>
								</span>
							</div>
						</div>
					</div>
					
					<br />
			  </div>
			  <div class="modal-footer">
				<button type="submit" class="btn btn-primary">Kaydet</button>
			  </div>
			</div>
			
		  </div>
		  </form>
		</div>
		
		
	</aside>
 </div>
<?php $_smarty_tpl->_subTemplateRender("file:footer.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array(), 0, false);
}
}
