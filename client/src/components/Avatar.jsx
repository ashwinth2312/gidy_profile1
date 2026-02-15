import "../styles/Avatar.css";

export function Avatar({ fullName = "User", size = "md" }) {
  const getInitials = (name) => {
    if (!name || name.trim() === "") return "U";
    
    const parts = name.trim().split(" ");
    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }
    
    const firstInitial = parts[0].charAt(0).toUpperCase();
    const lastInitial = parts[parts.length - 1].charAt(0).toUpperCase();
    return `${firstInitial}${lastInitial}`;
  };

  const getAvatarColor = (name) => {
    const colors = [
      "#3b82f6", // blue
      "#8b5cf6", // purple
      "#ec4899", // pink
      "#f59e0b", // amber
      "#10b981", // emerald
      "#06b6d4", // cyan
      "#ef4444", // red
      "#14b8a6", // teal
    ];

    // Generate consistent color based on name
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  const initials = getInitials(fullName);
  const backgroundColor = getAvatarColor(fullName);

  return (
    <div 
      className={`avatar avatar-${size}`}
      style={{ backgroundColor }}
      title={fullName}
    >
      <span className="avatarText">{initials}</span>
    </div>
  );
}