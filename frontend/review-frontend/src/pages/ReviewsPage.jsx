import { useEffect, useState } from "react";
import { getReviews, addReview } from "../api/reviewApi";
import "./ReviewsPage.css";

export default function ReviewsPage() {
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  // Load reviews
  const loadReviews = async () => {
    try {
      const res = await getReviews();
      setReviews(res.data || []);
    } catch (err) {
      console.error(err);
      setMsg("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  // Add review
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");

    try {
      await addReview({
        name,
        comment,
        rating: Number(rating),
      });

      setMsg("Review added!");
      setName("");
      setComment("");
      setRating(5);

      loadReviews();
    } catch (err) {
      console.error(err);
      setMsg("Failed. Check backend + validations");
    }
  };

  return (
    <div className="page">
      <div className="container">

        {/* Add Review Card */}
        <div className="card">
          <div className="title">Review Service</div>

          <form onSubmit={handleSubmit}>
            <input
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <textarea
              placeholder="Comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              required
            />

            <div className="rating">
              Rating:
              <input
                type="number"
                min="1"
                max="5"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
              />
            </div>

            <button className="primary" type="submit">
              Add Review
            </button>
          </form>

          {msg && (
            <div className={msg.includes("added") ? "success" : "error"}>
              {msg}
            </div>
          )}
        </div>

        {/* Reviews List */}
        <div className="card">
          <h3>All Reviews</h3>

          {loading && <p>Loading...</p>}

          {!loading && reviews.length === 0 && <p>No reviews yet.</p>}

          {reviews.map((r) => (
            <div key={r.id} className="review">
              <div className="reviewHead">
                <strong>{r.name}</strong>
                <span className="ratingStar">⭐ {r.rating}</span>
              </div>

              <p className="comment">{r.comment}</p>

              <div className="reviewActions">
                <button className="secondary">Edit</button>
                <button className="danger">Delete</button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}