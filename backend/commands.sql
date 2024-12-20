CREATE TABLE IF NOT EXISTS Users (
  UUID VARCHAR(255) NOT NULL,
  USERNAME VARCHAR(255) UNIQUE NOT NULL,
  EMAIL VARCHAR(255) UNIQUE NOT NULL,
  PASSWORD VARCHAR(4000) NOT NULL,
  CITY VARCHAR(255),
  INTERESTS VARCHAR(400),
  VERIFIED INT NOT NULL,
  CREATED_AT DATETIME DEFAULT CURRENT_TIMESTAMP,
  EMAIL_CODE VARCHAR(255)
)

CREATE TABLE IF NOT EXISTS Posts (
  PID INT AUTO_INCREMENT PRIMARY KEY,
  CONTENT_TYPE VARCHAR(255) NOT NULL,
  HEADING VARCHAR(2000),
  CONTENT VARCHAR(10000) NOT NULL,
  PICTURE_URL VARCHAR(255),
  TIMESTAMP DATETIME DEFAULT CURRENT_TIMESTAMP,
  CREATED_BY_UUID VARCHAR(255) NOT NULL,
  EVENT_QID VARCHAR(255)
)

CREATE TABLE IF NOT EXISTS Events (
  QEID VARCHAR(255),
  IEID INT AUTO_INCREMENT,
  CITY VARCHAR(255),
  EVENT_DATE DATETIME DEFAULT CURRENT_TIMESTAMP,
  INTERESTS VARCHAR(400),
  CREATED_BY_UUID VARCHAR(255),
  PARTICIPANTS VARCHAR(2000)
)
