import Image from "next/image"

const FullLogo = () => {
    return (
        <div className="flex space-x-2">
            <Image src="/logo.svg" alt="Logo" width={32} height={32}/>
            <div className="flex flex-col text-left leading-none ">
                <span className="uppercase font-bold tracking-widest bold text-custom-yellow-100">Arctans</span>
                <span className="uppercase font-bold text-xs bg-gradient-to-bl from-custom-yellow-200 to-custom-yellow-300 bg-clip-text text-transparent">Investment Club</span>
            </div>
        </div>
    )
}

export default FullLogo