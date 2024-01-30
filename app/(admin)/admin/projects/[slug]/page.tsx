"use client"
import BlogForm from "@/components/BlogForm";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useEffect, useReducer } from "react";

interface ParamProps {
    slug: String;
}


interface ProjectDetailPageProps {
    params: ParamProps
}

export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
    const [response, setResponse] = useReducer((prev: any, next: any) => {
        return { ...prev, ...next }
    }, {
        loading: true,
        data: {}
    })

    const fetchBlogs = async () => {
        const response = await fetch(`/api/projects?id=${params.slug}`).then(res => res.json())

        setResponse({ data: response.data, loading: false })
    }

    useEffect(() => {
        fetchBlogs()
    }, [])

    if (response.loading) {
        return (
            <div className="animate-pulse">
                <div className="h-4 bg-gray-300 rounded col-span-2 mb-2"></div>
            </div>
        )
    }


    return (
        <BlogForm id={params.slug} variant="project" value={response?.data} />
    )
}
