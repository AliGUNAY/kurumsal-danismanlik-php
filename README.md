# kurumsal-danismanlik-php
 Ücretini alamadıgım için ihtiyacı olan arakdaşlara burdan dagıtmak istedim.İşinizi goruyorsa üstteki STAR butonuna ve benı takip ederek yakında tekrar yayınlayacagım kodlarada ulaşabilirsiniz.
 
 ### Kullandıklarım
 
 	PHP SQL OOP CLASS
 	PHP Smarty Temlate (smarty.class http://www.smarty.net/)
 	CSRF Form Güvenligi (csrf.class http://www.wikihow.com/Prevent-Cross-Site-Request-Forgery-(CSRF)-Attacks-in-PHP )
 	Kendi Geliştirdigim Regex Güvenlik
 	Upload Class (verot.net class https://www.verot.net/php_class_upload.htm)

## Kurulum
"config.php" dosyasındaki database site ayarları ve mail ayarlarını kendinize göre düzenleyiniz:

### Database
	//* DATABASE Ayarları
	define("DATABASE_HOSTNAME",	'localhost');
	define("DATABASE_USERNAME",	'');
	define("DATABASE_PASSWORD",	'');
	define("DATABASE_DATABASE",	'');
  
  
### Site Adresi
  	define("SITE_URL",			"http://www.");

### Mail Ayarları
  	//* Mail Ayarları
	define("MAIL_TIPI",			'smtp');
	define("MAIL_SERVER",		'mail.....com');
	define("MAIL_PORT",			25);
	define("MAIL_USERNAME",		'sistem@....com');
	define("MAIL_PASSWORD",		'');
  
  
## SQL Yükleme
  Database oluşturdukdan sonra anadizindeki "goxskons_iwt.sql.gz" dosyayı yükleyiniz.
  
## Admin Şifresi
  
  	siteadresi.com/admin 
	Kullanıcı Adı: admin
	Şifre: tasarlar
  
  
## Ekran Görüntüsü
![alt tag](http://i.hizliresim.com/Pn02k8.png)
![alt tag](http://i.hizliresim.com/Pn02Q6.png)
![alt tag](http://i.hizliresim.com/Wg08bP.png)
  




