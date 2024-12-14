import React, { useState } from "react";
import axios from "axios";

const Sandbox = () => {
  const [htmlCode, setHtmlCode] = useState("<h1>Hello World</h1>");
  const [cssCode, setCssCode] = useState("body { font-family: Arial; }");
  const [jsCode, setJsCode] = useState("console.log('Hello World');");
  const [embedUrl, setEmbedUrl] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!htmlCode.trim()) {
      alert("Please provide HTML code.");
      return;
    }

    try {
      // Prepare payload for CodeSandbox API
      const payload = {
        files: {
          "index.html": { content: htmlCode },
          ...(cssCode.trim() && { "styles.css": { content: cssCode } }),
          ...(jsCode.trim() && { "index.js": { content: jsCode } }),
        },
      };

      const response = await axios.post(
        "https://codesandbox.io/api/v1/sandboxes/define?json=1",
        payload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const sandboxId = response.data.sandbox_id;
      setEmbedUrl(`https://codesandbox.io/embed/${sandboxId}`);
    } catch (error) {
      console.error("Error creating sandbox:", error);
      alert("An error occurred while generating the sandbox.");
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>CodeSandbox Editor</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <label>
            HTML Code:
            <textarea
              value={htmlCode}
              onChange={(e) => setHtmlCode(e.target.value)}
              rows="10"
              cols="50"
              placeholder="Write your HTML code here"
              required
              style={{ display: "block", width: "100%", marginTop: "5px" }}
            />
          </label>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>
            CSS Code (Optional):
            <textarea
              value={cssCode}
              onChange={(e) => setCssCode(e.target.value)}
              rows="10"
              cols="50"
              placeholder="Write your CSS code here"
              style={{ display: "block", width: "100%", marginTop: "5px" }}
            />
          </label>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>
            JavaScript Code (Optional):
            <textarea
              value={jsCode}
              onChange={(e) => setJsCode(e.target.value)}
              rows="10"
              cols="50"
              placeholder="Write your JavaScript code here"
              style={{ display: "block", width: "100%", marginTop: "5px" }}
            />
          </label>
        </div>
        <button type="submit" style={{ padding: "10px 20px", cursor: "pointer" }}>
          Generate Sandbox
        </button>
      </form>
      {embedUrl && (
        <div style={{ marginTop: "20px" }}>
          <h2>Sandbox Embed</h2>
          <iframe
            src={embedUrl}
            title="CodeSandbox Embed"
            style={{
              width: "100%",
              height: "500px",
              border: "none",
              marginTop: "10px",
            }}
          ></iframe>
        </div>
      )}
    </div>
  );
};

export default Sandbox;
