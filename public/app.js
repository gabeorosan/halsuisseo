// Add a new document in collection "cities"
const db = firebase.firestore()
const questionContainer = document.getElementById('question-container')
const optionsContainer = document.getElementById('options-container')
var answer = null

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function populate(){
    removeAllChildNodes(questionContainer)
    removeAllChildNodes(optionsContainer)
    let index = Math.floor(Math.random() * 70)
    getQuestion(index).then(q => {
    console.log(q.question)
    answer = q.answer
    let question = document.createElement('P')
    question.innerHTML = q.question
    questionContainer.appendChild(question)

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
})
}


function getQuestion(index){
var docRef = db.collection("questions").doc("" + index);
var getOptions = {
    source: 'default'
};

let result = docRef.get(getOptions).then((doc) => {
    console.log("Document data:", doc.data());
    return doc.data()
}).catch((error) => {
    console.log("Error getting document:", error);
});
return result
}

populate()
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
      questions = (content.split(']')) 
      for (let i = 0; i < questions.length; i++){
        db.collection("questions").doc(('' + i)).set({
        question: questions[i].substring(3, questions[i].indexOf(',') - 1),
        answer: questions[i].includes('YES') ? 1 : 0
        })
        .then(() => {
            console.log("Document successfully written!");
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });
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
