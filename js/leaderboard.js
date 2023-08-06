$(function() {
  var LEADERBOARD_SIZE = 50;

  // Build some firebase references.
  // var config = {
  //   apiKey: "AIzaSyBZJBX0NvNMxM59CBZqf8TzcI4e8SBHX3U",
  //   authDomain: "dsc190-self-study.firebaseapp.com",
  //   databaseURL: "https://dsc190-self-study-default-rtdb.firebaseio.com",
  //   projectId: "dsc190-self-study",
  //   storageBucket: "dsc190-self-study.appspot.com",
  //   messagingSenderId: "96522782870",
  //   appId: "1:96522782870:web:9262800128a68fc0f65ab7",
  //   measurementId: "G-BJ4XJNC3HC"
  // };
  // var rootRefN = firebase.initializeApp(config);//
  var rootRef = new Firebase("https://dsc190-self-study-default-rtdb.firebaseio.com/test");
  console.log(rootRef);
  // rootRef.once('value', (data) => {
  //   //console.log(data);
  //   console.log(data.G.j.oa.left.left); //continuously left
  //   var keyTry = data.G.j.oa.left.left.key;
  //   console.log(keyTry);
  //   var happy = rootRef.child(keyTry).child("Time");
  //   console.log(happy);
  //   // do some stuff once
  // });
  // i = data.G.j.oa
  // while (i.left != None){
  //   console.log(i.key);
  //   i = i.left;
  // }
  // var rootRef2 = new Firebase("https://dsc190-self-study-default-rtdb.firebaseio.com/test/22/Time");
  // console.log(rootRef2);
  // rootRef2.once('value', (data) => {
  //   //console.log(data);
  //   console.log(data.G.A);
  //   // do some stuff once
  // });
  var scoreListRef = rootRef.child("scoreList");
  var longestTimeRef = rootRef.child("longestTime");
  //var tryRef = rootRef.child("22")//.child("Time");
  //console.log(tryRef);
  var htmlForPath = {};
  rootRef.on("value", (snapshot) => {
    //var htmlForPath2 = {};
    // Store a reference to the table row so we can get it again later.
    const usersData = snapshot.val();
    const keysFromDb0 = Object.getOwnPropertyNames(usersData);
    const KeysFromDb = keysFromDb0.filter((i) => !["longestTime", "scoreList"].includes(i));
    console.log(KeysFromDb);
    console.log(usersData[KeysFromDb[0]].actualTime);
    const answerObj = {};
    for (let i = 0; i < KeysFromDb.length; i++) {
      console.log(usersData[KeysFromDb[i]].actualTime);
      var newStudyRow = $("<tr/>");
      newStudyRow.append($("<td/>").text(KeysFromDb[i]));
      newStudyRow.append($("<td/>").text(usersData[KeysFromDb[i]].actualTime));
      newStudyRow.append($("<td/>").text(usersData[KeysFromDb[i]].Time));
      newStudyRow.append($("<td/>").text(usersData[KeysFromDb[i]].violationCount));
      htmlForPath[KeysFromDb[i]] = newStudyRow;
      console.log(htmlForPath);
      //Store a reference to the table row so we can get it again later.
      //htmlForPath[KeysFromDb] = newStudyRow;
      if (usersData.longestTime < usersData[KeysFromDb[i]].actualTime) {
        longestTimeRef.on("value", function (newLongestaTime) {
          $("#longestStudyTimeDiv").text(usersData[KeysFromDb[i]].actualTime);
        });
      }
      //Insert the new score in the appropriate place in the table.
      // if (prevStudySid === null) {
      //   $("#leaderboardTable").append(newStudyRow);
      // }
      // else {
      //var answer = 
      const onlyaTime = Object.entries(usersData.scoreList).reduce((result, [key, value]) => {
        result[key] = value.atime;
        return result;
      }, {});
      console.log(onlyaTime);
      const cObject = { ...onlyaTime, ...answerObj};
      console.log(cObject);
      const filteredEntries = Object.entries(cObject).filter(([key, value]) => value < usersData[KeysFromDb[i]].actualTime);
      const lowerVId = filteredEntries.reduce((acc, [key, value]) => (value > acc.value ? { key, value } : acc), {
        value: -Infinity,
      }).key;
      console.log(lowerVId);
      if (lowerVId === null) {
        $("#leaderboardTable").append(newStudyRow);
      }
      else {
        var lowerScoreRow = htmlForPath[lowerVId];
        console.log(lowerScoreRow);
        lowerScoreRow.before(newStudyRow);
      }
      answerObj[KeysFromDb[i]] = usersData[KeysFromDb[i]].actualTime;

      // const scrLst = Object.values(usersData.scoreList).map((obj) => obj.atime);
      // const cLst = scrLst.concat(answerLst);
      // const sRankLst = cLst.filter((i) => i < usersData[KeysFromDb[i]].actualTime);
      // const smallerId = Math.max(...sRankLst);
      // answerLst.push(usersData[KeysFromDb[i]].actualTime);
      // console.log(smallerId);
      // var lowerScoreRow = htmlForPath[];
      // lowerScoreRow.before(newStudyRow);

      //}
      // var userScoreRef = htmlForPath[KeysFromDb];//scoreListRef.child(sid);

      // // Use setWithPriority to put the name / score in Firebase, and set the priority to be the score.
      // //userScoreRef.setWithPriority({ sid:sid, time:newTime, count:newCount}, newTime, newCount);
      // userScoreRef.setWithPriority({ sid:KeysFromDb[i], atime: usersData[KeysFromDb[i]].actualTime, time: usersData[KeysFromDb[i]].Time, count: usersData[KeysFromDb[i]].violationCount}, usersData[KeysFromDb[i]].actualTime);
      // // Track the highest score using a transaction.  A transaction guarantees that the code inside the block is
      // // executed on the latest data from the server, so transactions should be used if you have multiple
      // // clients writing to the same data and you want to avoid conflicting changes.
      //  longestTimeRef.transaction(function (currentLongestaTime) {
      //   if (currentLongestaTime === null || newaTime > currentLongestaTime) {
      //     // The return value of this function gets saved to the server as the new highest score.
      //     return newaTime;
      //   }
      //   // if we return with no arguments, it cancels the transaction.
      //   return;
      //  })
    }
    
   //console.log(usersData);
    
    // var newStudyRow = $("<tr/>");
    // newStudyRow.append($("<td/>").text(usersData.sid));
    // newStudyRow.append($("<td/>").text(usersData.atime));
    // newStudyRow.append($("<td/>").text(usersData.time));
    // newStudyRow.append($("<td/>").text(usersData.count));

    // // Store a reference to the table row so we can get it again later.
    // htmlForPath[scoreSnapshot.key()] = newStudyRow;

    // // Insert the new score in the appropriate place in the table.
    // if (prevStudySid === null) {
    //   $("#leaderboardTable").append(newStudyRow);
    // }
    // else {
    //   var lowerScoreRow = htmlForPath[prevStudySid];
    //   lowerScoreRow.before(newStudyRow);
    // }
    //console.log(usersData);
  });

  //console.log(htmlForPath['001']);

//  const valuereturned = get_student_feature("123", "actualTime")
//  console.log(valuereturned);

  // function create_entry_name(name, email) {
  //   const ref = ref(db, '/users/' + name);
  
  //   onValue(ref, (snapshot) => {
  //     const data = snapshot.val();
  //     console.log(data)
  //   });
  // }

  // Get a database reference to our posts
  // const db = firebase.getDatabase(rootRefN);
  // const ref = db.ref('https://dsc190-self-study-default-rtdb.firebaseio.com/test');

  // Attach an asynchronous callback to read the data at our posts reference
  // rootRef.on('value', (snapshot) => {
  //   console.log(snapshot.val());
  // }, (errorObject) => {
  //   console.log('The read failed: ' + errorObject.name);
  // }); 


  // Retrieve new posts as they are added to our database
  // rootRef.on('child_added', (snapshot, prevChildKey) => {
  //   const newPost = snapshot.val();
  //   console.log('Time: ' + newPost.Time);
  //   console.log('actualTime: ' + newPost.actualTime);
  //   console.log('violationCount: ' + newPost.violationCount);
  //   console.log('Previous Post ID: ' + prevChildKey);
  // });

  // Keep a mapping of firebase locations to HTML elements, so we can move / remove elements as necessary.
  //var htmlForPath = {};

  // Helper function that takes a new score snapshot and adds an appropriate row to our leaderboard table.
  function handleScoreAdded(scoreSnapshot, prevStudySid) {
    var newStudyRow = $("<tr/>");
    newStudyRow.append($("<td/>").text(scoreSnapshot.val().sid));
    newStudyRow.append($("<td/>").text(scoreSnapshot.val().atime));
    newStudyRow.append($("<td/>").text(scoreSnapshot.val().time));
    newStudyRow.append($("<td/>").text(scoreSnapshot.val().count));

    // Store a reference to the table row so we can get it again later.
    htmlForPath[scoreSnapshot.key()] = newStudyRow;

    // Insert the new score in the appropriate place in the table.
    if (prevStudySid === null) {
      $("#leaderboardTable").append(newStudyRow);
    }
    else {
      var lowerScoreRow = htmlForPath[prevStudySid];
      lowerScoreRow.before(newStudyRow);
    }
  }

  // Helper function to handle a score object being removed; just removes the corresponding table row.
  function handleScoreRemoved(scoreSnapshot) {
    var removedStudyRow = htmlForPath[scoreSnapshot.key()];
    removedStudyRow.remove();
    delete htmlForPath[scoreSnapshot.key()];
  }

  // Create a view to only receive callbacks for the last LEADERBOARD_SIZE scores
  var scoreListView = scoreListRef.limitToLast(LEADERBOARD_SIZE);

  // Add a callback to handle when a new score is added.
  scoreListView.on("child_added", function (newScoreSnapshot, prevStudySid) {
    handleScoreAdded(newScoreSnapshot, prevStudySid);
  });

  // Add a callback to handle when a score is removed
  scoreListView.on("child_removed", function (oldScoreSnapshot) {
    handleScoreRemoved(oldScoreSnapshot);
  });

  // Add a callback to handle when a score changes or moves positions.
  var changedCallback = function (scoreSnapshot, prevStudySid) {
    handleScoreRemoved(scoreSnapshot);
    handleScoreAdded(scoreSnapshot, prevStudySid);
  };
  scoreListView.on("child_moved", changedCallback);
  scoreListView.on("child_changed", changedCallback);

  // When the user presses enter on scoreInput, add the score, and update the highest score.

  $("#countInput").keypress(function (e) {
    if (e.keyCode == 13) {
      var newaTime = Number($("#atimeInput").val());
      var newTime = Number($("#timeInput").val());
      var newCount = Number($("#countInput").val());
      var sid = $("#sidInput").val();

      if (sid.length === 0)
        return;

      var userScoreRef = scoreListRef.child(sid);

      // Use setWithPriority to put the name / score in Firebase, and set the priority to be the score.
      //userScoreRef.setWithPriority({ sid:sid, time:newTime, count:newCount}, newTime, newCount);
      userScoreRef.setWithPriority({ sid:sid, atime: newaTime, time:newTime, count:newCount}, newaTime);
      // Track the highest score using a transaction.  A transaction guarantees that the code inside the block is
      // executed on the latest data from the server, so transactions should be used if you have multiple
      // clients writing to the same data and you want to avoid conflicting changes.
       longestTimeRef.transaction(function (currentLongestaTime) {
        if (currentLongestaTime === null || newaTime > currentLongestaTime) {
          // The return value of this function gets saved to the server as the new highest score.
          return newaTime;
        }
        // if we return with no arguments, it cancels the transaction.
        return;
       })
    }
  });

  // When the user presses enter on scoreInput, add the score, and update the highest score.
  // $("#countInput").keypress(function (e) {
  //   if (e.keyCode == 13) {
  //     var newCount = Number($("#countInput").val());
  //     var newTime = Number($("#timeInput").val());
  //     var sid = $("#sidInput").val();

  //     if (sid.length === 0)
  //       return;

  //     var userScoreRef = scoreListRef.child(sid);

  //     // Use setWithPriority to put the name / score in Firebase, and set the priority to be the score.
  //     //userScoreRef.setWithPriority({ sid:sid, time:newTime, count:newCount}, newTime, newCount);
  //     //userScoreRef.setWithPriority({ sid:sid, time: newTime, count:newCount}, newTime, newCount);
  //     // Track the highest score using a transaction.  A transaction guarantees that the code inside the block is
  //     // executed on the latest data from the server, so transactions should be used if you have multiple
  //     // clients writing to the same data and you want to avoid conflicting changes.
  //     // highestScoreRef.transaction(function (currentLongestTime) {
  //     //   if (currentLongestTime === null || newTime > currentLongestTime) {
  //     //     // The return value of this function gets saved to the server as the new highest score.
  //     //     return newTime;
  //     //   }
  //     //   // if we return with no arguments, it cancels the transaction.
  //     //   return;
  //     // });
  //   }
  // });

  // Add a callback to the highest score in Firebase so we can update the GUI any time it changes.
  longestTimeRef.on("value", function (newLongestaTime) {
    $("#longestStudyTimeDiv").text(newLongestaTime.val());
  });


  // // Helper function that takes a new score snapshot and adds an appropriate row to our leaderboard table.
  // function handleScoreAdded(scoreSnapshot, prevScoreName) {
  //   var newCountRow = $("<tr/>");
  //   newCountRow.append($("<td/>").text(countSnapshot.val().name));
  //   newCountRow.append($("<td/>").text(countSnapshot.val().score));

  //   // Store a reference to the table row so we can get it again later.
  //   htmlForPath[scoreSnapshot.key()] = newScoreRow;

  //   // Insert the new score in the appropriate place in the table.
  //   if (prevScoreName === null) {
  //     $("#leaderboardTable").append(newScoreRow);
  //   }
  //   else {
  //     var lowerScoreRow = htmlForPath[prevScoreName];
  //     lowerScoreRow.before(newScoreRow);
  //   }
  // }

  // Helper function to handle a score object being removed; just removes the corresponding table row.
  // function handleScoreRemoved(scoreSnapshot) {
  //   var removedScoreRow = htmlForPath[scoreSnapshot.key()];
  //   removedScoreRow.remove();
  //   delete htmlForPath[scoreSnapshot.key()];
  // }

  // Create a view to only receive callbacks for the last LEADERBOARD_SIZE scores
  // var scoreListView = scoreListRef.limitToLast(LEADERBOARD_SIZE);

  // // Add a callback to handle when a new score is added.
  // scoreListView.on("child_added", function (newScoreSnapshot, prevScoreName) {
  //   handleScoreAdded(newScoreSnapshot, prevScoreName);
  // });

  // // Add a callback to handle when a score is removed
  // scoreListView.on("child_removed", function (oldScoreSnapshot) {
  //   handleScoreRemoved(oldScoreSnapshot);
  // });

  // // Add a callback to handle when a score changes or moves positions.
  // var changedCallback = function (scoreSnapshot, prevScoreName) {
  //   handleScoreRemoved(scoreSnapshot);
  //   handleScoreAdded(scoreSnapshot, prevScoreName);
  // };
  // scoreListView.on("child_moved", changedCallback);
  // scoreListView.on("child_changed", changedCallback);

  // // When the user presses enter on scoreInput, add the score, and update the highest score.
  // $("#scoreInput").keypress(function (e) {
  //   if (e.keyCode == 13) {
  //     var newScore = Number($("#scoreInput").val());
  //     var sid = $("#sidInput").val();
  //     $("#timeInput").val("");

  //     if (sid.length === 0)
  //       return;

  //     var userScoreRef = scoreListRef.child(sid);

  //     // Use setWithPriority to put the name / score in Firebase, and set the priority to be the score.
  //     userScoreRef.setWithPriority({ sid:sid, time:newTime}, newTime);

  //     // Track the highest score using a transaction.  A transaction guarantees that the code inside the block is
  //     // executed on the latest data from the server, so transactions should be used if you have multiple
  //     // clients writing to the same data and you want to avoid conflicting changes.
  //     highestScoreRef.transaction(function (currentHighestScore) {
  //       if (currentHighestScore === null || newTime > currentHighestScore) {
  //         // The return value of this function gets saved to the server as the new highest score.
  //         return newTime;
  //       }
  //       // if we return with no arguments, it cancels the transaction.
  //       return;
  //     });
  //   }
  // });

  // // Add a callback to the highest score in Firebase so we can update the GUI any time it changes.
  // highestScoreRef.on("value", function (newLongestTime) {
  //   $("#highestScoreDiv").text(newLongestTime.val());
  // });
  //console.log(longestTimeRef);
});

