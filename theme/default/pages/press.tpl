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
		
		<div class="col-lg-12">
			<div class="page_title"> {$services.seo_title}</div>		
		</div>
		
		<div class="text-center">{$services.content}<br /></div><br />
		
	</div>
</div>

<div class="container">
	<div class="row">  
		<div class="text-center col-lg-12 col-md-12 col-sm-12 col-xs-12"> 
			<div class="row"> 
				{foreach from=$kategoriler  item=kategori}
					{if $kategori.ustkategori eq 0}
					<div class="col-lg-6 col-md-6 col-sm-6 col-xs-12"> 
						<a href="basindabiz/{$kategori.sef}-{$kategori.id}"><img class="img-responsive" src="{if empty($kategori.photo)}http://www.placehold.it/800x550/f06905/ffffff&amp;text=+{else}upload/photo/{$kategori.photo}{/if}" alt=""></a>
						<div class="page_sub_title"><a href="basindabiz/{$kategori.sef}-{$kategori.id}">{$kategori.title}</a></div>
					</div>
					{/if}
				{/foreach}
			</div>
		</div>  
	</div>
</div>





{include file='footer.tpl'}