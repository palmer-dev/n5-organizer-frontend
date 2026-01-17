import {Link} from '@tanstack/react-router'
import type {ReactNode} from "react";

export function NotFound({children}: { children?: ReactNode }) {
    return (
        <div className="space-y-4 p-2 h-screen w-screen flex flex-col items-center justify-center">
            <div className="text-gray-600 dark:text-gray-400">
                {children || <p>The page you are looking for does not exist.</p>}
            </div>
            <p className="flex items-center gap-2 flex-wrap">
                <button
                    onClick={() => window.history.back()}
                    className="bg-gray-500 text-white px-2 py-1 rounded-sm uppercase font-black text-sm"
                >
                    Go back
                </button>
                <Link
                    to="/"
                    className="bg-red-600 text-white px-2 py-1 rounded-sm uppercase font-black text-sm"
                >
                    Start Over
                </Link>
            </p>
        </div>
    )
}