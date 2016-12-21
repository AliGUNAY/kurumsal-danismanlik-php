<?
/**
 * @author	iwt web tasrım
 * @copyright	Copyright (c) 2016, Developer Ahmet ÖZALP (www.ahmetozalp.net)
 * @link	http://www.iwt.com.tr
 * @since	Version 1.0.0
**/

	class functions{
		
		function isXmlHttpRequest(){
			$header = isset($_SERVER['HTTP_X_REQUESTED_WITH']) ? $_SERVER['HTTP_X_REQUESTED_WITH'] : null;

			return ($header === 'XMLHttpRequest');
		}
		
		function securityPage(){
			header('HTTP/1.1 503 Service Unavailable.', TRUE, 503);
			exit(1);
		}
		
		function yonlendir($sure,$sayfa){ 
		  $deger = "<meta http-equiv=\"refresh\" content=\"$sure;url=$sayfa\">\n"; 
		  return $deger; 
		}
		
		function mailGonder(array $config = []){
			$this->mailler = new PHPMailer();

			$this->mailler->IsSMTP(true);
			$this->mailler->IsHTML(true);
			$this->mailler->SMTPAuth   = true;
			$this->mailler->SMTPSecure = MAIL_TIPI;
			$this->mailler->Host       = MAIL_SERVER;
			$this->mailler->Port       = MAIL_PORT;
			$this->mailler->Username   = MAIL_USERNAME;
			$this->mailler->Password   = MAIL_PASSWORD;
			$this->mailler->CharSet = 'UTF-8';
			$this->mailler->SetFrom(MAIL_USERNAME, 'İletişim Bildirimi');
			$this->mailler->Subject = $config['baslik'];
			$this->mailler->MsgHTML($config['icerik']);
			$this->mailler->AddAddress("ahmetozalpjson@gmail.com", "İsim Soyisim");
			$this->mailler->Send();
		}
		
		function replaceSpace($string){
		   $string = preg_replace("/\s+/", " ", $string);
		   $string = trim($string);
		   return $string;
		}
		
		function sef($string){
			$find = array('Ç', 'Ş', 'Ğ', 'Ü', 'İ', 'Ö', 'ç', 'ş', 'ğ', 'ü', 'ö', 'ı', '+', '#');
			$replace = array('c', 's', 'g', 'u', 'i', 'o', 'c', 's', 'g', 'u', 'o', 'i', 'plus', 'sharp');
			$string = strtolower(str_replace($find, $replace, $string));
			$string = preg_replace("@[^A-Za-z0-9\-_\.\+]@i", ' ', $string);
			$string = trim(preg_replace('/\s+/', ' ', $string));
			$string = str_replace(' ', '-', $string);
			return $string;
		}
		
		function formatdate($unixtime){ 
				return $time = date("m-d-Y",$unixtime);
		} 
	}
?>