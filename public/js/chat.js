const socket = io();

//elements
const $messageForm = document.querySelector("#chatMessage");
const $messageFormInput = document.querySelector("#message");
const $messageFormButton = document.querySelector("#submit");
const $sendLocationButton = document.querySelector("#sendLocation");
const $message = document.querySelector("#messages");

const locationTemplate = document.querySelector("#location-template").innerHTML;
const messageTemplate = document.querySelector("#message-template").innerHTML;

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

socket.on("message", (message) => {
  console.log(message);
  const html = Mustache.render(messageTemplate, {
    message: message.text,
    createdAt: moment(message.createdAt).format("h:mm a"),
  });
  $message.insertAdjacentHTML("beforeend", html);
});

$messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = e.target.elements.message.value;
  $messageFormButton.setAttribute("disabled", "disabled");
  socket.emit("sendMessage", message, (error) => {
    $messageFormButton.removeAttribute("disabled", "disabled");
    $messageFormInput.value = "";
    $messageFormInput.focus();
    if (error) {
      return console.log(error);
    }
    console.log("message was delivered !");
  });
});

$sendLocationButton.addEventListener("click", () => {
  if (!navigator.geolocation) {
    return alert("your browser doesnt support this feature");
  }
  $sendLocationButton.setAttribute("disabled", "disabled");

  navigator.geolocation.getCurrentPosition(({ coords }) => {
    socket.emit(
      "sendLocation",
      {
        latitude: coords.latitude,
        longitude: coords.longitude,
      },
      () => {
        $sendLocationButton.removeAttribute("disabled", "disabled");
        console.log("location shared");
      }
    );
  });
});

socket.on("locationMessage", (location) => {
  const html = Mustache.render(locationTemplate, {
    location: location.url,
    createdAt: moment(location.createdAt).format("h:mm a"),
  });
  $message.insertAdjacentHTML("beforeend", html);
});

socket.emit("join", { username, room });
