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
            - Modellbezeichnung (Spaltenname: "**modelDesignation**")
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
- pro User eine eigene Tabelle
- Name der Tabelle: **plants_<User-ID>**
###Aufbau der Tabellen
- Die Einträge mit dem Indizé 0 bis X enthalten die Header-Informationen der Pflanze:
    - Sorte
    - ID
    - Sensor-ID (mit der Pflanze verknüpfter Sensor (genauer gesagt Arduino)) (bei Löschen beachten)
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
   
~**David** Wichtig wäre noch, dass wir eine Art Script haben, was die Datenbanktabellen irgendwann aufräumt damit sie nicht zu groß werden (Daten von vor einer Woche werten wir ja nicht mehr aus). Solange wir aber nur ein paar Sensoren haben ist das kein Problem, eine Messung generiert ja nur einen String mit <100 Zeichen in der DB


&nbsp;~**Jonathan** Das ist wahrscheinlich am besten über eine Lambda Funktion umzusetzen. Hier gibt es zwei Möglichkeiten:
 1. Wird immer zu einem bestimmten Zeitpunkt getriggert (z.B. einmal die Woche) und dann auf eine definierte Länge getriggert.
 2. Größe der Datenbanktabelle bleibt konstant bei z.B. 100 Einträgen, immer wenn dann ein neuer hinzukommt, wird der älteste gelöscht.
 Ich persönlich würde 1. bevorzugen.