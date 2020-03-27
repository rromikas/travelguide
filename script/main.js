let zoom = 14;
let initialX = 2123216,
  initialY = 1442372;
let map = L.map("mapObj", { zoom: zoom });
let popover;
let marker;
let places = {};
places["eifel"] = [48.8584, 2.2945];
places["dOrsay"] = [48.86, 2.3266];
places["louvre"] = [48.8606, 2.3376];
places["arcDeTriomphe"] = [48.8738, 2.295];

function loadMap() {
  let x = 2123216,
    y = 1442372,
    limitX = 2125716,
    limitY = 1444872;
  let row = document.createElement("div");
  row.className = "row";
  while (y <= limitY) {
    let img = document.createElement("img");
    img.src = `./maps/france/${x}_${y}_${zoom}.png`;
    row.appendChild(img);
    x += 500;
    if (x > limitX) {
      document.getElementById("swipeable").appendChild(row);
      x = initialX;
      y += 500;
      row = document.createElement("div");
      row.className = "row";
    }
  }
}

loadMap();

function centerMe(place) {
  console.log("outers ", window.outerWidth, window.outerHeight);
  let dx = window.innerWidth / 2; // max distance from center to left/right
  let dy = window.innerHeight / 2; // max distance from center to top/bottom
  let pos = map.project(places[place], zoom);
  transforms = {
    x: -(pos.x - initialX - dx),
    y: -(pos.y - initialY + 500 - dy)
  };

  validateTransforms();

  swipeable.style.transition = "transform 0.5s";
  swipeable.style.transform = `translate(${transforms.x}px, ${transforms.y}px)`;
}

function findPlace(place) {
  let coords = map.project(places[place], zoom);
  console.log(coords);
  let xOffs = coords.x - initialX;
  let yOffs = coords.y - initialY + 500;
  //   console.log(xOffs, yOffs, x, y);
  if (!marker) {
    marker = document.createElement("div");
    marker.className = "marker";
  }

  marker.style.left = `${xOffs - 12}px`;
  marker.style.top = `${yOffs - 12}px`;
  swipeable.appendChild(marker);
  centerMe(place);
  setTimeout(() => {
    showPopover(place);
  }, 500);
}

function search() {
  let slat = document.getElementById("latitude").value;
  let slon = document.getElementById("longtitude").value;
  let coords = map.project([slat, slon], zoom);
  console.log(coords);
  let xOffs = coords.x - initialX;
  let yOffs = coords.y - initialY + 500;
  //   console.log(xOffs, yOffs, x, y);
  if (!marker) {
    marker = document.createElement("div");
    marker.className = "marker";
  }

  marker.style.left = `${xOffs - 12}px`;
  marker.style.top = `${yOffs - 12}px`;
  swipeable.appendChild(marker);
  console.log(slat, slon);
  places["kazkas"] = [slat, slon];
  centerMe("kazkas");
}

function showPopover(place) {
  const template = document.getElementById(`template-${place}`);

  if (popover) {
    popover[0].destroy();
  }

  popover = tippy(".marker", {
    content: template.innerHTML,
    allowHTML: true,
    placement: "right"
    //   placement: 'right-start',
  });

  console.log(popover);
  popover[0].show();
}

let transforms = { x: 0, y: 0 };

let swipeable = document.getElementById("swipeable");

swipeable.addEventListener("mousedown", handleMouseDown, false);
swipeable.addEventListener("mouseup", handleMouseUp, false);
swipeable.addEventListener("mouseout", handleMouseOut, false);
var xDown = null;
var yDown = null;

function validateTransforms() {
  if (transforms.x > 0) {
    transforms.x = 0;
  }

  if (transforms.x * -1 > 3000 - window.innerWidth) {
    transforms.x = -(3000 - window.innerWidth);
  }

  if (transforms.y > 0) {
    transforms.y = 0;
  }

  if (transforms.y * -1 > 3000 - window.innerHeight) {
    transforms.y = -(3000 - window.innerHeight);
  }
}

function handleMouseOut(evt) {
  document.removeEventListener("mousemove", handleMouseMove);
  swipeable.style.cursor = "grab";
}

function getTouches(evt) {
  return (
    evt.touches || evt.originalEvent.touches // browser API
  ); // jQuery
}

function handleMouseUp() {
  //   alert("mouseup");
  document.removeEventListener("mousemove", handleMouseMove);
  swipeable.style.cursor = "grab";
}

function handleMouseDown(evt) {
  //   alert("mousedowwn");
  evt.preventDefault();
  swipeable.style.cursor = "grabbing";
  document.addEventListener("mousemove", handleMouseMove, false);
  xDown = evt.clientX;
  yDown = evt.clientY;
}

function handleMouseMove(evt) {
  if (!xDown || !yDown) {
    return;
  }

  var xUp = evt.clientX;
  var yUp = evt.clientY;

  var xDiff = xDown - xUp;
  var yDiff = yDown - yUp;

  transforms.x -= xDiff;

  transforms.y -= yDiff;

  validateTransforms();

  swipeable.style.transition = "unset";
  swipeable.style.transform = `translate(${transforms.x}px, ${transforms.y}px)`;

  xDown = xUp;
  yDown = yUp;
}

swipeable.addEventListener("touchstart", handleTouchStart, false);
swipeable.addEventListener("touchmove", handleTouchMove, false);

function getTouches(evt) {
  return (
    evt.touches || evt.originalEvent.touches // browser API
  ); // jQuery
}

function handleTouchStart(evt) {
  evt.preventDefault();
  const firstTouch = getTouches(evt)[0];
  xDown = firstTouch.clientX;
  yDown = firstTouch.clientY;
}

function handleTouchMove(evt) {
  if (!xDown || !yDown) {
    return;
  }
  console.log(evt.touches);

  var xUp = evt.touches[0].clientX;
  var yUp = evt.touches[0].clientY;

  var xDiff = xDown - xUp;
  var yDiff = yDown - yUp;

  transforms.x -= xDiff;
  transforms.y -= yDiff;

  validateTransforms();

  swipeable.style.transition = "unset";
  swipeable.style.transform = `translate(${transforms.x}px, ${transforms.y}px)`;

  if (Math.abs(xDiff) > Math.abs(yDiff)) {
    /*most significant*/
    if (xDiff > 0) {
      /* left swipe */
    } else {
      /* right swipe */
    }
  } else {
    if (yDiff > 0) {
      /* up swipe */
    } else {
      /* down swipe */
    }
  }
  /* reset values */
  xDown = xUp;
  yDown = yUp;
}
