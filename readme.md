# ZTW-GymHub system do zarządzania planami treningowymi.
Instalacja systemu:
1.Pobierz projekt i swtórz projekt node.js express (projekt tworzony w środowisku PHPStorm).
2.Uruchom w konsoli polecenie npm install instalujący wymagane zależności i moduły.
3.Uruchom program XAMPP i uruchom server Apache oraz MsQL.
4.W localhost/phpmyadmin zimportuj plik credb.sql tworzący bazę danych wykorzystywaną w projekcie.
5.Uruchom komendę node login.js uruchamiającą serwer.
6.W razie problemów z błędami może być konieczne doinstalowanie pakietów, z ktorych korzysta server.
7.Uruchom przeglądarke pod adresem localhost:3000 (server nasłuchuje requesty na porcie 3000).

#Funkcjonalności:
1.Tworzenie konta użytkownika.
2.Autoryzacja.
3.Dodanie planu treningowego.
4.Dodanie ćwiczeń do planu treningowego.
Ostatnie dwie funkcjonalności są aktualnie w fazie tworzenia, wyświetlają wyniki w konsoli, brak widoku html.
