{include file='header.tpl' title=$kategori.seo_title desc=$kategori.seo_description keyw=$kategori.seo_keyword}


		
		<div class="container top_space">
			<div class="row">  
				{if ! empty($kategori.photo)}			
				<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12"> 
					<img class="img-responsive" src="{$settings.site_url}/upload/photo/{$kategori.photo}" alt=""> 
				</div> 
				{/if}

				<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12"> 
					<ol class="breadcrumb">
					<li><a href="{$settings.site_url}">Anasayfa</a></li>
					<li><a href="{$settings.site_url}/hizmetlerimiz">Hizmetlerimiz</a></li>
					<li class="active">{$kategori.seo_title}</li>
					</ol> 
				</div> 
			</div>
		</div>
		<!---
		<div class="container ser_st_tab">
			<div class="row">  
			<div class="col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-10 col-sm-offset-1 col-xs-12">  
			<div class="row"> 
			{foreach from=$kategoriler  item=kategori}
				{if $kategori.ustkategori eq 0}
				<div class="col-lg-3 col-md-3 col-sm-3 col-xs-6"><a href="../{$kategori.sef}-{$kategori.id}"> {$kategori.title}</a> </div>  
				{/if}
			{/foreach}
			</div>
			</div>
			</div>
		</div>
		
		<div class="container ser_st_tab">
			<div class="row">  
			<div class="col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-10 col-sm-offset-1 col-xs-12">  
			<div class="row">  
				<div class="col-lg-3 col-md-3 col-sm-3 col-xs-6"><a href="../../hizmetlerimiz/bireysel-danismanlik-11"> BİREYSEL<br>DANIŞMANLIK</a> </div>  
				<div class="col-lg-3 col-md-3 col-sm-3 col-xs-6"><a href="../../hizmetlerimiz/kurumsal-danismanlik-12"> KURUMSAL<br>DANIŞMANLIK</a></div>  
				<div class="col-lg-3 col-md-3 col-sm-3 col-xs-6"><a href="../../hizmetlerimiz/ogrenci-ogretmen-okul-danismanligi-13"> ÖĞRENCİ-ÖĞRETMEN<br>OKUL DANIŞMANLIĞI</a></div>  
				<div class="col-lg-3 col-md-3 col-sm-3 col-xs-6"><a href="../../hizmetlerimiz/kisisel-gelisim-egitimleri-sertifikali-projeler-14"> KİŞİSEL GELİŞİM EĞİTİMLERİ<br>SERTİFİKALI PROJELER</a></div>  
			</div>
			</div>
			</div>
		</div>
		--->
		
		
		<br /><br />
		
		
		<div class="container">
			<div class="row">   
				<div class="col-lg-12">
				
				<div class="page_title">{$kategori.seo_title}</div>
				<div class="page_desc"> 
				
					{$kategori.content}
				
				</div>
				</div>
				
			</div>
		</div>

{include file='footer.tpl'}