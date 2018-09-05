(function() {
  getDynmaic();
})();

function loadIngState(loadingstate, errorMessage = "") {
  if (loadingstate === true) {
    var Containerloader = document.createElement("div");
    Containerloader.setAttribute("class", "Containerloader");
    document.body.append(Containerloader);

    var loader = document.createElement("div");
    loader.setAttribute("class", "loader");
    Containerloader.append(loader);
  }

  if (loadingstate === false) {
    var elem = document.getElementsByClassName("Containerloader")[0];
    elem.remove();
  }

  if (errorMessage.length > 0) {
    alert(errorMessage);
  }
}

function getDynmaic() {
  loadIngState(true);
  var request = new Request(
    "https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&maxResults=50&key=AIzaSyB3-Zt0C1NklDYxOFxokd7sV9V9nJYs0d4"
  );
  fetch(request)
    .then(response => {
      return response.json();
    })
    .then(response => {
      let { items } = response;
      let responseArray = items.map((el, i) => {
        let { id } = el;
        let { title, channelTitle, description } = el.snippet;
        let urlChoices = el.snippet.thumbnails;
        let { url } = urlChoices.default;
        return {
          id,
          title,
          channelTitle,
          description,
          url
        };
      });
      if (responseArray.length === 0) {
        loadIngState(true, "No movies returned");
      }
      loadIngState(false);
      this.createDivsToBeRepalced(responseArray);
    })
    .catch(function() {
      loadIngState(true, "No movies returned");
    });
}

function createDivsToBeRepalced(responseArray) {
  var videosContainer = document.getElementsByClassName("container")[0];

  responseArray.forEach(item => {
    var description = item["description"];
    var videoId = item["id"];
    var imageUrl = item["url"];
    var title = item["title"];

    var newVideoCard = this.createVideoCard(
      videoId,
      imageUrl,
      title,
      description
    );

    videosContainer.append(newVideoCard);
  });
  return true;
}

function removeModal() {
  var elem = document.getElementsByClassName("overlay-modal")[0];
  elem.remove();
}

function showVideo() {
  var videoId = this.id;
  var embedLink = `https://www.youtube.com/embed/${videoId}`;
  var newlyCreatedModal = createVideoModal(embedLink);
  var mainHoldingContainer = document.getElementsByClassName("container")[0];
  document.body.append(newlyCreatedModal);
}

function createVideoModal(videoUrl) {
  var fullModalContainer = document.createElement("div");
  fullModalContainer.setAttribute("class", "overlay-modal");

  var bkDiv = document.createElement("div");
  bkDiv.setAttribute("class", "over-bk");
  bkDiv.addEventListener("click", removeModal, false);

  fullModalContainer.append(bkDiv);

  var videoHolder = document.createElement("iframe");
  videoHolder.setAttribute("class", "video-holder");
  videoHolder.src = videoUrl;

  bkDiv.append(videoHolder);

  return fullModalContainer;
}

function showHoverDesc(evt) {
  var handleOnId = this.id;
  document.getElementById(handleOnId).innerHTML = evt.target.desc;
}

function HideDesc(evt) {
  var handleOnId = this.id;
  document.getElementById(handleOnId).innerHTML = evt.target.title;
}

function createVideoTitle(titleText) {
  var div = document.createElement("div");
  var uniqueID = Math.random()
    .toString(36)
    .substr(2, 9);
  div.setAttribute("class", "video-title");
  div.setAttribute("id", uniqueID);
  div.innerHTML = titleText;
  return div;
}

function createVideoDescription(description) {
  var div = document.createElement("div");
  div.setAttribute("class", "video-description");
  div.innerHTML = description;
  return div;
}

function createThumbNail(id, url) {
  var img = document.createElement("img");
  img.src = url;
  img.setAttribute("class", "video-img");
  return img;
}

function createVideoCard(videoId, imageUrl, title, description) {
  var newVideoCard = document.createElement("div");
  newVideoCard.setAttribute("class", "video-card");
  newVideoCard.setAttribute("id", videoId);

  var descriptionForVideoDesc = createVideoDescription(description);

  var titleForVideoCard = createVideoTitle(title);
  var newVideoImage = this.createThumbNail(videoId, imageUrl);

  newVideoCard.append(newVideoImage);
  newVideoCard.append(titleForVideoCard);

  titleForVideoCard.addEventListener("mouseover", showHoverDesc, false);
  titleForVideoCard.desc = trunciateDesc(description);
  titleForVideoCard.addEventListener("mouseout", HideDesc, false);
  titleForVideoCard.title = title;

  newVideoCard.addEventListener("click", showVideo, false);
  return newVideoCard;
}

function trunciateDesc(string) {
  return string.substring(0, 120) + "...";
}
