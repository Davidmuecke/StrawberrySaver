#Sensoren und Messungen
##Allgemein
- pro Sensor eine Tabelle
- Name der Tabelle: **Sensor-ID_Pflanzen-ID**
  (so wird gewährleistet, dass alle Messungen mit diesem Sensor an der selben Pflanze
   gemacht wurden...)
##Aufbau der Tabellen
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