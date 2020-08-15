<?php 

    include('connection.php');

    $noteData = json_decode(file_get_contents("php://input"));
    $noteDateCreation = $noteData->date;
    $noteContent = json_encode($noteData->content);

    $notesAreCreated = mysqli_query($connection, "INSERT INTO notes VALUES('$noteDateCreation', '$noteContent')");

    if (!$notesAreCreated) {
        
        $result = mysqli_query($connection, "UPDATE notes SET content='$noteContent' WHERE creation_date='$noteDateCreation')");

    }

    echo json_encode(['status' => 'success']);
    
?>