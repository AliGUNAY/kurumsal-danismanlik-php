//* login giriş formu
$(document).ready(function() {
	$("body").on("submit", ".forumum", function(e){
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
				$("#bilgikutusu").html("<div class=\"alert alert-danger-light fade in\"> <p>"+ obj.message +"</p> </div>");
			}
		});
	});

	$(".veriyikaydet").submit(function() {
		$("#loading").show();
	});
	
	$(".veriyikaydet").ajaxForm(function(res){
		var obj = jQuery.parseJSON(res);
		if(obj.status == 1){
			swal("Harika!", ""+ obj.message +"", "success");
			setTimeout(function(){
				location.reload();
			}, 3000);
		}else {
			swal("Error!", ""+ obj.message +"", "error");
		}
		$("#loading").hide();
	});

	
	$("body").on("submit", ".verikaydet", function(e){
		e.preventDefault();
		$(".verikaydet").ajaxForm({
			beforeSerialize: function(form, options) { 
		  for (instance in CKEDITOR.instances)
				$("#loading").show();
				CKEDITOR.instances[instance].updateElement();
		},
			success: function(res) {
				var obj = jQuery.parseJSON(res);
				if(obj.status == 1){
					swal("Harika!", ""+ obj.message +"", "success");
					if(obj.yonlendir == ""){
						location.reload();
					}else {
						setTimeout(function(){
							window.location=obj.yonlendir;
						}, 2000);
					}
					
				}else {
					swal("Error!", ""+ obj.message +"", "error");
				}
				$("#loading").hide();
			}
		});
	});
	$(".verikaydet").submit();
	
	
	$(".popupkaydet").ajaxForm(function(res){
		var obj = jQuery.parseJSON(res);
		if(obj.status == 1){
			swal("Harika!", ""+ obj.message +"", "success");
			setTimeout(function(){
				window.location=obj.yonlendir;
			}, 2000);
		}else {
			swal("Error!", ""+ obj.message +"", "error");
		}
		
	});
	
	
	
	$("body").on("click", ".divtikla", function(e){
		e.preventDefault();
		var link = $(this).attr("href");
		swal({
			title: "Eminmisiniz?",
			text: "Bu veri silinicektir.Silindikden sonra işlem geri alınamaz!",
			type: "warning",
			showCancelButton: true,
			confirmButtonColor: "#DD6B55",
			confirmButtonText: "Evet, Sil!",
			cancelButtonText: "Vazgeçtim",
			closeOnConfirm: false,
			closeOnCancel: false
		}, function(isConfirm) {
			if (isConfirm) {
				$.ajax({
					type: 'GET',   //post olarak belirledik
					url: link,  //formdaki verilerin gideceği adres
					success: function(gelen) {
						var obj = jQuery.parseJSON(gelen);
						if(obj.status == 1){
							swal("Silindi!", ""+obj.message+"", "success");
							setTimeout(function(){
								location.reload();
							}, 2000);
						}else {
							swal("Hata!", ""+obj.message+"", "error");
						}
					}
				});	
				
			} else {
				swal("İptal Edildi", "İşlem iptal edildi.", "error");
			}
		});
	});
	
	$("body").on("click", ".status", function(e){
		e.preventDefault();
		var id = $(this).attr("data-id");
		var name = $(this).attr("data-name");
		$.ajax({
			type: 'GET',
			url: "index.php?page="+$(this).attr("data-database"),
			data: {status:$(this).attr("data-status"),id:id},
			success: function(gelen) {
				var obj = jQuery.parseJSON(gelen);
				if(obj.status == 1){
					if(obj.message == 0){
						$('*[data-id="'+id+'"]').attr("class", "btn btn-primary btn-xs status" );
						$('*[data-id="'+id+'"]').attr("data-status", "0");
						
						$.gritter.add({
							title: '"'+name+'" aktifleştirildi.</a>',
							text: 'İşlem kaydedildi sayfa yenilenmeyecektir işleme devam edebilirsiniz!',
							class_name: 'gritter-light'
						});
						
						
					}else {
						$('*[data-id="'+id+'"]').attr("class", "btn btn-danger btn-xs status" );
						$('*[data-id="'+id+'"]').attr("data-status", "1");
						
						$.gritter.add({
							title: '"'+name+'" pasifleştirildi.</a>', 
							text: 'İşlem kaydedildi sayfa yenilenmeyecektir işleme devam edebilirsiniz!',
							class_name: 'gritter-light'
						});
						
					}
				}
			}
		});	
	});
	
	
	function listele(imgsrc){
		var html = '<div class="thumbnail-hover thumbnail-fade">';
		html += '<div class="caption" style="display: none;">';
		html += '<p><br/>Resmi Büyüt</p>';
		html += '</div>';
		html += '<img style="100%;height: 300px; object-fit: cover;" src="'+imgsrc+'" class="img-responsive img-thumbnail">';
		html += '<div class="pic-caption rotate-in pic-icon">';
		html += '<span class="btn btn-success btn-lg resimsil" data-image="'+imgsrc+'"><i class="fa fa-trash"></i></span>';
		html += '</div>';
		html += '</div>';
		
		return html;
	}
	
	
	function cleaner(videos, id) {
		var obj = jQuery.parseJSON(videos);
		for (var i = 0; i < obj.gallery.length; i++) {
			var cur = obj.gallery[i];
			if (cur.url == id) {
				obj.gallery.splice(i, 1);
				$("#json").val(JSON.stringify(obj));
				$("#jsons").val(JSON.stringify(obj));
				break;
			}
		}
	}
	
	$("body").on("click", ".resimsil", function(e){
		e.preventDefault();
		var veri = $(this).attr("data-image");
		swal({
			title: "Resim Silinsin mi?",
			text: "Silinen resim tekrar geri getirilemez!",
			type: "warning",
			showCancelButton: true,
			confirmButtonColor: '#DD6B55',
			confirmButtonText: 'Sil',
			closeOnConfirm: false
		},
		function(){
			$.ajax({
				type: "GET",
				url: 'index.php?page=func/gallery/delete',
				data: 'data='+veri,
				success: function(x){
					var obj = jQuery.parseJSON(x);
					if(obj.deleteStatus == 1){
						$('div[data-image="'+veri+'"]').remove();
						$('.bs-modal-sm').modal('hide');
						console.log(veri);
						//*json'dan silinicektir
						cleaner($("#jsons").val(), veri);
						cleaner($("#json").val(), veri);
						
						swal("Silindi!", "Başarılı bir şekilde kaldırıldı!", "success");
					}else {
						swal("Hata!", ""+obj.message+"", "error");
					}
				}
			});
			swal("Silindi!", "Başarılı bir şekilde kaldırıldı!", "success");
		});
	});
	
	$("body").on("click", ".kaldirresmi", function(e){
		$('#photoReset').attr( 'checked', 'checked' );
		$('.fileinput-new img').attr('src', '../upload/photo/no-banner.jpg');
	});
	
	
	var url = 'index.php?page=func/gallery/upload';
	$('#fileupload').fileupload({
		url: url,
		dataType: 'json',
		done: function (e, data) {
			if(data.result.upStatus == 1){
				$.each(data.result.files, function (index, file) {

					$('<div class="col-md-4 pic" data-image="'+file.url+'" style="margin-bottom:10px">').html(listele(file.url)).appendTo('#files');
					var textareaData = $("#json").val(); //* Databaseden geen textarea datası
					var textareauzunluk = textareaData.length;
					var textareaSubstr = textareaData.substr(0, textareauzunluk-2);
					var myString = JSON.stringify(file); //* post'dan sonra gelen json datasını objelikden çıkarıyor
					
					if(textareaSubstr.indexOf('url') != -1){
						textareaSubstr += ","+myString+"]}"; //* textarea içine aktarıyorum
					}else {
						textareaSubstr += myString+"]}"; //* textarea içine aktarıyorum
					}
					
					$("#json").val(textareaSubstr);
					
					
					//* Yükledikden sonra sql e formu gonder
					$(".verikaydet").ajaxForm(function(res){
						var obj = jQuery.parseJSON(res);
						if(obj.status == 1){
							//swal("Harika!", ""+ obj.message +"", "success");
						}else {
							//swal("Fotoğraf Kaydedilmedi!!", ""+ obj.message +"", "error");
						}
						
					});
					$('.verikaydet').trigger('submit');
					
					
				});
			}else {
				swal("İptal Edildi", ""+data.result.upMessage+"", "error");
			}
			
		},
		progressall: function (e, data) {
			var progress = parseInt(data.loaded / data.total * 100, 10);
			$('#progress .progress-bar').css(
				'width',
				progress + '%'
			);
		}
	}).prop('disabled', !$.support.fileInput).parent().addClass($.support.fileInput ? undefined : 'disabled');
			
			
	
	
	//* Div Select
	$('.kutusec').bind('click', function() {
        $('.kutusec').removeClass('active').filter($(this)).addClass('active');
		$("#template").val($(this).attr("id"));
    });
	
	
	$.fn.editable.defaults.mode = 'popup';
	
	$("body").on("click", ".editle", function(e){
		e.preventDefault();
		var id = $(this).attr("id");
		var menuid = $(this).attr("data-menuid");
		$('#'+id).editable( {
			type: 'text',
			ajaxOptions: { dataType: "json" },
			success: function(response, newValue) {
				$("#"+menuid+"menuadi").val(newValue);
				$("#"+menuid+"menu a span").text(newValue);
			}
		});
		
	});
	
	$( ".kategoritipi select[name='categorys[]']" ).on('change', function() {
		if($( ".kategoritipi select[name='categorys[]']" ).val()){
			$.each($( ".kategoritipi select[name='categorys[]']" ).val(), function(i, v) {
				if (v === "21") {
					$("#resimgaleri").show();
					$("#tip").show();
				}else {
					$("#resimgaleri").hide();
					$("#tip").hide();
				}
			});
		}else {
			$("#resimgaleri").hide();
			$("#tip").hide();
		}
	});
	
	$("#tip input[name='tip']").on('change', function() {
		if($("#tip input[name='tip']:checked").val() == 1){
			$("#resimgaleri").show();
			$("#videogaleri").hide();
		}else if($("#tip input[name='tip']:checked").val() == 2){
			$("#resimgaleri").hide();
			$("#videogaleri").show();
		}else {
			$("#resimgaleri").hide();
			$("#videogaleri").hide();
			$("#tip").hide();
		}
	});
	
	function listeleembed(imgsrc){
		var html = '<div class="thumbnail-hover thumbnail-fade">';
		html += '<div class="caption" style="display: none;">';
		html += '<p><br/>Resmi Büyüt</p>';
		html += '</div>';
		html += '<img style="100%;height: 300px; object-fit: cover;" src="http://i1.ytimg.com/vi/'+imgsrc+'/sddefault.jpg" class="img-responsive img-thumbnail">';
		html += '<div class="pic-caption rotate-in pic-icon">';
		html += '<span class="btn btn-success btn-lg resimsil" data-image="'+imgsrc+'"><i class="fa fa-trash"></i></span>';
		html += '</div>';
		html += '</div>';
		
		return html;
	}
	
	
	$(".embedkaydet").ajaxForm(function(res){
		var obj = jQuery.parseJSON(res);
		if(obj.upStatus == 1){
			$('#myModal').modal('hide');
			$('#embedinput').val("");
			$.each(obj.files, function (index, file) {
				$('<div class="col-md-4 pic" data-image="'+file.url+'" style="margin-bottom:10px">').html(listeleembed(file.url)).appendTo('#filess');
				var textareaData = $("#jsons").val(); //* Databaseden geen textarea datası
				var textareauzunluk = textareaData.length;
				var textareaSubstr = textareaData.substr(0, textareauzunluk-2);
				var myString = JSON.stringify(file); //* post'dan sonra gelen json datasını objelikden çıkarıyor
				
				if(textareaSubstr.indexOf('url') != -1){
					textareaSubstr += ","+myString+"]}"; //* textarea içine aktarıyorum
				}else {
					textareaSubstr += myString+"]}"; //* textarea içine aktarıyorum
				}
				
				$("#jsons").val(textareaSubstr);
			});
			
			
		}else {
			swal("Error!", ""+ obj.upMessage +"", "error");
		}
		
	});
	$('#sortable').sortable({
		axis: 'y',
		update: function (event, ui) {
			var data = $(this).sortable('serialize');
			var page = $(this).attr("data-page");
			$.ajax({
				data: data,
				type: 'POST',
				url: 'index.php?page='+page 
			});
			
			$("#siralamakaydet").click()
		}
	});
	
	$('#sortablecategory').sortable({
		axis: 'y',
		update: function (event, ui) {
			var data = $(this).sortable('serialize');
			var page = $(this).attr("data-page");
			$.ajax({
				data: data,
				type: 'POST',
				url: 'index.php?page='+page 
			});
			
			$("#siralamakaydet").click()
		}
	});
	
	$('#siralamakaydet').click(function(){
		$.gritter.add({
			title: 'Listeleme kaydedildi.</a>',
			text: 'Sıralama işlemi kaydedildi sayfa yenilenmeyecektir işleme devam edebilirsiniz!',
			class_name: 'gritter-light'
		});

		return false;
	});

});



	function menugoster(div){
		if ($('#'+div+'checkbox').is(':checked')) {
			 $("#"+div+"menu").show();
		} else {
			 $("#"+div+"menu").hide();
		} 
	}
	
	function editMenu(divadi){
		alert(divadi);
		$('#'+divadi+'edit').editable({
			type: 'text',
			success: function(response, newValue) {
				alert(newValue);
			}
		});
	}
	
	
	//* Tarih
	!function ($) {
		$(function() {
			$('#datetimepicker1').datetimepicker({
				language: 'en',
				pickTime: false,
				autoclose: true
			});
		});
	}(window.jQuery);
	
	

	
	
	
	//* ckeditor ayarları
	CKEDITOR.replace('ckeditor',{
		filebrowserBrowseUrl:'../system/ckeditor/fileupload/index.html', // Öntanımlı Dosya Yöneticisi
		filebrowserImageBrowseUrl:'../system/ckeditor/fileupload/index.html?type=image', // Sadece Resim Dosyalarını Gösteren Dosya Yöneticisi
		removeDialogTabs: 'link:upload;image:upload' // Upload işlermlerini dosya Yöneticisi ile yapacağımız için upload butonlarını kaldırıyoruz
	});
	
	CKEDITOR.editorConfig = function( config ) {
		config.extraPlugins = 'youtube';
		config.skin = 'icy_orange';
		config.language = 'tr'; //CKEDITOR arayüz dili
		config.uiColor = '#9AB8F3';// CKEDITOR arayüz rengi
		config.colorButton_colors = '000000,FF0000,00FF00,0000FF';//yazı renk butonunun renkleri
		config.colorButton_enableMore = false; //belirtilenler dışında renk  seçimini  engelleme
		config.contentsLanguage = 'tr';//Editör içeriği oluşturmak için kullanılan yazı dilinin dil kodu.
		 
		//Dosya Yöneticisi
		config.filebrowserBrowseUrl = '/fileman/index.html';// Öntanımlı Dosya Yöneticisi
		config.filebrowserImageBrowseUrl = '/fileman/index.html?type=image'; // Sadece Resim Dosyalarını Gösteren Dosya Yöneticisi
		config.removeDialogTabs = 'link:upload;image:upload'; // Upload işlermlerini dosya Yöneticisi ile yapacağımız için upload butonlarını kaldırıyoruz
		//---------

		//Youtube Yöneticisi
		
		
		
	};
	
	