import { useEffect, useRef, useState } from "react";
import "quill/dist/quill.snow.css";
import Quill from "quill";
import katex from "katex";
import "katex/dist/katex.min.css";

window.katex = katex;

const RichTextEditor = () => {
  const editor = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState("value");
    const [quill, setQuill] = useState<Quill | null>(null);

  useEffect(() => {
    const toolbarOptions = [
      ["bold", "italic", "underline", "strike"], // toggled buttons
      ["blockquote", "code-block"],
      ["link", "image", "video", "formula"],

      [{ header: 1 }, { header: 2 }], // custom button values
      [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
      [{ script: "sub" }, { script: "super" }], // superscript/subscript
      [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
      [{ direction: "rtl" }], // text direction

      [{ size: ["small", false, "large", "huge"] }], // custom dropdown
      [{ header: [1, 2, 3, 4, 5, 6, false] }],

      [{ color: [] }, { background: [] }], // dropdown with defaults from theme
      [{ font: [] }],
      [{ align: [] }],

      ["clean"], // remove formatting button
    ];
     const quillInstance = new Quill(editor.current, {
      theme: "snow",
      modules: {
        toolbar: toolbarOptions,
      },
    });
    setQuill(quillInstance)
  }, []);

  quill?.on("text-change", () => {
    const html = quill.root.innerHTML
    console.log(html)
  })

  return (
    <>
      <div ref={editor} className="h-52"></div>
    </>
  );
};

export default RichTextEditor;