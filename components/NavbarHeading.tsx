"use client"
import { usePathname } from "next/navigation"

export default function () {
    const path = usePathname();
    const pageNames = path.split("/")
    const heading = pageNames.length > 2 ? pageNames[2] : pageNames[1];

    return (
        <div className="text-xl font-bold capitalize">{heading}</div>
    )
}