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
  mysqldump --user=root --password=ohion330! autotec1_hotline1 > hotline_backup.sql

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

You can change the cPanel login password via your client's area ( my.fascomet.com ) on the home page, scroll to the hosting account in question, click Manage and then Change Password.

The Master password it will ask for is your client's area password.  

ns1.am5.fcomet.com
ns2.am5.fcomet.com


  Migrate
  =======
  - Odota min 1 min, että kaikki Answer on tallentunut Done:n jälkeen


  version 1, 25.10.2020

*/


DROP DATABASE autotec1_hotline1;
CREATE DATABASE autotec1_hotline1 CHARACTER SET utf8mb4;
CONNECT autotec1_hotline1;
SET NAMES 'utf8';


DROP USER 'autotec1_root'@'localhost';
CREATE USER 'autotec1_root'@'localhost' IDENTIFIED BY 'OhiOn330!';
GRANT ALL PRIVILEGES ON *.* TO 'autotec1_root'@'localhost';

/* Tästä asti FactCometin phpMyAdmin paneelissa */
SET default_storage_engine=INNODB;


CREATE TABLE usergroup
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
  Info TEXT,
  Logo LONGBLOB,
  LogoText VARCHAR(50),
  LogoFile VARCHAR(50),
  LicenseBegin DATE,
  LicenseEnd DATE,
  ChangeBy VARCHAR(10),
  Data JSON,
  Class VARCHAR(255),
  Converted BOOLEAN NOT NULL DEFAULT FALSE,
  Enabled BOOLEAN NOT NULL DEFAULT TRUE,
  InsertedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  InsertedBy BIGINT UNSIGNED,
  UpdatedAt DATETIME ON UPDATE CURRENT_TIMESTAMP,
  UpdatedBy BIGINT UNSIGNED,
  PRIMARY KEY (Id)
);


CREATE TABLE user
(
  Id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE,
  GroupId BIGINT UNSIGNED  NOT NULL,
  Role SMALLINT UNSIGNED NOT NULL, /* 0=administrator, 1=powerUser, 2=user, 3=demoUser */
  Email VARCHAR(80) NOT NULL,
  Username VARCHAR(80) NOT NULL UNIQUE,
  Password VARCHAR(20) NOT NULL,
  FirstName VARCHAR(50) NOT NULL,
  LastName VARCHAR(50) NOT NULL,
  Language VARCHAR(50),
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
  LastLogin DATETIME,
  LastLogout DATETIME,
  LicenseBegin DATE,
  LicenseEnd DATE,
  MaxOpenQuestions INTEGER NOT NULL DEFAULT 2,
  Data JSON,
  Class VARCHAR(255),
  Converted BOOLEAN NOT NULL DEFAULT FALSE,
  Enabled BOOLEAN NOT NULL DEFAULT TRUE,
  InsertedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  InsertedBy BIGINT UNSIGNED,
  UpdatedAt DATETIME ON UPDATE CURRENT_TIMESTAMP,
  UpdatedBy BIGINT UNSIGNED,
  PRIMARY KEY (Id),
  FOREIGN KEY (GroupId) REFERENCES usergroup(Id)
);


CREATE TABLE usersession
(
  Id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE,
  UserId BIGINT UNSIGNED NOT NULL,
  LoginTime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  LogoutTime DATETIME,
  IPAddress VARCHAR(40),
  Data JSON,
  FOREIGN KEY (UserId) REFERENCES user(Id)
);


CREATE TABLE make
(
  Id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE,
  Name VARCHAR(100) NOT NULL UNIQUE,
  Logo LONGBLOB,
  Info TEXT,
  Data JSON,
  Enabled BOOLEAN NOT NULL DEFAULT TRUE,
  InsertedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  UpdatedAt DATETIME ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (Id)
);


CREATE TABLE model
(
  Id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE,
  MakeId BIGINT UNSIGNED  NOT NULL,
  Name VARCHAR(50) NOT NULL,
  AdditionalInfo VARCHAR(50),
  Grouping VARCHAR(50),
  Sequence VARCHAR(50),
  Tune VARCHAR(50),
  StartYear SMALLINT UNSIGNED NOT NULL,
  EndYear SMALLINT UNSIGNED,
  FuelType SMALLINT UNSIGNED NOT NULL, /* 0=petrol, 1=diesel, 2=gas, 3=electricity */
  CylinderCount SMALLINT UNSIGNED,
  EngineSize SMALLINT UNSIGNED NOT NULL,
  EnginePower SMALLINT UNSIGNED,
  EnginePowerAt SMALLINT UNSIGNED,
  EngineTorque SMALLINT UNSIGNED,
  EngineTorqueAt SMALLINT UNSIGNED,
  EngineCode VARCHAR(50),
  MID VARCHAR(10),
  NetWeight SMALLINT UNSIGNED,
  GrossWeight SMALLINT UNSIGNED,
  VehicleType SMALLINT UNSIGNED NOT NULL DEFAULT 1,
  Info TEXT,
  Data JSON,
  Enabled BOOLEAN NOT NULL DEFAULT TRUE,
  InsertedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  UpdatedAt DATETIME ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (Id),
  FOREIGN KEY (MakeId) REFERENCES make(Id)
);


CREATE TABLE question
(
  Id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE,
  UserId BIGINT UNSIGNED NOT NULL,
  Date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP /* ON UPDATE CURRENT_TIMESTAMP */,
  Make VARCHAR(80) NOT NULL,
  Model VARCHAR(80),
  ModelYear SMALLINT UNSIGNED,
  ModelBeginYear SMALLINT UNSIGNED,
  ModelEndYear SMALLINT UNSIGNED,
  RegistrationYear SMALLINT UNSIGNED,
  RegistrationNumber VARCHAR(10),
  FuelType SMALLINT UNSIGNED, /* 0=petrol, 1=diesel, 2=petrol hybrid, 3=diesel hybrid, 4=methane, 5=electricity */
  CylinderCount SMALLINT UNSIGNED,
  EngineSize SMALLINT UNSIGNED,
  EnginePower SMALLINT UNSIGNED,
  EngineCode VARCHAR(50),
  MID VARCHAR(10),
  VIN VARCHAR(20),
  KType INTEGER UNSIGNED,
  NetWeight SMALLINT UNSIGNED,
  GrossWeight SMALLINT UNSIGNED,
  Info TEXT,
  Tags TEXT,
  Title VARCHAR(250) NOT NULL,
  Description TEXT NOT NULL,
  DescriptionFile VARCHAR(250),
  Solution TEXT,
  SolutionFile VARCHAR(250),
  SolutionDate DATETIME,
  Status SMALLINT UNSIGNED NOT NULL DEFAULT 0, /* 0=open, 1=solved, 2=unsolved */
  Data JSON,
  Converted BOOLEAN NOT NULL DEFAULT FALSE,
  PRIMARY KEY (Id),
  FOREIGN KEY (UserId) REFERENCES user(Id)
);


CREATE TABLE answer
(
  Id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE,
  QuestionId BIGINT UNSIGNED NOT NULL,
  UserId BIGINT UNSIGNED NOT NULL,
  Date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  Message TEXT NOT NULL,
  File VARCHAR(250),
  Data JSON,
  PRIMARY KEY (Id),
  FOREIGN KEY (QuestionId) REFERENCES question(Id),
  FOREIGN KEY (UserId) REFERENCES user(Id)
);


CREATE TABLE systemlog
(
  Id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE,
  Level VARCHAR(16) NOT NULL,
  Message VARCHAR(512) NOT NULL,
  Timestamp DATETIME NOT NULL,
  Stack TEXT,
  Data JSON,
  PRIMARY KEY (Id)
);


/* Käyttäjät */
INSERT INTO usergroup(Id, Name, ContactPerson, Url, Enabled) VALUES(1, 'Tuntematon', '', '', False);
INSERT INTO usergroup(Id, Name, ContactPerson, Url, Enabled) VALUES(2, 'Demoryhmä',  '', '', False);

INSERT INTO user(Id, GroupId, Role, FirstName, LastName, Email, Username, Password, LicenseBegin, Enabled)
  VALUES(1, 1, 2, 'Matti', 'Meikäläinen', 'matti.meikalainen@iki.fi', 'tuntematon', 'weber', NULL, False);


INSERT INTO usergroup(Id, Name, ContactPerson, Url) VALUES(12, 'Juniper Code', 'Ilkka Salmenius', 'http://www.junipercode.com');
INSERT INTO usergroup(Id, Name, ContactPerson, Url) VALUES(13, 'HMV-Systems', 'Jorma Höyteinen', 'http://www.hmv-systems.fi');
INSERT INTO usergroup(Id, Name, ContactPerson, Url) VALUES(14, 'Prodiags', NULL, 'http://www.prodiags.com');

INSERT INTO user(Id, GroupId, Role, FirstName, LastName, Email, Username, Password, LicenseBegin) VALUES(2, 12, 0, 'Ilkka', 'Salmenius', 'ilkka.salmenius@iki.fi',         'ilkka183', 'weber', NOW());
INSERT INTO user(Id, GroupId, Role, FirstName, LastName, Email, Username, Password, LicenseBegin) VALUES(3, 13, 1, 'Jorma', 'Höyteinen', 'jorma.hoyteinen@hmv-systems.fi', 'jorma',    'weber', CURDATE() - INTERVAL 1 DAY);
INSERT INTO user(Id, GroupId, Role, FirstName, LastName, Email, Username, Password, LicenseBegin) VALUES(4, 14, 1, 'Arto',  'Aalto',     'arto.aalto@prodiags.com',        'arto',     'weber', CURDATE() - INTERVAL 1 DAY);
INSERT INTO user(Id, GroupId, Role, FirstName, LastName, Email, Username, Password, LicenseBegin) VALUES(5, 14, 2, 'Jarmo', 'Aalto',     'jarmo.aalto@prodiags.com',       'jarmo',    'weber', CURDATE() - INTERVAL 1 DAY);
INSERT INTO user(Id, GroupId, Role, FirstName, LastName, Email, Username, Password, LicenseBegin) VALUES(6, 13, 2, 'Janne', 'Fröberg',   'jan.froberg@hmv-systems.fi',     'jan',      'weber', CURDATE() - INTERVAL 1 DAY);
INSERT INTO user(Id, GroupId, Role, FirstName, LastName, Email, Username, Password, LicenseBegin) VALUES(7, 13, 3, 'Teppo', 'Testaaja',  'teppo.testaaja@gmail.com',       'teppo',    'weber', NULL);


INSERT INTO make(Name) VALUES('SEAT');
INSERT INTO make(Name) VALUES('Skoda');
INSERT INTO make(Name) VALUES('Volkswagen');
INSERT INTO make(Name) VALUES('Alfa Romeo');
INSERT INTO make(Name) VALUES('Audi');
INSERT INTO make(Name) VALUES('BMW');
INSERT INTO make(Name) VALUES('Citroen');
INSERT INTO make(Name) VALUES('Fiat');
INSERT INTO make(Name) VALUES('Ford');
INSERT INTO make(Name) VALUES('Honda');
INSERT INTO make(Name) VALUES('Hyundai');
INSERT INTO make(Name) VALUES('Infiniti');
INSERT INTO make(Name) VALUES('Isuzu');
INSERT INTO make(Name) VALUES('Jaguar');
INSERT INTO make(Name) VALUES('Jeep');
INSERT INTO make(Name) VALUES('Kia');
INSERT INTO make(Name) VALUES('Mazda');
INSERT INTO make(Name) VALUES('MINI');
INSERT INTO make(Name) VALUES('Nissan');
INSERT INTO make(Name) VALUES('Opel');
INSERT INTO make(Name) VALUES('Peugeot');
INSERT INTO make(Name) VALUES('Tesla');
INSERT INTO make(Name) VALUES('Toyota');
INSERT INTO make(Name) VALUES('Volvo');

INSERT INTO model(MakeId, Name, StartYear, EndYear, FuelType, EngineSize, CylinderCount, EnginePower, EngineCode) VALUES(1, 'Ateca', 2017, NULL, 0,  999, 3,  85, 'CHZD');
INSERT INTO model(MakeId, Name, StartYear, EndYear, FuelType, EngineSize, CylinderCount, EnginePower) VALUES(1, 'Ateca', 2017, NULL, 0, 1399, 4, 110);
INSERT INTO model(MakeId, Name, StartYear, EndYear, FuelType, EngineSize, CylinderCount, EnginePower) VALUES(1, 'Ateca', 2018, NULL, 0, 1499, 4, 110);
INSERT INTO model(MakeId, Name, StartYear, EndYear, FuelType, EngineSize, CylinderCount, EnginePower, EngineCode) VALUES(1, 'Ibiza', 2018, NULL, 0,  999, 3,  70, 'CHZB');
INSERT INTO model(MakeId, Name, StartYear, EndYear, FuelType, EngineSize, CylinderCount, EnginePower, EngineCode) VALUES(1, 'Ibiza', 2018, NULL, 0,  999, 3,  85, 'CHZD');
INSERT INTO model(MakeId, Name, StartYear, EndYear, FuelType, EngineSize, CylinderCount, EnginePower) VALUES(1, 'Ibiza', 2018, NULL, 0, 1499, 4, 110);
INSERT INTO model(MakeId, Name, StartYear, EndYear, FuelType, EngineSize, CylinderCount, EnginePower, EngineCode) VALUES(1, 'Leon',  2013, 2020, 0,  999, 3,  85, 'CHZD');
INSERT INTO model(MakeId, Name, StartYear, EndYear, FuelType, EngineSize, CylinderCount, EnginePower) VALUES(1, 'Leon',  2013, 2019, 0, 1399, 4, 110);
INSERT INTO model(MakeId, Name, StartYear, EndYear, FuelType, EngineSize, CylinderCount, EnginePower) VALUES(1, 'Leon',  2013, 2020, 0, 1499, 4, 110);
INSERT INTO model(MakeId, Name, StartYear, EndYear, FuelType, EngineSize, CylinderCount, EnginePower) VALUES(1, 'Leon',  2013, 2017, 1, 1599, 4,  81);
INSERT INTO model(MakeId, Name, StartYear, EndYear, FuelType, EngineSize, CylinderCount, EnginePower) VALUES(1, 'Leon',  2017, 2020, 1, 1599, 4,  85);

INSERT INTO model(MakeId, Name, StartYear, EndYear, FuelType, EngineSize, CylinderCount, EnginePower) VALUES(2, 'Fabia',   2013, 2020, 0, 999, 3, 81);
INSERT INTO model(MakeId, Name, StartYear, EndYear, FuelType, EngineSize, CylinderCount, EnginePower) VALUES(2, 'Scala',   2019, NULL, 0, 999, 3, 70);
INSERT INTO model(MakeId, Name, StartYear, EndYear, FuelType, EngineSize, CylinderCount, EnginePower) VALUES(2, 'Scala',   2019, NULL, 0, 999, 3, 85);
INSERT INTO model(MakeId, Name, StartYear, EndYear, FuelType, EngineSize, CylinderCount, EnginePower) VALUES(2, 'Octavia', 2013, 2020, 0, 999, 3, 85);

INSERT INTO model(MakeId, Name, StartYear, EndYear, FuelType, EngineSize, CylinderCount, EnginePower) VALUES(3, 'Golf', 2013, 2020, 0, 999, 3, 81);
INSERT INTO model(MakeId, Name, StartYear, EndYear, FuelType, EngineSize, CylinderCount, EnginePower) VALUES(3, 'Golf', 2013, 2020, 0, 999, 3, 85);


INSERT INTO question(Date, UserId, Make, Model, RegistrationYear, RegistrationNumber, FuelType, EngineSize, EnginePower, EngineCode, VIN, Title, Description)
  VALUES(NOW() - INTERVAL 5 DAY, 1, 'Seat', 'Leon ST 1.0 TSI', 2017, 'ZLP-833', 0, 999, 85, 'CHZD', 'VSSZZZ5FZHR046587', 'Ei käynnisty', 'Auto ei käynnisty pitkään seistyään.');

INSERT INTO answer(QuestionId, UserId, Message) VALUES(1, 1, 'Käännä virta-avainta');
INSERT INTO answer(QuestionId, UserId, Message) VALUES(1, 2, 'Käytä huollossa');
INSERT INTO answer(QuestionId, UserId, Message) VALUES(1, 3, 'Lisää öljyä');


INSERT INTO question(Date, UserId, Make, Model, RegistrationYear, RegistrationNumber, FuelType, EngineSize, EnginePower, EngineCode, VIN, Title, Description)
  VALUES(NOW() - INTERVAL 4 DAY, 4, 'Volkswagen', 'Golf Variant 1.6', 2005, 'ISI-560', 0, 1596, 74, 'CHZD', 'WF0WXXGCDW5B88909', 'Jarrut rahisevat', 'Jarrut rahisevat oikealle käännettäessä.');

INSERT INTO answer(QuestionId, UserId, Message) VALUES(2, 3, 'Vaihda jarrulevyt');


INSERT INTO question(Date, UserId, Make, Model, RegistrationYear, RegistrationNumber, FuelType, EngineSize, EnginePower, EngineCode, VIN, Title, Description)
  VALUES(NOW() - INTERVAL 3 DAY, 2, 'Seat', 'Leon ST 1.0 TSI', 2017, 'ZLP-833', 0, 999, 85, 'CHZD', 'VSSZZZ5FZHR046587', 'Kuluttaa paljon', 'Auto on alkanut kuluttaa normaalia enemmän bensaa.');

INSERT INTO answer(QuestionId, UserId, Message) VALUES(3, 1, 'Aja tarkemmin');
INSERT INTO answer(QuestionId, UserId, Message) VALUES(3, 2, 'Tarkista renkaiden ilmanpaineet');
INSERT INTO answer(QuestionId, UserId, Message) VALUES(3, 3, 'Käytä huollossa');


INSERT INTO question(Date, UserId, Make, Model, RegistrationYear, RegistrationNumber, FuelType, EngineSize, EnginePower, EngineCode, VIN, Title, Description)
  VALUES(NOW() - INTERVAL 2 DAY, 2, 'Ford', 'Focus 1.8 TDCi', 2008, 'SIO-913', 1, 1769, 85, 'HWDA', 'WVWZZZ1JZ5W079439', 'Kulkee huonosti', 'Auto ei kulje hyvin.');

INSERT INTO answer(QuestionId, UserId, Message) VALUES(4, 1, 'Käytä huollossa');


INSERT INTO question(Date, UserId, Make, Model, RegistrationYear, RegistrationNumber, FuelType, EngineSize, EnginePower, EngineCode, VIN, Title, Description)
  VALUES(NOW() - INTERVAL 1 DAY, 3, 'Ford', 'Focus 1.8 TDdi', 1999, 'SIO-913', 1, 1769, 66, 'HWDA', 'WVWZZZ1JZ5W079439', 'Ohjaus ravistaa pahasti', 'Ohjaus ravistaa kiihdytyksessä.');

INSERT INTO answer(QuestionId, UserId, Message) VALUES(5, 1, 'Vaihda vetonivelet');
