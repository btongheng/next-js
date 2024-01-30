"use client"

import { Editor, editorProps } from "novel";
import { Button } from "./ui/button"
import { CheckIcon } from "@radix-ui/react-icons";
import { Label } from "@radix-ui/react-label"
import { Input } from "@/components/ui/input"
import { useCallback, useReducer } from "react"
import { useRouter } from "next/navigation"
import { Textarea } from "./ui/textarea";
import Select from 'react-select';

type Variants = 'blog' | 'project';


interface BlogFormProps {
    id?: string,
    variant?: Variants,
    value?: {
        title: string,
        content: string,
        description: string,
        tags: string,
        cover_url: string
    };
}

const blogTags = [
    {
        label: 'HTML',
        value: 'HTML',
        name: 'HTML'
    },
    {
        label: 'CSS',
        value: 'CSS',
        name: 'CSS'
    },
    {
        label: 'JavaScript',
        value: 'JavaScript',
        name: 'JavaScript'
    },
]

const getDefaultValue = (value: string[]) => {
    if (value.length > 0) {
        return value.map((v: { name: string }) => {
            return {
                label: v,
                name: v,
                value: v
            }
        })
    }
}

const BlogForm = ({ id, value, variant = 'blog' }: BlogFormProps) => {
    const router = useRouter();

    const [blogForm, setBlogForm] = useReducer((prev: any, next: any) => {
        return { ...prev, ...next };
    }, {
        title: value?.title || '',
        content: value?.content || '',
        description: value?.description || '',
        tags: value?.tags || [],
        cover_url: value?.cover_url || '',
    })
    const updateContent = useCallback((data: editorProps) => {
        setBlogForm({ content: data.getJSON() });
    }, [])

    const onSubmitBlog = async () => {
        let req;

        if (id) {
            req = await fetch(`/api/blogs?id=${id}`, {
                method: 'PATCH',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(blogForm)
            })
        } else {
            req = await fetch("/api/blogs", {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(blogForm)
            })
        }
        const response = await req.json();

        if (response?.data?.id) {
            router.push("/admin/blogs");
        }
    }

    const onSubmitProject = async () => {
        let req;

        if (id) {
            req = await fetch(`/api/projects?id=${id}`, {
                method: 'PATCH',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(blogForm)
            })
        } else {
            req = await fetch("/api/projects", {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(blogForm)
            })
        }
        const response = await req.json();

        if (response?.data?.id) {
            router.push("/admin/projects");
        }
    }

    const uploadCoverImage = async (e: EventTarget) => {

        const file = e.target.files[0]

        const response = await fetch("/api/upload", {
            method: 'POST',
            headers: {
                'Content-type': file.type,
                'X-Vercel-Filename': file.name
            },
            body: file
        }).then((res) => res.json())

        setBlogForm({
            cover_url: response.url
        })
    }

    const onCancel = () => {
        router.back();
    }

    return (
        <>
            <div>
                <Label htmlFor="title" className="capitalize">{variant} Title</Label>
                <Input type="text"
                    placeholder="Title"
                    value={blogForm.title} onChange={(e) => {
                        setBlogForm({ title: e.target.value });
                    }}
                    className="mt-2" />
            </div>
            <div className="mt-5">
                <Label htmlFor="description" className="capitalize">{variant} Description</Label>
                <Textarea
                    placeholder="description"
                    value={blogForm.description} onChange={(e) => {
                        setBlogForm({ description: e.target.value });
                    }}
                    className="mt-2" />
            </div>
            <div className="mt-5">
                <Label htmlFor="picture" className="capitalize">{variant} Cover Image</Label>
                <div className="max-w-32">
                    {blogForm.cover_url && (
                        <img src={blogForm.cover_url} alt="cover_img" className="w-full h-auto rounded-lg" />)
                    }
                </div>
                <Input id="picture"
                    type="file" className="mt-2"
                    onChange={uploadCoverImage} />
            </div>
            <div className="mt-5">
                <Label htmlFor="content" className="capitalize">{variant} Content</Label>
                <Editor
                    editorProps={{}}
                    onDebouncedUpdate={updateContent}
                    defaultValue={blogForm.content}
                    className="border rounded pb-8 mt-2"
                    disableLocalStorage
                />
            </div>
            <div className="mt-5">
                <Label htmlFor="select" className="capitalize">{variant} Tags</Label>

                <Select
                    defaultValue={getDefaultValue(blogForm.tags)}
                    isMulti
                    name="tags"
                    options={blogTags}
                    onChange={(value: { name: string }) => {
                        const tags = value.map((v: { name: string }) => v?.name);
                        setBlogForm({ tags: tags })
                    }}
                    className="basic-multi-select mt-2"
                    classNamePrefix="select"
                />
            </div>
            <div className="mt-4 text-right">
                <Button onClick={onCancel} className="mr-5" variant={"secondary"}>Cancel</Button>
                <Button onClick={() => {
                    variant === 'blog' ? onSubmitBlog() : onSubmitProject()
                }}><CheckIcon className="mr-2" /> Save</Button>
            </div>
        </>
    )
}

export default BlogForm