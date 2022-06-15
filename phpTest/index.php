<html>
<body>
    <h1>Create Events</h1>
    <?="<p>Current Date: " . date("j. n. Y") . "</p>";
    $_REQUEST['date']=date("j. n. Y");?>
    <form action="result.php" method="post">
        <label for="name">Event Name:</label>
        <input type="text" id="name" name="name" required><br><br>
        <label for="date">Event Date:</label>
        <input type="date" id="date" name="date" required><br><br>
        <button type="submit">Create</button>
    </form>
    <a href="result.php">View Events</a>
</body>

</html>