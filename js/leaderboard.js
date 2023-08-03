$(function() {
  var LEADERBOARD_SIZE = 10;

  // Build some firebase references.
  var rootRef = new Firebase("https://INSTANCE.firebaseio.com/leaderboard");
  var scoreListRef = rootRef.child("scoreList");
  var longestTimeRef = rootRef.child("longestTime");

  // Keep a mapping of firebase locations to HTML elements, so we can move / remove elements as necessary.
  var htmlForPath = {};

  // Helper function that takes a new score snapshot and adds an appropriate row to our leaderboard table.
  function handleScoreAdded(scoreSnapshot, prevStudySid) {
    var newStudyRow = $("<tr/>");
    newStudyRow.append($("<td/>").text(scoreSnapshot.val().sid));
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

  // // Add a callback to handle when a new score is added.
  // scoreListView.on("child_added", function (newCountSnapshot, prevStudySid) {
  //   handleScoreAdded(newCountSnapshot, prevStudySid);
  // });

  // // Add a callback to handle when a score is removed
  // scoreListView.on("child_removed", function (oldCountSnapshot) {
  //   handleScoreRemoved(oldCountSnapshot);
  // });

  // Add a callback to handle when a score changes or moves positions.
  var changedCallback = function (scoreSnapshot, prevStudySid) {
    handleScoreRemoved(scoreSnapshot);
    handleScoreAdded(scoreSnapshot, prevStudySid);
  };
  scoreListView.on("child_moved", changedCallback);
  scoreListView.on("child_changed", changedCallback);

  // When the user presses enter on scoreInput, add the score, and update the highest score.
  // $("#timeInput").keypress(function (e) {
  //   if (e.keyCode == 13) {
  //     //var newCount = Number($("#countInput").val());
  //     var newTime = Number($("#timeInput").val());
  //     var sid = $("#sidInput").val();

  //     if (sid.length === 0)
  //       return;

  //     var userScoreRef = scoreListRef.child(sid);

  //     // Use setWithPriority to put the name / score in Firebase, and set the priority to be the score.
  //     //userScoreRef.setWithPriority({ sid:sid, time:newTime, count:newCount}, newTime, newCount);
  //     userScoreRef.setWithPriority({ sid:sid, time:newTime}, newTime);
  //     // Track the highest score using a transaction.  A transaction guarantees that the code inside the block is
  //     // executed on the latest data from the server, so transactions should be used if you have multiple
  //     // clients writing to the same data and you want to avoid conflicting changes.
  //     longestTimeRef.transaction(function (currentLongestTime) {
  //       if (currentLongestTime === null || newTime > currentLongestTime) {
  //         // The return value of this function gets saved to the server as the new highest score.
  //         return newTime;
  //       }
  //       // if we return with no arguments, it cancels the transaction.
  //       return;
  //     });
  //   }
  // });

  $("#countInput").keypress(function (e) {
    if (e.keyCode == 13) {
      var newTime = Number($("#timeInput").val());
      var newCount = Number($("#countInput").val());
      var sid = $("#sidInput").val();

      if (sid.length === 0)
        return;

      var userScoreRef = scoreListRef.child(sid);

      // Use setWithPriority to put the name / score in Firebase, and set the priority to be the score.
      //userScoreRef.setWithPriority({ sid:sid, time:newTime, count:newCount}, newTime, newCount);
      userScoreRef.setWithPriority({ sid:sid, time:newTime, count:newCount}, newTime);
      // Track the highest score using a transaction.  A transaction guarantees that the code inside the block is
      // executed on the latest data from the server, so transactions should be used if you have multiple
      // clients writing to the same data and you want to avoid conflicting changes.
       longestTimeRef.transaction(function (currentLongestTime) {
        if (currentLongestTime === null || newTime > currentLongestTime) {
          // The return value of this function gets saved to the server as the new highest score.
          return newTime;
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
  longestTimeRef.on("value", function (newLongestTime) {
    $("#longestStudyTimeDiv").text(newLongestTime.val());
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
});
