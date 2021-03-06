/*
pluralizer.js v1.1 - Add-on tool for JavaScript that returns plural form of English words
Created by Ron Royston, https://rack.pub
https://github.com/rhroyston/pluralizer-js
License: MIT
*/



//Revealing Module Pattern (Public & Private) w Public Namespace 'pluralizer'
var pluralizer = (function() {
    var pub = {};
    var r = 'pluralizer.js error';
    var expectedArrayOfArrays = {name:r, message:"Invalid argument.  Expected array of arrays"};
    var expectedString = {name:r, message:"Invalid argument.  Expected string"};
    //creates Array.isArray() if it's not natively available
    if (!Array.isArray) {
        Array.isArray = function(arg) {
            return Object.prototype.toString.call(arg) === '[object Array]';
        };
    }
    //creates .endsWith() if it's not natively available
    if (!String.prototype.endsWith) {
        String.prototype.endsWith = function(searchString, position) {
            var subjectString = this.toString();
            if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
            position = subjectString.length;
            }
            position -= searchString.length;
            var lastIndex = subjectString.indexOf(searchString, position);
            return lastIndex !== -1 && lastIndex === position;
        };
    }
    var irregular = [['child','children'],
        ['die','dice'],
        ['foot','feet'],
        ['goose','geese'],
        ['louse','lice'],
        ['man','men'],
        ['mouse','mice'],
        ['ox','oxen'],
        ['person','people'],
        ['that','those'],
        ['this','these'],
        ['tooth','teeth'],
        ['woman','women']];
    var xExceptions = [['axis','axes'], ['ox','oxen']];
    var fExceptions = [['belief','beliefs'],
        ['chef','chefs'],
        ['chief','chiefs'],
        ['dwarf','dwarfs'],
        ['grief','griefs'],
        ['gulf','gulfs'],
        ['handkerchief','handkerchiefs'],
        ['kerchief','kerchiefs'],
        ['mischief','mischiefs'],
        ['muff','muffs'],
        ['oaf','oafs'],
        ['proof','proofs'],
        ['roof','roofs'],
        ['safe','safes'],
        ['turf','turfs']];
    var feExceptions = [[' safe','safes']];
    var oExceptions = [['albino','albinos'],
        ['armadillo','armadillos'],
        ['auto','autos'],
        ['cameo','cameos'],
        ['cello','cellos'],
        ['combo','combos'],
        ['duo','duos'],
        ['ego','egos'],
        ['folio','folios'],
        ['halo','halos'],
        ['inferno','infernos'],
        ['lasso','lassos'],
        ['memento','mementos'],
        ['memo','memos'],
        ['piano','pianos'],
        ['photo','photos'],
        ['portfolio','portfolios'],
        ['pro','pros'],
        ['silo','silos'],
        ['solo','solos'],
        ['stereo','stereos'],
        ['studio','studios'],
        ['taco','tacos'],
        ['tattoo','tattoos'],
        ['tuxedo','tuxedos'],
        ['typo','typos'],
        ['veto','vetoes'],
        ['video','videos'],
        ['yo','yos'],
        ['zoo','zoos']];
    var usExceptions = [['abacus','abacuses'],
        ['crocus','crocuses'],
        ['genus','genera'],
        ['octopus','octopuses'],
        ['rhombus','rhombuses'],
        ['walrus','walruses']];
    var umExceptions = [['album','albums'], ['stadium','stadiums']];
    var aExceptions = [['agenda','agendas'],	
        ['alfalfa','alfalfas'],	
        ['aurora','auroras'],	
        ['banana','bananas'],	
        ['barracuda','barracudas'],	
        ['cornea','corneas'],	
        ['nova','novas'],	
        ['phobia','phobias']];
    var onExceptions = [['balloon','balloons'], ['carton','cartons']];
    var exExceptions = [['annex','annexes'], 
        ['complex','complexes'], 
        ['duplex','duplexes'], 
        ['hex','hexes'], 
        ['index','indices']];
    var unchanging = ['advice',
        'aircraft',
        'bison',
        'corn',
        'deer',
        'equipment',
        'evidence',
        'fish',
        'gold',
        'information',
        'jewelry',
        'kin',
        'legislation',
        'luck',
        'luggage',
        'moose',
        'music',
        'offspring',
        'sheep',
        'silver',
        'swine',
        'trousers',
        'trout',
        'wheat'];
    var onlyPlurals = ['barracks',
        'bellows',
        'cattle',
        'congratulations',
        'deer',
        'dregs',
        'eyeglasses',
        'gallows',
        'headquarters',
        'mathematics',
        'means',
        'measles',
        'mumps',
        'news',
        'oats',
        'pants',
        'pliers',
        'pajamas',
        'scissors',
        'series',
        'shears',
        'shorts',
        'species',
        'tongs',
        'tweezers',
        'vespers'];
    var doc = document;

    pub.help = "pluralizer.js returns 2 public methods - read and format.  pluralizer.read expects an array of arrays, each with quantity and item name, e.g. pluralizer.read([[2,'orange'],[3,'peach'],[5,'cherry']]) returns string '2 oranges, 3 peaches, and 5 cherries.'.  pluralizer.format expects an array with quantity and item name, e.g., pluralizer.format([3,'couch']) returns array '[3, 'couches']'"
    pub.read = function (arr) {
        if(isArrayOfArrays(arr)){
            var count = arr.length;
            var str = '';
            var temp = [];
            switch (count) {
                //if arr has 1 item is 1 apple (no and no commas)
                case 1:
                    temp[0] = pluralizer.format(arr[0]);
                    str = temp[0][0] + ' ' + temp[0][1];
                    break;
                //if arr has 2 items it's 1 apple and 2 oranges (no commas but an and)
                case 2:
                    temp[0] = pluralizer.format(arr[0]);
                    temp[1] = pluralizer.format(arr[1]);
                    str = temp[0][0] + ' ' + temp[0][1] + ' and ' + temp[1][0] + ' ' + temp[1][1];
                    break;
                //if arr has 3 items or more it's 1 apple, 2 oranges, and 3 cherries (the last item has an 'and ' put before it)
                default:
                    // for each item in array output format it and concatentate it to a string
                    var arrayLength = arr.length;
                    for (var i = 0; i < arrayLength; i++) {
                        temp = pluralizer.format(arr[i]);
                        //if this is 2nd last item append with ', and '
                        if (i === arrayLength - 2){
                            str += temp[0] + ' ' + temp[1] + ', and ';
                        }
                        //if this is last item append with '.'
                        else if (i === arrayLength - 1){
                            str += temp[0] + ' ' + temp[1] + '.';
                        }
                        else {
                            str += temp[0] + ' ' + temp[1] + ', ';
                        }
                    }
            }
            return str;
        } else {
            try {
                throw new Error('pluralizer.read had an issue processing argument ');
            }
            catch (e) {
                console.log(e.name + ': ' + e.message);
            }
        }
    };
    
    pub.run = function(str){
        if(typeof str === "string"){
            //Word ends in s, x, ch, z, or sh
            if (str.endsWith('s') || str.endsWith('x') || str.endsWith('ch') || str.endsWith('sh') || str.endsWith('z')){
                //look for exceptions first xExceptions
                for (var i = 0; i < xExceptions.length; i++) {
                    if(str === xExceptions[i][0]){
                        return xExceptions[i][1];
                    }
                }
                //str = str.substring(0, str.length - 1);
                str = str + 'es';
                return str;
            }
            // Ending in 'y'
            else if (str.endsWith('y')){
                var s = str.substring(0, str.length - 1);
                // preceded by a vowel
                if (s.endsWith('a') || s.endsWith('e') || s.endsWith('i') || s.endsWith('o') || s.endsWith('u')){
                    str = str + 's';
                    return str;
                } else {
                    //drop the y and add ies
                    str = s + 'ies';
                    return str;
                }
            }
            //Ends with 'ff' or 'ffe'
            else if (str.endsWith('ff') || str.endsWith('ffe')){
                str = str + 's';
                return str;
            }
            //Ends with 'f' (but not 'ff')
            else if (str.endsWith('f')){
                //look for exceptions first fExceptions
                for (var i = 0; i < fExceptions.length; i++) {
                    if(str === fExceptions[i][0]){
                        return fExceptions[i][1];
                    }
                }
                //Change the 'f' to 'ves'
                var s = str.substring(0, str.length - 1);
                str = s + 'ves';
                return str;
            }
            //Ends with 'fe' (but not ffe')
            else if (str.endsWith('fe')){
                //look for exceptions first feExceptions
                for (var i = 0; i < feExceptions.length; i++) {
                    if(str === feExceptions[i][0]){
                        return feExceptions[i][1];
                    }
                }
                //Change the 'fe' to 'ves'
                var s = str.substring(0, str.length - 2);
                str = s + 'ves';
                return str;
            }
            //Ends with 'o'
            else if (str.endsWith('o')){
                //look for exceptions first oExceptions
                for (var i = 0; i < oExceptions.length; i++) {
                    if(str === oExceptions[i][0]){
                        return oExceptions[i][1];
                    }
                }
                //Add 'es'
                str = s + 'es';
                return str;
            }
            //Ends with 'is'
            else if (str.endsWith('is')){
                //Change final 'is' to 'es'
                var s = str.substring(0, str.length - 2);
                str = s + 'es';
                return str;
            }
            //Ends with 'us'
            else if (str.endsWith('us')){
                //look for exceptions first oExceptions
                for (var i = 0; i < usExceptions.length; i++) {
                    if(str === usExceptions[i][0]){
                        return usExceptions[i][1];
                    }
                }
                //Change final 'us' to 'i'
                var s = str.substring(0, str.length - 2);
                str = s + 'i';
                return str;
            }
            //Ends with 'um'
            else if (str.endsWith('um')){
                //look for exceptions first oExceptions
                for (var i = 0; i < umExceptions.length; i++) {
                    if(str === umExceptions[i][0]){
                        return umExceptions[i][1];
                    }
                }
                //Change final 'um' to 'a'
                var s = str.substring(0, str.length - 2);
                str = s + 'a';
                return str;
            }  
            //Ends with 'a' but not 'ia'  
            else if (str.endsWith('a')){
                //not ending is 'ia'
                if (str.endsWith('ia')){
                    str = str + 's';
                    return str;
                }
                //look for exceptions first aExceptions
                for (var i = 0; i < aExceptions.length; i++) {
                    if(str === aExceptions[i][0]){
                        return aExceptions[i][1];
                    }
                }
                //Change final 'a' to 'ae'
                var s = str.substring(0, str.length - 2);
                str = s + 'a';
                return str;
            }                 
            //Ends with 'on'  Change final 'on' to 'a'
            else if (str.endsWith('on')){
                //look for exceptions first onExceptions
                for (var i = 0; i < onExceptions.length; i++) {
                    if(str === onExceptions[i][0]){
                        return onExceptions[i][1];
                    }
                }
                //Change final 'um' to 'a'
                var s = str.substring(0, str.length - 2);
                str = s + 'a';
                return str;
            }
            //Ends with 'ex'
            else if (str.endsWith('ex')){
                //look for exceptions first onExceptions
                for (var i = 0; i < exExceptions.length; i++) {
                    if(str === exExceptions[i][0]){
                        return exExceptions[i][1];
                    }
                }
                //Change final 'ex' to 'ices'
                var s = str.substring(0, str.length - 2);
                str = s + 'ices';
                return str;
            }
            else {
                //check unchanging
                for (var i = 0; i < unchanging.length; i++) {
                    if(str === unchanging[i]){
                        return str;
                    }
                }                    
                //check onlyPlurals
                for (var i = 0; i < onlyPlurals.length; i++) {
                    if(str === onlyPlurals[i]){
                        return str;
                    }
                }
                //check irregular
                for (var i = 0; i < irregular.length; i++) {
                    if(str === irregular[i][0]){
                        return irregular[i][1];
                    }
                }
                str = str + 's';
                return str;
            }
        } else {
            try {
                throw new Error('pluralizer.run had an issue processing argument ');
            }
            catch (e) {
                console.log(e.name + ': ' + e.message);
            }
        }        
    };
 
    pub.format = function (arr) {
        //if qty is greater than 1 we need to add s, es, or ies
        var qty = arr[0];
        var str = arr[1];
        if (qty > 1){
            //Word ends in s, x, ch, z, or sh
            if (str.endsWith('s') || str.endsWith('x') || str.endsWith('ch') || str.endsWith('sh') || str.endsWith('z')){
                //look for exceptions first xExceptions
                for (var i = 0; i < xExceptions.length; i++) {
                    if(str === xExceptions[i][0]){
                        return [qty,xExceptions[i][1]];
                    }
                }
                //str = str.substring(0, str.length - 1);
                str = str + 'es';
                return [qty,str];
            }
            // Ending in 'y'
            else if (str.endsWith('y')){
                var s = str.substring(0, str.length - 1);
                // preceded by a vowel
                if (s.endsWith('a') || s.endsWith('e') || s.endsWith('i') || s.endsWith('o') || s.endsWith('u')){
                    str = str + 's';
                    return [qty,str];
                } else {
                    //drop the y and add ies
                    str = s + 'ies';
                    return [qty,str];
                }
            }
            //Ends with 'ff' or 'ffe'
            else if (str.endsWith('ff') || str.endsWith('ffe')){
                str = str + 's';
                return [qty,str];
            }
            //Ends with 'f' (but not 'ff')
            else if (str.endsWith('f')){
                //look for exceptions first fExceptions
                for (var i = 0; i < fExceptions.length; i++) {
                    if(str === fExceptions[i][0]){
                        return [qty,fExceptions[i][1]];
                    }
                }
                //Change the 'f' to 'ves'
                var s = str.substring(0, str.length - 1);
                str = s + 'ves';
                return [qty,str];
            }
            //Ends with 'fe' (but not ffe')
            else if (str.endsWith('fe')){
                //look for exceptions first feExceptions
                for (var i = 0; i < feExceptions.length; i++) {
                    if(str === feExceptions[i][0]){
                        return [qty,feExceptions[i][1]];
                    }
                }
                //Change the 'fe' to 'ves'
                var s = str.substring(0, str.length - 2);
                str = s + 'ves';
                return [qty,str];
            }
            //Ends with 'o'
            else if (str.endsWith('o')){
                //look for exceptions first oExceptions
                for (var i = 0; i < oExceptions.length; i++) {
                    if(str === oExceptions[i][0]){
                        return [qty,oExceptions[i][1]];
                    }
                }
                //Add 'es'
                str = s + 'es';
                return [qty,str];
            }
            //Ends with 'is'
            else if (str.endsWith('is')){
                //Change final 'is' to 'es'
                var s = str.substring(0, str.length - 2);
                str = s + 'es';
                return [qty,str];
            }
            //Ends with 'us'
            else if (str.endsWith('us')){
                //look for exceptions first oExceptions
                for (var i = 0; i < usExceptions.length; i++) {
                    if(str === usExceptions[i][0]){
                        return [qty,usExceptions[i][1]];
                    }
                }
                //Change final 'us' to 'i'
                var s = str.substring(0, str.length - 2);
                str = s + 'i';
                return [qty,str];
            }
            //Ends with 'um'
            else if (str.endsWith('um')){
                //look for exceptions first oExceptions
                for (var i = 0; i < umExceptions.length; i++) {
                    if(str === umExceptions[i][0]){
                        return [qty,umExceptions[i][1]];
                    }
                }
                //Change final 'um' to 'a'
                var s = str.substring(0, str.length - 2);
                str = s + 'a';
                return [qty,str];
            }  
            //Ends with 'a' but not 'ia'  
            else if (str.endsWith('a')){
                //not ending is 'ia'
                if (str.endsWith('ia')){
                    str = str + 's';
                    return [qty,str];
                }
                //look for exceptions first aExceptions
                for (var i = 0; i < aExceptions.length; i++) {
                    if(str === aExceptions[i][0]){
                        return [qty,aExceptions[i][1]];
                    }
                }
                //Change final 'a' to 'ae'
                var s = str.substring(0, str.length - 2);
                str = s + 'a';
                return [qty,str];
            }                 
            //Ends with 'on'  Change final 'on' to 'a'
            else if (str.endsWith('on')){
                //look for exceptions first onExceptions
                for (var i = 0; i < onExceptions.length; i++) {
                    if(str === onExceptions[i][0]){
                        return [qty,onExceptions[i][1]];
                    }
                }
                //Change final 'um' to 'a'
                var s = str.substring(0, str.length - 2);
                str = s + 'a';
                return [qty,str];
            }
            //Ends with 'ex'
            else if (str.endsWith('ex')){
                //look for exceptions first onExceptions
                for (var i = 0; i < exExceptions.length; i++) {
                    if(str === exExceptions[i][0]){
                        return [qty,exExceptions[i][1]];
                    }
                }
                //Change final 'ex' to 'ices'
                var s = str.substring(0, str.length - 2);
                str = s + 'ices';
                return [qty,str];
            }
            else {
                //check unchanging
                for (var i = 0; i < unchanging.length; i++) {
                    if(str === unchanging[i]){
                        return [qty,str];
                    }
                }                    
                //check onlyPlurals
                for (var i = 0; i < onlyPlurals.length; i++) {
                    if(str === onlyPlurals[i]){
                        return [qty,str];
                    }
                }
                //check irregular
                for (var i = 0; i < irregular.length; i++) {
                    if(str === irregular[i][0]){
                        return [qty,irregular[i][1]];
                    }
                }
                str = str + 's';
                return [qty,str];
            }
        } else {
            return [qty,str];
        }
    }   
    function isArrayOfArrays(arr){
        if(Array.isArray(arr)){
            var result = true;
            for (var i = 0; i < arr.length; i++) {
                if(!Array.isArray(arr[i])){
                    result = false;
                }
            }
            if(result){
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
    //API
    return pub;
}());