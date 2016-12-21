{include file="header.tpl"}
 <div id="main-wrapper">
	<aside>
		{include file="menu.tpl"}
		<section id="main-container">
		<header>
			<div class="row">		
				<div class="col-sm-12">
					<h4 class="pull-left"><i class="fa fa-pencil antagon-color-main"></i> Genel Ayarlar</h4>
					
				</div>	
			</div>	
		</header>
		<br/>
		<div id="content">
			<div class="row">
			<form class="veriyikaydet" action="index.php?page=settings" method="post" enctype="multipart/form-data">
				<input type="hidden" name="{$tokenID}" value="{$token}" />
				<div class="col-sm-6">
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
													<input type="text" name="seo_title" class="form-control" id="title" placeholder="Google arama sıralamasında gozuken başlık" value="{$settings.seo_title}">
													<span class="input-group-btn">
														  <a class="btn btn-midnight" data-container="body" data-toggle="popover" data-placement="top" data-content="yazı" data-original-title="" title="" aria-describedby="popover464119"><i class="fa fa-question"></i></a>
													</span>
												</div>
											</div>
										</div>
										<div class="form-group">
											<label for="keyword" class="col-sm-2 control-label">Keyword</label>
											<div class="col-sm-10">
												<div class="input-group" style="margin-bottom: 3px;">
													<input type="text" name="seo_keyword" class="form-control" id="keyword" placeholder="Etiket kelimelere göre google aramasında gözükmesi" value="{$settings.seo_keyword}">
													<span class="input-group-btn">
													  <a class="btn btn-midnight" data-container="body" data-toggle="popover" data-placement="top" data-content="yazı" data-original-title="" title="" aria-describedby="popover464119"><i class="fa fa-question"></i></a>
													</span>
												</div>
											</div>
										</div>
										<div class="form-group">
											<label for="desc" class="col-sm-2 control-label">Description </label>
											<div class="col-sm-10">
												<div class="input-group" style="margin-bottom: 3px;">
													<input type="text" name="seo_description" class="form-control search" id="desc" placeholder="Google arama sıralamasında gözüken açıklama" value="{$settings.seo_description}">
													<span class="input-group-btn">
													  <a class="btn btn-midnight" data-container="body" data-toggle="popover" data-placement="top" data-content="yazı" data-original-title="" title="" aria-describedby="popover464119"><i class="fa fa-question"></i></a>
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
								<h3 class="panel-title">Logo / Favicon Ayarları</h3>
							</div>
							<div class="panel-body">
								<div class="page-header">
									<div class="form-horizontal">
										<div class="col-sm-4 col-sm-push-2">
											<div class="fileinput fileinput-new" data-provides="fileinput">
												<div class="fileinput-new thumbnail" style="width: 100%; height: 100px;">
													<img src="../upload/logo/{$settings.logo}" alt="...">
												</div>
												<div class="fileinput-preview fileinput-exists thumbnail" style="max-width: 200px; max-height: 180px;"></div>
												<div>
													<span class="btn btn-info btn-file">
														<span class="fileinput-new"><i class="fa fa-plus"></i> Logo Seç</span>
														<span class="fileinput-exists"><i class="fa fa-refresh"></i> </span>
														<input type="file" id="logo" name="logo">
													</span>
													<a href="#" class="btn btn-default fileinput-exists" data-dismiss="fileinput"><i class="fa fa-minus"></i></a>
												</div>
											</div>
										</div>
										
										<div class="col-sm-4 col-sm-push-2">
											<div class="fileinput fileinput-new" data-provides="fileinput">
												<div class="fileinput-new thumbnail" style="width: 100%; height: 100px;">
													<img src="../upload/favicon/{$settings.favicon}" alt="...">
												</div>
												<div class="fileinput-preview fileinput-exists thumbnail" style="max-width: 200px; max-height: 180px;"></div>
												<div>
													<span class="btn btn-warning btn-file">
														<span class="fileinput-new"><i class="fa fa-plus"></i> Favicon Seç</span>
														<span class="fileinput-exists"><i class="fa fa-refresh"></i> </span>
														<input type="file" name="favicon">
													</span>
													<a href="#" class="btn btn-default fileinput-exists" data-dismiss="fileinput"><i class="fa fa-minus"></i></a>
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
								<h3 class="panel-title">Site Ayarları</h3>
							</div>
							<div class="panel-body">
								<div class="page-header">
									<div class="form-horizontal">
									
										<div class="form-group">
											<label for="link" class="col-sm-2 control-label">Site URL </label>
											<div class="col-sm-10">
												<div class="input-group" style="margin-bottom: 3px;">
													<input type="text" name="site_url" class="form-control search" id="link" placeholder="Site url adresiniz" value="{$settings.site_url}">
													<span class="input-group-btn">
													  <a class="btn btn-midnight" data-container="body" data-toggle="popover" data-placement="left" data-content="yazı" data-original-title="" title="" aria-describedby="popover464119"><i class="fa fa-question"></i></a>
													</span>
												</div>
											</div>
										</div>
										
										<div class="form-group">
											<label for="eposta" class="col-sm-2 control-label">E-Posta Adresi </label>
											<div class="col-sm-10">
												<div class="input-group" style="margin-bottom: 3px;">
													<input type="email" name="eposta" class="form-control search" id="eposta" placeholder="E-Posta iletişim bildirimi gidicegi adres" value="{$settings.eposta}">
													<span class="input-group-btn">
													  <a class="btn btn-midnight" data-container="body" data-toggle="popover" data-placement="left" data-content="yazı" data-original-title="" title="" aria-describedby="popover464119"><i class="fa fa-question"></i></a>
													</span>
												</div>
											</div>
										</div>
										
										<div class="form-group">
											<label for="google" class="col-sm-2 control-label">Google Analytics Kaynak Kodu </label>
											<div class="col-sm-10">
												<div class="input-group" style="margin-bottom: 3px;">
													<textarea type="text" name="google_analytics" class="form-control search" id="google" rows="5" placeholder="Google arama sıralamasında gözüken açıklama">{$settings.google_analytics}</textarea>
													<span class="input-group-btn">
													  <a class="btn btn-midnight" data-container="body" data-toggle="popover" data-placement="left" data-content="yazı" data-original-title="" title="" aria-describedby="popover464119"><i class="fa fa-question"></i></a>
													</span>
												</div>
											</div>
										</div>
										
										<div class="form-group" style="display:none">
											<label for="dil" class="col-sm-2 control-label">İngilizce Dil </label>
											<div class="col-sm-10">
												<label>
													<input type="radio" name="dil_ingilizce" value="1" {if $settings.dil_ingilizce eq 1} checked {/if}/>
													<span> Aktif</span>
												</label>
												
												<label>
													<input type="radio" name="dil_ingilizce" value="0" {if $settings.dil_ingilizce eq 0} checked {/if}>
													<span> Pasif</span>
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
						<div class="panel panel-default">
							<div class="panel-heading">
								<h3 class="panel-title">İletişim Ayarları</h3>
							</div>
							<div class="panel-body">
								<div class="page-header">
									<div class="form-horizontal">
									
										<div class="form-group">
											<label for="link" class="col-sm-2 control-label">Şirket ADı </label>
											<div class="col-sm-10">
												<div class="input-group" style="margin-bottom: 3px;">
													<input type="text" name="sirket" class="form-control search" placeholder="Şirket Adı" value="{$settings.sirket}">
													<span class="input-group-btn">
													  <a class="btn btn-midnight" data-container="body" data-toggle="popover" data-placement="left" data-content="yazı" data-original-title="" title="" aria-describedby="popover464119"><i class="fa fa-question"></i></a>
													</span>
												</div>
											</div>
										</div>
										
										<div class="form-group">
											<label for="google" class="col-sm-2 control-label">Şirket Adresi </label>
											<div class="col-sm-10">
												<div class="input-group" style="margin-bottom: 3px;">
													<textarea type="text" name="sirketadres" class="form-control search" id="google" rows="2" placeholder="Şirketinizin Bulundugu Adres">{$settings.sirketadres}</textarea>
													<span class="input-group-btn">
													  <a class="btn btn-midnight" data-container="body" data-toggle="popover" data-placement="left" data-content="yazı" data-original-title="" title="" aria-describedby="popover464119"><i class="fa fa-question"></i></a>
													</span>
												</div>
											</div>
										</div>
										
										<div class="form-group">
											<label for="eposta" class="col-sm-2 control-label">Sabit tel.: </label>
											<div class="col-sm-10">
												<div class="input-group" style="margin-bottom: 3px;">
													<input type="text" name="sirkettelefon" class="form-control search" id="eposta" placeholder="Sabit Telefon Numaranız!" value="{$settings.sirkettelefon}">
													<span class="input-group-btn">
													  <a class="btn btn-midnight" data-container="body" data-toggle="popover" data-placement="left" data-content="yazı" data-original-title="" title="" aria-describedby="popover464119"><i class="fa fa-question"></i></a>
													</span>
												</div>
											</div>
										</div>
										
										<div class="form-group">
											<label for="eposta" class="col-sm-2 control-label">Cep tel.: </label>
											<div class="col-sm-10">
												<div class="input-group" style="margin-bottom: 3px;">
													<input type="text" name="sirketgsm" class="form-control search" id="eposta" placeholder="GSM Telefon Numaranız!" value="{$settings.sirketgsm}">
													<span class="input-group-btn">
													  <a class="btn btn-midnight" data-container="body" data-toggle="popover" data-placement="left" data-content="yazı" data-original-title="" title="" aria-describedby="popover464119"><i class="fa fa-question"></i></a>
													</span>
												</div>
											</div>
										</div>
										
										<div class="form-group">
											<label for="eposta" class="col-sm-2 control-label">Sabit Mail: </label>
											<div class="col-sm-10">
												<div class="input-group" style="margin-bottom: 3px;">
													<input type="text" name="sirketmail" class="form-control search" id="eposta" placeholder="Şirketinizin kullanmıl oldugu mail adresi" value="{$settings.sirketmail}">
													<span class="input-group-btn">
													  <a class="btn btn-midnight" data-container="body" data-toggle="popover" data-placement="left" data-content="yazı" data-original-title="" title="" aria-describedby="popover464119"><i class="fa fa-question"></i></a>
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
								<h3 class="panel-title">Google Harita Konum</h3>
							</div>
							<div class="panel-body">
								<div class="page-header">
									<div class="form-horizontal">
										
										<div class="input-group">
											<label class="input-group-addon" for="latitude">Enlem</label>
											<input type="text" name="haritaenlem" id="latitude" value="{$settings.haritaenlem}" class="form-control" readonly>
											<label class="input-group-addon" for="longitude">Boylam</label>
											<input type="text" name="haritaboylam" id="longitude" value="{$settings.haritaboylam}" class="form-control" readonly>
										</div>
										<div id="canvas" style="height: 300px"></div>
										<script src="//maps.google.com/maps/api/js?sensor=false"></script>
										<script>
											var myZoom = 14;
											var myMarkerIsDraggable = true;
											var myCoordsLenght = 6;
											var defaultLat = "{$settings.haritaenlem}";
											var defaultLng = "{$settings.haritaboylam}";

											var map = new google.maps.Map(document.getElementById('canvas'), {
												zoom: myZoom,
												center: new google.maps.LatLng(defaultLat, defaultLng),
												mapTypeId: google.maps.MapTypeId.ROADMAP
											});

											var myMarker = new google.maps.Marker({
												position: new google.maps.LatLng(defaultLat, defaultLng),
												draggable: myMarkerIsDraggable
											});

											google.maps.event.addListener(myMarker, 'dragend', function(evt){
												document.getElementById('latitude').value = evt.latLng.lat().toFixed(myCoordsLenght);
												document.getElementById('longitude').value = evt.latLng.lng().toFixed(myCoordsLenght);
											});

											map.setCenter(myMarker.position);

											myMarker.setMap(map);
										</script>
										
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
								<h3 class="panel-title">Mail Sunucusu Ayarları</h3>
							</div>
							<div class="panel-body">
								<div class="page-header">
									<div class="form-horizontal">
									
										<div class="form-group">
											<label for="link" class="col-sm-2 control-label">Mail Sunucusu </label>
											<div class="col-sm-10">
												<div class="input-group" style="margin-bottom: 3px;">
													<input type="text" name="epostasunucu" class="form-control search" placeholder="Mail Sunucusu (localhost)" value="{$settings.epostasunucu}">
													<span class="input-group-btn">
													  <a class="btn btn-midnight" data-container="body" data-toggle="popover" data-placement="left" data-content="yazı" data-original-title="" title="" aria-describedby="popover464119"><i class="fa fa-question"></i></a>
													</span>
												</div>
											</div>
										</div>
										
										
										<div class="form-group">
											<label for="eposta" class="col-sm-2 control-label">Mail Adresi: </label>
											<div class="col-sm-10">
												<div class="input-group" style="margin-bottom: 3px;">
													<input type="text" name="epostaadresi" class="form-control search" id="eposta" placeholder="Mail Adresiniz" value="{$settings.epostaadresi}">
													<span class="input-group-btn">
													  <a class="btn btn-midnight" data-container="body" data-toggle="popover" data-placement="left" data-content="yazı" data-original-title="" title="" aria-describedby="popover464119"><i class="fa fa-question"></i></a>
													</span>
												</div>
											</div>
										</div>
										
										<div class="form-group">
											<label for="eposta" class="col-sm-2 control-label">Mail Şifresi: </label>
											<div class="col-sm-10">
												<div class="input-group" style="margin-bottom: 3px;">
													<input type="text" name="epostasifre" class="form-control search" id="eposta" placeholder="Mail Adresinizin Şifresi" value="{$settings.epostasifre}">
													<span class="input-group-btn">
													  <a class="btn btn-midnight" data-container="body" data-toggle="popover" data-placement="left" data-content="yazı" data-original-title="" title="" aria-describedby="popover464119"><i class="fa fa-question"></i></a>
													</span>
												</div>
											</div>
										</div>
										
										<div class="form-group">
											<label for="eposta" class="col-sm-2 control-label">Mail Port: </label>
											<div class="col-sm-10">
												<div class="input-group" style="margin-bottom: 3px;">
													<input type="text" name="epostaport" class="form-control search" id="eposta" placeholder="Mail Portu" value="{$settings.epostaport}">
													<span class="input-group-btn">
													  <a class="btn btn-midnight" data-container="body" data-toggle="popover" data-placement="left" data-content="yazı" data-original-title="" title="" aria-describedby="popover464119"><i class="fa fa-question"></i></a>
													</span>
												</div>
											</div>
										</div>
										
										<div class="form-group">
											<label for="eposta" class="col-sm-2 control-label">Mail Gözüken İsim </label>
											<div class="col-sm-10">
												<div class="input-group" style="margin-bottom: 3px;">
													<input type="text" name="epostaisim" class="form-control search" id="eposta" placeholder="Gönderilen mailde gözükücek isim" value="{$settings.epostaisim}">
													<span class="input-group-btn">
													  <a class="btn btn-midnight" data-container="body" data-toggle="popover" data-placement="left" data-content="yazı" data-original-title="" title="" aria-describedby="popover464119"><i class="fa fa-question"></i></a>
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
								<h3 class="panel-title">Sosyal Medya</h3>
							</div>
							<div class="panel-body">
								<div class="page-header">
									<div class="form-horizontal">
									
										<div class="form-group">
											<label for="link" class="col-sm-2 control-label">Facebook </label>
											<div class="col-sm-10">
												<div class="input-group" style="margin-bottom: 3px;">
													<input type="text" name="facebook" class="form-control search" placeholder="Facebook URL" value="{$settings.facebook}">
													<span class="input-group-btn">
													  <a class="btn btn-midnight" data-container="body" data-toggle="popover" data-placement="left" data-content="yazı" data-original-title="" title="" aria-describedby="popover464119"><i class="fa fa-question"></i></a>
													</span>
												</div>
											</div>
										</div>
										
										
										<div class="form-group">
											<label for="eposta" class="col-sm-2 control-label">Twitter: </label>
											<div class="col-sm-10">
												<div class="input-group" style="margin-bottom: 3px;">
													<input type="text" name="twitter" class="form-control search" id="eposta" placeholder="Twitter URL" value="{$settings.twitter}">
													<span class="input-group-btn">
													  <a class="btn btn-midnight" data-container="body" data-toggle="popover" data-placement="left" data-content="yazı" data-original-title="" title="" aria-describedby="popover464119"><i class="fa fa-question"></i></a>
													</span>
												</div>
											</div>
										</div>
										
										<div class="form-group">
											<label for="eposta" class="col-sm-2 control-label">Instagram: </label>
											<div class="col-sm-10">
												<div class="input-group" style="margin-bottom: 3px;">
													<input type="text" name="instagram" class="form-control search" id="eposta" placeholder="Instagram URL" value="{$settings.instagram}">
													<span class="input-group-btn">
													  <a class="btn btn-midnight" data-container="body" data-toggle="popover" data-placement="left" data-content="yazı" data-original-title="" title="" aria-describedby="popover464119"><i class="fa fa-question"></i></a>
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
				
				
				<style>
				.chexboxPanel {
					font-size: 24px;
					display: block;
					position: absolute;
					left: 7px;
					top: 2px;
					width: 100%;
					text-align: left;
					text-indent: 0;
				}
				</style>
			
				<div class="col-sm-12">
					<section id="headings" class="menu-anchor">
						<div class="panel panel-default">
							<div class="panel-heading">
								<h3 class="panel-title">Menüler</h3>
								
								<div class="clearfix"></div>
							</div>
							<div class="panel-body">
								<div class="page-header">
									<div class="cf nestable-lists">
										<div class="dd" id="nestable">
											<ol class="dd-list">
											{foreach from=$menu item=foo}
												{if $foo.main_sort eq 0}
												<li class="dd-item group" data-id="{$foo.id}">
												
														<div class="dd-handle dd3-handle"></div>
														<label class="chexboxPanel"> 
															<input type="checkbox" {if $foo.status eq 1} checked{/if} name="status[]" value="{$foo.panel_sef}" id="{$foo.panel_sef}checkbox" class="checked" onclick="$('#{$foo.panel_sef}Collapse').collapse('toggle');menugoster('{$foo.panel_sef}')">
															<span></span>
														</label>
														
													
													<div class="dd3-content">
														<a href="#" id="{$foo.panel_sef}editlen" data-menuid="{$foo.panel_sef}" class="editle" style="z-index: 9; position: absolute;">{$foo.title}</a>
														<input type="hidden" id="{$foo.panel_sef}menuadi" name="menuadi[{$foo.panel_sef}]" value="{$foo.title}"/>
												
														
														<div class="pull-right">
															<i class="fa fa-question" data-container="body" data-toggle="popover" data-placement="left" data-content="yazı" data-original-title="" title=""></i>
														</div>
													</div>
													{if $foo.altkategorisi eq 1}
													<div id="{$foo.panel_sef}Collapse" class="panel-collapse collapse {if $status.status eq 1} in{/if}" style="margin-top:10px">
														<div class="form-group">
															<label class="col-sm-0 control-label"></label>
															<div class="col-sm-10">
																{foreach from=$category key=myId item=categoryA}
																	{if $foo.panel_sef eq $myId  && $foo.altkategorisi eq 1}
																		<label>
																			<input name="on[]" value="{$myId}" type="checkbox" {if $categoryA eq 1} checked{/if}>
																			<span> Alt Kategorileri Olsun</span>
																		</label>
																	{/if}
																{/foreach}
															</div>
														</div>
													</div>
													{/if}
													{foreach from=$menu item=fooo}
														{if $fooo.main_sort neq 0}
															{if $fooo.main_sort eq $foo.id}
															<ol class="dd-list">
																<li class="dd-item" data-id="{$fooo.id}">
																	<div class="chexboxPanel">
																		<label>
																			<input type="checkbox" onclick="$('#{$fooo.panel_sef}Collapse').collapse('toggle');">
																			<span></span>
																		</label>
																	</div>
																	<div class="dd3-content">
																	{$fooo.title}
																	<div class="pull-right">
																		<i class="fa fa-question" data-container="body" data-toggle="popover" data-placement="left" data-content="yazı" data-original-title="" title=""></i>
																	</div>
																	</div>
																</li>
																
																<div id="{$fooo.panel_sef}Collapse" class="panel-collapse collapse" style="margin-top:10px">
																	<div class="form-group">
																		<label class="col-sm-0 control-label"></label>
																		<div class="col-sm-10">
																			{foreach from=$category key=id item=categoryAA}
																				{if $foo.panel_sef eq $id}
																					<label>
																						<input name="{$fooo.panel_sef}ON" type="checkbox" {if $categoryAA.status eq 1} checked{/if}>
																						<span> Sayfa Aktif mi?</span>
																					</label>
																				{/if}
																			{/foreach}
																		</div>
																	</div>
																</div>
															</ol>
															{/if}
														{/if}
													{/foreach}
												</li>
												{/if}
											{/foreach}	
											</ol>
										</div>
										
									</div>
								</div>
								
								<textarea id="nestable-output" name="sort" class="form-control" style="display:none"></textarea>

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