"use client";
import React from "react";

function MainComponent() {
  const [activeSubject, setActiveSubject] = React.useState("math");
  const [selectedTopic, setSelectedTopic] = React.useState(null);
  const [studyContent, setStudyContent] = React.useState(null);
  const [userProgress, setUserProgress] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [showDashboard, setShowDashboard] = React.useState(true);

  const { data: user, loading: userLoading } = useUser();

  const subjects = {
    math: {
      name: "Mathematics",
      icon: "fa-calculator",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-gradient-to-br from-blue-50 to-blue-100",
      textColor: "text-blue-600",
      topics: [
        "Algebra",
        "Geometry",
        "Trigonometry",
        "Statistics",
        "Probability",
      ],
    },
    science: {
      name: "Science",
      icon: "fa-flask",
      color: "from-green-500 to-green-600",
      bgColor: "bg-gradient-to-br from-green-50 to-green-100",
      textColor: "text-green-600",
      topics: [
        "Physics",
        "Chemistry",
        "Biology",
        "Light & Reflection",
        "Acids & Bases",
      ],
    },
    english: {
      name: "English",
      icon: "fa-book",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-gradient-to-br from-purple-50 to-purple-100",
      textColor: "text-purple-600",
      topics: [
        "Grammar",
        "Literature",
        "Writing Skills",
        "Reading Comprehension",
        "Poetry",
      ],
    },
    social: {
      name: "Social Studies",
      icon: "fa-globe",
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-gradient-to-br from-orange-50 to-orange-100",
      textColor: "text-orange-600",
      topics: [
        "History",
        "Geography",
        "Political Science",
        "Economics",
        "Civics",
      ],
    },
  };

  const currentSubject = subjects[activeSubject];

  // Load user progress
  React.useEffect(() => {
    if (user) {
      loadUserProgress();
    }
  }, [user, activeSubject]);

  const loadUserProgress = async () => {
    try {
      const response = await fetch("/api/get-user-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject: activeSubject }),
      });
      const data = await response.json();
      if (data.error) {
        console.error("Progress error:", data.error);
        return;
      }
      const progressMap = {};
      data.progress?.forEach((p) => {
        progressMap[p.topic] = p;
      });
      setUserProgress(progressMap);
    } catch (error) {
      console.error("Failed to load progress:", error);
    }
  };

  const updateProgress = async (topic, updates) => {
    try {
      const response = await fetch("/api/update-user-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: activeSubject,
          topic,
          ...updates,
        }),
      });
      const data = await response.json();
      if (data.success) {
        loadUserProgress();
      }
    } catch (error) {
      console.error("Failed to update progress:", error);
    }
  };

  const loadStudyContent = async (topic) => {
    setLoading(true);
    try {
      const response = await fetch("/api/get-study-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject: activeSubject, topic }),
      });
      const data = await response.json();
      if (data.success) {
        setStudyContent(data);
        updateProgress(topic, { notesRead: true });
      }
    } catch (error) {
      console.error("Failed to load study content:", error);
    }
    setLoading(false);
  };

  const handleTopicClick = (topic) => {
    setSelectedTopic(topic);
    setShowDashboard(false);
    loadStudyContent(topic);
  };

  const handleVideoWatch = (topic) => {
    updateProgress(topic, { videoWatched: true });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const getOverallProgress = () => {
    const allTopics = Object.values(subjects).flatMap((s) => s.topics);
    const completedTopics = Object.values(userProgress).filter(
      (p) => p.completed
    ).length;
    return Math.round((completedTopics / allTopics.length) * 100) || 0;
  };

  const getSubjectProgress = (subjectKey) => {
    const subjectTopics = subjects[subjectKey].topics;
    const completedInSubject = subjectTopics.filter(
      (topic) => userProgress[topic]?.completed
    ).length;
    return Math.round((completedInSubject / subjectTopics.length) * 100) || 0;
  };

  if (userLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">
            Loading your learning hub...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <i className="fas fa-graduation-cap text-white text-3xl"></i>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Class 10 Learning Hub
            </h1>
            <p className="text-gray-600 text-lg">
              Your personalized learning companion for academic excellence
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="space-y-4">
              <a
                href="/account/signin"
                className="block w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold text-center hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
              >
                <i className="fas fa-sign-in-alt mr-2"></i>
                Sign In to Continue
              </a>
              <a
                href="/account/signup"
                className="block w-full border-2 border-indigo-200 text-indigo-600 py-4 px-6 rounded-xl font-semibold text-center hover:bg-indigo-50 transition-all duration-200"
              >
                <i className="fas fa-user-plus mr-2"></i>
                Create New Account
              </a>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-indigo-600">4</div>
                  <div className="text-sm text-gray-600">Subjects</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">20+</div>
                  <div className="text-sm text-gray-600">Topics</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Study Content UI
  if (selectedTopic && studyContent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 font-inter">
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => {
                  setSelectedTopic(null);
                  setStudyContent(null);
                  setShowDashboard(true);
                }}
                className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <i className="fas fa-arrow-left text-gray-600"></i>
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {selectedTopic}
                </h1>
                <p className="text-sm text-gray-600">{currentSubject.name}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Video Content */}
            {studyContent.videoContent.length > 0 && (
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    <i className="fas fa-play-circle text-red-600 mr-2"></i>
                    Video Lessons
                  </h2>
                  {studyContent.videoContent.map((video) => (
                    <div key={video.id} className="mb-6 last:mb-0">
                      <div className="aspect-video bg-black rounded-xl overflow-hidden mb-3 shadow-lg">
                        <iframe
                          src={`https://www.youtube.com/embed/${video.youtube_id}`}
                          title={video.title}
                          className="w-full h-full"
                          frameBorder="0"
                          allowFullScreen
                          onLoad={() => handleVideoWatch(selectedTopic)}
                        ></iframe>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {video.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {video.description}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>
                          <i className="fas fa-clock mr-1"></i>
                          {Math.floor(video.duration / 60)} min
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full ${
                            video.difficulty === "easy"
                              ? "bg-green-100 text-green-800"
                              : video.difficulty === "hard"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {video.difficulty}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Study Notes */}
            <div
              className={
                studyContent.videoContent.length > 0
                  ? "lg:col-span-1"
                  : "lg:col-span-3"
              }
            >
              {studyContent.studyNotes.map((note) => (
                <div
                  key={note.id}
                  className="bg-white rounded-2xl shadow-lg p-6 mb-6"
                >
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    <i className="fas fa-book-open text-blue-600 mr-2"></i>
                    {note.title}
                  </h2>

                  <div className="prose max-w-none mb-6">
                    <p className="text-gray-700 leading-relaxed">
                      {note.content}
                    </p>
                  </div>

                  {note.key_points && note.key_points.length > 0 && (
                    <div className="mb-6">
                      <h3 className="font-medium text-gray-900 mb-3">
                        Key Points
                      </h3>
                      <ul className="space-y-2">
                        {note.key_points.map((point, index) => (
                          <li key={index} className="flex items-start">
                            <i className="fas fa-check-circle text-green-600 mr-2 mt-1 text-sm"></i>
                            <span className="text-gray-700">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {note.formulas && note.formulas.length > 0 && (
                    <div className="mb-6">
                      <h3 className="font-medium text-gray-900 mb-3">
                        Important Formulas
                      </h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        {note.formulas.map((formula, index) => (
                          <div
                            key={index}
                            className="font-mono text-sm text-gray-800 mb-2 last:mb-0"
                          >
                            {formula}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {note.examples && (
                    <div>
                      <h3 className="font-medium text-gray-900 mb-3">
                        Examples
                      </h3>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-blue-800 text-sm">{note.examples}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Dashboard UI
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 font-inter">
      {/* Modern Header */}
      <div className="bg-white/80 backdrop-blur-lg shadow-sm border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <i className="fas fa-graduation-cap text-white text-xl"></i>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Class 10 Learning Hub
                </h1>
                <p className="text-sm text-gray-600">
                  {getGreeting()}, {user.name || user.email?.split("@")[0]}! 👋
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-600">
                    {getOverallProgress()}%
                  </div>
                  <div className="text-xs text-gray-600">Overall Progress</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {
                      Object.values(userProgress).filter((p) => p.completed)
                        .length
                    }
                  </div>
                  <div className="text-xs text-gray-600">Topics Completed</div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                  <i className="fas fa-user text-gray-600"></i>
                </div>
                <a
                  href="/account/logout"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  title="Sign Out"
                >
                  <i className="fas fa-sign-out-alt"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-2">Ready to Learn Today?</h2>
              <p className="text-white/90 text-lg mb-6">
                Continue your learning journey and achieve your academic goals
              </p>
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <i className="fas fa-trophy text-yellow-300"></i>
                  </div>
                  <div>
                    <div className="font-semibold">
                      {getOverallProgress()}% Complete
                    </div>
                    <div className="text-sm text-white/80">
                      Overall Progress
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <i className="fas fa-fire text-orange-300"></i>
                  </div>
                  <div>
                    <div className="font-semibold">
                      {
                        Object.values(userProgress).filter(
                          (p) => p.video_watched
                        ).length
                      }{" "}
                      Videos
                    </div>
                    <div className="text-sm text-white/80">Watched</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Subject Cards Grid */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            Choose Your Subject
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(subjects).map(([key, subject]) => {
              const progress = getSubjectProgress(key);
              const completedTopics = subject.topics.filter(
                (topic) => userProgress[topic]?.completed
              ).length;

              return (
                <div
                  key={key}
                  onClick={() => {
                    setActiveSubject(key);
                    setShowDashboard(false);
                  }}
                  className={`${subject.bgColor} rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl border border-white/50 group`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 ${subject.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}
                    >
                      <i
                        className={`fas ${subject.icon} text-white text-xl`}
                      ></i>
                    </div>
                    <div className={`text-2xl font-bold ${subject.textColor}`}>
                      {progress}%
                    </div>
                  </div>

                  <h4 className="text-lg font-bold text-gray-900 mb-2">
                    {subject.name}
                  </h4>

                  <p className="text-sm text-gray-600 mb-4">
                    {completedTopics}/{subject.topics.length} topics completed
                  </p>

                  <div className="w-full bg-white/50 rounded-full h-2">
                    <div
                      className={`bg-gradient-to-r ${subject.color} h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-xs text-gray-600">
                    <span>
                      <i className="fas fa-play-circle mr-1"></i>
                      {
                        subject.topics.filter(
                          (topic) => userProgress[topic]?.video_watched
                        ).length
                      }{" "}
                      videos
                    </span>
                    <span>
                      <i className="fas fa-book mr-1"></i>
                      {
                        subject.topics.filter(
                          (topic) => userProgress[topic]?.notes_read
                        ).length
                      }{" "}
                      notes
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center">
                <i className="fas fa-check-circle text-white"></i>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {
                    Object.values(userProgress).filter((p) => p.completed)
                      .length
                  }
                </div>
                <div className="text-sm text-gray-600">Topics Completed</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
                <i className="fas fa-play text-white"></i>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {
                    Object.values(userProgress).filter((p) => p.video_watched)
                      .length
                  }
                </div>
                <div className="text-sm text-gray-600">Videos Watched</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center">
                <i className="fas fa-book-open text-white"></i>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {
                    Object.values(userProgress).filter((p) => p.notes_read)
                      .length
                  }
                </div>
                <div className="text-sm text-gray-600">Notes Read</div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            <i className="fas fa-clock text-indigo-600 mr-2"></i>
            Continue Learning
          </h3>

          {Object.keys(userProgress).length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-rocket text-gray-400 text-2xl"></i>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Start Your Learning Journey
              </h4>
              <p className="text-gray-600 mb-4">
                Choose a subject above to begin learning
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(userProgress)
                .filter(([_, progress]) => !progress.completed)
                .slice(0, 6)
                .map(([topic, progress]) => (
                  <div
                    key={topic}
                    className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all cursor-pointer group"
                    onClick={() => {
                      // Find which subject this topic belongs to
                      const subjectKey = Object.entries(subjects).find(
                        ([_, subject]) => subject.topics.includes(topic)
                      )?.[0];
                      if (subjectKey) {
                        setActiveSubject(subjectKey);
                        setShowDashboard(false);
                      }
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">
                        {topic}
                      </h4>
                      <i className="fas fa-arrow-right text-gray-400 group-hover:text-indigo-600 transition-colors"></i>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      {progress.video_watched && (
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          <i className="fas fa-play mr-1"></i>Video
                        </span>
                      )}
                      {progress.notes_read && (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                          <i className="fas fa-book mr-1"></i>Notes
                        </span>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Subject Detail View */}
      {!showDashboard && (
        <div className="fixed inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 z-40">
          <div className="bg-white/80 backdrop-blur-lg shadow-sm border-b border-white/20 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 py-4">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowDashboard(true)}
                  className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <i className="fas fa-arrow-left text-gray-600"></i>
                </button>
                <div
                  className={`w-12 h-12 bg-gradient-to-br ${currentSubject.color} rounded-xl flex items-center justify-center shadow-lg`}
                >
                  <i
                    className={`fas ${currentSubject.icon} text-white text-xl`}
                  ></i>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {currentSubject.name}
                  </h1>
                  <p className="text-sm text-gray-600">
                    {getSubjectProgress(activeSubject)}% completed •{" "}
                    {currentSubject.topics.length} topics
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Subject Header */}
            <div
              className={`bg-gradient-to-r ${currentSubject.color} rounded-3xl p-8 text-white mb-8 relative overflow-hidden`}
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
              <div className="relative z-10">
                <h2 className="text-3xl font-bold mb-2">
                  {currentSubject.name}
                </h2>
                <p className="text-white/90 text-lg mb-6">
                  Master the fundamentals and advance your knowledge
                </p>
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <div className="text-2xl font-bold">
                      {getSubjectProgress(activeSubject)}%
                    </div>
                    <div className="text-sm text-white/80">Complete</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-2xl font-bold">
                      {
                        currentSubject.topics.filter(
                          (topic) => userProgress[topic]?.completed
                        ).length
                      }
                    </div>
                    <div className="text-sm text-white/80">Topics Done</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Study Topics */}
            <div className="bg-white rounded-2xl shadow-lg mb-8 border border-gray-100">
              <div className="p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Study Topics
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentSubject.topics.map((topic, index) => {
                    const progress = userProgress[topic];
                    return (
                      <div
                        key={index}
                        onClick={() => handleTopicClick(topic)}
                        className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group hover:scale-105"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div
                            className={`w-12 h-12 ${currentSubject.bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}
                          >
                            <span
                              className={`text-lg font-bold ${currentSubject.textColor}`}
                            >
                              {index + 1}
                            </span>
                          </div>
                          {progress?.completed ? (
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                              <i className="fas fa-check text-green-600 text-sm"></i>
                            </div>
                          ) : (
                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                              <i className="fas fa-circle text-gray-400 text-xs"></i>
                            </div>
                          )}
                        </div>

                        <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                          {topic}
                        </h4>
                        <p className="text-sm text-gray-600 mb-4">
                          Chapter {index + 1} • Interactive content
                        </p>

                        <div className="flex items-center space-x-2 mb-4">
                          {progress?.video_watched && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                              <i className="fas fa-play mr-1"></i>Video
                            </span>
                          )}
                          {progress?.notes_read && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                              <i className="fas fa-book mr-1"></i>Notes
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-indigo-600 group-hover:text-indigo-700">
                            Start Learning
                          </span>
                          <i className="fas fa-arrow-right text-indigo-600 group-hover:translate-x-1 transition-transform"></i>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MainComponent;