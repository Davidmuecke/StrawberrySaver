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
