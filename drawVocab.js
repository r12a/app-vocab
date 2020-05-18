var settings = {
	testDirection: 'localAtTop',
	revealAnswer: 'phased',
	counter: -1,
	thereAreNotes: false,
	answered: true
	}
var wordList = []
var lineList

var _counter = -1 // points to current record in wordList
var _testDirection = 'toLocal'  // toLocal is Foreign to Local; toForeign is Local to Foreign
var _foreignText = 0
var _localText = 1
var _transcription = 2
var _notes = 3
var _test = _localText // this and the next determine whether foreign to local...
var _answer = _foreignText; // or local to foreign testing
var _revealAnswer = 'always'; 
// if always, answer is revealed at same time as advance
// if phased, answer is revealed by second click
// if never, answer is never revealed
var answered = true
var _showTranscription = true
var _thereAreNotes = false
var debug = false


var _fontFamily = ''
var _fontSize = ''
var _direction = 'ltr'





function actionRoutine ( context, location ) {
	switch (context) {
	case 'localAtTop':	 
			document.getElementById('displayArea').style.flexDirection = 'column'
			document.getElementById('local').style.minHeight = '20vh'
			document.getElementById('foreign').style.height = 'unset'
			settings.testDirection = 'localAtTop'
			//_test = 0
			//_answer = 2
			settings.counter--
			answered=true
			gotoNext()
			break;
	case 'foreignAtTop':
			document.getElementById('displayArea').style.flexDirection = 'column-reverse'
			document.getElementById('local').style.height = 'unset'
			document.getElementById('foreign').style.minHeight = '20vh'
			settings.testDirection = 'foreignAtTop'
			//_test = 0
			//_answer = 2
			settings.counter--
			answered=true
			gotoNext()
			break;
	case 'toReview':
			settings.revealAnswer = 'review'
			settings.counter--
			settings.answered=true
			gotoNext()
			break
	case 'toPhased':	 
			settings.revealAnswer = 'phased'
			settings.counter--
			settings.answered=true
			document.getElementById('foreign').textContent = ''
			document.getElementById('local').textContent = ''
			document.getElementById('transcrip').textContent = ''
			gotoNext()
			break
	case 'toQuick':	 
			settings.revealAnswer = 'quick'
			settings.counter--
			settings.answered=true
			if (settings.testDirection === 'localAtTop') document.getElementById('foreign').textContent = ''
			else document.getElementById('local').textContent = ''
			document.getElementById('transcrip').textContent = ''
			gotoNext()
			break
	case 'showTransc':	 
			_showTranscription = true;
			document.getElementById('transcrip').style.display = 'block';
			break;
	case 'hideTransc':	 
			_showTranscription = false;
			document.getElementById('transcrip').style.display = 'none';
			break;
	case 'shuffle':	 
			shuffle()
			break
	case 'retest':	 
			reTest()
			break;
	case 'goBack': 
			if (settings.counter > 0) {
			settings.counter = settings.counter-2
			answered=true
			gotoNext()
			}
			break
	case 'goForward': 
			gotoNext()
			break
	case 'restart': 
			settings.counter = -1
			answered=true
			gotoNext()
			break



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



function OLDgotoNext () {
	if (_revealAnswer == 'always') { _counter++; testNextItem('visible'); answered=true; } 
	if (_revealAnswer == 'never') { _counter++; testNextItem('hidden'); answered=true; } 
	if (_revealAnswer == 'phased') {  
		if (answered) { _counter++; testNextItem('hidden'); answered=false; }
		else { revealAnswer(); answered=true; }
		}
	}



function gotoNext () {
	if (wordList.length === 0) { 
		alert('Load some data using the "Load vocab" control.')
		return
		}
	if (settings.counter >= wordList.length-1) settings.counter = 0
	
	if (settings.revealAnswer === 'review') { 
		settings.counter++
		showItem('review')
		answered=true
		} 
	else if (settings.revealAnswer === 'quick') { 
		settings.counter++
		showItem('quick')
		answered=true
		} 
	else if (settings.revealAnswer === 'phased') {  
		if (answered) { 
			settings.counter++
			showItem('phased')
			answered=false
			}
		else {
			showItem('phased')
			answered=true
			}
		}
	}



function showItem (type) {
	if (type === 'review') {
		document.getElementById('foreign').textContent = wordList[settings.counter][_foreignText]
		document.getElementById('local').textContent = wordList[settings.counter][_localText]
		document.getElementById('transcrip').textContent = wordList[settings.counter][_transcription]
		}
		
	if (type === 'quick') {
		if (settings.testDirection === 'localAtTop') {
			document.getElementById('local').textContent = wordList[settings.counter][_localText]
			document.getElementById('foreign').textContent = ''
			}
		else {
			document.getElementById('foreign').textContent = wordList[settings.counter][_foreignText]
			document.getElementById('local').textContent = ''
			}
		}
		
	
	if (type == 'phased') {
		console.log('answered',settings.answered)
		console.log('testDirection',settings.testDirection)
		if (settings.testDirection === 'localAtTop') {
			if (settings.answered) {
				document.getElementById('local').textContent = wordList[settings.counter][_localText]
				document.getElementById('foreign').textContent = ''
				document.getElementById('transcrip').textContent = ''
				settings.answered = false
				}
			else {
				document.getElementById('foreign').textContent = wordList[settings.counter][_foreignText]
				document.getElementById('transcrip').textContent = wordList[settings.counter][_transcription]
				settings.answered = true
				}
			}
		else {
			if (settings.answered) {
				document.getElementById('foreign').textContent = wordList[settings.counter][_foreignText]
				document.getElementById('local').textContent = ''
				document.getElementById('transcrip').textContent = ''
				settings.answered = false
				}
			else {
				document.getElementById('local').textContent = wordList[settings.counter][_localText]
				document.getElementById('transcrip').textContent = wordList[settings.counter][_transcription]
				settings.answered = true
				}
			}
		}
	}	




function shuffle () {
	for (var i=0; i < wordList.length-1; i++) {
		var j = Math.floor(Math.random() * (wordList.length-1) )
		var tempItem = wordList[i]
		wordList[i] = wordList[j]
		wordList[j] = tempItem
		}
	settings.counter = -1
	
	printAll()
	}




function reTest () {
	if (settings.counter == -1) {return}
	wordList[wordList.length] = wordList[wordList.length-1]
	wordList[wordList.length-2] = wordList[settings.counter]
	thisItem = wordList.splice(settings.counter, 1)
	
	settings.counter--
	settings.answered = true
	printAll()
	alert('\u{2066}'+thisItem+'\u{2069} was moved to end of the list.')
	}






function printAll () {
	out = ''
	for (var i=0;i<wordList.length-1;i++) {
		out += '<tr>'
		out += '<td dir="'+_direction+'" style="font-family:'+_fontFamily+'; font-size:'+_fontSize+'" style="font-family:\'Noto Sans\'; font-size:14px">'+wordList[i][_foreignText]+'</td>'
		out += '<td>'+wordList[i][_localText]+'</td>'
		out += '<td class="trans_column">'+wordList[i][_transcription]+'</td>'
		if (settings.thereAreNotes) {
			if (wordList[i][_notes] == null) out += '<td></td>'
			else out += '<td>'+wordList[i][_notes]+'</td>'
			}
		out += '</tr>\n'
		}
	
	document.getElementById('printout').innerHTML = out
	}







function switchTabTo (tab) {
	tabs = document.getElementById('tabs').querySelectorAll('h2')
	for (let i=0;i<tabs.length;i++) {
		tabs[i].style.color = '#ccc'
		var area = tabs[i].id+'_area'
		document.getElementById(area).style.display = 'none'
		}
	document.getElementById(tab).style.color = '#a52a2a'
	document.getElementById(tab+"_area").style.display = 'block'
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
       else if (evt.key==='ArrowRight') actionRoutine( 'goForward' )
       else if (evt.key==='ArrowDown') actionRoutine( 'retest' )
       else if (evt.key==='ArrowUp') actionRoutine( 'restart' )
	   }
	}
