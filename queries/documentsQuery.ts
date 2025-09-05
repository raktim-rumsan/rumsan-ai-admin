import { useMutation, useQuery } from "@tanstack/react-query"

export function useDocUploadMutation(onSuccess?: () => void) {
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData()
      formData.append("file", file)
      const tenantId = localStorage.getItem("tenantId");
      const access_token = document.cookie
        .split('; ')
        .find(row => row.startsWith('sb-127-auth-token='))
        ?.split('=')[1]
        console.log(access_token,tenantId,"access_token")
      const serverApi = process.env.NEXT_PUBLIC_SERVER_API ?? "";
      const res = await fetch(`${serverApi.replace(/\/$/, "")}/api/v1/docs/upload`, {
        method: "POST",
        body: formData,
        headers: {
          "X-Tenant-Id": tenantId || "",
          "access_token": access_token || "",
        },  
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "File upload failed")
      return data
    },
    onSuccess,
  })
}

export function useDocsQuery() {
  return useQuery({
    queryKey: ["documents"],
    queryFn: async () => {
      const tenantId = localStorage.getItem("tenantId")
      const access_token = document.cookie
        .split('; ')
        .find(row => row.startsWith('sb-127-auth-token='))
        ?.split('=')[1]
      const serverApi = process.env.NEXT_PUBLIC_SERVER_API ?? "";
      const res = await fetch(`${serverApi.replace(/\/$/, "")}/api/v1/docs`, {
        method: "GET",
        headers: {
          "X-Tenant-Id": tenantId || "",
          "access_token": access_token || "",
          accept: "application/json",
        },
      })
      const data = await res.json()
      console.log(data,tenantId,"access_token")
      if (!res.ok) throw new Error(data.error || "Failed to fetch documents")
      return data
    },
  })
}

export function useDocDeleteMutation(onSuccess?: () => void) {
  return useMutation({
    mutationFn: async (id: string) => {
      const tenantId = localStorage.getItem("tenantId");
     const access_token = document.cookie
        .split('; ')
        .find(row => row.startsWith('sb-127-auth-token='))
        ?.split('=')[1]
      const serverApi = process.env.NEXT_PUBLIC_SERVER_API ?? "";
      const res = await fetch(`${serverApi.replace(/\/$/, "")}/api/v1/docs/${id}`, {
        method: "DELETE",
        headers: {
          "X-Tenant-Id": tenantId || "",
          "access_token": access_token || "",
        },  
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "File delete failed")
      return data
    },
    onSuccess,
  })
}

