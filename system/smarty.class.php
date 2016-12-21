<?
/**
 * @author	iwt web tasrım
 * @copyright	Copyright (c) 2016, Developer Ahmet ÖZALP (www.ahmetozalp.net)
 * @link	http://www.iwt.com.tr
 * @since	Version 1.0.0
**/

	class SMTemplate{
     
		private $_smarty;
		 
		function __construct(){
			$this->_smarty = new Smarty();
			if(@$_GET['page']){
				$this->_smarty->setTemplateDir('../'.THEME_FOLDER.'/'.ADMIN_FOLDER);
			}else {
				$this->_smarty->setTemplateDir(THEME_FOLDER.'/'.DEF_FOLDER);
			}
			
			$this->_smarty->setCompileDir(CACHE_FILE); 
			$this->_smarty->setCacheDir(CACHE_FILE); 
			$this->_smarty->setConfigDir(CACHE_FILE);
			
			$this->_smarty->debugging 		= TEMPLATE_DEBUG;
			$this->_smarty->caching 		= TEMPLATE_CACHING;
			$this->_smarty->cache_lifetime 	= TEMPLATE_CACHETIME;
		}
		
		function render($template, $data = array()){
			foreach($data as $key => $value){
				$this->_smarty->assign($key, $value);
			}
			
			$this->_smarty->display($template . '.tpl');
		}
	}

?>