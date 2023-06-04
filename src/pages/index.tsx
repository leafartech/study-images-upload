import axios from "axios"
import { GetServerSideProps } from "next"
import { useState } from "react"
import fs from 'fs/promises'
import path from "path"
import Link from "next/link"

interface Props {
    dirs: string[]
}

export default function Home({dirs}:Props) {
    const [ uploading, setUploading ] = useState(false)
    const [ selectedImage, setSelectedImage] = useState("")
    const [ selectedFile, setSelectedFile] = useState<File>()

    async function handleUpload() {
        setUploading(true)
        try {
            if (!selectedFile) return
            
            const formData = new FormData()
            formData.append("myImage", selectedFile)
            const { data } = await axios.post("/api/image", formData)
            console.log(data)
        } catch(e: any) {
            console.log(e.response?.data)
        }
        setUploading(false)
    }

    return (
        <div className="flex justify-center items-center bg-gray-900">
            <div className="bg-gray-100 rounded-md px-10 py-14 space-y-6 mt-60 flex justify-center items-center flex-col">
                <h1 className="text-center text-gray-900 text-2xl font-semibold">Upload de imagens</h1>
                <form className="flex flex-col gap-5 justify-center items-center" onSubmit={handleUpload}>
                    <label>
                        <input 
                            type="file" 
                            hidden
                            onChange={({ target }) => {
                                if (target.files) {
                                    const file = target.files[0]
                                    setSelectedImage(URL.createObjectURL(file))
                                    setSelectedFile(file)
                                }
                            }}
                        />
                        <div className="w-40 aspect-video rounded flex items-center justify-center border-2 border-gray-300 border-dashed cursor-pointer">
                            {selectedImage ? (
                                <img src={selectedImage} alt="Selected Image" />
                            ): (
                                <span className="text-gray-500">Foto</span>
                            )}
                        </div>
                    </label>
                    <button
                        type="submit"
                        disabled={uploading}
                        style={{ opacity: uploading ? ".5" : 1 }}
                        className={"bg-blue-600 p-3 w-32 text-center rounded text-white"}
                    >
                        {uploading ? "Enviado..." : "Enviado"}
                    </button>
                    <div className="flex flex-col space-y-3">
                        {dirs.map((item) => (
                            <Link key={item} href={"/images/" + item}>
                                <span className="text-blue-500 hover:underline">{item}</span>
                            </Link>
                        ))}
                    </div>
                </form>
            </div>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async () => {
    const props = { dirs: [] }
    try {
        const dirs = await fs.readdir(path.join(process.cwd()) + "/public/images")

        props.dirs = dirs as any
        return { props }
    }catch(e) {
        return { props }
    }
}
