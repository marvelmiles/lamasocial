import "./topbar.css";
import { Search, Person, Chat, Notifications } from "@material-ui/icons";
import { Link, useHistory } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import GroupView from '../../components/GroupView';
import axios from 'axios';
import {format} from 'timeago.js';

export default function Topbar() {
  const { user,dispatch } = useContext(AuthContext);
 const [suggestions, setSuggestions] = useState([]);
 const [query, setQuery] = useState("");
 const history = useHistory();
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  const search = async e=>{
    let value = e.target.value;
    setQuery(value);
    if (value.length === 0) {
      setSuggestions([]);
    } else {
      try {
        const res = await axios.get(`${BACKEND_URL}/search?query=${value}&uid=${user._id}`);
        const users = res.data.users.map(res=>{
          return {...res, group: 'user'}
        });
        const posts = res.data.posts.map(res=>{
          return {...res, group: 'post'}
        });
        setSuggestions([...users, ...posts]);
    } catch (err) {
        console.log('error fetching search', err?.response?.data.error)
  }
    }
}

  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="logo">Lamasocial</span>
        </Link>
      </div>
      <div className="topbarCenter">
        <div className="search-container">
        <div className="searchbar">
          <Search className="searchIcon" />
          <input
            placeholder="Search for friend, post or video"
            className="searchInput"
            value={query}
            onChange={search}
          />
            </div>
            {
             suggestions.length !== 0 &&
             <div className="suggestions">
             <GroupView  
             titles={["User List", "Post List"]}
             group={['user', 'post']}
             effect={{
               addon: {
                 view: (c)=> {
                   return (
                     <div onClick={()=>{
                       history.push({pathname: c.url})
                     }} className="suggest">
                       <div className={c.group === 'post'?"suggest-imgWrapper": "suggest-imgWrapper topbar-user"} ><img alt={c.img?.alt}  src={c.img?.url} /> </div>
                       <div className="suggest-content">
                         <div>{c.username || c.desc}</div>
                         <p>{format(c.createdAt)}</p>
                       </div>
                     </div>
                   )
                 }
               },
               transforms: [
                 ()=>{
                   const userList = [];
                   suggestions.forEach(suggestion=>{
                     if (suggestion.group === 'user') {
                          userList.push(suggestion);
                     }
                   })
                   return userList;
                 },
                 ()=>{
                      const postList = [];
                      suggestions.forEach(suggestion=>{
                        if (suggestion.group === 'post') {
                          postList.push(suggestion);
                        }
                      })
                      return postList;
                 }
               ]
             }}
             />
             </div>
           }
        </div>
      </div>
      <div className="topbarRight">
        <div className="topbarLinks">
          <span className="topbarLink">Homepage</span>
          <span className="topbarLink">Timeline</span>
        </div>
        <div className="topbarIcons">
          <div className="topbarIconItem">
            <Person />
            <span className="topbarIconBadge">1</span>
          </div>
          <div className="topbarIconItem">
            <Chat />
            <span className="topbarIconBadge">2</span>
          </div>
          <div className="topbarIconItem">
            <Notifications />
            <span className="topbarIconBadge">1</span>
          </div>
        </div>
        <button onClick={()=>dispatch({type: 'LOGOUT'})}>logout</button>
        <Link to={`/profile/${user.username}`}>
          <img
            src={
              user.profilePicture
                ? PF + user.profilePicture
                : PF + "person/noAvatar.png"
            }
            alt=""
            className="topbarImg"
          />
        </Link>
      </div>
    </div>
  );
}
