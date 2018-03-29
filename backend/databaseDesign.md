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
- pro Sensor eine Tabelle
- Hinweis: ein "Sensor" besteht aus einem Temperatur und einem Feuchttigkeitssensor ("Sensor" ist hier doppelt belegt)
- Name der Tabelle: **sensor_<Sensor-ID>**
- Wichtig: Alle Messwerte einer Sensortabelle müssen bei der selben Pflanzen gemessen
  werden. Wechselt ein Sensor die Pflanze, so muss die Datenbanktabelle gelöscht
  (bzw. umbenannt und als Backup gespeichert) werden.
###Aufbau der Tabellen
- Der Eintrag mit dem Index 0 enthält die Produkt-Informationen des Sensors:
	- Marke
	- Modellbezeichnung 
	- Firmwareversion
	- Erstinbetriebnamezeitpunkt
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
	
	~**David** MAC Adresse als ID ist perfekt, hatte ich gar nicht dran gedacht!
	
	&nbsp;~**Jonathan** eigentlich ist geplant, das das Identifikationattribut dann auch im Tabellenname als "<Sensor-ID>" auftaucht.
	Deswegen stellt sich hier noch die Frage, ob dafuer die MAC-Adresse verwendet werden kann, oder ob hier ein aus der MAC_Adresse
	künstlich generierter Schlüssel verwendet werden muss (Doppelpunkte im Tabellennamen sind wahrscheinlich eher schlecht ...?)
	
	&nbsp;~**David** Könnte man den Eintrag 1+2 auch zusammenlegen oder warum würdest du das trennen? Beide Daten kann es ja eigentlich nur einmal geben
	
	&nbsp;~**Jonathan** Hier hab ich versucht gezielt konfigurierbare Werte von einmal initierten und nicht mehr (oder seltenst) änderbaren Werten zu trennen...
	
	&nbsp;~**David** Ggf. könnte man in die Einträge ab Index 2 auch einen Akkustand einbauen, wenn der Sensor später mit Baterien etc. betrieben wird (Würde ich gerne umsetzten, kann aber noch nicht sagen wann)
    
    &nbsp;~**Jonathan** Gute Idee, würde ich aber in der ersten Variante mal außen vorlassen. Dürfte aber gut möglich sein, das zu einem späteren Zeitpunkt noch zu ergänzen.
    
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