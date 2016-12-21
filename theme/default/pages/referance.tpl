{include file='header.tpl' title=$referance.seo_title desc=$referance.seo_description keyw=$referance.seo_keyword}

	<div class="container top_space">
		<div class="row">  
			<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12"> 
				<img class="img-responsive" src="upload/photo/{$referance.photo}" alt="" /> 
			</div>  
			
			<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12"> 
				<ol class="breadcrumb">
				<li><a href="{$settings.site_url}">Anasayfa</a></li> 
				<li class="active">{$referance.seo_title}</li>
				</ol> 
			</div>  
			
			<div class="col-lg-12">
				<div class="page_title"> {$referance.seo_title}</div>
			</div>
			
		</div>
	</div>

	<div class="container text-center">

		{foreach from=$kategoriler  item=kategori}
		{if $kategori.status eq 0}
		<div class="row">  
			<div class="ref_title">{$kategori.title}</div>	
			{foreach from=$referanslar  item=referans}
				{foreach from=$referans.categorys|@json_decode  item=id} 
					{if $kategori.id eq $id}
					<div class="col-lg-3 col-md-3 col-sm-3 col-xs-12">
						<img class="img-responsive ref_img" src="upload/photo/{$referans.photo}" alt=""> 
						<div class="ref_sub_title">{$referans.title}</div> 
					</div> 
					{/if}
				{/foreach}
			{/foreach}			
		</div>
		<div class="space"></div>
		{/if}
		{/foreach}

		
	</div>





{include file='footer.tpl'}