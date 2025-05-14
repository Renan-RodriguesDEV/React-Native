<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$conn = new mysqli("localhost", "root", "", "exemploDB");

$result = $conn->query("SELECT * FROM mensagens");

$dados = [];

while($row = $result->fetch_assoc()) {
  $dados[] = $row;
}

echo json_encode($dados);
?>
