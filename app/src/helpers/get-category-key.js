export const getCategoryKeyByName = (employeeCategories, name) => {
  const categoryKey = Object.keys(employeeCategories).find(
    (key) => employeeCategories[key].name === name
  )

  return categoryKey || null
}
