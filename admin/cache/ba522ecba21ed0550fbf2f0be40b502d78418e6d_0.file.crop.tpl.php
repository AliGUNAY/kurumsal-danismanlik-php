<?php
/* Smarty version 3.1.30-dev/18, created on 2016-06-23 12:55:03
  from "/home/istwt/domains/istanbulwebtasarim.com/public_html/demo/yenipanel/theme/admin/module/crop.tpl" */

if ($_smarty_tpl->_decodeProperties($_smarty_tpl, array (
  'has_nocache_code' => false,
  'version' => '3.1.30-dev/18',
  'unifunc' => 'content_576bb1f7f411e1_41781092',
  'file_dependency' => 
  array (
    'ba522ecba21ed0550fbf2f0be40b502d78418e6d' => 
    array (
      0 => '/home/istwt/domains/istanbulwebtasarim.com/public_html/demo/yenipanel/theme/admin/module/crop.tpl',
      1 => 1466675701,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
  ),
),false)) {
function content_576bb1f7f411e1_41781092 ($_smarty_tpl) {
?>
<div class="modal fade bs-modal-sm" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" data-width="760" aria-hidden="true" style="display: none;">
	<div class="modal-dialog modal-sm">
		<div class="modal-content">

			<div class="modal-body">
				<div class="container">
				  <div class="imageBox" >
					<!--<div id="img" ></div>-->
					<!--<img class="cropImg" id="img" style="display: none;" src="images/avatar.jpg" />-->
					<div class="mask"></div>
					<div class="thumbBox"></div>
					<div class="spinner" style="display: none">Loading...</div>
				  </div>
				 </div>

				<div class="clearfix"></div>
			</div>
			
			<div class="clearfix"></div>
			<div class="modal-footer">
			
			
				<div class="pull-left">
					<button type="button" id="zoomOut" class="btn btn-primary"><i class="fa fa-search-plus" aria-hidden="true"></i> </button>
					<button type="button" id="zoomIn" class="btn btn-primary"><i class="fa fa fa-search-minus"></i></button>
					<button id="crop" class="btn btn-primary">Krop'la</button>
				</div>
				
				<div class="pull-right">
					<button data-dismiss="modal" class="btn btn-primary">İptal</button>
					<button type="button" class="btn btn-danger resimsil" data-image="<?php echo $_smarty_tpl->tpl_vars['resim']->value;?>
" data-dismiss="modal">Resmi Sil</button>
				</div>
				
			
			</div>
		</div><!-- /.modal-content -->
	</div><!-- /.modal-dialog -->
</div>



<?php echo '<script'; ?>
>
$('.bs-modal-sm').modal('show');

var rot = 0,ratio = 1;
var CanvasCrop = $.CanvasCrop({
	cropBox : ".imageBox",
	imgSrc : "<?php echo $_smarty_tpl->tpl_vars['resim']->value;?>
",
	limitOver : 2
});


$('#upload-file').on('change', function(){
	var reader = new FileReader();
	reader.onload = function(e) {
		CanvasCrop = $.CanvasCrop({
			cropBox : ".imageBox",
			imgSrc : e.target.result,
			limitOver : 2
		});
		rot =0 ;
		ratio = 1;
	}
	reader.readAsDataURL(this.files[0]);
	this.files = [];
});

$("#rotateLeft").on("click",function(){
	rot -= 90;
	rot = rot<0?270:rot;
	CanvasCrop.rotate(rot);
});
$("#rotateRight").on("click",function(){
	rot += 90;
	rot = rot>360?90:rot;
	CanvasCrop.rotate(rot);
});
$("#zoomIn").on("click",function(){
	ratio =ratio*0.9;
	CanvasCrop.scale(ratio);
});
$("#zoomOut").on("click",function(){
	ratio =ratio*1.1;
	CanvasCrop.scale(ratio);
});

$("#crop").on("click",function(){
	var src = CanvasCrop.getDataURL("jpeg");
	//$("body").append("<div style='word-break: break-all;'>"+src+"</div>");  
	console.log(src);
});
<?php echo '</script'; ?>
>

<style>
#visbleCanvas {
  position: absolute;
  top: 0;
  left: 0;
}
.thumbBox {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 200px;
  height: 200px;
  margin-top: -100px;
  margin-left: -100px;
  box-sizing: border-box;
  border: 1px solid #666666;
  box-shadow: 0 0 0 1000px rgba(0, 0, 0, 0.5);
  background: none repeat scroll 0% 0% transparent;
}
.tools{
	margin-top: 20px;
	
}
.tools span{
	float: left;
	display: inline-block;
	padding: 5px 20px;
	background-color: #f40;
	color: #fff;
	cursor: pointer;
	margin-bottom: 5px;
	margin-right: 5px;
}
.clearfix {
	*zoom: 1;
}
.clearfix:before{
	content: " ";
	display: table;
}
.clearfix:after{
	content: " ";
	display: table;
	clear: both;
}
.cropPoint{
	position: absolute;
	height: 8px;
	width: 8px;
	background-color: rgba(255,255,255,0.7);
	cursor: pointer;
}
.upload-wapper{
	position: relative;
	float: left;
	height: 26px;
	line-height: 26px;
	width: 132px;
	background-color: #f40;
	color: #fff;
	text-align: center;
	overflow: hidden;
	cursor: pointer;
}
#upload-file{
	position: absolute;
	left: 0;
	top: 0;
	opacity: 0;
	filter: alpha(opacity=0);
	width: 132px;
	height: 26px;
	cursor: pointer;
}

.container {
  width: 100%;
  position: relative;
  font-family: 'Open Sans';
  font-size: 14px;
}

.container p {
  line-height: 12px;
  line-height: 0px;
  height: 0px;
  margin: 10px;
  color: #bbb
}

.action {
  width: 100%;
  height: 30px;
  margin: 10px 0;
}

.cropped {
  position: absolute;
  right: -230px;
  top: 0;
  width: 200px;
  border: 1px #ddd solid;
  height: 460px;
  padding: 4px;
  box-shadow: 0px 0px 12px #ddd;
  text-align: center;
}

.imageBox {
  position: relative;
  height: 250px;
  width:100%;
  border: 1px solid #aaa;
  background: #fff;
  overflow: hidden;
  background-repeat: no-repeat;
  cursor: move;
  box-shadow: 4px 4px 12px #B0B0B0;
}

.imageBox .thumbBox {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 200px;
  height: 200px;
  margin-top: -100px;
  margin-left: -100px;
  box-sizing: border-box;
  border: 1px solid rgb(102, 102, 102);
  box-shadow: 0 0 0 1000px rgba(0, 0, 0, 0.5);
  background: none repeat scroll 0% 0% transparent;
}

.imageBox .spinner {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  text-align: center;
  line-height: 400px;
  background: rgba(0,0,0,0.7);
}

.Btnsty_peyton {
  float: right;
  width: 66px;
  display: inline-block;
  margin-bottom: 10px;
  height: 57px;
  line-height: 57px;
  font-size: 20px;
  color: #FFFFFF;
  margin: 0px 2px;
  background-color: #f38e81;
  border-radius: 3px;
  text-decoration: none;
  cursor: pointer;
  box-shadow: 0px 0px 5px #B0B0B0;
  border: 0px #fff solid;
}

/*选择文件上传*/

.new-contentarea {
  width: 165px;
  overflow: hidden;
  margin: 0 auto;
  position: relative;
  float: left;
}

.new-contentarea label {
  width: 100%;
  height: 100%;
  display: block;
}

.new-contentarea input[type=file] {
  width: 188px;
  height: 60px;
  background: #333;
  margin: 0 auto;
  position: absolute;
  right: 50%;
  margin-right: -94px;
  top: 0;
  right/*\**/: 0px\9;
  margin-right/*\**/: 0px\9;
  width/*\**/: 10px\9;
  opacity: 0;
  filter: alpha(opacity=0);
  z-index: 2;
}

a.upload-img {
  width: 165px;
  display: inline-block;
  margin-bottom: 10px;
  height: 57px;
  line-height: 57px;
  font-size: 20px;
  color: #FFFFFF;
  background-color: #f38e81;
  border-radius: 3px;
  text-decoration: none;
  cursor: pointer;
  border: 0px #fff solid;
  box-shadow: 0px 0px 5px #B0B0B0;
}

a.upload-img:hover { background-color: #ec7e70; }

.tc { text-align: center; }
</style><?php }
}
