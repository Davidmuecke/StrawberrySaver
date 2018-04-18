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

&nbsp;~**David:** ja, wir müssen noch schauen wie man verhindern kann, dass der Absender einfach die UserID fälscht in dem er eine andere angibt, eventuell lässt sich das über Cogito verifizieren

&nbsp;~**Jonathan** vielleicht reicht hier auch schon eine Verschlüsselung der User-ID. Ist dann zwar theoretisch immernoch fälschbar aber viel schwieriger die richtige zu "erraten."

#Datenbanktabellen
##Sensoren und Messungen
###Allgemein
- eine Sensoren-Tabelle **sensors**
- Hinweis: ein "Sensor" besteht aus einem Temperatur und einem Feuchttigkeitssensor ("Sensor" ist hier doppelt belegt)
- Wichtig: Alle Messwerte einer Sensortabelle müssen bei der selben Pflanzen gemessen
  werden. Wechselt ein Sensor die Pflanze, so muss die Datenbanktabelle gelöscht
  (bzw. umbenannt und als Backup gespeichert) werden.
###Aufbau der Tabellen
- Die Tabelle hat folende Spalten:
    - sensor_ID: MAC-Adresse des Arduinos zur Identifikation
    - systemData: Produkt-Informationen des Sensors
        - enthalt JSON-Objekt als String mit folgenden Attributen:
            - Marke (Attributname: "**make**")
            - Modellbezeichnung (Attributname: "**modelDesignation**")
            - Firmwareversion (Attributname: "**firmwareVersion**")
            - Erstinbetriebnamezeitpunkt (Attributname: "**initialCommissioning**")
            - Gerätenummer/Seriennummer (Attributname: "**serialNumber**")
        - Beispiel:
            `{
             "make":"Testmarke",
             "modelDesignation":"TestModell",
             "firmwareVersion":"Testversion",
             "initialCommissioning":"01.01.1970",
             "serialNumber":"123456"
             }`
    - configData: Konfigurierbare Daten des Sensors
        - enthält JSON-Objekt mit folgenden Attributen:
            - PflanzenID, der zum Sensor zugeordneten Pflanze:  (Attributname: "**plant_ID**")
            - Messintervall (Attributname: "**measuringInterval**")
            - Sendeintervall (Attributname: "**sendInterval**")
            - Schalter: sendOnChange (true/false)  (Attributname: "**sendOnChange**")
            - evtl. Akkustand (Attributname: "**batteryLevel**")
        - Beispiel: 
            `{
             "plant_ID":"1"
             "measuringInterval":"10"
             "sendInterval":"10"
             "sendOnChange":"true"
             "batteryLevel":"70"
             }`
    - measurements: JSON Objekt mit vom Sensor gelieferte Daten
        - enthält JSON-Objekt mit folgenden Attributen:
            - (WifiSSID: SSID des benutzten Wifis?) (Attributname: "**wifi_SSID**")
            - water: Messwert des Feuchtigkeitssensors (Attributname: "**humiditySensor**") 
            - temperature: Messwert des Temperatursensors (Attributname: "**temperatureSensor**") 
            - time: Zeitpunkt zu dem die Messung gemacht worden ist. (Attributname: "**timestamp**") 
        - Beispiel:
             `{
             "wifi_SSID":"testWlan"
             "humiditySensor":"70"
             "temperatureSensor":"25"
             "timestamp":"1522762906"
             }`

##Pflanzen
###Allgemein
- eine Pflanzen-Tabelle: **plants**
- Hinweis: Je nach Art der Pflanze müssen unterschiedliche Werte für Temperatur und Wasser als Vergleichswerte gespeichert sein/ werden
- Wichtig: siehe "Aufbau der Tabelle"

###Aufbau der Tabellen
- Die Tabelle hat folgende Spalten:
    - plant_ID: Schlüsselwert der Tabelle um die Pflanze einem Sensor und Ort zuordnen zu können
    - plantData: Informationen zur Pflanze
        - enthalt JSON-Objekt als String mit folgenden Attributen:
            - Sorte (Attributname: "**sort**")
            - Pflanzungszeitpunkt (Attributname: "**plantationTime**")
            - Erstellungszeitpunkt (der Pflanze in der Tabelle) (Attributname: "**initialTimePlant**")
            - geografischerOrtID  (Attributname: "**location_ID**")
            - lokalePositionID (Attributname: "**local_position_ID**")
                - die lokale PositionID kann dabei 3 verschiedene Werte annehmen:
                    - draußen und unueberdacht: temp_rain
                    - draußen und ueberdacht: temp
                    - drinnen: nothing
                - Je nach Position sind die Wetter- und Regen-Aussichten relevant oder eben nicht          
            - SensorID (mit der Pflanze verknüpfter Sensor (genauer gesagt Arduino)) (Attributname: "**sensor_ID**")
                - Wichtig:  beim Löschen einer Pflanze bzw. eines Sensores muss die Verknüpfung unbedingt beachtet und entsprechend reagiert werden. Wenn der Sensor die Pflanze wechselt muss ebenfalls die Pflanzen-ID in der Sensor Tabelle angepepasst werden! (siehe "Sensoren und Messungen")
            - TemperaturwertPerfekt (Attributname: "**perfectTemperature**")
            - TemperaturabweichungGruen (Attributname: "**temperatureScopeGreen**")
            - TemperaturabweichungGelb: (Attributname: "**temperatureScopeYellow**")
            - WasserwertPerfekt (Attributname: "**perfectWater**")
            - WasserabweichungGruen (Attributname: "**waterScopeGreen**")
            - WasserabweichungGelb: (Attributname: "**waterScopeYellow**")
                - Achtung: Für die Wasser- und die Temperaturberechnung wird jeweils der prefekte Wert angegeben.
                Von diesem Wert aus, werden dann die beiden Bereiche "Gelb" und "Gruen". BEIDE um perfekten Startwert aus!
        - Beispiel:
            `{
             "sort":"Erdbeere",
             "plantationTime":"01-01-2018",
             "initialTimePlant":"04-04-2018",
             "location_ID":"Stuttgart",
             "local_position_ID":"nothing",
             "sensor_ID":"xxx",
             "perfectTemperature":"15",
             "temperatureScopeGreen":"5",
             "temperatureScopeYellow":"10",
             "perfectWater":"100",
             "waterScopeGreen":"20",
             "waterScopeYellow":"30",
             }`

  
##Orte
###Allgemein
- eine geografische Ort-Tabelle **locations**
- Hinweis: wir unterschieden zwischen dem geografischen Ort (z.B. Stuttgart) und der lokalen Position (z.B. draußen oder drinnen).
    Diese Tabelle repräsentiert dabei die geografischen Ort Daten!
- Wichtig: ...

###Aufbau der Tabellen
- Die Tabelle hat folende Spalten:
    - location_ID: Schlüsselwert der Tabelle um den Ort einer Pflanze zuordnen zu können
    - locationData: Informationen des Ortes
        - enthalt JSON-Objekt als String mit folgenden Attributen:
            - Name des Ortes (Attributname: "**locationName**")
            - PLZ (Attributname: "**plz**")
            - Erstellungszeitpunkt (des Ortes in der Tabelle) (Attributname: "**initialTimeLocation**")
        - Beispiel:
            `{
             "locationName":"Stuttgart",
             "plz":"71299",
             "initialTimeLocation":"04-04-2018"
             }`

    - measurements: JSON Objekt mit den ortsspezifischen Daten
        - enthält JSON-Objekt mit folgenden Attributen:
            - Zeitstempel (Attributname: "**measurementTimeLocation**")
            - Quelle (Attributname: "**sourceLocationMeasurements**")
            - Messwerte aktueller Niederschlag (Attributname: "**humidityLocation**") 
            - Messwerte aktuelle Temperatur (Attributname: "**temperatureLocation**") 
            - Messwert aktuelle Luftfeuchtigkeit (Attributname: "**rainfallLocation**") 
        - Beispiel:
             `{
             "measurementTimeLocation":"11:30,04-04-2018",
             "sourceLocationMeasurements":"www.wetter.de",
             "humidityLocation":"8",
             "temperatureLocation":"13.5",
             "rainfallLocation":"nothing"
             }`
    
    
##User-Access
###Allgemein
- legt fest auf welche Elemente der Benutzer Zugriff hat.
- pro Benutzer eigene Tabelle
- Name der Tabelle: **user_<User-ID>**
###Aufbau der Tabelle
- Enthält Einträge der Form
   - Kategorie (Pflanze, Sensor, Ort, ...)
   - ID (Pflanzen-ID, Sensor-ID, Orts-ID,...)
   
~**David** Wichtig wäre noch, dass wir eine Art Script haben, was die Datenbanktabellen irgendwann aufräumt damit sie nicht zu groß werden (Daten von vor einer Woche werten wir ja nicht mehr aus). Solange wir aber nur ein paar Sensoren haben ist das kein Problem, eine Messung generiert ja nur einen String mit <100 Zeichen in der DB


&nbsp;~**Jonathan** Das ist wahrscheinlich am besten über eine Lambda Funktion umzusetzen. Hier gibt es zwei Möglichkeiten:
 1. Wird immer zu einem bestimmten Zeitpunkt getriggert (z.B. einmal die Woche) und dann auf eine definierte Länge getriggert.
 2. Größe der Datenbanktabelle bleibt konstant bei z.B. 100 Einträgen, immer wenn dann ein neuer hinzukommt, wird der älteste gelöscht.
 Ich persönlich würde 1. bevorzugen.