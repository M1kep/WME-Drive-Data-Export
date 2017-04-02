/* global Waze, W */

// ==UserScript==
// @name WME DrivesData
// @namespace http://tampermonkey.net/
// @version 0.1.6a
// @description Export Waze Drive Data
// @include /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/.*$/
// @grant none
// ==/UserScript==

(function() {
    
    //Variable used to store the total number of drives, used when querying the server for drive data later.
    var wDDTotalDrives = -1;
    var wDDDrivesDataArr = null;
    var wDDIsLoaded = false;
    var wDDIsCalculated = false;
    
    function bootStrap() {
        if(W && W.loginManager && W.loginManager.isLoggedIn()) {
            initialize();
        } else {
            setTimeout(bootStrap, 500);
        }
    }
    
    bootStrap();
    
    function initialize()
    {
        $.getJSON("https://www.waze.com/Descartes/app/Archive/List?minDistance=1000&count=1", function(result){
            wDDTotalDrives = result.archives.totalSessions;
            wDDDrivesDataArr = new Array(wDDTotalDrives);
        });
        
        $('<div>').css({paddingTop:'6px'}).append(
            $('<h3>').text('Drive Data Export'),
            $('<p>').text('Please click the buttons in order to export data.'),
            $('<form>').append(
                $('<ol>').append(
                    $('<li>').append(
                        $('<input>', {type:'button',value:'Load Data'}).click(function(){
                            wDDIsLoaded = false;
                            wDDLoadData(0);
                        })
                    ),
                    $('<li>').append(
                        $('<input>', {type:'button',value:'Convert Data'}).click(function(){
                            wDDIsCalculated = false;
                            wDDCalculateData();
                        })
                    ),
                    $('<li>').append(
                        $('<input>', {type:'button',value:'Export Data'}).click(wDDExportDrives())
                    )
                )
            )
        ).appendTo('#sidepanel-drives');

//        var wDDDiv = document.createElement('div');
//        wDDDiv.style.paddingTop = '6px';
//        $('#sidepanel-drives').append(wDDDiv);
//        
//        var wDDTitle = document.createElement('h3');
//        wDDTitle.innerHTML = 'Drive Data Export';
//        wDDDiv.appendChild(wDDTitle);
//        
//        var wDDDesc = document.createElement('p');
//        wDDDesc.innerHTML = 'Click the export button below to export all drive data.';
//        wDDDiv.appendChild(wDDDesc);
//        
//        var wDDForm = document.createElement('form');
//        wDDDiv.appendChild(wDDForm);
//        
//        var wDDSteps = document.createElement('ol');
//        wDDForm.appendChild(wDDSteps);
//        
//        //Create List Item for wDDSteps Ordered List
//        var wDDStepOneLi = document.createElement('li');
//        //Create the button to be added to the li
//        var wDDStepOneButton = document.createElement('input');
//        wDDStepOneButton.type = 'button';
//        wDDStepOneButton.value = 'Load Data';
//        wDDStepOneButton.onclick = function(){
//            wDDIsLoaded = false;
//            wDDLoadData(0);
//        };    
//        //Set the button to the li
//        wDDStepOneLi.appendChild(wDDStepOneButton);
//        //Add the li to the ol
//        wDDSteps.appendChild(wDDStepOneLi);
//        
//        var wDDStepTwoLi = document.createElement('li');
//        var wDDStepTwoButton = document.createElement('input');
//        wDDStepTwoButton.type = 'button';
//        wDDStepTwoButton.value = 'Convert Data';
//        wDDStepTwoButton.onclick = function(){
//            wDDIsCalculated = false;
//            wDDCalculateData();
//        };
//        wDDStepTwoLi.appendChild(wDDStepTwoButton);
//        wDDSteps.appendChild(wDDStepTwoLi);
//        
//        
//        var wDDLoadDataBtn = document.createElement('input');
//
//        
//        var wDDExportBtn = document.createElement('input');
//        wDDExportBtn.type = 'button';
//        wDDExportBtn.value = 'Export';
//        wDDExportBtn.onclick = wDDExportDrives;
//        wDDForm.appendChild(wDDExportBtn);
    }
    
    function wDDLoadData(offset)
    {
        $.getJSON("https://www.waze.com/Descartes/app/Archive/List?minDistance=1000&offset=" + offset +  "&count=50", function(result){
            $.each(result.archives.objects, function(i, field){
                wDDDrivesDataArr[i + offset] = new drive(field.startTime, field.endTime, field.totalRoadMeters);
            });
            if(offset + 50 >= wDDTotalDrives) {
                wDDIsLoaded = true;
                alert("Drive Data is Loaded!");
                console.log("Completed!");
                console.log(wDDDrivesDataArr);
            } else {
                wDDLoadData(offset + 50);
            }
        });
    }
    
    function wDDCalculateData()
    {
        //Do calculation crap
        wDDIsCalculated = true;
        alert("Data Calculated!\n" + wDDDrivesDataArr[50]);
    }
    
    function wDDExportDrives()
    {
        
    }
    
    function drive(startTime, endTime, distance) {
        this.startTime = startTime;
        this.endTime = endTime;
        this.distance = distance;
    }
    
    drive.prototype.toString = function() {
        return "\"" + this.startTime + "\",\"" + this.endTime + "\",\"" + this.distance + "\"";
    };
})();