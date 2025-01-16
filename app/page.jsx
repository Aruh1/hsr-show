import Search from "./Search";
import ApiStatus from "./ApiStatus";

export default function Home() {
    return (
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 space-y-2 p-12 text-center">
            <h1 className="text-6xl">HSR Show</h1>
            <span className="text-xl">
                Fetch data from your Trailblazer Profile and display a build card for Honkai: Star Rail
            </span>
            <Search />
            <ApiStatus />
        </div>
    );
}
