const db = firebase.firestore()
const questionContainer = document.getElementById('question-container')
const optionsContainer = document.getElementById('options-container')
const answerContainer = document.getElementById('answer-container')
const answerBox = document.getElementById('answer-box')
const langDropdown = document.getElementById('lang')
/*
const usernameInput = document.getElementById('username')
const passwordInput = document.getElementById('password')
const signInUpBtn = document.getElementById('sign-in-up-btn')
const auth = firebase.auth()
const whenSignedIn = document.getElementById('whenSignedIn')
const whenSignedOut = document.getElementById('whenSignedOut')
const signInBtn = document.getElementById('signInBtn')
const signOutBtn = document.getElementById('signOutBtn')
const userDetails = document.getElementById('userDetails')
const provider = new firebase.auth.GoogleAuthProvider()
var userID = false
*/
var answer = null
var questionType = 'sentences'
var lang = 'korean'
var numChoices = 5

//document.getElementById('input-file').addEventListener('change', getFile)
//signInUpBtn.onclick = () => signInUp()

/*signInBtn.onclick = () => auth.signInWithPopup(provider)
signOutBtn.onclick = () => {
   auth.signOut()
}
auth.onAuthStateChanged(user => {
    if (user) {
        // signed in
        user = user.uid
        whenSignedIn.hidden = false
        whenSignedOut.hidden = true
        console.log(user)
        userID = user
    } else {
        // not signed in
        whenSignedIn.hidden = true
        whenSignedOut.hidden = false
        userDetails.innerHTML = ''
        user = false
        userID = false
    }
})
*/
function updateLang(){
    lang = langDropdown.value
}
function radioClick(rad){
    questionType = rad.value
}
function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild)
    }
}
function getQuestion(){
    var getOptions = {
        source: 'default'
    }
    var lengthDoc = db.collection('questions').doc(lang).collection(questionType).doc('length')
    let result = lengthDoc.get(getOptions).then((doc) => {
        let randIndex = Math.floor(Math.random() * doc.data()['length'])
        var qDoc = db.collection("questions").doc(lang).collection(questionType).doc('' + randIndex)
        let word = qDoc.get(getOptions).then((doc) => {
            console.log("Document data:", doc.data())
            return doc.data()
        }).catch((error) => {
            console.log("Error getting document:", error)
        })
        return word 
    }).catch((error) => {
        console.log("Error getting document:", error)
    })
    return result
}
function populate(){
    removeAllChildNodes(questionContainer)
    removeAllChildNodes(optionsContainer)
    removeAllChildNodes(answerContainer)
    if (questionType == 'YN' || questionType == 'freeResponse'){
        getQuestion().then(q => {
            console.log(q)
            answer = q.answer
            questionContainer.innerHTML = q.question
            if (questionType == 'YN'){
                let yesBtn = document.createElement('BUTTON')
                yesBtn.innerHTML = 'はい'
                yesBtn.addEventListener('click', (e, a = 1) => {answerContainer.innerHTML = answer})
                let noBtn = document.createElement('BUTTON')
                noBtn.innerHTML = 'いいえ'
                noBtn.addEventListener('click', (e, a = 0) => {answerContainer.innerHTML = answer})
                optionsContainer.appendChild(yesBtn)    
                optionsContainer.appendChild(noBtn)    
            } else { //freeResponse
                let showAnsBtn = document.createElement('BUTTON')
                showAnsBtn.innerHTML = '&#10003;'
                showAnsBtn.addEventListener('click', e => answerContainer.innerHTML = answer)
                    optionsContainer.appendChild(showAnsBtn)
                }
        })
    } else if (questionType=='vocab'){ //vocab
    let rand = Math.floor(Math.random()*numChoices)
        for (let i=0; i<numChoices; i++){
            getQuestion().then(w => {
                if(i==rand){
                    questionContainer.innerHTML = w.word
                    answer = w.meaning
                }
                let b = document.createElement("BUTTON")
                b.innerHTML = w.meaning
                b.addEventListener('click', (e, m=w.meaning) => {answerContainer.innerHTML = answer})
                optionsContainer.appendChild(b)
            })
        }
    }else if (questionType=='sentences'){
        getQuestion().then(q => {
            console.log(q)
            answer = q.meaning
            questionContainer.innerHTML=q.sentence
            let showAnsBtn = document.createElement('BUTTON')
            showAnsBtn.innerHTML = '&#10003;'
            showAnsBtn.addEventListener('click', e => answerContainer.innerHTML = answer)
            optionsContainer.appendChild(showAnsBtn)
        })
    }
}
/*
function signInUp(){
    let name = usernameInput.value
    let pass = passwordInput.value
    if (name.length && pass.length){
        var docRef = db.collection('users').doc(name)

        docRef.get().then((doc) => {
            if (doc.exists) {
                if(doc.data().password == pass) {
                    userID = name
                    auth.signInAnonymously()
                    userDetails.innerHTML = name
                } else {
                    userDetails.innerHTML = 'another user has that name, or you entered the wrong password :('
                }

            } else {
                docRef.set({
                    password: pass,
                    seen: []
                })
                auth.signInAnonymously()
                userDetails.innerHTML = name
                userID = name

            }
        }).catch((error) => {
            console.log("Error getting document:", error)
        })
    }
}
function getFile(event) {
	const input = event.target
  if ('files' in input && input.files.length > 0) {
      console.log(input.files[0])
	  placeFileContent(input.files[0])
  }
}

function placeFileContent(file) {
	readFileContent(file).then(content => {
      var questions = content.split('\n')
      console.log(questions.length)
      questions = questions.slice(0,-1)
      free_response = []
      yes_no = []
      multiple_choice = []
      
     for (let i = 0; i < questions.length; i+=1){
            multiple_choice.push(questions[i].substring(0, questions[i].indexOf('\t')))
            multiple_choice.push(questions[i].substring(questions[i].indexOf('\t')))
        }
        db.collection("questions").doc('korean').collection('sentences').doc('length').set({length:multiple_choice.length/2})
      for (let i = 0; i < multiple_choice.length; i+=2){
        db.collection("questions").doc('korean').collection('sentences').doc('' + i / 2).set({
        sentence: multiple_choice[i].replace(/"/g,""),
        meaning: multiple_choice[i+1].replace(/"/g,"")
        })
        .then(() => {
            console.log("Document successfully written!")
        })
        .catch((error) => {
            console.error("Error writing document: ", error)
        })
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
            console.log("Document successfully written!")
        })
        .catch((error) => {
            console.error("Error writing document: ", error)
        })
      }
      
      for (let i = 0; i < yes_no.length; i+=2){
        db.collection("questions").doc('korean').collection('YN').doc('' + i / 2).set({
        question: yes_no[i],
        answer: yes_no[i+1].includes('YES') ? 1 : 0
        })
        .then(() => {
            console.log("Document successfully written!")
        })
        .catch((error) => {
            console.error("Error writing document: ", error)
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
