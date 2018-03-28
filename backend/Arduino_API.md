#Arduino AWS API Communication
##POST REQUEST
Ziel: xxx.aws.com/Arduino

Payload: {“SensorID”:”ABX100”, “WifiSSID”:”Strawberry”, “water”:500, “temperature”:23.5, "time":<Uhrzeit>, “messuereIntervall”:60,”sendIntervall”:6000, “sendOnChange”:”true”, }

Antwort Server:
Change:true/false,messuereIntervall:60,sendIntervall:6000,sendOnChange:true/false

###Ablauf:
1.	Arduino meldet sich
2.	Gibt es eine Tabelle für die Sensorwerte?  ggf. Neu anlegen
3.	Daten in Tabelle speichern
4.	Intervalle + Einstellungen vergleichen
5.	Neue Einstellungen an Arduino senden

###Datenbankmodell
####Allgemein
- pro Sensor eine Tabelle
- Name der Tabelle: Sensor-ID
####Aufbau der Tabellen
- Der Eintrag mit dem Indizé 0 enthält die Produkt-Informationen des Sensors:
	- Marke, 
	- Modellbezeichnung 
	- Gerätenummer (bzw. MAC-Adresse?) (dient zur eindeutigen Identifikation)
- Der Eintrag mit dem Indizé 1 enthält die Konfiguration des Sensors:
	- UserID, der Zugriff auf den Sensor hat (oder Liste mit Usern?)
	- PflanzenID, der zum Sensor zugeordneten Pflanze
	- Messintervall
	- Sendeintervall
	- Schalter: sendOnChange (true/false)
- Einträge mit den Indizés 2 bis X enthalten die vom Sensor gelieferten Daten:
	- (WifiSSID: SSID des benutzten Wifis?)
	- water: Messwert des Feuchtigkeitssensors
	- temperature: Messwert des Temperatursensors
	- time: Zeitpunkt zu dem die Messung gemacht worden ist.