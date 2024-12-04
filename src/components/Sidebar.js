import React from "react";
import {
  AiFillHome,
  AiOutlineSearch,
  AiOutlineOrderedList,
} from "react-icons/ai";
import { BiLibrary } from "react-icons/bi";
import "./Sidebar.css";

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="logo">
        <h1>V</h1>
      </div>
      <div className="sidebar-menu">
        <div className="menu-item active">
          <AiFillHome />
          <span>Home</span>
        </div>
        <div className="menu-item">
          <AiOutlineSearch />
          <span>Search</span>
        </div>
        <div className="menu-item">
          <BiLibrary />
          <span>Your Library</span>
        </div>
        <div className="menu-item">
          <AiOutlineOrderedList />
          <span>Playlists</span>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
