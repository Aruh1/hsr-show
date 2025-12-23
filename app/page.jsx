import Search from "./Search";
import ApiStatus from "./ApiStatus";

export default function Home() {
    return (
        <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-6 text-center md:p-12">
            <h1 className="animate-fade-in bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-4xl text-transparent md:text-6xl">
                HSR Show
            </h1>
            <span className="animate-slide-up max-w-xl text-base text-gray-300 md:text-xl">
                Fetch data from your Trailblazer Profile and display a build card for Honkai: Star Rail
            </span>
            <div className="animate-slide-up-delay">
                <Search />
            </div>
            <div className="animate-slide-up-delay-2">
                <ApiStatus />
            </div>
        </div>
    );
}
