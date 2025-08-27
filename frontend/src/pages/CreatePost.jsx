import { CiImageOn } from "react-icons/ci";
import { useRef, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "../utils/toast";


const CreatePost = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const imgRef = useRef(null);

  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      return data;
    }
  });
  const queryClient = useQueryClient();

  const {
  mutate: createPost,
  isError,
  error,
  } = useMutation({
  mutationFn: async ({ text, img }) => {
 try {
    const res = await fetch("/api/posts/create", {
  method: "POST",
  headers: {
      "Content-Type": "application/json",
  },
  body: JSON.stringify({ text, img }),
    });
    const data = await res.json();
    if (!res.ok) {
  throw new Error(data.error || "Something went wrong");
    }
    return data;
  } catch (error) {
    throw error instanceof Error ? error : new Error(String(error));
  }
  },
  onSuccess: () => {
  setText("");
  setImg(null);
    toast.success("Post created successfully");
  queryClient.invalidateQueries({ queryKey: ["posts"] });
  },
  });


  const parseCommitMessage = (input) => {
    const match = input.match(/^\s*git\s+commit\s+-m\s+"([^"]+)"\s*$/);
    return match ? match[1] : null;
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const commitMsg = parseCommitMessage(text);
      if (commitMsg) {
        createPost({ text: commitMsg, img });
      }
    }
  };

  const handleImgChange = (e) => {
  const file = e.target.files[0];
  if (file) {
  const reader = new FileReader();
  reader.onload = () => {
    setImg(reader.result);
  };
  reader.readAsDataURL(file);
  }
  };

  return (
    <div className="w-full border-b border-green-400/30 bg-gradient-to-br from-black via-gray-950 to-gray-900 p-8 font-mono shadow-2xl">
      <form className="flex gap-4" autoComplete="off">
        <div className="avatar flex-shrink-0">
          <div className="w-14 h-14 rounded-full border-2 border-green-400/60 overflow-hidden flex items-center justify-center bg-black shadow-lg shadow-green-400/20 hover:shadow-green-400/40 transition-all duration-300">
            <img src={authUser?.profileImg || "/avatar-placeholder.jpg"} width="56" height="56" className="w-full h-full object-cover rounded-full" alt="avatar" decoding="async" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="bg-gray-900/80 backdrop-blur-sm border border-green-400/40 rounded-xl px-4 py-4 flex items-center shadow-lg hover:shadow-green-400/10 transition-all duration-300 hover:border-green-400/60">
            <span className="text-green-400 mr-2 text-base">$</span>
            <input
              type="text"
              className="flex-1 bg-transparent outline-none text-green-400 placeholder-green-600/70 font-mono text-lg focus:placeholder-green-600/90 transition-all duration-200"
              placeholder='git commit -m "your message"'
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              spellCheck={false}
              autoFocus
            />
          </div>
          {img && (
            <div className="relative w-full max-w-lg mx-auto mt-4">
              <IoCloseSharp
                className="absolute -top-2 -right-2 text-green-400 bg-gray-800/90 backdrop-blur-sm rounded-full w-7 h-7 cursor-pointer hover:bg-gray-700/90 hover:text-green-300 transition-all duration-200 shadow-lg z-10"
                onClick={() => {
                  setImg(null);
                  if (imgRef.current) {
                    imgRef.current.value = null;
                  }
                }}
              />
              <img src={img} width="640" height="288" className="w-full h-72 object-cover rounded-xl border border-green-400/40 shadow-lg hover:shadow-green-400/20 transition-all duration-300" alt="post attachment" decoding="async" />
            </div>
          )}
          <div className="flex justify-between items-center mt-4 gap-2">
            <div className="flex gap-2 items-center">
              <button
                type="button"
                className="bg-gradient-to-r from-green-900/80 to-green-800/80 hover:from-green-800/90 hover:to-green-700/90 text-green-400 px-4 py-2.5 rounded-lg flex items-center gap-2 backdrop-blur-sm border border-green-400/20 hover:border-green-400/40 transition-all duration-300 shadow-lg hover:shadow-green-400/20 text-sm"
                onClick={() => imgRef.current.click()}
              >
                <CiImageOn className="w-5 h-5" />
                <span>Attach Image</span>
              </button>
            </div>
            <input type="file" accept="image/*" hidden ref={imgRef} onChange={handleImgChange} />
          </div>
          {isError && <div className="text-red-400 mt-3 text-sm bg-red-500/10 border border-red-400/20 rounded-lg p-3">{error.message}</div>}
        </div>
      </form>
    </div>
  );
};
export default CreatePost;