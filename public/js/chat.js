const socket = io();

//elements
const $messageForm = document.querySelector("#chatMessage");
const $messageFormInput = document.querySelector("#message");
const $messageFormButton = document.querySelector("#submit");
const $sendLocationButton = document.querySelector("#sendLocation");
const $message = document.querySelector("#messages");

const locationTemplate = document.querySelector("#location-template").innerHTML;
const messageTemplate = document.querySelector("#message-template").innerHTML;
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML;

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const autoScroll = () => {
  const element = $message.lastElementChild;
  element.scrollIntoView({
    behavior: "smooth",
    block: "end",
    inline: "nearest",
  });
};

socket.on("message", (message) => {
  const html = Mustache.render(messageTemplate, {
    username: message.username,
    message: message.text,
    createdAt: moment(message.createdAt).format("h:mm a"),
  });
  $message.insertAdjacentHTML("beforeend", html);
  autoScroll();
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
    username: location.username,
    location: location.url,
    createdAt: moment(location.createdAt).format("h:mm a"),
  });
  $message.insertAdjacentHTML("beforeend", html);
  autoScroll();
});

socket.emit("join", { username, room }, (error) => {
  if (error) {
    alert(error);
    location.href = "/";
  }
});

socket.on("roomData", ({ room, users }) => {
  const html = Mustache.render(sidebarTemplate, {
    room,
    users,
  });
  document.querySelector("#sidebar").innerHTML = html;
});
