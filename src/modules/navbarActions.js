import { useState } from "react";

const useNavbarActions = () => {
  const [unfold, setUnfold] = useState(false);

  const handleBurgerBtnClick = () => {
    setUnfold(!unfold);
  };

  const handleNavItemClick = (index, windowHeight) => {
    const topOffset = index * windowHeight;
    window.scrollTo({
      top: topOffset,
      behavior: "smooth",
    });
  };

  return { unfold, handleBurgerBtnClick, handleNavItemClick };
};

export default useNavbarActions;
