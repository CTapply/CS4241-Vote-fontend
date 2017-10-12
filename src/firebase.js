import * as firebase from 'firebase'
let database

export const init = () => {
  let config = {
    apiKey: "AIzaSyD1XkW-4WDUISaVL7z9EGU3ZwnfchqKarI",
    authDomain: "cs4241-vote.firebaseapp.com",
    databaseURL: "https://cs4241-vote.firebaseio.com",
    projectId: "cs4241-vote",
    storageBucket: "cs4241-vote.appspot.com",
    messagingSenderId: "10423157348"
  }
  firebase.initializeApp(config)
  database = firebase.database()
  anonSignIn();
}

export const googleSignIn = () => {

  const provider = new firebase.auth.GoogleAuthProvider();

  firebase.auth().currentUser.linkWithRedirect(provider);

  return firebase.auth().getRedirectResult().then(result => {
    console.log("We have a permanent account", result);
    return result.user
  }).catch(err => {
    console.log("linking failed")
    return firebase.auth().signInWithRedirect(provider)
  })
}

const anonSignIn = async () => {
  //If there is a user do nothing
  if (firebase.auth().currentUser) {
    return new Promise((resolve, reject) => {
      resolve(firebase.auth().currentUser)
    })
    // return firebase.auth().currentUser
  }
  //If there is not a user sign in anonymously
  return firebase.auth().signInAnonymously()
    .then(user => {
      console.log("anon user =", user)
      addUser(user)
      return user
    })
    .catch(err => {
      // Handle Errors here.
      console.error(err.code, err.message)
    });
}


const addUser = (user) => {
  return database.ref("/users").child(`/${user.uid}`).update({ name: "Anonymous" })
}

export const getCurrentUser = () => {
  return firebase.auth().currentUser
}

export const addPollToUser = (pollId) => {
  if (getCurrentUser()) {
    return database.ref(`/users/${getCurrentUser().uid}/polls/`).push(pollId)
  } else console.error("you tried to save a poll, but ther was no user")
}

/**
 * Returns a promise to the specified poll's options data.
 * @param {string} pollId the push id of the poll we're voting on.
 */
export const getOptions = (pollId) => {
  return database.ref(`/polls/${pollId}/options`).once('value')
}

/**
 * Returns a pushId from pushing the poll.
 * @param {string} pollAdd the poll to add. 
 */
export const addPoll = (pollToAdd) => {
  if (getCurrentUser()) {
    pollToAdd["userId"] = getCurrentUser().uid
  }
  console.log("pollToAdd", pollToAdd)
  var myRef = database.ref(`/polls`).push(pollToAdd)
  var key = myRef.key
  return key
}

/**
 * 
 * @param {string} pollId the id of the poll we're submitting
 * @param {Object} ballot the voter id, and an array of their choices {voter, votes:[id1, id2, ...]}
 */
export const castBallot = (pollId, choiceIds) => {

  return database.ref(`/polls/${pollId}/ballots/${getCurrentUser().uid}/votes`)
    .set(choiceIds)
    .then(() => {
      console.log("setting poll to unscored")
      database.ref(`/polls/${pollId}`).update({ alreadyScored: false })
    })
}

export const getUsersPolls = async () => {

  console.error("you tried to get a users polls but there was no user")
  return anonSignIn().then(user => {
    //Raw firebase result object
    return database.ref(`/users/${user.uid}/polls`).once('value')
      .then(pollsData => {
        console.log("promised polls data = ", pollsData)
        return pollsData.val()
      })
      .then(pollsDataVal => {
        console.log("promised polls data val= ", pollsDataVal)
        //just the pushIds of the user's polls
        let pollIds = Object.keys(pollsDataVal).map(k => {
          console.log("pollsData at k = ", pollsDataVal[k])
          return pollsDataVal[k]
        })
        return pollIds
      })
      .then(pollIds => {
        let pollPromises = []
        for (let id of pollIds){
          pollPromises.push(database.ref(`/polls/${id}`).once('value').then(snap => snap.val()))
        }
        return Promise.all(pollPromises)
      })
  })
}