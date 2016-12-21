{include file='header.tpl' title=$kategori.seo_title desc=$kategori.seo_description keyw=$kategori.seo_keyword}


		
		<div class="container top_space">
			<div class="row">  

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
		
		<div class="container">
			<div class="row">   
				<div class="col-lg-12">
				
				
				
				<div class="page_title">{$kategori.seo_title}</div>
				<div class="page_desc">

						{if $categorys[0] eq "21"}
							{if !empty($galeri)}
								{foreach from=$galeri key=k item=resimler} 
									
									<div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">  
									  <a href="../{$resimler.url}" class="img-lightbox">
										  <img src="../{$resimler.url}" style="width: 100%;object-fit: cover;" class="img-responsive">
									  </a> 
									</div>
									{if $k mod 3 eq 2}
									<div class="space"></div> 
									{/if}
								{/foreach}
							{else if !empty($videogaleri)}
								{foreach from=$videogaleri key=k item=videolar} 
									<div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">  
									  <a class="popup-iframe" href="http://www.youtube.com/watch?v={$videolar.url}" class="img-lightbox">
										  <img src="http://i1.ytimg.com/vi/{$videolar.url}/sddefault.jpg" style="width: 100%;object-fit: cover;" class="img-responsive">
									  </a> 
									</div>
									
									{if $k mod 3 eq 2}
									<div class="space"></div> 
									{/if}
								{/foreach}
							{else}<br /><br /><br /><br />
							<center>Hiç Resim Eklenmemiş</center><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
							{/if}
							
						{else if $categorys[0] eq "20"}
							
							{$kategori.content}
							
						{else}	
								
							{$kategori.content}
							
						{/if}
				</div>
				</div>
				
			</div>
		</div>

{include file='footer.tpl'}