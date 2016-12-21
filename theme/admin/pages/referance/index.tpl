{include file="header.tpl"}
 <div id="main-wrapper">
	<aside>
		{include file="menu.tpl"}
		<section id="main-container">
		<header>
			<div class="row">		
				<div class="col-sm-12">
					<h4 class="pull-left"><i class="fa fa-pencil antagon-color-main"></i> {$homepage.title}</h4>
				</div>	
			</div>	
		</header>
		<br/>
		
		
		<script src="../system/ckeditor/ckeditor/ckeditor.js"></script>

		
		<div id="content">
			<div class="row">
				<form class="verikaydet" action="index.php?page=page/referance" method="post" enctype="multipart/form-data">
				<input type="hidden" name="{$tokenID}" value="{$token}" />
			
				
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
													<input type="text" name="seo_title" class="form-control" id="title" placeholder="Google arama sıralamasında gozuken başlık" value="{$homepage.seo_title}">
													<span class="input-group-btn">
														  <a class="btn btn-midnight" data-container="body" data-toggle="popover" data-placement="top" data-content="Google Arama sayfalarında kelime arandıkdan sonra listelenen sitelerde başlık altındakı siyah renkde olan kısa açıklamaları bu bölümden ayarlayabilirsiniz" data-original-title="" title="" aria-describedby="popover464119"><i class="fa fa-question"></i></a>
													</span>
												</div>
											</div>
										</div>
										<div class="form-group">
											<label for="keyword" class="col-sm-2 control-label">Keyword</label>
											<div class="col-sm-10">
												<div class="input-group" style="margin-bottom: 3px;">
													<input type="text" name="seo_keyword" class="form-control" id="keyword" placeholder="Etiket kelimelere göre google aramasında gözükmesi" value="{$homepage.seo_keyword}">
													<span class="input-group-btn">
													  <a class="btn btn-midnight" data-container="body" data-toggle="popover" data-placement="top" data-content="Google Arama sayfalarında kelime arandıkdan sonra listelenen sitelerde başlık altındakı siyah renkde olan kısa açıklamaları bu bölümden ayarlayabilirsiniz" data-original-title="" title="" aria-describedby="popover464119"><i class="fa fa-question"></i></a>
													</span>
												</div>
											</div>
										</div>
										<div class="form-group">
											<label for="desc" class="col-sm-2 control-label">Description </label>
											<div class="col-sm-10">
												<div class="input-group" style="margin-bottom: 3px;">
													<input type="text" name="seo_description" class="form-control search" id="desc" placeholder="Google arama sıralamasında gözüken açıklama" value="{$homepage.seo_description}">
													<span class="input-group-btn">
													  <a class="btn btn-midnight" data-container="body" data-toggle="popover" data-placement="top" data-content="Google Arama sayfalarında kelime arandıkdan sonra listelenen sitelerde başlık altındakı siyah renkde olan kısa açıklamaları bu bölümden ayarlayabilirsiniz" data-original-title="" title="" aria-describedby="popover464119"><i class="fa fa-question"></i></a>
													</span>
												</div>
											</div>
										</div>
										
										<div class="form-group">
											<label for="dil" class="col-sm-2 control-label">Anasayfa'da </label>
											<div class="col-sm-10">
												<label>
													<input type="radio" name="homepagestatus" value="1" {if $homepage.homepagestatus eq 1} checked {/if}>
													<span> Gizle</span>
												</label>
												
												<label>
													<input type="radio" name="homepagestatus" value="0" {if $homepage.homepagestatus eq 0} checked {/if}>
													<span> Göster</span>
												</label>
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
								<h3 class="panel-title">Sayfa Resmi</h3>
							</div>
							<div class="panel-body">
								<div class="page-header">
									<div class="form-horizontal">
										
										<div class="col-sm-12 col-md-12">
											<div class="fileinput fileinput-new" style="width:100%" data-provides="fileinput">
												<div class="fileinput-new thumbnail" style="width:100%">
													<img style="width:100%" src="../upload/photo/{if $homepage.photo eq ""}no-banner.jpg{else}{$homepage.photo}{/if}">
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
					</section>
				</div>
				
				
				<div class="col-sm-12">
					<section id="headings" class="menu-anchor">
						<div class="panel panel-default">
							<div class="panel-heading">
								<h3 class="panel-title">Sayfa Bilgileri</h3>
							</div>
							<div class="panel-body">
								<div class="page-header">
									<div class="form-horizontal">
										
										<div class="form-group" id="form">
											<label for="desc" class="col-sm-2 control-label">Sayfa İçerik </label>
											<div class="col-sm-10">
												<div class="input-group center-block" style="margin-bottom: 3px;">
													<textarea name="content" id="ckeditor" class="ckeditor">{$homepage.content}</textarea>
												</div>
											</div>
										</div>
										
										
									</div>
								</div>
							</div>
						</div>
					</section>
				</div>
				
				
				
				
				
				
				
				{if $categorys eq 1}			
				
				<div class="col-sm-12">
					<section id="headings" class="menu-anchor">
						<div class="panel panel-default">
							<div class="panel-heading">
								<h3 class="panel-title pull-left">
								Kategoriler</h3>
								<div class="pull-right">
									<a data-toggle="modal" href="#kategoriekle" class="btn btn-cyanide"><i class="fa fa-tags"></i> Kategori Ekle</a>
									</div>
									<div class="clearfix"></div>
							</div>
							<div class="panel-body">
								<div class="panel panel-default">
									<table class="table table-striped">
										<thead> 
											<tr>
												<th style="width: 15px;">Aktiflik</th>
												<th style="width: 15px;">Sıralama</th>
												<th style="width: 45px;">#</th>
												<th>Başlık <span class="badge badge-cyanide" data-container="body" data-toggle="popover" data-placement="right" data-content="Google Arama sayfalarında kelime arandıkdan sonra listelenen sitelerde başlık altındakı siyah renkde olan kısa açıklamaları bu bölümden ayarlayabilirsiniz" data-original-title="" title=""><i class="fa fa-question"></i></span></th>
												<th style="width: 130px;">İşlem <span class="badge badge-cyanide" data-container="body" data-toggle="popover" data-placement="left" data-content="Google Arama sayfalarında kelime arandıkdan sonra listelenen sitelerde başlık altındakı siyah renkde olan kısa açıklamaları bu bölümden ayarlayabilirsiniz" data-original-title="" title=""><i class="fa fa-question"></i></span></th> 
											</tr>
											</thead>
											<tbody id="sortablecategory" data-page="page/referance/category/sort">
											{if $category eq TRUE}
											{foreach from=$category key=k item=categorydon}
												<tr id="item-{$categorydon.id}">
													<td class="text-center"><button type="button" data-name="{$categorydon.seo_title}" data-database="page/referance/category/status" data-id="{$categorydon.id}" data-status="{$categorydon.status}" class="btn {if $categorydon.status eq 0}btn-primary{else}btn-danger{/if} btn-xs status"><i class="fa fa-star" aria-hidden="true"></i></button></td>
													<td class="text-center"><button type="button" class="btn btn-warning btn-xs "><i class="fa fa-arrows" aria-hidden="true"></i></button></td>
													<td>{$k}</td>
													<td>{$categorydon.seo_title}</td>
													<td>
														<a href="index.php?page=page/referance/category/edit&id={$categorydon.id}"><span class="label label-info"><i class="fa fa-pencil-square-o" aria-hidden="true"></i> Düzenle</span></a>
														<a class="divtikla" href="index.php?page=page/referance/category/delete&id={$categorydon.id}"><span class="label label-danger"><i class="fa fa-times" aria-hidden="true"></i> Sil</span></a>
													</td>
												</tr>
											{/foreach}
											{else}
												<tr>
													<td></td>
													<td><center>Hiç Kayıt Bulunamadı!</center></td>
													<td></td>
													<td></td>
												</tr>
											{/if}
											</tbody>
										</table>
								</div>	
							</div>
						</div>
					</section>
				</div>
				{/if}
				<a style="display:none" href="javascript:" id="siralamakaydet" class="btn btn-berry">Sıralama Kaydedildi.</a>
				
				
				
				
				
				{if $categorys eq 1}			
				
				<div class="col-sm-12">
					<section id="headings" class="menu-anchor">
						<div class="panel panel-default">
							<div class="panel-heading">
								<h3 class="panel-title pull-left">
								Referanslar
										
								</h3>
								<div class="pull-right">
									<a href="index.php?page=page/referance/add" class="btn btn-cyanide"><i class="fa fa-tags"></i> Referans Ekle</a>
									</div>
									<div class="clearfix"></div>
							</div>
							<div class="panel-body">
								<div class="panel panel-default">
									
										<table class="table table-striped table-hover table-bordered">
											<thead> 
											<tr>
												<th style="width: 15px;">Aktiflik</th>
												<th style="width: 15px;">Sıralama</th>
												<th style="width: 45px;">#</th>
												<th>Başlık <span class="badge badge-cyanide" data-container="body" data-toggle="popover" data-placement="right" data-content="Google Arama sayfalarında kelime arandıkdan sonra listelenen sitelerde başlık altındakı siyah renkde olan kısa açıklamaları bu bölümden ayarlayabilirsiniz" data-original-title="" title=""><i class="fa fa-question"></i></span></th>
												<th style="width: 130px;">İşlem <span class="badge badge-cyanide" data-container="body" data-toggle="popover" data-placement="left" data-content="Google Arama sayfalarında kelime arandıkdan sonra listelenen sitelerde başlık altındakı siyah renkde olan kısa açıklamaları bu bölümden ayarlayabilirsiniz" data-original-title="" title=""><i class="fa fa-question"></i></span></th> 
											</tr>
											</thead>
											<tbody id="sortable" data-page="page/referance/sort">
											{if $products eq TRUE}
											{foreach from=$products item=don}
												<tr id="item-{$don.id}">
													<td class="text-center"><button type="button" data-name="{$don.seo_title}" data-database="page/referance/status" data-id="{$don.id}" data-status="{$don.status}" class="btn {if $don.status eq 0}btn-primary{else}btn-danger{/if} btn-xs status"><i class="fa fa-star" aria-hidden="true"></i></button></td>
													<td class="text-center"><button type="button" class="btn btn-warning btn-xs "><i class="fa fa-arrows" aria-hidden="true"></i></button></td>
													<td>{$don.id}</td>
													<td>{$don.seo_title}</td>
													<td>
														<a href="index.php?page=page/referance/edit&id={$don.id}"><span class="label label-info"><i class="fa fa-pencil-square-o" aria-hidden="true"></i> Düzenle</span></a>
														<a class="divtikla" href="index.php?page=page/referance/delete&id={$don.id}"><span class="label label-danger"><i class="fa fa-times" aria-hidden="true"></i> Sil</span></a>
													</td>
												</tr>
											{/foreach}
											{else}
												<tr>
													<td></td>
													<td><center>Hiç Kayıt Bulunamadı!</center></td>
													<td></td>
													<td></td>
												</tr>
											{/if}
											</tbody>
										</table>
								</div>	
							</div>
						</div>
					</section>
				</div>
				{/if}
				
				
				
				<div class="col-sm-12 alert alert-info">
					<div class="pull-right btn-group">
						<button type="submit" id="fat-btn" data-loading-text="Lütfen Bekleyiniz..." class="btn btn-labeled btn-berry">Tüm Ayarları Kaydet<span class="btn-label btn-label-right"><i class="fa fa-save"></i></span></button>
					</div>
				</div>
			</form>
			</div>
		</div>
		</section>
		
		
		
		
		
		
		{if $categorys eq 1}	
			
			
			
			<div id="kategoriekle" class="modal fade" tabindex="-1" data-replace="true" data-width="760" style="display: none;">
				<form class="popupkaydet" action="index.php?page=page/referance/category/add" method="post" enctype="multipart/form-data">
				<input type="hidden" name="{$tokenID}" value="{$token}" />
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
					<h4 class="modal-title">Yeni Bir Kategori Ekleme</h4>
				</div>
				<div class="modal-body">
					<div class="col-sm-12 col-md-12">
						<div class="form-group">
							<label class="col-sm-2 control-label">Başlık</label>
							<div class="col-sm-10">
								<div class="input-group" style="margin-bottom: 3px;">
									<input type="text" name="seo_title" class="form-control" id="title" placeholder="Google arama sıralamasında gozuken başlık">
									<span class="input-group-btn">
										  <a class="btn btn-midnight" data-container="body" data-toggle="popover" data-placement="top" data-content="Google Arama sayfalarında kelime arandıkdan sonra listelenen sitelerde başlık altındakı siyah renkde olan kısa açıklamaları bu bölümden ayarlayabilirsiniz" data-original-title="" title="" aria-describedby="popover464119"><i class="fa fa-question"></i></a>
									</span>
								</div>
							</div>
						</div>
						
					</div>
					
					
				
					
					<div class="clearfix"></div>
				</div>
				<div class="modal-footer">
					<button type="submit" class="btn btn-primary">Kaydet</button>
				</div>
				</form>
			</div>
		
		{/if}
		
		
	</aside>
 </div>
{include file="footer.tpl"}