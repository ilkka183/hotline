/*

  Ilkka Salmenius Hotline Database

  http://www.hmv-systems.fi/
  kt opeJorma
  ss weber (nämä ovat ns. kakkostunnukset)
  kt hmvadmin
  ss Päällikkö1

  Command line:
  mysql -u hotline -p
  mysql -u hotline -p < hotline.sql
  mysql --user=root --password=ohion330!
  mysql --user=root --password=ohion330! < hotline.sql
  mysqldump --user=root --password=ohion330! suoritac_hotline1 > hotline_backup.sql

  Kysymyksiä
  - tarkista tarvittavat taulut ja kentät
  - onko lisenssi käyttäjä vai ryhmäkohtainen?


  FastComet
  =========

  1. Tietokanta
  - tuhoa vanhat taulut phpMyAdmin-paneelissa
  - luo uudet taulut suorittamalla tämä SQL-tiedosto kommentista alkaen

  2. Node-palvelin
  - sammuta vanha palvelin Nede.js-paneelissa
  - kopioi uudet tiedosto FTP:llä
  - käynnistä uusi palvelin

  3. React JS koodi
  - tuhoa kaikki vanhat tiedosto palvelimelta
  - siirrä uudet FTP:llä


  Migrate
  =======
  - Odota min 1 min, että kaikki Answer on tallentunut Done:n jälkeen


  version 1, 25.10.2020

*/


DROP DATABASE suoritac_hotline1;
CREATE DATABASE suoritac_hotline1 CHARACTER SET utf8mb4;
CONNECT suoritac_hotline1;
SET NAMES 'utf8';


DROP USER 'suoritac_root'@'localhost';
CREATE USER 'suoritac_root'@'localhost' IDENTIFIED BY 'OhiOn330!';
GRANT ALL PRIVILEGES ON *.* TO 'suoritac_root'@'localhost';

/* Tästä asti FactCometin phpMyAdmin paneelissa */
SET default_storage_engine=INNODB;


CREATE TABLE UserGroup
(
  Id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE,
  Tunnus VARCHAR(50),
  Name VARCHAR(80) NOT NULL,
  BusinessId VARCHAR(20),
  ContactPerson VARCHAR(80),
  Address VARCHAR(160),
  PostalCode VARCHAR(20),
  PostOffice VARCHAR(40),
  Country VARCHAR(40),
  Phone VARCHAR(20),
  Email VARCHAR(80),
  Url VARCHAR(80),
  Logo LONGBLOB,
  LogoText VARCHAR(50),
  LogoFile VARCHAR(50),
  Info TEXT,
  LicenseBegin DATE,
  LicenseEnd DATE,
  Enabled BOOLEAN NOT NULL DEFAULT TRUE,
  CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  UpdatedAt DATETIME ON UPDATE CURRENT_TIMESTAMP,
  Data JSON,
  Class VARCHAR(255),
  ChangeBy VARCHAR(10),
  PRIMARY KEY (Id)
);


CREATE TABLE User
(
  Id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE,
  GroupId BIGINT UNSIGNED  NOT NULL,
  Role SMALLINT UNSIGNED NOT NULL, /* 0=administrator, 1=powerUser, 2=user, 3=demoUser */
  Email VARCHAR(80) NOT NULL UNIQUE,
  Password VARCHAR(20) NOT NULL,
  FirstName VARCHAR(50) NOT NULL,
  LastName VARCHAR(50) NOT NULL,
  CompanyName VARCHAR(50),
  Title VARCHAR(40),
  BusinessId VARCHAR(20),
  Address VARCHAR(160),
  PostOfficeBox VARCHAR(50),
  PostalCode VARCHAR(50),
  PostOffice VARCHAR(50),
  Country VARCHAR(50),
  Phone VARCHAR(50),
  Fax VARCHAR(50),
  Url VARCHAR(80),
  Info TEXT,
  LicenseBegin DATE,
  LicenseEnd DATE,
  MaxOpenQuestionCount INTEGER NOT NULL DEFAULT 2,
  Enabled BOOLEAN NOT NULL DEFAULT TRUE,
  CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  UpdatedAt DATETIME ON UPDATE CURRENT_TIMESTAMP,
  Data JSON,
  PRIMARY KEY (Id),
  FOREIGN KEY (GroupId) REFERENCES UserGroup(Id)
);


CREATE TABLE UserLogin
(
  UserId BIGINT UNSIGNED NOT NULL,
  Date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  IPAddress VARCHAR(40) NOT NULL,
  Data JSON,
  FOREIGN KEY (UserId) REFERENCES User(Id)
);


CREATE TABLE Make
(
  Id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE,
  Name VARCHAR(80) NOT NULL UNIQUE,
  Logo LONGBLOB,
  Info TEXT,
  Enabled BOOLEAN NOT NULL DEFAULT TRUE,
  CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  UpdatedAt DATETIME ON UPDATE CURRENT_TIMESTAMP,
  Data JSON,
  PRIMARY KEY (Name)
);

CREATE UNIQUE INDEX MakeIndex ON Make(Id);


CREATE TABLE Model
(
  Id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE,
  MakeId BIGINT UNSIGNED  NOT NULL,
  Name VARCHAR(50) NOT NULL,
  Grouping VARCHAR(50),
  AdditionalInfo VARCHAR(50),
  Sequence VARCHAR(50),
  Tune VARCHAR(50),
  StartYear SMALLINT UNSIGNED NOT NULL,
  EndYear SMALLINT UNSIGNED,
  FuelType SMALLINT UNSIGNED NOT NULL, /* 0=petrol, 1=diesel, 2=gas, 3=electricity */
  VehicleType SMALLINT UNSIGNED NOT NULL DEFAULT 1,
  CylinderCount SMALLINT UNSIGNED,
  EngineSize SMALLINT UNSIGNED NOT NULL,
  EnginePower SMALLINT UNSIGNED,
  EnginePowerAt SMALLINT UNSIGNED,
  EngineCode VARCHAR(50),
  MID VARCHAR(10),
  NetWeight SMALLINT UNSIGNED,
  GrossWeight SMALLINT UNSIGNED,
  Enabled BOOLEAN NOT NULL DEFAULT TRUE,
  CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  UpdatedAt DATETIME ON UPDATE CURRENT_TIMESTAMP,
  Data JSON,
  PRIMARY KEY (Id),
  FOREIGN KEY (MakeId) REFERENCES Make(Id)
);

CREATE UNIQUE INDEX ModelIndex ON Model(Id);


CREATE TABLE Question
(
  Id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE,
  UserId BIGINT UNSIGNED NOT NULL,
  Date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  Make VARCHAR(80) NOT NULL,
  Model VARCHAR(80) NOT NULL,
  ModelYear SMALLINT UNSIGNED,
  ModelBeginYear SMALLINT UNSIGNED,
  ModelEndYear SMALLINT UNSIGNED,
  RegistrationYear SMALLINT UNSIGNED,
  RegistrationNumber VARCHAR(7),
  FuelType SMALLINT UNSIGNED, /* 0=petrol, 1=diesel, 2=petrol hybrid, 3=diesel hybrid, 4=methane, 5=electricity */
  CylinderCount SMALLINT UNSIGNED,
  EngineSize SMALLINT UNSIGNED,
  EnginePower SMALLINT UNSIGNED,
  EngineCode VARCHAR(10),
  MID VARCHAR(10),
  VIN VARCHAR(20),
  TypeNumber INTEGER UNSIGNED,
  NetWeight SMALLINT UNSIGNED,
  GrossWeight SMALLINT UNSIGNED,
  Info TEXT,
  Title VARCHAR(250) NOT NULL,
  Description TEXT NOT NULL,
  Solution TEXT,
  Status SMALLINT UNSIGNED NOT NULL DEFAULT 0, /* 0=open, 1=solved, 2=unsolved */
  Data JSON,
  PRIMARY KEY (Id),
  FOREIGN KEY (UserId) REFERENCES User(Id)
);


CREATE TABLE Answer
(
  Id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE,
  QuestionId BIGINT UNSIGNED NOT NULL,
  UserId BIGINT UNSIGNED NOT NULL,
  Date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  Message TEXT NOT NULL,
  File VARCHAR(250),
  Data JSON,
  Solution BOOLEAN NOT NULL DEFAULT FALSE,
  PRIMARY KEY (Id),
  FOREIGN KEY (QuestionId) REFERENCES Question(Id),
  FOREIGN KEY (UserId) REFERENCES User(Id)
);


CREATE TABLE QuestionAttachment
(
  Id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE,
  QuestionId BIGINT UNSIGNED NOT NULL,
  FileName VARCHAR(80) NOT NULL,
  FileSize INTEGER UNSIGNED  NOT NULL,
  FileType VARCHAR(80) NOT NULL,
  Content LONGBLOB NOT NULL,
  Description TEXT,
  Data JSON,
  PRIMARY KEY (Id),
  FOREIGN KEY (QuestionId) REFERENCES Question(Id)
);


CREATE TABLE AnswerAttachment
(
  AnswerId BIGINT UNSIGNED NOT NULL,
  Id INTEGER UNSIGNED NOT NULL,
  FileName VARCHAR(80) NOT NULL,
  FileSize INTEGER UNSIGNED  NOT NULL,
  FileType VARCHAR(80) NOT NULL,
  Content LONGBLOB NOT NULL,
  Description TEXT,
  Data JSON,
  PRIMARY KEY (AnswerId, Id),
  FOREIGN KEY (AnswerId) REFERENCES Answer(Id)
);


/* Käyttäjät */
INSERT INTO UserGroup(Id, Name, ContactPerson, Url, Enabled) VALUES(1, 'Tuntematon', '', '', False);
INSERT INTO UserGroup(Id, Name, ContactPerson, Url) VALUES(2, 'Juniper Code', 'Ilkka Salmenius', 'http://www.junipercode.com');
INSERT INTO UserGroup(Id, Name, ContactPerson, Url) VALUES(3, 'HMV-Systems', 'Jorma Höyteinen', 'http://www.hmv-systems.fi');
INSERT INTO UserGroup(Id, Name, ContactPerson, Url) VALUES(4, 'Prodiags', NULL, 'http://www.prodiags.com');

INSERT INTO User(Id, GroupId, Role, FirstName, LastName, Email, Password, LicenseBegin, LicenseEnd, Enabled) VALUES(1, 1, 2, 'Matti', 'Meikäläinen', 'matti.meikalainen@iki.fi',       'weber', NULL, NULL, False);
INSERT INTO User(Id, GroupId, Role, FirstName, LastName, Email, Password, Address, PostalCode, PostOffice, LicenseBegin, LicenseEnd) VALUES(2, 2, 0, 'Ilkka', 'Salmenius', 'ilkka.salmenius@iki.fi', 'weber', 'Heikintie 2 A 5', '47400', 'Kausala', NOW(), NULL);
INSERT INTO User(Id, GroupId, Role, FirstName, LastName, Email, Password, LicenseBegin, LicenseEnd) VALUES(3, 3, 1, 'Jorma', 'Höyteinen',   'jorma.hoyteinen@hmv-systems.fi', 'weber', CURDATE() - INTERVAL 1 DAY, NULL);
INSERT INTO User(Id, GroupId, Role, FirstName, LastName, Email, Password, LicenseBegin, LicenseEnd) VALUES(4, 4, 1, 'Arto',  'Aalto',       'arto.aalto@prodiags.com',        'weber', CURDATE() - INTERVAL 1 DAY, NULL);
INSERT INTO User(Id, GroupId, Role, FirstName, LastName, Email, Password, LicenseBegin, LicenseEnd) VALUES(5, 4, 2, 'Jarmo', 'Aalto',       'jarmo.aalto@prodiags.com',       'weber', CURDATE() - INTERVAL 1 DAY, NULL);
INSERT INTO User(Id, GroupId, Role, FirstName, LastName, Email, Password, LicenseBegin, LicenseEnd) VALUES(6, 3, 2, 'Janne', 'Fröberg',     'jan.froberg@hmv-systems.fi',     'weber', CURDATE() - INTERVAL 1 DAY, NULL);


/* Merkit ja mallit */
/*
INSERT INTO Make(Name) VALUES('SEAT');
INSERT INTO Make(Name) VALUES('Skoda');
INSERT INTO Make(Name) VALUES('Volkswagen');
INSERT INTO Make(Name) VALUES('Alfa Romeo');
INSERT INTO Make(Name) VALUES('Audi');
INSERT INTO Make(Name) VALUES('BMW');
INSERT INTO Make(Name) VALUES('Citroen');
INSERT INTO Make(Name) VALUES('Fiat');
INSERT INTO Make(Name) VALUES('Ford');
INSERT INTO Make(Name) VALUES('Honda');
INSERT INTO Make(Name) VALUES('Hyundai');
INSERT INTO Make(Name) VALUES('Infiniti');
INSERT INTO Make(Name) VALUES('Isuzu');
INSERT INTO Make(Name) VALUES('Jaguar');
INSERT INTO Make(Name) VALUES('Jeep');
INSERT INTO Make(Name) VALUES('Kia');
INSERT INTO Make(Name) VALUES('Mazda');
INSERT INTO Make(Name) VALUES('MINI');
INSERT INTO Make(Name) VALUES('Nissan');
INSERT INTO Make(Name) VALUES('Opel');
INSERT INTO Make(Name) VALUES('Peugeot');
INSERT INTO Make(Name) VALUES('Tesla');
INSERT INTO Make(Name) VALUES('Toyota');
INSERT INTO Make(Name) VALUES('Volvo');

INSERT INTO Model(MakeId, Name, StartYear, EndYear, FuelType, EngineSize, CylinderCount, EnginePower, EngineCode) VALUES(1, 'Ateca', 2017, NULL, 0,  999, 3,  85, 'CHZD');
INSERT INTO Model(MakeId, Name, StartYear, EndYear, FuelType, EngineSize, CylinderCount, EnginePower) VALUES(1, 'Ateca', 2017, NULL, 0, 1399, 4, 110);
INSERT INTO Model(MakeId, Name, StartYear, EndYear, FuelType, EngineSize, CylinderCount, EnginePower) VALUES(1, 'Ateca', 2018, NULL, 0, 1499, 4, 110);
INSERT INTO Model(MakeId, Name, StartYear, EndYear, FuelType, EngineSize, CylinderCount, EnginePower, EngineCode) VALUES(1, 'Ibiza', 2018, NULL, 0,  999, 3,  70, 'CHZB');
INSERT INTO Model(MakeId, Name, StartYear, EndYear, FuelType, EngineSize, CylinderCount, EnginePower, EngineCode) VALUES(1, 'Ibiza', 2018, NULL, 0,  999, 3,  85, 'CHZD');
INSERT INTO Model(MakeId, Name, StartYear, EndYear, FuelType, EngineSize, CylinderCount, EnginePower) VALUES(1, 'Ibiza', 2018, NULL, 0, 1499, 4, 110);
INSERT INTO Model(MakeId, Name, StartYear, EndYear, FuelType, EngineSize, CylinderCount, EnginePower, EngineCode) VALUES(1, 'Leon',  2013, 2020, 0,  999, 3,  85, 'CHZD');
INSERT INTO Model(MakeId, Name, StartYear, EndYear, FuelType, EngineSize, CylinderCount, EnginePower) VALUES(1, 'Leon',  2013, 2019, 0, 1399, 4, 110);
INSERT INTO Model(MakeId, Name, StartYear, EndYear, FuelType, EngineSize, CylinderCount, EnginePower) VALUES(1, 'Leon',  2013, 2020, 0, 1499, 4, 110);
INSERT INTO Model(MakeId, Name, StartYear, EndYear, FuelType, EngineSize, CylinderCount, EnginePower) VALUES(1, 'Leon',  2013, 2017, 1, 1599, 4,  81);
INSERT INTO Model(MakeId, Name, StartYear, EndYear, FuelType, EngineSize, CylinderCount, EnginePower) VALUES(1, 'Leon',  2017, 2020, 1, 1599, 4,  85);

INSERT INTO Model(MakeId, Name, StartYear, EndYear, FuelType, EngineSize, CylinderCount, EnginePower) VALUES(2, 'Fabia',   2013, 2020, 0, 999, 3, 81);
INSERT INTO Model(MakeId, Name, StartYear, EndYear, FuelType, EngineSize, CylinderCount, EnginePower) VALUES(2, 'Scala',   2019, NULL, 0, 999, 3, 70);
INSERT INTO Model(MakeId, Name, StartYear, EndYear, FuelType, EngineSize, CylinderCount, EnginePower) VALUES(2, 'Scala',   2019, NULL, 0, 999, 3, 85);
INSERT INTO Model(MakeId, Name, StartYear, EndYear, FuelType, EngineSize, CylinderCount, EnginePower) VALUES(2, 'Octavia', 2013, 2020, 0, 999, 3, 85);

INSERT INTO Model(MakeId, Name, StartYear, EndYear, FuelType, EngineSize, CylinderCount, EnginePower) VALUES(3, 'Golf', 2013, 2020, 0, 999, 3, 81);
INSERT INTO Model(MakeId, Name, StartYear, EndYear, FuelType, EngineSize, CylinderCount, EnginePower) VALUES(3, 'Golf', 2013, 2020, 0, 999, 3, 85);


INSERT INTO Question(Date, UserId, Make, Model, RegistrationYear, RegistrationNumber, FuelType, EngineSize, EnginePower, EngineCode, VIN, Title, Description)
  VALUES(NOW() - INTERVAL 5 DAY, 1, 'Seat', 'Leon ST 1.0 TSI', 2017, 'ZLP-833', 0, 999, 85, 'CHZD', 'VSSZZZ5FZHR046587', 'Ei käynnisty', 'Auto ei käynnisty pitkään seistyään.');

INSERT INTO Answer(QuestionId, UserId, Message) VALUES(1, 1, 'Käännä virta-avainta');
INSERT INTO Answer(QuestionId, UserId, Message) VALUES(1, 2, 'Käytä huollossa');
INSERT INTO Answer(QuestionId, UserId, Message) VALUES(1, 3, 'Lisää öljyä');


INSERT INTO Question(Date, UserId, Make, Model, RegistrationYear, RegistrationNumber, FuelType, EngineSize, EnginePower, EngineCode, VIN, Title, Description)
  VALUES(NOW() - INTERVAL 4 DAY, 4, 'Volkswagen', 'Golf Variant 1.6', 2005, 'ISI-560', 0, 1596, 74, 'CHZD', 'WF0WXXGCDW5B88909', 'Jarrut rahisevat', 'Jarrut rahisevat oikealle käännettäessä.');

INSERT INTO QuestionAttachment(QuestionId, FileName, FileSize, FileType, Content, Description) VALUES(2, 'kuva,jpg', 1024, 'jpeg', 'JPEG', 'Kaavio');
INSERT INTO Answer(QuestionId, UserId, Message) VALUES(2, 3, 'Vaihda jarrulevyt');


INSERT INTO Question(Date, UserId, Make, Model, RegistrationYear, RegistrationNumber, FuelType, EngineSize, EnginePower, EngineCode, VIN, Title, Description)
  VALUES(NOW() - INTERVAL 3 DAY, 2, 'Seat', 'Leon ST 1.0 TSI', 2017, 'ZLP-833', 0, 999, 85, 'CHZD', 'VSSZZZ5FZHR046587', 'Kuluttaa paljon', 'Auto on alkanut kuluttaa normaalia enemmän bensaa.');

INSERT INTO Answer(QuestionId, UserId, Message) VALUES(3, 1, 'Aja tarkemmin');
INSERT INTO Answer(QuestionId, UserId, Message) VALUES(3, 2, 'Tarkista renkaiden ilmanpaineet');
INSERT INTO Answer(QuestionId, UserId, Message) VALUES(3, 3, 'Käytä huollossa');


INSERT INTO Question(Date, UserId, Make, Model, RegistrationYear, RegistrationNumber, FuelType, EngineSize, EnginePower, EngineCode, VIN, Title, Description)
  VALUES(NOW() - INTERVAL 2 DAY, 2, 'Ford', 'Focus 1.8 TDCi', 2008, 'SIO-913', 1, 1769, 85, 'HWDA', 'WVWZZZ1JZ5W079439', 'Kulkee huonosti', 'Auto ei kulje hyvin.');

INSERT INTO Answer(QuestionId, UserId, Message) VALUES(4, 1, 'Käytä huollossa');


INSERT INTO Question(Date, UserId, Make, Model, RegistrationYear, RegistrationNumber, FuelType, EngineSize, EnginePower, EngineCode, VIN, Title, Description)
  VALUES(NOW() - INTERVAL 1 DAY, 3, 'Ford', 'Focus 1.8 TDdi', 1999, 'SIO-913', 1, 1769, 66, 'HWDA', 'WVWZZZ1JZ5W079439', 'Ohjaus ravistaa', 'Ohjaus ravistaa kiihdytyksessä.');

INSERT INTO QuestionAttachment(QuestionId, FileName, FileSize, FileType, Content, Description) VALUES(5, 'kuva,jpg', 1024, 'jpeg', 'JPEG', 'Kaavio');
INSERT INTO Answer(QuestionId, UserId, Message) VALUES(5, 1, 'Vaihda vetonivelet');
*/