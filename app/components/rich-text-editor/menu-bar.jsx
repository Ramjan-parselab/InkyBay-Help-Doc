import { AlignCenter, AlignLeft, AlignRight, Bold, Code as CodeIcon, Heading1, Heading2, Heading3, Highlighter, Image as ImageIcon, Italic, Link as LinkIcon, 
List,ListOrdered,Pilcrow, Strikethrough, Unlink, XCircle } from "lucide-react";
import { useCallback } from "react";
import { Toggle } from "../ui/toggle";

export default function MenuBar({ editor }) {
  if (!editor) return null;

  const addImage = () => {
    const url = window.prompt("Enter image URL");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter link URL", previousUrl);
    if (url === null) {
      return; // cancelled
    }
    if (url === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().setLink({ href: url }).run();
  };

  const uploadImage = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
  
    input.onchange = async () => {
      const file = input.files[0];
      if (file) {
        if (file.size > 2 * 1024 * 1024) {  // 2MB limit
          alert('Image too large');
          return;
        }
        const reader = new FileReader();
        reader.onload = () => {
          editor.chain().focus().setImage({ src: reader.result }).run();
        };
        reader.readAsDataURL(file);
      }
    };
  
    input.click();
  }, [editor]);

  const removeImage = useCallback(() => {
    editor.chain().focus().deleteSelection().run();
  }, [editor]);

  const Options = [
    {
      icon: <Pilcrow className="size-4" />,
      onClick: () => editor.chain().focus().setParagraph().run(),
      preesed: editor.isActive("paragraph"),
      label: "Paragraph",
    },
    {
      icon: <Heading1 className="size-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      preesed: editor.isActive("heading", { level: 1 }),
      label: "Heading 1",
    },
    {
      icon: <Heading2 className="size-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      preesed: editor.isActive("heading", { level: 2 }),
      label: "Heading 2",
    },
    {
      icon: <Heading3 className="size-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      preesed: editor.isActive("heading", { level: 3 }),
      label: "Heading 3",
    },
    {
      icon: <Bold className="size-4" />,
      onClick: () => editor.chain().focus().toggleBold().run(),
      preesed: editor.isActive("bold"),
      label: "Bold",
    },
    {
      icon: <Italic className="size-4" />,
      onClick: () => editor.chain().focus().toggleItalic().run(),
      preesed: editor.isActive("italic"),
      label: "Italic",
    },
    {
      icon: <Strikethrough className="size-4" />,
      onClick: () => editor.chain().focus().toggleStrike().run(),
      preesed: editor.isActive("strike"),
      label: "Strikethrough",
    },
    {
      icon: <Highlighter className="size-4" />,
      onClick: () => editor.chain().focus().toggleHighlight().run(),
      preesed: editor.isActive("highlight"),
      label: "Highlighter",
    },
    {
      icon: <CodeIcon className="size-4" />,
      onClick: () => editor.chain().focus().toggleCode().run(),
      preesed: editor.isActive("code"),
      label: "Code Icon",
    },
    {
      icon: <AlignLeft className="size-4" />,
      onClick: () => editor.chain().focus().setTextAlign("left").run(),
      preesed: editor.isActive({ textAlign: "left" }),
      label: "Align Left",
    },
    {
      icon: <AlignCenter className="size-4" />,
      onClick: () => editor.chain().focus().setTextAlign("center").run(),
      preesed: editor.isActive({ textAlign: "center" }),
      label: "Align Center",
    },
    {
      icon: <AlignRight className="size-4" />,
      onClick: () => editor.chain().focus().setTextAlign("right").run(),
      preesed: editor.isActive({ textAlign: "right" }),
      label: "Align Right",
    },
    {
      icon: <List className="size-4" />,
      onClick: () => editor.chain().focus().toggleBulletList().run(),
      preesed: editor.isActive("bulletList"),
      label: "List",
    },
    {
      icon: <ListOrdered className="size-4" />,
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
      preesed: editor.isActive("orderedList"),
      label: "List Ordered",
    },
    {
      icon: <ImageIcon className="size-4" />,
      onClick: addImage,
      preesed: false,
      label: "Image link Icon",
    },
    {
      icon: <LinkIcon className="size-4" />,
      onClick: setLink,
      preesed: editor.isActive("link"),
      label: "LinkIcon",
    },
    {
      icon: <Unlink className="size-4" />,   // Import Unlink icon
      onClick: () => editor.chain().focus().unsetLink().run(),
      preesed: editor.isActive("link"),
      label: "Unlink",
    },
    {
      icon: <ImageIcon className="size-4" />,
      onClick: uploadImage,
      preesed: false,   // always false, no "active" state
      label: "Upload Image",
    },
    {
      icon: <XCircle className="size-4 text-red-500" />, // Remove image button
      onClick: removeImage,
      preesed: false,
      label: "Remove Image",
    },
  ];

  return (
    <div className="border rounded-md p-1 mb-1 bg-slate-50 space-x-2 z-50 flex flex-wrap">
      {Options.map((option, index) => (
        <Toggle
          key={index}
          pressed={option.preesed}
          onPressedChange={option.onClick}
          title={option.label}  // <-- TOOLTIP
        >
          {option.icon}
        </Toggle>
      ))}
    </div>
  );
}