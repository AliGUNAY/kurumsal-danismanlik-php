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
		
		<ul id="myTab" class="nav nav-tabs nav-justified dusunce_tabs">
		  <li class="active"><a href="#bireysel" data-toggle="tab" aria-expanded="true">Bireysel</a></li>
		  <li class=""><a href="#kurumsal" data-toggle="tab" aria-expanded="false">Kurumsal</a></li> 
		</ul>
		
		
		<div id="myTabContent" class="tab-content">
			<div class="tab-pane fade active in" id="bireysel">
				<div class="page_desc">
	
					{foreach from=$thoughts item=news}	
						{if $news.tip eq 1}
						<blockquote class="blockquote-icon">
								  <p>{$news.title}</p>
								  <p class="text-right m15"><strong>{$news.name}</strong>  - {$function->formatdate($news.date)}</p>
						</blockquote>
						{/if}
					{/foreach}


				</div>  
			</div>
			
			
			<div class="tab-pane fade" id="kurumsal">
				<div class="page_desc">
			
				{foreach from=$thoughts item=news}
					{if $news.tip eq 2}
					<blockquote class="blockquote-icon">
							  <p>{$news.title}</p>
							  <p class="text-right m15"><strong>{$news.name}</strong>  - {$function->formatdate($news.date)}</p>
					</blockquote>
					{/if}
				{/foreach}
				</div>  
			</div>
		</div>
		
		
		</div>
		
	</div>
</div>





{include file='footer.tpl'}