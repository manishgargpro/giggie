var listOfGoals = [];

auth
.ready(function () {

//getting user data from login modal
function getUserFormData() {
  var userNameInput = $("#userName");
  var passwordInput = $("#password");
  if (!userNameInput.val().trim() || !passwordInput.val().trim()) {
    return false;
  }
  var newUser = {
    username: userNameInput.val().trim(),
    password: passwordInput.val().trim()
  };
  return newUser;
}

//sets index page
if (auth.currentUser) {
  $("#modalInit").hide();
  $("#logout").show();
  $("#title-span").html("Welcome back, " + auth.currentUser.email + "!!");
  listGoals();
} else {
  $("#title-span").html("Welcome ^_^");
  $("#incomplete-list").html(
    "Here you can keep recurring goals that will update on a timely basis!"
  );
  $("#complete-list").html(
    "This is where your goals go when you complete them. You get points for these!"
  );
}

//registering new user

$("#register").on("click", function(event) {
  event.preventDefault();
  var newUser = getUserFormData();
  if (!newUser) {
    $("#login-message").html("One or more of the fields below is blank");
  } else {
    auth
      .createAndSetUserWithEmailAndPassword(newUser.username, newUser.password)
      .then(function () {
        $.post("api/users", {
          name: auth.currentUser.email,
          firebaseId: auth.currentUser.uid
         
        })
      })
      .then(function (data) {
        window.location='/';
      })
      .catch(function (err) {
        $("#login-message").html(err.message);
      });
    
  }
});


//login user
$("#login").on("click", function (event) {
  event.preventDefault();
  var newUser = getUserFormData();
  if (!newUser) {
    $("#login-message").html("One or more of the fields below is blank");
  } else {
    auth
      .signInWithEmailAndPassword(newUser.username, newUser.password)
      .then(function () {
        window.location = "/"
      })
      .catch(function (err) {
        $("#login-message").html(err.message);
      });
  }
});

//Hiding goals//*** */

function listGoals() {
  $("#incomplete-list").empty();
  $("#complete-list").empty();
  $.get("/api/goals").then(function (data) {
    var incompleteArray = [];
    var completeArray = [];
    for (var i = 0; i < data.length; i++) {
      if (!data[i].complete) {
        var newGoal =
        "<transition v-on:before-enter='beforeEnter' v-on:enter='enter' v-on:leave='leave' v-bind:css='false'>" +
         "<li v-if='show' class='goals' id='" + data[i].User.firebaseId + "|" + data[i].id + "' value=" + data[i].weight + " data-complete='false'>" +
          data[i].text +
          "<button class='btn btn-primary update'>Update Goal</button>" +
          "<button @click='show = !show' class='btn btn-success complete'>Mark as Complete</button>" +
          "<button class='btn btn-danger delete'>Delete</button>" +
          "</li>" +
          "</transition>" +
          "<br>";
        incompleteArray.push(newGoal);
        listOfGoals = data;
      } else {
        var newGoal =
          "<li class='goals' id='" + data[i].User.firebaseId + "|" + data[i].id + "' data-complete='true'>" +
          data[i].text +
          "<button class='btn btn-danger delete'>Delete</button>" +
          "</li>" +
          "<br>";
        completeArray.push(newGoal);
      }
    }
    $("#incomplete-list").html(incompleteArray);
    $("#complete-list").html(completeArray);
    getScore();
  });
}

function getScore() {
  $.get("/api/users").then(function (data) {
    $("#score")
      .html(data.points);
  })
}

function deleteGoal(goalId) {
  $.ajax({
      method: "DELETE",
      url: "/api/goals",
      data: {
        id: goalId
      }
    })
    .done(function (data) {
      if (data) {
        listGoals();
      } else {
        alert("Oops, something went wrong here, give it a minute and try again.")
      }
    });
}

function updateGoal(goal, u) {
  $.ajax({
      method: "PUT",
      url: u,
      data: goal
    })
    .done(function (data) {
      if (data) {
        window.location = "/"
      } else {
        alert("Oops, something went wrong here, give it a minute and try again.")
      }
    });
}
 


    // LOGOUT FUNCTION
   
    $("#logout").on("click", function(event) {
      event.preventDefault();
      auth.signOut().then(function() {
        $("#logout").hide();
        $("#modalInit").show();
        $("#title-span").html("Welcome ^_^");
        $("#incomplete-list").html(
          "Here you can keep recurring goals that will update on a timely basis!"
        );
        $("#complete-list").html(
          "This is where your goals go when you complete them. You get points for these!"
        );
      });
    });
 


    $("#goalGrab").on("click", function (event) {
      event.preventDefault();
      if (!auth.currentUser) {
        $("#login-message").html("Please log in or register first!");
        $("#login-modal").modal("show");
      } else {
        $.post("api/goals", {
          text: $("#goal").val().trim(),
          weight: $("#difficulty").val().trim(),
        }).then(function (data) {

          if (data) {
            window.location = "/";
          }
        });
      }
    });

    $("body").on("click", ".complete", function (event) {
      event.preventDefault();
      var goalDone = {
        id: $(this)
          .parent()
          .attr("id")
          .split("|")[1],
        complete: true
      };
      updateGoal(goalDone, "api/goals/complete");
    });

    $("body").on("click", ".update", function (event) {
      event.preventDefault();
      window.location.href =
        "/update_goal?goal_id=" +
        $(this)
          .parent()
          .attr("id")
          .split("|")[1];
    });

    $("body").on("click", ".delete", function(event) {
      deleteGoal(
        $(this)
          .parent()
          .attr("id")
          .split("|")[1]
      );
    });

    if (window.location.search.indexOf("?goal_id=") !== -1) {
      var goalId = window.location.search.split("=")[1];
      $.get("/api/goals/" + goalId).then(function(data) {
        $("#goal-update").val(data.text);
        $("#difficulty-update").val(data.weight);
      });
    }

    $("#goalUpdate").on("click", function () {
      var goalUpdate = {
        id: window.location.search.split("=")[1],
        text: $("#goal-update")
          .val()
          .trim(),
        weight: $("#difficulty-update").val()
      };
      updateGoal(goalUpdate, "api/goals/update");
      window.location = "/"
    });

    $("form").on("submit", function (event) {
      event.preventDefault();
      var elements = $(event.target).children();
      $.each($(elements).find("input:checked"), function () {
        console.log(this);
        var newItem = {
          text: $(this).attr("data"),
          weight: $(this).val()
        };
        $.post("/api/goals", newItem);
      })
      window.location = "/"
    })
  });
