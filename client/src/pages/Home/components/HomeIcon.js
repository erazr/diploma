import { RiHome6Fill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

export const HomeIcon = ({ isActive, setActive }) => {
  return (
    <div className="relative mt-2 flex h-[46px] items-center justify-center">
      <div
        onClick={() => {
          setActive("home");
        }}
        className={
          "group flex min-h-[46px] min-w-[46px] flex-col items-center justify-center bg-[#1f2b39] text-[#4295ff] transition-[border_background] duration-150 hover:cursor-pointer hover:rounded-[35%] " +
          (isActive === "home" ? "rounded-[35%]" : "rounded-[50%]")
        }
      >
        <RiHome6Fill size="24px" color="inherit" cursor="pointer" />
        <span
          className="absolute left-0 h-0 w-0 rounded-[25%] bg-[#fff] opacity-0 transition-[width_height] 
          group-hover:h-[55%] group-hover:w-[4px] group-hover:rounded-[0_8px_8px_0] group-hover:opacity-100 
          "
          style={
            isActive === "home"
              ? {
                  opacity: "1",
                  borderRadius: "0 8px 8px 0",
                  width: "4px",
                  height: "80%",
                }
              : null
          }
        ></span>
      </div>
    </div>
  );
};
