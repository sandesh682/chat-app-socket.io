var socket = io();

document.querySelector("#send").addEventListener("click", (event) => {
  event.preventDefault();

  let message = document.querySelector("#inputMessage").value;

  if (message.length != 0) {
    document.querySelector("#send").setAttribute("disabled", "disabled");

    socket.emit("sendMessage", message, (message) => {
      console.log(message);
    });

    document.querySelector("#send").removeAttribute("disabled");

    document.querySelector("#inputMessage").value = "";
    document.querySelector("#inputMessage").focus();
  } else {
    alert("Enter message");
  }
});

socket.on("sendMessage", (message,username) => {
  
    var div = document.createElement("div");
    div.classList.add('message')

    var p = document.createElement("p");
    var span1 = document.createElement("span");
    span1.innerText = username ? username : 'Admin'
    span1.classList.add("message__name")

    var span2 = document.createElement("span");
    span2.innerText = moment().format("h:mm a")
    span2.classList.add("message__meta")

    p.append(span1)
    p.append(span2)
     
    div.append(p)
    div.innerHTML = div.innerHTML + "<p style='margin-top:-15px'>"+message+"</p>"

    document.querySelector('#messages').append(div)

});

socket.on("locationMessage", (url,username) => {
  
  var div = document.createElement("div");
  div.classList.add('message')

  var p = document.createElement("p");
  var span1 = document.createElement("span");
  span1.innerText = username ? username : 'Admin'
  span1.classList.add("message__name")

  var span2 = document.createElement("span");
  span2.innerText = moment().format("h:mm a")
  span2.classList.add("message__meta")

  p.append(span1)
  p.append(span2)

  var a = document.createElement("a"); 
  a.innerText = 'My Current location!'
  a.href = url
  a.target = "_blank"
  a.classList.add('adjust-location')

  div.append(p)
  div.append(a) 

  document.querySelector('#messages').append(div)
});

document.querySelector("#location").addEventListener("click", (event) => {
  if (!navigator.geolocation) {
    return alert("Geolocation is not supported by your browser.");
  }
  document
    .querySelector("#location")
    .setAttribute("disabled", "disabled");
  navigator.geolocation.getCurrentPosition((position) => {
    socket.emit(
      "sendLocation",
      {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      },
      (message) => {
        console.log(message);
      }
    );

    document.querySelector("#location").removeAttribute("disabled");
  });
});

const {username, room} = Qs.parse(location.search,{'ignoreQueryPrefix': true})

socket.emit('join',{username,room},(message)=>{
    if(message){
        alert(message)
        location.href = "/"
    }
})