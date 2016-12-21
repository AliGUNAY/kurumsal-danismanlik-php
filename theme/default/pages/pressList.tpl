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
					<li><a href="{$settings.site_url}/basindabiz">Basında Biz</a></li>
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
				<div class="col-lg-3 col-md-3 col-sm-3 col-xs-6"><a href="{$kategori.sef}"> {$kategori.title}</a> </div>  
			{/foreach}
			</div>
			</div>
			</div>
		</div>
		--->
		
		<div class="container ">
		
		<div class="text-center col-lg-12 col-md-12 col-sm-12 col-xs-12"> 
		
			<div class="row">   
				<div class="col-lg-12">
				
				<div class="page_title">{$kategori.seo_title}</div>
				<div class="page_desc"> 
				
					{$kategori.content}
					
					{if $kategori.id eq "21"}
					
						{if $services neq 0}
						{foreach from=$services key=k item=service}
							<div class="col-lg-4 col-md-4 col-sm-4 col-xs-12"> 
								<a href="detay/{$service.sef}-{$service.id}"><img style="object-fit: contain; height: 80px; width: 100%;" class="img-responsive" src="{if empty($service.photo)}http://www.placehold.it/800x550/f06905/ffffff&amp;text=+{else}{$settings.site_url}/upload/photo/{$service.photo}{/if}" alt=""></a>
								<div class="page_sub_title"><a href="detay/{$service.sef}-{$service.id}">{$service.seo_title}</a></div>
							</div>
							
							{if $k mod 3 eq 2}
							<div class="space"></div> 
							{/if}
						{/foreach}
						{else}	
								<center> İçerik Bulunamadı! </center>
						{/if}
						
					{else}	
					
						{if $services neq 0}
							{foreach from=$services key=k item=service}
		
								<div class="row social_row text-left">
									<div class="col-lg-3 col-md-3 col-sm-3 col-xs-12"> 
										<a href="detay/{$service.sef}-{$service.id}"><img style="height: 170px; object-fit: cover; width: 100%;" alt="{$service.title}" src="{if empty($service.photo)}http://www.placehold.it/800x550/f06905/ffffff&amp;text=+{else}{$settings.site_url}/upload/photo/{$service.photo}{/if}" class="img-responsive"></a>  
									</div>
									
									<div class="col-lg-9 col-md-9 col-sm-9 col-xs-12">
									<div class="social_p_title"><a href="detay/{$service.sef}-{$service.id}"> {$service.title}</a></div>
									<div class="social_p_desc">{$service.content|strip_tags|mb_substr:0:550}... <a href="makaleler/detay/{$service.sef}-{$service.id}">> Devamını oku</a></div>
									</div> 
								</div>
								
								
							{/foreach}
						{else}	
							<center> İçerik Bulunamadı! </center>
						{/if}
						
					{/if}
					</div>
				
				</div>
				</div>
				
			</div>
		</div>

{include file='footer.tpl'}