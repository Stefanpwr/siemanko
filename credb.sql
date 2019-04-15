SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

CREATE TABLE `Klient` (
  `IdKlienta` int(10) NOT NULL,
  `Imie` text COLLATE utf8mb4_polish_ci NOT NULL,
  `Nazwisko` text COLLATE utf8mb4_polish_ci NOT NULL,
  `Miasto` text COLLATE utf8mb4_polish_ci NULL,
  `Email` text COLLATE utf8mb4_polish_ci NOT NULL,
  `Data_urodzenia` DATE  NOT NULL,
  `Waga` int(3) NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_polish_ci;

CREATE TABLE `PlanTreningowy` (
  `IdPlanu` int(10) NOT NULL,
  `IdKlienta` int(10) NOT NULL,
  `IdTrenera` int(10) NULL,
  `Data_utworzenia` DATE NOT NULL,
  `Aktualna waga` int(3) NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_polish_ci;

CREATE TABLE `Trener` (
  `IdTrenera` int(10) NOT NULL,
  `Imie` text COLLATE utf8mb4_polish_ci NOT NULL,
  `Nazwisko` text COLLATE utf8mb4_polish_ci NOT NULL,
  `Miasto` text COLLATE utf8mb4_polish_ci NULL,
  `Email` text COLLATE utf8mb4_polish_ci NOT NULL,
  `Data_urodzenia` DATE  NOT NULL,
  `Telefon` text COLLATE utf8mb4_polish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_polish_ci;

CREATE TABLE `Statystyka` (
  `IdPlanu` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_polish_ci;

CREATE TABLE `PlanTreningowy_ListaCwiczen` (
  `IdPlanu` int(10) NOT NULL,
  `IdCwiczenia` int(10) NOT NULL,
  `Liczba_serii` int(2) NULL,
  `Ciezar` int(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_polish_ci;

CREATE TABLE `ListaCwiczen` (
  `IdCwiczenia` int(10) NOT NULL,
  `Opis` text COLLATE utf8mb4_polish_ci NOT NULL,
  `Zaangazowanie miesniowe` int(3) NULL,
  `Grupa_miesniowa` text COLLATE utf8mb4_polish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_polish_ci;

-- ALTER TABLE `PlanTreningowy` CHANGE `IdPlanu` `IdPlanu` INT(10) NOT NULL AUTO_INCREMENT;
-- ALTER TABLE `Trener` CHANGE `IdTrenera` `IdTrenera` INT(10) NOT NULL AUTO_INCREMENT;
-- ALTER TABLE `ListaCwiczen` CHANGE `IdCwiczenia` `IdCwiczenia` INT(10) NOT NULL AUTO_INCREMENT;

ALTER TABLE `Klient`
  ADD PRIMARY KEY(`IdKlienta`);
ALTER TABLE `klient` CHANGE `IdKlienta` `IdKlienta` INT(10) NOT NULL AUTO_INCREMENT;


ALTER TABLE `PlanTreningowy`
  ADD PRIMARY KEY(`IdPlanu`);

ALTER TABLE `PlanTreningowy` CHANGE `IdPlanu` `IdPlanu` INT(10) NOT NULL AUTO_INCREMENT;

ALTER TABLE `Trener`
  ADD PRIMARY KEY(`IdTrenera`);

ALTER TABLE `Trener` CHANGE `IdTrenera` `IdTrenera` INT(10) NOT NULL AUTO_INCREMENT;

ALTER TABLE `ListaCwiczen`
  ADD PRIMARY KEY (`IdCwiczenia`);
  
ALTER TABLE `ListaCwiczen` CHANGE `IdCwiczenia` `IdCwiczenia` INT(10) NOT NULL AUTO_INCREMENT;

ALTER TABLE `Statystyka`
  ADD KEY `FK_STAT_MA_PLAN` (`IdPlanu`);

ALTER TABLE `PlanTreningowy_ListaCwiczen`
  ADD KEY `FK_PTLS_M_PT` (`IdPlanu`),
  ADD KEY `FK_PTLC_M_LC` (`IdCwiczenia`);

ALTER TABLE `PlanTreningowy`
  ADD KEY `FK_PLAN_MA_KLIENTA` (`IdKlienta`),
  ADD KEY `FK_PLAN_MA_TRENERA` (`IdTrenera`);

ALTER TABLE `PlanTreningowy`
  ADD CONSTRAINT `FK_PLAN_MA_KLIENTA` FOREIGN KEY (`IdKlienta`) REFERENCES `Klient` (`IdKlienta`),
  ADD CONSTRAINT `FK_PLAN_MA_TRENERA` FOREIGN KEY (`IdTrenera`) REFERENCES `Trener` (`IdTrenera`);

ALTER TABLE `Statystyka`
  ADD CONSTRAINT `FK_STAT_MA_PLAN` FOREIGN KEY (`IdPlanu`) REFERENCES `PlanTreningowy` (`IdPlanu`);

ALTER TABLE `PlanTreningowy_ListaCwiczen`
  ADD CONSTRAINT `FK_PTLS_M_PT` FOREIGN KEY (`IdPlanu`) REFERENCES `PlanTreningowy` (`IdPlanu`),
  ADD CONSTRAINT `FK_PTLC_M_LC` FOREIGN KEY (`IdCwiczenia`) REFERENCES `ListaCwiczen` (`IdCwiczenia`);
