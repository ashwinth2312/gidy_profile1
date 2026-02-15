export const Logo = ({ size = "md", isDark = false }) => {
  const sizes = {
    sm: { width: 24, height: 24, fontSize: 12 },
    md: { width: 32, height: 32, fontSize: 16 },
    lg: { width: 40, height: 40, fontSize: 20 },
  };

  const style = sizes[size];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: style.width,
        height: style.height,
        borderRadius: "8px",
        background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
        color: "white",
        fontWeight: "700",
        fontSize: style.fontSize,
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 4px 12px rgba(79, 70, 229, 0.3)",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2), transparent)",
          pointerEvents: "none",
        }}
      />
      <span style={{ position: "relative", zIndex: 1 }}>P</span>
    </div>
  );
};

export default Logo;