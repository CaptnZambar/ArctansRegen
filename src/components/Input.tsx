interface Props {
    id: string;
    placeholder: string;
    name: string;
    type?: string;
}

const Input: React.FC<Props> = ({ id, type = "text", placeholder, name}) => {
    return (
            <input 
                className="px-4 py-3.5 min-w-sm text-white placeholder-gray-400 bg-transparent outline-none border border-gray-800 rounded-lg focus:ring focus:ring-indigo-300" 
                id={id}
                type={type}
                placeholder={placeholder}
                name={name} 
            >
            </input>
    )
}

export default Input