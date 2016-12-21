{include file='header.tpl' title=$ik.seo_title desc=$ik.seo_description keyw=$ik.seo_keyword}


		
		<div class="container top_space">
			<div class="row">  

				<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12"> 
					<ol class="breadcrumb">
					<li><a href="{$settings.site_url}">Anasayfa</a></li>
					<li><a href="{$settings.site_url}/makaleler">Makaleler</a></li>
					<li class="active">{$ik.seo_title}</li>
					</ol> 
				</div> 
			</div>
		</div>
		<!---
		<div class="container ser_st_tab">
			<div class="row">  
			<div class="col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-10 col-sm-offset-1 col-xs-12">  
			<div class="row"> 
			{foreach from=$ikler  item=ik}
				<div class="col-lg-3 col-md-3 col-sm-3 col-xs-6"><a href="{$ik.sef}"> {$ik.title}</a> </div>  
			{/foreach}
			</div>
			</div>
			</div>
		</div>
		--->
		
		<div class="container">
			<div class="row">   
				<div class="col-lg-12">
				
				<div class="page_title">{$ik.seo_title}</div>
				<div class="page_desc"> 
				
					{$ik.content}
				
				</div>
				</div>
				
			</div>
			<br /><br />
			
			<script id="dsq-count-scr" src="//yenipanel.disqus.com/count.js" async></script>
			<script type="text/javascript">var switchTo5x=true;</script>
			<script type="text/javascript" src="http://w.sharethis.com/button/buttons.js"></script>
			<script type="text/javascript">{literal}stLight.options({publisher: "37b39a19-2d52-426a-ace3-6a2456529cd5", doNotHash: false, doNotCopy: false, hashAddressBar: false});{/literal}</script>

			
			Sosyal Medya: 
			<span class='st_fblike' displayText='Facebook Like'></span>
			<span class='st_fbsend' displayText='Facebook Send'></span>
			<span class='st_twitterfollow' displayText='Twitter Follow'></span>
			<span class='st_plusone' displayText='Google +1'></span>
			<span class='st_facebook' displayText='Facebook'></span>
			<span class='st_twitter' displayText='Tweet'></span>
			<span class='st_linkedin' displayText='LinkedIn'></span>
			<span class='st_pinterest' displayText='Pinterest'></span>
			<span class='st_email' displayText='Email'></span>
			
			<br /><br />
			<div id="disqus_thread"></div>
			<script>
			/*
				var disqus_config = function () {
					this.page.url = "//{$smarty.server.HTTP_HOST}{$smarty.server.REQUEST_URI}";  // Replace PAGE_URL with your page's canonical URL variable
					this.page.identifier = ""; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
				};
			*/	
				(function() {  // DON'T EDIT BELOW THIS LINE
					var d = document, s = d.createElement('script');
					
					s.src = '//yenipanel.disqus.com/embed.js';
					
					s.setAttribute('data-timestamp', +new Date());
					(d.head || d.body).appendChild(s);
				})();
			</script>
			<noscript>Please enable JavaScript to view the <a href="https://disqus.com/?ref_noscript" rel="nofollow">comments powered by Disqus.</a></noscript>
			
			
			
		</div>

{include file='footer.tpl'}