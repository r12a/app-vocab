var _counter = -1; // points to current record in wordList
var _testDirection = 'toLocal'  // toLocal is Foreign to Local; toForeign is Local to Foreign
var _test = 0; // this and the next determine whether foreign to local...
var _answer = 2; // or local to foreign testing
var _revealAnswer = 'phased'; 
// if always, answer is revealed at same time as advance
// if phased, answer is revealed by second click
// if never, answer is never revealed
var answered = true
var _showTranscription = true
var debug = false


var currentForeign = 'ह語'   // this is used when changing style
var currentEnglish = 'Language Review';
currentTranscrn = '';
var currentData = 'data/vocabList.js';
var cStyle = 'style/arabic.css';
var vertical = true;
var horizontal = false;
var changeData = true;
var dontChangeData = false;


var _fontFamily = ''
var _fontSize = ''
var _direction = 'ltr'


//don't know what this function is for
function initialiseWordList ( startL, endL ) { 
alert( '>'+startL + '<>' + endL+'<' );
	var ptr = 0;
	wordList.length = 0;
	if ( startL == 0 ) { alert('empty start');
		for (i=0; i<vocabStore.length; i++) {
			wordList[i] = vocabStore[i];
			}
		}
	else if ( startL > endL ) {
		alert( 'The range of lessons was incorrectly specified.  The end is less than the start.' );
		}
	else {	endL++;
		for (i=0; i<vocabStore.length; i++) {
			currentRecord = vocabStore[i].split('$');
			if (currentRecord[4] >= startL && currentRecord[4] < endL) {
				wordList[ptr] = vocabStore[i]; alert( currentRecord[4] );
				ptr++;
				}
			}
		}
	}

function actionRoutine ( context, location ) {
	switch (context) {
	case 'clickForeign':
			gotoNext();
			break;
	case 'toLocal':	 
			document.getElementById('displayArea').style.flexDirection = 'column'
			_testDirection = 'toLocal'
			_test = 0
			_answer = 2
			_counter--; answered=true; gotoNext();
			break;
	case 'toForeign':	
			document.getElementById('displayArea').style.flexDirection = 'column-reverse'
			_testDirection = 'toForeign'
			_test = 0;
			_answer = 2;
			_counter--; answered=true; gotoNext();
			break;
	case 'toReview':	 
			_revealAnswer = 'always';
			_counter--; answered=true; gotoNext();
			break;
	case 'toPhased':	 
			_revealAnswer = 'phased';
			_counter--; answered=true; gotoNext();
			break;
	case 'toQuick':	 
			_revealAnswer = 'never';
			_counter--; answered=true; gotoNext();
			break;
	case 'showTransc':	 
			_showTranscription = true;
			document.getElementById('transcrip').style.display = 'block';
			break;
	case 'hideTransc':	 
			_showTranscription = false;
			document.getElementById('transcrip').style.display = 'none';
			break;
	case 'shuffle':	 
			shuffle();
			break;
	case 'retest':	 
			reTest();
			break;
	case 'goBack': 
			if (_counter > 0) {_counter = _counter-2; answered=true; gotoNext(); }
			break;
	case 'restart': 
			_counter = -1; answered=true; gotoNext();
			break;



	case 'forwardButton': if (_counter < wordList.length) {_counter++; answered=true; nextReviewItem(); }
			break;
	case 'goto': 	_counter = location; answered=true; nextReviewItem();
			break;
	case 'print':	makePrintableList();
			break;
	default:		alert( 'Call to actionRoutine from unknown source.' );
			break;
	}
	}



function gotoNext () {
	if (_revealAnswer == 'always') { _counter++; testNextItem('visible'); answered=true; } 
	if (_revealAnswer == 'never') { _counter++; testNextItem('hidden'); answered=true; } 
	if (_revealAnswer == 'phased') {  
		if (answered) { _counter++; testNextItem('hidden'); answered=false; }
		else { revealAnswer(); answered=true; }
		}
	}


function testNextItem (answerVisibility) {
	if (wordList.length == 0) { alert('Load some data using the input box below "Data location".'); return }
	if (_counter >= wordList.length) { _counter = 0; }
	cRecord = wordList[_counter].split('/');
	var containerElement = document.getElementById('foreign');
	var newText = document.createTextNode( cRecord[_test] ); 
	var removedNode = containerElement.replaceChild( newText, containerElement.firstChild );
	containerElement = document.getElementById('local');
	newText = document.createTextNode( cRecord[_answer] );
	removedNode = containerElement.replaceChild( newText, containerElement.firstChild );
	containerElement = document.getElementById('transcrip'); 
	newText = document.createTextNode( cRecord[1] ); 
	removedNode = containerElement.replaceChild( newText, containerElement.firstChild ); 
	
	if (answerVisibility == 'hidden') {
		document.getElementById('local').style.color = '#fff';
		document.getElementById('transcrip').style.color = '#fff';
		}
	else {
		document.getElementById('local').style.color = '#000';
		document.getElementById('transcrip').style.color = '#000';
		}
	}	


function testNextItem (answerVisibility) {
	if (wordList.length == 0) { alert('Load some data using the input box below "Data location".'); return }
	if (_counter >= wordList.length) { _counter = 0; }
	cRecord = wordList[_counter].split('|')
	
	document.getElementById('foreign').textContent = cRecord[0]
	document.getElementById('transcrip').textContent = cRecord[1]
	document.getElementById('local').textContent = cRecord[2]
		
	/*
	var containerElement = document.getElementById('foreign');
	var newText = document.createTextNode( cRecord[_test] ); 
	var removedNode = containerElement.replaceChild( newText, containerElement.firstChild );
	containerElement = document.getElementById('local');
	newText = document.createTextNode( cRecord[_answer] );
	removedNode = containerElement.replaceChild( newText, containerElement.firstChild );
	containerElement = document.getElementById('transcrip'); 
	newText = document.createTextNode( cRecord[1] ); 
	removedNode = containerElement.replaceChild( newText, containerElement.firstChild ); 
	*/
	
	if (answerVisibility == 'hidden') {
		if (_testDirection === 'toForeign') {
			document.getElementById('local').style.color = '#000'
			document.getElementById('foreign').style.color = '#fff'
			}
		else {
			document.getElementById('local').style.color = '#fff'
			document.getElementById('foreign').style.color = '#000'
			}
		document.getElementById('transcrip').style.color = '#fff'
		}
	else {
		document.getElementById('local').style.color = '#000';
		document.getElementById('transcrip').style.color = '#000';
		}
	}	


function revealAnswer () {
		document.getElementById('local').style.color = '#000';
		document.getElementById('transcrip').style.color = '#000';
		document.getElementById('foreign').style.color = '#000';
	}			


function shuffle () {
	for (var i=0; i < wordList.length-1; i++) {
		var j = Math.floor(Math.random() * (wordList.length-1) );
		var tempItem = wordList[i];
		wordList[i] = wordList[j];
		wordList[j] = tempItem;
		}
	_counter = -1;
	}

function reTest () {
	if (_counter == -1) {return};
	wordList[wordList.length] = wordList[wordList.length-1];
	wordList[wordList.length-2] = wordList[_counter];
	//wordList.push(wordList[_counter])
	thisItem = wordList.splice(_counter, 1)
	alert('\u{2066}'+thisItem+'\u{2069} was moved to end of the list.')
	}






function printAll () {
	out = ''
	for (var i=0;i<wordList.length;i++) {
		wordArray = wordList[i].split('|')
		out += '<tr><td dir="'+_direction+'" style="font-family:'+_fontFamily+'; font-size:'+_fontSize+'"">'+wordArray[0]+'</td><td style="font-family:\'Noto Sans\'; font-size:14px">'+wordArray[1]+'</td><td>'+wordArray[2]+'</td></tr>\n'
		}
	
	document.getElementById('printout').innerHTML = out
	}







// KEY EVENT INITIALISATION

// bind events to text box
function setKeyboardEvents( ) {
    addEvent(document.querySelector('body'), "keydown", showDown, false)
    //addEvent(document.getElementById('output'), "keyup", showUp, false)
	}
	
// do event binding now that elements exist
addOnLoadEvent(setKeyboardEvents)


function addOnLoadEvent(func) {
    if (window.addEventListener || window.attachEvent) {
        addEvent(window,"load", func, false)
    } else {
        var oldQueue = (window.onload) ? window.onload : function( ) {}
        window.onload = function( ) {
            oldQueue( )
            func( )
        }
    }
}


function addEvent(elem, evtType, func, capture) {
   capture = (capture) ? capture : false;
   if (elem.addEventListener) {
      elem.addEventListener(evtType, func, capture);
   } else if (elem.attachEvent) {
      elem.attachEvent("on" + evtType, func);
   } else {
      // for IE/Mac, NN4, and older
      elem["on" + evtType] = func;
   }
}



// decipher key down codes
function showDown (evt) {
	evt = (evt) ? evt : ((event) ? event : null)
	if (evt) {
        if (debug) console.log(evt.key, evt.code)
		
		// capture arrow keys
       if (evt.key==='ArrowLeft') actionRoutine( 'goBack' )
       else if (evt.key==='ArrowRight') actionRoutine( 'clickForeign' )
       else if (evt.key==='ArrowDown') actionRoutine( 'retest' )
       else if (evt.key==='ArrowUp') actionRoutine( 'restart' )
	   }
	}





