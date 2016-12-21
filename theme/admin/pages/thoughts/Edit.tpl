{include file="header.tpl"}
 <div id="main-wrapper">
	<aside>
		{include file="menu.tpl"}
		<section id="main-container">
		<header>
			<div class="row">		
				<div class="col-sm-12">
					<h4 class="pull-left"><i class="fa fa-pencil antagon-color-main"></i> Düşünceleriniz Ayarları</h4>
					
				</div>	
			</div>	
		</header>
		<br/>

		
		<div id="content">
			<div class="row">
				<form class="veriyikaydet" action="index.php?page=page/thoughts/update" method="post" enctype="multipart/form-data">
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
											<label for="title" class="col-sm-2 control-label">İsim Soyisim</label>
											<div class="col-sm-10">
												<div class="input-group" style="margin-bottom: 3px;">
													<input type="text" name="name" class="form-control" id="title" placeholder="Google arama sıralamasında gozuken başlık" value="{$lower.name}">
													<span class="input-group-btn">
														  <a class="btn btn-midnight" data-container="body" data-toggle="popover" data-placement="left" data-content="Google Arama sayfalarında kelime arandıkdan sonra listelenen sitelerde başlık altındakı siyah renkde olan kısa açıklamaları bu bölümden ayarlayabilirsiniz" data-original-title="" title="" aria-describedby="popover464119"><i class="fa fa-question"></i></a>
													</span>
												</div>
											</div>
										</div>
										
										<div class="form-group">
											<label for="title" class="col-sm-2 control-label">Eklenme Tarihi</label>
											<div class="col-sm-10">
												<div class="input-group date" id="datetimepicker1">
													<input type='text' name="date" class="form-control" data-date-format="DD-MM-YYYY" value="{$function->formatdate($lower.date)}">
													<span class="input-group-addon"><i class="fa fa-calendar"></i></span>
												</div>
											</div>
										</div>
										<div class="form-group">
											<label for="dil" class="col-sm-2 control-label">Tip </label>
											<div class="col-sm-10">
												<label class="col-md-3">
													<input type="radio" name="tip" value="1" {if $lower.tip eq 1}checked=""{/if}>
													<span> Şahıs</span>
												</label>
												
												<label>
													<input type="radio" name="tip" value="2" {if $lower.tip eq 2}checked=""{/if}>
													<span> Firma</span>
												</label>
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