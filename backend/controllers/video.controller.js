const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const videoService = require("../services/video.service");

const getAllVideos = catchAsync(async (req, res) => {
  const videos = await videoService.getAllVideo();
  if (Object.keys(req.query).length === 0 && req.query.constructor === Object) {
    res.status(200).json({ videos: videos });
  } else {
    if (req.query.sortBy) {
      let sortedVideos = await getVideoBySort(videos, req.query.sortBy);
      res.status(200).json({ videos: sortedVideos });
    } else {
      let filters = req.query;
      console.log(filters);
      let filteredVideos = videos.filter((video) => {
        let isValid = true;
        for (key in filters) {
          let gen;
          // let age;
          if (key === "genres") {
            gen = filters[key].split(",");
            isValid = isValid && gen.includes(video["genre"]);
          }
          else if (key === "contentRating") {
            if (filters[key] === "18+") {
              age = [ "18+"];
              isValid = isValid && age.includes(video["contentRating"]);
            }
            if (filters[key] === "16+") {
              age = ["7+", "12+", "16+"];
              isValid = isValid && age.includes(video["contentRating"]);
            }
            if (filters[key] === "12+") {
              age = ["7+", "12+"];
              isValid = isValid && age.includes(video["contentRating"]);
            }
            if (filters[key] === "7+") {
              age = ["7+"];
              isValid = isValid && age.includes(video["contentRating"]);
            }
            if (filters[key] === "12+") {
              isValid = isValid && video["contentRating"] === "12+";
            }
          }
          // console.log(key, video[key], filters[key])
          else{
            console.log("----------- Else block------------",key, video[key], filters[key])
            isValid =
              isValid &&
              (video[key].toLowerCase()).includes(filters[key].toLowerCase());
          }
        }
        return isValid;
      });
      res.status(200).json({ videos: filteredVideos });
    }
  }
});

const getVideo = catchAsync(async (req, res) => {
  let uid = req.params.videoId;
  const video = await videoService.getVideo(uid);
  if (!video) {
    throw new ApiError(httpStatus.NOT_FOUND, "No video found with matching id");
  }
  res.status(200).send(video);
});

const addVideo = catchAsync(async (req, res) => {
  const data = await videoService.addVideo(req.body);
  if (!data) {
    throw new ApiError(httpStatus.BAD_REQUEST, "");
  }
  res.status(201).send(data);
});

const updateVotes = catchAsync(async (req, res) => {
  let uid = req.params.videoId;
  const video = await videoService.updateVotes(
    uid,
    req.body.vote,
    req.body.change
  );
  if (!video) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Video Id is not correct");
  }
  res.status(204).send();
});

const updateViews = catchAsync(async (req, res) => {
  let uid = req.params.videoId;
  console.log("Updating views for videoId:", uid); // Add this line
  const video = await videoService.updateViews(uid);
  if (!video) {
    console.error("Video not found for id:", uid);
    throw new ApiError(httpStatus.BAD_REQUEST, "Video Id is not correct");
  }
  res.status(httpStatus.NO_CONTENT).send();
});

const getVideoBySort = (videos, sortby) => {
  if (sortby === "releaseDate") {
    let data = videos.slice().sort((a, b) => b.releaseDate - a.releaseDate);
    return data;
  }
  if (sortby === "viewCount") {
    let data = videos.slice().sort((a, b) => b.viewCount - a.viewCount);
    return data;
  }
};

module.exports = {
  getAllVideos,
  getVideo,
  addVideo,
  updateVotes,
  updateViews,
};
