"use client"
import BlogForm from "@/components/BlogForm";
import { useEffect, useReducer } from "react";

interface ParamProps {
    slug: String;
}


interface BlogDetailPageProps {
    params: ParamProps
}

export default function BlogDetailPage({ params }: BlogDetailPageProps) {
    const [response, setResponse] = useReducer((prev, next) => {
        return { ...prev, ...next }
    }, {
        loading: true,
        data: {}
    })

    const fetchBlogs = async () => {
        const response = await fetch(`/api/blogs?id=${params.slug}`).then(res => res.json())

        setResponse({ data: response.data, loading: false })
    }

    useEffect(() => {
        fetchBlogs()
    }, [])

    if (response.loading) {
        return (
            <h1>Loading...</h1>
        )
    }


    return (
        <BlogForm id={params.slug} value={response?.data} />
    )
}
