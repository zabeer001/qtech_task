import { BACKEND_URL } from "@/config";

// Fetch all services
export async function fetchServices(paginateCount = 9) {
  const res = await fetch(`${BACKEND_URL}api/services?paginate_count=${paginateCount}`);
  if (!res.ok) throw new Error("Failed to fetch services");
  return await res.json();
}

// Create a new service
// export async function createService(data: FormData) {
//   const res = await fetch(`${BACKEND_URL}api/services`, {
//     method: "POST",
//     body: data,
//   });
//   if (!res.ok) throw new Error("Failed to create service");
//   return await res.json();
// }

// Update a service
export async function updateService(id: number, data: FormData) {
  const res = await fetch(`${BACKEND_URL}api/services/${id}`, {
    method: "POST", // Or PUT if Laravel supports it
    body: data,
  });
  if (!res.ok) throw new Error("Failed to update service");
  return await res.json();
}

// Delete a service
export async function deleteService(id: number) {
  const res = await fetch(`${BACKEND_URL}api/services/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete service");
  return await res.json();
}
