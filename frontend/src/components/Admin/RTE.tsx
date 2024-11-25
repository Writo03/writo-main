import { useEffect, useRef, useState } from "react";
import "quill/dist/quill.snow.css";
import Quill from "quill";
import katex from "katex";
import "katex/dist/katex.min.css";
import { useToast } from "../hooks/use-toast";
import axios from "axios";
import Toolbar from "quill/modules/toolbar";

window.katex = katex;

const RichTextEditor = ({initialValue = "", onChange} : {
  initialValue ?: string,
  onChange ?: (content : string) => void
}) => {
  const editor = useRef<HTMLDivElement>(null);
  const [quill, setQuill] = useState<Quill | null>(null);
  const [loading, setLoading] = useState(false);

  const {toast} = useToast()

  useEffect(() => {
    if (!editor.current) return;
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

    if(initialValue){
      quillInstance.root.innerHTML = initialValue
    }

    const toolbar = quillInstance.getModule("toolbar") as Toolbar;
    toolbar.addHandler("image", () => {
      const input = document.createElement("input");
      input.setAttribute("type", "file");
      input.setAttribute("accept", "image/*");
      input.click();

      input.onchange = async () => {
        const file = input.files?.[0]
        if(file){
          try {
            setLoading(true)
            const imageUrl = await handleImageUpload(file)
  
            const range = quillInstance.getSelection(true)
  
            quillInstance.insertEmbed(range.index, "image", imageUrl)
  
            quillInstance.setSelection(range.index + 1);
          } catch {
            toast({
              title: "Error",
              description: "Failed to upload image",
              variant: "destructive",
            })
          } finally {
            setLoading(false)
          }
        }
      };
    });
    setQuill(quillInstance);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleImageUpload = async (file : File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "upload_preset",
        "spx0jjqq",
      );

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/dlsxjstxo/image/upload`,
        formData,
      );

      toast({
        title: "Success",
        description:
          "Image uploaded successfully",
      });

      return response.data.secure_url

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.response.data.error.message ||
          "Failed to upload image",
        variant: "destructive",
      });
    } 
  }

  useEffect(() => {
    if (!quill) return;

    const handleChange = () => {
      const html = quill.root.innerHTML;
      onChange?.(html);
    };

    quill.on('text-change', handleChange);

    return () => {
      quill.off('text-change', handleChange);
    };
  }, [quill, onChange]);

  return (
    <>
      {loading && <p className="text-center">Uploading Image...</p>}
      <div ref={editor} className="h-28"></div>
    </>
  );
};

export default RichTextEditor;
