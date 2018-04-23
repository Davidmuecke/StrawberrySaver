#Planung Lambda Funktionen
Folgende Datenbankabfragen müssen über die REST-API gestellt werden:
- von der Web-Oberfläche
    - Alle Pflanzen einer User-ID
    - Alle Messungen einer Pflanze
    - Aktuellste Messung einer Pflanze
    - Liste aller Sensoren -> über die User-Access-Tabell werden die Sensoren herausgesucht, auf die der aktuelle Benutzer Zugriff hat.
 - vom Arduino
    - siehe "Arduino_API.md"
    
&nbsp;~**David**: stimme dir voll zu
&nbsp;~**Rahel**: Rahel auch ;). Frage: Meint "Liste aller Sensoren" ALLE Sensoren oder wie bei Punkt eins "Alle Sensoren einer User-ID"?


Folgende Datenbank-Befüllungen müssen über die REST-API ausgeführt werden:
- von der Web-Oberfläche
    - Über die "Wetter-API" angefragte Wetterdaten
    - manuelles ändern von Eigenschaften:
        - (Benutzername und Passwort ????)
        - Messverhalten der Sensoren
        - Hinzufügen von Einträgen in die User-Access Tabelle bei Neu-Anlegungen (evtl. aber schon gleich im Creation-Schritt)
- vom Arduino
    - siehe "Arduino_API.md"

Folgende Datenbank-Erstellungen (und initiale Befüllungen) müssen über die REST-API ausgeführt werden:
- von der Web-Oberfläche
    - Neuer Sensor
    - Neue Pflanze
    - Neuer Ort

Weitere Funktionalitäten des Backends (Lambda Funktionen, die nicht (unbedingt) über die REST-API getriggert werden):
- Aufräumen der Datenbank -> entfernen alter Messdaten, evtl. löschen ganzer Tabellen, etc. (löschen von Benutzern?)
    
    
