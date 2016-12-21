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
		
		<div class="container">
			<div class="row anno_list"> 
				{foreach from=$newsList item=news}
				<p>-{$news.seo_title}</p>
				{/foreach}
	
	
			</div>  
		</div>
		
		
		
		</div>
		
	</div>
</div>





{include file='footer.tpl'}