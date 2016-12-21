{include file='header.tpl' title=$ik.seo_title desc=$ik.seo_description keyw=$ik.seo_keyword}

<div class="container top_space">
	<div class="row">  
		{if ! empty($ik.photo)}			
		<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12"> 
			<img class="img-responsive" src="{$settings.site_url}/upload/photo/{$ik.photo}" alt=""> 
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
		
		<div class="text-center col-lg-12 col-md-12 col-sm-12 col-xs-12"> 
			 
			<div class="row"> 
			<div class="row">
			{if !empty($newsList)}
				{foreach from=$newsList item=news}
				<div class="col-lg-4 col-md-4 col-sm-4 col-xs-12"> 
					<a href="galeri/detay/{$news.sef}-{$news.id}"><img style="    width: 100%;object-fit: fill;" class="img-responsive" src="{if empty($news.photo)}http://www.placehold.it/800x550/f06905/ffffff&amp;text=+{else}upload/photo/{$news.photo}{/if}" alt=""></a>
					<div class="page_sub_title"><a href="galeri/detay/{$news.sef}-{$news.id}"> {$news.seo_title}</a></div> 
				</div>
				{/foreach}
			{else}
				<center>İçerik bulunamadı</center>
			{/if}
	</div>  
			</div>  
		</div>
		
		
		
		</div>
		
	</div>
</div>





{include file='footer.tpl'}