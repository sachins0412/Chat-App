const socket = io();

socket.on("message", (message) => {
  console.log(message);
});

document.querySelector("#chatMessage").addEventListener("submit", (e) => {
  e.preventDefault();
  const message = e.target.elements.message.value;
  socket.emit("sendMessage", message);
});

document.querySelector("#sendLocation").addEventListener("click", () => {
  if (!navigator.geolocation) {
    return alert("your browser doesnt support this feature");
  }

  navigator.geolocation.getCurrentPosition(({ coords }) => {
    console.log(coords.latitude, coords.longitude);
    socket.emit("sendLocation", {
      latitude: coords.latitude,
      longitude: coords.longitude,
    });
  });
});
