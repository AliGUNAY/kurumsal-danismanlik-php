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
		<!--
		<div class="container ser_st_tab">
			<div class="row">  
			<div class="col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-10 col-sm-offset-1 col-xs-12">  
			<div class="row"> 
			{foreach from=$kategoriler  item=kategori}
				{if $kategori.ustkategori eq 0}
				<div class="col-lg-3 col-md-3 col-sm-3 col-xs-6"><a href="{$kategori.sef}-{$kategori.id}"> {$kategori.title}</a> </div>  
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
				<div class="col-lg-3 col-md-3 col-sm-3 col-xs-6"><a href="../hizmetlerimiz/bireysel-danismanlik-11"{if $smarty.get.id eq 11} class="ser_tab_active"{/if}> BİREYSEL<br>DANIŞMANLIK</a> </div>  
				<div class="col-lg-3 col-md-3 col-sm-3 col-xs-6"><a href="../hizmetlerimiz/kurumsal-danismanlik-12"{if $smarty.get.id eq 12} class="ser_tab_active"{/if}> KURUMSAL<br>DANIŞMANLIK</a></div>  
				<div class="col-lg-3 col-md-3 col-sm-3 col-xs-6"><a href="../hizmetlerimiz/ogrenci-ogretmen-okul-danismanligi-13" {if $smarty.get.id eq 13} class="ser_tab_active"{/if}> ÖĞRENCİ-ÖĞRETMEN<br>OKUL DANIŞMANLIĞI</a></div>  
				<div class="col-lg-3 col-md-3 col-sm-3 col-xs-6"><a href="../hizmetlerimiz/kisisel-gelisim-egitimleri-sertifikali-projeler-14" {if $smarty.get.id eq 14} class="ser_tab_active"{/if}> KİŞİSEL GELİŞİM EĞİTİMLERİ<br>SERTİFİKALI PROJELER</a></div>  
			</div>
			</div>
			</div>
		</div>
		
		<br /><br />
		
		<div class="container">
			<div class="row">   
				<div class="col-lg-12">
				
				<div class="page_title">{$kategori.seo_title}</div>
				<div class="page_desc ser_col_b"> 
				
					{$kategori.content}
					
					{if $services neq 0}
						{foreach from=$services key=k item=service}
							<div class="col-lg-4 col-md-4 col-sm-4 col-xs-12"> 
								<a href="detay/{$service.sef}-{$service.id}"><img class="img-responsive" style="height: 150px; object-fit: cover;" src="{if empty($service.photo)}http://www.placehold.it/800x550/f06905/ffffff&amp;text=+{else}{$settings.site_url}/upload/photo/{$service.photo}{/if}" alt=""></a>
								<div class="page_sub_title"><a href="detay/{$service.sef}-{$service.id}">{$service.seo_title}</a></div>
								<div class="page_sub_desc">{if empty($service.content)}  {else} {$service.content|strip_tags|mb_substr:0:129|replace:'&nbsp;':''}. {/if}</div> 
								<div style="clearfix"></div>
							</div>
							{if $k mod 3 eq 2}
							<div class="space"></div> 
							{/if}
						{/foreach}
					{else}	
							<center> İçerik Bulunamadı! </center>
					{/if}
					
				
				</div>
				</div>
				
			</div>
		</div>

{include file='footer.tpl'}