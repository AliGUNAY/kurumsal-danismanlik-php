<?
/**
 * @author	iwt web tasrým
 * @copyright	Copyright (c) 2016, Developer Ahmet ÖZALP (www.ahmetozalp.net)
 * @link	http://www.iwt.com.tr
 * @since	Version 1.0.0
**/
	ini_set('display_errors', 0);
	
	require_once '../config.php';

	//print_r(end(explode("/", $_GET['page'])));
	
	require_once('../' . SYSTEM_FOLDER . '/adminController.php');
	$view = new controller();
	
	switch(@$_GET['page']){		
		case 'login':
			if(@$_SESSION['login'] == TRUE){
				die($view->func->yonlendir(0, "index.php?page=settings"));
			}else {
				$view->admin_login([
					'data'	   => @$_POST ? $_POST : FALSE
				]);
			}
		break;
		//* henuz aktif sayfa degil
		case 'panel':
			if(@$_SESSION['login'] == FALSE){
				die($view->func->yonlendir(0, "index.php?page=login"));
			}else {
				$view->panel([
					'data'	   => @$_POST ? $_POST : FALSE
				]);
			}
		break;
		//*
		case 'settings':
			if(@$_SESSION['login'] == FALSE){
				die($view->func->yonlendir(0, "index.php?page=login"));
			}else {
				$view->panel_settings([
					'data'	   => @$_POST ? $_POST : FALSE
				]);
			}
		break;
		
		case 'page/homepage':
			if(@$_SESSION['login'] == FALSE){
				die($view->func->yonlendir(0, "index.php?page=login"));
			}else {
				$view->panel_homepage([
					'data'	   => @$_POST ? $_POST : FALSE
				]);
			}
		break;
		
		case 'page/about':
			if(@$_SESSION['login'] == FALSE){
				die($view->func->yonlendir(0, "index.php?page=login"));
			}else {
				$view->panel_about([
					'data'	   => @$_POST ? $_POST : FALSE
				]);
			}
		break;
		
		case 'page/conscious-parents':
			if(@$_SESSION['login'] == FALSE){
				die($view->func->yonlendir(0, "index.php?page=login"));
			}else {
				$view->panel_consciousparents([
					'data'	   => @$_POST ? $_POST : FALSE
				]);
			}
		break;
		
		case 'page/enterprises-of-loves-you':
			if(@$_SESSION['login'] == FALSE){
				die($view->func->yonlendir(0, "index.php?page=login"));
			}else {
				$view->panel_enterprisesloves([
					'data'	   => @$_POST ? $_POST : FALSE
				]);
			}
		break;
		
		case 'page/humanresources':
			if(@$_SESSION['login'] == FALSE){
				die($view->func->yonlendir(0, "index.php?page=login"));
			}else {
				$view->panel_humanresources([
					'data'	   => @$_POST ? $_POST : FALSE
				]);
			}
		break;
		
		
		
		
		//* Services
		
		case 'page/services':
			if(@$_SESSION['login'] == FALSE){
				die($view->func->yonlendir(0, "index.php?page=login"));
			}else {
				$view->panel_services([
					'data'	   => @$_POST ? $_POST : FALSE
				]);
			}
		break;
		
		case 'page/services/update':
			if(@$_SESSION['login'] == FALSE){
				die($view->func->yonlendir(0, "index.php?page=login"));
			}else {
				$view->panel_services_update([
					'data'	   => @$_POST ? $_POST : FALSE
				]);
			}
		break;
		
		case 'page/services/status':
			if(@$_SESSION['login'] == FALSE){
				die($view->func->yonlendir(0, "index.php?page=login"));
			}else {
				$view->panel_services_status([
					'data'	   => @$_GET ? $_GET : FALSE
				]);
			}
		break;
		
		case 'page/services/sort':
			if(@$_SESSION['login'] == FALSE){
				die($view->func->yonlendir(0, "index.php?page=login"));
			}else {
				$view->panel_services_sort([
					'data'	   => @$_POST ? $_POST : FALSE
				]);
			}
		break;
		
		case 'page/services/delete':
			if(@$_SESSION['login'] == FALSE){
				die($view->func->yonlendir(0, "index.php?page=login"));
			}else {
				$view->panel_services_delete([
					'data'	   => @$_POST ? $_POST : FALSE
				]);
			}
		break;
		
		case 'page/services/add':
			if(@$_SESSION['login'] == FALSE){
				die($view->func->yonlendir(0, "index.php?page=login"));
			}else {
				$view->panel_services_insert([
					'data'	   => @$_POST ? $_POST : FALSE
				]);
			}
		break;
		
		case 'page/services/edit':
			if(@$_SESSION['login'] == FALSE){
				die($view->func->yonlendir(0, "index.php?page=login"));
			}else {
				$view->panel_services_edit([
					'data'	   => @$_POST ? $_POST : FALSE
				]);
			}
		break;
		
		case 'page/services/category/status':
			if(@$_SESSION['login'] == FALSE){
				die($view->func->yonlendir(0, "index.php?page=login"));
			}else {
				$view->panel_services_category_status([
					'data'	   => @$_GET ? $_GET : FALSE
				]);
			}
		break;
		
		case 'page/services/category/sort':
			if(@$_SESSION['login'] == FALSE){
				die($view->func->yonlendir(0, "index.php?page=login"));
			}else {
				$view->panel_services_category_sort([
					'data'	   => @$_POST ? $_POST : FALSE
				]);
			}
		break;
		
		case 'page/services/category/add':
			if(@$_SESSION['login'] == FALSE){
				die($view->func->yonlendir(0, "index.php?page=login"));
			}else {
				$view->panel_services_category_insert([
					'data'	   => @$_POST ? $_POST : FALSE
				]);
			}
		break;
		
		case 'page/services/category/update':
			if(@$_SESSION['login'] == FALSE){
				die($view->func->yonlendir(0, "index.php?page=login"));
			}else {
				$view->panel_services_category_update([
					'data'	   => @$_POST ? $_POST : FALSE
				]);
			}
		break;
		
		case 'page/services/category/delete':
			if(@$_SESSION['login'] == FALSE){
				die($view->func->yonlendir(0, "index.php?page=login"));
			}else {
				$view->panel_services_category_delete([
					'data'	   => @$_POST ? $_POST : FALSE
				]);
			}
		break;
		
		case 'page/services/category/edit':
			if(@$_SESSION['login'] == FALSE){
				die($view->func->yonlendir(0, "index.php?page=login"));
			}else {
				$view->panel_services_category_edit([
					'data'	   => @$_POST ? $_POST : FALSE
				]);
			}
		break;
		
		//* Services
		
		case 'page/press':
			if(@$_SESSION['login'] == FALSE){
				die($view->func->yonlendir(0, "index.php?page=login"));
			}else {
				$view->panel_press([
					'data'	   => @$_POST ? $_POST : FALSE
				]);
			}
		break;
		
		case 'page/press/status':
			if(@$_SESSION['login'] == FALSE){
				die($view->func->yonlendir(0, "index.php?page=login"));
			}else {
				$view->panel_press_status([
					'data'	   => @$_GET ? $_GET : FALSE
				]);
			}
		break;
		
		case 'page/press/sort':
			if(@$_SESSION['login'] == FALSE){
				die($view->func->yonlendir(0, "index.php?page=login"));
			}else {
				$view->panel_press_sort([
					'data'	   => @$_POST ? $_POST : FALSE
				]);
			}
		break;
		
		case 'page/press/update':
			if(@$_SESSION['login'] == FALSE){
				die($view->func->yonlendir(0, "index.php?page=login"));
			}else {
				$view->panel_press_update([
					'data'	   => @$_POST ? $_POST : FALSE
				]);
			}
		break;
		
		case 'page/press/delete':
			if(@$_SESSION['login'] == FALSE){
				die($view->func->yonlendir(0, "index.php?page=login"));
			}else {
				$view->panel_press_delete([
					'data'	   => @$_POST ? $_POST : FALSE
				]);
			}
		break;
		
		case 'page/press/add':
			if(@$_SESSION['login'] == FALSE){
				die($view->func->yonlendir(0, "index.php?page=login"));
			}else {
				$view->panel_press_insert([
					'data'	   => @$_POST ? $_POST : FALSE
				]);
			}
		break;
		
		case 'page/press/edit':
			if(@$_SESSION['login'] == FALSE){
				die($view->func->yonlendir(0, "index.php?page=login"));
			}else {
				$view->panel_press_edit([
					'data'	   => @$_POST ? $_POST : FALSE
				]);
			}
		break;
		
		case 'page/press/category/status':
			if(@$_SESSION['login'] == FALSE){
				die($view->func->yonlendir(0, "index.php?page=login"));
			}else {
				$view->panel_press_category_status([
					'data'	   => @$_GET ? $_GET : FALSE
				]);
			}
		break;
		
		case 'page/press/category/sort':
			if(@$_SESSION['login'] == FALSE){
				die($view->func->yonlendir(0, "index.php?page=login"));
			}else {
				$view->panel_press_category_sort([
					'data'	   => @$_POST ? $_POST : FALSE
				]);
			}
		break;
		
		case 'page/press/category/add':
			if(@$_SESSION['login'] == FALSE){
				die($view->func->yonlendir(0, "index.php?page=login"));
			}else {
				$view->panel_press_category_insert([
					'data'	   => @$_POST ? $_POST : FALSE
				]);
			}
		break;
		
		case 'page/press/category/update':
			if(@$_SESSION['login'] == FALSE){
				die($view->func->yonlendir(0, "index.php?page=login"));
			}else {
				$view->panel_press_category_update([
					'data'	   => @$_POST ? $_POST : FALSE
				]);
			}
		break;
		
		case 'page/press/category/delete':
			if(@$_SESSION['login'] == FALSE){
				die($view->func->yonlendir(0, "index.php?page=login"));
			}else {
				$view->panel_press_category_delete([
					'data'	   => @$_POST ? $_POST : FALSE
				]);
			}
		break;
		
		case 'page/press/category/edit':
			if(@$_SESSION['login'] == FALSE){
				die($view->func->yonlendir(0, "index.php?page=login"));
			}else {
				$view->panel_press_category_edit([
					'data'	   => @$_POST ? $_POST : FALSE
				]);
			}
		break;
		
		//* Scope
		
		case 'page/scope':
			if(@$_SESSION['login'] == FALSE){
				die($view->func->yonlendir(0, "index.php?page=login"));
			}else {
				$view->panel_scope([
					'data'	   => @$_POST ? $_POST : FALSE
				]);
			}
		break;
		
		case 'page/scope/status':
			if(@$_SESSION['login'] == FALSE){
				die($view->func->yonlendir(0, "index.php?page=login"));
			}else {
				$view->panel_scope_status([
					'data'	   => @$_GET ? $_GET : FALSE
				]);
			}
		break;
		
		case 'page/scope/sort':
			if(@$_SESSION['login'] == FALSE){
				die($view->func->yonlendir(0, "index.php?page=login"));
			}else {
				$view->panel_scope_sort([
					'data'	   => @$_POST ? $_POST : FALSE
				]);
			}
		break;
		
		case 'page/scope/update':
			if(@$_SESSION['login'] == FALSE){
				die($view->func->yonlendir(0, "index.php?page=login"));
			}else {
				$view->panel_scope_update([
					'data'	   => @$_POST ? $_POST : FALSE
				]);
			}
		break;
		
		case 'page/scope/delete':
			if(@$_SESSION['login'] == FALSE){
				die($view->func->yonlendir(0, "index.php?page=login"));
			}else {
				$view->panel_scope_delete([
					'data'	   => @$_POST ? $_POST : FALSE
				]);
			}
		break;
		
		case 'page/scope/add':
			if(@$_SESSION['login'] == FALSE){
				die($view->func->yonlendir(0, "index.php?page=login"));
			}else {
				$view->panel_scope_insert([
					'data'	   => @$_POST ? $_POST : FALSE
				]);
			}
		break;
		
		case 'page/scope/edit':
			if(@$_SESSION['login'] == FALSE){
				die($view->func->yonlendir(0, "index.php?page=login"));
			}else {
				$view->panel_scope_edit([
					'data'	   => @$_POST ? $_POST : FALSE
				]);
			}
		break;
		
		
		
		//* Referance
		
		case 'page/referance':
			if(@$_SESSION['login'] == FALSE){
				die($view->func->yonlendir(0, "index.php?page=login"));
			}else {
				$view->panel_referance([
					'data'	   => @$_POST ? $_POST : FALSE
				]);
			}
		break;
		
		case 'page/referance/update':
			if(@$_SESSION['login'] == FALSE){
				die($view->func->yonlendir(0, "index.php?page=login"));
			}else {
				$view->panel_referance_update([
					'data'	   => @$_POST ? $_POST : FALSE
				]);
			}
		break;
		
		case 'page/referance/status':
			if(@$_SESSION['login'] == FALSE){
				die($view->func->yonlendir(0, "index.php?page=login"));
			}else {
				$view->panel_referance_status([
					'data'	   => @$_GET ? $_GET : FALSE
				]);
			}
		break;
		
		case 'page/referance/sort':
			if(@$_SESSION['login'] == FALSE){
				die($view->func->yonlendir(0, "index.php?page=login"));
			}else {
				$view->panel_referance_sort([
					'data'	   => @$_POST ? $_POST : FALSE
				]);
			}
		break;
		
		case 'page/referance/delete':
			if(@$_SESSION['login'] == FALSE){
				die($view->func->yonlendir(0, "index.php?page=login"));
			}else {
				$view->panel_referance_delete([
					'data'	   => @$_POST ? $_POST : FALSE
				]);
			}
		break;
		
		case 'page/referance/add':
			if(@$_SESSION['login'] == FALSE){
				die($view->func->yonlendir(0, "index.php?page=login"));
			}else {
				$view->panel_referance_insert([
					'data'	   => @$_POST ? $_POST : FALSE
				]);
			}
		break;
		
		case 'page/referance/edit':
			if(@$_SESSION['login'] == FALSE){
				die($view->func->yonlendir(0, "index.php?page=login"));
			}else {
				$view->panel_referance_edit([
					'data'	   => @$_POST ? $_POST : FALSE
				]);
			}
		break;
		
		case 'page/referance/category/status':
			if(@$_SESSION['login'] == FALSE){
				die($view->func->yonlendir(0, "index.php?page=login"));
			}else {
				$view->panel_referance_category_status([
					'data'	   => @$_GET ? $_GET : FALSE
				]);
			}
		break;
		
		case 'page/referance/category/sort':
			if(@$_SESSION['login'] == FALSE){
				die($view->func->yonlendir(0, "index.php?page=login"));
			}else {
				$view->panel_referance_category_sort([
					'data'	   => @$_POST ? $_POST : FALSE
				]);
			}
		break;
		
		case 'page/referance/category/add':
			if(@$_SESSION['login'] == FALSE){
				die($view->func->yonlendir(0, "index.php?page=login"));
			}else {
				$view->panel_referance_category_insert([
					'data'	   => @$_POST ? $_POST : FALSE
				]);
			}
		break;
		
		case 'page/referance/category/update':
			if(@$_SESSION['login'] == FALSE){
				die($view->func->yonlendir(0, "index.php?page=login"));
			}else {
				$view->panel_referance_category_update([
					'data'	   => @$_POST ? $_POST : FALSE
				]);
			}
		break;
		
		case 'page/referance/category/delete':
			if(@$_SESSION['login'] == FALSE){
				die($view->func->yonlendir(0, "index.php?page=login"));
			}else {
				$view->panel_referance_category_delete([
					'data'	   => @$_POST ? $_POST : FALSE
				]);
			}
		break;
		
		case 'page/referance/category/edit':
			if(@$_SESSION['login'] == FALSE){
				die($view->func->yonlendir(0, "index.php?page=login"));
			}else {
				$view->panel_referance_category_edit([
					'data'	   => @$_POST ? $_POST : FALSE
				]);
			}
		break;
		
		
		//* News
		
		case 'page/news':
			if(@$_SESSION['login'] == FALSE){
				die($view->func->yonlendir(0, "index.php?page=login"));
			}else {
				$view->panel_news([
					'data'	   => @$_POST ? $_POST : FALSE
				]);
			}
		break;
		
		case 'page/news/status':
			if(@$_SESSION['login'] == FALSE){
				die($view->func->yonlendir(0, "index.php?page=login"));
			}else {
				$view->panel_news_status([
					'data'	   => @$_GET ? $_GET : FALSE
				]);
			}
		break;
		
		case 'page/news/sort':
			if(@$_SESSION['login'] == FALSE){
				die($view->func->yonlendir(0, "index.php?page=login"));
			}else {
				$view->panel_news_sort([
					'data'	   => @$_POST ? $_POST : FALSE
				]);
			}
		break;
		
		case 'page/news/update':
			if(@$_SESSION['login'] == FALSE){
				die($view->func->yonlendir(0, "index.php?page=login"));
			}else {
				$view->panel_news_update([
					'data'	   => @$_POST ? $_POST : FALSE
				]);
			}
		break;
		
		case 'page/news/delete':
			if(@$_SESSION['login'] == FALSE){
				die($view->func->yonlendir(0, "index.php?page=login"));
			}else {
				$view->panel_news_delete([
					'data'	   => @$_POST ? $_POST : FALSE
				]);
			}
		break;
		
		case 'page/news/add':
			if(@$_SESSION['login'] == FALSE){
				die($view->func->yonlendir(0, "index.php?page=login"));
			}else {
				$view->panel_news_insert([
					'data'	   => @$_POST ? $_POST : FALSE
				]);
			}
		break;
		
		case 'page/news/edit':
			if(@$_SESSION['login'] == FALSE){
				die($view->func->yonlendir(0, "index.php?page=login"));
			}else {
				$view->panel_news_edit([
					'data'	   => @$_POST ? $_POST : FALSE
				]);
			}
		break;
		
		//* announcements
		
		case 'page/announcements':
			if(@$_SESSION['login'] == FALSE){
				die($view->func->yonlendir(0, "index.php?page=login"));
			}else {
				$view->panel_announcements([
					'data'	   => @$_POST ? $_POST : FALSE
				]);
			}
		break;
		
		case 'page/announcements/status':
			if(@$_SESSION['login'] == FALSE){
				die($view->func->yonlendir(0, "index.php?page=login"));
			}else {
				$view->panel_announcements_status([
					'data'	   => @$_GET ? $_GET : FALSE
				]);
			}
		break;
		
		case 'page/announcements/sort':
			if(@$_SESSION['login'] == FALSE){
				die($view->func->yonlendir(0, "index.php?page=login"));
			}else {
				$view->panel_announcements_sort([
					'data'	   => @$_POST ? $_POST : FALSE
				]);
			}
		break;
		
		case 'page/announcements/update':
			if(@$_SESSION['login'] == FALSE){
				die($view->func->yonlendir(0, "index.php?page=login"));
			}else {
				$view->panel_announcements_update([
					'data'	   => @$_POST ? $_POST : FALSE
				]);
			}
		break;
		
		case 'page/announcements/delete':
			if(@$_SESSION['login'] == FALSE){
				die($view->func->yonlendir(0, "index.php?page=login"));
			}else {
				$view->panel_announcements_delete([
					'data'	   => @$_POST ? $_POST : FALSE
				]);
			}
		break;
		
		case 'page/announcements/add':
			if(@$_SESSION['login'] == FALSE){
				die($view->func->yonlendir(0, "index.php?page=login"));
			}else {
				$view->panel_announcements_insert([
					'data'	   => @$_POST ? $_POST : FALSE
				]);
			}
		break;
		
		case 'page/announcements/edit':
			if(@$_SESSION['login'] == FALSE){
				die($view->func->yonlendir(0, "index.php?page=login"));
			}else {
				$view->panel_announcements_edit([
					'data'	   => @$_POST ? $_POST : FALSE
				]);
			}
		break;
		
		case 'page/contact':
			if(@$_SESSION['login'] == FALSE){
				die($view->func->yonlendir(0, "index.php?page=login"));
			}else {
				$view->panel_contact([
					'data'	   => @$_POST ? $_POST : FALSE
				]);
			}
		break;
		
		
		//* Gallery
		
		case 'page/gallery':
			if(@$_SESSION['login'] == FALSE){
				die($view->func->yonlendir(0, "index.php?page=login"));
			}else {
				$view->panel_gallery([
					'data'	   => @$_POST ? $_POST : FALSE
				]);
			}
		break;
		
		case 'page/gallery/status':
			if(@$_SESSION['login'] == FALSE){
				die($view->func->yonlendir(0, "index.php?page=login"));
			}else {
				$view->panel_gallery_status([
					'data'	   => @$_GET ? $_GET : FALSE
				]);
			}
		break;
		
		case 'page/gallery/sort':
			if(@$_SESSION['login'] == FALSE){
				die($view->func->yonlendir(0, "index.php?page=login"));
			}else {
				$view->panel_gallery_sort([
					'data'	   => @$_POST ? $_POST : FALSE
				]);
			}
		break;
		
		case 'page/gallery/update':
			if(@$_SESSION['login'] == FALSE){
				die($view->func->yonlendir(0, "index.php?page=login"));
			}else {
				$view->panel_gallery_update([
					'data'	   => @$_POST ? $_POST : FALSE
				]);
			}
		break;
		
		case 'page/gallery/delete':
			if(@$_SESSION['login'] == FALSE){
				die($view->func->yonlendir(0, "index.php?page=login"));
			}else {
				$view->panel_gallery_delete([
					'data'	   => @$_POST ? $_POST : FALSE
				]);
			}
		break;
		
		case 'page/gallery/add':
			if(@$_SESSION['login'] == FALSE){
				die($view->func->yonlendir(0, "index.php?page=login"));
			}else {
				$view->panel_gallery_insert([
					'data'	   => @$_POST ? $_POST : FALSE
				]);
			}
		break;
		
		case 'page/gallery/edit':
			if(@$_SESSION['login'] == FALSE){
				die($view->func->yonlendir(0, "index.php?page=login"));
			}else {
				$view->panel_gallery_edit([
					'data'	   => @$_POST ? $_POST : FALSE
				]);
			}
		break;
		
		
		//* thoughts
		
		case 'page/thoughts':
			if(@$_SESSION['login'] == FALSE){
				die($view->func->yonlendir(0, "index.php?page=login"));
			}else {
				$view->panel_thoughts([
					'data'	   => @$_POST ? $_POST : FALSE
				]);
			}
		break;
		
		case 'page/thoughts/status':
			if(@$_SESSION['login'] == FALSE){
				die($view->func->yonlendir(0, "index.php?page=login"));
			}else {
				$view->panel_thoughts_status([
					'data'	   => @$_GET ? $_GET : FALSE
				]);
			}
		break;
		
		case 'page/thoughts/sort':
			if(@$_SESSION['login'] == FALSE){
				die($view->func->yonlendir(0, "index.php?page=login"));
			}else {
				$view->panel_thoughts_sort([
					'data'	   => @$_POST ? $_POST : FALSE
				]);
			}
		break;
		
		case 'page/thoughts/update':
			if(@$_SESSION['login'] == FALSE){
				die($view->func->yonlendir(0, "index.php?page=login"));
			}else {
				$view->panel_thoughts_update([
					'data'	   => @$_POST ? $_POST : FALSE
				]);
			}
		break;
		
		case 'page/thoughts/delete':
			if(@$_SESSION['login'] == FALSE){
				die($view->func->yonlendir(0, "index.php?page=login"));
			}else {
				$view->panel_thoughts_delete([
					'data'	   => @$_POST ? $_POST : FALSE
				]);
			}
		break;
		
		case 'page/thoughts/add':
			if(@$_SESSION['login'] == FALSE){
				die($view->func->yonlendir(0, "index.php?page=login"));
			}else {
				$view->panel_thoughts_insert([
					'data'	   => @$_POST ? $_POST : FALSE
				]);
			}
		break;
		
		case 'page/thoughts/edit':
			if(@$_SESSION['login'] == FALSE){
				die($view->func->yonlendir(0, "index.php?page=login"));
			}else {
				$view->panel_thoughts_edit([
					'data'	   => @$_POST ? $_POST : FALSE
				]);
			}
		break;
		
		//*
		
		case 'module/slider':
			if(@$_SESSION['login'] == FALSE){
				die($view->func->yonlendir(0, "index.php?page=login"));
			}else {
				$view->panel_slider([
					'data'	   => @$_POST ? $_POST : FALSE
				]);
			}
		break;
		
		
		//* Function
		case 'func/gallery/upload':
			if(@$_SESSION['login'] == FALSE){
				die($view->func->yonlendir(0, "index.php?page=login"));
			}else {
				$view->galleryUpload([
					'data'	   => @$_POST ? $_POST : FALSE
				]);
			}
		break;
		
		case 'func/gallery/embed':
			if(@$_SESSION['login'] == FALSE){
				die($view->func->yonlendir(0, "index.php?page=login"));
			}else {
				$view->galleryEmbed([
					'data'	   => @$_POST ? $_POST : FALSE
				]);
			}
		break;
		
		case 'func/gallery/delete':
			if(@$_SESSION['login'] == FALSE){
				die($view->func->yonlendir(0, "index.php?page=login"));
			}else {
				$view->galleryDelete([
					'data'	   => @$_GET ? $_GET : FALSE
				]);
			}
		break;
		
		case 'cikisyap':
			session_destroy();
			header('Location: /admin/index.php');
			exit();
		break;
		
		default:
			if(@$_SESSION['login'] == FALSE){
				die($view->func->yonlendir(0, "index.php?page=login"));
			}else {
				die($view->func->yonlendir(0, "index.php?page=settings"));
			}
		break;
	}
?>