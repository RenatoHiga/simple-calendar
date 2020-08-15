<?php
    include('connection.php');

    $noteCreationDate = date('Y-m-d', strtotime($_GET['date']));

    $textQuery = "SELECT content FROM notes WHERE creation_date = '$noteCreationDate'";
    $query = mysqli_query($connection, $textQuery);
    $result = mysqli_fetch_object($query);

    echo json_encode(
        [
            'response' => $result
        ]
    );    
?>