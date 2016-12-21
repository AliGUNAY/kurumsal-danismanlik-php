<?
/**
 * @author	iwt web tasrım
 * @copyright	Copyright (c) 2016, Developer Ahmet ÖZALP (www.ahmetozalp.net)
 * @link	http://www.iwt.com.tr
 * @since	Version 1.0.0
**/

	class database{
		
		public function __construct(){
			session_start();
			try{
				$dsn = 'mysql:host=' . DATABASE_HOSTNAME . ';dbname=' . DATABASE_DATABASE;
				$this->connection = new \PDO($dsn, DATABASE_USERNAME, DATABASE_PASSWORD, $driver_options=array());
				$this->connection->query("SET NAMES ".DATABASE_NAMES."");
				$this->connection->query("SET CHARACTER SET ".DATABASE_CHARACTER."");
				$this->connection->query("SET COLLATION_CONNECTION = ".DATABASE_COLLATION."");
				return true;
			}catch(PDOException $error){
				$errorMesage = 'Hata : Veritabanı bağlantısı kurulamadı !<br>Hata Mesajı =>'.$error->getMessage();
				echo $errorMesage;
			}
		}
		
		//SELECT METHOD
		public function select($table, $array = null, $relOpt = '=', $locOpt = 'and', $orderColumn = null, $orderOpt = null, $limit = null, $lmtStart = null) 
		{
			$sql = "SELECT * FROM " . $table;
			$columns = null;
			$values = null;
			if ($array != null){
				$sql .= " WHERE ";
				$columns = array_keys($array);
				$values = array_values($array);
				for($i=0;$i<count($columns);$i++){
					if($i==count($columns)-1){
						$sql .= " " . $columns[$i] . " " . $relOpt . " ?";
					}else{
						$sql .= " " . $columns[$i] . " " . $relOpt . " ? " . $locOpt;
					}
				}
			}
			if ($orderColumn != null) {
				$sql .= " ORDER BY " . $orderColumn . " " . $orderOpt;
			}else {
				$sql .= " ORDER BY id DESC";
			}
			if ($limit != null) {
				if($lmtStart == null){
					$sql .= " LIMIT " . $limit;
				}else{
					$sql .= " LIMIT " . $lmtStart . ", " . $limit;
				}
			}
			
			try {
				$results = $this->connection->prepare($sql);
				$results->execute($values);
				$rows = $results->fetchAll();
				return $rows;
			} catch (\PDOException $e) {
				return 'Sorgu Hatası : ' . $e->getMessage() . "</br>";
			}
		}
		//INSERT METHOD
		public function insert($table, $array)
		{
			$columns = implode(", ", array_keys($array));
			$values  = array_values($array);
			$valCount = count($values);
			$str = '?';
			$str .= str_repeat(", ?", $valCount-1);
			$sql = "INSERT INTO ".$table."(".$columns.") VALUES (".$str.")";
			$results = $this->connection->prepare($sql); 
			try { 
				$results->execute($values);
				return $this->connection->lastInsertId($table); 
			} catch(PDOException $e) { 
				return "Sorgu Hatası : " . $e->getMessage() . "</br>"; 
			} 
		}
		//UPDATE METHOD
		public function update($table, $array, $where , $locOpt = 'and' , $relOpt = '=',$id = 'id') 
		{
		
			$sql = "UPDATE " . $table . " SET ";
			$columns = array_keys($array);
			$values = array_values($array);
			for($i=0;$i<count($columns);$i++){
				if($i==count($columns)-1){
					$sql .= $columns[$i] . " = ? WHERE ";
				}else{
					$sql .= $columns[$i] . " = ? , ";
				}
			}
			if(is_array($where)){
				$whereCol = array_keys($where);
				$whereVal = array_values($where);
				for($i=0;$i<count($whereCol);$i++){
					if($i==count($whereCol)-1){
						$sql .= $whereCol[$i] . " " . $relOpt . " '" . $whereVal[$i] . "'";
					}else{
						$sql .= $whereCol[$i] . " " . $relOpt . " '" . $whereVal[$i] . "' " . $locOpt . " ";
					}
				}
			}else{
				$sql .=  $id." = '".$where."'";
			}
			try {
				$result = $this->connection->prepare($sql);
				$result->execute($values);
				$count = $result->rowCount();
				if($count){
					return $count;
				}else{
					return false;
				}
			} catch (PDOException $e) {
				return 'Sorgu Hatası : ' . $e->getMessage() . "</br>";
			}
			
		}
		//DELETE METHOD
		public function delete($table, $array, $locOpt = 'and' , $relOpt = '='){
			$sql = "DELETE FROM " . $table . " WHERE ";
			if(is_array($array)){
				$columns = array_keys($array);
				$values = array_values($array);
				for($i=0;$i<count($columns);$i++){
					if($i==count($columns)-1){
						$sql .= $columns[$i] . " " . $relOpt . " ?";
					}else{
						$sql .= $columns[$i] . " " . $relOpt . " ? " . $locOpt . " ";
					}
				}
			}else{
				$values = array($array);
				$sql .= "id = ?";
			}
			try {
				$result = $this->connection->prepare($sql);
				$result->execute($values);
				$count = $result->rowCount();
				if($count){
					return $count;
				}else{
					return false;
				}
			} catch (PDOException $e) {
				return 'Sorgu Hatası : ' . $e->getMessage() . "</br>";
			}
		} 
		//QUERY METHOD
		public function query($sql) 
		{
		
			$query = $this->connection->query($sql);
			
			if ($query) {
				return $query;
			} else {
				return false;
			}
		}
		//PREPARE METHOD
		public function prepare($sql,$values) 
		{
		
			try {
				$result = $this->connection->prepare($sql);
				$result->execute($values);
				return $result;
			} catch (PDOException $e) {
				return 'Sorgu Hatası : ' . $e->getMessage() . "</br>";
			}
		}
		public function count($table = null, $array = null, $Qsql= null) 
		{
			if($Qsql != null){
				$sql = $Qsql;
			}else if($array == null){
				$sql = "SELECT count(*) from " . $table;
			}else{
				
				$columns = array_keys($array);
				$values = array_values($array);
				$sqlString = "";
				for($i=0;$i<count($columns);$i++){
					if($i==count($columns)-1){
						$sqlString .= $columns[$i]." = '".$values[$i]."' ";
					}else{
						$sqlString .= $columns[$i]." = '".$values[$i]."' and ";
					}
				}
			
				$sql = "SELECT count(*) from " . $table. " WHERE ". $sqlString;
			}
			$count = $this->connection->prepare($sql);
			$count->execute();
			return $count->fetchColumn();
		}
			
			
		function __destruct(){
			$this->connection = null;
		}		
	
	}
?>