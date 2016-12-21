<?php

// TimThumb script created by Tim McDaniels and Darren Hoyt with tweaks by Ben Gillbanks for the Mimbo Pro theme
// May be re-used pending permission of the authors, email cutout@gmail.com
// Copyright 2008

/* request parameters that can be sent to this script */

// src: location of file from doc root
// w: width
// h: height
// zc: zoom crop (0 or 1)
// q: quality (default is 75 and max is 100)

// either width or height can be used
// example: <img src="/resizeImage.php?src=images/image.jpg&h=150" alt="some image" />
	
	
if( !isset( $_REQUEST[ "src" ] ) ) { die( "no image specified" ); }

// clean params before use
$src		= preg_replace( "/^(\.+(\/|))+/", "", $_REQUEST['src'] );
$src		= preg_replace( '/^(s?f|ht)tps?:\/\/[^\/]+/i', '', $src );
$new_width	= preg_replace( "/[^0-9]/", "", $_REQUEST[ 'w' ] );
$new_height = preg_replace( "/[^0-9]/", "", $_REQUEST[ 'h' ] );
$zoom_crop	= preg_replace( "/[^0-9]/", "", $_REQUEST[ 'zc' ] );

if( !isset( $_REQUEST['q'] ) ) { $quality = 80; } else { $quality = preg_replace("/[^0-9]/", "", $_REQUEST['q'] ); }

// set path to cache directory (default is ./cache)
// this can be changed to a different location
$cache_dir = '../cache/.cache';

// check to see if this image is in the cache already
check_cache( $cache_dir );

// get mime type of src
$mime_type = mime_type( $src );

// make sure that the src is gif/jpg/png
if( !valid_src_mime_type( $mime_type ) ) {
	$error = "Invalid src mime type: $mime_type";
	die( $error );
}

// check to see if GD function exist
if(!function_exists('imagecreatetruecolor')) {
	$error = "GD Library Error: imagecreatetruecolor does not exist";
	die( $error );
}


// get path to image on file system 
$src = $_SERVER['DOCUMENT_ROOT'] . '/' . $src;

if(strlen($src) && file_exists( $src ) ) {

	// open the existing image
	$image = open_image($mime_type, $src);
	if ($image === false) { die ('Unable to open image : ' . $src ); }		

	// Get original width and height
	$width = imagesx($image);
	$height = imagesy($image);

	// generate new w/h if not provided
	if($new_width && !$new_height) {
		$new_height = $height * ($new_width/$width);
	}
	elseif($new_height && !$new_width) {
		$new_width = $width * ($new_height/$height);
	}
	elseif(!$new_width && !$new_height) {
		$new_width = $width;
		$new_height = $height;
	}

	// create a new true color image
	$canvas = imagecreatetruecolor($new_width, $new_height);

	if( $zoom_crop ) {

		$src_x = $src_y = 0;
    	$src_w = $width;
    	$src_h = $height;

        $cmp_x = $width  / $new_width;
        $cmp_y = $height / $new_height;

		// calculate x or y coordinate and width or height of source

        if ( $cmp_x > $cmp_y ) {
        
            $src_w = round( ( $width / $cmp_x * $cmp_y ) );
            $src_x = round( ( $width - ( $width / $cmp_x * $cmp_y ) ) / 2 );
            
        } elseif ( $cmp_y > $cmp_x ) {
        
            $src_h = round( ( $height / $cmp_y * $cmp_x ) );
            $src_y = round( ( $height - ( $height / $cmp_y * $cmp_x ) ) / 2 );
            
        }
        
		imagecopyresampled( $canvas, $image, 0, 0, $src_x, $src_y, $new_width, $new_height, $src_w, $src_h );
		
	} else {
	
		// copy and resize part of an image with resampling
		imagecopyresampled( $canvas, $image, 0, 0, 0, 0, $new_width, $new_height, $width, $height );
		
	}

	// output image to browser based on mime type
	show_image( $mime_type, $canvas, $quality, $cache_dir );
	
	// remove image from memory
	ImageDestroy( $canvas );
	
} else {

	if( strlen( $src ) ) { echo $src . ' not found.'; } else { echo 'no source specified.'; }
	
}

function show_image ($mime_type, $image_resized, $quality, $cache_dir) {
		
	// check to see if we can write to the cache directory
	$is_writable = 0;
	$cache_file_name = $cache_dir . '/' . get_cache_file();        	
	        	
	if( touch( $cache_file_name ) ) {
		// give 666 permissions so that the developer 
		// can overwrite web server user
		chmod( $cache_file_name, 0666 );
		$is_writable = 1;
	} else {
		$cache_file_name = NULL;
		header('Content-type: ' . $mime_type);
	}
	
    if(stristr( $mime_type, 'gif' ) ) {
        imagegif( $image_resized, $cache_file_name );
    } elseif( stristr( $mime_type, 'jpeg' ) ) {
        imagejpeg( $image_resized, $cache_file_name, $quality );
    } elseif( stristr( $mime_type, 'png' ) ) {
        imagepng( $image_resized, $cache_file_name, ceil( $quality / 10 ) );
    }
    
	if( $is_writable ) { show_cache_file( $cache_dir ); }
    
	exit;
	
}

function open_image ($mime_type, $src) {

	if(stristr($mime_type, 'gif')) {
		$image = imagecreatefromgif($src);
    } elseif(stristr($mime_type, 'jpeg')) {
    	$image = imagecreatefromjpeg($src);
	} elseif(stristr($mime_type, 'png')) {
		$image = imagecreatefrompng($src);
    }
    
	return $image;
	
}

function mime_type ($file) {

	$frags = split("\.", $file);
	$ext = strtolower( $frags[ count( $frags ) - 1 ] );
	$types = array(
 		'jpg'  => 'image/jpeg',
 		'jpeg' => 'image/jpeg',
 		'png'  => 'image/png',
 		'gif'  => 'image/gif',
 		'bmp'  => 'image/bmp', 
 		'doc'  => 'application/msword',
 		'xls'  => 'application/msword',
 		'xml'  => 'text/xml',
 		'html' => 'text/html'
 	);
 	
    //echo "extension = " .$ext;
	$mime_type = $types[$ext];
	if(!strlen($mime_type)) { $mime_type = 'unknown'; }
	
	return($mime_type);
	
}

function valid_src_mime_type ($mime_type) {

	if( preg_match( "/jpg|jpeg|gif|png/i", $mime_type ) ) { return 1; }
	return 0;
	
}

function check_cache ($cache_dir) {

	return;

	// make sure cache dir exists
	if(!file_exists($cache_dir)) {
		// give 777 permissions so that developer can overwrite
		// files created by web server user
		mkdir($cache_dir);
		chmod($cache_dir, 0777);
	}
	
	show_cache_file($cache_dir);
	
}

function show_cache_file ( $cache_dir ) {

    $cache_file = get_cache_file();
    
    if( file_exists( $cache_dir . '/' . $cache_file ) ) {
    
    	// check for updates
    	$gmdate_mod	= gmdate('D, d M Y H:i:s', filemtime( $cache_dir . '/' . $cache_file ) ) . " GMT";	
		if ( isset( $_SERVER['HTTP_IF_MODIFIED_SINCE' ] ) ) {
		
			$if_modified_since = preg_replace( "/;.*$/", "", $_SERVER[ "HTTP_IF_MODIFIED_SINCE" ] );
			if ( $if_modified_since >= $gmdate_mod ) {
				header( "HTTP/1.1 304 Not Modified" );
				die();
			}
			
		}	    
		
    	// send headers then display image
    	header( "Content-Type: " . mime_type( $cache_file ) );
    	//header( "Last-Modified: " . gmdate('D, d M Y H:i:s', $thumbModified) . " GMT" );
    	header( "Content-Length: " . filesize( $cache_dir . '/' . $cache_file ) );
    	header( "Cache-Control: max-age=9999" );
    	header( "Expires: " . gmdate( "D, d M Y H:i:s", time() + 99999 ) . "GMT"); 
    	readfile( $cache_dir . '/' . $cache_file );
		die();
		
    }
    
}

function get_cache_file () {

	$request_params = $_REQUEST;
	$cachename = $_REQUEST['src'] . $_REQUEST['w'] . $_REQUEST['h'] . $_REQUEST['zc'] . $_REQUEST['q'];
	$cache_file = md5( $cachename );
	return $cache_file;
	
}

?>
