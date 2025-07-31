"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"
import React from "react"
import { toast } from "sonner"
import { BACKEND_URL } from "@/config"
import { fetchServices } from "@/api/services"

interface Service {
  id: number | string
  name: string
  description: string
  price: number
  image?: string
}

interface EditServiceDialogProps {
  service: Service | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface UpdateServiceResponse {
  success: boolean
  message?: string
}

export function EditServiceDialog({ service, open, onOpenChange }: EditServiceDialogProps) {
  const [editableService, setEditableService] = React.useState<Service | null>(service)
  const [selectedImage, setSelectedImage] = React.useState<File | null>(null)
  const [imagePreview, setImagePreview] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    setEditableService(service)
    setSelectedImage(null)
    setImagePreview(service?.image ? `${BACKEND_URL}${service.image}` : null)
  }, [service])

  if (!editableService) return null

  function handleChange(field: keyof Service, value: string) {
    setEditableService((prev: Service | null) => {
      if (!prev) return null
      return {
        ...prev,
        [field]: field === "price" ? Number.parseFloat(value) || 0 : value,
      }
    })
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null
    setSelectedImage(file)
    if (file) {
      setImagePreview(URL.createObjectURL(file))
    } else {
      setImagePreview(service?.image ? `${BACKEND_URL}${service.image}` : null)
    }
  }

  async function updateService(formData: FormData, serviceId: number | string): Promise<UpdateServiceResponse> {
    try {
      const token = localStorage.getItem("token")
      const headers: Record<string, string> = {}
      if (token) {
        headers["Authorization"] = `Bearer ${token}`
      }

      // Log all FormData key-values to console
      console.log("Sending form data payload:")
      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`${key}: File { name: ${value.name}, size: ${value.size}, type: ${value.type} }`)
        } else {
          console.log(`${key}: ${value}`)
        }
      }

      const res = await fetch(`${BACKEND_URL}api/services/${serviceId}?_method=put`, {
        method: "POST", // backend expects POST + _method=put
        headers,
        body: formData,
      })

      if (!res.ok) {
        const text = await res.text()
        console.error("Update service failed response text:", text)
        throw new Error(`Failed to update service, status: ${res.status}`)
      }

      return await res.json()
    } catch (error) {
      console.error("Update service error:", error)
      throw error
    }
  }

  async function handleSave() {
    if (!editableService) return
    setLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("name", editableService.name)
      formData.append("description", editableService.description)
      formData.append("price", editableService.price.toString())
      // For method override, if backend uses Laravel style
      formData.append("_method", "PUT")

      if (selectedImage) {
        formData.append("image", selectedImage)
      }

      // Log formData content for debugging
      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(key, value.name, value.size, value.type)
        } else {
          console.log(key, value)
        }
      }

      const response = await updateService(formData, editableService.id)
      console.log("Service Updated:", response)

      if (response.success) {
        toast.success(response.message || "Service updated successfully!")
        await fetchServices()
        onOpenChange(false)
      } else {
        toast.error(response.message || "Failed to update service")
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Something went wrong"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Service</DialogTitle>
          <DialogDescription>Update service details below.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            value={editableService.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Service Name"
          />
          <Textarea
            value={editableService.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Description"
          />
          <Input
            type="number"
            value={editableService.price}
            onChange={(e) => handleChange("price", e.target.value)}
            placeholder="Price"
          />
          {/* Image Upload */}
          <div>
            <Input type="file" accept="image/*" onChange={handleImageChange} />
            {imagePreview && (
              <div className="mt-2">
                <Image
                  src={imagePreview || "/placeholder.svg"}
                  alt="Service preview"
                  width={96}
                  height={96}
                  className="rounded object-cover border"
                />
              </div>
            )}
          </div>
          {error && <p className="text-red-600 mt-2">{error}</p>}
        </div>
        <DialogFooter>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
