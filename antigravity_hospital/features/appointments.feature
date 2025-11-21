Feature: Appointment Management
  As a doctor
  I want to manage appointments
  So that I can track my schedule

  Scenario: Create a new appointment
    Given I have a doctor named "Ahmet Yılmaz"
    And I have a patient named "Ali Veli"
    When I create an appointment for "Ali Veli" with "Ahmet Yılmaz" on "2023-12-25 10:00:00"
    Then the appointment should be successfully created
    And the appointment status should be "Bekliyor"
