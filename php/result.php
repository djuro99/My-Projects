<html>

<body>
  <?php
  if (isset($_POST['name']))
    $name = $_POST['name'];
  if (isset($_POST['date']))
    $date = $_POST['date'];
  echo "Current Date: " . date("j. n. Y") . "<br><br><br>";
  $conn = new mysqli("localhost", "root", "", "testdb", 3308);
  if ($conn->connect_error) {
    die("Error: " . $conn->connect_error);
  }
  if (isset($_POST['name']) && isset($_POST['date'])) {
    $sql = "INSERT INTO events (name, date) VALUES ('$name', '$date');";
    if ($conn->query($sql) === FALSE)
      echo "Error: " . $sql . "<br>" . $conn->error;
  }

  function compareDates($date)
  {
    $event_date = mktime(0, 0, 0, intval($date[1]), intval($date[2]), intval($date[0]));
    $current_date = time();
    if (
      intval($date[2]) == intval(date("j")) && intval($date[1]) == intval(date("n"))
      && intval($date[0]) == intval(date("Y"))
    )
      return "This event is happening today.";
    elseif (($event_date - $current_date) < 0)
      return "This event already passed.";
    else
      return floor(($event_date - $current_date) / 60 / 60 / 24) + 1 . " days left until event starts.";
  }
  $sql = "SELECT name, date FROM events;";
  $result = $conn->query($sql);
  while ($row = $result->fetch_assoc()) {
    $split_date = explode("-", $row["date"]);
    echo "Name: " . $row["name"] . "<br>Date: " . $row["date"] . "<br> " . compareDates($split_date) . "<br><br>";
  }
  ?>
  <a href="index.php">Go Back</a>
</body>

</html>