$(document).ready(function(){
  console.log("Jquery Loaded!");

  init();
});

// Initial Functions called here. Abstracting out functionality
function init(){
  // set up listeners
  loadAll();
  enable();
}

// Setting up listeners for jQuery interactions
function enable(){
  $('.patronus-form').on('submit', submitPatronus);
  $('.person-form').on('submit', submitPerson);
  $('.assignment-form').on('submit', submitAssignment);
}

function submitPatronus(event){
  event.preventDefault();
  // store form information in this object
  var formData = {};
  // serialize the form and loop through it's info,
  // creating keys in the formData object as we go
  var formArray = $('.patronus-form').serializeArray();
  formArray.forEach(function(element){
    formData[element.name] = element.value;
  });

  // send the data to the server to be saved
  $.ajax({
    type: 'POST',
    url: '/patroni',
    data: formData,
    success: function(response){
      loadAll();
      console.log(response);
    }
  });
}

function submitPerson(event){
  event.preventDefault();
  // store the information in the form in this object
  var formData = {};
  // serialize the form and loop through it's info,
  // creating keys in the formData object as we go
  var formArray = $('.person-form').serializeArray();
  formArray.forEach(function(element){
    formData[element.name] = element.value;
  });

  // send the data to the server to be saved
  $.ajax({
    type: 'POST',
    url: '/people',
    data: formData,
    success: function(response){
      loadAll();
      console.log(response);
    }
  });
}

function submitAssignment(event){
  event.preventDefault();
  // store the information in the form in this object
  var formData = {};
  // serialize the form and loop through it's info,
  // creating keys in the formData object as we go
  var formArray = $('.assignment-form').serializeArray();
  formArray.forEach(function(element){
    formData[element.name] = element.value;
  });

  // GETS PERSON!
  $.ajax({
    type: 'PUT',
    url: '/people/test/'+ formData.personDrop,
    data: formData,
    success: function(response){
      loadAll();
      console.log(response);
    }
  });

  // GETS PATROOOON!
  $.ajax({
    type: 'GET',
    url: '/patroni/test/'+ formData.patronusDrop,
    //data: formData.personDrop,
    success: function(response){
      loadAll();
      console.log(response);
    }
  });
}


function loadAll(){
  // show all the people and patroni, dropdown boxes
  // empty person-vestibule, patronus-vestibule, dropdown-vestibule;
  displayPeople();
  displayPatroni();
  // populateDropdown();
}

// Displays entries for people onto the dom from the database
function displayPeople(){
  $.ajax({
    type: 'GET',
    url: '/people',
    success: function(response){
      // console.log("in display people",response);
      appendUnassigned(response);
    }
  });

  $.ajax({
    type: 'GET',
    url: '/people/assigned',
    success: function(response){
      console.log("weeee");
      console.log("in display people",response);
      appendAssigned(response);
    }
  });
}

// Displays entries for patroni onto the dom from the database
function displayPatroni(){
  $.ajax({
    type: 'GET',
    url: '/patroni',
    success: function(response){
      // console.log("in display patroni",response);
      appendPatroni(response);
    }
  });
}

function appendUnassigned(response){
  $('.people-vestibule').empty();
  $('.person-drop').empty();
  $('.person-drop').append('<option value="">Select</option>');

  //append to person-drop and people-vestibule
  response.forEach(function(person){
    $('.people-vestibule').append('<p>' + person.first_name +' '+person.last_name+ '</p>');
    $('.person-drop').append('<option value="'+ person.person_id +'">' + person.first_name + ' '+ person.last_name +'</option>');
  });
}

function appendPatroni(response){
  $('.patronus-vestibule').empty();
  $('.patronus-drop').empty();
  $('.patronus-drop').append('<option value="">Select</option>');

  //append to person-drop and people-vestibule
  response.forEach(function(patronus){
    $('.patronus-vestibule').append('<p>' + patronus.patronus_name +'</p>');
    $('.patronus-drop').append('<option value="'+ patronus.patronus_id +'">' + patronus.patronus_name + '</option>');
  });
}

function appendAssigned(response){
  $('.assigned-results').empty();
  //$('.assigned-results').append('<div');
  $('.assigned-results').append('<div class="new-assigned"></div>');

  //append to person-drop and people-vestibule
  response.forEach(function(assigned){
    $('.new-assigned').append('<h2>' + assigned.first_name + ' ' + assigned.last_name +'</h2>');
    $('.new-assigned').append('<p>Patronus: ' + assigned.patronus_name + '</p>');
  });
}
