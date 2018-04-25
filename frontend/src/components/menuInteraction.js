/*Javascript Funktionen um Unterpunkte im Menu anzeigen zu lassen bzw. auszublenden*/
/*Autor: Rahel Illi*/
/*Date: 22.03.2018*/

function close(element)
{
    var content1 = element.parentNode;
    var content = content1.parentNode;
    for(var i=0;i<content.childNodes.length;i++)
    {
        var child = content.childNodes[i];
        if(child.tagName == 'LI' )
        {
            if(child.className == "menuunterpunkt_pflanze" && element.id != "pflanze")
            {
                child.className  = 'menuunterpunkt_pflanze_hide'
            }
            else if(child.className == "menuunterpunkt_sensor" && element.id != "sensor")
            {
                child.className  = 'menuunterpunkt_sensor_hide'
            }
            else if(child.className == "menuunterpunkt_nutzer" && element.id != "nutzer")
            {
                child.className  = 'menuunterpunkt_nutzer_hide'
            }
            else
            {
                /*in diesem Fall handelt es sich um einen anderen Unterpunkt mit dem NICHTS passieren soll*/
            }
        }
        else
        {
            /*in diesem Fall handelt es sich um einen anderen Unterpunkt mit dem NICHTS passieren soll*/
        }


    }
}

function keinMenu(element) {
    close(element);
}

function pflanzeMenu(element)
{
    close(element);
    var hilfscontent = element.parentNode;
    var content = hilfscontent.parentNode;
    for(var i=0;i<content.childNodes.length;i++)
    {
        var child = content.childNodes[i];
        if(child.tagName == 'LI')
        {

            if(child.className  == 'menuunterpunkt_pflanze_hide')
            {
                child.className = 'menuunterpunkt_pflanze';
            }
            else if(child.className == 'menuunterpunkt_pflanze')
            {
                child.className  = 'menuunterpunkt_pflanze_hide'
            }
            else
            {
                /*in diesem Fall handelt es sich um einen anderen Unterpunkt mit dem NICHTS passieren soll*/
            }

        }
    }
}


function sensorMenu(element)
{
    close(element);
    var hilfscontent = element.parentNode;
    var content = hilfscontent.parentNode;
    for(var i=0;i<content.childNodes.length;i++)
    {
        var child = content.childNodes[i];
        if(child.tagName == 'LI')
        {

            if(child.className  == 'menuunterpunkt_sensor_hide')
            {
                child.className = 'menuunterpunkt_sensor';
            }
            else if(child.className == 'menuunterpunkt_sensor')
            {
                child.className  = 'menuunterpunkt_sensor_hide'
            }
            else
            {
                /*in diesem Fall handelt es sich um einen anderen Unterpunkt mit dem NICHTS passieren soll*/
            }

        }
    }
}


function nutzerMenu(element)
{
    close(element);
    var hilfscontent = element.parentNode;
    var content = hilfscontent.parentNode;
    for(var i=0;i<content.childNodes.length;i++)
    {
        var child = content.childNodes[i];
        if(child.tagName == 'LI')
        {

            if(child.className  == 'menuunterpunkt_nutzer_hide')
            {
                child.className = 'menuunterpunkt_nutzer';
            }
            else if(child.className == 'menuunterpunkt_nutzer')
            {
                child.className  = 'menuunterpunkt_nutzer_hide'
            }
            else
            {
                /*in diesem Fall handelt es sich um einen anderen Unterpunkt mit dem NICHTS passieren soll*/
            }

        }
    }
}


/*Funktion für Responsive Menu*/
/* Toggle between adding and removing the "responsive" class to topnav when the user clicks on the icon */
function responsiveMenu() {
    var x = document.getElementById("myLeftnav");
    if (x.className === "leftnav") {
        x.className += " responsive";
    } else {
        x.className = "leftnav";
    }
}

/*Funktion für Responsive Menu - Test*/
function responsiveMenu2() {
    var x = document.getElementById("myLeftnav");
    if (x.style.display == 'none') {
        x.style.display = 'sticky'
    }
    if (x.className === "leftnav") {
        x.className += " responsive";
    } else {
        x.className = "leftnav";
    }
}