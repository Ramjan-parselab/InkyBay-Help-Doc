import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import MenuBar from "./menu-bar";
import { useEffect } from "react";

export default function RichTextEditor({ content, onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: { class: "list-disc ml-3" },
        },
        orderedList: {
          HTMLAttributes: { class: "list-decimal ml-3" },
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight.configure({
        HTMLAttributes: {
          class: "hover:bg-red-500",
        },
      }),
      Image.configure({
        inline: false,
        allowBase64: true,
        HTMLAttributes: {
          class: "my-2 rounded-md max-w-[300px] max-h-[200px] block",  
        },
      }),
      Link.configure({
        openOnClick: true,
        autolink: true,
        linkOnPaste: true,
        HTMLAttributes: {
          class: "text-blue-600 underline hover:text-blue-800",
        },
      }),
      // Code, // Inline code support
    ],
    content: content,
    editorProps: {
      attributes: {
        class: "min-h-[156px] border rounded-md bg-slate-50 py-2 px-3 focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    immediatelyRender: false, 
  });

   useEffect(() => {
    if (editor && !editor.isDestroyed) {
      const currentContent = editor.getHTML();
      if (currentContent !== content) {
        editor.commands.setContent(content, false);
      }
    }
  }, [content, editor]);

  return (
    <div>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}