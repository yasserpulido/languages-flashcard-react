const colorClasses = {
  primary: "bg-blue-500 hover:text-blue-200 text-white",
  secondary: "bg-gray-500 hover:text-gray-200 text-white",
  success: "bg-green-500 hover:text-green-200 text-white",
  danger: "bg-red-500 hover:text-red-200 text-white",
  warning: "bg-yellow-500 hover:text-yellow-800 text-black",
};

const borderClasses = {
  primary: "btn-border-primary",
  secondary: "btn-border-secondary",
  success: "btn-border-success",
  danger: "btn-border-danger",
  warning: "btn-border-warning",
};

type Props = {
  onClick?: () => void;
  children: React.ReactNode;
  color: "primary" | "secondary" | "success" | "danger" | "warning";
  type?: "button" | "submit" | "reset";
};

const Button = ({ onClick, children, color, type = "button" }: Props) => {
  return (
    <button
      type={type}
      className={`border-2 rounded-xl font-bold px-5 py-2 min-w-28 ${colorClasses[color]} ${borderClasses[color]}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
