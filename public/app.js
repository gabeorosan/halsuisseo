const db = firebase.firestore()
const questionContainer = document.getElementById('question-container')
const optionsContainer = document.getElementById('options-container')
const langDropdown = document.getElementById('lang')
//document.getElementById('input-file').addEventListener('change', getFile)
var answer = null
var questionType = 'freeResponse'
var lang = 'japanese'
function updateLang(){
    lang = langDropdown.value
}
function radioClick(rad){
    questionType = rad.value
}
function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function populate(){
    if (questionType != 'multipleChoice'){
        removeAllChildNodes(questionContainer)
        removeAllChildNodes(optionsContainer)
        getQuestion().then(q => {
            console.log(q.question)
            answer = q.answer
            let question = document.createElement('P')
            question.innerHTML = q.question
            questionContainer.appendChild(question)
        })
    }
    if (questionType == 'YN'){
        let yesBtn = document.createElement('BUTTON')
        yesBtn.innerHTML = 'はい'
        yesBtn.addEventListener('click', (e, a = 1) => {
            console.log(a == answer)
        })
        let noBtn = document.createElement('BUTTON')
        noBtn.innerHTML = 'いいえ'
        noBtn.addEventListener('click', (e, a = 0) => {
            console.log(a == answer)
        })
        optionsContainer.appendChild(yesBtn)    
        optionsContainer.appendChild(noBtn)    
    } else {
        //add a button that shows the answer
    }
}


function getQuestion(){
    if (questionType != 'multipleChoice'){

        var docRef = db.collection("questions").doc(lang).collection(questionType).doc('' + Math.floor(Math.random()*50))
    } else {
        //multiple choice    
    }
    var getOptions = {
        source: 'default'
    }

    let result = docRef.get(getOptions).then((doc) => {
        console.log("Document data:", doc.data());
        return doc.data()
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
    return result
}
/*
function getFile(event) {
	const input = event.target
  if ('files' in input && input.files.length > 0) {
      console.log(input.files[0])
	  placeFileContent(input.files[0])
  }
}

function placeFileContent(file) {
	readFileContent(file).then(content => {
      questions = (content.split(';')).slice(0,-1)
      free_response = []
      yes_no = []
      multiple_choice = []
      
     //for (let i = 0; i < questions.length; i+=3){
        multiple_choice.push(questions[i])
        multiple_choice.push(questions[i+2])
        }

      for (let i = 0; i < 200; i+=2){
        db.collection("questions").doc('korean').collection('vocab').doc('' + i / 2).set({
        word: multiple_choice[i],
        meaning: multiple_choice[i+1]
        })
        .then(() => {
            console.log("Document successfully written!");
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });
      }
      
      for (let i = 0; i < questions.length; i+=3){
        if (questions[i+2].includes('free')){
            free_response.push(questions[i])
            free_response.push(questions[i+1])
        } else {
            yes_no.push(questions[i])
            yes_no.push(questions[i+1])
        }
      }
      for (let i = 0; i < free_response.length; i+=2){
        db.collection("questions").doc('korean').collection('freeResponse').doc('' + i / 2).set({
        question: free_response[i],
        answer: free_response[i+1]
        })
        .then(() => {
            console.log("Document successfully written!");
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });
      }
      
      for (let i = 0; i < yes_no.length; i+=2){
        db.collection("questions").doc('korean').collection('YN').doc('' + i / 2).set({
        question: yes_no[i],
        answer: yes_no[i+1].includes('YES') ? 1 : 0
        })
        .then(() => {
            console.log("Document successfully written!");
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        })
        }
    
  }).catch(error => console.log(error))
  
}

function readFileContent(file) {
	const reader = new FileReader()
  return new Promise((resolve, reject) => {
    reader.onload = event => resolve(event.target.result)
    reader.onerror = error => reject(error)
    reader.readAsText(file)
  })
}
*/
