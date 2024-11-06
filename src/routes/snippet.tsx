import { createFileRoute } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import z from "zod";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { lazy, useEffect } from "react";
const CodeEditor = lazy(() => import("@uiw/react-textarea-code-editor"));

const searchValidator = z.object({
  id: z.string().optional(),
});

export const Route = createFileRoute("/snippet")({
  loader: () => ({}),
  validateSearch: searchValidator,
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useSearch();

  if (id === undefined) {
    console.log("redirecting");
    window.location.href = "/";
  }

  const q = useQuery({
    queryKey: ["snippet", id],
    queryFn: async () => {
      const res = await fetch(`/api/snippet?id=${id}`);
      const data = await res.json();
      return data;
    },
  });
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
      <div className="flex space-x-2 w-1/2">
        <Input
          placeholder="File name"
          className="w-1/2"
          value={q.data?.title}
          disabled
        />
        <Button className="w-1/4" variant={"outline"} disabled>
          {q.data?.language}
        </Button>
      </div>
      <CodeEditor
        value={q.data?.code || ""}
        language={q.data?.language || "js"}
        disabled
        className="w-1/2 min-h-[70vh] border rounded-sm"
        padding={15}
        style={{
          backgroundColor: "var(--background)",
          fontFamily:
            "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
        }}
      />
    </div>
  );
}
