window.addEventListener('load', autoReger, false);

function autoReger() {
	if (localStorage.getItem('autoRegister') === 'true') {
		console.log("reging");
		if (document.getElementsByClassName("sign-in").length == 0 && typeof(document.getElementById('logOutBtn')) === 'object') {
			document.getElementById('logOutBtn').click();
		} else {
			window.setInterval( function() {
				var data = localStorage.getItem('regData');
				data = JSON.parse(data);
				var row = data.pop();
				console.log(row);
				if (data.length > 0) {
					localStorage.setItem('regData', JSON.stringify(data));
				} else {
					localStorage.setItem('autoRegister', 'false');
				}
				document.getElementsByClassName("sign-in")[0].getElementsByClassName("SignBtn")[0].click();
				var event = new Event('input', {
				    'bubbles': true,
				    'cancelable': true
				});
				document.getElementById("inputEmail").value = row['email'];
				document.getElementById("inputEmail").dispatchEvent(event);
				document.getElementById("inputPassword").value = row['password'];
				document.getElementById("inputPassword").dispatchEvent(event);
				document.getElementsByClassName("sign")[1].click();
				document.getElementById('loginBtn').click();
			}, 2000 + (Math.random() * 6000));
		}
	}
}

function startAuto () {
var input, file, fr;

if (typeof window.FileReader !== 'function') {
  alert("The file API isn't supported on this browser yet.");
  return;
}

input = document.getElementById('fileinput');
if (!input) {
  alert("Um, couldn't find the fileinput element.");
}
else if (!input.files) {
  alert("This browser doesn't seem to support the `files` property of file inputs.");
}
else if (!input.files[0]) {
  alert("Please select a file before clicking 'Import'");
}
else {
  file = input.files[0];
  fr = new FileReader();
  fr.onload = receivedText;
  fr.readAsText(file);
}

function receivedText(e) {
  lines = e.target.result;
  localStorage.setItem('regData', lines);
  localStorage.setItem('autoRegister', 'true');
  console.log(lines);
    window.open('/','_blank');
}
}
