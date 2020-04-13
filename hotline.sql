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
  mysqldump --user=root --password=ohion330! hotline > hotline_backup.sql

  Kysymyksiä
  - tarkista tarvittavat taulut ja kentät
  - onko lisenssi käyttäjä vai ryhmäkohtainen?


  version 1, 25.10.2020

*/


DROP DATABASE hotline1;
CREATE DATABASE hotline1 CHARACTER SET utf8mb4;
CONNECT hotline1;
SET NAMES 'utf8';


CREATE TABLE UserGroup
(
  Id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE,
  Name VARCHAR(80) NOT NULL UNIQUE,
  Address VARCHAR(160),
  PostalCode VARCHAR(20),
  PostOffice VARCHAR(40),
  Country VARCHAR(40),
  Phone VARCHAR(20),
  Email VARCHAR(80),
  Website VARCHAR(80),
  Logo LONGBLOB,
  Info TEXT,
  Enabled BOOLEAN NOT NULL DEFAULT TRUE,
  CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  UpdatedAt DATETIME ON UPDATE CURRENT_TIMESTAMP,
  Data JSON,
  PRIMARY KEY (Id)
);


CREATE TABLE User
(
  Id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE,
  GroupId BIGINT UNSIGNED  NOT NULL,
  Role SMALLINT UNSIGNED NOT NULL, /* 0=administrator, 1=power-user, 2=user, 3=demo-user */
  Username VARCHAR(20) NOT NULL UNIQUE,
  Password VARCHAR(20) NOT NULL,
  FirstName VARCHAR(40) NOT NULL,
  LastName VARCHAR(40) NOT NULL,
  Title VARCHAR(40),
  Address VARCHAR(160),
  PostalCode VARCHAR(20),
  PostOffice VARCHAR(40),
  Country VARCHAR(40),
  Phone VARCHAR(20),
  Email VARCHAR(80) NOT NULL UNIQUE,
  Website VARCHAR(80),
  Info TEXT,
  LicenseBegin DATE,
  LicenseEnd DATE,
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


CREATE TABLE Brand
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

CREATE UNIQUE INDEX BrandIndex ON Brand(Name);


CREATE TABLE Notice
(
  Id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE,
  UserId BIGINT UNSIGNED NOT NULL,
  Date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  Title VARCHAR(160) NOT NULL,
  Message TEXT NOT NULL,
  Data JSON,
  PRIMARY KEY (Id),
  FOREIGN KEY (UserId) REFERENCES User(Id)
);


CREATE TABLE Problem
(
  Id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE,
  UserId BIGINT UNSIGNED NOT NULL,
  Date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  LicenseNumber VARCHAR(7),
  Brand VARCHAR(80) NOT NULL,
  Model VARCHAR(80),
  ModelYear SMALLINT UNSIGNED,
  Fuel SMALLINT UNSIGNED, /* 0=petrol, 1=diesel, 2=gas, 3=electricity */
  EngineDisplacement SMALLINT UNSIGNED,
  EngineCode VARCHAR(10),
  VIN VARCHAR(20),
  MID VARCHAR(10),
  Info TEXT,
  Title VARCHAR(160) NOT NULL,
  Description TEXT NOT NULL,
  Solution TEXT,
  Status SMALLINT UNSIGNED NOT NULL DEFAULT 0, /* 0=open, 1=solved, 2=unsolved */
  Data JSON,
  PRIMARY KEY (Id),
  FOREIGN KEY (UserId) REFERENCES User(Id)
);


CREATE TABLE ProblemAttachment
(
  ProblemId BIGINT UNSIGNED NOT NULL,
  Id INTEGER UNSIGNED NOT NULL,
  FileName VARCHAR(80) NOT NULL,
  FileType VARCHAR(80) NOT NULL,
  FileSize INTEGER UNSIGNED  NOT NULL,
  Content LONGBLOB NOT NULL,
  Description TEXT,
  Data JSON,
  PRIMARY KEY (ProblemId, Id),
  FOREIGN KEY (ProblemId) REFERENCES Problem(Id)
);


CREATE TABLE ProblemReply
(
  ProblemId BIGINT UNSIGNED NOT NULL,
  Id INTEGER UNSIGNED NOT NULL,
  UserId BIGINT UNSIGNED NOT NULL,
  Date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  Message TEXT NOT NULL,
  Data JSON,
  PRIMARY KEY (ProblemId, Id),
  FOREIGN KEY (ProblemId) REFERENCES Problem(Id),
  FOREIGN KEY (UserId) REFERENCES User(Id)
);


CREATE TABLE ProblemReplyAttachment
(
  ProblemId BIGINT UNSIGNED NOT NULL,
  ReplyId INTEGER UNSIGNED NOT NULL,
  Id INTEGER UNSIGNED NOT NULL,
  FileName VARCHAR(80) NOT NULL,
  FileType VARCHAR(80) NOT NULL,
  FileSize INTEGER UNSIGNED  NOT NULL,
  Content LONGBLOB NOT NULL,
  Description TEXT,
  Data JSON,
  PRIMARY KEY (ProblemId, ReplyId, Id),
  FOREIGN KEY (ProblemId) REFERENCES Problem(Id),
  FOREIGN KEY (ProblemId, ReplyId) REFERENCES ProblemReply(ProblemId, Id)
);


INSERT INTO UserGroup(Name, Website) VALUES('Juniper Code', 'http://www.junipercode.com');
INSERT INTO UserGroup(Name, Website) VALUES('HMV-Systems', 'http://www.hmv-systems.fi');
INSERT INTO UserGroup(Name, Website) VALUES('Prodiags', 'http://www.prodiags.com');

INSERT INTO User(GroupId, Role, FirstName, LastName, Email, Username, Password, LicenseBegin, LicenseEnd) VALUES(1, 0, 'Ilkka', 'Salmenius', 'ilkka.salmenius@iki.fi', 'albert', 'weber', NOW(), NULL);
INSERT INTO User(GroupId, Role, FirstName, LastName, Email, Username, Password, LicenseBegin, LicenseEnd) VALUES(2, 1, 'Jorma', 'Höyteinen', 'jorma.hoyteinen@hmv-systems.fi ', 'opeJorma', 'weber', NOW() - INTERVAL 1 DAY, NULL);
INSERT INTO User(GroupId, Role, FirstName, LastName, Email, Username, Password, LicenseBegin, LicenseEnd) VALUES(3, 2, 'Arto', 'Aalto', 'arto.aalto@prodiags.com', 'arto', 'weber', NOW() - INTERVAL 1 DAY, NULL);

INSERT INTO Brand(Name) VALUES('SEAT');
INSERT INTO Brand(Name) VALUES('Volkswagen');
INSERT INTO Brand(Name) VALUES('Alfa Romeo');
INSERT INTO Brand(Name) VALUES('Audi');
INSERT INTO Brand(Name) VALUES('BMW');
INSERT INTO Brand(Name) VALUES('Citroen');
INSERT INTO Brand(Name) VALUES('Fiat');
INSERT INTO Brand(Name) VALUES('Ford');
INSERT INTO Brand(Name) VALUES('Honda');
INSERT INTO Brand(Name) VALUES('Hyundai');
INSERT INTO Brand(Name) VALUES('Infiniti');
INSERT INTO Brand(Name) VALUES('Isuzu');
INSERT INTO Brand(Name) VALUES('Jaguar');
INSERT INTO Brand(Name) VALUES('Jeep');
INSERT INTO Brand(Name) VALUES('Kia');
INSERT INTO Brand(Name) VALUES('Mazda');
INSERT INTO Brand(Name) VALUES('MINI');
INSERT INTO Brand(Name) VALUES('Nissan');
INSERT INTO Brand(Name) VALUES('Opel');
INSERT INTO Brand(Name) VALUES('Peugeot');
INSERT INTO Brand(Name) VALUES('Skoda');
INSERT INTO Brand(Name) VALUES('Tesla');
INSERT INTO Brand(Name) VALUES('Toyota');
INSERT INTO Brand(Name) VALUES('Volvo');


INSERT INTO Notice(UserId, Title, Message) VALUES(2, 'Päivitys SMS palveluun', 'HotLinen SMS palvelun hallintaan on tehty muutos.');
INSERT INTO Notice(UserId, Title, Message) VALUES(1, 'Gates apulaitehihnat', 'Gatesin koulutuksesta muutama hyödyllinen linkki. Varaosakirja www.gatesautocat.com');

INSERT INTO Notice(UserId, Title, Message) VALUES(1, 'Vuosilisenssi 1.10.2013 alkaen', 'HotLinen vuosilisenssin hinta on 280€ (alv 0%) 1.10.2013 alkaen.
Uusi hinta tulee voimaan lisenssin uudistuksen yhteydessä 1.10.2013 alkaen, eli muutos tulee voimassa 1.10.2013-30.9.2014 välisenä aikana.');


/* Vikatapaukset */
INSERT INTO Problem(UserId, Brand, Model, ModelYear, Fuel, LicenseNumber, EngineCode, VIN, Title, Description, Solution, Status)
  VALUES(1, 'Seat', 'Leon ST 1.0 TSI Ecomotive Style', 2017, 0, 'ZLP-833', 'ABC', '123', 'Ei käynnisty', 'Auto ei käynnisty pitkään seistyään.', 'Lataa akku.', 1);

INSERT INTO ProblemReply(ProblemId, Id, UserId, Message) VALUES(1, 1, 2, 'Käännä virta-avainta');


INSERT INTO Problem(UserId, Brand, Model, ModelYear, Fuel, LicenseNumber, EngineCode, VIN, Title, Description, Status)
  VALUES(1, 'Volkswagen', 'Golf Variant 1.6 Comfortline', 2005, 0, 'ISI-560', 'ABC', '123', 'Jarrut rahisevat', 'Jarrut rahisevat oikealle käännettäessä.', 0);

INSERT INTO ProblemReply(ProblemId, Id, UserId, Message) VALUES(2, 1, 3, 'Vaihda jarrulevyt');


INSERT INTO Problem(UserId, Brand, Model, ModelYear, Fuel, LicenseNumber, EngineCode, VIN, Title, Description, Status)
  VALUES(2, 'Seat', 'Leon ST 1.0 TSI Ecomotive Style', 2017, 0, 'ZLP-833', 'ABC', '123', 'Kuluttaa paljon', 'Auto on alkanut kuluttaa normaalia enemmän bensaa.', 0);

INSERT INTO ProblemReply(ProblemId, Id, UserId, Message) VALUES(3, 1, 1, 'Aja tarkemmin');
INSERT INTO ProblemReply(ProblemId, Id, UserId, Message) VALUES(3, 2, 2, 'Tarkista renkaiden ilmanpaineet');
INSERT INTO ProblemReply(ProblemId, Id, UserId, Message) VALUES(3, 3, 3, 'Käytä huollossa');


INSERT INTO Problem(UserId, Brand, Model, ModelYear, Fuel, LicenseNumber, EngineCode, VIN, Title, Description, Status)
  VALUES(2, 'Ford', 'Ford Focus 1.8 TDCi', 2007, 0, 'SIO-913', 'ABC', '123', 'Kulkee huonosti', 'Auto ei kulje hyvin.', 0);

INSERT INTO ProblemReply(ProblemId, Id, UserId, Message) VALUES(4, 1, 1, 'Käytä huollossa');


INSERT INTO Problem(UserId, Brand, Model, ModelYear, Fuel, LicenseNumber, EngineCode, VIN, Title, Description, Status)
  VALUES(3, 'Ford', 'Ford Focus 1.8 TDCi', 2007, 0, 'SIO-913', 'ABC', '123', 'Ohjaus ravistaa', 'Ohjaus ravistaa kiihdytyksessä.', 0);

INSERT INTO ProblemReply(ProblemId, Id, UserId, Message) VALUES(5, 1, 1, 'Vaihda vetonivelet');
