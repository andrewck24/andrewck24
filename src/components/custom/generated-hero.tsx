interface GeneratedHeroProps {
  ogImage?: {
    text?: string;
    background?: string;
    className?: string;
  };
}

export function GeneratedHero({ ogImage }: GeneratedHeroProps) {
  const backgroundImage = ogImage?.background;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: backgroundImage
          ? `url(${backgroundImage})`
          : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
        padding: "2rem",
      }}
    >
      {ogImage?.text && (
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: "bold",
            color: "#fff",
            textAlign: "center",
            lineHeight: 1.3,
            maxWidth: "100%",
            wordBreak: "keep-all",
            overflowWrap: "break-word",
          }}
        >
          {ogImage.text}
        </h1>
      )}
    </div>
  );
}
