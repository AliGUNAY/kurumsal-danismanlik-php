{include file='header.tpl' title=$services.seo_title desc=$services.seo_description keyw=$services.seo_keyword}

<div class="container top_space">
	<div class="row">  
		<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12"> 
			<img class="img-responsive" src="upload/photo/{$services.photo}" alt="" /> 
		</div>  
		
		<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12"> 
			<ol class="breadcrumb">
			<li><a href="{$settings.site_url}">Anasayfa</a></li> 
			<li class="active">{$services.seo_title}</li>
			</ol> 
		</div>  
		<!---
		<div class="container ser_st_tab">
			<div class="row">  
			<div class="col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-10 col-sm-offset-1 col-xs-12">  
			<div class="row"> 
			{foreach from=$kategoriler  item=kategori}
				{if $kategori.ustkategori eq 0}
				<div class="col-lg-3 col-md-3 col-sm-3 col-xs-6"><a href="hizmetlerimiz/{$kategori.sef}-{$kategori.id}"> {$kategori.title}</a> </div>  
				{/if}
			{/foreach}
			</div>
			</div>
			</div>
		</div>
		--->
		<div class="container ser_st_tab">
			<div class="row">  
			<div class="col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-10 col-sm-offset-1 col-xs-12">  
			<div class="row">  
				<div class="col-lg-3 col-md-3 col-sm-3 col-xs-6"><a href="hizmetlerimiz/bireysel-danismanlik-11"> BİREYSEL<br>DANIŞMANLIK</a> </div>  
				<div class="col-lg-3 col-md-3 col-sm-3 col-xs-6"><a href="hizmetlerimiz/kurumsal-danismanlik-12"> KURUMSAL<br>DANIŞMANLIK</a></div>  
				<div class="col-lg-3 col-md-3 col-sm-3 col-xs-6"><a href="hizmetlerimiz/ogrenci-ogretmen-okul-danismanligi-13"> ÖĞRENCİ-ÖĞRETMEN<br>OKUL DANIŞMANLIĞI</a></div>  
				<div class="col-lg-3 col-md-3 col-sm-3 col-xs-6"><a href="hizmetlerimiz/kisisel-gelisim-egitimleri-sertifikali-projeler-14"> KİŞİSEL GELİŞİM EĞİTİMLERİ<br>SERTİFİKALI PROJELER</a></div>  
			</div>
			</div>
			</div>
		</div>
		
		<div class="col-lg-12">
			<div class="page_title"> {$services.seo_title}</div>		
		</div>
		
		
		
	</div>
</div>

<div class="container">
	<div class="row">  
		<div class="text-center col-lg-12 col-md-12 col-sm-12 col-xs-12"> 
			<div class="row"> 
				{foreach from=$kategoriler  item=kategori}
					{if $kategori.ustkategori eq 0}
					<div class="col-lg-6 col-md-6 col-sm-6 col-xs-12"> 
						<a href="hizmetlerimiz/{$kategori.sef}-{$kategori.id}"><img class="img-responsive" src="{if empty($kategori.photo)}http://www.placehold.it/800x550/f06905/ffffff&amp;text=+{else}upload/photo/{$kategori.photo}{/if}" alt=""></a>
						<div class="page_sub_title"><a href="hizmetlerimiz/{$kategori.sef}-{$kategori.id}">{$kategori.title}</a></div>
						<div class="page_sub_desc">{$kategori.content|substr:0:250}</div> 
					</div>
					{/if}
				{/foreach}
			</div>
		</div>  
	</div>
</div>





{include file='footer.tpl'}