import { useState, useEffect } from "react";
import { Star } from "lucide-react";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rate: number, comment: string) => void;
}

export default function ReviewModal({
  isOpen,
  onClose,
  onSubmit,
}: ReviewModalProps) {
  const [rate, setRate] = useState(0);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      setRate(0);
      setComment("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center px-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-xl"
        >
          &times;
        </button>
        <h2 className="text-lg font-semibold mb-4 text-dark-2">
          Leave a Review
        </h2>
        <div className="flex gap-1 mb-4">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star
              key={s}
              onClick={() => setRate(s)}
              className={`w-6 h-6 cursor-pointer ${
                s <= rate ? "text-yellow-500" : "text-gray-300"
              }`}
              fill={s <= rate ? "currentColor" : "none"}
            />
          ))}
        </div>
        <textarea
          className="w-full p-2 border rounded mb-4 text-dark-2"
          rows={4}
          placeholder="Write your comment (optional)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 text-sm border rounded text-dark-2"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
            onClick={() => onSubmit(rate, comment)}
            disabled={rate < 1}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
