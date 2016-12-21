<html lang="tr">
<head>
    <meta charset="utf-8">
    <meta content="IE=edge" http-equiv="X-UA-Compatible">
    <meta content="width=device-width, initial-scale=1, user-scalable=no" name="viewport">
    <title>{if !empty($title)} {$title} - {/if}{$settings.seo_title}</title>
	<link href='https://fonts.googleapis.com/css?family=Ubuntu:400,300,300italic,400italic,500,500italic,700,700italic&subset=latin,latin-ext' rel='stylesheet' type='text/css'>
	<link href="{$themelink}/css/bootstrap.css" rel="stylesheet"> 
	<link href="{$themelink}/css/extended.css" rel="stylesheet"> 
	<link href="{$themelink}/css/style.css" rel="stylesheet"> 
		
    <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
      <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->
	
	<script src="https://code.jquery.com/jquery-1.12.4.min.js"></script> 
	
	<link rel="shortcut icon" href="upload/favicon/{$settings.favicon}">
	
	<meta name="description" content="{$desc}">
	<meta name="keywords" content="{$keyw}">
	<meta name="author" content="{$settings.sirket}">
	
	<!--- Gogole Analytics --->
	{$settings.google_analytics}
	
	
	<meta name="google-site-verification" content="keputA9vA_j8sVdWYhlc7uD5DhgpTzIPWRXr5sQmGmg" />
</head>
<body>
	<header class="header"> 
	  <div class="container">
	  <div class="top_right hidden-xs">
	  <div class="row pull-right">
	  <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
	  
	  <div class="phone_div">
	  <img src="{$themelink}/img/tel_icon.png" alt=""><span class="p_d_text"> {$settings.sirkettelefon} </span>
	  </div>
	  
	  <div class="phone_div">
	  <img src="{$themelink}/img/ctel_icon.png" alt=""><span class="p_d_text"> {$settings.sirketgsm}</span>
	  </div>
	  
	  </div>
	  </div>
	  </div>
	  <div class="row"> 
	  <div class="col-lg-2 col-md-2 col-sm-2 col-xs-6">
		  <a href="{$settings.site_url}"><img class="img-responsive logo_img" alt="" src="{$settings.site_url}/upload/logo/{$settings.logo}"></a>
	  </div>
	  <div class="col-lg-10 col-md-10 col-sm-12 col-xs-6 pl0 pr0">
		 <nav role="navigation" class="navbar navbar-transparent cl-effect-5">
			  <div class="container-fluid pl0 pr0">
				<div class="navbar-header">
				  <button data-target="#transparent-example1" data-toggle="collapse" class="navbar-toggle" type="button"> 
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
				  </button>
				</div>
				<div id="transparent-example1" class="collapse navbar-collapse">
				  <ul class="nav navbar-nav">
					<li {if ! isset($smarty.get.do)} class="active" {/if}><a href="{$settings.site_url}"><span data-hover="ANASAYFA">ANASAYFA</span></a></li>
					<li {if isset($smarty.get.do)}{if $smarty.get.do eq "hakkimizda"}class="active"{/if}{/if}><a href="{$settings.site_url}/hakkimizda"><span data-hover="HAKKIMIZDA">HAKKIMIZDA</span></a></li>
					<li {if isset($smarty.get.do)}{if $smarty.get.do eq "hizmetlerimiz"}class="active"{/if}{/if}><a href="{$settings.site_url}/hizmetlerimiz"><span data-hover="HİZMETLERİMİZ">HİZMETLERİMİZ</span></a></li>
					<li {if isset($smarty.get.do)}{if $smarty.get.do eq "referanslar"}class="active"{/if}{/if}><a href="{$settings.site_url}/referanslar"><span data-hover="REFERANSLAR">REFERANSLAR</span></a></li>
					<li {if isset($smarty.get.do)}{if $smarty.get.do eq "galeri"}class="active"{/if}{/if}><a href="{$settings.site_url}/galeri"><span data-hover="GALERİ">GALERİ</span></a></li>
					<li {if isset($smarty.get.do)}{if $smarty.get.do eq "sosyalprojeler"}class="active"{/if}{/if}><a href="{$settings.site_url}/sosyalprojeler"><span data-hover="SOSYAL PROJELER">SOSYAL PROJELER</span></a></li>
					<li {if isset($smarty.get.do)}{if $smarty.get.do eq "ik"}class="active"{/if}{/if}><a href="{$settings.site_url}/ik"><span data-hover="İNSAN KAYNAKLARI">İNSAN KAYNAKLARI</span></a></li>
					<li {if isset($smarty.get.do)}{if $smarty.get.do eq "iletisim"}class="active"{/if}{/if}><a href="{$settings.site_url}/iletisim"><span data-hover="İLETİŞİM">İLETİŞİM</span></a></li>
				  </ul> 
				</div>
			  </div>
			</nav>
	  </div> 
	  </div>
	  </div>
	</header>