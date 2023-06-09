import type { AppProps } from "next/app";
import "./App.css";
import { Configuration, OpenAIApi } from "openai";
import getConfig from "next/config";
import { use, useState, useEffect } from "react";

export default function App({ Component, pageProps }: AppProps) {
  const { publicRuntimeConfig } = getConfig();
  const [result, setResult] = useState(
    "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png"
  );
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [typedText, setTypedText] = useState("");

  const text = "Creating image... Please Wait... ";

  const apiKey =
    typeof publicRuntimeConfig !== "undefined" && publicRuntimeConfig.apiKey
      ? publicRuntimeConfig.apiKey
      : process.env.API_KEY;
  //api key setup

  if (!apiKey) {
    throw new Error("apiKey is not defined in config file");
  }

  const configuration = new Configuration({ apiKey });
  const openai = new OpenAIApi(configuration);

  const generateImage = async () => {
    setLoading(true);
    const res = await openai.createImage({
      prompt: prompt,
      n: 1,
      size: "512x512",
    });
    setLoading(false);
    const data = res.data;
    setResult(data.data[0].url || "no image found");
  };

  useEffect(() => {
    if (loading) {
      let i = 0;
      const typing = setInterval(() => {
        setTypedText(text.slice(0, i));
        i++;
        if (i > text.length + 1) {
          i = 0;
          setTypedText("");
        }
      }, 100);
      return () => clearInterval(typing);
    }
    //useEffect hook triggered by loading
  }, [loading]);

  const sendEmail = (url = "") => {
    const message = `Here's your image download link:  ${url}`;
    window.location.href = `mailto:someone@example.com?subject=Image Download Link&body=${message}`;
  };

  return (
    <div className="mainContainer">
      <h2>Create Images With Your Mind</h2>
      <div className="description">
       Try Out Our New <b>imGenerator</b>!
      </div>
      <textarea
        className="appInput"
        placeholder="Bacon-wrapped roast partridge, pork stuffing & lentils"
        onChange={(e) => setPrompt(e.target.value)}
      />
      <button onClick={generateImage}>Generate Image</button>
      <>
        {loading ? (
          <>
            <h3>{typedText}</h3>
            <div className="lds-ripple">
              <div></div>
              <div></div>
            </div>
          </>
        ) : (
          <img
            src={result}
            onClick={() => sendEmail(result)}
            style={{ cursor: "pointer" }}
            className="generatedImage"
            alt="Result of image generator"
          />
        )}
      </>
    </div>
  );
}
