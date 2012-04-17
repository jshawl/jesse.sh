<?php
if($_POST['email']){
$to = 'jesseshawl@gmail.com';
$subject = 'Contact From the Website';
$message = "<html><body>";

$message .= "Name: ". $_POST['name']."<br />";
$message .= "Email: ". $_POST['email']."<br />";
$message .= "Message: ". $_POST['message']."<br />";
$message .= "IP: ". $_SERVER['REMOTE_ADDR']."<br />";
$message .= "</body></html>";




$headers= 'From: jshawl.com <sms@jshawl.com>' . "\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=ISO-8859-1\r\n";
mail($to, $subject, $message, $headers);
header('Location: http://jshawl.com/');
}

?>