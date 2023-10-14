const Video = require("../models/video.model");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");

const getAllVideo = async () => {
  try {
    let video;
    video = await Video.find({});
    return video;
  } catch (error) {
    console.error("Error getAllvideos views:", error);
    throw error; // Throw the error if any occurs
  }
};

const getVideo = async (id) => {
  return await Video.findById(id);
};

const addVideo = async (data) => {
  let newVideo = await Video.create({
    videoLink: data.videoLink,
    title: data.title,
    genre: data.genre,
    contentRating: data.contentRating,
    releaseDate: data.releaseDate,
    previewImage: data.previewImage,
  });
  if (!newVideo) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Video Upload failed!");
  }
  newVideo = await newVideo.save();
  return newVideo;
};

const updateVotes = async (id, vote, change) => {
  let data = await Video.findById(id);

  if (!data) {
    throw new ApiError(httpStatus.BAD_REQUEST, "VideoId must be a valid Id");
  }
  if (vote === "upVote" && change === "increase") {
    data.votes.upVotes = data.votes.upVotes + 1;
  }
  if (vote == "downVote" && change == "increase") {
    data.votes.downVotes++;
  }
  if (vote == "upVote" && change == "decrease") {
    data.votes.upVotes--;
  }
  if (vote == "downVote" && change == "decrease") {
    data.votes.downVotes--;
  }

  data = await data.save();
  return data;
};
const updateViews = async (videoId) => {
  try {
    let video; // Declare video outside the try block

    video = await Video.findById(videoId);

    if (!video) {
     // console.error("Video not found for id:", videoId);
      return null; // Return null if the video is not found
    }

    video.viewCount += 1; // Increment the viewCount
    await video.save(); // Save the updated video

    return video; // Return the updated video
  } catch (error) {
   // console.error("Error updating views:", error);
    throw error; // Throw the error if any occurs
  }
};

module.exports = {
  getAllVideo,
  getVideo,
  addVideo,
  updateVotes,
  updateViews,
};
