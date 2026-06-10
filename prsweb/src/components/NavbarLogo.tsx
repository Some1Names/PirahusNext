import Image from "next/image";

export default function NavbarLogo() {
    return (
        <div className="fixed top-0 left-5 z-50">
            <Image
                src="/images/prslogo.png"
                className="w-auto h-auto invert"
                alt="Logo"
                width={130}
                height={130}
                priority
            />
        </div>
    );
}