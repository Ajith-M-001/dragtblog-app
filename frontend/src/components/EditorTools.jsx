import Header from "@editorjs/header";
import List from "@editorjs/list";
import Image from "@editorjs/image";
import Embed from "@editorjs/embed";
import Underline from "@editorjs/underline";
import LinkTool from "@editorjs/link";
import InlineCode from "@editorjs/inline-code";
import Quote from "@editorjs/quote";
import Marker from "@editorjs/marker";
import Table from "@editorjs/table";
import CodeTool from "@editorjs/code";
import Warning from "@editorjs/warning";
import Delimiter from "@editorjs/delimiter";

export const EditorTools = {
  header: {
    class: Header,
    config: {
      placeholder: "Enter a header",
      levels: [1, 2, 3, 4],
      defaultLevel: 1,
    },
    inlineToolbar: true,
  },
  list: {
    class: List,
    inlineToolbar: true,
    config: {
      defaultStyle: "unordered",
    },
  },
  image: {
    class: Image,
    config: {
      uploader: {
        uploadByFile: async (file) => {
          try {
            const formData = new FormData();
            formData.append("image", file);
            const response = await fetch("/api/v1/blog/upload-image", {
              method: "POST",
              body: formData,
            });
            const result = await response.json();
            return {
              success: 1,
              file: { url: result.data.secure_url },
            };
          } catch (error) {
            console.error("Upload error:", error);
            return { success: 0, error: "Upload failed" };
          }
        },
      },
    },
  },
  embed: Embed,
  underline: Underline,
  linkTool: LinkTool,
  inlineCode: InlineCode,
  quote: Quote,
  marker: Marker,
  table: Table,
  code: CodeTool,
  warning: Warning,
  delimiter: Delimiter,
};
