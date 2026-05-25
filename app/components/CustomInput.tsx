type CustomInputProps = React.InputHTMLAttributes<HTMLInputElement>;

const CustomInput = ({
    className = "",
    ...props
}: CustomInputProps) => {
    return (
        <input
            className={`w-full p-3 rounded-lg border border-gray-300 outline-none text-black focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 transition ${className}`}
            {...props}
        />
    );
};

export default CustomInput;