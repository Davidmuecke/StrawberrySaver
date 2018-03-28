#Grundlegende Ideen
- vor jedem Zugriff auf die Datenbank über die REST-API soll überprüft werden,
  ob der Benutzer das Recht hat, die agefragte Tabelle zu sehen/bearbeiten.
- Deshalb wird bei jeder Anfrage als 1. Argument die ID des aufrufenden Users übergeben. 
- Die Access-Tabelle des aufrufenden Users wird abgefragt und es wird überprüft,
   ob dort die ID der aufzurufenden Tabelle ist. 
- hat der Benutzer Rechte für die Datenbanktabelle, so wird die eigentliche Operation
  ausgeführt ansonsten wird ein Fehler zurückgegeben.
- auf die User-Access Tabellen kann nur mit einem speziellen Administrator Konto zugegriffen werden.
- Für jeden sendenden Arduino muss ein eigener User angelget werden (User-ID = Sensor-ID)
- Die Sensor-ID des muss also bei jeder Anfrage mitgeliefert werden.
#Datenbanktabellen
##Sensoren und Messungen
###Allgemein
- pro Sensor eine Tabelle
- Hinweis: ein "Sensor" besteht aus einem Temperatur und einem Feuchttigkeitssensor ("Sensor" ist hier doppelt belegt)
- Name der Tabelle: **sensor_<Sensor-ID>**
- Wichtig: Alle Messwerte einer Sensortabelle müssen bei der selben Pflanzen gemessen
  werden. Wechselt ein Sensor die Pflanze, so muss die Datenbanktabelle gelöscht
  (bzw. umbenannt und als Backup gespeichert) werden.
###Aufbau der Tabellen
- Der Eintrag mit dem Indizé 0 enthält die Produkt-Informationen des Sensors:
	- Marke
	- Modellbezeichnung 
	- Gerätenummer/Seriennummer (oder MAC-Adresse?) (dient zur eindeutigen Identifikation)
- Der Eintrag mit dem Indizé 1 enthält die Konfiguration des Sensors:
	- PflanzenID, der zum Sensor zugeordneten Pflanze
	- Messintervall
	- Sendeintervall
	- Schalter: sendOnChange (true/false)
- Einträge mit den Indizés 2 bis X enthalten die vom Sensor gelieferten Daten:
	- (WifiSSID: SSID des benutzten Wifis?)
	- water: Messwert des Feuchtigkeitssensors
	- temperature: Messwert des Temperatursensors
	- time: Zeitpunkt zu dem die Messung gemacht worden ist.
	
##Pflanzen
###Allgemein
- pro Pflanze eigene Tabelle
- Name der Tabelle: **plant_<Pflanzen-ID>**
###Aufbau der Tabellen
- Die Einträge mit dem Indizé 0 bis X enthalten die Header-Informationen der Pflanze:
    - Sorte
    - ID
    - Sensor-ID_Temperatur (mit der Pflanze verknüpfter Sensor) (bei Löschen beachten)
    - Sensor-ID_Feuchtigkeit (mit der Pflanze verknüpfter Sensor) (bei Löschen beachten)
    - Erstellzeitpunkt
##Orte
###Allgemein
- pro Ort eigene Tabelle
- Name der Tabelle: **location_<Orts-ID>**
###Aufbau der Tabellen
- Der Eintrag mit dem Indizé 0 enthält die Header-Informationen des Ortes:
    - name
    - PLZ
    - Erstellzeitpunkt
    - Pflanzen-ID
- Die Einträge mit dem Indizé 1 bis X enthalten die Daten der Wettermessungen
    - Zeitstempel
    - Quelle
    - Messwert 1
    - Messwert 2
    - Messwert X 
    - ...
##User-Access
###Allgemein
- legt fest auf welche Elemente der Benutzer Zugriff hat.
- pro Benutzer eigene Tabelle
- Name der Tabelle: **user_<User-ID>**
###Aufbau der Tabelle
- Enthält Einträge der Form
   - Kategorie (Pflanze, Sensor, Ort, ...)
   - ID (Pflanzen-ID, Sensor-ID, Orts-ID,...)
   