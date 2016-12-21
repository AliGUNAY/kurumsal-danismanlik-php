  <footer class="footer"> 
	<div class="container">
		<div class="row">
			<div class="col-lg-5 col-md-5 col-sm-5 col-xs-12">
			<div class="footer_title"><strong>S KONSEPT</strong> DANIŞMANLIK</div>
			
			<ul class="footer_menu">
			
			<li><a href="hakkimizda">Hakkımızda</a></li>
			<li><a href="galeri">Galeri</a></li>
			<li><a href="ik">İnsan Kaynakları</a></li>
			<li><a href="referanslar">Referanslar</a></li>
			<li><a href="sosyalprojeler">Sosyal Projeler</a></li>
			<li><a href="iletisim">İletişim</a></li>
			
			</ul>

			
			</div>
			<div class="col-lg-4 col-md-4 col-sm-4 col-xs-12"> 
			<address>
			<p>Adres: {$settings.sirketadres}</p>
			<br/>
			<p>Tel: {$settings.sirkettelefon}</p>
			<p>Gsm:	{$settings.sirketgsm}</p>
			<p>E-posta:	{$settings.sirketmail}</p> 
			</address>
 

			</div>
			<div class="col-lg-3 col-md-3 col-sm-3 col-xs-12">
			
			<div class="social">
			{if !empty({$settings.facebook})}<a target="_blank" href="{$settings.facebook}"><img src="{$themelink}/img/social/fb.png" alt=""/></a>{/if}
			{if !empty({$settings.twitter})}<a target="_blank" href="{$settings.twitter}"><img src="{$themelink}/img/social/tw.png" alt=""/></a>{/if}
			{if !empty({$settings.instagram})}<a target="_blank" href="{$settings.instagram}"><img src="{$themelink}/img/social/in.png" alt=""/></a> {/if}
			</div>


			</div>
		</div>
	</div>
</footer> 
 
 
<div class="modal fade flip-effect" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true">
	<div class="modal-dialog">
	  <div class="modal-content">
		<div class="modal-header">
		  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
		  <h4 class="modal-title" id="mySmallModalLabel">Online Randevu</h4>
		</div>
		<div class="modal-body"> 
		<div class="row">  
		<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">  
				<form role="form" class="form-horizontal forum" id="nod-example" action="iletisim" method="post" enctype="multipart/form-data"> 
					<div class="form-group">
						<div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
							<label for="nod-username" class="col-lg-12 control-label">İsim</label>
						</div>
						<div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
							<input type="text" class="form-control" id="nod-username" placeholder="Adınız">
						</div>
						<div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
							<input type="text" class="form-control" id="nod-surname" placeholder="Soyadınız">
						</div> 			
					</div> 
					<div class="form-group">
						<div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
							<label for="nod-username" class="col-lg-12 control-label">E-Posta</label>
						</div>
						<div class="col-lg-8 col-md-8 col-sm-8 col-xs-12">
							<input type="email" class="form-control" id="nod-email" placeholder="ör:isim@mail.com">
						</div> 			
					</div> 
					<div class="form-group">
						<div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
						<label for="nod-tel" class="col-lg-12 control-label">Telefon Numarası</label>
						</div>
						<div class="col-lg-2 col-md-2 col-sm-2 col-xs-12">
						<input type="text" class="form-control" id="nod-tel1" placeholder="(xxx)">
						</div>
						<div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
						<input type="text" class="form-control" id="nod-tel2" placeholder="(xxxxxxx)">
						</div>			
					</div> 
					<div class="form-group">
						<div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
						<label for="nod-tel" class="col-lg-12 control-label">Tarih</label>
						</div>
						<div class="col-lg-8 col-md-8 col-sm-8 col-xs-12">
						<input type="text" class="form-control" id="datepicker" placeholder="Gün-Ay-Yıl">
						</div> 		
					</div> 
					<div class="form-group"> 
						<div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
						<label for="nod-tel" class="col-lg-12 control-label">Zaman</label>
						</div>  
						<div class="col-lg-3 col-md-3 col-sm-3 col-xs-12">
							<select class="kd-select" id="nod-select">
								<option>Saat</option> 
								<option>1</option> 
								<option>2</option> 
								<option>3</option> 
								<option>4</option> 
							  </select>
						</div> 
						<div class="col-lg-3 col-md-3 col-sm-3 col-xs-12">
							<select class="kd-select" id="nod-select">
								<option>Dakika</option> 
								<option>00</option> 
								<option>01</option> 
								<option>02</option> 
								<option>03</option> 
								<option>04</option> 
							  </select>
						</div> 
						<div class="col-lg-2 col-md-2 col-sm-2 col-xs-12">
							<select class="kd-select" id="nod-select">
								<option>AM</option>  
								<option>PM</option>  
							  </select>
						</div> 
					</div> 
					<div class="form-group">
						<div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
						<label for="nod-tel" class="col-lg-12 control-label">Mesaj</label>
						</div>
						<div class="col-lg-8 col-md-8 col-sm-8 col-xs-12">
							<textarea rows="5" style="width:100%"></textarea>
						</div> 		
					</div> 
					<div class="form-group">
						<div class="text-center">
						<button type="submit" class="btn btn-inverse">GÖNDER</button>
						</div>
					</div> 
				</form>  
			</div>
			</div>
		  </div><!-- /.modal-content -->
		</div><!-- /.modal-dialog -->
	  </div> 
	</div>
 
	<script src="{$themelink}/js/bootstrap.min.js"></script> 
	<script src="{$themelink}/js/extended.js"></script> 
	<script src="{$themelink}/js/jquery.bootstrap.newsbox.min.js"></script> 
	<script> 
		extended = new Extended();
		 // testimonial
		$('#testimonial').owlCarousel({
			autoPlay: 5000,
			items : 1, 
			itemsDesktop      : [1199,1],
			itemsDesktopSmall     : [979,1],
			itemsTablet       : [768,1],
			itemsMobile       : [479,1],
		});   
		//vertical-text-slider
		$(function () { 
			$("#v_t_slider").bootstrapNews({
				newsPerPage: 10,
				autoplay: true,
				direction: 'up',
				navigation: false,
				newsTickerInterval: 2500,
				onToDo: function () {
					//console.log(this);
				}
			});
		});
		//Popup
		$('.img-lightbox').magnificPopup({
			type:'image',
			titleSrc: 'title',
			tLoading: 'Loading image #%curr%...',
			gallery: {
				enabled: true,
				navigateByImgClick: true,
				preload: [0,1] // Will preload 0 - before current, and 1 after the current image
			}
		});
		$('.popup-iframe').magnificPopup({
			disableOn: 700,
			type: 'iframe',
			mainClass: 'mfp-fade',
			removalDelay: 160,
			preloader: false
        });
		
		$('.popup-modal').magnificPopup({
			disableOn: 700,
			type: 'inline',
			mainClass: 'mfp-fade',
			removalDelay: 160,
			preloader: false
        });
		
		// Nod!
		var metrics = [
		[ '#nod-username, #nod-surname, #nod-email, #nod-tel1, #nod-tel2, #datepicker', 'presence', 'Boş Geçilemez' ],
		[ '#nod-tel1', 'integer', 'Sadece Rakam Giriniz' ],
		[ '#nod-tel2', 'integer', 'Sadece Rakam Giriniz' ], 
		[ '#nod-email', 'email', 'Hatalı Mail Adresi Girdiniz.' ], 
		];
		$('#nod-example').nod(metrics, {
		errorClass: 'label red'
		}); 
		//datapicker
		$( function() {
		$( "#datepicker" ).datepicker();
		} );
	</script>
	<script src="https://code.jquery.com/ui/1.12.0/jquery-ui.js"></script>
	<script src="https://raw.githubusercontent.com/jquery/jquery-ui/master/ui/i18n/datepicker-tr.js"></script>
	<link rel="stylesheet" href="//code.jquery.com/ui/1.12.0/themes/base/jquery-ui.css">
	
	
	<!---
		Developer: Ahmet ÖZALP
	--->
</body>
</html>