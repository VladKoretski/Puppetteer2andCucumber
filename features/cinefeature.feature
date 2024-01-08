Feature: Booking a movie ticket for a random day

    Scenario: The user selects a chair and reserves a ticket
        Given user is on "/index.php" page
        When user selects a day and a movie
        And selects a row and books one regular-chair
        Then user receives the confirmation and qr-code

    Scenario: The user selects a random number and reserves a ticket
        Given user is on "/index.php" page
        When user selects a day and a movie
        And selects a row and books two regular-chairs
        Then user receives the confirmation and qr-code

    Scenario: The user wants to reserve a booked ticket
        Given user is on "/index.php" page
        When user selects the given day and the given movie        
        When user select a booked chair
        Then user see the button-to-reserve disabled 'true'