{include file='header.tpl' title=$scope.seo_title desc=$scope.seo_description keyw=$scope.seo_keyword}

<div class="container top_space">
	<div class="row">  
		
		{if ! empty($scope.photo)}			
		<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12"> 
			<img class="img-responsive" src="{$settings.site_url}/upload/photo/{$scope.photo}" alt=""> 
		</div> 
		{/if}
		
		<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12"> 
			<ol class="breadcrumb">
			<li><a href="{$settings.site_url}">Anasayfa</a></li> 
			<li class="active">{$scope.seo_title}</li>
			</ol> 
		</div>  
		
		<div class="col-lg-12">
		
		<div class="page_title"> {$scope.seo_title}</div>
		<div class="page_desc">
			{$scope.content}
		</div>
		
		
		{foreach from=$scopeList key=k item=scopeler}
			<div class="row social_row">
				{if $k mod 2 eq 0}
					<div class="col-lg-3 col-md-3 col-sm-3 col-xs-12"> 
						<img style="width: 100%; object-fit: cover; height: 150px;" class="img-responsive" src="{if empty($scopeler.photo)}https://placeholdit.imgix.net/~text?txtsize=28&bg=f06905&txtclr=ffffff&txt=300%C3%97250&w=300&h=250{else}upload/photo/{$scopeler.photo}{/if}" alt="" />
					</div>
					
					<div class="col-lg-9 col-md-9 col-sm-9 col-xs-12">
						<div class="social_p_title"> {$scopeler.seo_title}</div>
						<div class="social_p_desc"> {$scopeler.content}</div>
					</div> 
				{/if}
				
				{if $k mod 2 eq 1}
					
					<div class="col-lg-9 col-md-9 col-sm-9 col-xs-12">
						<div class="social_p_title"> {$scopeler.seo_title}</div>
						<div class="social_p_desc"> {$scopeler.content}</div>
					</div> 
					
					<div class="col-lg-3 col-md-3 col-sm-3 col-xs-12"> 
						<img style="width: 100%; object-fit: cover; height: 150px;" class="img-responsive" src="{if empty($scopeler.photo)}https://placeholdit.imgix.net/~text?txtsize=28&bg=f06905&txtclr=ffffff&txt=300%C3%97250&w=300&h=250{else}upload/photo/{$scopeler.photo}{/if}" alt="" />  
					</div>
				{/if}
			</div>
		{/foreach}
		
		
		
		</div>
		
	</div>
</div>





{include file='footer.tpl'}