<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");


// Conexão com o banco
$conn = new mysqli("localhost", "root", "", "exemploDB");
if ($conn->connect_error) {
  die(json_encode(["erro" => "Falha na conexão: " . $conn->connect_error]));
}


$method = $_SERVER['REQUEST_METHOD'];


switch ($method) {
  case 'GET':
    $result = $conn->query("SELECT * FROM mensagens");
    $dados = [];
    while($row = $result->fetch_assoc()) {
      $dados[] = $row;
    }
    echo json_encode($dados);
    break;


  case 'POST':
    $input = json_decode(file_get_contents("php://input"));
    if (isset($input->texto)) {
      $texto = $conn->real_escape_string($input->texto);
      $conn->query("INSERT INTO mensagens (texto) VALUES ('$texto')");
      echo json_encode(["status" => "Mensagem criada com sucesso"]);
    } else {
      echo json_encode(["erro" => "Texto não fornecido"]);
    }
    break;


  case 'PUT':
    $input = json_decode(file_get_contents("php://input"));
    if (isset($input->id) && isset($input->texto)) {
      $id = (int)$input->id;
      $texto = $conn->real_escape_string($input->texto);
      $conn->query("UPDATE mensagens SET texto='$texto' WHERE id=$id");
      echo json_encode(["status" => "Mensagem atualizada com sucesso"]);
    } else {
      echo json_encode(["erro" => "Dados incompletos para atualização"]);
    }
    break;


  case 'DELETE':
    $input = json_decode(file_get_contents("php://input"));
    if (isset($input->id)) {
      $id = (int)$input->id;
      $conn->query("DELETE FROM mensagens WHERE id=$id");
      echo json_encode(["status" => "Mensagem excluída com sucesso"]);
    } else {
      echo json_encode(["erro" => "ID não fornecido para exclusão"]);
    }
    break;


  default:
    echo json_encode(["erro" => "Método HTTP não suportado"]);
    break;
}
?>
