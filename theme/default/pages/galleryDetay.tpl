{include file='header.tpl' title=$ik.seo_title desc=$ik.seo_description keyw=$ik.seo_keyword}

<div class="container top_space">
	<div class="row">  
		{if ! empty($ik.photo)}			
		<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="display:none"> 
			<img class="img-responsive" src="{$settings.site_url}/upload/photo/{$ik.photo}" alt=""> 
		</div> 
		{/if}
		
		<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12"> 
			<ol class="breadcrumb">
			<li><a href="{$settings.site_url}">Anasayfa</a></li> 
			<li><a href="{$settings.site_url}/galeri">Galeri</a></li> 
			<li class="active">{$ik.seo_title}</li>
			</ol> 
		</div>  
		
		<div class="col-lg-12">
		
		<div class="page_title"> {$ik.seo_title}</div>
		
		<div class="text-center col-lg-12 col-md-12 col-sm-12 col-xs-12"> 
			 
			<div class="row">  
			{if !empty($galeri)}
				{foreach from=$galeri item=resimler} 
				
				<div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">  
				  <a href="../{$resimler.url}" class="img-lightbox">
                      <img src="../{$resimler.url}" style="width: 100%;object-fit: cover;max-height:200px;margin-bottom:20px;" class="img-responsive">
                  </a> 
				</div>
				
				{/foreach}
			{else}<br /><br /><br /><br />
			<center>Hiç Resim Eklenmemiş</center><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
			{/if}
	</div>    
		</div>
		
		
		
		</div>
		
	</div>
</div>





{include file='footer.tpl'}