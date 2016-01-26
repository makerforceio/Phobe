/* This example uses the front proximity sensor on the Zumo 32U4
Front Sensor Array to locate an opponent robot or any other
reflective object. Using the motors to turn, it scans its
surroundings. If it senses an object, it turns on its yellow LED
and attempts to face towards that object. */

#include <Wire.h>
#include <Zumo32U4.h>

Zumo32U4LCD lcd;
Zumo32U4Motors motors;
Zumo32U4ProximitySensors proxSensors;
Zumo32U4ButtonA buttonA;
Zumo32U4Buzzer buzzer;
Zumo32U4LineSensors lineSensors;

// A sensors reading must be greater than or equal to this
// threshold in order for the program to consider that sensor as
// seeing an object.
const uint8_t maxThreshold = 5;
const uint8_t sensorThreshold = 3;

// The maximum speed to drive the motors while turning.  400 is
// full speed.
const uint16_t turnSpeedMax = 200;

// The minimum speed to drive the motors while turning.  400 is
// full speed.
const uint16_t turnSpeedMin = 100;

// The amount to decrease the motor speed by during each cycle
// when an object is seen.
const uint16_t deceleration = 10;

// The amount to increase the speed by during each cycle when an
// object is not seen.
const uint16_t acceleration = 10;

#define LEFT 0
#define RIGHT 1

// Stores the last indication from the sensors about what
// direction to turn to face the object.  When no object is seen,
// this variable helps us make a good guess about which direction
// to turn.
bool senseDir = RIGHT;

// True if the robot is turning left (counter-clockwise).
bool turningLeft = false;

// True if the robot is turning right (clockwise).
bool turningRight = false;

// If the robot is turning, this is the speed it will use.
uint16_t turnSpeed = turnSpeedMax;

// The time, in milliseconds, when an object was last seen.
uint16_t lastTimeObjectSeen = 0;

uint16_t lastTimeObjectInFace = 0;
uint16_t lastEdge = 0;

bool control = false;
short recieveIndex = 0;
byte recieveBytes[4];

#define NUM_SENSORS 3
unsigned int lineSensorValues[NUM_SENSORS];

void setup() {
  Serial.begin(115200);
  
  proxSensors.initFrontSensor();
  lineSensors.initThreeSensors();

  buttonA.waitForButton();  
  move();
}

void turnRight() {
  motors.setSpeeds(turnSpeed, -turnSpeed);
  turningLeft = false;
  turningRight = true;
}

void turnLeft()
{
  motors.setSpeeds(-turnSpeed, turnSpeed);
  turningLeft = true;
  turningRight = false;
}

void move() {
  motors.setSpeeds(turnSpeed + 25, turnSpeed);
  turningLeft = false;
  turningRight = false;
}

void stop() {
  motors.setSpeeds(0, 0);
  turningLeft = false;
  turningRight = false;
}

void reverse() {
  motors.setSpeeds(-turnSpeedMin, -turnSpeedMin);
  turningLeft = false;
  turningRight = false;
}

void loop() {

  uint16_t batteryLevel = readBatteryMillivolts();

  if (batteryLevel < 6500) {
    stop();
    while (true) {
      buzzer.playFromProgramSpace(PSTR("!>g30>>c32"));
      delay(2000);
    }
  }

  if (Serial.available()) {
    byte recieve = Serial.read();
    //Serial.println(recieve);
    if (control) {
      /*if (recieveIndex >= 1) {
        recieveBytes[recieveIndex - 1] = recieve;
        if (recieveIndex == 4) {
          motors.setSpeeds((recieveBytes[0] << 8) + recieveBytes[1], (recieveBytes[2] << 8) + recieveBytes[3]);
          recieveIndex = 0;
        }
        recieveIndex++;
      }
      else if (recieve == 0x58) {
        recieveIndex = 1;
      }
      else if (recieve == 0x57) {
      control = false;
      }*/
      if (recieve == 0x57) {
        control = false;
      }
      else if (recieve == 0x58) {
        while (Serial.available() < 4) {
        }   
        int a = ((byte) Serial.read() << 8) + (byte) Serial.read(); 
        int b = ((byte) Serial.read() << 8) + (byte) Serial.read();
        Serial.write(a);
        Serial.write(b);
        motors.setSpeeds(a, b);
      }
      return;
    }
    else if (recieve == 0x56) {
      control = true;
      stop();
      return;
    }
  }
  else if (control) {
    return;
  }
  /*
  lineSensors.read(lineSensorValues);

  if (lineSensorValues[0] < 1000 || lineSensorValues[NUM_SENSORS - 1] < 1000) {
    lastEdge += 1;
  }
  else {
    lastEdge = 0;
  }
  if (lastEdge >= 100) {
    reverse();
    delay(1000);
    return;
  }
  */
  proxSensors.read();
  uint8_t leftValue = proxSensors.countsFrontWithLeftLeds();
  uint8_t rightValue = proxSensors.countsFrontWithRightLeds();

  bool objectInFace = leftValue >= maxThreshold || rightValue >= maxThreshold;
  if (objectInFace) {
    lastTimeObjectInFace += 1;
  }
  else {
    lastTimeObjectInFace = 0;
  }
  if (lastTimeObjectInFace >= 100) {
    reverse();
    delay(1000);
  }
       
  // Determine if an object is visible or not.
  bool objectSeen = leftValue >= sensorThreshold || rightValue >= sensorThreshold;

  if (objectSeen)
  {
    // An object is visible, so we will start decelerating in
    // order to help the robot find the object without
    // overshooting or oscillating.
    turnSpeed -= deceleration;
  }
  else {
    // An object is not visible, so we will accelerate in order
    // to help find the object sooner.
    turnSpeed += acceleration;
  }

  // Constrain the turn speed so it is between turnSpeedMin and
  // turnSpeedMax.
  turnSpeed = constrain(turnSpeed, turnSpeedMin, turnSpeedMax);

  if (objectSeen) {

    lastTimeObjectSeen = millis();

    bool lastTurnRight = turnRight;

    if (leftValue > rightValue) {
      // make it more even.
      turnRight();
      senseDir = RIGHT;
    }
    else if (leftValue < rightValue) {
      turnLeft();
      senseDir = LEFT;
    }
    else {
      // The values are equal, so stop the motors.
      move();
    }
  }
}
