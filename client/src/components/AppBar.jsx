import { useContext } from "react";
import { ThemeContext } from "../ThemeContext";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import Icons from "./Icons";
import "./AppBar.css";

export const AppBar = ({ profileName = "Profile Builder" }) => {
  const { isDark } = useContext(ThemeContext);

  return (
    <div className="appBar">
      <div className="appBarContent">
        {/* Left Section - Logo and Title */}
        <div className="appBarLeft">
          <div className="logoWrapper">
            <Logo size="md" isDark={isDark} />
          </div>
          
          <div className="appBarTitle">
            <h1 className="appBarMainTitle">Profile Builder</h1>
            <p className="appBarSubtitle">Create your professional profile</p>
          </div>
        </div>

        

        {/* Right Section - Actions */}
        <div className="appBarRight">
        
          <ThemeToggle />
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="appBarAccent"></div>
    </div>
  );
};

export default AppBar;

