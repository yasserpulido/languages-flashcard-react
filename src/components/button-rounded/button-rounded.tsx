import {
  Checkmark,
  Close,
  DownloadOption,
  Sync,
  UploadOption,
  Volume,
} from "grommet-icons";

type ButtonRoundedProps = {
  onClick?: () => void;
  icon: "left" | "right" | "flip" | "sound" | "download" | "upload";
};

const iconClasses = {
  left: "bg-red-500 hover:text-red-200 text-white",
  right: "bg-green-500 hover:text-green-200 text-white",
  flip: "bg-blue-500 hover:text-blue-200 text-white",
  sound: "bg-yellow-500 hover:text-yellow-800 text-black",
  download: "bg-gray-500 hover:text-gray-200 text-white",
  upload: "bg-gray-500 hover:text-gray-200 text-white",
};

const borderClasses = {
  flip: "btn-border-primary",
  right: "btn-border-success",
  left: "btn-border-danger",
  sound: "btn-border-warning",
  download: "btn-border-file",
  upload: "btn-border-file",
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
      case "download":
        return <DownloadOption size="medium" color="white" />;
      case "upload":
        return <UploadOption size="medium" color="white" />;
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
