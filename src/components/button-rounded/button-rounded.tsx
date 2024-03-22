import { Checkmark, Close, Sync, Volume } from "grommet-icons";

type ButtonRoundedProps = {
  onClick?: () => void;
  icon: "left" | "right" | "flip" | "sound";
};

const iconClasses = {
  left: "bg-red-500 hover:text-red-200 text-white",
  right: "bg-green-500 hover:text-green-200 text-white",
  flip: "bg-blue-500 hover:text-blue-200 text-white",
  sound: "bg-yellow-500 hover:text-yellow-800 text-black",
};

const borderClasses = {
  flip: "btn-border-primary",
  right: "btn-border-success",
  left: "btn-border-danger",
  sound: "btn-border-warning",
};

const ButtonRounded = ({ onClick, icon }: ButtonRoundedProps) => {
  const handleIcon = (icon: string) => {
    switch (icon) {
      case "left":
        return <Close size="medium" color="white" />;
      case "right":
        return <Checkmark size="medium" color="white" />;
      case "flip":
        return <Sync size="medium" color="white" />;
      case "sound":
        return <Volume size="medium" color="black" />;
    }
  };

  return (
    <button
      className={`border-2 rounded-full w-12 h-12 p-1 ${iconClasses[icon]} ${
        borderClasses[icon]
      } ${icon === "sound" ? "btn-rounded-warning" : ""}`}
      onClick={onClick}
    >
      {handleIcon(icon)}
    </button>
  );
};

export default ButtonRounded;
