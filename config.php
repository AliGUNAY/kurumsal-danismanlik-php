<?
/**
 * @author	iwt web tasrım
 * @copyright	Copyright (c) 2016, Developer Ahmet ÖZALP (www.ahmetozalp.net)
 * @link	http://www.iwt.com.tr
 * @since	Version 1.0.0
**/

	define("SITE_URL",			"http://www.skonseptdanismanlik.com");
	define("ADMIN_FOLDER",		"admin");
	define("THEME_FOLDER",		"theme");
	define("SYSTEM_FOLDER",		"system");
	define("CACHE_FILE",		"cache");
	define("DEF_FOLDER",		"default");
	define("LANG_FOLDER",		"lang");
	define("UPLOAD_FOLDER",		"upload");
	define('ENVIRONMENT', 		isset($_SERVER['CI_ENV']) ? $_SERVER['CI_ENV'] : 'development');

	//* Smarty Tema Motoru Ayarları
	define("TEMPLATE_DEBUG",	FALSE);
	define("TEMPLATE_CACHING",	FALSE);
	define("TEMPLATE_CACHETIME",120);
	
	//* DATABASE Ayarları
	define("DATABASE_HOSTNAME",	'localhost');
	define("DATABASE_USERNAME",	'goxskons_iwt');
	define("DATABASE_PASSWORD",	'?-K?{N;JCITp');
	define("DATABASE_DATABASE",	'goxskons_iwt');
	define("DATABASE_NAMES",	'utf8');
	define("DATABASE_CHARACTER",'utf8');
	define("DATABASE_COLLATION",'utf8_turkish_ci');
	
	//* Mail Ayarları
	define("MAIL_TIPI",			'smtp');
	define("MAIL_SERVER",		'mail.skonseptdanismanlik.com');
	define("MAIL_PORT",			25);
	define("MAIL_USERNAME",		'sistem@skonseptdanismanlik.com');
	define("MAIL_PASSWORD",		');^=!%sA,hV-');
	
	//* PDO Config Database
	require_once(SYSTEM_FOLDER . '/database.class.php');
		
	//* Smarty'i Çagır
	require_once(SYSTEM_FOLDER . '/smarty.class.php');
	require_once(SYSTEM_FOLDER . '/smarty/smarty.class.php');
	
	//* Fonksiyon Dosyaları
	require_once(SYSTEM_FOLDER . '/function.class.php');
		
	//* Güvenlik Dosyaları
	require_once(SYSTEM_FOLDER . '/security.class.php');
	require_once(SYSTEM_FOLDER . '/csrf.class.php');
	
	//* Dosya Upload Class
	require_once(SYSTEM_FOLDER . '/upload.class.php');
	
	//* Mail Gönderme 
	require_once(SYSTEM_FOLDER . '/mail/class.phpmailer.php');
	require_once(SYSTEM_FOLDER . '/mail/class.smtp.php');
		
?>