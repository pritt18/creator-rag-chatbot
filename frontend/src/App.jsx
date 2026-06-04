import { useState } from "react";
import axios from "axios";
import "./App.css";
import StatsChart from "./components/StatsChart";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from "recharts";

function App() {

  const [videoAUrl, setVideoAUrl] = useState("");
  const [videoBUrl, setVideoBUrl] = useState("");

  const [videoAData, setVideoAData] = useState(null);
  const [videoBData, setVideoBData] = useState(null);

  const [question, setQuestion] = useState("");

  const [messages, setMessages] = useState([]);
  const [sources, setSources] = useState([]);

  const [loading, setLoading] = useState(false);

const [transcript, setTranscript] = useState("");
const [showTranscript, setShowTranscript] = useState(false);

const totalViews =
  (videoAData?.views || 0) +
  (videoBData?.views || 0);

const videoAViewsPercent =
  totalViews > 0
    ? (
        (videoAData?.views || 0) /
        totalViews
      ) * 100
    : 0;

const videoBViewsPercent =
  totalViews > 0
    ? (
        (videoBData?.views || 0) /
        totalViews
      ) * 100
    : 0;

const chartData = [
  {
  metric: "Views %",
  VideoA: videoAViewsPercent,
  VideoB: videoBViewsPercent,
},
  {
    name: "Likes",
    VideoA: videoAData?.likes || 0,
    VideoB: videoBData?.likes || 0
  },
  {
    name: "Comments",
    VideoA: videoAData?.comments || 0,
    VideoB: videoBData?.comments || 0
  }
];

  const processVideos = async () => {

    try {

      setLoading(true);

      const res = await axios.post(
        "http://127.0.0.1:8000/process-videos",
        {
          video_a_url: videoAUrl,
          video_b_url: videoBUrl
        }
      );
      console.log("Video A:", res.data.video_a);
      console.log("Video B:", res.data.video_b);

      setVideoAData(
        res.data.video_a
      );

      setVideoBData(
        res.data.video_b
      );

      setMessages(prev => [
        ...prev,
        {
          role: "System",
          content:
            "Videos processed successfully."
        }
      ]);

    } catch (error) {

      console.error(error);

      setMessages(prev => [
        ...prev,
        {
          role: "System",
          content:
            "Failed to process videos."
        }
      ]);
    }

    setLoading(false);
  };

  const askQuestion = async () => {

    if (!question.trim()) return;

    try {

      const res = await axios.post(
        "http://127.0.0.1:8000/chat",
        {
          question: question
        }
      );

      setMessages(prev => [
        ...prev,
        {
          role: "User",
          content: question
        },
        {
          role: "AI",
          content: res.data.answer
        }
      ]);

      setSources(
        res.data.sources || []
      );

      setQuestion("");

    } catch (error) {

      console.error(error);

      setMessages(prev => [
        ...prev,
        {
          role: "System",
          content:
            "Failed to get answer."
        }
      ]);
    }
  };

  const compareVideos = async () => {

    try {

      const res = await axios.get(
        "http://127.0.0.1:8000/compare"
      );

      setMessages(prev => [
        ...prev,
        {
          role: "AI",
          content: res.data.answer
        }
      ]);

      setSources(
        res.data.sources || []
      );

    } catch (error) {

      console.error(error);

      setMessages([
  {
    role: "System",
    content:
      "Videos processed successfully."
  }
]);
    }
  };

  const viewTranscript = async (videoId) => {

  try {

    const res = await axios.get(
      `http://127.0.0.1:8000/transcript/${videoId}`
    );

    setTranscript(
      res.data.transcript
    );

    setShowTranscript(true);

  } catch (error) {

    console.error(error);

    alert(
      "Transcript not available."
    );
  }
};
const viewsData = [
  {
    name: "Views",
    VideoA: videoAData?.views || 0,
    VideoB: videoBData?.views || 0
  }
];

const likesData = [
  {
    name: "Likes",
    VideoA: videoAData?.likes || 0,
    VideoB: videoBData?.likes || 0
  }
];

const commentsData = [
  {
    name: "Comments",
    VideoA: videoAData?.comments || 0,
    VideoB: videoBData?.comments || 0
  }
];

const engagementData = [
  {
    name: "Engagement %",
    VideoA: videoAData?.engagement_rate || 0,
    VideoB: videoBData?.engagement_rate || 0
  }
];

const downloadReport = () => {

  const report = `
CREATOR RAG ANALYSIS REPORT

========================

VIDEO A

Title: ${videoAData?.title}
Creator: ${videoAData?.creator}
Views: ${videoAData?.views}
Likes: ${videoAData?.likes}
Comments: ${videoAData?.comments}
Engagement: ${videoAData?.engagement_rate}%

========================

VIDEO B

Title: ${videoBData?.title}
Creator: ${videoBData?.creator}
Views: ${videoBData?.views}
Likes: ${videoBData?.likes}
Comments: ${videoBData?.comments}
Engagement: ${videoBData?.engagement_rate}%

========================

WINNERS

Views Winner:
${
  videoAData?.views >
  videoBData?.views
    ? "Video A"
    : "Video B"
}

Engagement Winner:
${
  videoAData?.engagement_rate >
  videoBData?.engagement_rate
    ? "Video A"
    : "Video B"
}
`;

  const blob = new Blob(
    [report],
    { type: "text/plain" }
  );

  const url =
    window.URL.createObjectURL(blob);

  const a =
    document.createElement("a");

  a.href = url;
  a.download =
    "creator-rag-report.txt";

  a.click();

  window.URL.revokeObjectURL(url);
};

  return (

    <div className="app-container">

      <h1 className="main-title">
        🤖 Creator RAG Chatbot
      </h1>

      {/* VIDEO URLS */}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          marginBottom: "20px"
        }}
      >

        <input
          className="input-box"
          type="text"
          placeholder="Video A URL"
          value={videoAUrl}
          onChange={(e) =>
            setVideoAUrl(
              e.target.value
            )
          }
        />

        <input
          className="input-box"
          type="text"
          placeholder="Video B URL"
          value={videoBUrl}
          onChange={(e) =>
            setVideoBUrl(
              e.target.value
            )
          }
        />

        <button
        onClick={processVideos}
        style={{
          padding: "12px",
          borderRadius: "10px",
          border: "none",
          background: "#4f46e5",
          color: "white",
          fontWeight: "bold",
          cursor: "pointer"
        }}
      >
          {
            loading
              ? "Processing..."
              : "Process Videos"
          }
        </button>

      </div>
      <h2>
        📹 Video Analysis
      </h2>
      {/* VIDEO CARDS */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "25px",
          marginBottom: "20px"
        }}
      >

        {/* VIDEO A */}

        <div className="glass-card video-card">

          <h3>Video A</h3>

          {videoAData ? (

            <>
            <img
              src={videoAData.thumbnail}
              alt="Video A"
              style={{
                width: "100%",
                borderRadius: "12px",
                marginBottom: "15px",
                height: "220px",
                objectFit: "cover"
              }}
            />
            <a
              href={videoAUrl}
              target="_blank"
              rel="noreferrer"
              style={{
                color: "#60a5fa",
                textDecoration: "none",
                fontWeight: "bold",
                display: "block",
                marginBottom: "10px"
              }}
            >
              ▶ Watch on YouTube
            </a>
              <p>
                Title:
                {" "}
                {videoAData.title}
              </p>

              <p>
                Creator:
                {" "}
                {videoAData.creator}
              </p>

              <p>Views: {videoAData.views}</p>

<p>Likes: {videoAData.likes}</p>

<p>Comments: {videoAData.comments}</p>

<p>
  Duration: {Math.floor(videoAData.duration / 60)}m {videoAData.duration % 60}s
</p>

<p>
  Upload Date: {
    videoAData.upload_date
      ? `${videoAData.upload_date.slice(6, 8)}-${videoAData.upload_date.slice(4, 6)}-${videoAData.upload_date.slice(0, 4)}`
      : "N/A"
  }
</p>

<p>Engagement: {videoAData.engagement_rate}%</p>

<p>Chunks: {videoAData.chunks_stored}</p>
            </>

          ) : (

            <p>
              No video loaded
            </p>

          )}

        </div>

        {/* VIDEO B */}

        <div className="glass-card video-card">

  <h3>Video B</h3>

  {videoBData ? (
    <>
      <img
        src={videoBData.thumbnail}
        alt="Video B"
        style={{
          width: "100%",
          borderRadius: "12px",
          marginBottom: "15px",
          height: "220px",
          objectFit: "cover"
        }}
      />
      <a
        href={videoBUrl}
        target="_blank"
        rel="noreferrer"
        style={{
          color: "#60a5fa",
          textDecoration: "none",
          fontWeight: "bold",
          display: "block",
          marginBottom: "10px"
        }}
      >
        ▶ Watch on YouTube
      </a>

      <p>Title: {videoBData.title}</p>
      <p>Creator: {videoBData.creator}</p>
      <p>Views: {videoBData.views}</p>
      <p>Likes: {videoBData.likes}</p>
      <p>Comments: {videoBData.comments}</p>
      <p>
        Upload Date: {
          videoBData.upload_date
            ? `${videoBData.upload_date.slice(6, 8)}-${videoBData.upload_date.slice(4, 6)}-${videoBData.upload_date.slice(0, 4)}`
            : "N/A"
        }
      </p>
      <p>
        Duration: {Math.floor(videoBData.duration / 60)}m {videoBData.duration % 60}s
      </p>
      <p>Engagement: {videoBData.engagement_rate}%</p>
      <p>Chunks: {videoBData.chunks_stored}</p>
    </>
  ) : (
    <p>No video loaded</p>
  )}

</div>

      </div>

      {/* COMPARE */}

      <div
        style={{
          padding: "10px 15px",
          borderRadius: "8px",
          border: "none",
          background: "#1e293b",
          color: "white",
          cursor: "pointer"
        }}
>

  <button
    onClick={compareVideos}
  >
    Compare Videos
  </button>

  <button
    onClick={() =>
      viewTranscript("A")
    }
    style={{
      padding: "10px 15px",
      borderRadius: "8px",
      border: "none",
      background: "#1e293b",
      color: "white",
      cursor: "pointer"
    }}
  >
    Transcript A
  </button>

  <button
    onClick={() =>
      viewTranscript("B")
    }
    style={{
      padding: "10px 15px",
      borderRadius: "8px",
      border: "none",
      background: "#1e293b",
      color: "white",
      cursor: "pointer"
    }}
  >
    Transcript B
  </button>

</div>
      <h2>
        💬 AI Chat
      </h2>
      {/* CHAT */}

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px"
        }}
      >

        <input
          className="input-box"
          type="text"
          placeholder="Ask a question..."
          value={question}
          onChange={(e) =>
            setQuestion(
              e.target.value
            )
          }
          style={{
            flex: 1
          }}
        />

        <button
          onClick={askQuestion}
        >
          Send
        </button>

      </div>

      {/* CHAT HISTORY */}

      <div
        style={{
          border:
            "1px solid gray",
          padding: "20px",
          marginBottom: "20px"
        }}
      >

        <h3>
          Chat History
        </h3>

        <div
          style={{
            maxHeight: "400px",
            overflowY: "auto"
          }}
        >

          {messages.map(
            (
              msg,
              index
            ) => (

              <div
                key={index}
                style={{
                  marginBottom:
                    "15px"
                }}
              >

                <strong>
                  {msg.role}
                </strong>

                <p
                  style={{
                    whiteSpace:
                      "pre-wrap"
                  }}
                >
                  {msg.content}
                </p>

              </div>

            )
          )}

        </div>

      </div>

      {/* CHAT HISTORY */}
{videoAData && videoBData && (
  <>
    <h2>
      📊 Analytics Dashboard
    </h2>

    <div
      style={{
        border: "1px solid gray",
        padding: "20px",
        marginBottom: "20px"
      }}
    >
  <h2>Analytics Dashboard</h2>

  <div
    style={{
      display: "flex",
      gap: "30px",
      marginBottom: "20px"
    }}
  >
    <h3>
      🏆 Views Winner :
      {
        (videoAData?.views || 0) >
        (videoBData?.views || 0)
          ? " Video A"
          : " Video B"
      }
    </h3>

    <h3>
      ❤️ Engagement Winner :
      {
        (videoAData?.engagement_rate || 0) >
        (videoBData?.engagement_rate || 0)
          ? " Video A"
          : " Video B"
      }
    </h3>
  </div>

  {/* Views Chart */}

  <h3>Views Comparison</h3>

  <ResponsiveContainer
    width="100%"
    height={250}
  >
    <BarChart data={viewsData}>
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />

      <Bar
        dataKey="VideoA"
        fill="#8884d8"
      />

      <Bar
        dataKey="VideoB"
        fill="#82ca9d"
      />
    </BarChart>
  </ResponsiveContainer>

  {/* Likes Chart */}

  <h3>Likes Comparison</h3>

  <ResponsiveContainer
    width="100%"
    height={250}
  >
    <BarChart data={likesData}>
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />

      <Bar
        dataKey="VideoA"
        fill="#8884d8"
      />

      <Bar
        dataKey="VideoB"
        fill="#82ca9d"
      />
    </BarChart>
  </ResponsiveContainer>

  {/* Comments Chart */}

  <h3>Comments Comparison</h3>

  <ResponsiveContainer
    width="100%"
    height={250}
  >
    <BarChart data={commentsData}>
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />

      <Bar
        dataKey="VideoA"
        fill="#8884d8"
      />

      <Bar
        dataKey="VideoB"
        fill="#82ca9d"
      />
    </BarChart>
  </ResponsiveContainer>

  {/* Engagement Chart */}

  <h3>Engagement Comparison</h3>

  <ResponsiveContainer
    width="100%"
    height={250}
  >
    <BarChart data={engagementData}>
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />

      <Bar
        dataKey="VideoA"
        fill="#8884d8"
      />

      <Bar
        dataKey="VideoB"
        fill="#82ca9d"
      />
    </BarChart>
  </ResponsiveContainer>

  {/* Metrics Table */}

  <h3>Metrics Table</h3>

  <table
    style={{
      width: "100%",
      borderCollapse: "collapse"
    }}
  >
    <thead>
      <tr>
        <th>Metric</th>
        <th>Video A</th>
        <th>Video B</th>
      </tr>
    </thead>

    <tbody>
      <tr>
        <td>Views</td>
        <td>{videoAData?.views}</td>
        <td>{videoBData?.views}</td>
      </tr>

      <tr>
        <td>Likes</td>
        <td>{videoAData?.likes}</td>
        <td>{videoBData?.likes}</td>
      </tr>

      <tr>
        <td>Comments</td>
        <td>{videoAData?.comments}</td>
        <td>{videoBData?.comments}</td>
      </tr>

      <tr>
        <td>Engagement %</td>
        <td>{videoAData?.engagement_rate}</td>
        <td>{videoBData?.engagement_rate}</td>
      </tr>
    </tbody>
  </table>
</div>

<div
  style={{
    textAlign: "center",
    marginTop: "20px"
  }}
>
  <button
    onClick={downloadReport}
  >
    Download Analysis Report
  </button>
</div>

  </>
)}

<h2>
  📚 Sources
</h2>
      {/* SOURCES */}

      <div
        style={{
          border:
            "1px solid gray",
          padding: "20px"
        }}
      >

        <h3>
          Sources
        </h3>

        {sources.length > 0 ? (

          sources.map(
            (
              source,
              index
            ) => (

              <div
                key={index}
                style={{
                  borderBottom:
                    "1px solid gray",
                  marginBottom:
                    "10px",
                  paddingBottom:
                    "10px"
                }}
              >

                <p>
                  Video:
                  {" "}
                  {source.video_id}
                </p>

                <p>
                  Creator:
                  {" "}
                  {source.creator}
                </p>

                <p>
                  Engagement:
                  {" "}
                  {source.engagement_rate}
                </p>

              </div>

            )
          )

        ) : (

          <p>
            No sources available.
          </p>

        )}

      </div>

          {/* TRANSCRIPT MODAL */}

      {showTranscript && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.85)",
            zIndex: 9999
          }}
        >
          <div
            style={{
              background: "#0f172a",
              color: "#e2e8f0",
              borderRadius: "15px",
              boxShadow: "0 0 30px rgba(0,0,0,0.5)",
              width: "80%",
              margin: "40px auto",
              padding: "20px",
              maxHeight: "80vh",
              overflowY: "auto",
              borderRadius: "10px"
            }}
          >
            <h2>Transcript</h2>

            <div
              style={{
                whiteSpace: "pre-wrap",
                lineHeight: "1.8",
                textAlign: "left",
                fontSize: "16px",
                padding: "15px",
                maxHeight: "70vh",
                overflowY: "auto"
              }}
            >
              {transcript
                .split(". ")
                .map((sentence, index) => (
                  <p
                    key={index}
                    style={{
                      marginBottom: "12px"
                    }}
                  >
                    {sentence}.
                  </p>
                ))}
            </div>

            <button
              onClick={() =>
                setShowTranscript(false)
              }
            >
              Close
            </button>
          </div>
        </div>
      )}
    <div
  style={{
    textAlign: "center",
    marginTop: "40px",
    opacity: 0.7
  }}
>
  Built with React + FastAPI + ChromaDB + Gemini
</div>
    </div>
  );
}

export default App;