import { useState, useEffect } from 'react'
import "prismjs/themes/prism-tomorrow.css";
import Editor from "react-simple-code-editor";
import prism from "prismjs";
import Markdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight';
import "highlight.js/styles/github-dark.css";
import axios from 'axios';
import './App.css'

<title>AI-Powered Code Review</title>
function App() {
  const [count, setCount] = useState(0)
  const [code, setCode] = useState(`print(/*
  AI-Powered Code Review 🚀🛠️

  What this web app does:
  - Paste your code in the left editor.
  - Click "Review" to get an AI-powered, contextual code review.
  - Read suggestions, explanations, and fixes on the right (rendered as Markdown).

  Key features:
  - Live syntax highlighting ✨
  - One-click Clear 🧹
  - Async review requests with loading state ⏳
  - Markdown-friendly review output with highlights and code blocks 🔍

  How to use:
  1. Paste or write code on the left.
  2. Press "Review".
  3. Review suggestions on the right and iterate.

  Privacy & tips:
  - Code is sent to the review API endpoint — avoid pasting secrets or sensitive data 🔒
  - Keep snippets focused for faster, clearer feedback ✅

  Happy coding! 😄👩‍💻👨‍💻
  Stickers: 🏷️ 📌 🎯
  */);`);
const [review, setReview] = useState(``)
  useEffect(() => {
    prism.highlightAll();
  });

  async function reviewCode(){
    const response= await axios.post('https://ai-powered-code-review-5fz0.onrender.com/ai/get-review',{ code })
    console.log(response.data);
    setReview(response.data);
  }
  const [loading, setLoading] = useState(false);

  return (
    <>
      <main>
        <div className="left">
          <div className="code">
            <Editor
              value={code}
              onValueChange={code => setCode(code)}
              highlight={code => prism.highlight(code, prism.languages.javascript, 'javascript')}
              padding={10}
              className="editor"
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 16,
                border: "1px solid #ddd",
                borderRadius: "5px",
                height: "100%",
                width: "100%"
              }}
            />
          </div>
          <div onClick={() => setCode('')} className="clear">Clear</div>
          <div
            className="review"
            onClick={loading ? undefined : async () => {
              setLoading(true);
              try {
                await reviewCode();
              } finally {
                setLoading(false);
              }
            }}
            style={{ cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            {loading ? 'Reviewing…' : 'Review'}
          </div>
        </div>
        <div className="right">
          <Markdown
            rehypePlugins={[rehypeHighlight]}
          >{review}</Markdown>
        </div>
      </main>
    </>
  )
}

export default App
