{include file='header.tpl' title=$ik.seo_title desc=$ik.seo_description keyw=$ik.seo_keyword}

<div class="container top_space">
	<div class="row">  
		{if ! empty($ik.photo)}			
		<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12"> 
			<img style="height: 215px; object-fit: cover; width: 100%;" class="img-responsive" src="{$settings.site_url}/upload/photo/{$scope.photo}" alt=""> 
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
		
		<div class="container">
			<div class="row"> 
				{foreach from=$newsList item=news}
				<div class="row social_row">
					<div class="col-lg-3 col-md-3 col-sm-3 col-xs-12"> 
						<a href="makaleler/detay/{$news.sef}-{$news.id}"><img style="height: 170px; object-fit: cover; width: 100%;" alt="{$news.title}" src="{if empty($news.photo)}http://www.placehold.it/800x550/f06905/ffffff&amp;text=+{else}upload/photo/{$news.photo}{/if}" class="img-responsive"></a>  
					</div>
					
					<div class="col-lg-9 col-md-9 col-sm-9 col-xs-12">
					<div class="social_p_title"><a href="makaleler/detay/{$news.sef}-{$news.id}"> {$news.title}</a></div>
					<div class="social_p_desc">{$news.content|strip_tags|mb_substr:0:550}... <a href="makaleler/detay/{$news.sef}-{$news.id}">> Devamını oku</a></div>
					</div> 
				</div>
				{/foreach}
	
	
			</div>  
		</div>
		
		
		
		</div>
		
	</div>
</div>





{include file='footer.tpl'}