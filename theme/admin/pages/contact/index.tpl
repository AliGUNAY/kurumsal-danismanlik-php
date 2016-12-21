{include file="header.tpl"}
 <div id="main-wrapper">
	<aside>
		{include file="menu.tpl"}
		<section id="main-container">
		<header>
			<div class="row">		
				<div class="col-sm-12">
					<h4 class="pull-left"><i class="fa fa-pencil antagon-color-main"></i> İletişim</h4>
					
				</div>	
			</div>	
		</header>
		<br/>
		<div id="content">
			
			
			
			<div class="panel panel-default">
                <div class="panel-heading">
                    <h3 class="panel-title">İletişim Mesajlar</h3>
                </div>
                <div class="panel-body">
                    <table class="table table-bordered">
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>İsim Soyisim</th>
                            <th>Telefon</th>
                            <th>Mail Adresi</th>
							<th>Mesaj</th>
                        </tr>
                        </thead>
                        <tbody>
						{if $contact eq TRUE}
							{foreach from=$contact item=don}
							<tr>
								<td>#{$don.id}</td>
								<td>{$don.adsoyad}</td>
								<td>{$don.telefon}</td>
								<td>{$don.mailadresi}</td>
								<td>
									<div class="btn-group">
										<button data-toggle="modal" href="#static{$don.id}" type="button" class="btn btn-info btn-xs"><i class="fa fa-info-circle"></i> Mesajı Oku</button>
									</div>
								</td>
							</tr>
							{/foreach}
						{else}
							<tr>
								<td><center>-</center></td>
								<td><center>Hiç Kayıt Bulunamadı!</center></td>
								<td><center>-</center></td>
								<td><center>-</center></td>
								<td><center>-</center></td>
							</tr>
						{/if}
                       
					   
					   {if $contact eq TRUE}
							{foreach from=$contact item=don}
								<div id="static{$don.id}" class="modal fade" tabindex="-1" data-backdrop="static" data-keyboard="false" style="display: none;">
									<div class="modal-body">
										<div class="well well-primary-light-text">
											<p>{$don.mesaj}</p>
										</div>
									</div>
									<div class="modal-footer">
										<button type="button" data-dismiss="modal" class="btn btn-default">Kapat</button>
									</div>
								</div>
							{/foreach}
						{/if}
					   
                        </tbody>
                    </table>
                </div>
            </div>
			
			
			
			
		</div>
		</section>
	</aside>
 </div>
{include file="footer.tpl"}