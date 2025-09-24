<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

try {
    $pdo = new PDO('sqlite:../database.db');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    if ($_SERVER["REQUEST_METHOD"] === "POST") {
        $name  = trim($_POST['name'] ?? "");
        $email = trim($_POST['email'] ?? "");
        $phone = trim($_POST['phone'] ?? "");

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            echo json_encode(["success" => false, "error" => "Некорректный email"]);
            exit;
        }
        $cleanPhone = preg_replace('/\D/', '', $phone); 

        if (strlen($cleanPhone) === 11) {
            
            if ($cleanPhone[0] === '8') {
                $normalizedPhone = '7' . substr($cleanPhone, 1); 
            } elseif ($cleanPhone[0] === '7') {
                $normalizedPhone = $cleanPhone; 
            } else {
                echo json_encode(["success" => false, "error" => "Некорректный телефон"]);
                exit;
            }
        } elseif (strlen($cleanPhone) === 10) {
            $normalizedPhone = '7' . $cleanPhone; 
        } else {
            echo json_encode(["success" => false, "error" => "Некорректный телефон"]);
            exit;
        }

        $stmt = $pdo->prepare("
            SELECT * FROM ClientInfo 
            WHERE name = :name AND email = :email AND phone = :phone
              AND created_at >= datetime('now', '-5 minutes')
        ");
        $stmt->execute([
            ':name' => $name,
            ':email' => $email,
            ':phone' => $normalizedPhone 
        ]);

        if ($stmt->fetch()) {
            echo json_encode(["success" => false, "error" => "Вы уже отправляли заявку недавно. Попробуйте позже."]);
            exit;
        }

        $stmt = $pdo->prepare("INSERT INTO ClientInfo (name, email, phone, created_at) VALUES (:name, :email, :phone, datetime('now'))");
        $stmt->execute([
            ':name' => $name,
            ':email' => $email,
            ':phone' => $normalizedPhone
        ]);

        echo json_encode(["success" => true, "message" => "Заявка успешно отправлена!"]);

    }

} catch (PDOException $e) {
    echo json_encode(["success" => false, "error" => "Ошибка сервера: " . $e->getMessage()]);
}
?>