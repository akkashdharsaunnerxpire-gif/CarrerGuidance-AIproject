import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Home, Star, X, Smile } from "lucide-react";
import Stepper from "../../components/Stepper";
const API = import.meta.env.VITE_BACKEND_URL;

const CareerResult = () => {
  const navigate = useNavigate();

  const result = JSON.parse(localStorage.getItem("careerResult"));
  const user = JSON.parse(localStorage.getItem("user"));

  const [showReview, setShowReview] = useState(false);
  const [showThanks, setShowThanks] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  /* ================= REVIEW POPUP LOGIC (FIXED) ================= */
  useEffect(() => {
    const shouldShow = localStorage.getItem("showCareerReview");
    const alreadyReviewed = localStorage.getItem("careerReviewed");

    console.log("showCareerReview:", shouldShow);
    console.log("careerReviewed:", alreadyReviewed);

    // ✅ SAFE CONDITION
    if (shouldShow === "true" && !alreadyReviewed) {
      const timer = setTimeout(() => {
        setShowReview(true);
      }, 6000);

      return () => clearTimeout(timer);
    }
  }, []);

  if (!result || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  /* ================= SUBMIT REVIEW ================= */
  const submitReview = async () => {
    if (!comment.trim()) {
      alert("Please write a review");
      return;
    }

    try {
      setSubmitting(true);
      await axios.post(`${API}/review/add`, {

        user_uuid: user.uuid,
        rating,
        review: comment,
      });

      // ✅ PREVENT REVIEW AGAIN
      localStorage.removeItem("showCareerReview");
      localStorage.setItem("careerReviewed", "true");

      setShowReview(false);
      setShowThanks(true);

      setTimeout(() => {
        navigate("/dashboard");
      }, 2500);
    } catch (err) {
      console.error(err);
      alert("Review failed ❌");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Stepper currentStep={5} />

      <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 flex justify-center items-center px-4">
        {/* RESULT CARD */}
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-xl w-full">
          <h2 className="text-3xl font-bold text-center mb-6">
            AI Career Prediction
          </h2>

          {["top", "second", "third"].map(
            (k, i) =>
              result[k] && (
                <div
                  key={k}
                  className={`mb-4 p-4 rounded-xl ${
                    i === 0
                      ? "bg-green-100 border-l-4 border-green-600"
                      : "bg-gray-100"
                  }`}
                >
                  <h3 className="font-bold">
                    {i + 1}. {result[k].career}
                  </h3>
                  <p>Score: {result[k].score}</p>
                </div>
              ),
          )}

          <button
            onClick={() => navigate("/dashboard")}
            className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl flex items-center justify-center gap-2"
          >
            <Home size={18} /> Back to Dashboard
          </button>
        </div>

        {/* ================= REVIEW POPUP ================= */}
        {showReview && (
          <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-2xl w-full max-w-md relative">
              <button
                onClick={() => setShowReview(false)}
                className="absolute top-4 right-4"
              >
                <X />
              </button>

              <h3 className="text-xl font-bold text-center mb-4">
                Give your Review ⭐
              </h3>

              <div className="flex justify-center gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((r) => (
                  <Star
                    key={r}
                    onClick={() => setRating(r)}
                    className={`cursor-pointer ${
                      r <= rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>

              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Your feedback..."
                className="w-full border rounded-xl p-3 mb-4"
              />

              <button
                onClick={submitReview}
                disabled={submitting}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl"
              >
                {submitting ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          </div>
        )}

        {/* ================= THANK YOU (ADVANCED UI) ================= */}
        {showThanks && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div
              className="
                relative bg-white/90 backdrop-blur-xl
                rounded-3xl p-10 w-full max-w-md
                text-center shadow-2xl
                animate-[scaleFade_0.4s_ease-out]
              "
            >
              {/* GREEN RING */}
              <div className="relative w-24 h-24 mx-auto mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-green-200 animate-ping" />
                <div className="relative w-full h-full rounded-full bg-green-100 flex items-center justify-center">
                  <Smile size={48} className="text-green-600" />
                </div>
              </div>

              <h2 className="text-3xl font-extrabold text-gray-800 mb-2">
                Thank you for your feedback!
              </h2>

              <p className="text-gray-500 text-sm mb-6">
                Your review helps our AI improve career recommendations
              </p>

              {/* PROGRESS BAR */}
              <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 animate-[progress_2.5s_linear]" />
              </div>

              <p className="mt-4 text-xs text-gray-400">
                Redirecting to dashboard…
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CareerResult;
