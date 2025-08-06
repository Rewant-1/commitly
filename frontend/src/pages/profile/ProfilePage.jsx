import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Posts from "../../components/svgs/common/Posts";
import ProfileHeaderSkeleton from "../../components/skeletons/ProfileHeaderSkeleton";
import EditProfileModal from "./EditProfileModal";

import { POSTS } from "../../utils/db/dummy";

import { FaArrowLeft } from "react-icons/fa6";
import { IoCalendarOutline } from "react-icons/io5";
import { FaLink } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { useQuery } from "@tanstack/react-query";
import { formatMemberSinceDate } from "../../utils/date";

import useFollow from "../../hooks/useFollow";
import useUpdateUserProfile from "../../hooks/useUpdateUserProfile";

const ProfilePage = () => {
  const [coverImg, setCoverImg] = useState(null);
  const [profileImg, setProfileImg] = useState(null);
  const [feedType, setFeedType] = useState("posts");
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);

  const coverImgRef = useRef(null);
  const profileImgRef = useRef(null);

  const { username } = useParams();

  const { follow, pendingId } = useFollow();
  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      return data;
    },
  });

  const {
    data: user,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/users/profile/${username}`);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
  });

  const { isUpdatingProfile, updateProfile } = useUpdateUserProfile();

  const isMyProfile = authUser._id === user?._id;
  const memberSinceDate = formatMemberSinceDate(user?.createdAt);
  const amIFollowing = authUser?.following.includes(user?._id);

  const handleImgChange = (e, state) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        state === "coverImg" && setCoverImg(reader.result);
        state === "profileImg" && setProfileImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    refetch();
  }, [username, refetch]);

  return (
    <>
      <div className="flex-[4_4_0]  border-r border-green-400 min-h-screen ">
        {/* HEADER */}
        {(isLoading || isRefetching) && <ProfileHeaderSkeleton />}
        {!isLoading && !isRefetching && !user && (
          <p className="text-center text-lg mt-4 text-green-400 font-mono">
            Developer not found
          </p>
        )}
        <div className="flex flex-col">
          {!isLoading && !isRefetching && user && (
            <>
              <div className="flex gap-10 px-4 py-2 items-center">
                <Link to="/">
                  <FaArrowLeft className="w-4 h-4 text-green-400" />
                </Link>
                <div className="flex flex-col">
                  <p className="font-bold text-lg text-cyan-300 font-mono">
                    {user?.fullName}
                  </p>
                  <span className="text-sm text-purple-400 font-mono">
                    {POSTS?.length} commits
                  </span>
                </div>
              </div>
              {/* COVER IMG */}
              <div className="relative group/cover">
                <img
                  src={coverImg || user?.coverImg || "/cover.png"}
                  className="h-52 w-full object-cover border border-green-400"
                  alt="cover image"
                />
                {isMyProfile && (
                  <div
                    className="absolute top-2 right-2 rounded-full p-2 bg-gray-800 bg-opacity-75 cursor-pointer opacity-0 group-hover/cover:opacity-100 transition duration-200 border border-green-400"
                    onClick={() => coverImgRef.current.click()}
                  >
                    <MdEdit className="w-5 h-5 text-green-400" />
                  </div>
                )}

                <input
                  type="file"
                  hidden
                  accept="image/*"
                  ref={coverImgRef}
                  onChange={(e) => handleImgChange(e, "coverImg")}
                />
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  ref={profileImgRef}
                  onChange={(e) => handleImgChange(e, "profileImg")}
                />
                {/* USER AVATAR */}
                <div className="avatar absolute -bottom-16 left-4">
                  <div className="w-32 rounded-full relative group/avatar border border-green-400">
                    <img
                      src={
                        profileImg || user?.profileImg || "/avatar-placeholder.jpg"
                      }
                    />
                    <div className="absolute top-5 right-3 p-1 bg-green-400 rounded-full group-hover/avatar:opacity-100 opacity-0 cursor-pointer">
                      {isMyProfile && (
                        <MdEdit
                          className="w-4 h-4 text-black"
                          onClick={() => profileImgRef.current.click()}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end px-4 mt-5">
                {isMyProfile && <EditProfileModal authUser={authUser} />}
                {!isMyProfile && (
                  <button
                    className="btn btn-outline rounded-full btn-sm border-green-400 text-green-400 hover:bg-green-400 hover:text-black font-mono"
                    onClick={() => follow(user?._id)}
                    disabled={pendingId === user?._id}
                  >
                    {pendingId === user?._id && "Loading..."}
                    {pendingId !== user?._id && amIFollowing && "git remote rm"}
                    {pendingId !== user?._id && !amIFollowing && "git remote add"}
                  </button>
                )}
                {(coverImg || profileImg) && (
                  <button
                    className="btn bg-green-400 text-black hover:bg-green-500 rounded-full btn-sm px-4 ml-2 font-mono"
                    onClick={async () => {
                      await updateProfile({ coverImg, profileImg });
                      setProfileImg(null);
                      setCoverImg(null);
                    }}
                  >
                    {isUpdatingProfile ? "git push..." : "git push"}
                  </button>
                )}
              </div>

              <div className="flex flex-col gap-4 mt-14 px-4">
                <div className="flex flex-col">
                  <span className="font-bold text-lg text-cyan-300 font-mono">
                    {user?.fullName}
                  </span>
                  <span className="text-sm text-purple-400 font-mono">
                    @{user?.username}
                  </span>
                  <span className="text-sm my-1 text-blue-200 font-mono">
                    {user?.bio}
                  </span>
                </div>

                <div className="flex gap-2 flex-wrap">
                  {user?.link && (
                    <div className="flex gap-1 items-center ">
                      <>
                        <FaLink className="w-3 h-3 text-green-400" />
                        <a
                          href="https://youtube.com/@asaprogrammer_"
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm text-green-400 hover:underline font-mono"
                        >
                          {user?.link}
                        </a>
                      </>
                    </div>
                  )}
                  <div className="flex gap-2 items-center">
                    <IoCalendarOutline className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-green-500 font-mono">
                      Joined {memberSinceDate}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    className="flex gap-1 items-center hover:underline focus:outline-none"
                    onClick={() => setShowFollowing(true)}
                  >
                    <span className="font-bold text-xs text-yellow-300 font-mono">
                      {user?.following.length}
                    </span>
                    <span className="text-green-500 text-xs font-mono">
                      Remotes
                    </span>
                  </button>
                  <button
                    className="flex gap-1 items-center hover:underline focus:outline-none"
                    onClick={() => setShowFollowers(true)}
                  >
                    <span className="font-bold text-xs text-yellow-300 font-mono">
                      {user?.followers.length}
                    </span>
                    <span className="text-green-500 text-xs font-mono">
                      Watching
                    </span>
                  </button>
                </div>
      {/* Followers Modal */}
      {showFollowers && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-gray-900 border-2 border-green-400/60 rounded-xl p-6 w-full max-w-md mx-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-green-400 font-mono font-bold text-lg">Watching</h2>
              <button className="text-green-400 font-bold text-xl" onClick={() => setShowFollowers(false)}>&times;</button>
            </div>
            <div className="max-h-72 overflow-y-auto">
              {user?.followers.length === 0 ? (
                <p className="text-green-400/70 font-mono">No watchers yet.</p>
              ) : (
                user.followers.map((follower) => (
                  <div key={follower._id} className="flex items-center gap-3 py-2 border-b border-green-400/10">
                    <img src={follower.profileImg || "/avatar-placeholder.jpg"} alt={follower.fullName} className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <span className="text-green-400 font-mono font-semibold">{follower.fullName}</span>
                      <span className="text-green-400/70 font-mono text-xs ml-2">@{follower.username}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Following Modal */}
      {showFollowing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-gray-900 border-2 border-green-400/60 rounded-xl p-6 w-full max-w-md mx-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-green-400 font-mono font-bold text-lg">Remotes</h2>
              <button className="text-green-400 font-bold text-xl" onClick={() => setShowFollowing(false)}>&times;</button>
            </div>
            <div className="max-h-72 overflow-y-auto">
              {user?.following.length === 0 ? (
                <p className="text-green-400/70 font-mono">No remotes added yet.</p>
              ) : (
                user.following.map((followed) => (
                  <div key={followed._id} className="flex items-center gap-3 py-2 border-b border-green-400/10">
                    <img src={followed.profileImg || "/avatar-placeholder.jpg"} alt={followed.fullName} className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <span className="text-green-400 font-mono font-semibold">{followed.fullName}</span>
                      <span className="text-green-400/70 font-mono text-xs ml-2">@{followed.username}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
              </div>
              <div className="flex w-full border-b border-green-400 mt-4">
                <div
                  className="flex justify-center flex-1 p-3 hover:bg-gray-800 transition duration-300 relative cursor-pointer text-green-300 font-mono"
                  onClick={() => setFeedType("posts")}
                >
                  git log
                  {feedType === "posts" && (
                    <div className="absolute bottom-0 w-10 h-1 rounded-full bg-green-400" />
                  )}
                </div>
                <div
                  className="flex justify-center flex-1 p-3 text-green-500 hover:bg-gray-800 transition duration-300 relative cursor-pointer font-mono"
                  onClick={() => setFeedType("likes")}
                >
                  git star
                  {feedType === "likes" && (
                    <div className="absolute bottom-0 w-10  h-1 rounded-full bg-green-400" />
                  )}
                </div>
              </div>
            </>
          )}

          <Posts feedType={feedType} username={username} userId={user?._id} />
        </div>
      </div>
    </>
  );
};
export default ProfilePage;
