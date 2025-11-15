import { useState } from "react";
import { MessageSquare, Send, Star } from "lucide-react";
import { Button } from "~~/components/ui/button";
import { Card } from "~~/components/ui/card";
import { Textarea } from "~~/components/ui/textarea";
import { mockFeedbacks } from "~~/data/mockData";
import type { Node } from "~~/types/monagraph";

interface FeedbackPanelProps {
  node: Node | null;
}

export function FeedbackPanel({ node }: FeedbackPanelProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (rating > 0 && node) {
      // In a real app, this would submit to backend
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setRating(0);
        setComment("");
      }, 3000);
    }
  };

  const nodeFeedbacks = mockFeedbacks.filter(fb => fb.nodeId === node?.id);

  return (
    <Card className="p-6 bg-black/40 border-[#961DD3]/30 backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="w-5 h-5 text-[#924BDD]" />
        <h2 className="text-xl font-semibold text-[#961DD3]">User Feedback Layer</h2>
      </div>

      {!node ? (
        <div className="text-center text-white/50 py-8">
          <p className="text-sm">Select a node to leave feedback</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Submit Feedback */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-white">Rate this node</h3>

            {/* Star Rating */}
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="text-3xl transition-all hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= (hoveredRating || rating) ? "fill-[#924BDD] text-[#924BDD]" : "text-white/20"
                    }`}
                  />
                </button>
              ))}
              {rating > 0 && <span className="text-white/70 ml-2 font-medium">{rating}.0</span>}
            </div>

            {/* Comment */}
            <div>
              <Textarea
                placeholder="Share your experience with this node... (optional)"
                value={comment}
                onChange={e => setComment(e.target.value)}
                className="bg-black/40 border-[#961DD3]/30 text-white placeholder:text-white/40 min-h-24"
              />
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              disabled={rating === 0 || submitted}
              className={`w-full ${submitted ? "bg-green-600 hover:bg-green-600" : "bg-[#924BDD] hover:bg-[#961DD3]"}`}
            >
              {submitted ? (
                <>
                  <span>✓ Feedback Submitted</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Submit Feedback
                </>
              )}
            </Button>

            <p className="text-xs text-white/40">Your feedback helps improve the network quality for everyone</p>
          </div>

          {/* Recent Feedback */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-white">Recent Feedback</h3>

            {nodeFeedbacks.length > 0 ? (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {nodeFeedbacks.map(feedback => (
                  <div key={feedback.id} className="bg-[#961DD3]/10 rounded-lg p-4 border border-[#961DD3]/20">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-white text-sm font-medium">{feedback.username}</p>
                        <p className="text-white/40 text-xs">
                          {feedback.timestamp.toLocaleDateString("ko-KR", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-[#924BDD] text-[#924BDD]" />
                        <span className="text-white font-medium">{feedback.rating}.0</span>
                      </div>
                    </div>
                    <p className="text-white/70 text-sm">{feedback.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-[#961DD3]/10 rounded-lg p-8 border border-[#961DD3]/20 text-center">
                <MessageSquare className="w-8 h-8 text-white/30 mx-auto mb-2" />
                <p className="text-white/50 text-sm">No feedback yet</p>
                <p className="text-white/40 text-xs mt-1">Be the first to rate this node!</p>
              </div>
            )}

            {/* Crowd-sourced indicator */}
            <div className="bg-black/40 rounded-lg p-3 border border-[#961DD3]/20">
              <p className="text-xs text-white/60">
                <span className="text-[#924BDD]">★</span> Crowd-sourced ratings reflect real-world performance
              </p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
