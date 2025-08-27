import { MdHomeFilled } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import toast from "../../../utils/toast";

const Sidebar = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutate: logout } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch("/api/auth/logout", {
          method: "POST",
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: () => {
      toast.error("Logout failed");
    },
  });
  const location = useLocation();
  const isAuthRoute = ["/", "/notifications"].includes(location.pathname) || location.pathname.startsWith("/profile");
  const { data: authUser, error } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const res = await fetch("/api/auth/me");
      if (res.status === 401) {
        throw new Error("Unauthorized");
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      return data;
    },
    enabled: isAuthRoute,
  });

  if (error?.message === "Unauthorized" && isAuthRoute) {
    navigate("/login");
    return null;
  }

  return (
    <div className="md:flex-[2_2_0] w-18 max-w-52 bg-[#101014] border-r border-green-400/60">
  <div className="sticky top-0 left-0 z-10 h-screen flex flex-col border-r border-green-400/60 w-20 md:w-full bg-[#101014]">
        <Link to="/" className="flex justify-center md:justify-start">
          <div className="p-4 text-green-400 font-mono text-xl font-bold hover:text-green-300 transition-colors border-b border-green-400/20">
            <span className="hidden md:inline"> git --commitly</span>
          </div>
        </Link>
        <ul className="flex flex-col gap-2 mt-6 px-2">
          <li className="flex justify-center md:justify-start">
            <Link
              to="/"
              className="flex gap-3 items-center hover:bg-gradient-to-r from-green-400/10 to-green-400/5 hover:border-l-2 hover:border-green-400 transition-all rounded-r-lg duration-300 py-3 pl-3 pr-4 w-full cursor-pointer text-green-400 group"
            >
              <MdHomeFilled className="w-6 h-6 group-hover:text-green-300 transition-colors" />
              <span className="text-sm font-medium hidden md:block group-hover:text-green-300">
                $ cd ~/home
              </span>
            </Link>
          </li>
          <li className="flex justify-center md:justify-start">
            <Link
              to="/notifications"
              className="flex gap-3 items-center hover:bg-gradient-to-r from-green-400/10 to-green-400/5 hover:border-l-2 hover:border-green-400 transition-all rounded-r-lg duration-300 py-3 pl-3 pr-4 w-full cursor-pointer text-green-400 group"
            >
              <IoNotifications className="w-6 h-6 group-hover:text-green-300 transition-colors" />
              <span className="text-sm font-medium hidden md:block group-hover:text-green-300">
                $ tail -f alerts
              </span>
            </Link>
          </li>
          <li className="flex justify-center md:justify-start">
            <Link
              to={`/profile/${authUser?.username}`}
              className="flex gap-3 items-center hover:bg-gradient-to-r from-green-400/10 to-green-400/5 hover:border-l-2 hover:border-green-400 transition-all rounded-r-lg duration-300 py-3 pl-3 pr-4 w-full cursor-pointer text-green-400 group"
            >
              <FaUser className="w-6 h-6 group-hover:text-green-300 transition-colors" />
              <span className="text-sm font-medium hidden md:block group-hover:text-green-300">
                $ whoami
              </span>
            </Link>
          </li>
        </ul>
        {authUser && (
          <Link
            to={`/profile/${authUser.username}`}
            className="mt-auto mb-6 mx-3 flex gap-3 items-center transition-all duration-300 hover:bg-gradient-to-r from-green-400/10 to-green-400/5 py-3 px-3 rounded-lg border border-green-400/20 hover:border-green-400/40 group"
          >
            <div className="avatar">
              <div className="w-10 rounded-full ring-2 ring-green-400/50 group-hover:ring-green-400">
                <img
                  src={authUser?.profileImg || "/avatar-placeholder.jpg"}
                  alt="Avatar"
                  width="40"
                  height="40"
                  decoding="async"
                />
              </div>
            </div>
            <div className="justify-between flex-1 hidden md:flex">
              <div>
                <p className="text-green-400 font-mono text-sm font-semibold w-20 truncate group-hover:text-green-300">
                  {authUser?.fullName}
                </p>
                <p className="text-green-400/70 font-mono text-xs">
                  @{authUser?.username}
                </p>
              </div>
              <BiLogOut
                className="w-5 h-5 cursor-pointer text-green-400/70 hover:text-red-400 transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  logout();
                }}
              />
            </div>
          </Link>
        )}
      </div>
    </div>
  );
};
export default Sidebar;
