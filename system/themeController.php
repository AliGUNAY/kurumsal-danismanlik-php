<?
/**
 * @author	iwt web tasrım
 * @copyright	Copyright (c) 2016, Developer Ahmet ÖZALP (www.ahmetozalp.net)
 * @link	http://www.iwt.com.tr
 * @since	Version 1.0.0
**/


/*
	DEVELOPER Arakdaşa NOT: 
	
	Paneli 1 hafta içinde hızlı yaazmamız istediler ,
	biraz gereksiz kodların oldugunun farkındayım tekrar paneli açtıkca güncellicem
	
*/


	class controller{
		
		public $dil			= "en";

		
		public function __construct(array $config = []){
			$this->smarty = new SMTemplate();
			$this->db = new database();
			$this->func = new functions();
			$this->security = new phpSecurityClass();
			$this->csrf = new CSRF();
			
			
			$this->lang = NULL;

			//* Ayarları Çek Heryerde
			$ayarlarArray= array(
				'id' => 1
			);
			$this->ayarlar = $this->db->select("iwt_settings", $ayarlarArray, $relOpt = '=', $locOpt = 'and', $orderColumn = null, $orderOpt = null, $limit = null, $lmtStart = null);
		}
		
		//* Ön Yüz
		public function index(array $config = []){
			//print_r($this->ayarlar);

			//* Ana Sayfa detayları
			$anasayfaArray= array(
				'id' => 1
			);
			$anasayfa = $this->db->select("iwt_pages", $anasayfaArray, $relOpt = '=', $locOpt = 'and', $orderColumn = null, $orderOpt = null, $limit = null, $lmtStart = null);
		
			//* Sayfada Gerekli Olanlar
			$makaleler = $this->db->select("iwt_pages_news", array("status"=>0), $relOpt = '=', $locOpt = 'and', $orderColumn = "sort", $orderOpt = "asc", $limit = "0,8", $lmtStart = null);
			$etkinlikler = $this->db->select("iwt_pages_announcements", array("status"=>0), $relOpt = '=', $locOpt = 'and', $orderColumn = "sort", $orderOpt = "asc", $limit = null, $lmtStart = null);
			$dusunceler = $this->db->select("iwt_pages_thoughts", array("status"=>0), $relOpt = '=', $locOpt = 'and', $orderColumn = "date", $orderOpt = "desc", $limit = null, $lmtStart = null);
			$basin = $this->db->query("SELECT * FROM iwt_pages_press WHERE categorys LIKE '%\"20\"%' AND status=0 ORDER BY sort ASC limit 10")->fetchAll();

			$data = array(
				'themelink' 		=> SITE_URL.'/'.THEME_FOLDER.'/'.DEF_FOLDER,
				'language' 			=> $this->lang,
				'function' 			=> $this->func,
				'session'	  		=> @$_SESSION['login'] == TRUE ? $_SESSION : FALSE,
				'settings'			=> @$this->ayarlar == TRUE ? $this->ayarlar[0] : FALSE,
				'anasayfa'			=> @$anasayfa == TRUE ? $anasayfa[0] : FALSE,
				'makaleler'			=> @$makaleler == TRUE ? $makaleler : FALSE,
				'etkinlikler'		=> @$etkinlikler == TRUE ? $etkinlikler : FALSE,
				'dusunceler'		=> @$dusunceler == TRUE ? $dusunceler : FALSE,
				'basin'				=> @$basin == TRUE ? $basin : FALSE
			);
			$this->smarty->render('index', $data);
		}
		
		
		public function about(array $config = []){
			//print_r($this->ayarlar);

			//* Ana Sayfa detayları
			$aboutArray= array(
				'panel_sef' => 'about'
			);
			$about = $this->db->select("iwt_pages", $aboutArray, $relOpt = '=', $locOpt = 'and', $orderColumn = null, $orderOpt = null, $limit = null, $lmtStart = null);
		
			if(!$about){
				die($this->func->yonlendir(0, "/404"));
			}
		
			$data = array(
				'themelink' 		=> SITE_URL.'/'.THEME_FOLDER.'/'.DEF_FOLDER,
				'language' 			=> $this->lang,
				'session'	  		=> @$_SESSION['login'] == TRUE ? $_SESSION : FALSE,
				'settings'			=> @$this->ayarlar == TRUE ? $this->ayarlar[0] : FALSE,
				'about'				=> @$about == TRUE ? $about[0] : FALSE
			);
			$this->smarty->render('pages/about', $data);
		}
		
		public function bilincliebeveynler(array $config = []){
			//print_r($this->ayarlar);

			//* Ana Sayfa detayları
			$aboutArray= array(
				'panel_sef' => 'conscious-parents'
			);
			$about = $this->db->select("iwt_pages", $aboutArray, $relOpt = '=', $locOpt = 'and', $orderColumn = null, $orderOpt = null, $limit = null, $lmtStart = null);
			
			if(!$about){
				die($this->func->yonlendir(0, "/404"));
			}
		
			$data = array(
				'themelink' 		=> SITE_URL.'/'.THEME_FOLDER.'/'.DEF_FOLDER,
				'language' 			=> $this->lang,
				'session'	  		=> @$_SESSION['login'] == TRUE ? $_SESSION : FALSE,
				'settings'			=> @$this->ayarlar == TRUE ? $this->ayarlar[0] : FALSE,
				'about'				=> @$about == TRUE ? $about[0] : FALSE
			);
			$this->smarty->render('pages/bilincliebeveynler', $data);
		}
		
		public function sirketseviyor(array $config = []){
			//print_r($this->ayarlar);

			//* Ana Sayfa detayları
			$aboutArray= array(
				'panel_sef' => 'enterprises-of-loves-you'
			);
			$about = $this->db->select("iwt_pages", $aboutArray, $relOpt = '=', $locOpt = 'and', $orderColumn = null, $orderOpt = null, $limit = null, $lmtStart = null);
		
			if(!$about){
				die($this->func->yonlendir(0, "/404"));
			}
		
			$data = array(
				'themelink' 		=> SITE_URL.'/'.THEME_FOLDER.'/'.DEF_FOLDER,
				'language' 			=> $this->lang,
				'session'	  		=> @$_SESSION['login'] == TRUE ? $_SESSION : FALSE,
				'settings'			=> @$this->ayarlar == TRUE ? $this->ayarlar[0] : FALSE,
				'about'				=> @$about == TRUE ? $about[0] : FALSE
			);
			$this->smarty->render('pages/sirketseviyor', $data);
		}
		
		public function services(array $config = []){
			if(!empty($config['data']['sef']) AND !empty($config['data']['id']) AND $config['data']['detay'] == 0){
				$services = $this->db->query("SELECT * FROM iwt_pages_services WHERE categorys LIKE '%".$config['data']['id']."%' AND status=0 order by sort asc")->fetchAll();
				$kategoriArray= array(
					'id' => $config['data']['id']
				);
				$kategori = $this->db->select("iwt_pages_services_category", $kategoriArray, $relOpt = '=', $locOpt = 'and', $orderColumn = 'sort', $orderOpt = 'asc', $limit = null, $lmtStart = null);
				$serviskategorileri = $this->db->select("iwt_pages_services_category", array( 'status' => 0 ), $relOpt = '=', $locOpt = 'and', $orderColumn = 'sort', $orderOpt = 'asc', $limit = null, $lmtStart = null);
				
				$data = array(
					'themelink' 		=> SITE_URL.'/'.THEME_FOLDER.'/'.DEF_FOLDER,
					'language' 			=> $this->lang,
					'session'	  		=> @$_SESSION['login'] == TRUE ? $_SESSION : FALSE,
					'settings'			=> @$this->ayarlar == TRUE ? $this->ayarlar[0] : FALSE,
					'services'			=> @$services == TRUE ? $services : FALSE,
					'kategori'			=> @$kategori == TRUE ? $kategori[0] : FALSE,
					'kategoriler'		=> @$serviskategorileri == TRUE ? $serviskategorileri : FALSE
				);
				$this->smarty->render('pages/servicesList', $data);
			}else if(!empty($config['data']['sef']) AND !empty($config['data']['id']) AND $config['data']['detay'] == 1){
				
				$kategoriArray= array(
					'id' => $config['data']['id'],
					'status' => 0
				);
				$kategori = $this->db->select("iwt_pages_services", $kategoriArray, $relOpt = '=', $locOpt = 'and', $orderColumn = 'sort', $orderOpt = 'asc', $limit = null, $lmtStart = null);
				$serviskategorileri = $this->db->select("iwt_pages_services_category", array( 'status' => 0 ), $relOpt = '=', $locOpt = 'and', $orderColumn = 'sort', $orderOpt = 'asc', $limit = null, $lmtStart = null);
				
				if(!$kategori){
					die($this->func->yonlendir(0, "/404"));
				}
				
				$data = array(
					'themelink' 		=> SITE_URL.'/'.THEME_FOLDER.'/'.DEF_FOLDER,
					'language' 			=> $this->lang,
					'session'	  		=> @$_SESSION['login'] == TRUE ? $_SESSION : FALSE,
					'settings'			=> @$this->ayarlar == TRUE ? $this->ayarlar[0] : FALSE,
					'services'			=> @$services == TRUE ? $services[0] : FALSE,
					'kategori'			=> @$kategori == TRUE ? $kategori[0] : FALSE,
					'kategoriler'		=> @$serviskategorileri == TRUE ? $serviskategorileri : FALSE
				);
				$this->smarty->render('pages/servicesDetay', $data);
				
			}else{
				$servicesArray= array(
					'panel_sef' => 'services'
				);
				$services = $this->db->select("iwt_pages", $servicesArray, $relOpt = '=', $locOpt = 'and', $orderColumn = null, $orderOpt = null, $limit = null, $lmtStart = null);
			
				$serviskategorileri = $this->db->select("iwt_pages_services_category", array( 'status' => 0 ), $relOpt = '=', $locOpt = 'and', $orderColumn = 'sort', $orderOpt = 'asc', $limit = null, $lmtStart = null);
			
				if(!$services){
					die($this->func->yonlendir(0, "/404"));
				}
			
				$data = array(
					'themelink' 		=> SITE_URL.'/'.THEME_FOLDER.'/'.DEF_FOLDER,
					'language' 			=> $this->lang,
					'session'	  		=> @$_SESSION['login'] == TRUE ? $_SESSION : FALSE,
					'settings'			=> @$this->ayarlar == TRUE ? $this->ayarlar[0] : FALSE,
					'services'			=> @$services == TRUE ? $services[0] : FALSE,
					'kategoriler'		=> @$serviskategorileri == TRUE ? $serviskategorileri : FALSE
				);
				$this->smarty->render('pages/services', $data);
			}
		}
		
		public function referance(array $config = []){
			//print_r($this->ayarlar);

			//* Ana Sayfa detayları
			$referanceArray= array(
				'panel_sef' => 'referance'
			);
			$referance = $this->db->select("iwt_pages", $referanceArray, $relOpt = '=', $locOpt = 'and', $orderColumn = null, $orderOpt = null, $limit = null, $lmtStart = null);
			$kategoriler = $this->db->select("iwt_pages_referance_category", array('status'=>0), $relOpt = '=', $locOpt = 'and', $orderColumn = "sort", $orderOpt = "asc", $limit = null, $lmtStart = null);
			$referanslar = $this->db->select("iwt_pages_referance", array('status'=>0), $relOpt = '=', $locOpt = 'and', $orderColumn = "sort", $orderOpt = "asc", $limit = null, $lmtStart = null);
		
		
			if(!$referance){
				die($this->func->yonlendir(0, "/404"));
			}
		
			$data = array(
				'themelink' 		=> SITE_URL.'/'.THEME_FOLDER.'/'.DEF_FOLDER,
				'language' 			=> $this->lang,
				'session'	  		=> @$_SESSION['login'] == TRUE ? $_SESSION : FALSE,
				'settings'			=> @$this->ayarlar == TRUE ? $this->ayarlar[0] : FALSE,
				'referance'			=> @$referance == TRUE ? $referance[0] : FALSE,
				'kategoriler'		=> @$kategoriler == TRUE ? $kategoriler : FALSE,
				'referanslar'		=> @$referanslar == TRUE ? $referanslar : FALSE
			);
			$this->smarty->render('pages/referance', $data);
		}
		
		public function sosyalprojeler(array $config = []){
			
			$scopeArray= array(
				'panel_sef' => 'scope'
			);
			$scope = $this->db->select("iwt_pages", $scopeArray, $relOpt = '=', $locOpt = 'and', $orderColumn = null, $orderOpt = null, $limit = null, $lmtStart = null);
			$scopeList = $this->db->select("iwt_pages_scope", array('status'=>0), $relOpt = '=', $locOpt = 'and', $orderColumn = "sort", $orderOpt = "asc", $limit = null, $lmtStart = null);
		
			if(!$scope){
				die($this->func->yonlendir(0, "/404"));
			}
			
			$data = array(
				'themelink' 		=> SITE_URL.'/'.THEME_FOLDER.'/'.DEF_FOLDER,
				'language' 			=> $this->lang,
				'session'	  		=> @$_SESSION['login'] == TRUE ? $_SESSION : FALSE,
				'settings'			=> @$this->ayarlar == TRUE ? $this->ayarlar[0] : FALSE,
				'scopeList'			=> @$scopeList == TRUE ? $scopeList : FALSE,
				'scope'				=> @$scope == TRUE ? $scope[0] : FALSE
			);
			$this->smarty->render('pages/scope', $data);
		}
		
		public function ik(array $config = []){
			
			$ikArray= array(
				'panel_sef' => 'humanresources'
			);
			$ik = $this->db->select("iwt_pages", $ikArray, $relOpt = '=', $locOpt = 'and', $orderColumn = null, $orderOpt = null, $limit = null, $lmtStart = null);
	
			if(!$ik){
				die($this->func->yonlendir(0, "/404"));
			}
			
			$data = array(
				'themelink' 		=> SITE_URL.'/'.THEME_FOLDER.'/'.DEF_FOLDER,
				'language' 			=> $this->lang,
				'session'	  		=> @$_SESSION['login'] == TRUE ? $_SESSION : FALSE,
				'settings'			=> @$this->ayarlar == TRUE ? $this->ayarlar[0] : FALSE,
				'ik'				=> @$ik == TRUE ? $ik[0] : FALSE
			);
			$this->smarty->render('pages/ik', $data);
		}
		
		
		public function makaleler(array $config = []){
			if(!empty($config['data']['sef']) AND !empty($config['data']['id'])){
				$ikArray= array(
					'id' => $config['data']['id'],
					'status' => 0
				);
				$ik = $this->db->select("iwt_pages_news", $ikArray, $relOpt = '=', $locOpt = 'and', $orderColumn = "sort", $orderOpt = "asc", $limit = null, $lmtStart = null);
				
				if(!$ik){
					die($this->func->yonlendir(0, "/404"));
				}
				
				$data = array(
					'themelink' 		=> SITE_URL.'/'.THEME_FOLDER.'/'.DEF_FOLDER,
					'language' 			=> $this->lang,
					'session'	  		=> @$_SESSION['login'] == TRUE ? $_SESSION : FALSE,
					'settings'			=> @$this->ayarlar == TRUE ? $this->ayarlar[0] : FALSE,
					'ik'				=> @$ik == TRUE ? $ik[0] : FALSE
				);
				$this->smarty->render('pages/newsDetay', $data);
				
			}else {
				$ikArray= array(
					'panel_sef' => 'news'
				);
				$ik = $this->db->select("iwt_pages", $ikArray, $relOpt = '=', $locOpt = 'and', $orderColumn = null, $orderOpt = null, $limit = null, $lmtStart = null);
				$newsList = $this->db->select("iwt_pages_news", array("status"=>0), $relOpt = '=', $locOpt = 'and', $orderColumn = "sort", $orderOpt = "asc", $limit = null, $lmtStart = null);
			
				if(!$ik){
					die($this->func->yonlendir(0, "/404"));
				}
				
				$data = array(
					'themelink' 		=> SITE_URL.'/'.THEME_FOLDER.'/'.DEF_FOLDER,
					'language' 			=> $this->lang,
					'session'	  		=> @$_SESSION['login'] == TRUE ? $_SESSION : FALSE,
					'settings'			=> @$this->ayarlar == TRUE ? $this->ayarlar[0] : FALSE,
					'ik'				=> @$ik == TRUE ? $ik[0] : FALSE,
					'newsList'			=> @$newsList == TRUE ? $newsList : FALSE
				);
				$this->smarty->render('pages/news', $data);
			}
		}
		
		public function etkinlikler(array $config = []){
			$ikArray= array(
				'panel_sef' => 'announcements'
			);
			$ik = $this->db->select("iwt_pages", $ikArray, $relOpt = '=', $locOpt = 'and', $orderColumn = null, $orderOpt = null, $limit = null, $lmtStart = null);
			$newsList = $this->db->select("iwt_pages_announcements", array("status"=>0), $relOpt = '=', $locOpt = 'and', $orderColumn = "sort", $orderOpt = "asc", $limit = null, $lmtStart = null);
			
			if(!$ik){
				die($this->func->yonlendir(0, "/404"));
			}
			
			$data = array(
				'themelink' 		=> SITE_URL.'/'.THEME_FOLDER.'/'.DEF_FOLDER,
				'language' 			=> $this->lang,
				'session'	  		=> @$_SESSION['login'] == TRUE ? $_SESSION : FALSE,
				'settings'			=> @$this->ayarlar == TRUE ? $this->ayarlar[0] : FALSE,
				'ik'				=> @$ik == TRUE ? $ik[0] : FALSE,
				'newsList'			=> @$newsList == TRUE ? $newsList : FALSE
			);
			$this->smarty->render('pages/announcements', $data);
		}
		
		public function galeri(array $config = []){
			if(!empty($config['data']['sef']) AND !empty($config['data']['id'])){
				$ikArray= array(
					'id' => $config['data']['id'],
					'status' => 0
				);
				$ik = $this->db->select("iwt_pages_gallery", $ikArray, $relOpt = '=', $locOpt = 'and', $orderColumn = null, $orderOpt = null, $limit = null, $lmtStart = null);

				if(!$ik){
					die($this->func->yonlendir(0, "/404"));
				}
				
				$data = array(
					'themelink' 		=> SITE_URL.'/'.THEME_FOLDER.'/'.DEF_FOLDER,
					'language' 			=> $this->lang,
					'session'	  		=> @$_SESSION['login'] == TRUE ? $_SESSION : FALSE,
					'settings'			=> @$this->ayarlar == TRUE ? $this->ayarlar[0] : FALSE,
					'ik'				=> @$ik == TRUE ? $ik[0] : FALSE,
					'galeri'			=> json_decode($ik[0]['gallery'], TRUE)['gallery'],
				);
				$this->smarty->render('pages/galleryDetay', $data);
				
			}else {
				$ikArray= array(
					'panel_sef' => 'gallery'
				);
				$ik = $this->db->select("iwt_pages", $ikArray, $relOpt = '=', $locOpt = 'and', $orderColumn = null, $orderOpt = null, $limit = null, $lmtStart = null);
				$newsList = $this->db->select("iwt_pages_gallery", array('status' => 0), $relOpt = '=', $locOpt = 'and', $orderColumn = "sort", $orderOpt = "asc", $limit = null, $lmtStart = null);
			
				if(!$ik){
					die($this->func->yonlendir(0, "/404"));
				}
				
				$data = array(
					'themelink' 		=> SITE_URL.'/'.THEME_FOLDER.'/'.DEF_FOLDER,
					'language' 			=> $this->lang,
					'session'	  		=> @$_SESSION['login'] == TRUE ? $_SESSION : FALSE,
					'settings'			=> @$this->ayarlar == TRUE ? $this->ayarlar[0] : FALSE,
					'ik'				=> @$ik == TRUE ? $ik[0] : FALSE,
					'newsList'			=> @$newsList == TRUE ? $newsList : FALSE
				);
				$this->smarty->render('pages/gallery', $data);
			}
		}
		
		public function basindabiz(array $config = []){
			if(!empty($config['data']['sef']) AND !empty($config['data']['id']) AND $config['data']['detay'] == 0){
				
				$services = $this->db->query("SELECT * FROM iwt_pages_press WHERE categorys LIKE '%".$config['data']['id']."%' AND status=0 order by sort asc")->fetchAll();
				$kategoriArray= array(
					'id' => $config['data']['id'],
					'status' => 0
				);
				$kategori = $this->db->select("iwt_pages_press_category", $kategoriArray, $relOpt = '=', $locOpt = 'and', $orderColumn = "sort", $orderOpt = "asc", $limit = null, $lmtStart = null);
				$serviskategorileri = $this->db->select("iwt_pages_press_category", NULL, $relOpt = '=', $locOpt = 'and', $orderColumn = "sort", $orderOpt = "asc", $limit = null, $lmtStart = null);
				$data = array(
					'themelink' 		=> SITE_URL.'/'.THEME_FOLDER.'/'.DEF_FOLDER,
					'language' 			=> $this->lang,
					'session'	  		=> @$_SESSION['login'] == TRUE ? $_SESSION : FALSE,
					'settings'			=> @$this->ayarlar == TRUE ? $this->ayarlar[0] : FALSE,
					'services'			=> @$services == TRUE ? $services : FALSE,
					'kategori'			=> @$kategori == TRUE ? $kategori[0] : FALSE,
					'kategoriler'		=> @$serviskategorileri == TRUE ? $serviskategorileri : FALSE
				);
				$this->smarty->render('pages/pressList', $data);
			}else if(!empty($config['data']['sef']) AND !empty($config['data']['id']) AND $config['data']['detay'] == 1){
				
				$kategoriArray= array(
					'id' => $config['data']['id'],
					'status' => 0
				);
				$kategori = $this->db->select("iwt_pages_press", $kategoriArray, $relOpt = '=', $locOpt = 'and', $orderColumn = "sort", $orderOpt = "asc", $limit = null, $lmtStart = null);
				$serviskategorileri = $this->db->select("iwt_pages_press_category", NULL, $relOpt = '=', $locOpt = 'and', $orderColumn = "sort", $orderOpt = "asc", $limit = null, $lmtStart = null);
				
				if(!$kategori){
					die($this->func->yonlendir(0, "/404"));
				}
				
				if($kategori){
					$data = array(
						'themelink' 		=> SITE_URL.'/'.THEME_FOLDER.'/'.DEF_FOLDER,
						'language' 			=> $this->lang,
						'session'	  		=> @$_SESSION['login'] == TRUE ? $_SESSION : FALSE,
						'settings'			=> @$this->ayarlar == TRUE ? $this->ayarlar[0] : FALSE,
						'services'			=> @$services == TRUE ? $services[0] : FALSE,
						'kategori'			=> @$kategori == TRUE ? $kategori[0] : FALSE,
						'kategoriler'		=> @$serviskategorileri == TRUE ? $serviskategorileri : FALSE,
						'galeri'			=> json_decode($kategori[0]['gallery'], TRUE)['gallery'],
						'videogaleri'		=> json_decode($kategori[0]['videogallery'], TRUE)['gallery'],
						'categorys'			=> json_decode($kategori[0]['categorys'], TRUE)
					);
					$this->smarty->render('pages/pressDetay', $data);
				}else {
					die($this->func->yonlendir(0, "/404"));
				}
				
			}else{
				$servicesArray= array(
					'panel_sef' => 'press'
				);
				$services = $this->db->select("iwt_pages", $servicesArray, $relOpt = '=', $locOpt = 'and', $orderColumn = null, $orderOpt = null, $limit = null, $lmtStart = null);
			
				$serviskategorileri = $this->db->select("iwt_pages_press_category", array('status'=>0), $relOpt = '=', $locOpt = 'and', $orderColumn = "sort", $orderOpt = "asc", $limit = null, $lmtStart = null);
			
				if(!$services){
					die($this->func->yonlendir(0, "/404"));
				}
			
				$data = array(
					'themelink' 		=> SITE_URL.'/'.THEME_FOLDER.'/'.DEF_FOLDER,
					'language' 			=> $this->lang,
					'session'	  		=> @$_SESSION['login'] == TRUE ? $_SESSION : FALSE,
					'settings'			=> @$this->ayarlar == TRUE ? $this->ayarlar[0] : FALSE,
					'services'			=> @$services == TRUE ? $services[0] : FALSE,
					'kategoriler'		=> @$serviskategorileri == TRUE ? $serviskategorileri : FALSE
				);
				$this->smarty->render('pages/press', $data);
			}
		}
		
		public function iletisim(array $config = []){
			
			if($_POST){
				if($this->security->name($config['data']['name']) == TRUE AND $this->security->email($config['data']['email']) == TRUE AND $this->security->num($config['data']['number']) == TRUE AND $this->security->text($config['data']['mesaj']) == TRUE){
					
					$pagesArray = array(
						'adsoyad' 	=> strip_tags($config['data']['name']),
						'telefon' 	=> strip_tags($config['data']['number']),
						'mesaj'		=> $this->func->sef($config['data']['mesaj']),
						'mailadresi'=> $this->func->sef($config['data']['email'])
					);
					
					$lowerAdd = $this->db->insert("iwt_pages_contact", $pagesArray);
					if($lowerAdd){
						//* Oluşturdukdan sonra Mail Gönder Aktivasyon Kodunu

							$body = "";
							$body .= "Ad Soyad:".$config['data']['name']."<br />";
							$body .= "Mail Adresi:".$config['data']['email']."<br />";
							$body .= "Telefon Numarası:".$config['data']['number']."<br />";
							$body .= "Mesaj:".$config['data']['mesaj']."<br />";

							$this->func->mailGonder([
								'email' => $config['data']['email'],
								'baslik' => "İletişim Bildirimi",
								'icerik' => $body
							]);
						
						echo '{ "status": "1", "message": "Mesajınız başarılı bir şekilde gönderildi!"}';
					}else {
						echo '{ "status": "0", "message": "Sistemsel bir hata oluştu lütfen tekrar deneyiniz!"}';
					}
				}else {
					echo '{ "status": "0", "message": "Lütfen form verilerini tekrar kontrol edin!"}';
				}
				
			}else {
				$ikArray= array(
					'panel_sef' => 'contact'
				);
				$ik = $this->db->select("iwt_pages", $ikArray, $relOpt = '=', $locOpt = 'and', $orderColumn = null, $orderOpt = null, $limit = null, $lmtStart = null);
		
		
				
				$data = array(
					'themelink' 		=> SITE_URL.'/'.THEME_FOLDER.'/'.DEF_FOLDER,
					'language' 			=> $this->lang,
					'session'	  		=> @$_SESSION['login'] == TRUE ? $_SESSION : FALSE,
					'settings'			=> @$this->ayarlar == TRUE ? $this->ayarlar[0] : FALSE,
					'ik'				=> @$ik == TRUE ? $ik[0] : FALSE
				);
				$this->smarty->render('pages/iletisim', $data);
			}
		}
		
		public function dusunceleriniz(array $config = []){
			//print_r($this->ayarlar);
			$ikArray= array(
				'panel_sef' => 'thoughts'
			);
			$ik = $this->db->select("iwt_pages", $ikArray, $relOpt = '=', $locOpt = 'and', $orderColumn = null, $orderOpt = null, $limit = null, $lmtStart = null);
	
			//* Ana Sayfa detayları
			$thoughts = $this->db->select("iwt_pages_thoughts", array("status"=>0), $relOpt = '=', $locOpt = 'and', $orderColumn = "date", $orderOpt = "desc", $limit = null, $lmtStart = null);
		
			if(!$ik){
				die($this->func->yonlendir(0, "/404"));
			}
		
			$data = array(
				'themelink' 		=> SITE_URL.'/'.THEME_FOLDER.'/'.DEF_FOLDER,
				'language' 			=> $this->lang,
				'function' 			=> $this->func,
				'session'	  		=> @$_SESSION['login'] == TRUE ? $_SESSION : FALSE,
				'settings'			=> @$this->ayarlar == TRUE ? $this->ayarlar[0] : FALSE,
				'thoughts'				=> @$thoughts == TRUE ? $thoughts : FALSE,
				'ik'				=> @$ik == TRUE ? $ik[0] : FALSE
			);
			$this->smarty->render('pages/thoughts', $data);
		}
		
		public function error(array $config = []){
			//print_r($this->ayarlar);
			
			$data = array(
				'themelink' 		=> SITE_URL.'/'.THEME_FOLDER.'/'.DEF_FOLDER,
				'language' 			=> $this->lang
			);
			$this->smarty->render('pages/404', $data);
		}
		
		public function sitemap(array $config = []){
			header('Content-type: text/xml');
			$domainadi = $_SERVER['SERVER_NAME'];

			echo "<?xml version=\"1.0\" encoding=\"ISO-8859-9\" ?>";
			echo "<urlset xmlns=\"http://www.google.com/schemas/sitemap/0.84\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xsi:schemaLocation=\"http://www.google.com/schemas/sitemap/0.84 http://www.google.com/schemas/sitemap/0.84/sitemap.xsd\">";
		
			$date = date("Y-m-d");
			
			echo "<url>";
				echo "<loc>http://".$domainadi."</loc>";
				echo "<lastmod>".$date."</lastmod>";
				echo "<changefreq>daily</changefreq>";
				echo "<priority>1</priority>";
			echo "</url>";
			
			//* Hakkımızda
			echo "<url>";
				echo "<loc>http://".$domainadi."/hakkimizda</loc>";
				echo "<lastmod>".$date."</lastmod>";
			echo "</url>";
			//* Hizmetlerimiz
			echo "<url>";
				echo "<loc>http://".$domainadi."/hizmetlerimiz</loc>";
				echo "<lastmod>".$date."</lastmod>";
			echo "</url>"; 
			//* Hizmetlerimiz Kategoriler
				$hizmetkategorileriarray = array(
					'ustkategori' => 0
				);
				$hizmetkategoriler = $this->db->select("iwt_pages_services_category", $hizmetkategorileriarray, $relOpt = '=', $locOpt = 'and', $orderColumn = null, $orderOpt = null, $limit = null, $lmtStart = null);
				foreach($hizmetkategoriler as $hizmetkategori){
					echo "<url>";
						echo "<loc>http://".$domainadi."/hizmetlerimiz/".$hizmetkategori['sef']."-".$hizmetkategori['id']."</loc>";
						echo "<lastmod>".$date."</lastmod>";
					echo "</url>"; 	
				}
			//* Hizmetlerimiz tüm sayfalar
				$hizmetsayfalar = $this->db->select("iwt_pages_services", NULL, $relOpt = '=', $locOpt = 'and', $orderColumn = null, $orderOpt = null, $limit = null, $lmtStart = null);
				foreach($hizmetsayfalar as $hizmetsayfa){
					echo "<url>";
						echo "<loc>http://".$domainadi."/hizmetlerimiz/detay/".$hizmetsayfa['sef']."-".$hizmetsayfa['id']."</loc>";
						echo "<lastmod>".$date."</lastmod>";
					echo "</url>"; 	
				} 	
				
			//* Referanslar
			echo "<url>";
				echo "<loc>http://".$domainadi."/referanslar</loc>";
				echo "<lastmod>".$date."</lastmod>";
			echo "</url>"; 
			//* Galeri
			echo "<url>";
				echo "<loc>http://".$domainadi."/galeri</loc>";
				echo "<lastmod>".$date."</lastmod>";
			echo "</url>";
			//* Galeri tüm sayfalar
				$galerisayfalar = $this->db->select("iwt_pages_gallery", NULL, $relOpt = '=', $locOpt = 'and', $orderColumn = null, $orderOpt = null, $limit = null, $lmtStart = null);
				foreach($galerisayfalar as $galerisayfa){
					echo "<url>";
						echo "<loc>http://".$domainadi."/galeri/detay/".$galerisayfa['sef']."-".$galerisayfa['id']."</loc>";
						echo "<lastmod>".$date."</lastmod>";
					echo "</url>"; 	
				} 
			//* Sosyal Projeler
			echo "<url>";
				echo "<loc>http://".$domainadi."/sosyalprojeler</loc>";
				echo "<lastmod>".$date."</lastmod>";
			echo "</url>"; 
			//* İnsan Kaynakları
			echo "<url>";
				echo "<loc>http://".$domainadi."/ik</loc>";
				echo "<lastmod>".$date."</lastmod>";
			echo "</url>"; 
			//* İletişim
			echo "<url>";
				echo "<loc>http://".$domainadi."/iletisim</loc>";
				echo "<lastmod>".$date."</lastmod>";
			echo "</url>"; 
			//* Bilinçli Ebeveynler
			echo "<url>";
				echo "<loc>http://".$domainadi."/bilincli-ebeveynler</loc>";
				echo "<lastmod>".$date."</lastmod>";
			echo "</url>"; 
			//* Makaleler
			echo "<url>";
				echo "<loc>http://".$domainadi."/makaleler</loc>";
				echo "<lastmod>".$date."</lastmod>";
			echo "</url>"; 
			//* Makale tüm sayfalar
				$makalesayfalar = $this->db->select("iwt_pages_news", NULL, $relOpt = '=', $locOpt = 'and', $orderColumn = null, $orderOpt = null, $limit = null, $lmtStart = null);
				foreach($makalesayfalar as $makalesayfa){
					echo "<url>";
						echo "<loc>http://".$domainadi."/makaleler/detay/".$makalesayfa['sef']."-".$makalesayfa['id']."</loc>";
						echo "<lastmod>".$date."</lastmod>";
					echo "</url>"; 	
				} 
			//* Etkinlikler
			echo "<url>";
				echo "<loc>http://".$domainadi."/etkinlikler</loc>";
				echo "<lastmod>".$date."</lastmod>";
			echo "</url>"; 
			//* Düşünceleriniz
			echo "<url>";
				echo "<loc>http://".$domainadi."/dusunceleriniz</loc>";
				echo "<lastmod>".$date."</lastmod>";
			echo "</url>"; 
			//* Basında Biz
			echo "<url>";
				echo "<loc>http://".$domainadi."/basindabiz</loc>";
				echo "<lastmod>".$date."</lastmod>";
			echo "</url>";
			//* Basında Biz tüm kategoriler
				$basinkategoriler = $this->db->select("iwt_pages_press_category", NULL, $relOpt = '=', $locOpt = 'and', $orderColumn = null, $orderOpt = null, $limit = null, $lmtStart = null);
				foreach($basinkategoriler as $basinkategori){
					echo "<url>";
						echo "<loc>http://".$domainadi."/basindabiz/".$basinkategori['sef']."-".$basinkategori['id']."</loc>";
						echo "<lastmod>".$date."</lastmod>";
					echo "</url>"; 	
				}
			//* Basında Biz tüm sayfalar
				$basinsayfalar = $this->db->select("iwt_pages_press", NULL, $relOpt = '=', $locOpt = 'and', $orderColumn = null, $orderOpt = null, $limit = null, $lmtStart = null);
				foreach($basinsayfalar as $basinsayfa){
					echo "<url>";
						echo "<loc>http://".$domainadi."/basindabiz/detay/".$basinsayfa['sef']."-".$basinsayfa['id']."</loc>";
						echo "<lastmod>".$date."</lastmod>";
					echo "</url>"; 	
				}
		
			echo "</urlset>";
			
		}
	}
?>