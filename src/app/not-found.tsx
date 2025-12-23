import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
    return (
        <div className="flex min-h-screen items-center justify-center text-center">
            <div className="flex flex-col items-center gap-5">
                <Image unoptimized={true} src="/herta-kurukuru.gif" alt="Loading" width={256} height={256} />
                <div>
                    <h1 className="text-4xl">Kuru kuru ~ 404!</h1>
                    <Link href="/" className="btn mt-4 inline-block px-6 py-2 text-xl">
                        Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
