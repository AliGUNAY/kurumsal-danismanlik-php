<?
/**
 * @author	iwt web tasrım
 * @copyright	Copyright (c) 2016, Developer Ahmet ÖZALP (www.ahmetozalp.net)
 * @link	http://www.iwt.com.tr
 * @since	Version 1.0.0
**/


	class controller{
		
		
		public $izinlitag 	= "<iframe><p><center><br><div><h1><h2><h3><h4><h5><h6><b><s><em><span><a><img><br><div><embed><font><hr><i><input><label<blockquote><strong><ul><li><img>";
		public $dil			= "en";

		
		public function __construct(array $config = []){
			$this->smarty = new SMTemplate();
			$this->db = new database();
			$this->func = new functions();
			$this->security = new phpSecurityClass();;
			$this->csrf = new CSRF();
			
			
			$this->lang = NULL;
			
			if(@$_GET['page']){
				$varmiarray= array(
					//'status' => 0
				);
				
				$this->menu 	= $this->db->select("iwt_pages", $varmiarray, $relOpt = '=', $locOpt = 'and', $orderColumn = "sort", $orderOpt = null, $limit = null, $lmtStart = null);
			//	$this->altmenu 	= $this->db->query("SELECT * FROM iwt_pages_corporate")->fetchAll();
	
			}
			
			$ayarlarArray= array(
				'id' => 1
			);
			$this->ayarlar = $this->db->select("iwt_settings", $ayarlarArray, $relOpt = '=', $locOpt = 'and', $orderColumn = null, $orderOpt = null, $limit = null, $lmtStart = null);
		}
		

		//* Admin Paneli
		function admin_login(array $config = []){
			if($_POST){
				$form_names = $this->csrf->form_names($config['data'], false);
				if(!empty($config['data']['user']) AND !empty($config['data']['pass'])){
					if($this->security->nickname($config['data']['user']) == TRUE AND $this->security->password($config['data']['pass']) == TRUE){
						
						$varmiarray= array(
							'username' => $config['data']['user'],
							'password' => $this->security->password($config['data']['pass']),
							'status' => 1
						);
						
						$varmi = $this->db->select("iwt_users", $varmiarray, $relOpt = '=', $locOpt = 'and', $orderColumn = null, $orderOpt = null, $limit = null, $lmtStart = null);
						if(count($varmi) > 0){
							if($this->csrf->check_valid('post')) {
								$_SESSION['login'] 		= TRUE;
								$_SESSION['id'] 		= $varmi[0][0];
								$_SESSION['username'] 	= $varmi[0][1];
								$_SESSION['image'] 		= $varmi[0]['image'];
								
								$data = array(
									'language'			=> $this->lang,
									'status'			=> 1,
									'message'			=> "Giriş Başarılı Lütfen Bekleyiniz!"
								);
								$this->csrf->form_names($config['data'], true);
							}else {
								$data = array(
									'language'			=> $this->lang,
									'status'			=> 0,
									'message'			=> "Güvenlik Ağına Takıldınız!"
								);
							}
							
						}else {
							$data = array(
								'language'			=> $this->lang,
								'status'			=> 0,
								'message'			=> "Giriş bilgileri hatali lütfen tekrar deneyiniz!"
							);
						}
					}else {
						$data = array(
							'language'			=> $this->lang,
							'status'			=> 0,
							'message'			=> "Giriş bilgileri hatali lütfen tekrar deneyiniz!"
						);
					}
				}else {
					$data = array(
						'language'			=> $this->lang,
						'status'			=> 0,
						'message'			=> "Lütfen tüm alanları doldurunuz!"
					);
				}
				
				$this->smarty->render('json', $data);
			}else {
				
				$token_id = $this->csrf->get_token_id();
				$token_value = $this->csrf->get_token($token_id);
				
				$data = array(
					'themelink' 		=> SITE_URL.'/'.THEME_FOLDER.'/'.ADMIN_FOLDER,
					'language' 			=> $this->lang,
					'session'	  		=> @$_SESSION['login'] == TRUE ? $_SESSION : FALSE,
					'token'				=> $token_value,
					'tokenID'			=> $token_id
				);
				
				$this->smarty->render('login', $data);
			}
		}
		
		function panel(array $config = []){
			if($_POST){
		
			}else {
				$token_id = $this->csrf->get_token_id();
				$token_value = $this->csrf->get_token($token_id);
				
				$data = array(
					'themelink' 		=> SITE_URL.'/'.THEME_FOLDER.'/'.ADMIN_FOLDER,
					'language' 			=> $this->lang,
					'session'	  		=> @$_SESSION['login'] == TRUE ? $_SESSION : FALSE,
					'token'				=> $token_value,
					'tokenID'			=> $token_id
				);
				
				$this->smarty->render('panel', $data);
			}
		}
		
		function panel_homepage(array $config = []){
			if($_POST){
				$form_names = $this->csrf->form_names($config['data'], false);
					if(!empty($config['data']['seo_title'])){
						if($this->security->text($config['data']['seo_title']) == TRUE AND $this->security->text($config['data']['seo_keyword']) == TRUE AND $this->security->text($config['data']['seo_description']) == TRUE){
						
							
						
							$pagesArray = array(
								'seo_title' => strip_tags($config['data']['seo_title']),
								'seo_keyword' => strip_tags($config['data']['seo_keyword']),
								'seo_description' => strip_tags($config['data']['seo_description']),
								'modules' => strip_tags($config['data']['modules']),
								'content' => strip_tags($config['data']['content'], $this->izinlitag)
							);
							
							$where = "1";
							$pagesUPDATE = $this->db->update("iwt_pages", $pagesArray , $where);
							if($pagesUPDATE){
								if($this->csrf->check_valid('post')) {
									$data = array(
										'language'			=> $this->lang,
										'status'			=> 1,
										'message'			=> "Tüm ayarlar güncellendi!"
									);
									$this->csrf->form_names($config['data'], true);
								}else {
									$data = array(
										'language'			=> $this->lang,
										'status'			=> 0,
										'message'			=> "Güvenlik Ağına Takıldınız!"
									);
								}
								
							}else {
								$data = array(
									'language'			=> $this->lang,
									'status'			=> 0,
									'message'			=> "Tüm ayarlar güncellendi!"
								);
							}
						
						}else {
							$data = array(
								'language'			=> $this->lang,
								'status'			=> 0,
								'message'			=> "Lütfen kutulardakı verileri tekrar kontrol ediniz!"
							);
						}
					}else {
						$data = array(
							'language'			=> $this->lang,
							'status'			=> 0,
							'message'			=> "Lütfen tüm alanları doldurunuz!"
						);	
					}
					$this->smarty->render('json', $data);
			}else {
				$getsayfaadi = end(explode("/", $_GET['page']));
				
				$settingsArray= array(
					'panel_sef' => $getsayfaadi
				);
				$homepage = $this->db->select("iwt_pages", $settingsArray, $relOpt = '=', $locOpt = 'and', $orderColumn = null, $orderOpt = null, $limit = null, $lmtStart = null);
				
				$token_id = $this->csrf->get_token_id();
				$token_value = $this->csrf->get_token($token_id);
				
				$data = array(
					'themelink' 		=> SITE_URL.'/'.THEME_FOLDER.'/'.ADMIN_FOLDER,
					'language' 			=> $this->lang,
					'session'	  		=> @$_SESSION['login'] == TRUE ? $_SESSION : FALSE,
					'token'				=> $token_value,
					'tokenID'			=> $token_id,
					'homepage'			=> @count($homepage) > 0 ? $homepage[0] : FALSE,
					'modules'			=> json_decode($homepage[0]['modules'], TRUE)['modules'],
					'menu'				=> @count($this->menu) > 0 ? $this->menu : FALSE
				);
				
				$this->smarty->render('pages/'.$getsayfaadi.'/index', $data);
			}
		}
		
		function panel_about(array $config = []){
			if($_POST){
				$form_names = $this->csrf->form_names($config['data'], false);
					if(!empty($config['data']['seo_title'])){
						if($this->security->text($config['data']['seo_title']) == TRUE AND $this->security->text($config['data']['seo_keyword']) == TRUE AND $this->security->text($config['data']['seo_description']) == TRUE){
						
							$getsayfaadi = end(explode("/", $_GET['page']));
							
							$pagesArray = array(
								'seo_title' => strip_tags($config['data']['seo_title']),
								'seo_keyword' => strip_tags($config['data']['seo_keyword']),
								'seo_description' => strip_tags($config['data']['seo_description']),
								'content' => strip_tags($config['data']['content'], $this->izinlitag)
							);
							
							if(@$config['data']['photoReset'] === "on"){				
								if(!@$_FILES['photo']){
									$pagesArray['photo'] = "";
								}
							}
							
							if(@$_FILES['photo']){
								$this->upload = new upload($_FILES['photo']);
								if ($this->upload->uploaded) {
									$this->upload->file_new_name_body = uniqid() .'-'. rand(0,100000);
									$this->upload->image_convert = 'jpg';
									
									// yeniden farklı boyutta kayıt et
									/*$this->upload->image_resize = true;
									$this->upload->image_ratio_crop = true;
									$this->upload->image_x = 1000;
									$this->upload->image_y = 540;*/
									
									$this->upload->allowed = array ('image/*');
									$this->upload->Process("../".UPLOAD_FOLDER."/photo/");
									if ($this->upload->processed) {
										$pagesArray['photo'] = $this->upload->file_dst_name;
									}
								}
							}
							
							$pagesUPDATE = $this->db->update("iwt_pages", $pagesArray , array('panel_sef' => $getsayfaadi));
							if($pagesUPDATE){
								if($this->csrf->check_valid('post')) {
									$data = array(
										'language'			=> $this->lang,
										'status'			=> 1,
										'message'			=> "Tüm ayarlar güncellendi!"
									);
									$this->csrf->form_names($config['data'], true);
								}else {
									$data = array(
										'language'			=> $this->lang,
										'status'			=> 0,
										'message'			=> "Güvenlik Ağına Takıldınız!"
									);
								}
								
							}else {
								$data = array(
									'language'			=> $this->lang,
									'status'			=> 0,
									'message'			=> "Tüm ayarlar güncellendi!"
								);
							}
						
						}else {
							$data = array(
								'language'			=> $this->lang,
								'status'			=> 0,
								'message'			=> "Lütfen kutulardakı verileri tekrar kontrol ediniz!"
							);
						}
					}else {
						$data = array(
							'language'			=> $this->lang,
							'status'			=> 0,
							'message'			=> "Lütfen tüm alanları doldurunuz!"
						);	
					}
					$this->smarty->render('json', $data);
			}else {
				$getsayfaadi = end(explode("/", $_GET['page']));
				
				$settingsArray= array(
					'panel_sef' => $getsayfaadi
				);
				$homepage = $this->db->select("iwt_pages", $settingsArray, $relOpt = '=', $locOpt = 'and', $orderColumn = null, $orderOpt = null, $limit = null, $lmtStart = null);
				
				$token_id = $this->csrf->get_token_id();
				$token_value = $this->csrf->get_token($token_id);
				
				$data = array(
					'themelink' 		=> SITE_URL.'/'.THEME_FOLDER.'/'.ADMIN_FOLDER,
					'language' 			=> $this->lang,
					'session'	  		=> @$_SESSION['login'] == TRUE ? $_SESSION : FALSE,
					'token'				=> $token_value,
					'tokenID'			=> $token_id,
					'homepage'			=> @count($homepage) > 0 ? $homepage[0] : FALSE,
					'menu'				=> @count($this->menu) > 0 ? $this->menu : FALSE
				);
				
				$this->smarty->render('pages/'.$getsayfaadi.'/index', $data);
			}
		}
		
		function panel_consciousparents(array $config = []){
			if($_POST){
				$form_names = $this->csrf->form_names($config['data'], false);
					if(!empty($config['data']['seo_title'])){
						if($this->security->text($config['data']['seo_title']) == TRUE AND $this->security->text($config['data']['seo_keyword']) == TRUE AND $this->security->text($config['data']['seo_description']) == TRUE){
						
							$getsayfaadi = end(explode("/", $_GET['page']));
							
							$pagesArray = array(
								'seo_title' => strip_tags($config['data']['seo_title']),
								'seo_keyword' => strip_tags($config['data']['seo_keyword']),
								'seo_description' => strip_tags($config['data']['seo_description']),
								'content' => strip_tags($config['data']['content'], $this->izinlitag)
							);
							
							if(@$config['data']['photoReset'] === "on"){				
								if(!@$_FILES['photo']){
									$pagesArray['photo'] = "";
								}
							}
							
							if(@$_FILES['photo']){
								$this->upload = new upload($_FILES['photo']);
								if ($this->upload->uploaded) {
									$this->upload->file_new_name_body = uniqid() .'-'. rand(0,100000);
									$this->upload->image_convert = 'jpg';
									
									// yeniden farklı boyutta kayıt et
									/*$this->upload->image_resize = true;
									$this->upload->image_ratio_crop = true;
									$this->upload->image_x = 1000;
									$this->upload->image_y = 540;*/
									
									$this->upload->allowed = array ('image/*');
									$this->upload->Process("../".UPLOAD_FOLDER."/photo/");
									if ($this->upload->processed) {
										$pagesArray['photo'] = $this->upload->file_dst_name;
									}
								}
							}
							
							$pagesUPDATE = $this->db->update("iwt_pages", $pagesArray , array('panel_sef' => $getsayfaadi));
							if($pagesUPDATE){
								if($this->csrf->check_valid('post')) {
									$data = array(
										'language'			=> $this->lang,
										'status'			=> 1,
										'message'			=> "Tüm ayarlar güncellendi!"
									);
									$this->csrf->form_names($config['data'], true);
								}else {
									$data = array(
										'language'			=> $this->lang,
										'status'			=> 0,
										'message'			=> "Güvenlik Ağına Takıldınız!"
									);
								}
								
							}else {
								$data = array(
									'language'			=> $this->lang,
									'status'			=> 0,
									'message'			=> "Tüm ayarlar güncellendi!"
								);
							}
						
						}else {
							$data = array(
								'language'			=> $this->lang,
								'status'			=> 0,
								'message'			=> "Lütfen kutulardakı verileri tekrar kontrol ediniz!"
							);
						}
					}else {
						$data = array(
							'language'			=> $this->lang,
							'status'			=> 0,
							'message'			=> "Lütfen tüm alanları doldurunuz!"
						);	
					}
					$this->smarty->render('json', $data);
			}else {
				$getsayfaadi = end(explode("/", $_GET['page']));
				
				$settingsArray= array(
					'panel_sef' => $getsayfaadi
				);
				$homepage = $this->db->select("iwt_pages", $settingsArray, $relOpt = '=', $locOpt = 'and', $orderColumn = null, $orderOpt = null, $limit = null, $lmtStart = null);
				
				$token_id = $this->csrf->get_token_id();
				$token_value = $this->csrf->get_token($token_id);
				
				$data = array(
					'themelink' 		=> SITE_URL.'/'.THEME_FOLDER.'/'.ADMIN_FOLDER,
					'language' 			=> $this->lang,
					'session'	  		=> @$_SESSION['login'] == TRUE ? $_SESSION : FALSE,
					'token'				=> $token_value,
					'tokenID'			=> $token_id,
					'homepage'			=> @count($homepage) > 0 ? $homepage[0] : FALSE,
					'menu'				=> @count($this->menu) > 0 ? $this->menu : FALSE
				);
				
				$this->smarty->render('pages/'.$getsayfaadi.'/index', $data);
			}
		}
		
		function panel_enterprisesloves(array $config = []){
			if($_POST){
				$form_names = $this->csrf->form_names($config['data'], false);
					if(!empty($config['data']['seo_title'])){
						if($this->security->text($config['data']['seo_title']) == TRUE AND $this->security->text($config['data']['seo_keyword']) == TRUE AND $this->security->text($config['data']['seo_description']) == TRUE){
						
							$getsayfaadi = end(explode("/", $_GET['page']));
							
							$pagesArray = array(
								'seo_title' => strip_tags($config['data']['seo_title']),
								'seo_keyword' => strip_tags($config['data']['seo_keyword']),
								'seo_description' => strip_tags($config['data']['seo_description']),
								'content' => strip_tags($config['data']['content'], $this->izinlitag)
							);
							
							if(@$config['data']['photoReset'] === "on"){				
								if(!@$_FILES['photo']){
									$pagesArray['photo'] = "";
								}
							}
							
							if(@$_FILES['photo']){
								$this->upload = new upload($_FILES['photo']);
								if ($this->upload->uploaded) {
									$this->upload->file_new_name_body = uniqid() .'-'. rand(0,100000);
									$this->upload->image_convert = 'jpg';
									
									// yeniden farklı boyutta kayıt et
									/*$this->upload->image_resize = true;
									$this->upload->image_ratio_crop = true;
									$this->upload->image_x = 1000;
									$this->upload->image_y = 540;*/
									
									$this->upload->allowed = array ('image/*');
									$this->upload->Process("../".UPLOAD_FOLDER."/photo/");
									if ($this->upload->processed) {
										$pagesArray['photo'] = $this->upload->file_dst_name;
									}
								}
							}
							
							$pagesUPDATE = $this->db->update("iwt_pages", $pagesArray , array('panel_sef' => $getsayfaadi));
							if($pagesUPDATE){
								if($this->csrf->check_valid('post')) {
									$data = array(
										'language'			=> $this->lang,
										'status'			=> 1,
										'message'			=> "Tüm ayarlar güncellendi!"
									);
									$this->csrf->form_names($config['data'], true);
								}else {
									$data = array(
										'language'			=> $this->lang,
										'status'			=> 0,
										'message'			=> "Güvenlik Ağına Takıldınız!"
									);
								}
								
							}else {
								$data = array(
									'language'			=> $this->lang,
									'status'			=> 0,
									'message'			=> "Tüm ayarlar güncellendi!"
								);
							}
						
						}else {
							$data = array(
								'language'			=> $this->lang,
								'status'			=> 0,
								'message'			=> "Lütfen kutulardakı verileri tekrar kontrol ediniz!"
							);
						}
					}else {
						$data = array(
							'language'			=> $this->lang,
							'status'			=> 0,
							'message'			=> "Lütfen tüm alanları doldurunuz!"
						);	
					}
					$this->smarty->render('json', $data);
			}else {
				$getsayfaadi = end(explode("/", $_GET['page']));
				
				$settingsArray= array(
					'panel_sef' => $getsayfaadi
				);
				$homepage = $this->db->select("iwt_pages", $settingsArray, $relOpt = '=', $locOpt = 'and', $orderColumn = null, $orderOpt = null, $limit = null, $lmtStart = null);
				
				$token_id = $this->csrf->get_token_id();
				$token_value = $this->csrf->get_token($token_id);
				
				$data = array(
					'themelink' 		=> SITE_URL.'/'.THEME_FOLDER.'/'.ADMIN_FOLDER,
					'language' 			=> $this->lang,
					'session'	  		=> @$_SESSION['login'] == TRUE ? $_SESSION : FALSE,
					'token'				=> $token_value,
					'tokenID'			=> $token_id,
					'homepage'			=> @count($homepage) > 0 ? $homepage[0] : FALSE,
					'menu'				=> @count($this->menu) > 0 ? $this->menu : FALSE
				);
				
				$this->smarty->render('pages/'.$getsayfaadi.'/index', $data);
			}
		}
		
		function panel_humanresources(array $config = []){
			if($_POST){
				$form_names = $this->csrf->form_names($config['data'], false);
					if(!empty($config['data']['seo_title'])){
						if($this->security->text($config['data']['seo_title']) == TRUE AND $this->security->text($config['data']['seo_keyword']) == TRUE AND $this->security->text($config['data']['seo_description']) == TRUE){
						
							$getsayfaadi = end(explode("/", $_GET['page']));
						
							$pagesArray = array(
								'seo_title' => strip_tags($config['data']['seo_title']),
								'seo_keyword' => strip_tags($config['data']['seo_keyword']),
								'seo_description' => strip_tags($config['data']['seo_description']),
								'content' => strip_tags($config['data']['content'], $this->izinlitag)
							);
							
							if(@$config['data']['photoReset'] === "on"){				
								if(!@$_FILES['photo']){
									$pagesArray['photo'] = "";
								}
							}
							
							if(@$_FILES['photo']){
								$this->upload = new upload($_FILES['photo']);
								if ($this->upload->uploaded) {
									$this->upload->file_new_name_body = uniqid() .'-'. rand(0,100000);
									$this->upload->image_convert = 'jpg';
									
									// yeniden farklı boyutta kayıt et
									/*$this->upload->image_resize = true;
									$this->upload->image_ratio_crop = true;
									$this->upload->image_x = 1000;
									$this->upload->image_y = 540;*/
									
									$this->upload->allowed = array ('image/*');
									$this->upload->Process("../".UPLOAD_FOLDER."/photo/");
									if ($this->upload->processed) {
										$pagesArray['photo'] = $this->upload->file_dst_name;
									}
								}
								
							}
							
							$pagesUPDATE = $this->db->update("iwt_pages", $pagesArray , array('panel_sef' => $getsayfaadi));
							if($pagesUPDATE){
								if($this->csrf->check_valid('post')) {
									$data = array(
										'language'			=> $this->lang,
										'status'			=> 1,
										'message'			=> "Tüm ayarlar güncellendi!"
									);
									$this->csrf->form_names($config['data'], true);
								}else {
									$data = array(
										'language'			=> $this->lang,
										'status'			=> 0,
										'message'			=> "Güvenlik Ağına Takıldınız!"
									);
								}
								
							}else {
								$data = array(
									'language'			=> $this->lang,
									'status'			=> 0,
									'message'			=> "Tüm ayarlar güncellendi!"
								);
							}
						
						}else {
							$data = array(
								'language'			=> $this->lang,
								'status'			=> 0,
								'message'			=> "Lütfen kutulardakı verileri tekrar kontrol ediniz!"
							);
						}
					}else {
						$data = array(
							'language'			=> $this->lang,
							'status'			=> 0,
							'message'			=> "Lütfen tüm alanları doldurunuz!"
						);	
					}
					$this->smarty->render('json', $data);
			}else {
				$getsayfaadi = end(explode("/", $_GET['page']));
				
				$settingsArray= array(
					'panel_sef' => $getsayfaadi
				);
				$homepage = $this->db->select("iwt_pages", $settingsArray, $relOpt = '=', $locOpt = 'and', $orderColumn = null, $orderOpt = null, $limit = null, $lmtStart = null);
				
				$token_id = $this->csrf->get_token_id();
				$token_value = $this->csrf->get_token($token_id);
				
				$data = array(
					'themelink' 		=> SITE_URL.'/'.THEME_FOLDER.'/'.ADMIN_FOLDER,
					'language' 			=> $this->lang,
					'session'	  		=> @$_SESSION['login'] == TRUE ? $_SESSION : FALSE,
					'token'				=> $token_value,
					'tokenID'			=> $token_id,
					'homepage'			=> @count($homepage) > 0 ? $homepage[0] : FALSE,
					'menu'				=> @count($this->menu) > 0 ? $this->menu : FALSE
				);
				
				$this->smarty->render('pages/'.$getsayfaadi.'/index', $data);
			}
		}
	
		//* services
		
		function panel_services(array $config = []){
			if($_POST){
				$form_names = $this->csrf->form_names($config['data'], false);
					if(!empty($config['data']['seo_title'])){
						if($this->security->text($config['data']['seo_title']) == TRUE AND $this->security->text($config['data']['seo_keyword']) == TRUE AND $this->security->text($config['data']['seo_description']) == TRUE AND $this->security->num($config['data']['homepagestatus']) == TRUE){
						
							$pagesArray = array(
								'seo_title' => strip_tags($config['data']['seo_title']),
								'seo_keyword' => strip_tags($config['data']['seo_keyword']),
								'seo_description' => strip_tags($config['data']['seo_description']),
								'content' => strip_tags($config['data']['content'], $this->izinlitag),
								'homepagestatus' => (@$config['data']['homepagestatus'] == 1 ? 1 : 0 )
							);
							
							if(@$config['data']['photoReset'] === "on"){				
								if(!@$_FILES['photo']){
									$pagesArray['photo'] = "";
								}
							}
							
							if(@$_FILES['photo']){
								$this->upload = new upload($_FILES['photo']);
								if ($this->upload->uploaded) {
									$this->upload->file_new_name_body = uniqid() .'-'. rand(0,100000);
									$this->upload->image_convert = 'jpg';
									
									// yeniden farklı boyutta kayıt et
									/*$this->upload->image_resize = true;
									$this->upload->image_ratio_crop = true;
									$this->upload->image_x = 1000;
									$this->upload->image_y = 540;*/
									
									$this->upload->allowed = array ('image/*');
									$this->upload->Process("../".UPLOAD_FOLDER."/photo/");
									if ($this->upload->processed) {
										$pagesArray['photo'] = $this->upload->file_dst_name;
									}
								}
								
							}
							
							$where = 7;
							$pagesUPDATE = $this->db->update("iwt_pages", $pagesArray , $where);
							if($pagesUPDATE){
								if($this->csrf->check_valid('post')) {
									$data = array(
										'language'			=> $this->lang,
										'status'			=> 1,
										'message'			=> "Tüm ayarlar güncellendi!"
									);
									$this->csrf->form_names($config['data'], true);
								}else {
									$data = array(
										'language'			=> $this->lang,
										'status'			=> 0,
										'message'			=> "Güvenlik Ağına Takıldınız!"
									);
								}
							}else {
								$data = array(
									'language'			=> $this->lang,
									'status'			=> 1,
									'message'			=> "Tüm ayarlar güncellendi!"
								);
							}
						
						}else {
							$data = array(
								'language'			=> $this->lang,
								'status'			=> 0,
								'message'			=> "Lütfen kutulardakı verileri tekrar kontrol ediniz!"
							);
						}
					}else {
						$data = array(
							'language'			=> $this->lang,
							'status'			=> 0,
							'message'			=> "Lütfen tüm alanları doldurunuz!"
						);	
					}
					$this->smarty->render('json', $data);
			}else {
				
				//* Sayfayı çek
				$settingsArray= array(
					'id' => 7
				);
				$corporate = $this->db->select("iwt_pages", $settingsArray, $relOpt = '=', $locOpt = 'and', $orderColumn = null, $orderOpt = null, $limit = null, $lmtStart = null);
				
				//* Alt Sayfaları Çek
				
				$productsArray= array(
					'page_id' => $corporate[0]["id"]
				);
				$products = $this->db->select("iwt_pages_services", $productsArray, $relOpt = '=', $locOpt = 'and', $orderColumn = 'sort', $orderOpt = 'asc', $limit = null, $lmtStart = null);
				$category = $this->db->select("iwt_pages_services_category", "", $relOpt = '=', $locOpt = 'and', $orderColumn = 'sort', $orderOpt = 'asc', $limit = null, $lmtStart = null);

				
				
				$token_id = $this->csrf->get_token_id();
				$token_value = $this->csrf->get_token($token_id);
				
				$data = array(
					'themelink' 		=> SITE_URL.'/'.THEME_FOLDER.'/'.ADMIN_FOLDER,
					'language' 			=> $this->lang,
					'session'	  		=> @$_SESSION['login'] == TRUE ? $_SESSION : FALSE,
					'token'				=> $token_value,
					'tokenID'			=> $token_id,
					'homepage'			=> @count($corporate) > 0 ? $corporate[0] : FALSE,
					'products'			=> @count($products) > 0 ? $products : FALSE,
					'category'			=> @count($category) > 0 ? $category : FALSE,
					'menu'				=> @count($this->menu) > 0 ? $this->menu : FALSE,
					'categorys'			=> json_decode($this->ayarlar[0]['jsonCategory'], TRUE)['category']['services']
				);
				
				$this->smarty->render('pages/services/index', $data);
			}
		}
		
		function panel_services_update(array $config = []){
			$form_names = $this->csrf->form_names($config['data'], false);
			if(!empty($config['data']['seo_title']) AND !empty($config['data']['title'])){
				if($this->security->text($config['data']['seo_title']) == TRUE AND $this->security->text($config['data']['seo_keyword']) == TRUE AND $this->security->text($config['data']['seo_description']) == TRUE AND $this->security->num($config['data']['id']) == TRUE){
			
					//* Kategoriler
					$categorys = json_encode(@$config['data']['categorys'], JSON_HEX_TAG);
					
					//* gallery json kontrol
					$gallery = '{"gallery":[]}';
					json_decode($config['data']['gallery']);
					switch(json_last_error())
					{
						case JSON_ERROR_NONE:
							$gallery = $config['data']['gallery'];
						break;
					}
			
					$pagesArray = array(
						'seo_title' 		=> $config['data']['seo_title'],
						'seo_keyword' 		=> $config['data']['seo_keyword'],
						'seo_description'	=> $config['data']['seo_description'],
						'title' 			=> strip_tags($config['data']['title']),
						'sef'				=> $this->func->sef(strip_tags($config['data']['title'])),
						'content'			=> strip_tags($config['data']['content'], $this->izinlitag),
						'gallery'			=> $gallery,
						'categorys'			=> $categorys
					);
					
					if(@$config['data']['photoReset'] === "on"){				
						if(!@$_FILES['photo']){
							$pagesArray['photo'] = "";
						}
					}
					
					
					if(@$_FILES['photo']){
						$this->upload = new upload($_FILES['photo']);
						if ($this->upload->uploaded) {
							$this->upload->file_new_name_body = uniqid() .'-'. rand(0,100000);
							$this->upload->image_convert = 'jpg';
							
							// yeniden farklı boyutta kayıt et
							/*$this->upload->image_resize = true;
							$this->upload->image_ratio_crop = true;
							$this->upload->image_x = 1000;
							$this->upload->image_y = 540;*/
							
							$this->upload->allowed = array ('image/*');
							$this->upload->Process("../".UPLOAD_FOLDER."/photo/");
							if ($this->upload->processed) {
								$pagesArray['photo'] = $this->upload->file_dst_name;
							}
						}
						
					}
					
					
					$where = $config['data']['id'];
								
					
					$lowerAdd = $this->db->update("iwt_pages_services", $pagesArray , $where);
					if($lowerAdd){
						if($this->csrf->check_valid('post')) {
							$data = array(
								'language'			=> $this->lang,
								'status'			=> 1,
								'message'			=> "Tüm ayarlar güncellendi!",
								'yonlendir'			=> 'index.php?page=page/services'
							);
							$this->csrf->form_names($config['data'], true);
							
						}else {
							$data = array(
								'language'			=> $this->lang,
								'status'			=> 0,
								'message'			=> "Güvenlik Ağına Takıldınız!"
							);
						}
						
					}else {
						$data = array(
							'language'			=> $this->lang,
							'status'			=> 1,
							'message'			=> "Tüm ayarlar güncellendi!"
						);
					}
				
				}else {
					$data = array(
						'language'			=> $this->lang,
						'status'			=> 0,
						'message'			=> "Lütfen kutulardakı verileri tekrar kontrol ediniz!"
					);
				}
			}else {
				$data = array(
					'language'			=> $this->lang,
					'status'			=> 0,
					'message'			=> "Lütfen tüm alanları doldurunuz!"
				);	
			}
			$this->smarty->render('json', $data);
		}
		
		function panel_services_status(array $config = []){
			if($this->security->num($_GET['id']) == TRUE AND $this->security->num($_GET['status']) == TRUE){
				
				$pagesArray = array(
					'status' 		=> (@$_GET['status'] == 1 ? 0 : 1)
				);
				$status = $this->db->update("iwt_pages_services", $pagesArray, $_GET['id']);
				if($status){
					$data = array(
						'language'			=> $this->lang,
						'status'			=> 1,
						'message'			=> (@$_GET['status'] == 1 ? 0 : 1)
					);
				}else {
					$data = array(
						'language'			=> $this->lang,
						'status'			=> 2,
						'message'			=> "Kayıt sırasında hatalar meydana geldi!"
					);
				}
			}else {
				$data = array(
					'language'			=> $this->lang,
					'status'			=> 0,
					'message'			=> "Güvenlik Ağına Takıldınız!"
				);
			}
			
			$this->smarty->render('json', $data);
		}
		
		function panel_services_sort(array $config = []){
			if($_POST){
				if(!empty($config['data']['item'])){
					foreach($config['data']['item'] as $keys => $item){
						$pagesArray = array(
							'sort' 		=> $keys
						);
						$status = $this->db->update("iwt_pages_services", $pagesArray, $item);
					}
					$data = array(
						'language'			=> $this->lang,
						'status'			=> 1,
						'message'			=> "başarılı"
					);
				}else {
					$data = array(
						'language'			=> $this->lang,
						'status'			=> 0,
						'message'			=> "Güvenlik Ağına Takıldınız!"
					);
				}
			}
			
			$this->smarty->render('json', $data);
		}
		
		function panel_services_delete(array $config = []){
			if($this->security->num($_GET['id']) == TRUE){
				$id= $_GET['id']; 
				$sil = $this->db->delete("iwt_pages_services", $id);
				if($sil){
					$data = array(
						'language'			=> $this->lang,
						'status'			=> 1,
						'message'			=> "Silme işleme başarılı"
					);
				}else {
					$data = array(
						'language'			=> $this->lang,
						'status'			=> 1,
						'message'			=> "Kayıt sırasında hatalar meydana geldi!"
					);
				}
			}else {
				$data = array(
					'language'			=> $this->lang,
					'status'			=> 0,
					'message'			=> "Güvenlik Ağına Takıldınız!"
				);
			}
			
			$this->smarty->render('json', $data);
		}
		
		function panel_services_insert(array $config = []){
			
			if($_POST){
				$form_names = $this->csrf->form_names($config['data'], false);
				if(!empty($config['data']['seo_title']) AND !empty($config['data']['seo_keyword']) AND !empty($config['data']['seo_description']) AND !empty($config['data']['title']) AND !empty($config['data']['categorys'])){
					if($this->security->text($config['data']['seo_title']) == TRUE AND $this->security->text($config['data']['seo_keyword']) == TRUE AND $this->security->text($config['data']['seo_description']) == TRUE AND $this->security->text($config['data']['title']) == TRUE){
						
						
						$categorys = json_encode(@$config['data']['categorys'], JSON_HEX_TAG);
						
						$pagesArray = array(
							'seo_title' => strip_tags($config['data']['seo_title']),
							'seo_keyword' => strip_tags($config['data']['seo_keyword']),
							'seo_description' => strip_tags($config['data']['seo_description']),
							'title' => strip_tags($config['data']['title']),
							'sef'	=> $this->func->sef($config['data']['title']),
							'page_id' => 7,
							'content' => strip_tags($config['data']['content'], $this->izinlitag),
							'categorys'	=> $categorys
						);
						
						
						if(@$config['data']['photoReset'] === "on"){				
							if(!@$_FILES['photo']){
								$pagesArray['photo'] = "";
							}
						}
					
					
						if(@$_FILES['photo']){
							$this->upload = new upload($_FILES['photo']);
							if ($this->upload->uploaded) {
								$this->upload->file_new_name_body = uniqid() .'-'. rand(0,100000);
								$this->upload->image_convert = 'jpg';
								
								// yeniden farklı boyutta kayıt et
								/*$this->upload->image_resize = true;
								$this->upload->image_ratio_crop = true;
								$this->upload->image_x = 1000;
								$this->upload->image_y = 540;*/
								
								$this->upload->allowed = array ('image/*');
								$this->upload->Process("../".UPLOAD_FOLDER."/photo/");
								if ($this->upload->processed) {
									$pagesArray['photo'] = $this->upload->file_dst_name;
								}
							}
							
						}
						
						$lowerAdd = $this->db->insert("iwt_pages_services", $pagesArray);
						if($lowerAdd){
							if($this->csrf->check_valid('post')) {
								$data = array(
									'language'			=> $this->lang,
									'status'			=> 1,
									'message'			=> "Tüm ayarlar güncellendi!",
									'yonlendir'			=> "index.php?page=page/services/edit&id=".$lowerAdd
								);
								$this->csrf->form_names($config['data'], true);
								
							}else {
								$data = array(
									'language'			=> $this->lang,
									'status'			=> 0,
									'message'			=> "Güvenlik Ağına Takıldınız!"
								);
							}
						}else {
							$data = array(
								'language'			=> $this->lang,
								'status'			=> 0,
								'message'			=> "Tüm ayarlar güncellendi!"
							);
						}
					
					}else {
						$data = array(
							'language'			=> $this->lang,
							'status'			=> 0,
							'message'			=> "Lütfen kutulardakı verileri tekrar kontrol ediniz!"
						);
					}
				}else {
					$data = array(
						'language'			=> $this->lang,
						'status'			=> 0,
						'message'			=> "Lütfen tüm alanları doldurunuz!"
					);	
				}
				$this->smarty->render('json', $data);
			}else {
				$category = $this->db->select("iwt_pages_services_category", "", $relOpt = '=', $locOpt = 'and', $orderColumn = null, $orderOpt = null, $limit = null, $lmtStart = null);


				$token_id = $this->csrf->get_token_id();
				$token_value = $this->csrf->get_token($token_id);
				
				$data = array(
					'themelink' 		=> SITE_URL.'/'.THEME_FOLDER.'/'.ADMIN_FOLDER,
					'language' 			=> $this->lang,
					'session'	  		=> @$_SESSION['login'] == TRUE ? $_SESSION : FALSE,
					'token'				=> $token_value,
					'tokenID'			=> $token_id,
					'category'			=> @count($category) > 0 ? $category : FALSE,
					'menu'				=> @count($this->menu) > 0 ? $this->menu : FALSE,
					'categorys'			=> json_decode($this->ayarlar[0]['jsonCategory'], TRUE)['category'][1]
				);
				
				$this->smarty->render('pages/services/Add', $data);
			}
			
		}
		
		function panel_services_edit(array $config = []){
			if($this->security->num(@$_GET['id']) == TRUE){
				$lowerArray= array(
					'id' => $_GET['id']
				);
				$lower = $this->db->select("iwt_pages_services", $lowerArray, $relOpt = '=', $locOpt = 'and', $orderColumn = null, $orderOpt = null, $limit = null, $lmtStart = null);

				$category = $this->db->select("iwt_pages_services_category", "", $relOpt = '=', $locOpt = 'and', $orderColumn = null, $orderOpt = null, $limit = null, $lmtStart = null);

				$gallery = (empty($lower[0]['gallery']) ? '{"gallery":[]}' : json_decode($lower[0]['gallery'], TRUE)['gallery']);

				$token_id = $this->csrf->get_token_id();
				$token_value = $this->csrf->get_token($token_id);
				
				$data = array(
					'themelink' 		=> SITE_URL.'/'.THEME_FOLDER.'/'.ADMIN_FOLDER,
					'language' 			=> $this->lang,
					'session'	  		=> @$_SESSION['login'] == TRUE ? $_SESSION : FALSE,
					'token'				=> $token_value,
					'tokenID'			=> $token_id,
					'lower'				=> @count($lower) > 0 ? $lower[0] : FALSE,
					'category'			=> @count($category) > 0 ? $category : FALSE,
					'menu'				=> @count($this->menu) > 0 ? $this->menu : FALSE,
					'categorys'			=> json_decode($this->ayarlar[0]['jsonCategory'], TRUE)['category'][1], //* panel kategorileri
					'gallery'			=> $gallery,
					'kategori'			=> json_decode($lower[0]['categorys'], TRUE) //* arayüzde urun kategorileri
				);
				
				$this->smarty->render('pages/services/Edit', $data);
			}else {
				die($this->func->yonlendir(0, "index.php?page=page/services"));
			}
		}
		
		function panel_services_category_status(array $config = []){
			if($this->security->num($_GET['id']) == TRUE AND $this->security->num($_GET['status']) == TRUE){
				
				$pagesArray = array(
					'status' 		=> (@$_GET['status'] == 1 ? 0 : 1)
				);
				$status = $this->db->update("iwt_pages_services_category", $pagesArray, $_GET['id']);
				if($status){
					$data = array(
						'language'			=> $this->lang,
						'status'			=> 1,
						'message'			=> (@$_GET['status'] == 1 ? 0 : 1)
					);
				}else {
					$data = array(
						'language'			=> $this->lang,
						'status'			=> 2,
						'message'			=> "Kayıt sırasında hatalar meydana geldi!"
					);
				}
			}else {
				$data = array(
					'language'			=> $this->lang,
					'status'			=> 0,
					'message'			=> "Güvenlik Ağına Takıldınız!"
				);
			}
			
			$this->smarty->render('json', $data);
		}
		
		function panel_services_category_sort(array $config = []){
			if($_POST){
				if(!empty($config['data']['item'])){
					foreach($config['data']['item'] as $keys => $item){
						$pagesArray = array(
							'sort' 		=> $keys
						);
						$status = $this->db->update("iwt_pages_services_category", $pagesArray, $item);
					}
					$data = array(
						'language'			=> $this->lang,
						'status'			=> 1,
						'message'			=> "başarılı"
					);
				}else {
					$data = array(
						'language'			=> $this->lang,
						'status'			=> 0,
						'message'			=> "Güvenlik Ağına Takıldınız!"
					);
				}
			}
			
			$this->smarty->render('json', $data);
		}
		
		function panel_services_category_edit(array $config = []){
			if($this->security->num(@$_GET['id']) == TRUE){
				$lowerArray= array(
					'id' => $_GET['id']
				);
				$lower = $this->db->select("iwt_pages_services_category", $lowerArray, $relOpt = '=', $locOpt = 'and', $orderColumn = null, $orderOpt = null, $limit = null, $lmtStart = null);

			
				$token_id = $this->csrf->get_token_id();
				$token_value = $this->csrf->get_token($token_id);
				
				$data = array(
					'themelink' 		=> SITE_URL.'/'.THEME_FOLDER.'/'.ADMIN_FOLDER,
					'language' 			=> $this->lang,
					'session'	  		=> @$_SESSION['login'] == TRUE ? $_SESSION : FALSE,
					'token'				=> $token_value,
					'tokenID'			=> $token_id,
					'lower'				=> @count($lower) > 0 ? $lower[0] : FALSE,
					'menu'				=> @count($this->menu) > 0 ? $this->menu : FALSE,
					'categorys'			=> json_decode($this->ayarlar[0]['jsonCategory'], TRUE)['category'][1]
				);
				
				$this->smarty->render('pages/services/CategoryEdit', $data);
			}else {
				die($this->func->yonlendir(0, "index.php?page=page/services"));
			}
		}
		
		function panel_services_category_update(array $config = []){
			$form_names = $this->csrf->form_names($config['data'], false);
			if(!empty($config['data']['seo_title']) AND !empty($config['data']['title'])){
				if($this->security->text($config['data']['seo_title']) == TRUE AND $this->security->text($config['data']['seo_keyword']) == TRUE AND $this->security->text($config['data']['seo_description']) == TRUE AND $this->security->num($config['data']['id']) == TRUE){
			
				
					$pagesArray = array(
						'seo_title' 		=> $config['data']['seo_title'],
						'seo_keyword' 		=> $config['data']['seo_keyword'],
						'seo_description'	=> $config['data']['seo_description'],
						'title' 			=> strip_tags($config['data']['title']),
						'sef'				=> $this->func->sef(strip_tags($config['data']['title'])),
						'content'			=> strip_tags($config['data']['content'], $this->izinlitag)
					);
					
					if(@$config['data']['photoReset'] === "on"){				
						if(!@$_FILES['photo']){
							$pagesArray['photo'] = "";
						}
					}
					
					if(@$_FILES['photo']){
						$this->upload = new upload($_FILES['photo']);
						if ($this->upload->uploaded) {
							$this->upload->file_new_name_body = uniqid() .'-'. rand(0,100000);
							$this->upload->image_convert = 'jpg';
							
							// yeniden farklı boyutta kayıt et
							/*$this->upload->image_resize = true;
							$this->upload->image_ratio_crop = true;
							$this->upload->image_x = 1000;
							$this->upload->image_y = 540;*/
							
							$this->upload->allowed = array ('image/*');
							$this->upload->Process("../".UPLOAD_FOLDER."/photo/");
							if ($this->upload->processed) {
								$pagesArray['photo'] = $this->upload->file_dst_name;
							}
						}
						
					}
					
					$where = $config['data']['id'];
								
					
					$lowerAdd = $this->db->update("iwt_pages_services_category", $pagesArray , $where);
					if($lowerAdd){
						if($this->csrf->check_valid('post')) {
							$data = array(
								'language'			=> $this->lang,
								'status'			=> 1,
								'message'			=> "Tüm ayarlar güncellendi!"
							);
							$this->csrf->form_names($config['data'], true);
						}else {
							$data = array(
								'language'			=> $this->lang,
								'status'			=> 0,
								'message'			=> "Güvenlik Ağına Takıldınız!"
							);
						}
					}else {
						$data = array(
							'language'			=> $this->lang,
							'status'			=> 0,
							'message'			=> "Tüm ayarlar güncellendi!"
						);
					}
				
				}else {
					$data = array(
						'language'			=> $this->lang,
						'status'			=> 0,
						'message'			=> "Lütfen kutulardakı verileri tekrar kontrol ediniz!"
					);
				}
			}else {
				$data = array(
					'language'			=> $this->lang,
					'status'			=> 0,
					'message'			=> "Lütfen tüm alanları doldurunuz!"
				);	
			}
			$this->smarty->render('json', $data);
		}
		
		function panel_services_category_delete(array $config = []){
			if($this->security->num($_GET['id']) == TRUE){
				$id= $_GET['id']; 
				$sil = $this->db->delete("iwt_pages_services_category", $id);
				if($sil){

					$data = array(
						'language'			=> $this->lang,
						'status'			=> 1,
						'message'			=> "Silme işleme başarılı"
					);
				}else {
					$data = array(
						'language'			=> $this->lang,
						'status'			=> 1,
						'message'			=> "Kayıt sırasında hatalar meydana geldi!"
					);
				}
			}else {
				$data = array(
					'language'			=> $this->lang,
					'status'			=> 0,
					'message'			=> "Güvenlik Ağına Takıldınız!"
				);
			}
			
			$this->smarty->render('json', $data);
		}
		
		
		function panel_services_category_insert(array $config = []){
			$form_names = $this->csrf->form_names($config['data'], false);
				if(!empty($config['data']['seo_title'])){
					if($this->security->text($config['data']['seo_title']) == TRUE){
	
	
						if(isset($config['data']['categoryid'])){
							if($this->security->num($config['data']['categoryid']) == TRUE){
								$categoryid = $config['data']['categoryid'];
							}else {
								$categoryid = 0;
							}
						}else {
							$categoryid = 0;
						}
					
						$pagesArray = array(
							'seo_title' => strip_tags($config['data']['seo_title']),
							'title' => strip_tags($config['data']['seo_title']),
							'sef'	=> $this->func->sef(strip_tags($config['data']['seo_title'])),
							'ustkategori' => $categoryid
						);
						
						$lowerAdd = $this->db->insert("iwt_pages_services_category", $pagesArray);
						if($lowerAdd){
							if($this->csrf->check_valid('post')) {
								$data = array(
									'language'			=> $this->lang,
									'status'			=> 1,
									'message'			=> "Tüm ayarlar güncellendi!",
									'yonlendir'			=> ""
								);
								$this->csrf->form_names($config['data'], true);
							}else {
								$data = array(
									'language'			=> $this->lang,
									'status'			=> 0,
									'message'			=> "Güvenlik Ağına Takıldınız!"
								);
							}
						}else {
							$data = array(
								'language'			=> $this->lang,
								'status'			=> 0,
								'message'			=> "Tüm ayarlar güncellendi!"
							);
						}
					
					}else {
						$data = array(
							'language'			=> $this->lang,
							'status'			=> 0,
							'message'			=> "Lütfen kutulardakı verileri tekrar kontrol ediniz!"
						);
					}
				}else {
					$data = array(
						'language'			=> $this->lang,
						'status'			=> 0,
						'message'			=> "Lütfen tüm alanları doldurunuz!"
					);	
				}
				$this->smarty->render('json', $data);
		}
		
		
		//* scope
		
		
		function panel_press(array $config = []){
			if($_POST){
				$form_names = $this->csrf->form_names($config['data'], false);
					if(!empty($config['data']['seo_title'])){
						if($this->security->text($config['data']['seo_title']) == TRUE AND $this->security->text($config['data']['seo_keyword']) == TRUE AND $this->security->text($config['data']['seo_description']) == TRUE AND $this->security->num($config['data']['homepagestatus']) == TRUE){
						
							$pagesArray = array(
								'seo_title' => strip_tags($config['data']['seo_title']),
								'seo_keyword' => strip_tags($config['data']['seo_keyword']),
								'seo_description' => strip_tags($config['data']['seo_description']),
								'content' => strip_tags($config['data']['content'], $this->izinlitag),
								'homepagestatus' => (@$config['data']['homepagestatus'] == 1 ? 1 : 0 )
							);
							
							if(@$config['data']['photoReset'] === "on"){				
								if(!@$_FILES['photo']){
									$pagesArray['photo'] = "";
								}
							}
							
							if(@$_FILES['photo']){
								$this->upload = new upload($_FILES['photo']);
								if ($this->upload->uploaded) {
									$this->upload->file_new_name_body = uniqid() .'-'. rand(0,100000);
									$this->upload->image_convert = 'jpg';
									
									// yeniden farklı boyutta kayıt et
									/*$this->upload->image_resize = true;
									$this->upload->image_ratio_crop = true;
									$this->upload->image_x = 1000;
									$this->upload->image_y = 540;*/
									
									$this->upload->allowed = array ('image/*');
									$this->upload->Process("../".UPLOAD_FOLDER."/photo/");
									if ($this->upload->processed) {
										$pagesArray['photo'] = $this->upload->file_dst_name;
									}
								}
								
							}
							
							$where = 22;
							$pagesUPDATE = $this->db->update("iwt_pages", $pagesArray , $where);
							if($pagesUPDATE){
								if($this->csrf->check_valid('post')) {
									$data = array(
										'language'			=> $this->lang,
										'status'			=> 1,
										'message'			=> "Tüm ayarlar güncellendi!"
									);
									$this->csrf->form_names($config['data'], true);
								}else {
									$data = array(
										'language'			=> $this->lang,
										'status'			=> 0,
										'message'			=> "Güvenlik Ağına Takıldınız!"
									);
								}
							}else {
								$data = array(
									'language'			=> $this->lang,
									'status'			=> 1,
									'message'			=> "Tüm ayarlar güncellendi!"
								);
							}
						
						}else {
							$data = array(
								'language'			=> $this->lang,
								'status'			=> 0,
								'message'			=> "Lütfen kutulardakı verileri tekrar kontrol ediniz!"
							);
						}
					}else {
						$data = array(
							'language'			=> $this->lang,
							'status'			=> 0,
							'message'			=> "Lütfen tüm alanları doldurunuz!"
						);	
					}
					$this->smarty->render('json', $data);
			}else {
				
				//* Sayfayı çek
				$settingsArray= array(
					'id' => 22
				);
				$corporate = $this->db->select("iwt_pages", $settingsArray, $relOpt = '=', $locOpt = 'and', $orderColumn = null, $orderOpt = null, $limit = null, $lmtStart = null);
				
				//* Alt Sayfaları Çek
				$productsArray= array(
					'page_id' => $corporate[0]["id"]
				);
				$products = $this->db->select("iwt_pages_press", $productsArray, $relOpt = '=', $locOpt = 'and', $orderColumn = "sort", $orderOpt = "asc", $limit = null, $lmtStart = null);
				$category = $this->db->select("iwt_pages_press_category", "", $relOpt = '=', $locOpt = 'and', $orderColumn = "sort", $orderOpt = "asc", $limit = null, $lmtStart = null);

				
				
				$token_id = $this->csrf->get_token_id();
				$token_value = $this->csrf->get_token($token_id);
				
				$data = array(
					'themelink' 		=> SITE_URL.'/'.THEME_FOLDER.'/'.ADMIN_FOLDER,
					'language' 			=> $this->lang,
					'session'	  		=> @$_SESSION['login'] == TRUE ? $_SESSION : FALSE,
					'token'				=> $token_value,
					'tokenID'			=> $token_id,
					'homepage'			=> @count($corporate) > 0 ? $corporate[0] : FALSE,
					'products'			=> @count($products) > 0 ? $products : FALSE,
					'category'			=> @count($category) > 0 ? $category : FALSE,
					'menu'				=> @count($this->menu) > 0 ? $this->menu : FALSE,
					'categorys'			=> json_decode($this->ayarlar[0]['jsonCategory'], TRUE)['category']['press']
				);
				
				$this->smarty->render('pages/press/index', $data);
			}
		}
		
		function panel_press_update(array $config = []){
			$form_names = $this->csrf->form_names($config['data'], false);
			if(!empty($config['data']['seo_title']) AND !empty($config['data']['title'])  AND !empty($config['data']['categorys'])){
				if($this->security->text($config['data']['seo_title']) == TRUE AND $this->security->text($config['data']['seo_keyword']) == TRUE AND $this->security->text($config['data']['seo_description']) == TRUE AND $this->security->num($config['data']['id']) == TRUE){
			
					//* Kategoriler
					$categorys = json_encode(@$config['data']['categorys'], JSON_HEX_TAG);
					
					//* gallery json kontrol
					$gallery = '{"gallery":[]}';
					json_decode($config['data']['gallery']);
					switch(json_last_error())
					{
						case JSON_ERROR_DEPTH:
							$gallery = $gallery;
						break;
						case JSON_ERROR_CTRL_CHAR:
							$gallery = $gallery;
						break;
						
						case JSON_ERROR_SYNTAX:
							$gallery = $gallery;
						break;
						
						
						case JSON_ERROR_NONE:
							if(empty($config['data']['gallery'])){
								$gallery = $gallery;
							}else {
								$gallery = $config['data']['gallery'];
							}
						break;
					}
					
					//* video gallery json kontrol
					$videogallery = '{"gallery":[]}';
					json_decode($config['data']['gallery']);
					switch(json_last_error())
					{
						case JSON_ERROR_DEPTH:
							$videogallery = $videogallery;
						break;
						case JSON_ERROR_CTRL_CHAR:
							$videogallery = $videogallery;
						break;
						
						case JSON_ERROR_SYNTAX:
							$videogallery = $videogallery;
						break;
						
						case JSON_ERROR_NONE:
							if(empty($config['data']['videogallery'])){
								$videogallery = $videogallery;
							}else {
								$videogallery = $config['data']['videogallery'];
							}
						break;
					}
			
					$pagesArray = array(
						'seo_title' 		=> $config['data']['seo_title'],
						'seo_keyword' 		=> $config['data']['seo_keyword'],
						'seo_description'	=> $config['data']['seo_description'],
						'title' 			=> strip_tags($config['data']['title']),
						'sef'				=> $this->func->sef(strip_tags($config['data']['title'])),
						'content'			=> strip_tags($config['data']['content'], $this->izinlitag),
						'gallery'			=> $gallery,
						'videogallery'		=> $videogallery,
						'tip'				=> ($config['data']['tip'] == 2 ? 2 : 1),
						'categorys'			=> $categorys
					);
					
					if(@$config['data']['photoReset'] === "on"){				
						if(!@$_FILES['photo']){
							$pagesArray['photo'] = "";
						}
					}
					
					
					if(@$_FILES['photo']){
						$this->upload = new upload($_FILES['photo']);
						if ($this->upload->uploaded) {
							$this->upload->file_new_name_body = uniqid() .'-'. rand(0,100000);
							$this->upload->image_convert = 'jpg';
							
							// yeniden farklı boyutta kayıt et
							/*$this->upload->image_resize = true;
							$this->upload->image_ratio_crop = true;
							$this->upload->image_x = 1000;
							$this->upload->image_y = 540;*/
							
							$this->upload->allowed = array ('image/*');
							$this->upload->Process("../".UPLOAD_FOLDER."/photo/");
							if ($this->upload->processed) {
								$pagesArray['photo'] = $this->upload->file_dst_name;
							}
						}
						
					}
					
					
					$where = $config['data']['id'];
								
					
					$lowerAdd = $this->db->update("iwt_pages_press", $pagesArray , $where);
					if($lowerAdd){
						if($this->csrf->check_valid('post')) {
							$data = array(
								'language'			=> $this->lang,
								'status'			=> 1,
								'message'			=> "Tüm ayarlar güncellendi!"
							);
							$this->csrf->form_names($config['data'], true);
							
						}else {
							$data = array(
								'language'			=> $this->lang,
								'status'			=> 0,
								'message'			=> "Güvenlik Ağına Takıldınız!"
							);
						}
						
					}else {
						$data = array(
							'language'			=> $this->lang,
							'status'			=> 1,
							'message'			=> "Tüm ayarlar güncellendi!"
						);
					}
				
				}else {
					$data = array(
						'language'			=> $this->lang,
						'status'			=> 0,
						'message'			=> "Lütfen kutulardakı verileri tekrar kontrol ediniz!"
					);
				}
			}else {
				$data = array(
					'language'			=> $this->lang,
					'status'			=> 0,
					'message'			=> "Lütfen tüm alanları doldurunuz!"
				);	
			}
			$this->smarty->render('json', $data);
		}
		
		function panel_press_delete(array $config = []){
			if($this->security->num($_GET['id']) == TRUE){
				$id= $_GET['id']; 
				$sil = $this->db->delete("iwt_pages_press", $id);
				if($sil){
					$data = array(
						'language'			=> $this->lang,
						'status'			=> 1,
						'message'			=> "Silme işleme başarılı"
					);
				}else {
					$data = array(
						'language'			=> $this->lang,
						'status'			=> 1,
						'message'			=> "Kayıt sırasında hatalar meydana geldi!"
					);
				}
			}else {
				$data = array(
					'language'			=> $this->lang,
					'status'			=> 0,
					'message'			=> "Güvenlik Ağına Takıldınız!"
				);
			}
			
			$this->smarty->render('json', $data);
		}
		
		function panel_press_insert(array $config = []){
			if($_POST){
				$form_names = $this->csrf->form_names($config['data'], false);
				if(!empty($config['data']['seo_title']) AND !empty($config['data']['title']) AND !empty($config['data']['categorys'])){
					if($this->security->text($config['data']['seo_title']) == TRUE AND $this->security->text($config['data']['seo_keyword']) == TRUE AND $this->security->text($config['data']['seo_description']) == TRUE){
				
					
						//* Kategoriler
						$categorys = json_encode(@$config['data']['categorys'], JSON_HEX_TAG);
						
						//* gallery json kontrol
						$gallery = '{"gallery":[]}';
						json_decode($gallery);
						switch(json_last_error())
						{
							case JSON_ERROR_DEPTH:
								$gallery = $gallery;
							break;
							case JSON_ERROR_CTRL_CHAR:
								$gallery = $gallery;
							break;
							
							case JSON_ERROR_SYNTAX:
								$gallery = $gallery;
							break;
							
							case JSON_ERROR_NONE:
								if(empty($config['data']['gallery'])){
									$gallery = $gallery;
								}else {
									$gallery = $config['data']['gallery'];
								}
							break;
						}
						
						//* video gallery json kontrol
						$videogallery = '{"gallery":[]}';
						json_decode($gallery);
						switch(json_last_error())
						{
							case JSON_ERROR_DEPTH:
								$videogallery = $videogallery;
							break;
							case JSON_ERROR_CTRL_CHAR:
								$videogallery = $videogallery;
							break;
							
							case JSON_ERROR_SYNTAX:
								$videogallery = $videogallery;
							break;
							
							case JSON_ERROR_NONE:
								if(empty($config['data']['videogallery'])){
									$videogallery = $videogallery;
								}else {
									$videogallery = $config['data']['videogallery'];
								}
							break;
						}
				
						$pagesArray = array(
							'seo_title' 		=> $config['data']['seo_title'],
							'seo_keyword' 		=> $config['data']['seo_keyword'],
							'seo_description'	=> $config['data']['seo_description'],
							'title' 			=> strip_tags($config['data']['title']),
							'sef'				=> $this->func->sef(strip_tags($config['data']['title'])),
							'content'			=> strip_tags($config['data']['content'], $this->izinlitag),
							'gallery'			=> $gallery,
							'videogallery'		=> $videogallery,
							'tip'				=> ($config['data']['tip'] == 2 ? 2 : 1),
							'categorys'			=> $categorys,
							'page_id'			=> 22
						);
						
						if(@$config['data']['photoReset'] === "on"){				
							if(!@$_FILES['photo']){
								$pagesArray['photo'] = "";
							}
						}
						
						
						if(@$_FILES['photo']){
							$this->upload = new upload($_FILES['photo']);
							if ($this->upload->uploaded) {
								$this->upload->file_new_name_body = uniqid() .'-'. rand(0,100000);
								$this->upload->image_convert = 'jpg';
								
								// yeniden farklı boyutta kayıt et
								/*$this->upload->image_resize = true;
								$this->upload->image_ratio_crop = true;
								$this->upload->image_x = 1000;
								$this->upload->image_y = 540;*/
								
								$this->upload->allowed = array ('image/*');
								$this->upload->Process("../".UPLOAD_FOLDER."/photo/");
								if ($this->upload->processed) {
									$pagesArray['photo'] = $this->upload->file_dst_name;
								}
							}
							
						}
						
						
						$lowerAdd = $this->db->insert("iwt_pages_press", $pagesArray);
						if($lowerAdd){
							if($this->csrf->check_valid('post')) {
								$data = array(
									'language'			=> $this->lang,
									'status'			=> 1,
									'message'			=> "Tüm ayarlar güncellendi!",
									'yonlendir'			=> "index.php?page=page/press/edit&id=".$lowerAdd
								);
								$this->csrf->form_names($config['data'], true);
								
							}else {
								$data = array(
									'language'			=> $this->lang,
									'status'			=> 0,
									'message'			=> "Güvenlik Ağına Takıldınız!"
								);
							}
						}else {
							$data = array(
								'language'			=> $this->lang,
								'status'			=> 0,
								'message'			=> "Tüm ayarlar güncellendi!"
							);
						}
					
					}else {
						$data = array(
							'language'			=> $this->lang,
							'status'			=> 0,
							'message'			=> "Lütfen kutulardakı verileri tekrar kontrol ediniz!"
						);
					}
				}else {
					$data = array(
						'language'			=> $this->lang,
						'status'			=> 0,
						'message'			=> "Lütfen tüm alanları doldurunuz!"
					);	
				}
				$this->smarty->render('json', $data);
			}else {
				
				$category = $this->db->select("iwt_pages_press_category", "", $relOpt = '=', $locOpt = 'and', $orderColumn = null, $orderOpt = null, $limit = null, $lmtStart = null);

				
				$token_id = $this->csrf->get_token_id();
				$token_value = $this->csrf->get_token($token_id);
				
				$data = array(
					'themelink' 		=> SITE_URL.'/'.THEME_FOLDER.'/'.ADMIN_FOLDER,
					'language' 			=> $this->lang,
					'session'	  		=> @$_SESSION['login'] == TRUE ? $_SESSION : FALSE,
					'token'				=> $token_value,
					'tokenID'			=> $token_id,
					'category'			=> @count($category) > 0 ? $category : FALSE,
					'menu'				=> @count($this->menu) > 0 ? $this->menu : FALSE
				);
				
				$this->smarty->render('pages/press/Add', $data);
			}
		}
		
		function panel_press_edit(array $config = []){
			if($this->security->num(@$_GET['id']) == TRUE){
				$lowerArray= array(
					'id' => $_GET['id']
				);
				$lower = $this->db->select("iwt_pages_press", $lowerArray, $relOpt = '=', $locOpt = 'and', $orderColumn = null, $orderOpt = null, $limit = null, $lmtStart = null);

				$category = $this->db->select("iwt_pages_press_category", "", $relOpt = '=', $locOpt = 'and', $orderColumn = null, $orderOpt = null, $limit = null, $lmtStart = null);

				$gallery = (empty($lower[0]['gallery']) ? '{"gallery":[]}' : json_decode($lower[0]['gallery'], TRUE)['gallery']);
				$videogallery = (empty($lower[0]['videogallery']) ? '{"gallery":[]}' : json_decode($lower[0]['videogallery'], TRUE)['gallery']);
				
				$token_id = $this->csrf->get_token_id();
				$token_value = $this->csrf->get_token($token_id);
				
				$data = array(
					'themelink' 		=> SITE_URL.'/'.THEME_FOLDER.'/'.ADMIN_FOLDER,
					'language' 			=> $this->lang,
					'session'	  		=> @$_SESSION['login'] == TRUE ? $_SESSION : FALSE,
					'token'				=> $token_value,
					'tokenID'			=> $token_id,
					'lower'				=> @count($lower) > 0 ? $lower[0] : FALSE,
					'category'			=> @count($category) > 0 ? $category : FALSE,
					'menu'				=> @count($this->menu) > 0 ? $this->menu : FALSE,
					'categorys'			=> json_decode($this->ayarlar[0]['jsonCategory'], TRUE)['category'][1], //* panel kategorileri
					'gallery'			=> $gallery,
					'videogallery'			=> $videogallery,
					'kategori'			=> json_decode($lower[0]['categorys'], TRUE) //* arayüzde urun kategorileri
				);
				
				$this->smarty->render('pages/press/Edit', $data);
			}else {
				die($this->func->yonlendir(0, "index.php?page=page/press"));
			}
		}
		
		function panel_press_status(array $config = []){
			if($this->security->num($_GET['id']) == TRUE AND $this->security->num($_GET['status']) == TRUE){
				
				$pagesArray = array(
					'status' 		=> (@$_GET['status'] == 1 ? 0 : 1)
				);
				$status = $this->db->update("iwt_pages_press", $pagesArray, $_GET['id']);
				if($status){
					$data = array(
						'language'			=> $this->lang,
						'status'			=> 1,
						'message'			=> (@$_GET['status'] == 1 ? 0 : 1)
					);
				}else {
					$data = array(
						'language'			=> $this->lang,
						'status'			=> 2,
						'message'			=> "Kayıt sırasında hatalar meydana geldi!"
					);
				}
			}else {
				$data = array(
					'language'			=> $this->lang,
					'status'			=> 0,
					'message'			=> "Güvenlik Ağına Takıldınız!"
				);
			}
			
			$this->smarty->render('json', $data);
		}
		
		function panel_press_sort(array $config = []){
			if($_POST){
				if(!empty($config['data']['item'])){
					foreach($config['data']['item'] as $keys => $item){
						$pagesArray = array(
							'sort' 		=> $keys
						);
						$status = $this->db->update("iwt_pages_press", $pagesArray, $item);
					}
					$data = array(
						'language'			=> $this->lang,
						'status'			=> 1,
						'message'			=> "başarılı"
					);
				}else {
					$data = array(
						'language'			=> $this->lang,
						'status'			=> 0,
						'message'			=> "Güvenlik Ağına Takıldınız!"
					);
				}
			}
			
			$this->smarty->render('json', $data);
		}
		
		
		function panel_press_category_status(array $config = []){
			if($this->security->num($_GET['id']) == TRUE AND $this->security->num($_GET['status']) == TRUE){
				
				$pagesArray = array(
					'status' 		=> (@$_GET['status'] == 1 ? 0 : 1)
				);
				$status = $this->db->update("iwt_pages_press_category", $pagesArray, $_GET['id']);
				if($status){
					$data = array(
						'language'			=> $this->lang,
						'status'			=> 1,
						'message'			=> (@$_GET['status'] == 1 ? 0 : 1)
					);
				}else {
					$data = array(
						'language'			=> $this->lang,
						'status'			=> 2,
						'message'			=> "Kayıt sırasında hatalar meydana geldi!"
					);
				}
			}else {
				$data = array(
					'language'			=> $this->lang,
					'status'			=> 0,
					'message'			=> "Güvenlik Ağına Takıldınız!"
				);
			}
			
			$this->smarty->render('json', $data);
		}
		
		function panel_press_category_sort(array $config = []){
			if($_POST){
				if(!empty($config['data']['item'])){
					foreach($config['data']['item'] as $keys => $item){
						$pagesArray = array(
							'sort' 		=> $keys
						);
						$status = $this->db->update("iwt_pages_press_category", $pagesArray, $item);
					}
					$data = array(
						'language'			=> $this->lang,
						'status'			=> 1,
						'message'			=> "başarılı"
					);
				}else {
					$data = array(
						'language'			=> $this->lang,
						'status'			=> 0,
						'message'			=> "Güvenlik Ağına Takıldınız!"
					);
				}
			}
			
			$this->smarty->render('json', $data);
		}
		
		function panel_press_category_edit(array $config = []){
			if($this->security->num(@$_GET['id']) == TRUE){
				$lowerArray= array(
					'id' => $_GET['id']
				);
				$lower = $this->db->select("iwt_pages_press_category", $lowerArray, $relOpt = '=', $locOpt = 'and', $orderColumn = null, $orderOpt = null, $limit = null, $lmtStart = null);

			
				$token_id = $this->csrf->get_token_id();
				$token_value = $this->csrf->get_token($token_id);
				
				$data = array(
					'themelink' 		=> SITE_URL.'/'.THEME_FOLDER.'/'.ADMIN_FOLDER,
					'language' 			=> $this->lang,
					'session'	  		=> @$_SESSION['login'] == TRUE ? $_SESSION : FALSE,
					'token'				=> $token_value,
					'tokenID'			=> $token_id,
					'lower'				=> @count($lower) > 0 ? $lower[0] : FALSE,
					'menu'				=> @count($this->menu) > 0 ? $this->menu : FALSE,
					'categorys'			=> json_decode($this->ayarlar[0]['jsonCategory'], TRUE)['category'][1]
				);
				
				$this->smarty->render('pages/press/CategoryEdit', $data);
			}else {
				die($this->func->yonlendir(0, "index.php?page=page/press"));
			}
		}
		
		function panel_press_category_update(array $config = []){
			$form_names = $this->csrf->form_names($config['data'], false);
			if(!empty($config['data']['seo_title']) AND !empty($config['data']['title'])){
				if($this->security->text($config['data']['seo_title']) == TRUE AND $this->security->text($config['data']['seo_keyword']) == TRUE AND $this->security->text($config['data']['seo_description']) == TRUE AND $this->security->num($config['data']['id']) == TRUE){
			
				
					$pagesArray = array(
						'seo_title' 		=> $config['data']['seo_title'],
						'seo_keyword' 		=> $config['data']['seo_keyword'],
						'seo_description'	=> $config['data']['seo_description'],
						'title' 			=> strip_tags($config['data']['title']),
						'sef'				=> $this->func->sef(strip_tags($config['data']['title'])),
						'content'			=> strip_tags($config['data']['content'], $this->izinlitag)
					);
					
					if(@$config['data']['photoReset'] === "on"){				
						if(!@$_FILES['photo']){
							$pagesArray['photo'] = "";
						}
					}
					
					
					if(@$_FILES['photo']){
						$this->upload = new upload($_FILES['photo']);
						if ($this->upload->uploaded) {
							$this->upload->file_new_name_body = uniqid() .'-'. rand(0,100000);
							$this->upload->image_convert = 'jpg';
							
							// yeniden farklı boyutta kayıt et
							/*$this->upload->image_resize = true;
							$this->upload->image_ratio_crop = true;
							$this->upload->image_x = 1000;
							$this->upload->image_y = 540;*/
							
							$this->upload->allowed = array ('image/*');
							$this->upload->Process("../".UPLOAD_FOLDER."/photo/");
							if ($this->upload->processed) {
								$pagesArray['photo'] = $this->upload->file_dst_name;
							}
						}
						
					}
					
					$where = $config['data']['id'];
								
					
					$lowerAdd = $this->db->update("iwt_pages_press_category", $pagesArray , $where);
					if($lowerAdd){
						if($this->csrf->check_valid('post')) {
							$data = array(
								'language'			=> $this->lang,
								'status'			=> 1,
								'message'			=> "Tüm ayarlar güncellendi!"
							);
							$this->csrf->form_names($config['data'], true);
						}else {
							$data = array(
								'language'			=> $this->lang,
								'status'			=> 0,
								'message'			=> "Güvenlik Ağına Takıldınız!"
							);
						}
					}else {
						$data = array(
							'language'			=> $this->lang,
							'status'			=> 0,
							'message'			=> "Tüm ayarlar güncellendi!"
						);
					}
				
				}else {
					$data = array(
						'language'			=> $this->lang,
						'status'			=> 0,
						'message'			=> "Lütfen kutulardakı verileri tekrar kontrol ediniz!"
					);
				}
			}else {
				$data = array(
					'language'			=> $this->lang,
					'status'			=> 0,
					'message'			=> "Lütfen tüm alanları doldurunuz!"
				);	
			}
			$this->smarty->render('json', $data);
		}
		
		function panel_press_category_delete(array $config = []){
			if($this->security->num($_GET['id']) == TRUE){
				$id= $_GET['id']; 
				$sil = $this->db->delete("iwt_pages_press_category", $id);
				if($sil){

					$data = array(
						'language'			=> $this->lang,
						'status'			=> 1,
						'message'			=> "Silme işleme başarılı"
					);
				}else {
					$data = array(
						'language'			=> $this->lang,
						'status'			=> 1,
						'message'			=> "Kayıt sırasında hatalar meydana geldi!"
					);
				}
			}else {
				$data = array(
					'language'			=> $this->lang,
					'status'			=> 0,
					'message'			=> "Güvenlik Ağına Takıldınız!"
				);
			}
			
			$this->smarty->render('json', $data);
		}
		
		
		function panel_press_category_insert(array $config = []){
			$form_names = $this->csrf->form_names($config['data'], false);
				if(!empty($config['data']['seo_title'])){
					if($this->security->text($config['data']['seo_title']) == TRUE){
	
	
						if(isset($config['data']['categoryid'])){
							if($this->security->num($config['data']['categoryid']) == TRUE){
								$categoryid = $config['data']['categoryid'];
							}else {
								$categoryid = 0;
							}
						}else {
							$categoryid = 0;
						}
					
						$pagesArray = array(
							'seo_title' => strip_tags($config['data']['seo_title']),
							'title' => strip_tags($config['data']['seo_title']),
							'sef'	=> $this->func->sef(strip_tags($config['data']['seo_title'])),
							'ustkategori' => $categoryid
						);
						
						$lowerAdd = $this->db->insert("iwt_pages_press_category", $pagesArray);
						if($lowerAdd){
							if($this->csrf->check_valid('post')) {
								$data = array(
									'language'			=> $this->lang,
									'status'			=> 1,
									'message'			=> "Tüm ayarlar güncellendi!",
									'yonlendir'			=> "index.php?page=page/press/category/edit&id=".$lowerAdd
								);
								$this->csrf->form_names($config['data'], true);
							}else {
								$data = array(
									'language'			=> $this->lang,
									'status'			=> 0,
									'message'			=> "Güvenlik Ağına Takıldınız!"
								);
							}
						}else {
							$data = array(
								'language'			=> $this->lang,
								'status'			=> 0,
								'message'			=> "Tüm ayarlar güncellendi!"
							);
						}
					
					}else {
						$data = array(
							'language'			=> $this->lang,
							'status'			=> 0,
							'message'			=> "Lütfen kutulardakı verileri tekrar kontrol ediniz!"
						);
					}
				}else {
					$data = array(
						'language'			=> $this->lang,
						'status'			=> 0,
						'message'			=> "Lütfen tüm alanları doldurunuz!"
					);	
				}
				$this->smarty->render('json', $data);
		}
		
		
		//* scope
		
		function panel_scope(array $config = []){
			if($_POST){
				$form_names = $this->csrf->form_names($config['data'], false);
					if(!empty($config['data']['seo_title'])){
						if($this->security->text($config['data']['seo_title']) == TRUE AND $this->security->text($config['data']['seo_keyword']) == TRUE AND $this->security->text($config['data']['seo_description']) == TRUE AND $this->security->num($config['data']['homepagestatus']) == TRUE){
						
							$pagesArray = array(
								'seo_title' => strip_tags($config['data']['seo_title']),
								'seo_keyword' => strip_tags($config['data']['seo_keyword']),
								'seo_description' => strip_tags($config['data']['seo_description']),
								'content' => strip_tags($config['data']['content'], $this->izinlitag),
								'homepagestatus' => (@$config['data']['homepagestatus'] == 1 ? 1 : 0 )
							);
							
							if(@$config['data']['photoReset'] === "on"){				
								if(!@$_FILES['photo']){
									$pagesArray['photo'] = "";
								}
							}
							
							if(@$_FILES['photo']){
								$this->upload = new upload($_FILES['photo']);
								if ($this->upload->uploaded) {
									$this->upload->file_new_name_body = uniqid() .'-'. rand(0,100000);
									$this->upload->image_convert = 'jpg';
									
									// yeniden farklı boyutta kayıt et
									/*$this->upload->image_resize = true;
									$this->upload->image_ratio_crop = true;
									$this->upload->image_x = 1000;
									$this->upload->image_y = 540;*/
									
									$this->upload->allowed = array ('image/*');
									$this->upload->Process("../".UPLOAD_FOLDER."/photo/");
									if ($this->upload->processed) {
										$pagesArray['photo'] = $this->upload->file_dst_name;
									}
								}
								
							}
							
							$where = 20;
							$pagesUPDATE = $this->db->update("iwt_pages", $pagesArray , $where);
							if($pagesUPDATE){
								if($this->csrf->check_valid('post')) {
									$data = array(
										'language'			=> $this->lang,
										'status'			=> 1,
										'message'			=> "Tüm ayarlar güncellendi!"
									);
									$this->csrf->form_names($config['data'], true);
								}else {
									$data = array(
										'language'			=> $this->lang,
										'status'			=> 0,
										'message'			=> "Güvenlik Ağına Takıldınız!"
									);
								}
							}else {
								$data = array(
									'language'			=> $this->lang,
									'status'			=> 1,
									'message'			=> "Tüm ayarlar güncellendi!"
								);
							}
						
						}else {
							$data = array(
								'language'			=> $this->lang,
								'status'			=> 0,
								'message'			=> "Lütfen kutulardakı verileri tekrar kontrol ediniz!"
							);
						}
					}else {
						$data = array(
							'language'			=> $this->lang,
							'status'			=> 0,
							'message'			=> "Lütfen tüm alanları doldurunuz!"
						);	
					}
					$this->smarty->render('json', $data);
			}else {
				
				//* Sayfayı çek
				$settingsArray= array(
					'id' => 20
				);
				$corporate = $this->db->select("iwt_pages", $settingsArray, $relOpt = '=', $locOpt = 'and', $orderColumn = null, $orderOpt = null, $limit = null, $lmtStart = null);
				
				//* Alt Sayfaları Çek
				$productsArray= array(
					'page_id' => $corporate[0]["id"]
				);
				$products = $this->db->select("iwt_pages_scope", $productsArray, $relOpt = '=', $locOpt = 'and', $orderColumn = "sort", $orderOpt = "asc", $limit = null, $lmtStart = null);
			//	$category = $this->db->select("iwt_pages_scope_category", "", $relOpt = '=', $locOpt = 'and', $orderColumn = null, $orderOpt = null, $limit = null, $lmtStart = null);

				
				
				$token_id = $this->csrf->get_token_id();
				$token_value = $this->csrf->get_token($token_id);
				
				$data = array(
					'themelink' 		=> SITE_URL.'/'.THEME_FOLDER.'/'.ADMIN_FOLDER,
					'language' 			=> $this->lang,
					'session'	  		=> @$_SESSION['login'] == TRUE ? $_SESSION : FALSE,
					'token'				=> $token_value,
					'tokenID'			=> $token_id,
					'homepage'			=> @count($corporate) > 0 ? $corporate[0] : FALSE,
					'products'			=> @count($products) > 0 ? $products : FALSE,
					//'category'			=> @count($category) > 0 ? $category : FALSE,
					'menu'				=> @count($this->menu) > 0 ? $this->menu : FALSE,
					'categorys'			=> json_decode($this->ayarlar[0]['jsonCategory'], TRUE)['category']['scope']
				);
				
				$this->smarty->render('pages/scope/index', $data);
			}
		}
		
		function panel_scope_status(array $config = []){
			if($this->security->num($_GET['id']) == TRUE AND $this->security->num($_GET['status']) == TRUE){
				
				$pagesArray = array(
					'status' 		=> (@$_GET['status'] == 1 ? 0 : 1)
				);
				$status = $this->db->update("iwt_pages_scope", $pagesArray, $_GET['id']);
				if($status){
					$data = array(
						'language'			=> $this->lang,
						'status'			=> 1,
						'message'			=> (@$_GET['status'] == 1 ? 0 : 1)
					);
				}else {
					$data = array(
						'language'			=> $this->lang,
						'status'			=> 2,
						'message'			=> "Kayıt sırasında hatalar meydana geldi!"
					);
				}
			}else {
				$data = array(
					'language'			=> $this->lang,
					'status'			=> 0,
					'message'			=> "Güvenlik Ağına Takıldınız!"
				);
			}
			
			$this->smarty->render('json', $data);
		}
		
		function panel_scope_sort(array $config = []){
			if($_POST){
				if(!empty($config['data']['item'])){
					foreach($config['data']['item'] as $keys => $item){
						$pagesArray = array(
							'sort' 		=> $keys
						);
						$status = $this->db->update("iwt_pages_scope", $pagesArray, $item);
					}
					$data = array(
						'language'			=> $this->lang,
						'status'			=> 1,
						'message'			=> "başarılı"
					);
				}else {
					$data = array(
						'language'			=> $this->lang,
						'status'			=> 0,
						'message'			=> "Güvenlik Ağına Takıldınız!"
					);
				}
			}
			
			$this->smarty->render('json', $data);
		}
		
		function panel_scope_update(array $config = []){
			$form_names = $this->csrf->form_names($config['data'], false);
			if(!empty($config['data']['seo_title']) AND !empty($config['data']['title'])){
				if($this->security->text($config['data']['seo_title']) == TRUE AND $this->security->text($config['data']['seo_keyword']) == TRUE AND $this->security->text($config['data']['seo_description']) == TRUE AND $this->security->num($config['data']['id']) == TRUE){
			
			
					//* gallery json kontrol
					$gallery = '{"gallery":[]}';
					json_decode($config['data']['gallery']);
					switch(json_last_error())
					{
						case JSON_ERROR_NONE:
							$gallery = $config['data']['gallery'];
						break;
					}
			
					$pagesArray = array(
						'seo_title' 		=> $config['data']['seo_title'],
						'seo_keyword' 		=> $config['data']['seo_keyword'],
						'seo_description'	=> $config['data']['seo_description'],
						'title' 			=> strip_tags($config['data']['title']),
						'sef'				=> $this->func->sef(strip_tags($config['data']['title'])),
						'content'			=> strip_tags($config['data']['content'], $this->izinlitag),
						'gallery'			=> $gallery
					);
					
					if(@$config['data']['photoReset'] === "on"){				
						if(!@$_FILES['photo']){
							$pagesArray['photo'] = "";
						}
					}
					
					if(@$_FILES['photo']){
						$this->upload = new upload($_FILES['photo']);
						if ($this->upload->uploaded) {
							$this->upload->file_new_name_body = uniqid() .'-'. rand(0,100000);
							$this->upload->image_convert = 'jpg';
							
							// yeniden farklı boyutta kayıt et
							/*$this->upload->image_resize = true;
							$this->upload->image_ratio_crop = true;
							$this->upload->image_x = 1000;
							$this->upload->image_y = 540;*/
							
							$this->upload->allowed = array ('image/*');
							$this->upload->Process("../".UPLOAD_FOLDER."/photo/");
							if ($this->upload->processed) {
								$pagesArray['photo'] = $this->upload->file_dst_name;
							}
						}
						
					}
					
					
					$where = $config['data']['id'];
								
					
					$lowerAdd = $this->db->update("iwt_pages_scope", $pagesArray , $where);
					if($lowerAdd){
						if($this->csrf->check_valid('post')) {
							$data = array(
								'language'			=> $this->lang,
								'status'			=> 1,
								'message'			=> "Tüm ayarlar güncellendi!"
							);
							$this->csrf->form_names($config['data'], true);
							
						}else {
							$data = array(
								'language'			=> $this->lang,
								'status'			=> 0,
								'message'			=> "Güvenlik Ağına Takıldınız!"
							);
						}
						
					}else {
						$data = array(
							'language'			=> $this->lang,
							'status'			=> 1,
							'message'			=> "Tüm ayarlar güncellendi!"
						);
					}
				
				}else {
					$data = array(
						'language'			=> $this->lang,
						'status'			=> 0,
						'message'			=> "Lütfen kutulardakı verileri tekrar kontrol ediniz!"
					);
				}
			}else {
				$data = array(
					'language'			=> $this->lang,
					'status'			=> 0,
					'message'			=> "Lütfen tüm alanları doldurunuz!"
				);	
			}
			$this->smarty->render('json', $data);
		}
		
		function panel_scope_delete(array $config = []){
			if($this->security->num($_GET['id']) == TRUE){
				$id= $_GET['id']; 
				$sil = $this->db->delete("iwt_pages_scope", $id);
				if($sil){
					$data = array(
						'language'			=> $this->lang,
						'status'			=> 1,
						'message'			=> "Silme işleme başarılı"
					);
				}else {
					$data = array(
						'language'			=> $this->lang,
						'status'			=> 1,
						'message'			=> "Kayıt sırasında hatalar meydana geldi!"
					);
				}
			}else {
				$data = array(
					'language'			=> $this->lang,
					'status'			=> 0,
					'message'			=> "Güvenlik Ağına Takıldınız!"
				);
			}
			
			$this->smarty->render('json', $data);
		}
		
		function panel_scope_insert(array $config = []){
			if($_POST){
				$form_names = $this->csrf->form_names($config['data'], false);
				if(!empty($config['data']['seo_title']) AND !empty($config['data']['seo_keyword']) AND !empty($config['data']['seo_description']) AND !empty($config['data']['title'])){
					if($this->security->text($config['data']['seo_title']) == TRUE AND $this->security->text($config['data']['seo_keyword']) == TRUE AND $this->security->text($config['data']['seo_description']) == TRUE AND $this->security->text($config['data']['title']) == TRUE){
						
						
						
						$pagesArray = array(
							'seo_title' => strip_tags($config['data']['seo_title']),
							'seo_keyword' => strip_tags($config['data']['seo_keyword']),
							'seo_description' => strip_tags($config['data']['seo_description']),
							'title' => strip_tags($config['data']['title']),
							'sef'	=> $this->func->sef($config['data']['title']),
							'page_id' => 20,
							'content' => strip_tags($config['data']['content'], $this->izinlitag)
						);
						
						if(@$config['data']['photoReset'] === "on"){				
							if(!@$_FILES['photo']){
								$pagesArray['photo'] = "";
							}
						}
						
						
						if(@$_FILES['photo']){
							$this->upload = new upload($_FILES['photo']);
							if ($this->upload->uploaded) {
								$this->upload->file_new_name_body = uniqid() .'-'. rand(0,100000);
								$this->upload->image_convert = 'jpg';
								
								// yeniden farklı boyutta kayıt et
								/*$this->upload->image_resize = true;
								$this->upload->image_ratio_crop = true;
								$this->upload->image_x = 1000;
								$this->upload->image_y = 540;*/
								
								$this->upload->allowed = array ('image/*');
								$this->upload->Process("../".UPLOAD_FOLDER."/photo/");
								if ($this->upload->processed) {
									$pagesArray['photo'] = $this->upload->file_dst_name;
								}
							}
							
						}
						
						$lowerAdd = $this->db->insert("iwt_pages_scope", $pagesArray);
						if($lowerAdd){
							if($this->csrf->check_valid('post')) {
								$data = array(
									'language'			=> $this->lang,
									'status'			=> 1,
									'message'			=> "Tüm ayarlar güncellendi!",
									'yonlendir'			=> "index.php?page=page/scope/edit&id=".$lowerAdd
								);
								$this->csrf->form_names($config['data'], true);
								
							}else {
								$data = array(
									'language'			=> $this->lang,
									'status'			=> 0,
									'message'			=> "Güvenlik Ağına Takıldınız!"
								);
							}
						}else {
							$data = array(
								'language'			=> $this->lang,
								'status'			=> 0,
								'message'			=> "Tüm ayarlar güncellendi!"
							);
						}
					
					}else {
						$data = array(
							'language'			=> $this->lang,
							'status'			=> 0,
							'message'			=> "Lütfen kutulardakı verileri tekrar kontrol ediniz!"
						);
					}
				}else {
					$data = array(
						'language'			=> $this->lang,
						'status'			=> 0,
						'message'			=> "Lütfen tüm alanları doldurunuz!"
					);	
				}
				$this->smarty->render('json', $data);
			}else {
				$token_id = $this->csrf->get_token_id();
				$token_value = $this->csrf->get_token($token_id);
				
				$data = array(
					'themelink' 		=> SITE_URL.'/'.THEME_FOLDER.'/'.ADMIN_FOLDER,
					'language' 			=> $this->lang,
					'session'	  		=> @$_SESSION['login'] == TRUE ? $_SESSION : FALSE,
					'token'				=> $token_value,
					'tokenID'			=> $token_id,
					'menu'				=> @count($this->menu) > 0 ? $this->menu : FALSE
				);
				
				$this->smarty->render('pages/scope/Add', $data);
				
			}
		}
		
		function panel_scope_edit(array $config = []){
			if($this->security->num(@$_GET['id']) == TRUE){
				$lowerArray= array(
					'id' => $_GET['id']
				);
				$lower = $this->db->select("iwt_pages_scope", $lowerArray, $relOpt = '=', $locOpt = 'and', $orderColumn = null, $orderOpt = null, $limit = null, $lmtStart = null);

				$gallery = (empty($lower[0]['gallery']) ? '{"gallery":[]}' : json_decode($lower[0]['gallery'], TRUE)['gallery']);

				$token_id = $this->csrf->get_token_id();
				$token_value = $this->csrf->get_token($token_id);
				
				$data = array(
					'themelink' 		=> SITE_URL.'/'.THEME_FOLDER.'/'.ADMIN_FOLDER,
					'language' 			=> $this->lang,
					'session'	  		=> @$_SESSION['login'] == TRUE ? $_SESSION : FALSE,
					'token'				=> $token_value,
					'tokenID'			=> $token_id,
					'lower'				=> @count($lower) > 0 ? $lower[0] : FALSE,
					'menu'				=> @count($this->menu) > 0 ? $this->menu : FALSE,
					'categorys'			=> json_decode($this->ayarlar[0]['jsonCategory'], TRUE)['category'][1], //* panel kategorileri
					'gallery'			=> $gallery,
					'kategori'			=> json_decode($lower[0]['categorys'], TRUE) //* arayüzde urun kategorileri
				);
				
				$this->smarty->render('pages/scope/Edit', $data);
			}else {
				die($this->func->yonlendir(0, "index.php?page=page/scope"));
			}
		}
		
		
		//* referance
		
		function panel_referance(array $config = []){
			if($_POST){
				$form_names = $this->csrf->form_names($config['data'], false);
					if(!empty($config['data']['seo_title'])){
						if($this->security->text($config['data']['seo_title']) == TRUE AND $this->security->text($config['data']['seo_keyword']) == TRUE AND $this->security->text($config['data']['seo_description']) == TRUE AND $this->security->num($config['data']['homepagestatus']) == TRUE){
						
							$pagesArray = array(
								'seo_title' => strip_tags($config['data']['seo_title']),
								'seo_keyword' => strip_tags($config['data']['seo_keyword']),
								'seo_description' => strip_tags($config['data']['seo_description']),
								'content' => strip_tags($config['data']['content'], $this->izinlitag),
								'homepagestatus' => (@$config['data']['homepagestatus'] == 1 ? 1 : 0 )
							);
							
							if(@$config['data']['photoReset'] === "on"){				
								if(!@$_FILES['photo']){
									$pagesArray['photo'] = "";
								}
							}
							
							if(@$_FILES['photo']){
								$this->upload = new upload($_FILES['photo']);
								if ($this->upload->uploaded) {
									$this->upload->file_new_name_body = uniqid() .'-'. rand(0,100000);
									$this->upload->image_convert = 'jpg';
									
									// yeniden farklı boyutta kayıt et
									/*$this->upload->image_resize = true;
									$this->upload->image_ratio_crop = true;
									$this->upload->image_x = 1000;
									$this->upload->image_y = 540;*/
									
									$this->upload->allowed = array ('image/*');
									$this->upload->Process("../".UPLOAD_FOLDER."/photo/");
									if ($this->upload->processed) {
										$pagesArray['photo'] = $this->upload->file_dst_name;
									}
								}
								
							}
							
							$where = 10;
							$pagesUPDATE = $this->db->update("iwt_pages", $pagesArray , $where);
							if($pagesUPDATE){
								if($this->csrf->check_valid('post')) {
									$data = array(
										'language'			=> $this->lang,
										'status'			=> 1,
										'message'			=> "Tüm ayarlar güncellendi!"
									);
									$this->csrf->form_names($config['data'], true);
								}else {
									$data = array(
										'language'			=> $this->lang,
										'status'			=> 0,
										'message'			=> "Güvenlik Ağına Takıldınız!"
									);
								}
							}else {
								$data = array(
									'language'			=> $this->lang,
									'status'			=> 1,
									'message'			=> "Tüm ayarlar güncellendi!"
								);
							}
						
						}else {
							$data = array(
								'language'			=> $this->lang,
								'status'			=> 0,
								'message'			=> "Lütfen kutulardakı verileri tekrar kontrol ediniz!"
							);
						}
					}else {
						$data = array(
							'language'			=> $this->lang,
							'status'			=> 0,
							'message'			=> "Lütfen tüm alanları doldurunuz!"
						);	
					}
					$this->smarty->render('json', $data);
			}else {
				
				//* Sayfayı çek
				$settingsArray= array(
					'id' => 10
				);
				$corporate = $this->db->select("iwt_pages", $settingsArray, $relOpt = '=', $locOpt = 'and', $orderColumn = null, $orderOpt = null, $limit = null, $lmtStart = null);
				
				//* Alt Sayfaları Çek
				$productsArray= array(
					'page_id' => $corporate[0]["id"]
				);
				$products = $this->db->select("iwt_pages_referance", $productsArray, $relOpt = '=', $locOpt = 'and', $orderColumn = "sort", $orderOpt = "asc", $limit = null, $lmtStart = null);
				$category = $this->db->select("iwt_pages_referance_category", "", $relOpt = '=', $locOpt = 'and', $orderColumn = "sort", $orderOpt = "asc", $limit = null, $lmtStart = null);

				
				
				$token_id = $this->csrf->get_token_id();
				$token_value = $this->csrf->get_token($token_id);
				
				$data = array(
					'themelink' 		=> SITE_URL.'/'.THEME_FOLDER.'/'.ADMIN_FOLDER,
					'language' 			=> $this->lang,
					'session'	  		=> @$_SESSION['login'] == TRUE ? $_SESSION : FALSE,
					'token'				=> $token_value,
					'tokenID'			=> $token_id,
					'homepage'			=> @count($corporate) > 0 ? $corporate[0] : FALSE,
					'products'			=> @count($products) > 0 ? $products : FALSE,
					'category'			=> @count($category) > 0 ? $category : FALSE,
					'menu'				=> @count($this->menu) > 0 ? $this->menu : FALSE,
					'categorys'			=> json_decode($this->ayarlar[0]['jsonCategory'], TRUE)['category']['referance']
				);
				
				$this->smarty->render('pages/referance/index', $data);
			}
		}
		
		function panel_referance_update(array $config = []){
			$form_names = $this->csrf->form_names($config['data'], false);
			if(!empty($config['data']['seo_title']) AND !empty($config['data']['title'])){
				if($this->security->text($config['data']['seo_title']) == TRUE AND $this->security->text($config['data']['seo_keyword']) == TRUE AND $this->security->text($config['data']['seo_description']) == TRUE AND $this->security->num($config['data']['id']) == TRUE){
			
					//* Kategoriler
					$categorys = json_encode(@$config['data']['categorys'], JSON_HEX_TAG);
					
					//* gallery json kontrol
					$gallery = '{"gallery":[]}';
					json_decode($config['data']['gallery']);
					switch(json_last_error())
					{
						case JSON_ERROR_NONE:
							$gallery = $config['data']['gallery'];
						break;
					}
			
					$pagesArray = array(
						'seo_title' 		=> $config['data']['seo_title'],
						'seo_keyword' 		=> $config['data']['seo_keyword'],
						'seo_description'	=> $config['data']['seo_description'],
						'title' 			=> strip_tags($config['data']['title']),
						'sef'				=> $this->func->sef(strip_tags($config['data']['title'])),
						'content'			=> strip_tags($config['data']['content'], $this->izinlitag),
						'gallery'			=> $gallery,
						'categorys'			=> $categorys
					);
					
					if(@$config['data']['photoReset'] === "on"){				
						if(!@$_FILES['photo']){
							$pagesArray['photo'] = "";
						}
					}
					
					
					if(@$_FILES['photo']){
						$this->upload = new upload($_FILES['photo']);
						if ($this->upload->uploaded) {
							$this->upload->file_new_name_body = uniqid() .'-'. rand(0,100000);
							$this->upload->image_convert = 'jpg';
							
							// yeniden farklı boyutta kayıt et
							/*$this->upload->image_resize = true;
							$this->upload->image_ratio_crop = true;
							$this->upload->image_x = 1000;
							$this->upload->image_y = 540;*/
							
							$this->upload->allowed = array ('image/*');
							$this->upload->Process("../".UPLOAD_FOLDER."/photo/");
							if ($this->upload->processed) {
								$pagesArray['photo'] = $this->upload->file_dst_name;
							}
						}
						
					}
					
					
					$where = $config['data']['id'];
								
					
					$lowerAdd = $this->db->update("iwt_pages_referance", $pagesArray , $where);
					if($lowerAdd){
						if($this->csrf->check_valid('post')) {
							$data = array(
								'language'			=> $this->lang,
								'status'			=> 1,
								'message'			=> "Tüm ayarlar güncellendi!"
							);
							$this->csrf->form_names($config['data'], true);
							
						}else {
							$data = array(
								'language'			=> $this->lang,
								'status'			=> 0,
								'message'			=> "Güvenlik Ağına Takıldınız!"
							);
						}
						
					}else {
						$data = array(
							'language'			=> $this->lang,
							'status'			=> 1,
							'message'			=> "Tüm ayarlar güncellendi!"
						);
					}
				
				}else {
					$data = array(
						'language'			=> $this->lang,
						'status'			=> 0,
						'message'			=> "Lütfen kutulardakı verileri tekrar kontrol ediniz!"
					);
				}
			}else {
				$data = array(
					'language'			=> $this->lang,
					'status'			=> 0,
					'message'			=> "Lütfen tüm alanları doldurunuz!"
				);	
			}
			$this->smarty->render('json', $data);
		}
		
		function panel_referance_status(array $config = []){
			if($this->security->num($_GET['id']) == TRUE AND $this->security->num($_GET['status']) == TRUE){
				
				$pagesArray = array(
					'status' 		=> (@$_GET['status'] == 1 ? 0 : 1)
				);
				$status = $this->db->update("iwt_pages_referance", $pagesArray, $_GET['id']);
				if($status){
					$data = array(
						'language'			=> $this->lang,
						'status'			=> 1,
						'message'			=> (@$_GET['status'] == 1 ? 0 : 1)
					);
				}else {
					$data = array(
						'language'			=> $this->lang,
						'status'			=> 2,
						'message'			=> "Kayıt sırasında hatalar meydana geldi!"
					);
				}
			}else {
				$data = array(
					'language'			=> $this->lang,
					'status'			=> 0,
					'message'			=> "Güvenlik Ağına Takıldınız!"
				);
			}
			
			$this->smarty->render('json', $data);
		}
		
		function panel_referance_sort(array $config = []){
			if($_POST){
				if(!empty($config['data']['item'])){
					foreach($config['data']['item'] as $keys => $item){
						$pagesArray = array(
							'sort' 		=> $keys
						);
						$status = $this->db->update("iwt_pages_referance", $pagesArray, $item);
					}
					$data = array(
						'language'			=> $this->lang,
						'status'			=> 1,
						'message'			=> "başarılı"
					);
				}else {
					$data = array(
						'language'			=> $this->lang,
						'status'			=> 0,
						'message'			=> "Güvenlik Ağına Takıldınız!"
					);
				}
			}
			
			$this->smarty->render('json', $data);
		}
		
		function panel_referance_delete(array $config = []){
			if($this->security->num($_GET['id']) == TRUE){
				$id= $_GET['id']; 
				$sil = $this->db->delete("iwt_pages_referance", $id);
				if($sil){
					$data = array(
						'language'			=> $this->lang,
						'status'			=> 1,
						'message'			=> "Silme işleme başarılı"
					);
				}else {
					$data = array(
						'language'			=> $this->lang,
						'status'			=> 1,
						'message'			=> "Kayıt sırasında hatalar meydana geldi!"
					);
				}
			}else {
				$data = array(
					'language'			=> $this->lang,
					'status'			=> 0,
					'message'			=> "Güvenlik Ağına Takıldınız!"
				);
			}
			
			$this->smarty->render('json', $data);
		}
		
		function panel_referance_insert(array $config = []){
			if($_POST){
				$form_names = $this->csrf->form_names($config['data'], false);
				if(!empty($config['data']['seo_title']) AND !empty($config['data']['seo_keyword']) AND !empty($config['data']['seo_description']) AND !empty($config['data']['title']) AND !empty($config['data']['categorys'])){
					if($this->security->text($config['data']['seo_title']) == TRUE AND $this->security->text($config['data']['seo_keyword']) == TRUE AND $this->security->text($config['data']['seo_description']) == TRUE AND $this->security->text($config['data']['title']) == TRUE){
						
						$categorys = json_encode(@$config['data']['categorys'], JSON_HEX_TAG);
						
						$pagesArray = array(
							'seo_title' => strip_tags($config['data']['seo_title']),
							'seo_keyword' => strip_tags($config['data']['seo_keyword']),
							'seo_description' => strip_tags($config['data']['seo_description']),
							'title' => strip_tags($config['data']['title']),
							'sef'	=> $this->func->sef($config['data']['title']),
							'page_id' => 10,
							'content' => strip_tags($config['data']['content'], $this->izinlitag),
							'categorys' => $categorys
						);
						
						if(@$config['data']['photoReset'] === "on"){				
							if(!@$_FILES['photo']){
								$pagesArray['photo'] = "";
							}
						}
						
						
						if(@$_FILES['photo']){
							$this->upload = new upload($_FILES['photo']);
							if ($this->upload->uploaded) {
								$this->upload->file_new_name_body = uniqid() .'-'. rand(0,100000);
								$this->upload->image_convert = 'jpg';
								
								// yeniden farklı boyutta kayıt et
								/*$this->upload->image_resize = true;
								$this->upload->image_ratio_crop = true;
								$this->upload->image_x = 1000;
								$this->upload->image_y = 540;*/
								
								$this->upload->allowed = array ('image/*');
								$this->upload->Process("../".UPLOAD_FOLDER."/photo/");
								if ($this->upload->processed) {
									$pagesArray['photo'] = $this->upload->file_dst_name;
								}
							}
							
						}
						
						$lowerAdd = $this->db->insert("iwt_pages_referance", $pagesArray);
						if($lowerAdd){
							if($this->csrf->check_valid('post')) {
								$data = array(
									'language'			=> $this->lang,
									'status'			=> 1,
									'message'			=> "Tüm ayarlar güncellendi!",
									'yonlendir'			=> "index.php?page=page/referance/edit&id=".$lowerAdd
								);
								$this->csrf->form_names($config['data'], true);
								
							}else {
								$data = array(
									'language'			=> $this->lang,
									'status'			=> 0,
									'message'			=> "Güvenlik Ağına Takıldınız!"
								);
							}
						}else {
							$data = array(
								'language'			=> $this->lang,
								'status'			=> 0,
								'message'			=> "Tüm ayarlar güncellendi!"
							);
						}
					
					}else {
						$data = array(
							'language'			=> $this->lang,
							'status'			=> 0,
							'message'			=> "Lütfen kutulardakı verileri tekrar kontrol ediniz!"
						);
					}
				}else {
					$data = array(
						'language'			=> $this->lang,
						'status'			=> 0,
						'message'			=> "Lütfen tüm alanları doldurunuz!"
					);	
				}
				$this->smarty->render('json', $data);
			}else {
				$category = $this->db->select("iwt_pages_referance_category", "", $relOpt = '=', $locOpt = 'and', $orderColumn = null, $orderOpt = null, $limit = null, $lmtStart = null);
				
				$token_id = $this->csrf->get_token_id();
				$token_value = $this->csrf->get_token($token_id);
				
				$data = array(
					'themelink' 		=> SITE_URL.'/'.THEME_FOLDER.'/'.ADMIN_FOLDER,
					'language' 			=> $this->lang,
					'session'	  		=> @$_SESSION['login'] == TRUE ? $_SESSION : FALSE,
					'token'				=> $token_value,
					'tokenID'			=> $token_id,
					'category'			=> @count($category) > 0 ? $category : FALSE,
					'menu'				=> @count($this->menu) > 0 ? $this->menu : FALSE,
					'categorys'			=> json_decode($this->ayarlar[0]['jsonCategory'], TRUE)['category'][1]
				);
				
				$this->smarty->render('pages/referance/Add', $data);
			}	
		}
		
		function panel_referance_edit(array $config = []){
			if($this->security->num(@$_GET['id']) == TRUE){
				$lowerArray= array(
					'id' => $_GET['id']
				);
				$lower = $this->db->select("iwt_pages_referance", $lowerArray, $relOpt = '=', $locOpt = 'and', $orderColumn = null, $orderOpt = null, $limit = null, $lmtStart = null);

				$category = $this->db->select("iwt_pages_referance_category", "", $relOpt = '=', $locOpt = 'and', $orderColumn = null, $orderOpt = null, $limit = null, $lmtStart = null);

				$gallery = (empty($lower[0]['gallery']) ? '{"gallery":[]}' : json_decode($lower[0]['gallery'], TRUE)['gallery']);

				$token_id = $this->csrf->get_token_id();
				$token_value = $this->csrf->get_token($token_id);
				
				$data = array(
					'themelink' 		=> SITE_URL.'/'.THEME_FOLDER.'/'.ADMIN_FOLDER,
					'language' 			=> $this->lang,
					'session'	  		=> @$_SESSION['login'] == TRUE ? $_SESSION : FALSE,
					'token'				=> $token_value,
					'tokenID'			=> $token_id,
					'lower'				=> @count($lower) > 0 ? $lower[0] : FALSE,
					'category'			=> @count($category) > 0 ? $category : FALSE,
					'menu'				=> @count($this->menu) > 0 ? $this->menu : FALSE,
					'categorys'			=> json_decode($this->ayarlar[0]['jsonCategory'], TRUE)['category'][1], //* panel kategorileri
					'gallery'			=> $gallery,
					'kategori'			=> json_decode($lower[0]['categorys'], TRUE) //* arayüzde urun kategorileri
				);
				
				$this->smarty->render('pages/referance/Edit', $data);
			}else {
				die($this->func->yonlendir(0, "index.php?page=page/referance"));
			}
		}
		
		function panel_referance_category_status(array $config = []){
			if($this->security->num($_GET['id']) == TRUE AND $this->security->num($_GET['status']) == TRUE){
				
				$pagesArray = array(
					'status' 		=> (@$_GET['status'] == 1 ? 0 : 1)
				);
				$status = $this->db->update("iwt_pages_referance_category", $pagesArray, $_GET['id']);
				if($status){
					$data = array(
						'language'			=> $this->lang,
						'status'			=> 1,
						'message'			=> (@$_GET['status'] == 1 ? 0 : 1)
					);
				}else {
					$data = array(
						'language'			=> $this->lang,
						'status'			=> 2,
						'message'			=> "Kayıt sırasında hatalar meydana geldi!"
					);
				}
			}else {
				$data = array(
					'language'			=> $this->lang,
					'status'			=> 0,
					'message'			=> "Güvenlik Ağına Takıldınız!"
				);
			}
			
			$this->smarty->render('json', $data);
		}
		
		function panel_referance_category_sort(array $config = []){
			if($_POST){
				if(!empty($config['data']['item'])){
					foreach($config['data']['item'] as $keys => $item){
						$pagesArray = array(
							'sort' 		=> $keys
						);
						$status = $this->db->update("iwt_pages_referance_category", $pagesArray, $item);
					}
					$data = array(
						'language'			=> $this->lang,
						'status'			=> 1,
						'message'			=> "başarılı"
					);
				}else {
					$data = array(
						'language'			=> $this->lang,
						'status'			=> 0,
						'message'			=> "Güvenlik Ağına Takıldınız!"
					);
				}
			}
			
			$this->smarty->render('json', $data);
		}
		
		function panel_referance_category_edit(array $config = []){
			if($this->security->num(@$_GET['id']) == TRUE){
				$lowerArray= array(
					'id' => $_GET['id']
				);
				$lower = $this->db->select("iwt_pages_referance_category", $lowerArray, $relOpt = '=', $locOpt = 'and', $orderColumn = "sort", $orderOpt = "asc", $limit = null, $lmtStart = null);

			
				$token_id = $this->csrf->get_token_id();
				$token_value = $this->csrf->get_token($token_id);
				
				$data = array(
					'themelink' 		=> SITE_URL.'/'.THEME_FOLDER.'/'.ADMIN_FOLDER,
					'language' 			=> $this->lang,
					'session'	  		=> @$_SESSION['login'] == TRUE ? $_SESSION : FALSE,
					'token'				=> $token_value,
					'tokenID'			=> $token_id,
					'lower'				=> @count($lower) > 0 ? $lower[0] : FALSE,
					'menu'				=> @count($this->menu) > 0 ? $this->menu : FALSE,
					'categorys'			=> json_decode($this->ayarlar[0]['jsonCategory'], TRUE)['category'][1]
				);
				
				$this->smarty->render('pages/referance/CategoryEdit', $data);
			}else {
				die($this->func->yonlendir(0, "index.php?page=page/referance"));
			}
		}
		
		function panel_referance_category_update(array $config = []){
			$form_names = $this->csrf->form_names($config['data'], false);
			if(!empty($config['data']['seo_title']) AND !empty($config['data']['title'])){
				if($this->security->text($config['data']['seo_title']) == TRUE AND $this->security->text($config['data']['seo_keyword']) == TRUE AND $this->security->text($config['data']['seo_description']) == TRUE AND $this->security->num($config['data']['id']) == TRUE){
			
				
					$pagesArray = array(
						'seo_title' 		=> $config['data']['seo_title'],
						'seo_keyword' 		=> $config['data']['seo_keyword'],
						'seo_description'	=> $config['data']['seo_description'],
						'title' 			=> strip_tags($config['data']['title']),
						'sef'				=> $this->func->sef(strip_tags($config['data']['title'])),
						'content'			=> strip_tags($config['data']['content'], $this->izinlitag)
					);
					
					$where = $config['data']['id'];
								
					
					$lowerAdd = $this->db->update("iwt_pages_referance_category", $pagesArray , $where);
					if($lowerAdd){
						if($this->csrf->check_valid('post')) {
							$data = array(
								'language'			=> $this->lang,
								'status'			=> 1,
								'message'			=> "Tüm ayarlar güncellendi!"
							);
							$this->csrf->form_names($config['data'], true);
						}else {
							$data = array(
								'language'			=> $this->lang,
								'status'			=> 0,
								'message'			=> "Güvenlik Ağına Takıldınız!"
							);
						}
					}else {
						$data = array(
							'language'			=> $this->lang,
							'status'			=> 0,
							'message'			=> "Tüm ayarlar güncellendi!"
						);
					}
				
				}else {
					$data = array(
						'language'			=> $this->lang,
						'status'			=> 0,
						'message'			=> "Lütfen kutulardakı verileri tekrar kontrol ediniz!"
					);
				}
			}else {
				$data = array(
					'language'			=> $this->lang,
					'status'			=> 0,
					'message'			=> "Lütfen tüm alanları doldurunuz!"
				);	
			}
			$this->smarty->render('json', $data);
		}
		
		function panel_referance_category_delete(array $config = []){
			if($this->security->num($_GET['id']) == TRUE){
				$id= $_GET['id']; 
				$sil = $this->db->delete("iwt_pages_referance_category", $id);
				if($sil){
					$data = array(
						'language'			=> $this->lang,
						'status'			=> 1,
						'message'			=> "Silme işleme başarılı"
					);
				}else {
					$data = array(
						'language'			=> $this->lang,
						'status'			=> 1,
						'message'			=> "Kayıt sırasında hatalar meydana geldi!"
					);
				}
			}else {
				$data = array(
					'language'			=> $this->lang,
					'status'			=> 0,
					'message'			=> "Güvenlik Ağına Takıldınız!"
				);
			}
			
			$this->smarty->render('json', $data);
		}
		
		
		function panel_referance_category_insert(array $config = []){
			$form_names = $this->csrf->form_names($config['data'], false);
				if(!empty($config['data']['seo_title'])){
					if($this->security->text($config['data']['seo_title']) == TRUE){
						$pagesArray = array(
							'seo_title' => strip_tags($config['data']['seo_title']),
							'title' => strip_tags($config['data']['seo_title']),
							'sef'	=> $this->func->sef(strip_tags($config['data']['seo_title']))
						);
						
						$lowerAdd = $this->db->insert("iwt_pages_referance_category", $pagesArray);
						if($lowerAdd){
							if($this->csrf->check_valid('post')) {
								$data = array(
									'language'			=> $this->lang,
									'status'			=> 1,
									'message'			=> "Tüm ayarlar güncellendi!",
									'yonlendir'			=> "index.php?page=page/referance/category/edit&id=".$lowerAdd
								);
								$this->csrf->form_names($config['data'], true);
							}else {
								$data = array(
									'language'			=> $this->lang,
									'status'			=> 0,
									'message'			=> "Güvenlik Ağına Takıldınız!"
								);
							}
						}else {
							$data = array(
								'language'			=> $this->lang,
								'status'			=> 0,
								'message'			=> "Tüm ayarlar güncellendi!"
							);
						}
					
					}else {
						$data = array(
							'language'			=> $this->lang,
							'status'			=> 0,
							'message'			=> "Lütfen kutulardakı verileri tekrar kontrol ediniz!"
						);
					}
				}else {
					$data = array(
						'language'			=> $this->lang,
						'status'			=> 0,
						'message'			=> "Lütfen tüm alanları doldurunuz!"
					);	
				}
				$this->smarty->render('json', $data);
		}
		
		
		//* news
		
		function panel_news(array $config = []){
			if($_POST){
				$form_names = $this->csrf->form_names($config['data'], false);
					if(!empty($config['data']['seo_title'])){
						if($this->security->text($config['data']['seo_title']) == TRUE AND $this->security->text($config['data']['seo_keyword']) == TRUE AND $this->security->text($config['data']['seo_description']) == TRUE AND $this->security->num($config['data']['homepagestatus']) == TRUE){
						
							$pagesArray = array(
								'seo_title' => strip_tags($config['data']['seo_title']),
								'seo_keyword' => strip_tags($config['data']['seo_keyword']),
								'seo_description' => strip_tags($config['data']['seo_description']),
								'content' => strip_tags($config['data']['content'], $this->izinlitag),
								'homepagestatus' => (@$config['data']['homepagestatus'] == 1 ? 1 : 0 )
							);
							
							if(@$_FILES['photo']){
								$this->upload = new upload($_FILES['photo']);
								if ($this->upload->uploaded) {
									$this->upload->file_new_name_body = uniqid() .'-'. rand(0,100000);
									$this->upload->image_convert = 'jpg';
									
									// yeniden farklı boyutta kayıt et
									/*$this->upload->image_resize = true;
									$this->upload->image_ratio_crop = true;
									$this->upload->image_x = 1000;
									$this->upload->image_y = 540;*/
									
									$this->upload->allowed = array ('image/*');
									$this->upload->Process("../".UPLOAD_FOLDER."/photo/");
									if ($this->upload->processed) {
										$pagesArray['photo'] = $this->upload->file_dst_name;
									}
								}
								
							}
							
							$where = 12;
							$pagesUPDATE = $this->db->update("iwt_pages", $pagesArray , $where);
							if($pagesUPDATE){
								if($this->csrf->check_valid('post')) {
									$data = array(
										'language'			=> $this->lang,
										'status'			=> 1,
										'message'			=> "Tüm ayarlar güncellendi!"
									);
									$this->csrf->form_names($config['data'], true);
								}else {
									$data = array(
										'language'			=> $this->lang,
										'status'			=> 0,
										'message'			=> "Güvenlik Ağına Takıldınız!"
									);
								}
							}else {
								$data = array(
									'language'			=> $this->lang,
									'status'			=> 1,
									'message'			=> "Tüm ayarlar güncellendi!"
								);
							}
						
						}else {
							$data = array(
								'language'			=> $this->lang,
								'status'			=> 0,
								'message'			=> "Lütfen kutulardakı verileri tekrar kontrol ediniz!"
							);
						}
					}else {
						$data = array(
							'language'			=> $this->lang,
							'status'			=> 0,
							'message'			=> "Lütfen tüm alanları doldurunuz!"
						);	
					}
					$this->smarty->render('json', $data);
			}else {
				
				//* Sayfayı çek
				$settingsArray= array(
					'id' => 12
				);
				$corporate = $this->db->select("iwt_pages", $settingsArray, $relOpt = '=', $locOpt = 'and', $orderColumn = null, $orderOpt = null, $limit = null, $lmtStart = null);
				
				//* Alt Sayfaları Çek
				$productsArray= array(
					'page_id' => $corporate[0]["id"]
				);
				$products = $this->db->select("iwt_pages_news", $productsArray, $relOpt = '=', $locOpt = 'and', $orderColumn = "sort", $orderOpt = "asc", $limit = null, $lmtStart = null);
				
				$token_id = $this->csrf->get_token_id();
				$token_value = $this->csrf->get_token($token_id);
				
				$data = array(
					'themelink' 		=> SITE_URL.'/'.THEME_FOLDER.'/'.ADMIN_FOLDER,
					'language' 			=> $this->lang,
					'session'	  		=> @$_SESSION['login'] == TRUE ? $_SESSION : FALSE,
					'token'				=> $token_value,
					'tokenID'			=> $token_id,
					'homepage'			=> @count($corporate) > 0 ? $corporate[0] : FALSE,
					'products'			=> @count($products) > 0 ? $products : FALSE,
					//'category'			=> @count($category) > 0 ? $category : FALSE,
					'menu'				=> @count($this->menu) > 0 ? $this->menu : FALSE,
					'categorys'			=> json_decode($this->ayarlar[0]['jsonCategory'], TRUE)['category']['news']
				);
				
				$this->smarty->render('pages/news/index', $data);
			}
		}
		
		function panel_news_status(array $config = []){
			if($this->security->num($_GET['id']) == TRUE AND $this->security->num($_GET['status']) == TRUE){
				
				$pagesArray = array(
					'status' 		=> (@$_GET['status'] == 1 ? 0 : 1)
				);
				$status = $this->db->update("iwt_pages_news", $pagesArray, $_GET['id']);
				if($status){
					$data = array(
						'language'			=> $this->lang,
						'status'			=> 1,
						'message'			=> (@$_GET['status'] == 1 ? 0 : 1)
					);
				}else {
					$data = array(
						'language'			=> $this->lang,
						'status'			=> 2,
						'message'			=> "Kayıt sırasında hatalar meydana geldi!"
					);
				}
			}else {
				$data = array(
					'language'			=> $this->lang,
					'status'			=> 0,
					'message'			=> "Güvenlik Ağına Takıldınız!"
				);
			}
			
			$this->smarty->render('json', $data);
		}
		
		function panel_news_sort(array $config = []){
			if($_POST){
				if(!empty($config['data']['item'])){
					foreach($config['data']['item'] as $keys => $item){
						$pagesArray = array(
							'sort' 		=> $keys
						);
						$status = $this->db->update("iwt_pages_news", $pagesArray, $item);
					}
					$data = array(
						'language'			=> $this->lang,
						'status'			=> 1,
						'message'			=> "başarılı"
					);
				}else {
					$data = array(
						'language'			=> $this->lang,
						'status'			=> 0,
						'message'			=> "Güvenlik Ağına Takıldınız!"
					);
				}
			}
			
			$this->smarty->render('json', $data);
		}
		
		function panel_news_update(array $config = []){
			$form_names = $this->csrf->form_names($config['data'], false);
			if(!empty($config['data']['seo_title']) AND !empty($config['data']['title'])){
				if($this->security->text($config['data']['seo_title']) == TRUE AND $this->security->text($config['data']['seo_keyword']) == TRUE AND $this->security->text($config['data']['seo_description']) == TRUE AND $this->security->num($config['data']['id']) == TRUE){
			
					
					//* gallery json kontrol
					$gallery = '{"gallery":[]}';
					json_decode($config['data']['gallery']);
					switch(json_last_error())
					{
						case JSON_ERROR_NONE:
							$gallery = $config['data']['gallery'];
						break;
					}
			
					$pagesArray = array(
						'seo_title' 		=> $config['data']['seo_title'],
						'seo_keyword' 		=> $config['data']['seo_keyword'],
						'seo_description'	=> $config['data']['seo_description'],
						'title' 			=> strip_tags($config['data']['title']),
						'sef'				=> $this->func->sef(strip_tags($config['data']['title'])),
						'content'			=> strip_tags($config['data']['content'], $this->izinlitag),
						'gallery'			=> $gallery
					);
					
					if(@$config['data']['photoReset'] === "on"){				
						if(!@$_FILES['photo']){
							$pagesArray['photo'] = "";
						}
					}
					
					if(@$_FILES['photo']){
						$this->upload = new upload($_FILES['photo']);
						if ($this->upload->uploaded) {
							$this->upload->file_new_name_body = uniqid() .'-'. rand(0,100000);
							$this->upload->image_convert = 'jpg';
							
							// yeniden farklı boyutta kayıt et
							/*$this->upload->image_resize = true;
							$this->upload->image_ratio_crop = true;
							$this->upload->image_x = 1000;
							$this->upload->image_y = 540;*/
							
							$this->upload->allowed = array ('image/*');
							$this->upload->Process("../".UPLOAD_FOLDER."/photo/");
							if ($this->upload->processed) {
								$pagesArray['photo'] = $this->upload->file_dst_name;
							}
						}
						
					}
					
					
					$where = $config['data']['id'];
								
					
					$lowerAdd = $this->db->update("iwt_pages_news", $pagesArray , $where);
					if($lowerAdd){
						if($this->csrf->check_valid('post')) {
							$data = array(
								'language'			=> $this->lang,
								'status'			=> 1,
								'message'			=> "Tüm ayarlar güncellendi!"
							);
							$this->csrf->form_names($config['data'], true);
							
						}else {
							$data = array(
								'language'			=> $this->lang,
								'status'			=> 0,
								'message'			=> "Güvenlik Ağına Takıldınız!"
							);
						}
						
					}else {
						$data = array(
							'language'			=> $this->lang,
							'status'			=> 1,
							'message'			=> "Tüm ayarlar güncellendi!"
						);
					}
				
				}else {
					$data = array(
						'language'			=> $this->lang,
						'status'			=> 0,
						'message'			=> "Lütfen kutulardakı verileri tekrar kontrol ediniz!"
					);
				}
			}else {
				$data = array(
					'language'			=> $this->lang,
					'status'			=> 0,
					'message'			=> "Lütfen tüm alanları doldurunuz!"
				);	
			}
			$this->smarty->render('json', $data);
		}
		
		function panel_news_delete(array $config = []){
			if($this->security->num($_GET['id']) == TRUE){
				$id= $_GET['id']; 
				$sil = $this->db->delete("iwt_pages_news", $id);
				if($sil){
					$data = array(
						'language'			=> $this->lang,
						'status'			=> 1,
						'message'			=> "Silme işleme başarılı"
					);
				}else {
					$data = array(
						'language'			=> $this->lang,
						'status'			=> 1,
						'message'			=> "Kayıt sırasında hatalar meydana geldi!"
					);
				}
			}else {
				$data = array(
					'language'			=> $this->lang,
					'status'			=> 0,
					'message'			=> "Güvenlik Ağına Takıldınız!"
				);
			}
			
			$this->smarty->render('json', $data);
		}
		
		function panel_news_insert(array $config = []){
			if($_POST){
				$form_names = $this->csrf->form_names($config['data'], false);
				if(!empty($config['data']['seo_title']) AND !empty($config['data']['seo_keyword']) AND !empty($config['data']['seo_description']) AND !empty($config['data']['title'])){
					if($this->security->text($config['data']['seo_title']) == TRUE AND $this->security->text($config['data']['seo_keyword']) == TRUE AND $this->security->text($config['data']['seo_description']) == TRUE AND $this->security->text($config['data']['title']) == TRUE){
				
						$pagesArray = array(
							'seo_title' => strip_tags($config['data']['seo_title']),
							'seo_keyword' => strip_tags($config['data']['seo_keyword']),
							'seo_description' => strip_tags($config['data']['seo_description']),
							'title' => strip_tags($config['data']['title']),
							'sef'	=> $this->func->sef($config['data']['title']),
							'page_id' => 12,
							'content' => strip_tags($config['data']['content'], $this->izinlitag)
						);
						
						if(@$config['data']['photoReset'] === "on"){				
							if(!@$_FILES['photo']){
								$pagesArray['photo'] = "";
							}
						}
						
						if(@$_FILES['photo']){
							$this->upload = new upload($_FILES['photo']);
							if ($this->upload->uploaded) {
								$this->upload->file_new_name_body = uniqid() .'-'. rand(0,100000);
								$this->upload->image_convert = 'jpg';
								
								// yeniden farklı boyutta kayıt et
								/*$this->upload->image_resize = true;
								$this->upload->image_ratio_crop = true;
								$this->upload->image_x = 1000;
								$this->upload->image_y = 540;*/
								
								$this->upload->allowed = array ('image/*');
								$this->upload->Process("../".UPLOAD_FOLDER."/photo/");
								if ($this->upload->processed) {
									$pagesArray['photo'] = $this->upload->file_dst_name;
								}
							}
							
						}
						
						$lowerAdd = $this->db->insert("iwt_pages_news", $pagesArray);
						if($lowerAdd){
							if($this->csrf->check_valid('post')) {
								$data = array(
									'language'			=> $this->lang,
									'status'			=> 1,
									'message'			=> "Tüm ayarlar güncellendi!",
									'yonlendir'			=> "index.php?page=page/news/edit&id=".$lowerAdd
								);
								$this->csrf->form_names($config['data'], true);
								
							}else {
								$data = array(
									'language'			=> $this->lang,
									'status'			=> 0,
									'message'			=> "Güvenlik Ağına Takıldınız!"
								);
							}
						}else {
							$data = array(
								'language'			=> $this->lang,
								'status'			=> 0,
								'message'			=> "Tüm ayarlar güncellendi!"
							);
						}
					
					}else {
						$data = array(
							'language'			=> $this->lang,
							'status'			=> 0,
							'message'			=> "Lütfen kutulardakı verileri tekrar kontrol ediniz!"
						);
					}
				}else {
					$data = array(
						'language'			=> $this->lang,
						'status'			=> 0,
						'message'			=> "Lütfen tüm alanları doldurunuz!"
					);	
				}
				$this->smarty->render('json', $data);
			}else {
				$token_id = $this->csrf->get_token_id();
				$token_value = $this->csrf->get_token($token_id);
				
				$data = array(
					'themelink' 		=> SITE_URL.'/'.THEME_FOLDER.'/'.ADMIN_FOLDER,
					'language' 			=> $this->lang,
					'session'	  		=> @$_SESSION['login'] == TRUE ? $_SESSION : FALSE,
					'token'				=> $token_value,
					'tokenID'			=> $token_id,
					'menu'				=> @count($this->menu) > 0 ? $this->menu : FALSE,
					'categorys'			=> json_decode($this->ayarlar[0]['jsonCategory'], TRUE)['category'][1]
				);
				
				$this->smarty->render('pages/news/Add', $data);
			}
		}
		
		function panel_news_edit(array $config = []){
			if($this->security->num(@$_GET['id']) == TRUE){
				$lowerArray= array(
					'id' => $_GET['id']
				);
				$lower = $this->db->select("iwt_pages_news", $lowerArray, $relOpt = '=', $locOpt = 'and', $orderColumn = null, $orderOpt = null, $limit = null, $lmtStart = null);

			//	$category = $this->db->select("iwt_pages_referance_category", "", $relOpt = '=', $locOpt = 'and', $orderColumn = null, $orderOpt = null, $limit = null, $lmtStart = null);

				$gallery = (empty($lower[0]['gallery']) ? '{"gallery":[]}' : json_decode($lower[0]['gallery'], TRUE)['gallery']);

				$token_id = $this->csrf->get_token_id();
				$token_value = $this->csrf->get_token($token_id);
				
				$data = array(
					'themelink' 		=> SITE_URL.'/'.THEME_FOLDER.'/'.ADMIN_FOLDER,
					'language' 			=> $this->lang,
					'session'	  		=> @$_SESSION['login'] == TRUE ? $_SESSION : FALSE,
					'token'				=> $token_value,
					'tokenID'			=> $token_id,
					'lower'				=> @count($lower) > 0 ? $lower[0] : FALSE,
					//'category'			=> @count($category) > 0 ? $category : FALSE,
					'menu'				=> @count($this->menu) > 0 ? $this->menu : FALSE,
					'categorys'			=> json_decode($this->ayarlar[0]['jsonCategory'], TRUE)['category'][1], //* panel kategorileri
					'gallery'			=> $gallery,
					'kategori'			=> json_decode($lower[0]['categorys'], TRUE) //* arayüzde urun kategorileri
				);
				
				$this->smarty->render('pages/news/Edit', $data);
			}else {
				die($this->func->yonlendir(0, "index.php?page=page/news"));
			}
		}
		
		
		
		
		
		//* announcements
		
		function panel_announcements(array $config = []){
			if($_POST){
				$form_names = $this->csrf->form_names($config['data'], false);
					if(!empty($config['data']['seo_title'])){
						if($this->security->text($config['data']['seo_title']) == TRUE AND $this->security->text($config['data']['seo_keyword']) == TRUE AND $this->security->text($config['data']['seo_description']) == TRUE AND $this->security->num($config['data']['homepagestatus']) == TRUE){
						
							$pagesArray = array(
								'seo_title' => strip_tags($config['data']['seo_title']),
								'seo_keyword' => strip_tags($config['data']['seo_keyword']),
								'seo_description' => strip_tags($config['data']['seo_description']),
								'content' => strip_tags($config['data']['content'], $this->izinlitag),
								'homepagestatus' => (@$config['data']['homepagestatus'] == 1 ? 1 : 0 )
							);
							
							if(@$_FILES['photo']){
								$this->upload = new upload($_FILES['photo']);
								if ($this->upload->uploaded) {
									$this->upload->file_new_name_body = uniqid() .'-'. rand(0,100000);
									$this->upload->image_convert = 'jpg';
									
									// yeniden farklı boyutta kayıt et
									/*$this->upload->image_resize = true;
									$this->upload->image_ratio_crop = true;
									$this->upload->image_x = 1000;
									$this->upload->image_y = 540;*/
									
									$this->upload->allowed = array ('image/*');
									$this->upload->Process("../".UPLOAD_FOLDER."/photo/");
									if ($this->upload->processed) {
										$pagesArray['photo'] = $this->upload->file_dst_name;
									}
								}
								
							}
							
							$where = 13;
							$pagesUPDATE = $this->db->update("iwt_pages", $pagesArray , $where);
							if($pagesUPDATE){
								if($this->csrf->check_valid('post')) {
									$data = array(
										'language'			=> $this->lang,
										'status'			=> 1,
										'message'			=> "Tüm ayarlar güncellendi!"
									);
									$this->csrf->form_names($config['data'], true);
								}else {
									$data = array(
										'language'			=> $this->lang,
										'status'			=> 0,
										'message'			=> "Güvenlik Ağına Takıldınız!"
									);
								}
							}else {
								$data = array(
									'language'			=> $this->lang,
									'status'			=> 1,
									'message'			=> "Tüm ayarlar güncellendi!"
								);
							}
						
						}else {
							$data = array(
								'language'			=> $this->lang,
								'status'			=> 0,
								'message'			=> "Lütfen kutulardakı verileri tekrar kontrol ediniz!"
							);
						}
					}else {
						$data = array(
							'language'			=> $this->lang,
							'status'			=> 0,
							'message'			=> "Lütfen tüm alanları doldurunuz!"
						);	
					}
					$this->smarty->render('json', $data);
			}else {
				
				//* Sayfayı çek
				$settingsArray= array(
					'id' => 13
				);
				$corporate = $this->db->select("iwt_pages", $settingsArray, $relOpt = '=', $locOpt = 'and', $orderColumn = null, $orderOpt = null, $limit = null, $lmtStart = null);
				
				//* Alt Sayfaları Çek
				$productsArray= array(
					'page_id' => $corporate[0]["id"]
				);
				$products = $this->db->select("iwt_pages_announcements", $productsArray, $relOpt = '=', $locOpt = 'and', $orderColumn = "sort", $orderOpt = "asc", $limit = null, $lmtStart = null);
				//$category = $this->db->select("iwt_pages_referance_category", "", $relOpt = '=', $locOpt = 'and', $orderColumn = null, $orderOpt = null, $limit = null, $lmtStart = null);

				
				
				$token_id = $this->csrf->get_token_id();
				$token_value = $this->csrf->get_token($token_id);
				
				$data = array(
					'themelink' 		=> SITE_URL.'/'.THEME_FOLDER.'/'.ADMIN_FOLDER,
					'language' 			=> $this->lang,
					'session'	  		=> @$_SESSION['login'] == TRUE ? $_SESSION : FALSE,
					'token'				=> $token_value,
					'tokenID'			=> $token_id,
					'homepage'			=> @count($corporate) > 0 ? $corporate[0] : FALSE,
					'products'			=> @count($products) > 0 ? $products : FALSE,
					//'category'			=> @count($category) > 0 ? $category : FALSE,
					'menu'				=> @count($this->menu) > 0 ? $this->menu : FALSE,
					'categorys'			=> json_decode($this->ayarlar[0]['jsonCategory'], TRUE)['category']['announcements']
				);
				
				$this->smarty->render('pages/announcements/index', $data);
			}
		}
		
		function panel_announcements_status(array $config = []){
			if($this->security->num($_GET['id']) == TRUE AND $this->security->num($_GET['status']) == TRUE){
				
				$pagesArray = array(
					'status' 		=> (@$_GET['status'] == 1 ? 0 : 1)
				);
				$status = $this->db->update("iwt_pages_announcements", $pagesArray, $_GET['id']);
				if($status){
					$data = array(
						'language'			=> $this->lang,
						'status'			=> 1,
						'message'			=> (@$_GET['status'] == 1 ? 0 : 1)
					);
				}else {
					$data = array(
						'language'			=> $this->lang,
						'status'			=> 2,
						'message'			=> "Kayıt sırasında hatalar meydana geldi!"
					);
				}
			}else {
				$data = array(
					'language'			=> $this->lang,
					'status'			=> 0,
					'message'			=> "Güvenlik Ağına Takıldınız!"
				);
			}
			
			$this->smarty->render('json', $data);
		}
		
		function panel_announcements_sort(array $config = []){
			if($_POST){
				if(!empty($config['data']['item'])){
					foreach($config['data']['item'] as $keys => $item){
						$pagesArray = array(
							'sort' 		=> $keys
						);
						$status = $this->db->update("iwt_pages_announcements", $pagesArray, $item);
					}
					$data = array(
						'language'			=> $this->lang,
						'status'			=> 1,
						'message'			=> "başarılı"
					);
				}else {
					$data = array(
						'language'			=> $this->lang,
						'status'			=> 0,
						'message'			=> "Güvenlik Ağına Takıldınız!"
					);
				}
			}
			
			$this->smarty->render('json', $data);
		}
		
		function panel_announcements_update(array $config = []){
			$form_names = $this->csrf->form_names($config['data'], false);
			if(!empty($config['data']['seo_title']) AND !empty($config['data']['title'])){
				if($this->security->text($config['data']['seo_title']) == TRUE AND $this->security->num($config['data']['id']) == TRUE){
		
					$pagesArray = array(
						'seo_title' 		=> $config['data']['seo_title']
					);
					
					$where = $config['data']['id'];
								
					
					$lowerAdd = $this->db->update("iwt_pages_announcements", $pagesArray , $where);
					if($lowerAdd){
						if($this->csrf->check_valid('post')) {
							$data = array(
								'language'			=> $this->lang,
								'status'			=> 1,
								'message'			=> "Tüm ayarlar güncellendi!"
							);
							$this->csrf->form_names($config['data'], true);
							
						}else {
							$data = array(
								'language'			=> $this->lang,
								'status'			=> 0,
								'message'			=> "Güvenlik Ağına Takıldınız!"
							);
						}
						
					}else {
						$data = array(
							'language'			=> $this->lang,
							'status'			=> 1,
							'message'			=> "Tüm ayarlar güncellendi!"
						);
					}
				
				}else {
					$data = array(
						'language'			=> $this->lang,
						'status'			=> 0,
						'message'			=> "Lütfen kutulardakı verileri tekrar kontrol ediniz!"
					);
				}
			}else {
				$data = array(
					'language'			=> $this->lang,
					'status'			=> 0,
					'message'			=> "Lütfen tüm alanları doldurunuz!"
				);	
			}
			$this->smarty->render('json', $data);
		}
		
		function panel_announcements_delete(array $config = []){
			if($this->security->num($_GET['id']) == TRUE){
				$id= $_GET['id']; 
				$sil = $this->db->delete("iwt_pages_announcements", $id);
				if($sil){
					$data = array(
						'language'			=> $this->lang,
						'status'			=> 1,
						'message'			=> "Silme işleme başarılı"
					);
				}else {
					$data = array(
						'language'			=> $this->lang,
						'status'			=> 1,
						'message'			=> "Kayıt sırasında hatalar meydana geldi!"
					);
				}
			}else {
				$data = array(
					'language'			=> $this->lang,
					'status'			=> 0,
					'message'			=> "Güvenlik Ağına Takıldınız!"
				);
			}
			
			$this->smarty->render('json', $data);
		}
		
		function panel_announcements_insert(array $config = []){
			$form_names = $this->csrf->form_names($config['data'], false);
				if(!empty($config['data']['seo_title'])){
					if($this->security->text($config['data']['seo_title']) == TRUE){
						$pagesArray = array(
							'seo_title' => strip_tags($config['data']['seo_title']),
							'page_id' => 13
						);
						
						$lowerAdd = $this->db->insert("iwt_pages_announcements", $pagesArray);
						if($lowerAdd){
							if($this->csrf->check_valid('post')) {
								$data = array(
									'language'			=> $this->lang,
									'status'			=> 1,
									'message'			=> "Tüm ayarlar güncellendi!",
									'yonlendir'			=> "index.php?page=page/announcements/edit&id=".$lowerAdd
								);
								$this->csrf->form_names($config['data'], true);
								
							}else {
								$data = array(
									'language'			=> $this->lang,
									'status'			=> 0,
									'message'			=> "Güvenlik Ağına Takıldınız!"
								);
							}
						}else {
							$data = array(
								'language'			=> $this->lang,
								'status'			=> 0,
								'message'			=> "Tüm ayarlar güncellendi!"
							);
						}
					
					}else {
						$data = array(
							'language'			=> $this->lang,
							'status'			=> 0,
							'message'			=> "Lütfen kutulardakı verileri tekrar kontrol ediniz!"
						);
					}
				}else {
					$data = array(
						'language'			=> $this->lang,
						'status'			=> 0,
						'message'			=> "Lütfen tüm alanları doldurunuz!"
					);	
				}
				$this->smarty->render('json', $data);
		}
		
		function panel_announcements_edit(array $config = []){
			if($this->security->num(@$_GET['id']) == TRUE){
				$lowerArray= array(
					'id' => $_GET['id']
				);
				$lower = $this->db->select("iwt_pages_announcements", $lowerArray, $relOpt = '=', $locOpt = 'and', $orderColumn = null, $orderOpt = null, $limit = null, $lmtStart = null);

			//	$category = $this->db->select("iwt_pages_referance_category", "", $relOpt = '=', $locOpt = 'and', $orderColumn = null, $orderOpt = null, $limit = null, $lmtStart = null);

				$gallery = (empty($lower[0]['gallery']) ? '{"gallery":[]}' : json_decode($lower[0]['gallery'], TRUE)['gallery']);

				$token_id = $this->csrf->get_token_id();
				$token_value = $this->csrf->get_token($token_id);
				
				$data = array(
					'themelink' 		=> SITE_URL.'/'.THEME_FOLDER.'/'.ADMIN_FOLDER,
					'language' 			=> $this->lang,
					'session'	  		=> @$_SESSION['login'] == TRUE ? $_SESSION : FALSE,
					'token'				=> $token_value,
					'tokenID'			=> $token_id,
					'lower'				=> @count($lower) > 0 ? $lower[0] : FALSE,
					//'category'			=> @count($category) > 0 ? $category : FALSE,
					'menu'				=> @count($this->menu) > 0 ? $this->menu : FALSE,
					'categorys'			=> json_decode($this->ayarlar[0]['jsonCategory'], TRUE)['category'][1], //* panel kategorileri
					'gallery'			=> $gallery,
					'kategori'			=> json_decode($lower[0]['categorys'], TRUE) //* arayüzde urun kategorileri
				);
				
				$this->smarty->render('pages/announcements/Edit', $data);
			}else {
				die($this->func->yonlendir(0, "index.php?page=page/announcements"));
			}
		}
		
		
		
		
		function panel_contact(array $config = []){
				
				$contact = $this->db->select("iwt_pages_contact", NULL, $relOpt = '=', $locOpt = 'and', $orderColumn = null, $orderOpt = null, $limit = null, $lmtStart = null);
			
				$token_id = $this->csrf->get_token_id();
				$token_value = $this->csrf->get_token($token_id);
				
				$data = array(
					'themelink' 		=> SITE_URL.'/'.THEME_FOLDER.'/'.ADMIN_FOLDER,
					'language' 			=> $this->lang,
					'session'	  		=> @$_SESSION['login'] == TRUE ? $_SESSION : FALSE,
					'token'				=> $token_value,
					'tokenID'			=> $token_id,
					'contact'			=> @count($contact) > 0 ? $contact : FALSE,
					'menu'				=> @count($this->menu) > 0 ? $this->menu : FALSE,
					'altmenu'			=> @count($this->altmenu) > 0 ? $this->altmenu : FALSE
				);
				
				$this->smarty->render('pages/contact/index', $data);
			
			
		}
		
		
		//* Gallery
		
		function panel_gallery(array $config = []){
			if($_POST){
				$form_names = $this->csrf->form_names($config['data'], false);
					if(!empty($config['data']['seo_title'])){
						if($this->security->text($config['data']['seo_title']) == TRUE AND $this->security->text($config['data']['seo_keyword']) == TRUE AND $this->security->text($config['data']['seo_description']) == TRUE AND $this->security->num($config['data']['homepagestatus']) == TRUE){
						
							$pagesArray = array(
								'seo_title' => strip_tags($config['data']['seo_title']),
								'seo_keyword' => strip_tags($config['data']['seo_keyword']),
								'seo_description' => strip_tags($config['data']['seo_description']),
								'content' => strip_tags($config['data']['content'], $this->izinlitag),
								'homepagestatus' => (@$config['data']['homepagestatus'] == 1 ? 1 : 0 )
							);
							
							if(@$_FILES['photo']){
								$this->upload = new upload($_FILES['photo']);
								if ($this->upload->uploaded) {
									$this->upload->file_new_name_body = uniqid() .'-'. rand(0,100000);
									$this->upload->image_convert = 'jpg';
									
									// yeniden farklı boyutta kayıt et
									/*$this->upload->image_resize = true;
									$this->upload->image_ratio_crop = true;
									$this->upload->image_x = 1000;
									$this->upload->image_y = 540;*/
									
									$this->upload->allowed = array ('image/*');
									$this->upload->Process("../".UPLOAD_FOLDER."/photo/");
									if ($this->upload->processed) {
										$pagesArray['photo'] = $this->upload->file_dst_name;
									}
								}
								
							}
							
							$where = 14;
							$pagesUPDATE = $this->db->update("iwt_pages", $pagesArray , $where);
							if($pagesUPDATE){
								if($this->csrf->check_valid('post')) {
									$data = array(
										'language'			=> $this->lang,
										'status'			=> 1,
										'message'			=> "Tüm ayarlar güncellendi!"
									);
									$this->csrf->form_names($config['data'], true);
								}else {
									$data = array(
										'language'			=> $this->lang,
										'status'			=> 0,
										'message'			=> "Güvenlik Ağına Takıldınız!"
									);
								}
							}else {
								$data = array(
									'language'			=> $this->lang,
									'status'			=> 1,
									'message'			=> "Tüm ayarlar güncellendi!"
								);
							}
						
						}else {
							$data = array(
								'language'			=> $this->lang,
								'status'			=> 0,
								'message'			=> "Lütfen kutulardakı verileri tekrar kontrol ediniz!"
							);
						}
					}else {
						$data = array(
							'language'			=> $this->lang,
							'status'			=> 0,
							'message'			=> "Lütfen tüm alanları doldurunuz!"
						);	
					}
					$this->smarty->render('json', $data);
			}else {
				
				//* Sayfayı çek
				$settingsArray= array(
					'id' => 14
				);
				$corporate = $this->db->select("iwt_pages", $settingsArray, $relOpt = '=', $locOpt = 'and', $orderColumn = null, $orderOpt = null, $limit = null, $lmtStart = null);
				
				//* Alt Sayfaları Çek
				$productsArray= array(
					'page_id' => $corporate[0]["id"]
				);
				$products = $this->db->select("iwt_pages_gallery", $productsArray, $relOpt = '=', $locOpt = 'and', $orderColumn = "sort", $orderOpt = "asc", $limit = null, $lmtStart = null);
				//$category = $this->db->select("iwt_pages_referance_category", "", $relOpt = '=', $locOpt = 'and', $orderColumn = null, $orderOpt = null, $limit = null, $lmtStart = null);

				
				
				$token_id = $this->csrf->get_token_id();
				$token_value = $this->csrf->get_token($token_id);
				
				$data = array(
					'themelink' 		=> SITE_URL.'/'.THEME_FOLDER.'/'.ADMIN_FOLDER,
					'language' 			=> $this->lang,
					'session'	  		=> @$_SESSION['login'] == TRUE ? $_SESSION : FALSE,
					'token'				=> $token_value,
					'tokenID'			=> $token_id,
					'homepage'			=> @count($corporate) > 0 ? $corporate[0] : FALSE,
					'products'			=> @count($products) > 0 ? $products : FALSE,
					//'category'			=> @count($category) > 0 ? $category : FALSE,
					'menu'				=> @count($this->menu) > 0 ? $this->menu : FALSE,
					'categorys'			=> json_decode($this->ayarlar[0]['jsonCategory'], TRUE)['category']['gallery']
				);
				
				$this->smarty->render('pages/gallery/index', $data);
			}
		}
		
		function panel_gallery_status(array $config = []){
			if($this->security->num($_GET['id']) == TRUE AND $this->security->num($_GET['status']) == TRUE){
				
				$pagesArray = array(
					'status' 		=> (@$_GET['status'] == 1 ? 0 : 1)
				);
				$status = $this->db->update("iwt_pages_gallery", $pagesArray, $_GET['id']);
				if($status){
					$data = array(
						'language'			=> $this->lang,
						'status'			=> 1,
						'message'			=> (@$_GET['status'] == 1 ? 0 : 1)
					);
				}else {
					$data = array(
						'language'			=> $this->lang,
						'status'			=> 2,
						'message'			=> "Kayıt sırasında hatalar meydana geldi!"
					);
				}
			}else {
				$data = array(
					'language'			=> $this->lang,
					'status'			=> 0,
					'message'			=> "Güvenlik Ağına Takıldınız!"
				);
			}
			
			$this->smarty->render('json', $data);
		}
		
		function panel_gallery_sort(array $config = []){
			if($_POST){
				if(!empty($config['data']['item'])){
					foreach($config['data']['item'] as $keys => $item){
						$pagesArray = array(
							'sort' 		=> $keys
						);
						$status = $this->db->update("iwt_pages_gallery", $pagesArray, $item);
					}
					$data = array(
						'language'			=> $this->lang,
						'status'			=> 1,
						'message'			=> "başarılı"
					);
				}else {
					$data = array(
						'language'			=> $this->lang,
						'status'			=> 0,
						'message'			=> "Güvenlik Ağına Takıldınız!"
					);
				}
			}
			
			$this->smarty->render('json', $data);
		}
		
		function panel_gallery_update(array $config = []){
			$form_names = $this->csrf->form_names($config['data'], false);
			if(!empty($config['data']['seo_title'])){
				if($this->security->text($config['data']['seo_title']) == TRUE AND $this->security->text($config['data']['seo_keyword']) == TRUE AND $this->security->text($config['data']['seo_description']) == TRUE AND $this->security->num($config['data']['id']) == TRUE){
			
					
					//* gallery json kontrol
					$gallery = '{"gallery":[]}';
					json_decode($config['data']['gallery']);
					switch(json_last_error())
					{
						case JSON_ERROR_NONE:
							$gallery = $config['data']['gallery'];
						break;
					}
			
					$pagesArray = array(
						'seo_title' 		=> $config['data']['seo_title'],
						'seo_keyword' 		=> $config['data']['seo_keyword'],
						'seo_description'	=> $config['data']['seo_description'],
						'sef'				=> $this->func->sef($config['data']['seo_title']),
						'gallery'			=> $gallery
					);
					
					if(@$config['data']['photoReset'] === "on"){				
						if(!@$_FILES['photo']){
							$pagesArray['photo'] = "";
						}
					}
					
					if(@$_FILES['photo']){
						$this->upload = new upload($_FILES['photo']);
						if ($this->upload->uploaded) {
							$this->upload->file_new_name_body = uniqid() .'-'. rand(0,100000);
							$this->upload->image_convert = 'jpg';
							
							// yeniden farklı boyutta kayıt et
							/*$this->upload->image_resize = true;
							$this->upload->image_ratio_crop = true;
							$this->upload->image_x = 1000;
							$this->upload->image_y = 540;*/
							
							$this->upload->allowed = array ('image/*');
							$this->upload->Process("../".UPLOAD_FOLDER."/photo/");
							if ($this->upload->processed) {
								$pagesArray['photo'] = $this->upload->file_dst_name;
							}
						}
						
					}
					
					
					$where = $config['data']['id'];
								
					
					$lowerAdd = $this->db->update("iwt_pages_gallery", $pagesArray , $where);
					if($lowerAdd){
						if($this->csrf->check_valid('post')) {
							$data = array(
								'language'			=> $this->lang,
								'status'			=> 1,
								'message'			=> "Tüm ayarlar güncellendi!"
							);
							$this->csrf->form_names($config['data'], true);
							
						}else {
							$data = array(
								'language'			=> $this->lang,
								'status'			=> 0,
								'message'			=> "Güvenlik Ağına Takıldınız!"
							);
						}
						
					}else {
						$data = array(
							'language'			=> $this->lang,
							'status'			=> 1,
							'message'			=> "Tüm ayarlar güncellendi!"
						);
					}
				
				}else {
					$data = array(
						'language'			=> $this->lang,
						'status'			=> 0,
						'message'			=> "Lütfen kutulardakı verileri tekrar kontrol ediniz!"
					);
				}
			}else {
				$data = array(
					'language'			=> $this->lang,
					'status'			=> 0,
					'message'			=> "Lütfen tüm alanları doldurunuz!"
				);	
			}
			$this->smarty->render('json', $data);
		}
		
		function panel_gallery_delete(array $config = []){
			if($this->security->num($_GET['id']) == TRUE){
				$id= $_GET['id']; 
				$sil = $this->db->delete("iwt_pages_gallery", $id);
				if($sil){
					$data = array(
						'language'			=> $this->lang,
						'status'			=> 1,
						'message'			=> "Silme işleme başarılı"
					);
				}else {
					$data = array(
						'language'			=> $this->lang,
						'status'			=> 1,
						'message'			=> "Kayıt sırasında hatalar meydana geldi!"
					);
				}
			}else {
				$data = array(
					'language'			=> $this->lang,
					'status'			=> 0,
					'message'			=> "Güvenlik Ağına Takıldınız!"
				);
			}
			
			$this->smarty->render('json', $data);
		}
		
		function panel_gallery_insert(array $config = []){
			if($_POST){
				$form_names = $this->csrf->form_names($config['data'], false);
				if(!empty($config['data']['seo_title']) AND !empty($config['data']['seo_keyword']) AND !empty($config['data']['seo_description'])){
					if($this->security->text($config['data']['seo_title']) == TRUE AND $this->security->text($config['data']['seo_keyword']) == TRUE AND $this->security->text($config['data']['seo_description']) == TRUE){
						
						//* gallery json kontrol
						$gallery = '{"gallery":[]}';
						json_decode($gallery);
						switch(json_last_error())
						{
							case JSON_ERROR_DEPTH:
								$gallery = $gallery;
							break;
							case JSON_ERROR_CTRL_CHAR:
								$gallery = $gallery;
							break;
							
							case JSON_ERROR_SYNTAX:
								$gallery = $gallery;
							break;
							
							case JSON_ERROR_NONE:
								if(empty($config['data']['gallery'])){
									$gallery = $gallery;
								}else {
									$gallery = $config['data']['gallery'];
								}
							break;
						}
						
						
						$pagesArray = array(
							'seo_title' => strip_tags($config['data']['seo_title']),
							'seo_keyword' => strip_tags($config['data']['seo_keyword']),
							'seo_description' => strip_tags($config['data']['seo_description']),
							'title' => strip_tags($config['data']['seo_title']),
							'sef'	=> $this->func->sef($config['data']['seo_title']),
							'page_id' => 14,
							'gallery' => $gallery
						);
						
						if(@$_FILES['photo']){
							$this->upload = new upload($_FILES['photo']);
							if ($this->upload->uploaded) {
								$this->upload->file_new_name_body = uniqid() .'-'. rand(0,100000);
								$this->upload->image_convert = 'jpg';
								
								// yeniden farklı boyutta kayıt et
								/*$this->upload->image_resize = true;
								$this->upload->image_ratio_crop = true;
								$this->upload->image_x = 1000;
								$this->upload->image_y = 540;*/
								
								$this->upload->allowed = array ('image/*');
								$this->upload->Process("../".UPLOAD_FOLDER."/photo/");
								if ($this->upload->processed) {
									$pagesArray['photo'] = $this->upload->file_dst_name;
								}
							}
							
						}
						
						$lowerAdd = $this->db->insert("iwt_pages_gallery", $pagesArray);
						if($lowerAdd){
							if($this->csrf->check_valid('post')) {
								$data = array(
									'language'			=> $this->lang,
									'status'			=> 1,
									'message'			=> "Tüm ayarlar güncellendi!",
									'yonlendir'			=> "index.php?page=page/gallery/edit&id=".$lowerAdd
								);
								$this->csrf->form_names($config['data'], true);
								
							}else {
								$data = array(
									'language'			=> $this->lang,
									'status'			=> 0,
									'message'			=> "Güvenlik Ağına Takıldınız!"
								);
							}
						}else {
							$data = array(
								'language'			=> $this->lang,
								'status'			=> 0,
								'message'			=> "Tüm ayarlar güncellendi!"
							);
						}
					
					}else {
						$data = array(
							'language'			=> $this->lang,
							'status'			=> 0,
							'message'			=> "Lütfen kutulardakı verileri tekrar kontrol ediniz!"
						);
					}
				}else {
					$data = array(
						'language'			=> $this->lang,
						'status'			=> 0,
						'message'			=> "Lütfen tüm alanları doldurunuz!"
					);	
				}
				$this->smarty->render('json', $data);
			}else {
				$token_id = $this->csrf->get_token_id();
				$token_value = $this->csrf->get_token($token_id);
				
				$data = array(
					'themelink' 		=> SITE_URL.'/'.THEME_FOLDER.'/'.ADMIN_FOLDER,
					'language' 			=> $this->lang,
					'session'	  		=> @$_SESSION['login'] == TRUE ? $_SESSION : FALSE,
					'token'				=> $token_value,
					'tokenID'			=> $token_id,
					'menu'				=> @count($this->menu) > 0 ? $this->menu : FALSE,
					'categorys'			=> json_decode($this->ayarlar[0]['jsonCategory'], TRUE)['category'][1], //* panel kategorileri
					'gallery'			=> '{"gallery":[]}'
				);
				
				$this->smarty->render('pages/gallery/Add', $data);
			}
			
				
		}
		
		function panel_gallery_edit(array $config = []){
			if($this->security->num(@$_GET['id']) == TRUE){
				$lowerArray= array(
					'id' => $_GET['id']
				);
				$lower = $this->db->select("iwt_pages_gallery", $lowerArray, $relOpt = '=', $locOpt = 'and', $orderColumn = null, $orderOpt = null, $limit = null, $lmtStart = null);

			//	$category = $this->db->select("iwt_pages_referance_category", "", $relOpt = '=', $locOpt = 'and', $orderColumn = null, $orderOpt = null, $limit = null, $lmtStart = null);

				$gallery = (empty($lower[0]['gallery']) ? '{"gallery":[]}' : json_decode($lower[0]['gallery'], TRUE)['gallery']);

				$token_id = $this->csrf->get_token_id();
				$token_value = $this->csrf->get_token($token_id);
				
				$data = array(
					'themelink' 		=> SITE_URL.'/'.THEME_FOLDER.'/'.ADMIN_FOLDER,
					'language' 			=> $this->lang,
					'session'	  		=> @$_SESSION['login'] == TRUE ? $_SESSION : FALSE,
					'token'				=> $token_value,
					'tokenID'			=> $token_id,
					'lower'				=> @count($lower) > 0 ? $lower[0] : FALSE,
					//'category'			=> @count($category) > 0 ? $category : FALSE,
					'menu'				=> @count($this->menu) > 0 ? $this->menu : FALSE,
					'categorys'			=> json_decode($this->ayarlar[0]['jsonCategory'], TRUE)['category'][1], //* panel kategorileri
					'gallery'			=> $gallery,
					'kategori'			=> json_decode($lower[0]['categorys'], TRUE) //* arayüzde urun kategorileri
				);
				
				$this->smarty->render('pages/gallery/Edit', $data);
			}else {
				die($this->func->yonlendir(0, "index.php?page=page/gallery"));
			}
		}
		
		
		//* thoughts
		
		function panel_thoughts(array $config = []){
			if($_POST){
				$form_names = $this->csrf->form_names($config['data'], false);
					if(!empty($config['data']['seo_title'])){
						if($this->security->text($config['data']['seo_title']) == TRUE AND $this->security->text($config['data']['seo_keyword']) == TRUE AND $this->security->text($config['data']['seo_description']) == TRUE AND $this->security->num($config['data']['homepagestatus']) == TRUE){
						
							$pagesArray = array(
								'seo_title' => strip_tags($config['data']['seo_title']),
								'seo_keyword' => strip_tags($config['data']['seo_keyword']),
								'seo_description' => strip_tags($config['data']['seo_description']),
								'content' => strip_tags($config['data']['content'], $this->izinlitag),
								'homepagestatus' => (@$config['data']['homepagestatus'] == 1 ? 1 : 0 )
							);
							
							if(@$_FILES['photo']){
								$this->upload = new upload($_FILES['photo']);
								if ($this->upload->uploaded) {
									$this->upload->file_new_name_body = uniqid() .'-'. rand(0,100000);
									$this->upload->image_convert = 'jpg';
									
									// yeniden farklı boyutta kayıt et
									/*$this->upload->image_resize = true;
									$this->upload->image_ratio_crop = true;
									$this->upload->image_x = 1000;
									$this->upload->image_y = 540;*/
									
									$this->upload->allowed = array ('image/*');
									$this->upload->Process("../".UPLOAD_FOLDER."/photo/");
									if ($this->upload->processed) {
										$pagesArray['photo'] = $this->upload->file_dst_name;
									}
								}
								
							}
							
							$where = 21;
							$pagesUPDATE = $this->db->update("iwt_pages", $pagesArray , $where);
							if($pagesUPDATE){
								if($this->csrf->check_valid('post')) {
									$data = array(
										'language'			=> $this->lang,
										'status'			=> 1,
										'message'			=> "Tüm ayarlar güncellendi!"
									);
									$this->csrf->form_names($config['data'], true);
								}else {
									$data = array(
										'language'			=> $this->lang,
										'status'			=> 0,
										'message'			=> "Güvenlik Ağına Takıldınız!"
									);
								}
							}else {
								$data = array(
									'language'			=> $this->lang,
									'status'			=> 1,
									'message'			=> "Tüm ayarlar güncellendi!"
								);
							}
						
						}else {
							$data = array(
								'language'			=> $this->lang,
								'status'			=> 0,
								'message'			=> "Lütfen kutulardakı verileri tekrar kontrol ediniz!"
							);
						}
					}else {
						$data = array(
							'language'			=> $this->lang,
							'status'			=> 0,
							'message'			=> "Lütfen tüm alanları doldurunuz!"
						);	
					}
					$this->smarty->render('json', $data);
			}else {
				
				//* Sayfayı çek
				$settingsArray= array(
					'id' => 21
				);
				$corporate = $this->db->select("iwt_pages", $settingsArray, $relOpt = '=', $locOpt = 'and', $orderColumn = null, $orderOpt = null, $limit = null, $lmtStart = null);
				
				//* Alt Sayfaları Çek
				$productsArray= array(
					'page_id' => $corporate[0]["id"]
				);
				$products = $this->db->select("iwt_pages_thoughts", $productsArray, $relOpt = '=', $locOpt = 'and', $orderColumn = null, $orderOpt = null, $limit = null, $lmtStart = null);
				//$category = $this->db->select("iwt_pages_referance_category", "", $relOpt = '=', $locOpt = 'and', $orderColumn = null, $orderOpt = null, $limit = null, $lmtStart = null);

				
				
				$token_id = $this->csrf->get_token_id();
				$token_value = $this->csrf->get_token($token_id);
				
				$data = array(
					'themelink' 		=> SITE_URL.'/'.THEME_FOLDER.'/'.ADMIN_FOLDER,
					'language' 			=> $this->lang,
					'session'	  		=> @$_SESSION['login'] == TRUE ? $_SESSION : FALSE,
					'token'				=> $token_value,
					'tokenID'			=> $token_id,
					'homepage'			=> @count($corporate) > 0 ? $corporate[0] : FALSE,
					'products'			=> @count($products) > 0 ? $products : FALSE,
					//'category'			=> @count($category) > 0 ? $category : FALSE,
					'menu'				=> @count($this->menu) > 0 ? $this->menu : FALSE,
					'categorys'			=> json_decode($this->ayarlar[0]['jsonCategory'], TRUE)['category']['thoughts']
				);
				
				$this->smarty->render('pages/thoughts/index', $data);
			}
		}
		
		function panel_thoughts_status(array $config = []){
			if($this->security->num($_GET['id']) == TRUE AND $this->security->num($_GET['status']) == TRUE){
				
				$pagesArray = array(
					'status' 		=> (@$_GET['status'] == 1 ? 0 : 1)
				);
				$status = $this->db->update("iwt_pages_thoughts", $pagesArray, $_GET['id']);
				if($status){
					$data = array(
						'language'			=> $this->lang,
						'status'			=> 1,
						'message'			=> (@$_GET['status'] == 1 ? 0 : 1)
					);
				}else {
					$data = array(
						'language'			=> $this->lang,
						'status'			=> 2,
						'message'			=> "Kayıt sırasında hatalar meydana geldi!"
					);
				}
			}else {
				$data = array(
					'language'			=> $this->lang,
					'status'			=> 0,
					'message'			=> "Güvenlik Ağına Takıldınız!"
				);
			}
			
			$this->smarty->render('json', $data);
		}
		
		function panel_thoughts_sort(array $config = []){
			if($_POST){
				if(!empty($config['data']['item'])){
					foreach($config['data']['item'] as $keys => $item){
						$pagesArray = array(
							'sort' 		=> $keys
						);
						$status = $this->db->update("iwt_pages_thoughts", $pagesArray, $item);
					}
					$data = array(
						'language'			=> $this->lang,
						'status'			=> 1,
						'message'			=> "başarılı"
					);
				}else {
					$data = array(
						'language'			=> $this->lang,
						'status'			=> 0,
						'message'			=> "Güvenlik Ağına Takıldınız!"
					);
				}
			}
			
			$this->smarty->render('json', $data);
		}
		
		function panel_thoughts_update(array $config = []){
			$form_names = $this->csrf->form_names($config['data'], false);
			if(!empty($config['data']['seo_title'])){
				if($this->security->text($config['data']['seo_title']) == TRUE AND $this->security->num($config['data']['id']) == TRUE){
			
					
			
					$pagesArray = array(
						'seo_title' 		=> $config['data']['seo_title'],
						'name' 		=> $config['data']['name'],
						'date' 		=> strtotime($config['data']['date']),
						'tip'	=> (@$config['data']['tip'] == 2 ? 2 : 1)
					);
					
					
					$where = $config['data']['id'];
								
					
					$lowerAdd = $this->db->update("iwt_pages_thoughts", $pagesArray , $where);
					if($lowerAdd){
						if($this->csrf->check_valid('post')) {
							$data = array(
								'language'			=> $this->lang,
								'status'			=> 1,
								'message'			=> "Tüm ayarlar güncellendi!"
							);
							$this->csrf->form_names($config['data'], true);
							
						}else {
							$data = array(
								'language'			=> $this->lang,
								'status'			=> 0,
								'message'			=> "Güvenlik Ağına Takıldınız!"
							);
						}
						
					}else {
						$data = array(
							'language'			=> $this->lang,
							'status'			=> 1,
							'message'			=> "Tüm ayarlar güncellendi!"
						);
					}
				
				}else {
					$data = array(
						'language'			=> $this->lang,
						'status'			=> 0,
						'message'			=> "Lütfen kutulardakı verileri tekrar kontrol ediniz!"
					);
				}
			}else {
				$data = array(
					'language'			=> $this->lang,
					'status'			=> 0,
					'message'			=> "Lütfen tüm alanları doldurunuz!"
				);	
			}
			$this->smarty->render('json', $data);
		}
		
		function panel_thoughts_delete(array $config = []){
			if($this->security->num($_GET['id']) == TRUE){
				$id= $_GET['id']; 
				$sil = $this->db->delete("iwt_pages_thoughts", $id);
				if($sil){
					$data = array(
						'language'			=> $this->lang,
						'status'			=> 1,
						'message'			=> "Silme işleme başarılı"
					);
				}else {
					$data = array(
						'language'			=> $this->lang,
						'status'			=> 1,
						'message'			=> "Kayıt sırasında hatalar meydana geldi!"
					);
				}
			}else {
				$data = array(
					'language'			=> $this->lang,
					'status'			=> 0,
					'message'			=> "Güvenlik Ağına Takıldınız!"
				);
			}
			
			$this->smarty->render('json', $data);
		}
		
		function panel_thoughts_insert(array $config = []){
			$form_names = $this->csrf->form_names($config['data'], false);
				if(!empty($config['data']['seo_title']) AND !empty($config['data']['name']) AND !empty($config['data']['tip']) AND !empty($config['data']['date'])){
					if($this->security->text($config['data']['seo_title']) == TRUE AND $this->security->num($config['data']['tip']) == TRUE){
						
						$pagesArray = array(
							'seo_title' => strip_tags($config['data']['seo_title']),
							'title' => strip_tags($config['data']['seo_title']),
							'sef'	=> $this->func->sef($config['data']['seo_title']),
							'name'	=> strip_tags($this->func->sef($config['data']['name'])),
							'date' 	=> strtotime($config['data']['date']),
							'page_id' => 21,
							'tip'	=> (@$config['data']['tip'] == 2 ? 2 : 1)
						);
						
						$lowerAdd = $this->db->insert("iwt_pages_thoughts", $pagesArray);
						if($lowerAdd){
							if($this->csrf->check_valid('post')) {
								$data = array(
									'language'			=> $this->lang,
									'status'			=> 1,
									'message'			=> "Tüm ayarlar güncellendi!",
									'yonlendir'			=> "index.php?page=page/thoughts/edit&id=".$lowerAdd
								);
								$this->csrf->form_names($config['data'], true);
								
							}else {
								$data = array(
									'language'			=> $this->lang,
									'status'			=> 0,
									'message'			=> "Güvenlik Ağına Takıldınız!"
								);
							}
						}else {
							$data = array(
								'language'			=> $this->lang,
								'status'			=> 0,
								'message'			=> "Tüm ayarlar güncellendi!"
							);
						}
					
					}else {
						$data = array(
							'language'			=> $this->lang,
							'status'			=> 0,
							'message'			=> "Lütfen kutulardakı verileri tekrar kontrol ediniz!"
						);
					}
				}else {
					$data = array(
						'language'			=> $this->lang,
						'status'			=> 0,
						'message'			=> "Lütfen tüm alanları doldurunuz!"
					);	
				}
				$this->smarty->render('json', $data);
		}
		
		function panel_thoughts_edit(array $config = []){
			if($this->security->num(@$_GET['id']) == TRUE){
				$lowerArray= array(
					'id' => $_GET['id']
				);
				$lower = $this->db->select("iwt_pages_thoughts", $lowerArray, $relOpt = '=', $locOpt = 'and', $orderColumn = null, $orderOpt = null, $limit = null, $lmtStart = null);

			//	$category = $this->db->select("iwt_pages_referance_category", "", $relOpt = '=', $locOpt = 'and', $orderColumn = null, $orderOpt = null, $limit = null, $lmtStart = null);

				$gallery = (empty($lower[0]['gallery']) ? '{"gallery":[]}' : json_decode($lower[0]['gallery'], TRUE)['gallery']);

				$token_id = $this->csrf->get_token_id();
				$token_value = $this->csrf->get_token($token_id);
				
				$data = array(
					'themelink' 		=> SITE_URL.'/'.THEME_FOLDER.'/'.ADMIN_FOLDER,
					'language' 			=> $this->lang,
					'function' 			=> $this->func,
					'session'	  		=> @$_SESSION['login'] == TRUE ? $_SESSION : FALSE,
					'token'				=> $token_value,
					'tokenID'			=> $token_id,
					'lower'				=> @count($lower) > 0 ? $lower[0] : FALSE,
					//'category'			=> @count($category) > 0 ? $category : FALSE,
					'menu'				=> @count($this->menu) > 0 ? $this->menu : FALSE,
					'categorys'			=> json_decode($this->ayarlar[0]['jsonCategory'], TRUE)['category'][1], //* panel kategorileri
					'gallery'			=> $gallery,
					'kategori'			=> json_decode($lower[0]['categorys'], TRUE) //* arayüzde urun kategorileri
				);
				
				$this->smarty->render('pages/thoughts/Edit', $data);
			}else {
				die($this->func->yonlendir(0, "index.php?page=page/thoughts"));
			}
		}
		
		
		
		
		
		function panel_settings(array $config = []){
			if($_POST){
				$form_names = $this->csrf->form_names($config['data'], false);
					if(!empty($config['data']['seo_title']) AND !empty($config['data']['site_url']) AND !empty($config['data']['eposta']) ){
						if($this->security->text($config['data']['seo_title']) == TRUE AND $this->security->text($config['data']['seo_keyword']) == TRUE AND $this->security->text($config['data']['seo_description']) == TRUE AND $this->security->url($config['data']['site_url']) == TRUE AND $this->security->email($config['data']['eposta']) == TRUE AND $this->security->num($config['data']['dil_ingilizce']) == TRUE){
							
							$settingsArray = array(
								'seo_title' => strip_tags($config['data']['seo_title']),
								'seo_keyword' => strip_tags($config['data']['seo_keyword']),
								'seo_description' => strip_tags($config['data']['seo_description']),
								'site_url' => $config['data']['site_url'],
								'eposta' => $config['data']['eposta'],
								'google_analytics' => strip_tags($config['data']['google_analytics'], "<script><p><a>"),
								'dil_ingilizce' => ($config['data']['dil_ingilizce'] == 1 OR $config['data']['dil_ingilizce'] == 0 ? $config['data']['dil_ingilizce'] : 0 ),
								'nestable_menu' => strip_tags($config['data']['sort']),
								'sirket' => strip_tags($config['data']['sirket']),
								'sirketadres' => strip_tags($config['data']['sirketadres']),
								'sirkettelefon' => strip_tags($config['data']['sirkettelefon']),
								'sirketgsm' => strip_tags($config['data']['sirketgsm']),
								'sirketmail' => strip_tags($config['data']['sirketmail']),
								'epostasunucu' => strip_tags($config['data']['epostasunucu']),
								'epostaadresi' => strip_tags($config['data']['epostaadresi']),
								'sirkettelefon' => strip_tags($config['data']['sirkettelefon']),
								'epostaport' => strip_tags($config['data']['epostaport']),
								'epostaisim' => strip_tags($config['data']['epostaisim']),
								'haritaenlem' => strip_tags($config['data']['haritaenlem']),
								'haritaboylam' => strip_tags($config['data']['haritaboylam']),
								'facebook' => strip_tags($config['data']['facebook']),
								'twitter' => strip_tags($config['data']['twitter']),
								'instagram' => strip_tags($config['data']['instagram'])
							);
							
							if(@$_FILES['logo']){
								$this->upload = new upload($_FILES['logo']);
								if ($this->upload->uploaded) {
									$this->upload->file_new_name_body = uniqid() .'-'. rand(0,100000);
									$this->upload->image_convert = 'png';
									
									// yeniden farklı boyutta kayıt et
									/*$this->upload->image_resize = true;
									$this->upload->image_ratio_crop = true;
									$this->upload->image_x = 1000;
									$this->upload->image_y = 540;*/
									
									$this->upload->allowed = array ('image/*');
									$this->upload->Process("../".UPLOAD_FOLDER."/logo/");
									if ($this->upload->processed) {
										$settingsArray['logo'] = $this->upload->file_dst_name;
									}
								}
								
							}
							
							if(@$_FILES['favicon']){
								$this->upload = new upload($_FILES['favicon']);
								if ($this->upload->uploaded) {
									$this->upload->file_new_name_body = uniqid() .'-'. rand(0,100000);
									$this->upload->image_convert = 'jpg';
									
									// yeniden farklı boyutta kayıt et
									/*$this->upload->image_resize = true;
									$this->upload->image_ratio_crop = true;
									$this->upload->image_x = 1000;
									$this->upload->image_y = 540;*/
									
									$this->upload->allowed = array ('image/*');
									$this->upload->Process("../".UPLOAD_FOLDER."/favicon/");
									if ($this->upload->processed) {
										$settingsArray['favicon'] = $this->upload->file_dst_name;
									}
								}
							}
							
				
							
						
							//* Kategori Status ve isimlerini güncelleme
							$statusMenu = array();
							$statusMenu['homepage'] = 0;
							$statusMenu['corporate'] = 0;
							$statusMenu['about'] = 0;
							$statusMenu['whoarewe'] = 0;
							$statusMenu['products'] = 0;
							$statusMenu['scope'] = 0;
							$statusMenu['services'] = 0;
							$statusMenu['projects'] = 0;
							$statusMenu['referance'] = 0;
							$statusMenu['solutionpartners'] = 0;
							$statusMenu['news'] = 0;
							$statusMenu['announcements'] = 0;
							$statusMenu['gallery'] = 0;
							$statusMenu['media'] = 0;
							$statusMenu['humanresources'] = 0;
							$statusMenu['onlinecatalog'] = 0;
							$statusMenu['contact'] = 0;
							$statusMenu['serviceorderformON'] = 0;
							$statusMenu['productorderformON'] = 0;
							$statusMenu['thoughts'] = 0;
							$statusMenu['press'] = 0;
							$statusMenu['conscious-parents'] = 0;
							
							
							foreach($config['data']['status'] as $status){
								if(array_key_exists($status,$statusMenu)){
									$statusMenu[$status] = 1;
								}
							}
							$dondur = 0;
							foreach($statusMenu as $key => $menustatusupdate){
								$menuArray = array(
									'status' => $menustatusupdate,
									'title'	 => $config['data']['menuadi'][$key]
								);
								$whereArray = array(
									'panel_sef' => $key
								);
								$dondur++;
								$menuguncelle = $this->db->update("iwt_pages", $menuArray , $whereArray);
							}
							//*
							
							//*
							$categoryStatus = array();
							$categoryStatus['homepage'] = 0;
							$categoryStatus['corporate'] = 0;
							$categoryStatus['about'] = 0;
							$categoryStatus['whoarewe'] = 0;
							$categoryStatus['products'] = 0;
							$categoryStatus['services'] = 0;
							$categoryStatus['projects'] = 0;
							$categoryStatus['scope'] = 0;
							$categoryStatus['referance'] = 0;
							$categoryStatus['solutionpartners'] = 0;
							$categoryStatus['news'] = 0;
							$categoryStatus['announcements'] = 0;
							$categoryStatus['gallery'] = 0;
							$categoryStatus['media'] = 0;
							$categoryStatus['humanresources'] = 0;
							$categoryStatus['onlinecatalog'] = 0;
							$categoryStatus['contact'] = 0;
							$categoryStatus['serviceorderform'] = 0;
							$categoryStatus['productorderform'] = 0;
							$categoryStatus['thoughts'] = 0;
							$categoryStatus['press'] = 0;
							$categoryStatus['conscious-parents'] = 0;
							
							foreach($config['data']['on'] as $categorystatus){
								if(array_key_exists($categorystatus,$categoryStatus)){
									$categoryStatus[$categorystatus] = 1;
								}
							}
							
							$settingsArray['jsonCategory'] = json_encode(array ('category'=>$categoryStatus));
							
							
							
							//* Menu Sıralama Olayı
							if(isset($config['data']['sort'])) {
								$jsonDecoded = json_decode($config['data']['sort'],true);
								function parseJsonArray($jsonArray, $parentID = "")
								{
								  $return = array();
								  foreach ($jsonArray as $subArray) {
									 $returnSubSubArray = array();
									 if (isset($subArray['children'])) {
									   $returnSubSubArray = parseJsonArray($subArray['children'], $subArray['id']);
									 }
									 $return[] = array('id' => $subArray['id'], 'parentID' => $parentID);
									 $return = array_merge($return, $returnSubSubArray);
								  }
					 
								  return $return;
								}
					 
					 
								$readbleArray = parseJsonArray($jsonDecoded);
								$don = 1;
								foreach ($readbleArray as $key => $value) {
				 
									if (is_array($value)) {
										if(empty($value['parentID'])){
											$bos = intval(0);
										}else {
											$bos = intval($value['parentID']);
										}
										
										
										$sortArray = array(
											'main_sort' => $bos,
											'sort' => intval($don++)
										);
										$where = $value['id'];
										$this->db->update("iwt_pages", $sortArray , $where);
									}
								
								}
							}
							
							
							$where = "1";
							$settingsUpdate = $this->db->update("iwt_settings", $settingsArray , $where);
							if($settingsUpdate){
								if($this->csrf->check_valid('post')) {
									$data = array(
										'language'			=> $this->lang,
										'status'			=> 1,
										'message'			=> "Tüm ayarlar güncellendi!"
									);
									$this->csrf->form_names($config['data'], true);
								}else {
									$data = array(
										'language'			=> $this->lang,
										'status'			=> 0,
										'message'			=> "Güvenlik Ağına Takıldınız!"
									);
								}
							}else {
								$data = array(
									'language'			=> $this->lang,
									'status'			=> 1,
									'message'			=> "Tüm ayarlar güncellendi!"
								);
							}
						}else {
							$data = array(
								'language'			=> $this->lang,
								'status'			=> 0,
								'message'			=> "Lütfen kutulardakı verileri tekrar kontrol ediniz!"
							);
						}
					}else {
						$data = array(
							'language'			=> $this->lang,
							'status'			=> 0,
							'message'			=> "Lütfen tüm alanları doldurunuz!"
						);	
					}
				
					$this->smarty->render('json', $data);
			}else {
				
				
				$settingsArray= array(
					'id' => 1
				);
				$settings = $this->db->select("iwt_settings", $settingsArray, $relOpt = '=', $locOpt = 'and', $orderColumn = null, $orderOpt = null, $limit = null, $lmtStart = null);
			
			
				$token_id = $this->csrf->get_token_id();
				$token_value = $this->csrf->get_token($token_id);
				
				$data = array(
					'themelink' 		=> SITE_URL.'/'.THEME_FOLDER.'/'.ADMIN_FOLDER,
					'language' 			=> $this->lang,
					'session'	  		=> @$_SESSION['login'] == TRUE ? $_SESSION : FALSE,
					'token'				=> $token_value,
					'tokenID'			=> $token_id,
					'settings'			=> @count($settings) > 0 ? $settings[0] : FALSE,
					'category'			=> @count($settings) > 0 ? json_decode($settings[0]['jsonCategory'], TRUE)['category'] : FALSE,
					//'Categorystatus'	=> @count($settings) > 0 ? json_decode($settings[0]['jsonStatus'], TRUE)['category'] : FALSE,
					'menu'				=> @count($this->menu) > 0 ? $this->menu : FALSE,
					'altmenu'			=> @count($this->altmenu) > 0 ? $this->altmenu : FALSE
				);
				
				$this->smarty->render('settings', $data);
			}
		}
		
		function panel_slider(array $config = []){
			if($_POST){
		
			}else {
				$token_id = $this->csrf->get_token_id();
				$token_value = $this->csrf->get_token($token_id);
				
				$data = array(
					'themelink' 		=> SITE_URL.'/'.THEME_FOLDER.'/'.ADMIN_FOLDER,
					'language' 			=> $this->lang,
					'session'	  		=> @$_SESSION['login'] == TRUE ? $_SESSION : FALSE,
					'token'				=> $token_value,
					'tokenID'			=> $token_id,
					'menu'				=> @count($this->menu) > 0 ? $this->menu : FALSE
				);
				
				$this->smarty->render('module/slider', $data);
			}
		}
		
		public function galleryUpload(array $config = []){
			$this->upload = new upload($_FILES['files']);
			if ($this->upload->uploaded) {
				$this->upload->file_new_name_body = uniqid() .'-'. rand(0,100000);
				$this->upload->image_convert = 'jpg';
				
				// yeniden farklı boyutta kayıt et
				/*$this->upload->image_resize = true;
				$this->upload->image_ratio_crop = true;
				$this->upload->image_x = 1000;
				$this->upload->image_y = 540;*/
				
				$this->upload->allowed = array('image/*');
				$this->upload->Process("../".UPLOAD_FOLDER."/gallery/");
				if ($this->upload->processed) {
					
					echo '{"upStatus": "1", "files":[{"url":"../'.UPLOAD_FOLDER.'/gallery/'.$this->upload->file_dst_name.'"}]}';
				}else {
					echo '{"upStatus": "0", "upMessage": "'.$this->upload->error.'" }';
				}
			}
		}
		
		public function galleryEmbed(array $config = []){
			if ($this->security->url($config['data']['url']) == TRUE) {
				parse_str( parse_url( $config['data']['url'], PHP_URL_QUERY ), $my_array_of_vars );
				
				echo '{"upStatus": "1", "files":[{"url":"'.$my_array_of_vars['v'].'"}]}';
			}else {
				echo '{"upStatus": "0", "upMessage": "Link Kontrol Ediniz." }';
			}
		}
		
		public function galleryDelete(array $config = []){
			
			  if (file_exists($config['data']['data'])) {
				unlink($config['data']['data']);
				echo '{"deleteStatus": "1", "deleteMessage": "Silme İşlemi Başarılı" }';
			  } else {
				echo '{"deleteStatus": "1", "deleteMessage": "Silme İşlemi Başarılı" }';
			  }
			
		}
		
		
		//* Ön Yüz
		public function index(array $config = []){
			//* Temada Göster
			$data = array(
				'themelink' 		=> SITE_URL.'/'.THEME_FOLDER.'/'.ADMIN_FOLDER,
				'language' 			=> $this->lang,
				'session'	  		=> @$_SESSION['login'] == TRUE ? $_SESSION : FALSE,
			);
			$this->smarty->render('index', $data);
		}
	}
?>