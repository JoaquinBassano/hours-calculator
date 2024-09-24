export const transformEmployee = (data) => {
  return {
    email: data['Email'],
    name: data['Nombre'],
    category: data['Categoría']
  }
}
