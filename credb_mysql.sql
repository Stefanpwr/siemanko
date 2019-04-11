-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Czas generowania: 11 Kwi 2019, 20:44
-- Wersja serwera: 10.1.37-MariaDB
-- Wersja PHP: 7.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Baza danych: `gymhub`
--

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `klient`
--

CREATE TABLE `klient` (
  `IdKlienta` int(10) NOT NULL,
  `Imie` text COLLATE utf8mb4_polish_ci NOT NULL,
  `Nazwisko` text COLLATE utf8mb4_polish_ci NOT NULL,
  `Miasto` text COLLATE utf8mb4_polish_ci,
  `Email` text COLLATE utf8mb4_polish_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_polish_ci NOT NULL,
  `Data_urodzenia` date NOT NULL,
  `Waga` int(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_polish_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `listacwiczen`
--

CREATE TABLE `listacwiczen` (
  `IdCwiczenia` int(10) NOT NULL,
  `Opis` text COLLATE utf8mb4_polish_ci NOT NULL,
  `Zaangazowanie miesniowe` int(3) DEFAULT NULL,
  `Grupa_miesniowa` text COLLATE utf8mb4_polish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_polish_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `plantreningowy`
--

CREATE TABLE `plantreningowy` (
  `IdPlanu` int(10) NOT NULL,
  `IdKlienta` int(10) NOT NULL,
  `IdTrenera` int(10) DEFAULT NULL,
  `Data_utworzenia` date NOT NULL,
  `Aktualna waga` int(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_polish_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `plantreningowy_listacwiczen`
--

CREATE TABLE `plantreningowy_listacwiczen` (
  `IdPlanu` int(10) NOT NULL,
  `IdCwiczenia` int(10) NOT NULL,
  `Liczba_serii` int(2) DEFAULT NULL,
  `Ciezar` int(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_polish_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `statystyka`
--

CREATE TABLE `statystyka` (
  `IdPlanu` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_polish_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `trener`
--

CREATE TABLE `trener` (
  `IdTrenera` int(10) NOT NULL,
  `Imie` text COLLATE utf8mb4_polish_ci NOT NULL,
  `Nazwisko` text COLLATE utf8mb4_polish_ci NOT NULL,
  `Miasto` text COLLATE utf8mb4_polish_ci,
  `Email` text COLLATE utf8mb4_polish_ci NOT NULL,
  `Data_urodzenia` date NOT NULL,
  `Telefon` text COLLATE utf8mb4_polish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_polish_ci;

--
-- Indeksy dla zrzutów tabel
--

--
-- Indeksy dla tabeli `klient`
--
ALTER TABLE `klient`
  ADD PRIMARY KEY (`IdKlienta`);

--
-- Indeksy dla tabeli `listacwiczen`
--
ALTER TABLE `listacwiczen`
  ADD PRIMARY KEY (`IdCwiczenia`);

--
-- Indeksy dla tabeli `plantreningowy`
--
ALTER TABLE `plantreningowy`
  ADD PRIMARY KEY (`IdPlanu`),
  ADD KEY `FK_PLAN_MA_KLIENTA` (`IdKlienta`),
  ADD KEY `FK_PLAN_MA_TRENERA` (`IdTrenera`);

--
-- Indeksy dla tabeli `plantreningowy_listacwiczen`
--
ALTER TABLE `plantreningowy_listacwiczen`
  ADD KEY `FK_PTLS_M_PT` (`IdPlanu`),
  ADD KEY `FK_PTLC_M_LC` (`IdCwiczenia`);

--
-- Indeksy dla tabeli `statystyka`
--
ALTER TABLE `statystyka`
  ADD KEY `FK_STAT_MA_PLAN` (`IdPlanu`);

--
-- Indeksy dla tabeli `trener`
--
ALTER TABLE `trener`
  ADD PRIMARY KEY (`IdTrenera`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT dla tabeli `klient`
--
ALTER TABLE `klient`
  MODIFY `IdKlienta` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT dla tabeli `listacwiczen`
--
ALTER TABLE `listacwiczen`
  MODIFY `IdCwiczenia` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT dla tabeli `plantreningowy`
--
ALTER TABLE `plantreningowy`
  MODIFY `IdPlanu` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT dla tabeli `trener`
--
ALTER TABLE `trener`
  MODIFY `IdTrenera` int(10) NOT NULL AUTO_INCREMENT;

--
-- Ograniczenia dla zrzutów tabel
--

--
-- Ograniczenia dla tabeli `plantreningowy`
--
ALTER TABLE `plantreningowy`
  ADD CONSTRAINT `FK_PLAN_MA_KLIENTA` FOREIGN KEY (`IdKlienta`) REFERENCES `klient` (`IdKlienta`),
  ADD CONSTRAINT `FK_PLAN_MA_TRENERA` FOREIGN KEY (`IdTrenera`) REFERENCES `trener` (`IdTrenera`);

--
-- Ograniczenia dla tabeli `plantreningowy_listacwiczen`
--
ALTER TABLE `plantreningowy_listacwiczen`
  ADD CONSTRAINT `FK_PTLC_M_LC` FOREIGN KEY (`IdCwiczenia`) REFERENCES `listacwiczen` (`IdCwiczenia`),
  ADD CONSTRAINT `FK_PTLS_M_PT` FOREIGN KEY (`IdPlanu`) REFERENCES `plantreningowy` (`IdPlanu`);

--
-- Ograniczenia dla tabeli `statystyka`
--
ALTER TABLE `statystyka`
  ADD CONSTRAINT `FK_STAT_MA_PLAN` FOREIGN KEY (`IdPlanu`) REFERENCES `plantreningowy` (`IdPlanu`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
