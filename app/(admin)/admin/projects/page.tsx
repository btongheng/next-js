"use client"
import { useCallback, useEffect, useReducer, useState } from "react"
import Link from "next/link"
import { TrashIcon, ReloadIcon, MagnifyingGlassIcon, ChevronRightIcon, ChevronLeftIcon } from "@radix-ui/react-icons";
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
import debounce from "lodash.debounce";
import { Input } from "@/components/ui/input";

export default function ProjectsPage() {

    const [loading, setLoading] = useState(false)

    const router = useRouter();
    const [response, setResponse] = useReducer((prev: any, next: any) => {
        return { ...prev, ...next }
    }, {
        data: [],
        loading: true,
        searchTerm: '',
        page: 0
    })

    const fetchProjects = async (value: string = '', page: number = 0) => {
        const apiResponse = await fetch(`/api/projects?term=${value}&page=${page}&limit=2`, {
            method: 'GET',
        }).then((res) => res.json())

        setResponse({
            data: apiResponse.data,
            loading: false,
        })
    }

    const deleteProject = async (id: string) => {
        setLoading(true)
        const res = await fetch("/api/projects", {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ id })
        });
        const response = await res.json();
        if (response?.status === 204) {
            fetchProjects()
        }
        setLoading(false)

    }

    useEffect(() => {
        fetchProjects();
    }, [])


    const debounceAPI = useCallback(debounce((value: string) => fetchProjects(value), 500), [])

    const onChangeSearchTerm = (e: HTMLInputElement) => {
        setResponse({ searchTerm: e.target.value })
        debounceAPI(e.target.value)

    }

    return (
        <>
            <div className="flex mb-5">
                <div className="relative">
                    <MagnifyingGlassIcon className="absolute top-2.5 left-2.5" />
                    <Input type="text" placeholder="Enter blog titile" className="pl-8" onChange={onChangeSearchTerm} />
                </div>
                <div>
                    <Button disabled={response.page === 0 ? true : false} variant="outline" size="icon" onClick={() => {
                        const page = response.page - 1;
                        setResponse({ page })
                        fetchProjects(response.term, page)
                    }}>
                        <ChevronLeftIcon className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => {
                        const page = response.page + 1;
                        setResponse({ page })
                        fetchProjects(response.term, page)
                    }}>
                        <ChevronRightIcon className="h-4 w-4" />
                    </Button>
                </div>
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
                                            <Link className="text-xl font-semibold text-gray-800 hover:text-blue-600" href={`/admin/projects/${d.id}`}>{d.title}</Link>
                                            <p className="text-sm text-gray-500">{d?.description ? d?.description : 'No description'}</p>
                                        </div>
                                        <div className="opacity-0 group-hover:opacity-90 transition-opacity">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="outline"><TrashIcon /></Button>
                                                </DialogTrigger>
                                                <DialogContent className="sm:max-w-[320px]">
                                                    <DialogHeader>
                                                        <DialogTitle>Delete Project?</DialogTitle>
                                                        <DialogDescription>
                                                            Are you sure you want to delete <b>{d.title}</b>?
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <DialogFooter>
                                                        <Button disabled={loading} onClick={() => { deleteProject(d.id) }}>{
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