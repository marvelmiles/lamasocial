import { useContext } from "react";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import { AuthContext } from "../../context/AuthContext";
import "./home.css"
import { Redirect } from "react-router-dom";

export default function Home() {
  const { user: currentUser } = useContext(AuthContext);
  return (
    <>
     {
       !currentUser ? <Redirect to="/login" from="/" /> :
       (
         <>
                <Topbar />
      <div className="homeContainer">
        <Sidebar />
        <Feed/>
        <Rightbar user={currentUser} />
      </div>
      </>
       )
     }
    </>
  );
}
