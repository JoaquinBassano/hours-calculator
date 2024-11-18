export const transformEmployee = (data) => {
  return {
    id: data.ID,
    email: data.Email,
    name: data.Nombre,
    category: data['Categoría']
  }
}
