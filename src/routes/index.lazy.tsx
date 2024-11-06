import { createLazyFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// import CodeEditor from "@uiw/react-textarea-code-editor";
import { useState, lazy, useEffect } from "react";
const CodeEditor = lazy(() => import("@uiw/react-textarea-code-editor"));
export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("js");
  const [fileName, setFileName] = useState("");
  const handleUpload = async () => {
    if (code === "" || fileName === "") {
      toast.error("Please enter file name or valid code");
      return;
    }

    const res = await fetch("/api/upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code,
        language,
        fileName,
      }),
    });
    const data = await res.json();
    if (!data.id) {
      toast.error(data.message);
    } else {
      window.location.href = `/snippet?id=${data.id}`;
    }
  };

  useEffect(() => {
    //TODO: Stop using weird hack and use react-codemirror instead
    const textarea = document.querySelector("textarea");
    if (textarea) {
      textarea.style.overflow = "";
      textarea.style.overflowY = "auto";
    }
  }, []);

  return (
    <div className="w-full min-h-screen flex flex-col justify-center items-center space-y-2">
      <Input
        placeholder="File name"
        value={fileName}
        onChange={(e) => setFileName(e.target.value)}
        className="w-1/4"
      />
      <CodeEditor
        value={code}
        language={language}
        placeholder={`Please enter ${language} code.`}
        onChange={(e) => setCode(e.target.value)}
        className="w-1/2 max-h-[70vh] min-h-[70vh] border rounded-sm overflow-y-auto"
        padding={15}
        style={{
          backgroundColor: "var(--background)",
          fontFamily:
            "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
        }}
      />

      <div className="flex w-1/3   p-2 space-x-4">
        <Select onValueChange={setLanguage} value={language}>
          <SelectTrigger className="">
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="html">HTML</SelectItem>
            <SelectItem value="js">Javascript</SelectItem>
            <SelectItem value="python">Python</SelectItem>
            <SelectItem value="go">Golang</SelectItem>
            <SelectItem value="cpp">C++</SelectItem>
            <SelectItem value="c">C</SelectItem>
            <SelectItem value="rust">Rust</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={handleUpload} className="ml-auto" variant="secondary">
          Upload
        </Button>
      </div>
    </div>
  );
}
