const checkbox = document.getElementById("checkbox");
const professional = document.getElementById("professional");
const master = document.getElementById("master");
const sub50 = document.getElementById("sub50");
const sub80 = document.getElementById("sub80");
const email = document.getElementById("email");

checkbox.addEventListener("click", () => {
  professional.textContent =
    professional.textContent === "#50,000" ? "#5,000" : "#50,000";
  master.textContent = master.textContent === "#80,000" ? "#8,000" : "#80,000";
});

function renderPaymentPage(url) {
  // Render the URL
  window.location.href = url;
}

sub50.addEventListener("click", () => {
  sub50.disabled = true;
  // showPopup('please wait...');
  let amount = 5000
  if (professional.textContent === "#50,000"){
    amount = 50000
  }
  fetch("/subscribe",{
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    // body: amount 
    body: JSON.stringify({ amount: amount })
}).then(response => {
  if (!response.ok) {
    console.log('not ok')
      showPopup('Network response was not ok, try again');
      throw new Error('Network response was not ok');
  }
  return response.json();
}).then(data => {
  console.log('to render')
  showPopup("Wait while we take you to payment page");
  renderPaymentPage(data.url);
}).catch(error => {
  console.error('There was a problem with the fetch operation:', error);
  // Handle errors here
  showPopup("Error sending data. Please try again", true);
});

});
sub80.addEventListener("click", () => {
  sub80.disabled = true;
  // showPopup('please wait...');
  let amount = 8000
  if (professional.textContent === "#50,000"){
    amount = 80000
  }
  fetch("/subscribe",{
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    // body: amount 
    body: JSON.stringify({ amount: amount })
}).then(response => {
  if (!response.ok) {
    console.log('not ok')
      showPopup('Network response was not ok, try again');
      throw new Error('Network response was not ok');
  }
  return response.json();
}).then(data => {
  console.log('to render')
  showPopup("Wait while we take you to payment page");
  renderPaymentPage(data.url);
}).catch(error => {
  console.error('There was a problem with the fetch operation:', error);
  // Handle errors here
  showPopup("Error sending data. Please try again", true);
});

});

//   for notifications
// function showPopup(message, isError) {
//   console.log("showPopup function called");
//   console.log(message);

//   const popup = document.getElementById('popupNotif');
//   popup.style.display = 'block'; 
//   // popup.classList.remove('hidden')
//   if (isError) {
//     popup.style.backgroundColor = "#ff9999";
// } else {
//     popup.style.backgroundColor = "#ffe6cc";
// }
//   void popup.offsetWidth
//   popup.classList.add('show')
//   document.getElementById('notifMessage').textContent = message;
//   setTimeout(closePopup, 10000)
// }


// Function to close the popup notification
function closePopup() {
  const popup = document.getElementById('popupNotification');
  // popup.style.display = 'none'; // Hide the popup
  popup.classList.remove('show'); 
//   setTimeout(function() {
//     popup.style.display = 'none'; // Hide popup after transition is complete
// }, 1000);
popup.style.display = 'none'
};















