var socket = io();

document.querySelector("#send").addEventListener("click", (event) => {
  event.preventDefault();

  let message = document.querySelector("#inputMessage").value;

  if (message.length != 0) {
    document.querySelector("#send").setAttribute("disabled", "disabled");

    socket.emit("sendMessage", message, (message) => {
      
    });

    document.querySelector("#send").removeAttribute("disabled");

    document.querySelector("#inputMessage").value = "";
    document.querySelector("#inputMessage").focus();
  } else {
    alert("Enter message");
  }
});

socket.on('liveUsers',(roomData)=>{

    document.querySelector('.chat__sidebar').innerHTML = ""

    document.querySelector('.chat__sidebar').innerHTML = document.querySelector('.chat__sidebar').innerHTML + "<h2 class='room-title'>"+roomData['room']+"</h2>"
    
    document.querySelector('.chat__sidebar').innerHTML = document.querySelector('.chat__sidebar').innerHTML + "<h3 class='list-title'>Active Users</h3>"

    let ul = document.createElement('ul')
    ul.classList.add('users')

    roomData['activeUsers'].forEach(user => {
        let li = document.createElement('li')
        li.innerHTML = "<i class='fas fa-circle'></i> " + user['username']

        ul.append(li)
    })

    document.querySelector('.chat__sidebar').append(ul)
})

let autoscroll = ()=> {
   
    const newMessage = document.querySelector('#messages').lastElementChild
    const newMessageStyles = getComputedStyle(newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)

    const newMessageHeight = newMessage.offsetHeight + newMessageMargin

    //visible height from top till send butoon
    const visibleHeight = document.querySelector('#messages').offsetHeight

    //Height of message container
    const containerHeight = document.querySelector('#messages').scrollHeight

    // How far have i scrolled?
    const scrollOffset = document.querySelector('#messages').scrollTop + visibleHeight

    if(containerHeight - newMessageHeight <= scrollOffset){
        document.querySelector('#messages').scrollTop = document.querySelector('#messages').scrollHeight
    }
}

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
    autoscroll()

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
  autoscroll()
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