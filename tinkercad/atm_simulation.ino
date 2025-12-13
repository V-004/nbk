/*
  NEXUS BANK - Button Triggered NFC
  ---------------------------------
  Flow:
  1. Screen: "Press Button"
  2. Action: User taps Button (Pin A5)
  3. Screen: "Scan Card..." (Sensor Activates)
  4. Action: User hovers card (Ultrasonic)
  5. Screen: "Approved"
  
  Connections:
  - Ultrasonic: SIG -> Pin 9
  - Button:     Pin A5 -> GND
  - LCD/LEDs:   Same as before
*/

#include <LiquidCrystal.h>

/* ---------------- PINS ---------------- */
LiquidCrystal lcd(7, 6, 5, 4, 3, 2);

#define SIG_PIN     9   // Ultrasonic Sensor (3-pin)
#define PIR_PIN     A5  // PIR Motion Sensor (Signal)
#define GREEN_LED   A3
#define RED_LED     A4
#define BUZZER_PIN  A2

/* ---------------- STATES ---------------- */
enum State {
  IDLE,
  SCANNING,
  PROCESSING
};

State currentState = IDLE;
unsigned long scanStartTime = 0;

void setup() {
  pinMode(PIR_PIN, INPUT); // PIR sends HIGH when motion detected
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(GREEN_LED, OUTPUT);
  pinMode(RED_LED, OUTPUT);
  
  // Ultrasonic SIG pin handled in loop

  lcd.begin(16, 2);
  Serial.begin(9600);
  
  showIdleScreen();
}

void loop() {
  switch (currentState) {
    case IDLE:
      // Wait for Motion (PIR goes HIGH)
      if (digitalRead(PIR_PIN) == HIGH) {
        startScanning();
      }
      break;

    case SCANNING: {
      // Wait for Card (Distance < 10cm)
      long dist = getDistance();
      if (dist < 10 && dist > 0) {
        processPayment();
      }
      
      // Optional: Timeout after 10 seconds?
      // if (millis() - scanStartTime > 10000) showIdleScreen();
      break;
    }
      
    case PROCESSING:
      // Do nothing, wait for animation to finish
      break;
  }
}

/* ---------------- ACTIONS ---------------- */

void showIdleScreen() {
  currentState = IDLE;
  lcd.clear();
  lcd.print("NEXUS BANK");
  lcd.setCursor(0,1);
  lcd.print("Wave to Start");
  
  digitalWrite(GREEN_LED, LOW);
  digitalWrite(RED_LED, LOW);
}

void startScanning() {
  currentState = SCANNING;
  scanStartTime = millis();
  
  beep(50);
  lcd.clear();
  lcd.print("Initiating...");
  delay(500); 
  
  lcd.clear();
  lcd.print("SCAN CARD NOW");
  lcd.setCursor(0,1);
  lcd.print("Waiting...");
  
  Serial.println("{\"event\": \"sensor_active\"}");
}

void processPayment() {
  currentState = PROCESSING;
  Serial.println("{\"event\": \"card_detected\"}");
  beep(100);
  
  lcd.clear();
  lcd.print("Reading Data...");
  digitalWrite(RED_LED, HIGH); // Processing
  delay(1000);
  
  lcd.setCursor(0,1);
  lcd.print("Verifying...");
  delay(1000);

  paymentApproved();
}

void paymentApproved() {
  digitalWrite(RED_LED, LOW);
  digitalWrite(GREEN_LED, HIGH); // Success
  
  lcd.clear();
  lcd.print("TRANSACTION");
  lcd.setCursor(0,1);
  lcd.print("SUCCESSFUL!");
  
  successBeep();
  Serial.println("{\"event\": \"payment_success\"}");
  
  delay(3000); // Show success for 3s
  showIdleScreen();
}

/* ---------------- UTILS ---------------- */

long getDistance() {
  pinMode(SIG_PIN, OUTPUT);
  digitalWrite(SIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(SIG_PIN, HIGH);
  delayMicroseconds(5);
  digitalWrite(SIG_PIN, LOW);
  
  pinMode(SIG_PIN, INPUT);
  long duration = pulseIn(SIG_PIN, HIGH);
  return duration * 0.034 / 2;
}

void beep(int duration) {
  tone(BUZZER_PIN, 1200, duration);
  delay(duration);
}

void successBeep() {
  tone(BUZZER_PIN, 1500, 100);
  delay(100);
  tone(BUZZER_PIN, 2000, 200);
}
