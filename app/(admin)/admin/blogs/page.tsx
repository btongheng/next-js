"use client"
import { useEffect, useReducer, useState } from "react"
import Link from "next/link"
import { TrashIcon, ReloadIcon } from "@radix-ui/react-icons";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation";

export default function BlogsPage() {

    const [loading, setLoading] = useState(false)

    const router = useRouter();
    const [response, setResponse] = useReducer((prev: any, next: any) => {
        return { ...prev, ...next }
    }, {
        data: [],
        loading: true,
    })

    const fetchBlogs = async () => {
        const res = await fetch("/api/blogs", {
            method: 'GET',
        });
        const response = await res.json();

        setResponse({
            data: response.data,
            loading: false,
        })
    }

    const deleteBlog = async (id: string) => {
        setLoading(true)
        const res = await fetch("/api/blogs", {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ id })
        });
        const response = await res.json();
        if (response?.status === 204) {
            fetchBlogs()
        }
        setLoading(false)

    }

    useEffect(() => {
        fetchBlogs();
    }, [])

    return (
        <>
            <div className="flex mb-5">
                <div>
                    <h2 className="text-2xl font-bold">Blogs</h2>
                </div>
                <div></div>
            </div>

            {response.loading ? (
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-300 rounded col-span-2 mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded col-span-2 mb-2"></div>
                </div>
            ) : (
                <>
                    {response.data.length > 0 ? (
                        <div className="">
                            {response.data.map(
                                (d: { title: string, id: string, description: string }) => (
                                    <div key={d.id} className="mb-4 flex justify-between items-center rounded-lg group p-4 border shadow-sm">
                                        <div>
                                            <Link className="text-xl font-semibold text-gray-800 hover:text-blue-600" href={`/admin/blogs/${d.id}`}>{d.title}</Link>
                                            <p className="text-sm text-gray-500">{d?.description ? d?.description : 'No description'}</p>
                                        </div>
                                        <div className="opacity-0 group-hover:opacity-90 transition-opacity">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="outline"><TrashIcon /></Button>
                                                </DialogTrigger>
                                                <DialogContent className="sm:max-w-[320px]">
                                                    <DialogHeader>
                                                        <DialogTitle>Delete Blog?</DialogTitle>
                                                        <DialogDescription>
                                                            Are you sure you want to delete <b>{d.title}</b>?
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <DialogFooter>
                                                        <Button disabled={loading} onClick={() => { deleteBlog(d.id) }}>{
                                                            loading ? <><ReloadIcon className="h-4 w-4 mr-2 animate-spin" /> Delete</> : "Delete"
                                                        }</Button>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    ) : (
                        <h1 className="text-gray-400">No data Found</h1>
                    )}
                </>
            )
            }
        </>
    )
}