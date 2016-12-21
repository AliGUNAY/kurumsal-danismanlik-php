{include file='header.tpl' title=$ik.seo_title desc=$ik.seo_description keyw=$ik.seo_keyword}

<div class="container top_space">
	<div class="row">  
		{if ! empty($ik.photo)}			
		<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12"> 
			<img class="img-responsive" src="{$settings.site_url}/upload/photo/{$scope.photo}" alt=""> 
		</div> 
		{/if}
		
		<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12"> 
			<ol class="breadcrumb">
			<li><a href="{$settings.site_url}">Anasayfa</a></li> 
			<li class="active">{$ik.seo_title}</li>
			</ol> 
		</div>  
		
		<div class="col-lg-12">
		 
		<div class="page_title"> {$ik.seo_title}</div>
		<div class="page_desc">
			
			<br />
			<div class="container">
				<div class="row">  
					<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12"> 
							
						<div id="canvas" style="height: 360px;width:100%"></div>
						<script src="//maps.google.com/maps/api/js?sensor=false"></script>
						<script>
							var myZoom = 14;
							var myMarkerIsDraggable = false;
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
			
			
			<div class="container">
	
				<div class="row"> 
					<div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
							<div class="conta_title"> Şirket Bilgileri </div>
							<div class="c_item">
								<strong>Şirket:</strong> 
								{$settings.sirket}
							</div>

							<div class="c_item">
								<strong>Adres:</strong> 
								{$settings.sirketadres}
							</div>

							<div class="c_item">
								<strong>Tel / Fax:</strong> 
								{$settings.sirkettelefon}
							</div>

							<div class="c_item">
								<strong>Gsm:</strong> 
								{$settings.sirketgsm}
							</div> 
						  
							<div class="c_item">
								<strong>Mail:</strong> 
								{$settings.sirketmail}
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

				<script>
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
				</script>
				
				</div>  
			</div>
		</div>
		</div>
		
	</div>
</div>



{include file='footer.tpl'}