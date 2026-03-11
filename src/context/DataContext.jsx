import { createContext, useContext, useState, useEffect } from 'react'
import * as XLSX from 'xlsx'

const DataContext = createContext(null)

export const DataProvider = ({ children }) => {

  const [listaFabricas, setListaFabricas] = useState([])
  const [fabricasData, setFabricasData] = useState({})

  useEffect(() => {
    carregarFabricas()
  }, [])

  async function carregarFabricas() {
    try {
      const response = await fetch(`${import.meta.env.BASE_URL}data/fabricas.json`)
      
      if (!response.ok) return
      const data = await response.json()
      console.log(data);
      setListaFabricas(data)
      console.log("Fabricas carregadas:", data)

    } catch (error) {
      console.log("Erro ao carregar fabricas:", error)
    }
  }

  return (
    <DataContext.Provider value={{ listaFabricas, setListaFabricas, fabricasData }}>
      {children}
    </DataContext.Provider>
  )
}

export const useData = () => useContext(DataContext)