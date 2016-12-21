{include file='header.tpl' title=$about.seo_title desc=$about.seo_description keyw=$about.seo_keyword}

<div class="container top_space">
	<div class="row">  
		{if ! empty($about.photo)}			
		<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12"> 
			<img class="img-responsive" src="{$settings.site_url}/upload/photo/{$about.photo}" alt=""> 
		</div> 
		{/if} 
		
		<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12"> 
			<ol class="breadcrumb">
			<li><a href="{$settings.site_url}">Anasayfa</a></li> 
			<li class="active">{$about.seo_title}</li>
			</ol> 
		</div>  
		
		<div class="col-lg-12">
		
		<div class="page_title"> {$about.seo_title}</div>
		<div class="page_desc">
			{$about.content}
		</div>
		</div>
		
	</div>
</div>





{include file='footer.tpl'}