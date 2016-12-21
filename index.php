<?
/**
 * @author	iwt web tasrım
 * @copyright	Copyright (c) 2016, Developer Ahmet ÖZALP (www.ahmetozalp.net)
 * @link	http://www.iwt.com.tr
 * @since	Version 1.0.0
**/

	//* 301 Yönlendirme google eski link için | 18 Temmuz 2016 1 ay sonra bu kısmı kaldırın
	$redirects = array(
	   '/bireysel/contact/' 						=> 'iletisim',
	   '/referanslar/okullar/' 						=> 'referanslar',
	   '/bireysel/galeri/' 							=> 'galeri',
	   '/bireysel/hakkimizda/' 						=> 'hakkimizda',
	   '/konsept/index.php/yazili-basin/' 			=> 'basindabiz/yazili-basin-20',
	   '/bireysel/yazili-basin/'		 			=> 'basindabiz/yazili-basin-20',
	   '/bireysel/online-randevu/' 					=> '/',
	   '/bireysel/referanslarimiz/okullar/' 		=> 'referanslar',
	   '/konsept/index.php/news/0-11-yas-gelisimi/' => 'makaleler/detay/0---11-yas-gelisimi-27'
	);
	
	if(isset($_SERVER['REQUEST_URI']) && isset($redirects[$_SERVER['REQUEST_URI']])) {
		$loc = "http://www.skonseptdanismanlik.com/" . $redirects[$_SERVER['REQUEST_URI']];
		header("HTTP/1.1 301 Moved Permanently");
		header("Location: " . $loc);
		exit();
	}
	//* 301 Yönlendirme
	

	require_once __DIR__.'/config.php';
	
	require_once(SYSTEM_FOLDER . '/themeController.php');
	$view = new controller();
	
	switch (ENVIRONMENT) {
		case 'development':
			error_reporting(-1);
			ini_set('display_errors', 1);
		break;
		case 'production':
			ini_set('display_errors', 0);
			if (version_compare(PHP_VERSION, '5.3', '>=')) {
				error_reporting(E_ALL & ~E_NOTICE & ~E_DEPRECATED & ~E_STRICT & ~E_USER_NOTICE & ~E_USER_DEPRECATED);
			} else {
				error_reporting(E_ALL & ~E_NOTICE & ~E_STRICT & ~E_USER_NOTICE);
			}
		break;
		default:
			header('HTTP/1.1 503 Service Unavailable.', TRUE, 503);
			echo 'The application environment is not set correctly.';
			exit(1);
	}
	


	switch(@$_GET['do']){
		case 'hakkimizda':
			$view->about();
		break;
		
		case 'bilincli-ebeveynler':
			$view->bilincliebeveynler();
		break;
		
		case 'sirketin-seni-seviyor':
			$view->sirketseviyor();
		break;
		
		case 'hizmetlerimiz':
			$view->services([
				'data'	   => @$_GET ? $_GET : FALSE
			]);
		break;
		
		case 'referanslar':
			$view->referance();
		break;
		
		case 'sosyalprojeler':
			$view->sosyalprojeler();
		break;
		
		case 'ik':
			$view->ik();
		break;
	
		case 'iletisim':
			$view->iletisim([
				'data'	   => @$_POST ? $_POST : FALSE
			]);
		break;
		
		case 'makaleler':
			$view->makaleler([
				'data'	   => @$_GET ? $_GET : FALSE
			]);
		break;
		
		case 'etkinlikler':
			$view->etkinlikler();
		break;
		
		case 'dusunceleriniz':
			$view->dusunceleriniz();
		break;
		
		case 'galeri':
			$view->galeri([
				'data'	   => @$_GET ? $_GET : FALSE
			]);
		break;
		
		case 'basindabiz':
			$view->basindabiz([
				'data'	   => @$_GET ? $_GET : FALSE
			]);
		break;
		
		case '404':
			$view->error();
		break;
		
		case 'sitemap.xml':
			$view->sitemap();
		break;
	
		default:
			$view->index();
		break;
	}
?>