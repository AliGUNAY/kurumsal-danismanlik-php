<?php
/* Smarty version 3.1.30-dev/18, created on 2016-07-18 15:34:00
  from "/home/goxskons/public_html/theme/default/pages/iletisim.tpl" */

if ($_smarty_tpl->_decodeProperties($_smarty_tpl, array (
  'has_nocache_code' => false,
  'version' => '3.1.30-dev/18',
  'unifunc' => 'content_578cccb8c0eac6_12915269',
  'file_dependency' => 
  array (
    'e39e97cb9ab0d717242e8966630a128b149c9cf1' => 
    array (
      0 => '/home/goxskons/public_html/theme/default/pages/iletisim.tpl',
      1 => 1468844073,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
    'file:header.tpl' => 1,
    'file:footer.tpl' => 1,
  ),
),false)) {
function content_578cccb8c0eac6_12915269 ($_smarty_tpl) {
$_smarty_tpl->_subTemplateRender("file:header.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array('title'=>$_smarty_tpl->tpl_vars['ik']->value['seo_title'],'desc'=>$_smarty_tpl->tpl_vars['ik']->value['seo_description'],'keyw'=>$_smarty_tpl->tpl_vars['ik']->value['seo_keyword']), 0, false);
?>


<div class="container top_space">
	<div class="row">  
		<?php if (!empty($_smarty_tpl->tpl_vars['ik']->value['photo'])) {?>			
		<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12"> 
			<img class="img-responsive" src="<?php echo $_smarty_tpl->tpl_vars['settings']->value['site_url'];?>
/upload/photo/<?php echo $_smarty_tpl->tpl_vars['scope']->value['photo'];?>
" alt=""> 
		</div> 
		<?php }?>
		
		<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12"> 
			<ol class="breadcrumb">
			<li><a href="<?php echo $_smarty_tpl->tpl_vars['settings']->value['site_url'];?>
">Anasayfa</a></li> 
			<li class="active"><?php echo $_smarty_tpl->tpl_vars['ik']->value['seo_title'];?>
</li>
			</ol> 
		</div>  
		
		<div class="col-lg-12">
		 
		<div class="page_title"> <?php echo $_smarty_tpl->tpl_vars['ik']->value['seo_title'];?>
</div>
		<div class="page_desc">
			
			<br />
			<div class="container">
				<div class="row">  
					<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12"> 
							
						<div id="canvas" style="height: 360px;width:100%"></div>
						<?php echo '<script'; ?>
 src="//maps.google.com/maps/api/js?sensor=false"><?php echo '</script'; ?>
>
						<?php echo '<script'; ?>
>
							var myZoom = 14;
							var myMarkerIsDraggable = false;
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
			
			
			<div class="container">
	
				<div class="row"> 
					<div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
							<div class="conta_title"> Şirket Bilgileri </div>
							<div class="c_item">
								<strong>Şirket:</strong> 
								<?php echo $_smarty_tpl->tpl_vars['settings']->value['sirket'];?>

							</div>

							<div class="c_item">
								<strong>Adres:</strong> 
								<?php echo $_smarty_tpl->tpl_vars['settings']->value['sirketadres'];?>

							</div>

							<div class="c_item">
								<strong>Tel / Fax:</strong> 
								<?php echo $_smarty_tpl->tpl_vars['settings']->value['sirkettelefon'];?>

							</div>

							<div class="c_item">
								<strong>Gsm:</strong> 
								<?php echo $_smarty_tpl->tpl_vars['settings']->value['sirketgsm'];?>

							</div> 
						  
							<div class="c_item">
								<strong>Mail:</strong> 
								<?php echo $_smarty_tpl->tpl_vars['settings']->value['sirketmail'];?>

							</div>  
					</div>
					<div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
						<div class="conta_title"> İletişim Formu </div>
						<form class="forum" action="iletisim" method="post" enctype="multipart/form-data">
						
							<div id="bilgikutusu"></div>
						
							<div class="form-group">
								<input type="text" name="name" class="form-control" placeholder="Ad Soyad">
							</div>                               
																 
							<div class="form-group">             
								<input type="email" name="email" class="form-control" placeholder="Mail">
							</div>                               
																 
							<div class="form-group">             
								<input type="text" name="number" class="form-control" placeholder="Telefon">
							</div>
																
							<textarea name="mesaj" class="form-control" rows="3" placeholder="Mesaj"></textarea>
							<br>
							
							<button type="submit" class="btn btn-default"> Gönder </button>
						</form>
					</div>

				<?php echo '<script'; ?>
>
				$( document ).ready(function() {
				$("body").on("submit", ".forum", function(e){
					e.preventDefault();
					var form = $(e.target);
					$.post( form.attr("action"), form.serialize(), function(res){
						var obj = jQuery.parseJSON(res);
						if(obj.status == 1){
							$("#bilgikutusu").html("<div class=\"alert alert-success fade in\"> <p>"+ obj.message +"</p> </div>");
							setTimeout(function(){
								location.reload();
							}, 2000);
						}else {
							$("#bilgikutusu").html("<div class=\"alert alert-danger fade in\"> <p>"+ obj.message +"</p> </div>");
						}
					});
				});
				});
				<?php echo '</script'; ?>
>
				
				</div>  
			</div>
		</div>
		</div>
		
	</div>
</div>



<?php $_smarty_tpl->_subTemplateRender("file:footer.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array(), 0, false);
}
}
