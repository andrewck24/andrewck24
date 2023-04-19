const handleNavItemClick = (index, windowHeight) => {
  const topOffset = index * windowHeight;
  window.scrollTo({
    top: topOffset,
    behavior: "smooth",
  });
};

export default handleNavItemClick;