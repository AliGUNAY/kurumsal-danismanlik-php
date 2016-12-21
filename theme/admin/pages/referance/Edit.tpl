{include file="header.tpl"}
 <div id="main-wrapper">
	<aside>
		{include file="menu.tpl"}
		<section id="main-container">
		<header>
			<div class="row">		
				<div class="col-sm-12">
					<h4 class="pull-left"><i class="fa fa-pencil antagon-color-main"></i> Referans Ayarları</h4>
					
				</div>	
			</div>	
		</header>
		<br/>
		
		
		<script src="../system/ckeditor/ckeditor/ckeditor.js"></script>

		
		<div id="content">
			<div class="row">
				<form class="verikaydet" action="index.php?page=page/referance/update" method="post" enctype="multipart/form-data">
				<input type="hidden" name="{$tokenID}" value="{$token}" />
				<input type="hidden" name="id" value="{$lower.id}" />

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
													<input type="text" name="seo_title" class="form-control" id="title" placeholder="Google arama sıralamasında gozuken başlık" value="{$lower.seo_title}">
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
													<input type="text" name="seo_keyword" class="form-control" id="keyword" placeholder="Etiket kelimelere göre google aramasında gözükmesi" value="{$lower.seo_keyword}">
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
													<input type="text" name="seo_description" class="form-control search" id="desc" placeholder="Google arama sıralamasında gözüken açıklama" value="{$lower.seo_description}">
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
				
				<div class="col-sm-12">
					<section id="headings" class="menu-anchor">
						<div class="panel panel-default">
							<div class="panel-heading">
								<h3 class="panel-title">Referans Ayarları</h3>
							</div>
							<div class="panel-body">
								<div class="page-header">
									<div class="form-horizontal">
										
										<div class="form-group">
											<label for="title" class="col-sm-2 control-label">Referans Başlık</label>
											<div class="col-sm-10">
												<div class="input-group" style="margin-bottom: 3px;">
													<input type="text" name="title" class="form-control" id="title" placeholder="Google arama sıralamasında gozuken başlık" value="{$lower.title}">
													<span class="input-group-btn">
														  <a class="btn btn-midnight" data-container="body" data-toggle="popover" data-placement="left" data-content="Google Arama sayfalarında kelime arandıkdan sonra listelenen sitelerde başlık altındakı siyah renkde olan kısa açıklamaları bu bölümden ayarlayabilirsiniz" data-original-title="" title="" aria-describedby="popover464119"><i class="fa fa-question"></i></a>
													</span>
												</div>
											</div>
										</div>
										
										
										<div class="form-group">
											<label for="title" class="col-sm-2 control-label">Referans Resmi</label>
											<div class="col-sm-10">
												<div class="input-group" style="margin-bottom: 3px;">
													<div class="col-sm-12 col-md-12">
														<div class="fileinput fileinput-new" style="width:100%" data-provides="fileinput">
															<div class="fileinput-new thumbnail" style="width:100%">
																<img style="width:100%" src="../upload/photo/{if $lower.photo eq ""}no-banner.jpg{else}{$lower.photo}{/if}">
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
												<div class="input-group" style="margin-bottom: 3px;">
													<select id="multiple" name="categorys[]" placeholder="Kategori Seçiniz" class="form-control select2-multiple" multiple>
														<optgroup label="Kategoriler">
														{if $category eq TRUE}
															{foreach from=$category item=categorydon}
																	<option value="{$categorydon.id}" {foreach from=$kategori item=kategoridon}{if $kategoridon eq $categorydon.id} selected{/if}{/foreach}>{$categorydon.title}</option>
															{/foreach}
														{/if}
														</optgroup>
													</select>
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
				
				
				
				<div class="col-sm-6" style="display:none">
					<section id="headings" class="menu-anchor">
						<div class="panel panel-default">
							<div class="panel-heading">
								<h3 class="panel-title">Galeri Ayarları</h3>
							</div>
							<div class="panel-body">
								<div class="page-header">
									<div class="form-horizontal">
										<div class="row download-tooltip" id="files" class="files">
											
									
										{foreach from=$gallery item=galleryDon}
											<div class="col-md-4 modelPopup" data-image="{$galleryDon.url}" style="margin-bottom:10px">
												<div class="thumbnail-hover thumbnail-fade">
													<img style="width: 100%;height: 300px; object-fit: cover;" src="{$galleryDon.url}" class="img-responsive img-thumbnail">
												</div>
											</div>
										{/foreach}
									
										</div>
										<textarea id="json" name="gallery" style="display:none" >{$lower.gallery}</textarea>
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
				
				<div class="col-sm-12">
					<section id="headings" class="menu-anchor">
						<div class="panel panel-default">
							<div class="panel-heading">
								<h3 class="panel-title">Referans Açıklaması</h3>
							</div>
							<div class="panel-body">
								<div class="page-header">
									<div class="form-horizontal">
										
										<div class="form-group">
											<label for="desc" class="col-sm-2 control-label">Açıklama </label>
											<div class="col-sm-10">
												<div class="input-group" style="margin-bottom: 3px;">
													<textarea name="content" id="ckeditor" class="ckeditor">{$lower.content}</textarea>
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
		
		
		
		
		
		
	</aside>
 </div>
{include file="footer.tpl"}