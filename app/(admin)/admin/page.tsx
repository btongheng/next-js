"use client"
import {
    Card,
    CardContent,
    CardTitle,
} from "@/components/ui/card"
import { useEffect, useReducer } from "react"


export default function AdminPage() {
    const [data, setData] = useReducer((prev: any, next: any) => {
        return { ...prev, ...next }
    }, {
        loading: true,
        project: null,
        blog: null
    })

    const fetchDashboardDetails = async () => {
        const response = await fetch('/api/app').then(res => res.json())

        setData({
            loading: false,
            ...response
        })
    }

    useEffect(() => {
        fetchDashboardDetails()
    }, [])


    return (
        <div className="flex gap-5">
            <Card className="w-52 p-4">
                <CardTitle>
                    Total Projects
                </CardTitle>
                <CardContent className="flex justify-center items-center py-5">
                    {data.loading ? (
                        <div className="animate-pulse w-full">
                            <h2 className="h-4 bg-gray-300 rounded">
                            </h2>
                        </div>
                    ) :
                        <>
                            <h2 className="text-5xl font-semibold">
                                {data?.project}
                            </h2>
                        </>
                    }
                </CardContent>
            </Card>

            <Card className="w-52 p-4">
                <CardTitle>
                    Total Blogs
                </CardTitle>
                <CardContent className="flex justify-center items-center py-5">
                    {data.loading ? (
                        <div className="animate-pulse w-full">
                            <h2 className="h-4 bg-gray-300 rounded">
                            </h2>
                        </div>
                    ) :
                        <>
                            <h2 className="text-5xl font-semibold">
                                {data?.blog}
                            </h2>
                        </>
                    }
                </CardContent>
            </Card>
        </div>
    )
}
