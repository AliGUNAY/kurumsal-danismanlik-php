<?php
/* Smarty version 3.1.30-dev/18, created on 2016-07-17 23:59:43
  from "/home/istwt/domains/istanbulwebtasarim.com/public_html/demo/yenipanel/theme/admin/settings.tpl" */

if ($_smarty_tpl->_decodeProperties($_smarty_tpl, array (
  'has_nocache_code' => false,
  'version' => '3.1.30-dev/18',
  'unifunc' => 'content_578bf1bff31dd7_87183402',
  'file_dependency' => 
  array (
    '8a139550ecb24f77f2fc3e9a94ec0f3162b33201' => 
    array (
      0 => '/home/istwt/domains/istanbulwebtasarim.com/public_html/demo/yenipanel/theme/admin/settings.tpl',
      1 => 1468789183,
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
function content_578bf1bff31dd7_87183402 ($_smarty_tpl) {
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
					<h4 class="pull-left"><i class="fa fa-pencil antagon-color-main"></i> Genel Ayarlar</h4>
					
				</div>	
			</div>	
		</header>
		<br/>
		<div id="content">
			<div class="row">
			<form class="veriyikaydet" action="index.php?page=settings" method="post" enctype="multipart/form-data">
				<input type="hidden" name="<?php echo $_smarty_tpl->tpl_vars['tokenID']->value;?>
" value="<?php echo $_smarty_tpl->tpl_vars['token']->value;?>
" />
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
													<input type="text" name="seo_title" class="form-control" id="title" placeholder="Google arama sıralamasında gozuken başlık" value="<?php echo $_smarty_tpl->tpl_vars['settings']->value['seo_title'];?>
">
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
													<input type="text" name="seo_keyword" class="form-control" id="keyword" placeholder="Etiket kelimelere göre google aramasında gözükmesi" value="<?php echo $_smarty_tpl->tpl_vars['settings']->value['seo_keyword'];?>
">
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
													<input type="text" name="seo_description" class="form-control search" id="desc" placeholder="Google arama sıralamasında gözüken açıklama" value="<?php echo $_smarty_tpl->tpl_vars['settings']->value['seo_description'];?>
">
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
													<img src="../upload/logo/<?php echo $_smarty_tpl->tpl_vars['settings']->value['logo'];?>
" alt="...">
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
													<img src="../upload/favicon/<?php echo $_smarty_tpl->tpl_vars['settings']->value['favicon'];?>
" alt="...">
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
													<input type="text" name="site_url" class="form-control search" id="link" placeholder="Site url adresiniz" value="<?php echo $_smarty_tpl->tpl_vars['settings']->value['site_url'];?>
">
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
													<input type="email" name="eposta" class="form-control search" id="eposta" placeholder="E-Posta iletişim bildirimi gidicegi adres" value="<?php echo $_smarty_tpl->tpl_vars['settings']->value['eposta'];?>
">
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
													<textarea type="text" name="google_analytics" class="form-control search" id="google" rows="5" placeholder="Google arama sıralamasında gözüken açıklama"><?php echo $_smarty_tpl->tpl_vars['settings']->value['google_analytics'];?>
</textarea>
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
													<input type="radio" name="dil_ingilizce" value="1" <?php if ($_smarty_tpl->tpl_vars['settings']->value['dil_ingilizce'] == 1) {?> checked <?php }?>/>
													<span> Aktif</span>
												</label>
												
												<label>
													<input type="radio" name="dil_ingilizce" value="0" <?php if ($_smarty_tpl->tpl_vars['settings']->value['dil_ingilizce'] == 0) {?> checked <?php }?>>
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
													<input type="text" name="sirket" class="form-control search" placeholder="Şirket Adı" value="<?php echo $_smarty_tpl->tpl_vars['settings']->value['sirket'];?>
">
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
													<textarea type="text" name="sirketadres" class="form-control search" id="google" rows="2" placeholder="Şirketinizin Bulundugu Adres"><?php echo $_smarty_tpl->tpl_vars['settings']->value['sirketadres'];?>
</textarea>
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
													<input type="text" name="sirkettelefon" class="form-control search" id="eposta" placeholder="Sabit Telefon Numaranız!" value="<?php echo $_smarty_tpl->tpl_vars['settings']->value['sirkettelefon'];?>
">
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
													<input type="text" name="sirketgsm" class="form-control search" id="eposta" placeholder="GSM Telefon Numaranız!" value="<?php echo $_smarty_tpl->tpl_vars['settings']->value['sirketgsm'];?>
">
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
													<input type="text" name="sirketmail" class="form-control search" id="eposta" placeholder="Şirketinizin kullanmıl oldugu mail adresi" value="<?php echo $_smarty_tpl->tpl_vars['settings']->value['sirketmail'];?>
">
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
											<input type="text" name="haritaenlem" id="latitude" value="<?php echo $_smarty_tpl->tpl_vars['settings']->value['haritaenlem'];?>
" class="form-control" readonly>
											<label class="input-group-addon" for="longitude">Boylam</label>
											<input type="text" name="haritaboylam" id="longitude" value="<?php echo $_smarty_tpl->tpl_vars['settings']->value['haritaboylam'];?>
" class="form-control" readonly>
										</div>
										<div id="canvas" style="height: 300px"></div>
										<?php echo '<script'; ?>
 src="//maps.google.com/maps/api/js?sensor=false"><?php echo '</script'; ?>
>
										<?php echo '<script'; ?>
>
											var myZoom = 14;
											var myMarkerIsDraggable = true;
											var myCoordsLenght = 6;
											var defaultLat = "<?php echo $_smarty_tpl->tpl_vars['settings']->value['haritaenlem'];?>
";
											var defaultLng = "<?php echo $_smarty_tpl->tpl_vars['settings']->value['haritaboylam'];?>
";

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
										<?php echo '</script'; ?>
>
										
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
													<input type="text" name="epostasunucu" class="form-control search" placeholder="Mail Sunucusu (localhost)" value="<?php echo $_smarty_tpl->tpl_vars['settings']->value['epostasunucu'];?>
">
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
													<input type="text" name="epostaadresi" class="form-control search" id="eposta" placeholder="Mail Adresiniz" value="<?php echo $_smarty_tpl->tpl_vars['settings']->value['epostaadresi'];?>
">
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
													<input type="text" name="epostasifre" class="form-control search" id="eposta" placeholder="Mail Adresinizin Şifresi" value="<?php echo $_smarty_tpl->tpl_vars['settings']->value['epostasifre'];?>
">
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
													<input type="text" name="epostaport" class="form-control search" id="eposta" placeholder="Mail Portu" value="<?php echo $_smarty_tpl->tpl_vars['settings']->value['epostaport'];?>
">
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
													<input type="text" name="epostaisim" class="form-control search" id="eposta" placeholder="Gönderilen mailde gözükücek isim" value="<?php echo $_smarty_tpl->tpl_vars['settings']->value['epostaisim'];?>
">
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
													<input type="text" name="facebook" class="form-control search" placeholder="Facebook URL" value="<?php echo $_smarty_tpl->tpl_vars['settings']->value['facebook'];?>
">
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
													<input type="text" name="twitter" class="form-control search" id="eposta" placeholder="Twitter URL" value="<?php echo $_smarty_tpl->tpl_vars['settings']->value['twitter'];?>
">
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
													<input type="text" name="instagram" class="form-control search" id="eposta" placeholder="Instagram URL" value="<?php echo $_smarty_tpl->tpl_vars['settings']->value['instagram'];?>
">
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
											<?php
$_from = $_smarty_tpl->smarty->ext->_foreach->init($_smarty_tpl, $_smarty_tpl->tpl_vars['menu']->value, 'foo');
foreach ($_from as $_smarty_tpl->tpl_vars['foo']->value) {
$_smarty_tpl->tpl_vars['foo']->_loop = true;
$__foreach_foo_0_saved = $_smarty_tpl->tpl_vars['foo'];
?>
												<?php if ($_smarty_tpl->tpl_vars['foo']->value['main_sort'] == 0) {?>
												<li class="dd-item group" data-id="<?php echo $_smarty_tpl->tpl_vars['foo']->value['id'];?>
">
												
														<div class="dd-handle dd3-handle"></div>
														<label class="chexboxPanel"> 
															<input type="checkbox" <?php if ($_smarty_tpl->tpl_vars['foo']->value['status'] == 1) {?> checked<?php }?> name="status[]" value="<?php echo $_smarty_tpl->tpl_vars['foo']->value['panel_sef'];?>
" id="<?php echo $_smarty_tpl->tpl_vars['foo']->value['panel_sef'];?>
checkbox" class="checked" onclick="$('#<?php echo $_smarty_tpl->tpl_vars['foo']->value['panel_sef'];?>
Collapse').collapse('toggle');menugoster('<?php echo $_smarty_tpl->tpl_vars['foo']->value['panel_sef'];?>
')">
															<span></span>
														</label>
														
													
													<div class="dd3-content">
														<a href="#" id="<?php echo $_smarty_tpl->tpl_vars['foo']->value['panel_sef'];?>
editlen" data-menuid="<?php echo $_smarty_tpl->tpl_vars['foo']->value['panel_sef'];?>
" class="editle" style="z-index: 9; position: absolute;"><?php echo $_smarty_tpl->tpl_vars['foo']->value['title'];?>
</a>
														<input type="hidden" id="<?php echo $_smarty_tpl->tpl_vars['foo']->value['panel_sef'];?>
menuadi" name="menuadi[<?php echo $_smarty_tpl->tpl_vars['foo']->value['panel_sef'];?>
]" value="<?php echo $_smarty_tpl->tpl_vars['foo']->value['title'];?>
"/>
												
														
														<div class="pull-right">
															<i class="fa fa-question" data-container="body" data-toggle="popover" data-placement="left" data-content="yazı" data-original-title="" title=""></i>
														</div>
													</div>
													<?php if ($_smarty_tpl->tpl_vars['foo']->value['altkategorisi'] == 1) {?>
													<div id="<?php echo $_smarty_tpl->tpl_vars['foo']->value['panel_sef'];?>
Collapse" class="panel-collapse collapse <?php if ($_smarty_tpl->tpl_vars['status']->value['status'] == 1) {?> in<?php }?>" style="margin-top:10px">
														<div class="form-group">
															<label class="col-sm-0 control-label"></label>
															<div class="col-sm-10">
																<?php
$_from = $_smarty_tpl->smarty->ext->_foreach->init($_smarty_tpl, $_smarty_tpl->tpl_vars['category']->value, 'categoryA', false, 'myId');
foreach ($_from as $_smarty_tpl->tpl_vars['myId']->value => $_smarty_tpl->tpl_vars['categoryA']->value) {
$_smarty_tpl->tpl_vars['categoryA']->_loop = true;
$__foreach_categoryA_1_saved = $_smarty_tpl->tpl_vars['categoryA'];
?>
																	<?php if ($_smarty_tpl->tpl_vars['foo']->value['panel_sef'] == $_smarty_tpl->tpl_vars['myId']->value && $_smarty_tpl->tpl_vars['foo']->value['altkategorisi'] == 1) {?>
																		<label>
																			<input name="on[]" value="<?php echo $_smarty_tpl->tpl_vars['myId']->value;?>
" type="checkbox" <?php if ($_smarty_tpl->tpl_vars['categoryA']->value == 1) {?> checked<?php }?>>
																			<span> Alt Kategorileri Olsun</span>
																		</label>
																	<?php }?>
																<?php
$_smarty_tpl->tpl_vars['categoryA'] = $__foreach_categoryA_1_saved;
}
$_smarty_tpl->smarty->ext->_foreach->restore($_smarty_tpl);
?>
															</div>
														</div>
													</div>
													<?php }?>
													<?php
$_from = $_smarty_tpl->smarty->ext->_foreach->init($_smarty_tpl, $_smarty_tpl->tpl_vars['menu']->value, 'fooo');
foreach ($_from as $_smarty_tpl->tpl_vars['fooo']->value) {
$_smarty_tpl->tpl_vars['fooo']->_loop = true;
$__foreach_fooo_2_saved = $_smarty_tpl->tpl_vars['fooo'];
?>
														<?php if ($_smarty_tpl->tpl_vars['fooo']->value['main_sort'] != 0) {?>
															<?php if ($_smarty_tpl->tpl_vars['fooo']->value['main_sort'] == $_smarty_tpl->tpl_vars['foo']->value['id']) {?>
															<ol class="dd-list">
																<li class="dd-item" data-id="<?php echo $_smarty_tpl->tpl_vars['fooo']->value['id'];?>
">
																	<div class="chexboxPanel">
																		<label>
																			<input type="checkbox" onclick="$('#<?php echo $_smarty_tpl->tpl_vars['fooo']->value['panel_sef'];?>
Collapse').collapse('toggle');">
																			<span></span>
																		</label>
																	</div>
																	<div class="dd3-content">
																	<?php echo $_smarty_tpl->tpl_vars['fooo']->value['title'];?>

																	<div class="pull-right">
																		<i class="fa fa-question" data-container="body" data-toggle="popover" data-placement="left" data-content="yazı" data-original-title="" title=""></i>
																	</div>
																	</div>
																</li>
																
																<div id="<?php echo $_smarty_tpl->tpl_vars['fooo']->value['panel_sef'];?>
Collapse" class="panel-collapse collapse" style="margin-top:10px">
																	<div class="form-group">
																		<label class="col-sm-0 control-label"></label>
																		<div class="col-sm-10">
																			<?php
$_from = $_smarty_tpl->smarty->ext->_foreach->init($_smarty_tpl, $_smarty_tpl->tpl_vars['category']->value, 'categoryAA', false, 'id');
foreach ($_from as $_smarty_tpl->tpl_vars['id']->value => $_smarty_tpl->tpl_vars['categoryAA']->value) {
$_smarty_tpl->tpl_vars['categoryAA']->_loop = true;
$__foreach_categoryAA_3_saved = $_smarty_tpl->tpl_vars['categoryAA'];
?>
																				<?php if ($_smarty_tpl->tpl_vars['foo']->value['panel_sef'] == $_smarty_tpl->tpl_vars['id']->value) {?>
																					<label>
																						<input name="<?php echo $_smarty_tpl->tpl_vars['fooo']->value['panel_sef'];?>
ON" type="checkbox" <?php if ($_smarty_tpl->tpl_vars['categoryAA']->value['status'] == 1) {?> checked<?php }?>>
																						<span> Sayfa Aktif mi?</span>
																					</label>
																				<?php }?>
																			<?php
$_smarty_tpl->tpl_vars['categoryAA'] = $__foreach_categoryAA_3_saved;
}
$_smarty_tpl->smarty->ext->_foreach->restore($_smarty_tpl);
?>
																		</div>
																	</div>
																</div>
															</ol>
															<?php }?>
														<?php }?>
													<?php
$_smarty_tpl->tpl_vars['fooo'] = $__foreach_fooo_2_saved;
}
$_smarty_tpl->smarty->ext->_foreach->restore($_smarty_tpl);
?>
												</li>
												<?php }?>
											<?php
$_smarty_tpl->tpl_vars['foo'] = $__foreach_foo_0_saved;
}
$_smarty_tpl->smarty->ext->_foreach->restore($_smarty_tpl);
?>	
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
<?php $_smarty_tpl->_subTemplateRender("file:footer.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array(), 0, false);
}
}
