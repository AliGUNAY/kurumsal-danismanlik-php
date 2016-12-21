<nav id="sidenav-left">
        <div class="scrollable">
            <h3 class="sidenav-title antagon-font-oswald-bold"><a href="index.php?page=panel">IWT v1</a></h3>
            <div class="title-star"></div>
            <p class="sidenav-subtitle hidden-xs">Profesyonel Web Panel</p>
			
            <ul class="list-unstyled" id="accordion">
               
			   
			   
				<li>
                    <a href="index.php?page=settings">
                        <i class="fa fa-wrench antagon-color-main"></i>
                        <span class="hidden-xs">Site Genel Ayarları</span>
                    </a>
                </li>
			   
                {foreach from=$menu item=foo}
					{if $foo.title eq 0}
					<li id="{$foo.panel_sef}menu" style="{if $foo.status eq 0} display:none {/if}">
						<a href="index.php?page=page/{$foo.panel_sef}">
							<i class="fa {$foo.icon} antagon-color-main"></i>
							<span class="hidden-xs">{$foo.title}</span>
						</a>
					</li>
					{/if}
				{/foreach}
				<!---
				<li class="dcjq-parent-li">
                    <a href="javascript:" class="dcjq-parent">
                        <i class="fa fa-pencil antagon-color-main"></i>
                        <span class="hidden-xs">Örnek menu</span>
						<ul style="display: none;">
							<li><a href="typography.html#headings">Headings</a></li>
							<li><a href="typography.html#contextual-colors">Contextual colors</a></li>
							<li><a href="typography.html#leads">Leads</a></li>
							<li><a href="typography.html#blockquotes">Blockquotes</a></li>
							<li><a href="typography.html#lists">Lists</a></li>
							<li><a href="typography.html#icons">Icons</a></li>
						</ul>
					</a>
                </li>--->
				<br />
				<li>
                    <a href="index.php?page=cikisyap">
                        <i class="fa fa-sign-out antagon-color-main"></i>
                        <span class="hidden-xs"> Çıkış Yap</span>
                    </a>
                </li>
				<li>
                    <a href="../" target="_blank">
                        <i class="fa fa-chevron-left antagon-color-main"></i>
                        <span class="hidden-xs"> Siteye Git</span>
                    </a>
                </li>
				 
				 
				 
            </ul>

        </div>
    </nav>