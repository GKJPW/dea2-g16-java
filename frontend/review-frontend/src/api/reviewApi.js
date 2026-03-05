import api from "./axios";

export const getReviews = () => api.get("/reviews");

export const addReview = (review) => api.post("/reviews", review);