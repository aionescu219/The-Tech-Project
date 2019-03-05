$(document).ready(function () {

  // Makes navbar sticky. I added code to adjust the body text position so the movement is smoother.
  // original source: CriddleCraddle
  // http://jsfiddle.net/CriddleCraddle/Wj9dD/
  $(window).scroll(() => {
    // 110 (pixels) set to be the point where the navbar sticks
    if ($(window).scrollTop() > 110) {
      $('#nav-bar').addClass('navbar-fixed');
      $('#body-div').addClass('body-lowered');
    }
    if ($(window).scrollTop() < 111) {
      $('#nav-bar').removeClass('navbar-fixed');
      $('#body-div').removeClass('body-lowered');
    }
  });

  // Enabled "Submit Work" buttons to retrieve their respective feedback in div below table
  Array.from($(".submit-work")).forEach(element => {
    element.addEventListener("click", event => {
      renderSubmitFile(event.target.getAttribute("check-in"));
      if (event.target.innerText == "Submit Work") {
        event.target.innerText = "Hide Form";
      } else {
        event.target.innerText = "Submit Work";
      }
    });
  });


  // Enabled "See Feedback" buttons to retrieve their respective feedback in div below table
  Array.from($(".see-feedback")).forEach(element => {
    element.addEventListener("click", event => {
      fetchFeedback(event.target.getAttribute("check-in"));
      if (event.target.innerText == "See Feedback") {
        event.target.innerText = "Hide Feedback";
      } else {
        event.target.innerText = "See Feedback";
      }
    });
  });


  // fetches json file with feedback, renders chosen piece of feedback in DOM and handles errors
  function fetchFeedback(checkin) {
    return fetch("external-data/feedback-list.json")
      .then(response => response.json())
      .then(response => {
        renderFeedback(response.feedback, checkin);
      })
      .catch(response => {
        renderError(response);
      });
  }

  // renders a form for submitting a file for the desired-checkin
  function renderSubmitFile(checkin) {
    if (document.querySelector(`#uploadFileDiv div.check-in-${checkin}`) != null) {
      document.querySelector(`#uploadFileDiv div.check-in-${checkin}`).remove();
    } else {
      let divClass = `check-in-${checkin}`;
      let newDiv = $("<div></div>");
      newDiv.addClass(divClass);

      let submitButtonDiv = $("<div></div>");
      let submitButton = $(`<button id="submitFileButton" class="custom-button">Submit File</button>`);
      submitButton.click(event => {
        event.preventDefault();
        event.stopPropagation();

        // Will make the below code work in the future
        //let desiredFeedbackButton = document.querySelectorAll("button.see-feedback").filter(button => button.getAttribute("check-in") == checkin);
        let desiredFeedbackButton = document.getElementById("desiredFeedback");

        desiredFeedbackButton.classList.remove("disabled-button");
        $("#progressSpan").text("90%");
      });
      let heading = $(`<h3>Upload Submission for Check-in ${checkin}</h3>`);
      let uploadForm = $(`<form>
      <div>
        <label for="submission-name">Submission Name:</label>
        <input type="text" id="submission-name" name="submission-name-field" class="text-input"
          required="required">
      </div>
        <div>
          <label for="file-upload">Upload File:</label>
          <input type="text" id="file-upload" name="file-field" required="required"
            class="text-input"></input>
        </div>
        
    </form>`);
      submitButtonDiv.append(submitButton);
      uploadForm.append(submitButtonDiv);
      newDiv.append(heading);
      newDiv.append(uploadForm);
      $("#uploadFileDiv").append(newDiv);
    }
  }

  // takes feedback in json format and number of check-in to render desired piece of feedback in DOM
  function renderFeedback(feedback, checkin) {
    if (document.querySelector(`#viewFeedbackDiv div.check-in-${checkin}`) != null) {
      document.querySelector(`#viewFeedbackDiv div.check-in-${checkin}`).remove();
    } else {
      feedback.forEach(element => {
        if (element["check-in"] == checkin) {
          let newh3 = $(`<h3>Feedback for <span class="brightblue">Check-in ${checkin}</span></h3>`);
          let newP = $(`<p>${element.feedback}</p>`);
          let divClass = `check-in-${checkin}`;
          let newDiv = $("<div></div>")
          newDiv.addClass(divClass);
          newDiv.append(newh3);
          newDiv.append(newP);
          $("#viewFeedbackDiv").append(newDiv);
        }
      });
    }

  }

  // renders fetch() error in the feedback div
  function renderError(errorObject) {
    let alertClass = "alert alert-danger";
    let alertP = $(`<p class="${alertClass}">${errorObject.message}</p>`);
    $("#viewFeedbackDiv").append(alertP);
  }

  // enables login button for mentor menu
  $("#loginFormButton").click(event => {
    event.preventDefault();
    $("#loginForm").addClass("d-none");
    $("#leaveFeedbackForm").removeClass("d-none");
  });

});

// enables feedback button for mentor menu
$("#leaveFeedbackButton").click(event => {
  event.preventDefault();
  $("#leaveFeedbackForm").addClass("d-none");
  $("#feedBackRecieved").removeClass("d-none");
});


