import axios from "axios";

export default {

  getUser: function(id) {
    return axios.get("/api/users/" + id);
  },

  createUser: function(req) {
    return axios.post("/api/users", req);
  },

  updateUser: function(id, req) {
    return axios.put("/api/users/" + id, req);
  },

  deleteUser: function(id) {
    return axios.delete("/api/users/" + id);
  },

  getAllGigs: function() {
    return axios.get("/api/gigs");
  },

  getOneGig: function(id) {
    return axios.get("/api/gigs/" + id);
  },

  createGig: function(req) {
    return axios.post("/api/gigs", req);
  },

  updateGig: function(id, req) {
    return axios.put("/api/gigs/" + id, req);
  },

  deleteGig: function(id, authorId) {
    return axios.delete("/api/gigs/" + id + "/" + authorId);
  },

  getAllComments: function() {
    return axios.get("/api/comments");
  },

  getOneComment: function(id) {
    return axios.get("/api/comments/" + id);
  },

  createComment: function(req) {
    return axios.post("/api/comments", req);
  },

  updateComment: function(id, req) {
    return axios.put("/api/comments/" + id, req);
  },

  deleteComment: function(id) {
    return axios.delete("/api/comments/" + id);
  }

};
