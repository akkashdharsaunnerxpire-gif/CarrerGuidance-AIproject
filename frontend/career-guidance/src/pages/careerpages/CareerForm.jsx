import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Stepper from "../../components/Stepper";
import { Loader2 } from "lucide-react";

/* ================= SKILLS ================= */

const IT_SKILLS = [
  { key: "programming", label: "Programming" },
  { key: "ai_ml", label: "AI / ML" },
  { key: "data_science", label: "Data Science" },
  { key: "web", label: "Web Development" },
  { key: "communication", label: "Communication" },
  { key: "leadership", label: "Leadership" },
];

const OTHER_SKILLS = [
  { key: "subject_knowledge", label: "Subject Knowledge" },
  { key: "creativity", label: "Creativity" },
  { key: "decision_making", label: "Decision Making" },
  { key: "stress_handling", label: "Stress Handling" },
  { key: "management", label: "Management Skill" },
];

const API = import.meta.env.VITE_BACKEND_URL;
const CareerForm = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const fieldType = localStorage.getItem("fieldType") || "IT";
  const personality =
    JSON.parse(localStorage.getItem("personalityResult"))?.finalTrait ||
    "Analytical";

  const skillsConfig = fieldType === "IT" ? IT_SKILLS : OTHER_SKILLS;

  const initialData = {};
  skillsConfig.forEach((s) => (initialData[s.key] = 4));

  const [formData, setFormData] = useState({
    ...initialData,
    personality,
    fieldType,
  });

  const [loading, setLoading] = useState(false);

  /* ================= SUBMIT ================= */

  const handleSubmit = async () => {
    if (!user?.uuid) return alert("Login required");

    try {
      setLoading(true);
      const res = await axios.post(`${API}/career/predict`, formData, {
        params: { user_uuid: user.uuid },
      });

      setTimeout(() => {
        localStorage.setItem("careerResult", JSON.stringify(res.data));

        // 🔥 THIS WAS MISSING
        localStorage.setItem("showCareerReview", "true");

        navigate("/career-result");
      }, 5000);
    } catch {
      alert("Prediction failed");
      setLoading(false);
    }
  };

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <Loader2 className="animate-spin mx-auto mb-4" size={40} />
          <h2 className="text-xl font-semibold">Analyzing your profile…</h2>
          <p className="text-gray-500 text-sm mt-1">
            AI is finding the best career for you
          </p>
        </div>
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <>
      <Stepper currentStep={4} />
      <div className="min-h-screen bg-gray-50 flex justify-center px-4 py-10">
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-md p-8">
          {/* STEPPER */}

          {/* HEADER */}
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800">
              Skill Assessment
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Rate your skill level honestly
            </p>
          </div>

          {/* SKILLS */}
          <div className="space-y-6">
            {skillsConfig.map((skill) => (
              <div key={skill.key}>
                <div className="flex justify-between mb-1">
                  <span className="font-medium text-gray-700">
                    {skill.label}
                  </span>
                  <span className="text-sm text-gray-500">
                    Level {formData[skill.key]}
                  </span>
                </div>

                <input
                  type="range"
                  min="1"
                  max="7"
                  value={formData[skill.key]}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      [skill.key]: Number(e.target.value),
                    }))
                  }
                  className="w-full accent-indigo-600"
                />
              </div>
            ))}
          </div>

          {/* SUBMIT */}
          <button
            onClick={handleSubmit}
            className="
          mt-10 w-full py-3 rounded-xl
          bg-indigo-600 text-white font-semibold
          hover:bg-indigo-700 transition
          "
          >
            Analyze My Career
          </button>
        </div>
      </div>
    </>
  );
};

export default CareerForm;
